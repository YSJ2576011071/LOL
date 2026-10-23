import ChampionImage from './ChampionImage'
import { championImage } from '../lib/recommend'

export default function ChampionHero({ pick, meta, isTop }) {
  const { champion, match } = pick

  return (
    <article className="panel animate-fade-up overflow-hidden">
      <div className="relative h-80 sm:h-[26rem]">
        <ChampionImage
          src={championImage(meta.images.splash, champion.id)}
          alt={`${champion.name} 스플래시 아트`}
          loading="eager"
          className="absolute inset-0 size-full object-cover object-[center_25%]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-void-950 via-void-950/45 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-void-950/75 via-transparent to-transparent" />

        <span className="absolute top-4 left-4 rounded-full border border-gold-400/50 bg-void-950/70 px-3 py-1 text-xs font-bold tracking-wider text-gold-300 backdrop-blur">
          {isTop ? '★ 당신의 원챔' : '대안 원챔'}
        </span>
        <MatchRing value={match} className="absolute top-4 right-4" />

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.3em] text-hex-400 sm:text-sm">{champion.title}</p>
          <h2 className="mt-1 text-5xl font-black tracking-tight text-gold-gradient drop-shadow-lg sm:text-7xl">
            {champion.name}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-gold-100/85 sm:text-base">{champion.pitch}</p>
        </div>
      </div>

      <dl className="grid grid-cols-3 divide-x divide-white/5 border-t border-gold-400/10">
        <Stat label="포지션">
          {champion.positions.map((p) => meta.positions[p]).join(' · ')}
        </Stat>
        <Stat label="난이도">
          <span className="flex items-center justify-center gap-1" aria-label={meta.difficultyLabels[champion.difficulty]}>
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={`size-2.5 rotate-45 ${n <= champion.difficulty ? 'bg-gold-400' : 'bg-white/10'}`}
              />
            ))}
            <span className="ml-1.5">{meta.difficultyLabels[champion.difficulty]}</span>
          </span>
        </Stat>
        <Stat label="역할군">{champion.tags.join(' · ')}</Stat>
      </dl>
    </article>
  )
}

function Stat({ label, children }) {
  return (
    <div className="px-2 py-4 text-center sm:py-5">
      <dt className="text-[11px] tracking-widest text-gold-100/40">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-gold-100 sm:text-base">{children}</dd>
    </div>
  )
}

function MatchRing({ value, className = '' }) {
  const r = 30
  const c = 2 * Math.PI * r
  return (
    <div className={`grid place-items-center rounded-full bg-void-950/70 p-1 backdrop-blur ${className}`}>
      <svg viewBox="0 0 72 72" className="size-20 -rotate-90 sm:size-24" aria-hidden="true">
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="5" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="url(#match-ring)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="match-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0ac8b9" />
            <stop offset="100%" stopColor="#e4cf96" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center" aria-label={`싱크로율 ${value}%`}>
        <div className="text-[9px] tracking-widest text-gold-100/60 sm:text-[10px]">싱크로율</div>
        <div className="font-display text-lg leading-none font-extrabold text-gold-100 sm:text-xl">{value}%</div>
      </div>
    </div>
  )
}
