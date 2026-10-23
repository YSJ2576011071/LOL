import TierEmblem from './TierEmblem'

export default function TierSelect({ tiers, selectedId, onSelect, onConfirm, resumable }) {
  const selected = tiers.find((t) => t.id === selectedId)

  return (
    <section className="animate-fade-up">
      <div className="text-center">
        <p className="font-display text-xs tracking-[0.4em] text-hex-400">STEP 01</p>
        <h1 className="mt-3 text-3xl font-black text-gold-gradient sm:text-5xl">현재 당신의 티어는?</h1>
        <p className="mt-4 text-sm text-gold-100/60 sm:text-base">
          티어에 따라 추천 챔피언의 난이도 보정과 승급 공략이 달라집니다.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-5" role="radiogroup" aria-label="티어 선택">
        {tiers.map((tier, i) => {
          const active = tier.id === selectedId
          return (
            <button
              key={tier.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(tier.id)}
              style={{ '--tier': tier.gradient[1], animationDelay: `${i * 35}ms` }}
              className={`group flex animate-fade-up cursor-pointer flex-col items-center rounded-xl border px-3 py-5 transition duration-200 ${
                active
                  ? 'border-(--tier) bg-white/[0.05] shadow-[0_0_32px_-10px_var(--tier)]'
                  : 'border-white/8 bg-void-900/60 hover:-translate-y-0.5 hover:border-white/25'
              }`}
            >
              <TierEmblem
                tier={tier}
                size={64}
                className={`transition duration-300 ${active ? 'scale-110' : 'opacity-75 group-hover:opacity-100'}`}
              />
              <span className={`mt-3 font-bold ${active ? 'text-gold-100' : 'text-gold-100/80'}`}>{tier.name}</span>
              <span className="font-display text-[10px] tracking-[0.2em] text-gold-100/40">{tier.en}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-8 min-h-40">
        {selected ? (
          <div
            key={selected.id}
            className="panel flex animate-fade-up flex-col items-center gap-6 p-6 sm:flex-row sm:p-8"
          >
            <TierEmblem tier={selected} size={88} className="shrink-0" />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-lg font-bold">
                <span style={{ color: selected.gradient[1] }}>{selected.name}</span> 소환사님,
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gold-100/70">{selected.summary}</p>
            </div>
            <button type="button" className="btn-primary w-full shrink-0 sm:w-auto" onClick={onConfirm}>
              {resumable ? '결과 다시 보기' : '성향 테스트 시작'}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : (
          <p className="pt-6 text-center text-sm text-gold-100/40">티어를 선택하면 다음 단계로 진행할 수 있어요.</p>
        )}
      </div>
    </section>
  )
}
