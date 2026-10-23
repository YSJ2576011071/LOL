import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages 프로젝트 페이지는 https://<user>.github.io/<repo>/ 하위 경로에서 서빙된다.
// 상대 경로('./')로 빌드하면 저장소 이름과 상관없이 에셋·데이터 경로가 동작한다.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
