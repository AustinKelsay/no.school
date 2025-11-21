interface WebLNSendPaymentResponse {
  preimage?: string
}

interface WebLNProvider {
  enable?: () => Promise<void>
  sendPayment?: (invoice: string) => Promise<WebLNSendPaymentResponse | void>
}

declare global {
  interface Window {
    webln?: WebLNProvider
  }
}

export {}
