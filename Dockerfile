# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# corepack으로 pnpm 활성화 (Node 16.13+ 기본 내장)
RUN corepack enable && corepack prepare pnpm@latest --activate

# 패키지 메타 파일만 먼저 복사 (캐시 최적화)
COPY package.json pnpm-lock.yaml ./

# 의존성 설치 (lockfile 그대로)
RUN pnpm install --frozen-lockfile

# 소스 복사
COPY . .

# 빌드 시 필요한 환경변수 (Vite 전용)
ARG VITE_PUBLIC_MAPBOX_KEY
ARG VITE_VAPID_PUBLIC_KEY
ARG VITE_PUBLIC_API_URL

ENV VITE_PUBLIC_MAPBOX_KEY=${VITE_PUBLIC_MAPBOX_KEY}
ENV VITE_VAPID_PUBLIC_KEY=${VITE_VAPID_PUBLIC_KEY}
ENV VITE_PUBLIC_API_URL=${VITE_PUBLIC_API_URL}

# 애플리케이션 빌드
RUN pnpm run build

# ---------- Production stage ----------
FROM nginx:alpine

# Nginx 커스텀 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 서비스 워커 파일을 루트에 따로 복사
COPY --from=builder /app/public/serviceWorker.js /usr/share/nginx/html/serviceWorker.js

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
