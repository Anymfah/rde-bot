FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm build

FROM node:16-alpine AS final

# --- START ---

RUN apk add --no-cache chromium ca-certificates
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

# --- END ---

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env.example .
COPY package.json .
COPY package.lock .
RUN npm install --production
EXPOSE 8080
CMD ["npm", "start"]
