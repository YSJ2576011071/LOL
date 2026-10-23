export default function ProgressBar({ current, total, answered }) {
  const percent = Math.round((answered / total) * 100)

  return (
    <div>
      <div className="flex items-end justify-between text-xs">
        <span className="font-display tracking-[0.3em] text-hex-400">
          QUESTION {String(current + 1).padStart(2, '0')}
          <span className="text-gold-100/30"> / {String(total).padStart(2, '0')}</span>
        </span>
        <span className="font-bold text-gold-300">{percent}%</span>
      </div>

      <div
        className="relative mt-3 h-2 overflow-hidden rounded-full bg-void-700"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answered}
        aria-label="설문 진행률"
      >
        <div
          className="h-full rounded-full bg-linear-to-r from-hex-600 via-hex-400 to-gold-300 transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
        <div
          className="absolute inset-0 animate-shine bg-[linear-gradient(110deg,transparent_30%,rgb(255_255_255/0.18)_50%,transparent_70%)] bg-size-[200%_100%]"
          aria-hidden="true"
        />
      </div>

      <div className="mt-2 flex gap-1" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i === current ? 'bg-gold-300' : i < answered ? 'bg-hex-600/70' : 'bg-white/8'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
