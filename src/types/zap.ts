export interface LightningRecipient {
  /** Lightning Address in user@domain.tld format */
  lightningAddress?: string
  /** Raw LNURL string (bech32 or https) */
  lnurl?: string
  /** Recipient Nostr pubkey (hex) */
  pubkey?: string
  /** Friendly display name for UI copy */
  name?: string
  /** Optional relay hints for zap receipts */
  relayHints?: string[]
}

export interface ZapSendResult {
  invoice: string
  paid: boolean
  paymentPreimage?: string
}
