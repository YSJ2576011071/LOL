const STEPS = ['티어 선택', '성향 분석', '원챔 & 공략']

export default function Header({ step, maxStep, onNavigate }) {
  return (
    <header className="sticky top-0 z-30 border-b border-gold-400/10 bg-void-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => onNavigate(1)}
          className="flex shrink-0 cursor-pointer items-center gap-2"
          aria-label="처음으로"
        >
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-7" />
          <span className="font-display text-sm font-extrabold tracking-[0.18em] text-gold-gradient sm:text-base">
            ONE TRICK
          </span>
          <span className="hidden text-xs text-gold-100/45 md:inline">원챔 연구소</span>
        </button>

        <ol className="flex items-center gap-1 sm:gap-2" aria-label="진행 단계">
          {STEPS.map((label, i) => {
            const n = i + 1
            const current = n === step
            const done = n < step
            const enabled = n <= maxStep && !current
            return (
              <li key={label} className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  disabled={!enabled}
                  onClick={() => onNavigate(n)}
                  aria-current={current ? 'step' : undefined}
                  className={`flex items-center gap-2 rounded-full px-2 py-1 text-xs transition sm:px-3 ${
                    current
                      ? 'bg-hex-400/10 text-hex-200'
                      : enabled
                        ? 'cursor-pointer text-gold-100/70 hover:text-gold-100'
                        : 'text-gold-100/30'
                  }`}
                >
                  <span
                    className={`grid size-6 place-items-center rounded-full border font-display text-[11px] font-bold ${
                      current
                        ? 'border-hex-400 bg-hex-400 text-void-950'
                        : done
                          ? 'border-gold-400 text-gold-400'
                          : 'border-white/15'
                    }`}
                  >
                    {done ? '✓' : n}
                  </span>
                  <span className={current ? 'inline' : 'hidden sm:inline'}>{label}</span>
                </button>
                {n < STEPS.length && <span className="h-px w-3 bg-white/15 sm:w-6" aria-hidden="true" />}
              </li>
            )
          })}
        </ol>
      </div>
    </header>
  )
}
