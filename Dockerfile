FROM node:20-alpine AS builder

ARG app

WORKDIR /builder

COPY . .

RUN npm i -g pnpm@8.5

RUN pnpm --filter @notice-app/${app}... install --frozen-lockfile

RUN pnpm exec turbo run build --filter @notice-app/${app} --concurrency 100

RUN pnpm --filter @notice-app/${app} --prod deploy build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /builder/build/ ./

RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
	echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
	apk add doppler

RUN npm i -g pnpm@8.5

EXPOSE 8080

CMD [ "doppler", "run", "--", "pnpm", "run", "start" ]
