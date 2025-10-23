export const appName = process.env.NEXT_PUBLIC_COMPANY_NAME
export const companyAddress = process.env.NEXT_PUBLIC_ADDRESS
export const companyEmail = process.env.NEXT_PUBLIC_EMAIL
export const companyWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP
export const companyFacebook = process.env.NEXT_PUBLIC_FACEBOOK
export const companyInstagram = process.env.NEXT_PUBLIC_INSTAGRAM
export const aboutUs = process.env.NEXT_PUBLIC_ABOUT_US

export const isWebView = typeof window !== 'undefined' && window.ReactNativeWebView

export const bankAccountHolderName =
  process.env.NEXT_PUBLIC_BANK_ACCOUNT_HOLDER_NAME ?? ''
export const bankAccountClabe =
  process.env.NEXT_PUBLIC_BANK_ACCOUNT_CLABE ?? ''
export const bankName = process.env.NEXT_PUBLIC_BANK_NAME ?? ''


