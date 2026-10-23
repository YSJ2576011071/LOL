const toPercent = (v = 0) => ((Math.max(-2, Math.min(2, v)) + 2) / 4) * 100

export default function TraitCompare({ axes, vector, traits, championName }) {
  return (
    <div>
      <ul className="space-y-5">
        {axes.map((axis) => {
          const you = toPercent(vector[axis.key])
          const champ = toPercent(traits[axis.key])
          const leansPositive = (vector[axis.key] ?? 0) >= 0
          return (
            <li key={axis.key}>
              <div className="flex items-center justify-between text-xs">
                <span className={leansPositive ? 'text-gold-100/40' : 'font-bold text-gold-300'}>
                  {axis.negative.name}
                </span>
                <span className="text-[11px] tracking-widest text-gold-100/35">{axis.label}</span>
                <span className={leansPositive ? 'font-bold text-gold-300' : 'text-gold-100/40'}>
                  {axis.positive.name}
                </span>
              </div>
              <div className="relative mt-2 h-2 rounded-full bg-void-700">
                <span className="absolute top-1/2 left-1/2 h-3 w-px -translate-y-1/2 bg-white/20" aria-hidden="true" />
                <span
                  className="absolute inset-y-0 rounded-full bg-linear-to-r from-gold-600/60 to-gold-300/80"
                  style={{ left: `${Math.min(50, you)}%`, width: `${Math.abs(you - 50)}%` }}
                  aria-hidden="true"
                />
                <span
                  className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-void-950 bg-hex-400"
                  style={{ left: `${champ}%` }}
                  title={`${championName} 성향`}
                />
                <span
                  className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-void-950 bg-gold-300 shadow-[0_0_10px_rgb(228_207_150/0.7)]"
                  style={{ left: `${you}%` }}
                  title="나의 성향"
                />
              </div>
            </li>
          )
        })}
      </ul>
      <div className="mt-5 flex justify-center gap-5 text-xs text-gold-100/50">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-gold-300" /> 나
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rotate-45 bg-hex-400" /> {championName}
        </span>
      </div>
    </div>
  )
}
