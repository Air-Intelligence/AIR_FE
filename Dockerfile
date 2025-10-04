FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_PUBLIC_MAPBOX_KEY
ARG VITE_VAPID_PUBLIC_KEY
ARG VITE_PUBLIC_API_URL

ENV VITE_PUBLIC_MAPBOX_KEY=${VITE_PUBLIC_MAPBOX_KEY}
ENV VITE_VAPID_PUBLIC_KEY=${VITE_VAPID_PUBLIC_KEY}
ENV VITE_PUBLIC_API_URL=${VITE_PUBLIC_API_URL}

RUN sed -i 's#"build": "tsc -b && vite build"#"build": "vite build"#' package.json

RUN pnpm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

COPY --from=builder /app/public/serviceWorker.js /usr/share/nginx/html/serviceWorker.js

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
