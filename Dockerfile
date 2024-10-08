FROM node:18.18.0-alpine3.18 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --ignore-scripts

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build
RUN rm .keystone/admin/pages/translations/*.js

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.keystone /app/.keystone
RUN pnpm postinstall
EXPOSE 3000
ENTRYPOINT ["/bin/sh", "-c" , "pnpm exec keystone prisma migrate deploy && pnpm start"]
