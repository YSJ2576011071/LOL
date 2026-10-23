import { useEffect, useRef, useState } from 'react'
import ProgressBar from './ProgressBar'

const ADVANCE_DELAY = 280

export default function Survey({ questions, answers, onAnswer, onBack, onComplete }) {
  const total = questions.length
  const [index, setIndex] = useState(() => Math.max(0, questions.findIndex((q) => !answers[q.id])))
  const [pendingId, setPendingId] = useState(null)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const question = questions[index]
  const answeredCount = questions.filter((q) => answers[q.id]).length
  const currentAnswer = answers[question.id]

  const goNext = () => {
    if (index + 1 >= total) onComplete()
    else setIndex(index + 1)
  }

  const choose = (optionId) => {
    if (pendingId) return
    onAnswer(question.id, optionId)
    setPendingId(optionId)
    // 선택 피드백을 잠깐 보여준 뒤 자동으로 다음 질문
    timer.current = setTimeout(() => {
      setPendingId(null)
      goNext()
    }, ADVANCE_DELAY)
  }

  const goBack = () => {
    if (pendingId) return
    if (index === 0) onBack()
    else setIndex(index - 1)
  }

  // 숫자 키로 선택, ← / Backspace로 이전 질문
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const n = Number(e.key)
      if (Number.isInteger(n) && n >= 1 && n <= question.options.length) {
        choose(question.options[n - 1].id)
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault()
        goBack()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <section className="mx-auto max-w-2xl">
      <ProgressBar current={index} total={total} answered={answeredCount} />

      <div key={question.id} className="mt-10 animate-fade-up">
        <span className="inline-block rounded-full border border-gold-400/30 bg-gold-400/5 px-3 py-1 text-xs font-medium text-gold-300">
          {question.category}
        </span>
        <h2 className="mt-4 text-2xl leading-snug font-bold sm:text-3xl">{question.text}</h2>

        <div className="mt-8 grid gap-3" role="radiogroup" aria-label={question.text}>
          {question.options.map((option, i) => {
            const selected = (pendingId ?? currentAnswer) === option.id
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => choose(option.id)}
                style={{ animationDelay: `${60 + i * 50}ms` }}
                className={`group flex w-full cursor-pointer items-center gap-4 rounded-xl border px-4 py-4 text-left transition duration-200 sm:px-5 ${
                  selected
                    ? 'animate-pulse-glow border-hex-400 bg-hex-400/10'
                    : 'animate-fade-up border-white/10 bg-void-900/70 hover:border-gold-400/60 hover:bg-gold-400/[0.04]'
                }`}
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-md border font-display text-sm font-bold transition ${
                    selected
                      ? 'border-hex-400 bg-hex-400 text-void-950'
                      : 'border-gold-400/30 text-gold-400 group-hover:border-gold-400'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-[15px] font-medium sm:text-base">{option.text}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <button type="button" className="btn-ghost" onClick={goBack}>
          <span aria-hidden="true">←</span> {index === 0 ? '티어 다시 선택' : '이전 질문'}
        </button>
        {currentAnswer && !pendingId && (
          <button type="button" className="btn-ghost" onClick={goNext}>
            {index + 1 >= total ? '결과 보기' : '다음 질문'} <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
      <p className="mt-6 hidden text-center text-xs text-gold-100/30 sm:block">
        키보드 숫자 키로 바로 선택할 수 있어요 · ← 이전 질문
      </p>
    </section>
  )
}
