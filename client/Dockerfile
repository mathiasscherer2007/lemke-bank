FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json client/package.json
COPY server/package.json server/package.json

RUN npm ci --ignore-scripts

COPY client ./client

RUN npm run build -w client

FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=5173

COPY --from=build /app/client/build ./build
COPY --from=build /app/node_modules ./node_modules

EXPOSE 5173

CMD ["node", "build"]
