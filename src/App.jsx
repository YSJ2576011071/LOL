import { useEffect, useMemo, useState } from 'react'
import questionData from './data/questions.json'
import tierData from './data/tiers.json'
import { computeProfile, rankChampions, toTypeCode } from './lib/recommend'
import Header from './components/Header'
import TierSelect from './components/TierSelect'
import Survey from './components/Survey'
import Result from './components/Result'

const { axes, types, questions } = questionData
const { tiers, brackets } = tierData

export default function App() {
  const [step, setStep] = useState(1)
  const [tierId, setTierId] = useState(null)
  const [answers, setAnswers] = useState({})
  const [championData, setChampionData] = useState(null)
  const [loadError, setLoadError] = useState(null)

  // 챔피언 데이터는 public/에 두고 런타임에 불러온다 (빌드 없이 데이터만 교체 가능)
  useEffect(() => {
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}data/champions.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => !cancelled && setChampionData(data))
      .catch((err) => !cancelled && setLoadError(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const tier = tiers.find((t) => t.id === tierId) ?? null
  const surveyDone = questions.every((q) => answers[q.id])
  const maxStep = !tier ? 1 : surveyDone ? 3 : 2

  const result = useMemo(() => {
    if (!championData || !tier || !surveyDone) return null
    const profile = computeProfile(questions, answers, axes)
    const typeCode = toTypeCode(profile.vector, axes)
    return {
      profile,
      typeCode,
      type: types[typeCode],
      ranked: rankChampions(championData.champions, profile, axes, tier.bracket).slice(0, 3),
    }
  }, [championData, tier, answers, surveyDone])

  const handleAnswer = (questionId, optionId) =>
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))

  const restart = () => {
    setAnswers({})
    setStep(2)
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header step={step} maxStep={maxStep} onNavigate={setStep} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:py-14">
        {step === 1 && (
          <TierSelect
            tiers={tiers}
            selectedId={tierId}
            onSelect={setTierId}
            resumable={surveyDone}
            onConfirm={() => setStep(surveyDone ? 3 : 2)}
          />
        )}

        {step === 2 && (
          <Survey
            questions={questions}
            answers={answers}
            onAnswer={handleAnswer}
            onBack={() => setStep(1)}
            onComplete={() => setStep(3)}
          />
        )}

        {step === 3 &&
          (result ? (
            <Result
              key={`${tier.id}-${result.ranked[0].champion.id}`}
              result={result}
              tier={tier}
              tiers={tiers}
              brackets={brackets}
              axes={axes}
              meta={championData.meta}
              onRestart={restart}
              onChangeTier={() => setStep(1)}
            />
          ) : (
            <StatusMessage error={loadError} />
          ))}
      </main>

      <footer className="border-t border-white/5 px-4 py-6 text-center text-xs leading-relaxed text-gold-100/35">
        원챔 연구소는 Riot Games와 관련이 없는 팬 프로젝트입니다.
        <br />
        League of Legends 및 챔피언 이미지 © Riot Games · Data Dragon
      </footer>
    </div>
  )
}

function StatusMessage({ error }) {
  if (error) {
    return (
      <div className="panel mx-auto max-w-md p-8 text-center">
        <p className="text-lg font-bold text-blood-400">챔피언 데이터를 불러오지 못했어요</p>
        <p className="mt-2 text-sm text-gold-100/60">{error}</p>
        <button className="btn-ghost mt-6" onClick={() => window.location.reload()}>
          새로고침
        </button>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-gold-100/60" role="status">
      <span className="size-10 animate-spin rounded-full border-2 border-gold-400/20 border-t-hex-400" />
      소환사의 성향을 분석하는 중…
    </div>
  )
}
