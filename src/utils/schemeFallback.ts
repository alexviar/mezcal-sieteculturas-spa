import { type Command } from "@/utils/nativeBridge"

type NativeLinkingFailed = Command<'native_linking_failed', { url: string }>

const unregisterFunctions = new Map<string, () => void>()

export function addNativeLinkingFailedHandler(originalUrl: string, handler: () => void): void {
  if (typeof window === 'undefined' || !window.ReactNativeWebView) {
    return
  }

  removeNativeLinkingFailedHandler(originalUrl)

  const unregister = window.addNativeCommandHandler!((command: NativeLinkingFailed) => {
    if (command.type === 'native_linking_failed' && command.payload?.url === originalUrl) {
      handler()
    }
  })
  unregisterFunctions.set(originalUrl, unregister)
}

export const removeNativeLinkingFailedHandler = (originalUrl: string) => {
  if (typeof window === 'undefined' || !window.ReactNativeWebView) {
    return
  }

  const unregister = unregisterFunctions.get(originalUrl)
  if (unregister) {
    unregister()
    unregisterFunctions.delete(originalUrl)
  }
}