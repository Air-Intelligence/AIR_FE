FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_PUBLIC_MAPBOX_KEY
ARG VITE_VAPID_PUBLIC_KEY
ARG VITE_PUBLIC_API_URL

ENV VITE_PUBLIC_MAPBOX_KEY=${VITE_PUBLIC_MAPBOX_KEY}
ENV VITE_VAPID_PUBLIC_KEY=${VITE_VAPID_PUBLIC_KEY}
ENV VITE_PUBLIC_API_URL=${VITE_PUBLIC_API_URL}

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

COPY --from=builder /app/public/serviceWorker.js /usr/share/nginx/html/serviceWorker.js

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
