FROM node:24-alpine AS builder

# 🐋 Labels for github packages
LABEL org.opencontainers.image.source=$PROJECT_DOCKER_URL
LABEL org.opencontainers.image.description="Voiky's Web API Boilerplate"
LABEL org.opencontainers.image.licenses=MIT

# 📁 Copy of source files (entry point is src/index.ts)
COPY src src/
COPY libraries libraries/
COPY package.json package-lock.json ./
COPY build.mjs .

# 📦 Install app dependencies + build the bundle
# @Voikyrioh/observability (GitHub Packages) : auth requise au npm ci.
# GITHUB_TOKEN = build-arg passé par deploy-app.yml/ci-release (NPM_TOKEN du repo).
ENV NPM_CONFIG_LOGLEVEL=warn
ARG GITHUB_TOKEN
RUN echo "@Voikyrioh:registry=https://npm.pkg.github.com" > .npmrc \
    && echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc
RUN npm ci
RUN rm .npmrc
RUN node build.mjs

FROM node:24-alpine AS runner
WORKDIR /app

# 🔨 Copy built bundle + install production dependencies (esbuild keeps them external)
COPY --from=builder /dist ./dist
COPY package.json package-lock.json ./
# Le runner réinstalle les deps prod (dont @Voikyrioh/observability) : re-auth.
ARG GITHUB_TOKEN
RUN echo "@Voikyrioh:registry=https://npm.pkg.github.com" > .npmrc \
    && echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc
RUN npm ci --omit=dev
RUN rm .npmrc

# 🔌 Expose the listening port of your app
EXPOSE $PORT

# --import register : hook ESM + init SDK dans le preload, AVANT le linking
# du bundle — une init in-app arrive trop tard pour patcher les imports
# statiques (pg/mysql2/mongo sans span, cf. CHANGELOG observability 0.4.0).
# OTEL_SERVICE_NAME requis dans la fiche infra de l app.
CMD ["node", "--import", "@Voikyrioh/observability/register", "./dist/index.js"]
