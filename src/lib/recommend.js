// 설문 응답 → 성향 벡터 → 챔피언 매칭 점수 계산

const AXIS_MAX = 2

// 여러 문항의 평균은 0 근처로 몰리기 쉬워 무난한 챔피언만 추천되는 문제가 있다.
// 성향을 SPREAD배 늘린 뒤 ±AXIS_MAX로 잘라 극단적인 성향의 챔피언도 고르게 추천되게 한다.
const SPREAD = 1.8

// 포지션 선호는 성향 거리보다 우선한다 (주 포지션 > 부 포지션)
const POSITION_BONUS = { primary: 20, secondary: 12 }

// 낮은 티어일수록 고난도 챔피언에 페널티. 피지컬 성향이 강하면 절반만 적용
const DIFFICULTY_PENALTY = {
  low: { 1: 0, 2: 1.5, 3: 6 },
  mid: { 1: 0, 2: 0, 3: 2 },
  high: { 1: 0, 2: 0, 3: 0 },
}

/** 응답을 축별 -2 ~ +2 범위의 성향 벡터와 선호 포지션으로 변환 */
export function computeProfile(questions, answers, axes) {
  const sum = Object.fromEntries(axes.map((a) => [a.key, 0]))
  const max = Object.fromEntries(axes.map((a) => [a.key, 0]))
  let position = null

  for (const q of questions) {
    // 각 질문이 축에 줄 수 있는 최대 영향력을 누적해 정규화 기준으로 사용
    for (const a of axes) {
      max[a.key] += Math.max(0, ...q.options.map((o) => Math.abs(o.effects?.[a.key] ?? 0)))
    }
    const picked = q.options.find((o) => o.id === answers[q.id])
    if (!picked) continue
    if (q.type === 'position') position = picked.position ?? null
    for (const [key, value] of Object.entries(picked.effects ?? {})) {
      if (key in sum) sum[key] += value
    }
  }

  const vector = Object.fromEntries(
    axes.map((a) => {
      const normalized = max[a.key] ? (sum[a.key] / max[a.key]) * AXIS_MAX * SPREAD : 0
      return [a.key, Math.max(-AXIS_MAX, Math.min(AXIS_MAX, normalized))]
    }),
  )
  return { vector, position }
}

/** MBTI 스타일 4글자 유형 코드 (숨김 축 제외) */
export function toTypeCode(vector, axes) {
  return axes
    .filter((a) => !a.hidden)
    .map((a) => (vector[a.key] >= 0 ? a.positive.code : a.negative.code))
    .join('')
}

function weightedDistance(vector, traits, axes) {
  return axes.reduce((acc, a) => {
    const diff = (vector[a.key] ?? 0) - (traits[a.key] ?? 0)
    return acc + a.weight * diff * diff
  }, 0)
}

/** 챔피언 목록을 적합도 순으로 정렬해 반환 */
export function rankChampions(champions, profile, axes, bracket) {
  const { vector, position } = profile
  const maxDistance = axes.reduce((acc, a) => acc + a.weight * (AXIS_MAX * 2) ** 2, 0)
  const lovesMechanics = (vector.mechanics ?? 0) > 1

  return champions
    .map((champion) => {
      const distance = weightedDistance(vector, champion.traits, axes)

      let positionBonus = 0
      if (position) {
        const idx = champion.positions.indexOf(position)
        if (idx === 0) positionBonus = POSITION_BONUS.primary
        else if (idx > 0) positionBonus = POSITION_BONUS.secondary
      }

      let penalty = DIFFICULTY_PENALTY[bracket]?.[champion.difficulty] ?? 0
      if (lovesMechanics) penalty /= 2

      // 싱크로율: 성향 거리만으로 계산 (포지션·티어 보정은 순위에만 반영)
      const ratio = Math.sqrt(distance / maxDistance)
      const match = Math.round(Math.min(99, Math.max(50, 100 - ratio * 80)))

      return {
        champion,
        match,
        penalized: penalty > 0,
        score: -distance + positionBonus - penalty,
      }
    })
    .sort((a, b) => b.score - a.score)
}

export function championImage(template, id) {
  return template.replace('{id}', id)
}
