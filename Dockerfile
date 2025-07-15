FROM node:24-alpine AS BUILDER

# 🐋 Labels for github packages
LABEL org.opencontainers.image.source=$PROJECT_DOCKER_URL
LABEL org.opencontainers.image.description="Voiky's Web API Boilerplate"
LABEL org.opencontainers.image.licenses=MIT

# 📁 Copy of source files
COPY src src/
COPY libraries libraries/
COPY package.json .

#  Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production
RUN npx tsc --project tsconfig.production.json

FROM keymetrics/pm2:24-alpine AS RUNNER

# 🔨 Copy built files
COPY --from=builder /app/dist .

# 🌳 Install ecosystem for running the app
COPY ecosystem.config.js .

# 🔌 Expose the listening port of your app
EXPOSE $PORT

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
