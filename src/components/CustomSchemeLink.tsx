import { addNativeLinkingFailedHandler, removeNativeLinkingFailedHandler } from "@/utils/schemeFallback"
import { type ComponentProps, useEffect } from "react"


export const CustomSchemeLink = ({ onOpenFail, ...anchorProps }: ComponentProps<'a'> & { onOpenFail: () => void }) => {

  useEffect(() => {
    const url = anchorProps.href
    if (!url) return

    addNativeLinkingFailedHandler(url, () => onOpenFail())

    return () => removeNativeLinkingFailedHandler(url)
  }, [])

  return (
    <a
      {...anchorProps}
      href={anchorProps.href}
    />
  )
}