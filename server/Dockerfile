FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json client/package.json
COPY server/package.json server/package.json

RUN npm ci --ignore-scripts

COPY server ./server

RUN npm run build -w server

FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/server/Build ./server/Build
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "server/Build/Config/server.js"]
