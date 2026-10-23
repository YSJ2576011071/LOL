import { useState } from 'react'

// Data Dragon 이미지 로드 실패 시 그라데이션 플레이스홀더로 대체
export default function ChampionImage({ src, alt = '', className = '', loading = 'lazy' }) {
  const [failedSrc, setFailedSrc] = useState(null)

  if (failedSrc === src) {
    return <div className={`bg-linear-to-br from-void-600 via-void-800 to-void-950 ${className}`} aria-hidden="true" />
  }
  return <img src={src} alt={alt} loading={loading} className={className} onError={() => setFailedSrc(src)} />
}
