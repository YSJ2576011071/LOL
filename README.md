# ONE TRICK · 원챔 연구소

MBTI 스타일 질문 10개로 플레이 성향을 분석해 **딱 맞는 원챔 1개**를 추천하고,
현재 티어(아이언 ~ 챌린저)에 맞춘 **승급 공략**을 보여주는 웹앱입니다.

- **스택**: Vite 8 · React 19 · Tailwind CSS 4 (`@tailwindcss/vite`)
- **흐름**: Step 1 티어 선택 → Step 2 설문(프로그레스바) → Step 3 결과 카드 & 티어별 공략
- **이미지**: Riot Data Dragon CDN (스플래시·타일 아트)

## 빠른 시작

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # dist/ 생성
npm run preview   # 빌드 결과 미리보기
```

> **WSL 사용 시**: 프로젝트가 WSL 파일시스템(`\\wsl.localhost\...`)에 있다면
> Windows의 Node가 아니라 **WSL 안에 설치한 Node**로 실행하세요.
> (Windows Node로 UNC 경로에서 `npm install`을 하면 설치 스크립트가 실패하거나 매우 느립니다.)
>
> ```bash
> # WSL(Ubuntu) 터미널에서
> curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
> source ~/.bashrc && nvm install --lts
> ```

## 폴더 구조

```
public/
  data/champions.json     # 챔피언 데이터 (런타임 fetch → 재빌드 없이 수정 가능)
  favicon.svg
src/
  data/questions.json     # 성향 축 · 16개 유형 · 설문 문항
  data/tiers.json         # 10개 티어별 공략 · 구간별 원챔 루틴
  lib/recommend.js        # 성향 벡터 계산 & 챔피언 매칭 알고리즘
  components/
    Header.jsx            # 로고 + 단계 표시
    TierSelect.jsx        # Step 1
    Survey.jsx            # Step 2 (+ ProgressBar.jsx)
    Result.jsx            # Step 3 (+ ChampionHero, TraitCompare, TierGuide)
    TierEmblem.jsx        # SVG 티어 엠블럼
  App.jsx                 # 단계 상태 관리
```

## 추천 알고리즘

1. **성향 벡터** — 각 선택지는 축별 점수(`effects`)를 가집니다. 축별 합계를 "해당 축에서 얻을 수 있는 최대 점수"로 나눠 `-2 ~ +2`로 정규화한 뒤, 1.8배 늘리고 다시 `±2`로 자릅니다.
   여러 문항을 평균하면 값이 0 근처로 몰려 무난한 챔피언만 추천되기 때문입니다. 가능한 응답 조합 21만 개를 모두 돌려 보면, 이 보정으로 1위 챔피언의 추천 비중이 23%에서 13%로 내려갑니다.

   | 축 | + | − |
   |---|---|---|
   | aggression | A 공격형 | C 계산형 |
   | carry | S 솔로 캐리 | T 팀 플레이 |
   | mechanics | M 피지컬 | F 기본기 |
   | tempo | E 초반 주도 | L 후반 지향 |
   | range (유형 코드 미포함) | 원거리 | 근거리 |

2. **유형 코드** — 앞 4개 축의 부호로 `ASME`, `CTFL` 같은 16가지 유형을 만듭니다.
3. **챔피언 점수** — `-(가중 유클리드 거리²) + 포지션 보너스 − 티어 난이도 페널티`
   - 주 포지션 +20 / 부 포지션 +12 → 선호 포지션 챔피언이 우선
   - 아이언~실버는 난이도 3 챔피언에 큰 페널티, 골드~에메랄드는 작은 페널티 (피지컬 성향이 강하면 절반만 적용)
4. **싱크로율** — 성향 거리만으로 계산한 50~99% 값

## 데이터 확장하기

### 챔피언 추가 (`public/data/champions.json`)

```jsonc
{
  "id": "Jax",                    // Data Dragon 챔피언 ID (이미지 URL에 사용)
  "name": "잭스",
  "title": "무기의 달인",
  "positions": ["top", "jungle"], // 첫 번째가 주 포지션
  "difficulty": 2,                // 1 쉬움 · 2 보통 · 3 어려움
  "tags": ["전사"],
  "traits": { "aggression": 1, "carry": 2, "mechanics": 0, "tempo": -1, "range": -2 },
  "pitch": "한 줄 소개",
  "strengths": ["..."], "weaknesses": ["..."],
  "gamePlan": { "early": "...", "mid": "...", "late": "..." },
  "tierTips": { "low": ["..."], "mid": ["..."], "high": ["..."] }
}
```

`tierTips`의 `low / mid / high`는 `tiers.json`의 `bracket` 값(아이언~실버 / 골드~에메랄드 / 다이아~챌린저)과 연결됩니다.

### 질문 추가 (`src/data/questions.json`)

선택지마다 `effects`에 축 점수(-2 ~ 2)를 넣으면 정규화가 자동으로 맞춰집니다.
포지션 질문은 `"type": "position"`과 선택지별 `"position"` 값을 사용합니다.

---

## GitHub Pages 배포 (gh-pages)

`gh-pages` 패키지와 배포 스크립트는 이미 설정되어 있습니다.

```jsonc
// package.json
"scripts": {
  "predeploy": "npm run build",     // deploy 전에 자동 빌드
  "deploy": "gh-pages -d dist"      // dist/ 를 gh-pages 브랜치로 푸시
}
```

```js
// vite.config.js — 상대 경로 빌드라 저장소 이름과 무관하게 동작
base: './'
```

### 1. GitHub 저장소 만들고 푸시

```bash
git init
git add .
git commit -m "init: LoL 원챔 추천 웹앱"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO>.git
git push -u origin main
```

### 2. 배포

```bash
npm run deploy
```

빌드 후 `dist/` 내용이 `gh-pages` 브랜치로 푸시됩니다. 처음 실행하면 브랜치가 자동 생성됩니다.

### 3. Pages 활성화 (최초 1회)

GitHub 저장소 → **Settings → Pages**

- **Source**: `Deploy from a branch`
- **Branch**: `gh-pages` / `/ (root)` → **Save**

1~2분 후 `https://<USERNAME>.github.io/<REPO>/` 에서 확인할 수 있습니다.
이후에는 코드 수정 → `npm run deploy` 만 반복하면 됩니다.

### 문제 해결

| 증상 | 원인 / 해결 |
|---|---|
| 흰 화면, 콘솔에 JS 404 | `vite.config.js`의 `base`가 `'./'`(또는 `'/<REPO>/'`)인지 확인 |
| "챔피언 데이터를 불러오지 못했어요" | `public/data/champions.json` 경로 확인, JSON 문법 오류 확인 |
| `npm run deploy` 인증 실패 | `git push`가 되는지 먼저 확인 (HTTPS 토큰 또는 SSH 키 설정) |
| 배포했는데 이전 화면이 보임 | Pages 반영까지 1~2분 대기 후 강력 새로고침 (Ctrl+Shift+R) |
| 사용자 페이지(`<USERNAME>.github.io` 저장소)로 배포 | 저장소 Settings → Pages에서 `gh-pages` 브랜치 선택은 동일, `base`는 `'./'` 그대로 사용 가능 |

---

원챔 연구소는 Riot Games와 관련 없는 팬 프로젝트입니다. League of Legends 및 관련 이미지의 권리는 Riot Games에 있습니다.
