import { useState } from 'react'
import TierEmblem from './TierEmblem'

export default function TierGuide({ tier, nextTier, bracket, champion }) {
  const [checked, setChecked] = useState({})
  const doneCount = bracket.routine.filter((_, i) => checked[i]).length
  const tips = champion.tierTips[tier.bracket] ?? []

  return (
    <section className="panel animate-fade-up overflow-hidden" aria-labelledby="tier-guide-title">
      {/* 헤더: 현재 티어 → 다음 티어 */}
      <div
        className="relative border-b border-white/5 p-6 sm:p-8"
        style={{ background: `radial-gradient(ellipse 70% 120% at 0% 0%, ${tier.gradient[0]}40, transparent 70%)` }}
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="flex shrink-0 items-center gap-3">
            <TierEmblem tier={tier} size={72} />
            {nextTier && (
              <>
                <span className="font-display text-2xl text-gold-400/70" aria-hidden="true">
                  »
                </span>
                <TierEmblem tier={nextTier} size={72} className="animate-pulse" />
              </>
            )}
          </div>
          <div className="text-center sm:text-left">
            <p className="font-display text-xs tracking-[0.35em] text-hex-400">PROMOTION ROADMAP</p>
            <h3 id="tier-guide-title" className="mt-2 text-2xl font-black sm:text-3xl">
              {nextTier ? (
                <>
                  <span style={{ color: tier.gradient[1] }}>{tier.name}</span> →{' '}
                  <span style={{ color: nextTier.gradient[1] }}>{nextTier.name}</span> 승급 공략
                </>
              ) : (
                <>
                  <span style={{ color: tier.gradient[1] }}>{tier.name}</span> 정상 수성 전략
                </>
              )}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gold-100/70">{tier.summary}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6 sm:p-8">
        {/* 목표 지표 */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="목표 분당 CS" value={tier.csTarget.toFixed(1)} unit="개" />
          <Metric label={nextTier ? '승급 체크포인트' : '시즌 목표'} value={tier.goal} small />
          <Metric label="공략 구간" value={bracket.label} small />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <SectionTitle>핵심 과제</SectionTitle>
            <ol className="mt-3 space-y-2.5">
              {tier.focus.map((item, i) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed">
                  <span className="grid size-6 shrink-0 place-items-center rounded bg-hex-400/15 font-display text-xs font-bold text-hex-400">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionTitle>이 구간에서 흔한 실수</SectionTitle>
            <ul className="mt-3 space-y-2.5">
              {tier.mistakes.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-gold-100/85">
                  <span className="grid size-6 shrink-0 place-items-center rounded bg-blood-400/15 text-xs font-bold text-blood-400">
                    ✕
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 챔피언 전용 티어 팁 */}
        <div className="rounded-xl border border-gold-400/20 bg-gold-400/[0.04] p-5">
          <SectionTitle>
            {champion.name} 원챔 공략 · {bracket.label}
          </SectionTitle>
          <ul className="mt-3 space-y-2.5">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-3 text-sm leading-relaxed">
                <span className="mt-1.5 size-2 shrink-0 rotate-45 bg-gold-400" aria-hidden="true" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* 원챔 루틴 체크리스트 */}
        <div>
          <div className="flex items-center justify-between">
            <SectionTitle>오늘의 원챔 루틴</SectionTitle>
            <span className="text-xs text-gold-100/50">
              {doneCount} / {bracket.routine.length} 완료
            </span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-void-700">
            <div
              className="h-full bg-hex-400 transition-[width] duration-300"
              style={{ width: `${(doneCount / bracket.routine.length) * 100}%` }}
            />
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {bracket.routine.map((item, i) => (
              <li key={item}>
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm leading-relaxed transition ${
                    checked[i]
                      ? 'border-hex-400/40 bg-hex-400/5 text-gold-100/50 line-through'
                      : 'border-white/8 hover:border-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checked[i]}
                    onChange={() => setChecked((prev) => ({ ...prev, [i]: !prev[i] }))}
                    className="mt-0.5 size-4 shrink-0 accent-hex-400"
                  />
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <blockquote className="border-l-2 border-gold-400 pl-4 text-sm text-gold-300 italic">
          “{tier.mindset}”
        </blockquote>
      </div>
    </section>
  )
}

function SectionTitle({ children }) {
  return <h4 className="text-sm font-bold tracking-wide text-gold-300">{children}</h4>
}

function Metric({ label, value, unit, small }) {
  return (
    <div className="rounded-xl border border-white/8 bg-void-900/60 p-4">
      <p className="text-[11px] tracking-widest text-gold-100/40">{label}</p>
      <p className={`mt-1 font-bold text-gold-100 ${small ? 'text-sm leading-snug' : 'text-2xl'}`}>
        {value}
        {unit && <span className="ml-1 text-sm text-gold-100/50">{unit}</span>}
      </p>
    </div>
  )
}
