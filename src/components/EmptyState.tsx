import { StaticImport } from "next/dist/shared/lib/get-img-props"
import Image from "next/image"

type EmptyStateProps = {
  imageSrc: string | StaticImport
  imageAlt: string
  title: string
  message: string
}

export const EmptyState = ({
  imageSrc,
  imageAlt,
  title,
  message
}: EmptyStateProps) => {
  return (
    <div className="w-100 p-5 text-center d-flex flex-column align-items-center">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={150}
        height={150}
        className="mb-4"
      />
      <p className="fs-5 fw-bold">{title}</p>
      <p className="text-body-secondary">{message}</p>
    </div>
  )
}