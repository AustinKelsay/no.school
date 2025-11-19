# Zap Flow Reference

## Inputs & Dependencies
- **Component entrypoint**: `src/components/ui/interaction-metrics.tsx` renders the Zap dialog inline inside metrics row.
- **Core hook**: `useZapSender` (`src/hooks/useZapSender.ts`) handles LNURL resolution, zap request signing, invoice fetching, WebLN attempts, and status transitions.
- **Upstream data**: `useInteractions` supplies `zapInsights`, `recentZaps`, `hasZappedWithLightning`, and `viewerZapTotalSats`.
- **Props required to enable zaps**: `eventId`, `eventKind`, `eventIdentifier`, `eventPubkey`, and `zapTarget` (Lightning recipient hints).

## User-Facing Behaviors (must remain functional)
1. **Amount selection**
   - Quick buttons for 21/100/500/1000/2100 sats with ability to override via numeric custom input (>=1 sat).
   - LNURL-provided `minSendable`/`maxSendable` enforced with inline error + toast.
2. **Note entry**
   - Optional textarea capped at 140 chars; LNURL `commentAllowed` bytes enforced using `getByteLength` + `truncateToByteLength`.
3. **Zap send pipeline**
   - Validates session (must be authenticated, Nostr-capable).
   - Resolves lightning address / LNURL from `zapTarget` or fetched profile (cached per pubkey).
   - `zapState.status` transitions: `idle → resolving → signing → requesting-invoice → invoice-ready → paying → success|error` with message map shown in UI.
   - Zap request signed either server-side (stored privkey) or via NIP-07 extension; `zapTarget.relayHints` merged with configured relays.
   - LNURL callback invoked with encoded zap request; verifies invoice description hash matches request when present.
   - Attempts WebLN payment automatically, exposes retry + error string, but always surfaces invoice for manual payment.
4. **Invoice handling**
   - Show bolt11 string, allow copy-to-clipboard with toast, and `lightning:` deep link button.
5. **Status + toast coverage**
   - Toasts for success/invoice-ready, min/max violations, clipboard errors, reaction gating, WebLN retry results, etc.
6. **Analytics + context**
   - Display aggregated stats (total sats, supporters, avg zap, last zap age) and viewer summary (paid? amount tipped?).
   - Preview up to five `recentZaps` with sats, sender pubkey snippet, note, and relative timestamp.
7. **Cleanup**
   - Closing dialog resets local form state and zap hook state to `idle` while preserving parent metrics.

## Non-Goals For Current Refactor
- Do not alter `useZapSender` networking logic, LNURL cache strategy, or `useInteractions` subscription behavior.
- Keep ZapThreads widget untouched; this work only affects the modal flow triggered from interaction metrics.

Use this document as the parity checklist after restructuring the modal.
