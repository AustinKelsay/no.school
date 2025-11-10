# Auth & Account Linking Upgrade Plan

Author: Codex  
Date: 2025-11-10

## 1. Objectives

- **Automatic hierarchy enforcement:** Upgrades between anonymous → OAuth-first → Nostr-first should happen immediately when the qualifying provider is linked, without requiring manual “make primary” actions.
- **Key custody truth:** When an OAuth/anonymous user links a real Nostr identity (NIP-07), we must replace the stored platform keypair with the user-controlled pubkey and erase the server-side `privkey`.
- **Signing-mode clarity:** Signing flows should default to server-side signing whenever the account has a stored `privkey`. Only Nostr-first accounts (no `privkey`) rely on NIP-07.
- **Anonymous UX:** Anonymous accounts never require a NIP-07 extension until they intentionally link a real Nostr provider.

## 2. Workstreams & Task Breakdown

### 2.1 Automatic Upgrade / Downgrade Logic

| Trigger | Expected Result |
|--------|-----------------|
| Anonymous signup (generated keys) | `primaryProvider = 'anonymous'`, `profileSource = 'nostr'` (already true). |
| Anonymous links Email/GitHub | Immediately switch to OAuth-first: `primaryProvider` becomes that OAuth provider, `profileSource = 'oauth'`. Keep generated keypair. |
| Anonymous links NIP-07 | Promote to Nostr-first: replace pubkey with linked pubkey, null `privkey`, drop anonymous account entry (or leave for history), `primaryProvider = 'nostr'`, `profileSource = 'nostr'`. |
| OAuth-first links NIP-07 | Promote to Nostr-first: update `primaryProvider/profileSource`, swap stored pubkey & privkey, disable future server-side signing. |
| OAuth-first links another OAuth | Primary stays whichever came first unless user changes manually (no auto change). |
| Nostr-first links OAuth after upgrade | Remain Nostr-first; OAuth accounts behave as recovery/secondary. |

Implementation tasks:
- Extend `linkAccount` to inspect `user.primaryProvider`, the new `provider`, and apply the above transition table immediately after creating the account.
- Ensure `profileSource` mirrors `primaryProvider` for all auto transitions.
- Update `/api/account/link` success response to include updated state so the client can refresh without a separate fetch (optional but helpful).

### 2.2 Key Migration & Storage Rules

Requirements:
1. When linking `provider === 'nostr'`, always use the supplied pubkey (`providerAccountId`) as the canonical `User.pubkey`.
2. If the user previously had a stored `privkey`, set it to `null`.
3. If the linking provider is anonymous (server-generated) and user lacked keys, keep current behavior (generate + persist).

Implementation steps:
- In `linkAccount`, branch for `provider === 'nostr'`: update `User.pubkey` to `providerAccountId`, `User.privkey = null`, and (if applicable) delete/flag any anonymous accounts referencing the old pubkey.
- Add a helper `promoteToNostrFirst(userId, pubkey)` encapsulating the update + logging.
- Add a post-linking hook for OAuth-first promotions to copy metadata (avatar/name) only if `profileSource` switches to `nostr`.

### 2.3 Signing Mode Detection

Rule: *If `User.privkey` exists → server-side signing allowed. Otherwise require NIP-07.*

Changes:
- Introduce `hasServerSideKey(user)` utility (e.g., `Boolean(user.privkey)`).
- Update `isNip07User` usage across:
  - `src/lib/publish-service.ts`
  - `src/lib/republish-service.ts`
  - `src/hooks/usePublishDraft.ts`
  - any other places gating UI flows.
- Instead of inferring from `session.provider`, base the decision on `session.user.privkey` (for client) or DB check (for server). If `privkey` absent ⇒ prompt for NIP-07.
- Ensure `session.user.privkey` is cleared when users become Nostr-first so the UI automatically flips to the NIP-07 path.

### 2.4 Anonymous Provider Classification

- Update `isNip07User` to return `true` **only** for `provider === 'nostr'`.
- Audit code paths that assumed anonymous == NIP-07 (publish hooks, UI). Ensure anonymous accounts surface the stored key for signing (already exposed on profile) and skip extension requirements.
- Confirm the sign-in page messaging doesn’t imply anonymous users need extensions.

### 2.5 Data Migration & Backfill

We need a one-time script or migration to clean existing records:
- Find users where `profileSource='nostr'` but `privkey` is still set; null those privkeys.
- Detect OAuth-first users who have `nostr` accounts linked but `primaryProvider` still OAuth—decide whether to auto-upgrade or log for manual review (depends on whether Nostr linking already happened historically).
- Remove stale anonymous records when a user already linked NIP-07 (optional, but prevents confusion in UI).
- Backfill `profileSource` for users with missing values using `primaryProvider`.

Implementation options:
- Write a Prisma script under `scripts/` (e.g., `scripts/migrate-auth-state.ts`) and document how to run it.
- Record migration steps in README or docs.

### 2.6 API & UI Adjustments

- `/api/account/linked` response should reflect updated `primaryProvider/profileSource` immediately after linking.
- Linked accounts UI: after linking, emphasize new primary source (maybe toast).
- Profile display components already react to `session.user.privkey`; ensure session refresh occurs after transitions (call `updateSession()` post-link).
- Consider adding explanatory copy describing automatic upgrades.

### 2.7 Testing & Verification

Manual checklist (per environment):
1. **Anonymous → OAuth upgrade**: sign up anon, link email, ensure profile switches to OAuth-first and `privkey` remains stored.
2. **Anonymous → Nostr upgrade**: sign up anon, link NIP-07, confirm:
   - `primaryProvider='nostr'`
   - `privkey` null
   - future publishing requires NIP-07.
3. **OAuth → Nostr upgrade**: sign in via GitHub, link NIP-07, verify server-side keys removed and signing uses extension.
4. **Nostr-first + OAuth login**: Link GitHub, log out/in using GitHub, ensure publishing still routes through NIP-07 since `privkey` absent.
5. **Anon publishing without extension**: ensure resource publish succeeds (server-side signing).
6. **Migration script dry-run**: run against staging DB, inspect logs before applying in production.

Document outcomes in PR checklist.

## 3. Open Considerations

- How aggressively should we prune old anonymous Account rows once a user upgrades? (Keeping them may aid analytics; deleting reduces clutter. Decide before implementation.)
- Do we need admin tooling to flip `primaryProvider/profileSource` manually in edge cases after automation? (Possibly leverage existing `/api/account/preferences`.)

## 4. Next Steps

1. Implement `linkAccount` upgrade logic + helper utilities.
2. Update signing detection helpers and publishing flows.
3. Modify `isNip07User` + dependent code.
4. Build migration script and document rollout.
5. QA using the checklist above.
6. Update docs/README with the clarified behavior once implemented.

Once this plan is approved, we can create subtasks or PRs per workstream.
