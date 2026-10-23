import { useState } from 'react'
import ChampionHero from './ChampionHero'
import ChampionImage from './ChampionImage'
import TraitCompare from './TraitCompare'
import TierGuide from './TierGuide'
import { championImage } from '../lib/recommend'

const PHASES = [
  { key: 'early', label: '초반', range: '1~14분' },
  { key: 'mid', label: '중반', range: '14~25분' },
  { key: 'late', label: '후반', range: '25분~' },
]

export default function Result({ result, tier, tiers, brackets, axes, meta, onRestart, onChangeTier }) {
  const { ranked, profile, typeCode, type } = result
  const [selectedId, setSelectedId] = useState(ranked[0].champion.id)
  const [copied, setCopied] = useState(false)

  const pick = ranked.find((r) => r.champion.id === selectedId) ?? ranked[0]
  const { champion } = pick
  const nextTier = tiers.find((t) => t.rank === tier.rank + 1) ?? null
  const bracket = brackets[tier.bracket]
  const visibleAxes = axes.filter((a) => !a.hidden)

  const selectChampion = (id) => {
    setSelectedId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const copyResult = async () => {
    const text = [
      `[원챔 연구소] 나의 원챔은 ${champion.name}! (싱크로율 ${pick.match}%)`,
      `플레이 유형: ${typeCode} · ${type?.name ?? ''}`,
      nextTier ? `${tier.name} → ${nextTier.name} 승급 도전 중 🔥` : `${tier.name} 정상 수성 중 👑`,
      window.location.href,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('아래 내용을 복사해 공유하세요', text)
    }
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-up text-center">
        <p className="font-display text-xs tracking-[0.4em] text-hex-400">STEP 03 · ANALYSIS COMPLETE</p>
        <h1 className="mt-3 text-2xl font-black sm:text-4xl">
          당신에게 운명처럼 맞는 <span className="text-gold-gradient">원챔</span>을 찾았습니다
        </h1>
      </div>

      <ChampionHero key={champion.id} pick={pick} meta={meta} isTop={pick === ranked[0]} />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* 플레이 유형 */}
        <section className="panel animate-fade-up p-6 sm:p-8 lg:col-span-2">
          <h3 className="text-sm font-bold tracking-wide text-gold-300">나의 플레이 유형</h3>
          <div className="mt-4 flex gap-2">
            {typeCode.split('').map((letter, i) => (
              <div
                key={visibleAxes[i].key}
                className="flex flex-1 flex-col items-center rounded-lg border border-gold-400/25 bg-void-900/70 py-3"
              >
                <span className="font-display text-2xl font-extrabold text-gold-gradient sm:text-3xl">{letter}</span>
                <span className="mt-1 text-[10px] text-gold-100/45">
                  {letter === visibleAxes[i].positive.code ? visibleAxes[i].positive.name : visibleAxes[i].negative.name}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xl font-black">{type?.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-gold-100/70">{type?.desc}</p>
          <div className="mt-6 border-t border-white/5 pt-6">
            <TraitCompare axes={axes} vector={profile.vector} traits={champion.traits} championName={champion.name} />
          </div>
        </section>

        {/* 챔피언 분석 */}
        <section key={champion.id} className="panel animate-fade-up p-6 sm:p-8 lg:col-span-3">
          <h3 className="text-sm font-bold tracking-wide text-gold-300">{champion.name} 분석</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <ListCard title="강점" items={champion.strengths} tone="good" />
            <ListCard title="약점" items={champion.weaknesses} tone="bad" />
          </div>

          <h3 className="mt-8 text-sm font-bold tracking-wide text-gold-300">게임 플랜</h3>
          <ol className="relative mt-4 space-y-5 border-l border-gold-400/20 pl-6">
            {PHASES.map((phase) => (
              <li key={phase.key} className="relative">
                <span className="absolute top-1 -left-[29px] size-2.5 rotate-45 border border-gold-400 bg-void-950" />
                <p className="text-xs">
                  <span className="font-bold text-hex-400">{phase.label}</span>
                  <span className="ml-2 text-gold-100/35">{phase.range}</span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-gold-100/85">{champion.gamePlan[phase.key]}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <TierGuide key={`${tier.id}-${champion.id}`} tier={tier} nextTier={nextTier} bracket={bracket} champion={champion} />

      {/* 대안 챔피언 */}
      <section className="animate-fade-up">
        <h3 className="text-sm font-bold tracking-wide text-gold-300">다른 후보도 살펴보기</h3>
        {tier.bracket !== 'high' && (
          <p className="mt-1 text-xs text-gold-100/40">
            ※ {bracket.label} 구간은 숙련 부담이 적은 챔피언에 가중치가 적용됩니다.
          </p>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {ranked.map((r, i) => {
            const active = r.champion.id === champion.id
            return (
              <button
                key={r.champion.id}
                type="button"
                onClick={() => selectChampion(r.champion.id)}
                aria-pressed={active}
                className={`group flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition ${
                  active ? 'border-gold-400 bg-gold-400/[0.06]' : 'border-white/8 bg-void-900/60 hover:border-white/25'
                }`}
              >
                <ChampionImage
                  src={championImage(meta.images.tile, r.champion.id)}
                  alt=""
                  className="size-14 shrink-0 rounded-lg border border-gold-400/30 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-gold-100/40">{i === 0 ? '1순위 추천' : `${i + 1}순위`}</p>
                  <p className="truncate font-bold">{r.champion.name}</p>
                  <p className="text-xs text-hex-400">싱크로율 {r.match}%</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
        <button type="button" className="btn-primary" onClick={copyResult}>
          {copied ? '복사 완료!' : '결과 공유하기'}
        </button>
        <button type="button" className="btn-ghost" onClick={onRestart}>
          테스트 다시 하기
        </button>
        <button type="button" className="btn-ghost" onClick={onChangeTier}>
          티어 변경
        </button>
      </div>
    </div>
  )
}

function ListCard({ title, items, tone }) {
  const good = tone === 'good'
  return (
    <div className={`rounded-xl border p-4 ${good ? 'border-hex-400/20 bg-hex-400/[0.04]' : 'border-blood-400/20 bg-blood-400/[0.04]'}`}>
      <p className={`text-xs font-bold ${good ? 'text-hex-400' : 'text-blood-400'}`}>{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-gold-100/85">
            <span className={good ? 'text-hex-400' : 'text-blood-400'} aria-hidden="true">
              {good ? '+' : '−'}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
