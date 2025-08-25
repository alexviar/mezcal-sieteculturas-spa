'use client'

export type Command<T = string, P = unknown> = {
  type: T
  payload?: P
}

declare global {
  interface Window {
    receiveNativeCommand?: (command: Command) => void;
    addNativeCommandHandler?: <T = string, P = unknown>(handler: (command: Command<T, P>) => void) => (() => void);
    removeNativeCommandHandler?: <T = string, P = unknown>(handler: (command: Command<T, P>) => void) => void;
    ReactNativeWebView?: {
      postMessage(message: string): void
    }
  }
}

if (typeof window !== 'undefined' && window.ReactNativeWebView) {
  (function () {
    let handlers: Array<(command: Command<any, any>) => void> = []
    window.receiveNativeCommand = (command) => {
      handlers.forEach((handler) => handler(command))
    };

    window.addNativeCommandHandler = (handler) => {
      handlers.push(handler)
      return () => window.removeNativeCommandHandler!(handler)
    }

    window.removeNativeCommandHandler = (handler) => {
      handlers = handlers.filter(h => h != handler)
    }
  })()
}