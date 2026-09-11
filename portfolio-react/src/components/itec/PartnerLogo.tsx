import { useState } from 'react'

interface Props {
  src: string
  alt: string
  fallback: string
  className: string
}

/** Shows the image; falls back to a letter badge if the asset is missing (e.g. not yet uploaded to o2switch). */
export function PartnerLogo({ src, alt, fallback, className }: Props) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={className}>
      {!failed && (
        <img
          src={src}
          alt={alt}
          className="itec-partner-logo-img"
          onError={() => setFailed(true)}
        />
      )}
      {failed && <span className="itec-partner-fallback itec-partner-fallback--visible">{fallback}</span>}
    </div>
  )
}
