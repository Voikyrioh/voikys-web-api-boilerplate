FROM node:24-alpine AS BUILDER

# 🐋 Labels for github packages
LABEL org.opencontainers.image.source=$PROJECT_DOCKER_URL
LABEL org.opencontainers.image.description="Voiky's Web API Boilerplate"
LABEL org.opencontainers.image.licenses=MIT

# 📁 Copy of source files
COPY src src/
COPY libraries libraries/
COPY index.ts .
COPY package.json .
COPY tsconfig.build.json .

#  Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production
RUN npm install -g typescript
RUN npm install -g tsc-alias
RUN tsc --project tsconfig.build.json && tsc-alias --project tsconfig.build.json

FROM node:24-alpine AS RUNNER

# 🔨 Copy built files
COPY --from=builder dist .
COPY --from=builder package.json .
COPY --from=builder package-lock.json .

RUN npm ci --production

# 🌳 Install ecosystem for running the app
COPY ecosystem.config.js .

# 🔌 Expose the listening port of your app
EXPOSE 8080

RUN npm install -g pm2

CMD ["pm2-runtime", "ecosystem.config.js"]
