# Template : Hono API (Node.js / TypeScript)

Boilerplate pour créer une nouvelle API avec Hono, TypeScript, Docker et Biome.

## Stack

- **Runtime :** Node.js 20 LTS
- **Framework :** [Hono](https://hono.dev/)
- **Language :** TypeScript
- **Linting :** Biome
- **Tests :** Mocha + Chai
- **Container :** Docker + compose.dev.yml
- **Process manager :** PM2 (production)

## Utiliser ce template

```bash
# 1. Copier le dossier
cp -r templates/projects/hono-api products/{écosystème}/{nom-du-projet}

# 2. Configurer
cd products/{écosystème}/{nom-du-projet}
cp env/.env.example env/.env.development
npm install

# 3. Lancer en dev
docker compose -f compose.dev.yml up

# 4. Tester
npm test
```

## Structure

```
hono-api/
├── env/              # Fichiers d'environnement par env
├── libraries/        # Utilitaires partagés du projet
├── src/              # Code source TypeScript
│   └── index.ts
├── biome.json        # Config linting/formatting
├── compose.dev.yml   # Docker Compose développement
├── Dockerfile        # Image de production
├── ecosystem.config.js  # Config PM2
└── package.json
```

## Observabilité (`@Voikyrioh/observability`, INFRA-16)

Logger pino + erreurs 3 familles + `UseCase` (span auto par `Execute`, `runStep`
pour les spans d'étapes) + tracing OTel → SigNoz. Package privé GitHub Packages :

- `.npmrc` du projet lit `GITHUB_TOKEN` (env local dev). En CI : secret
  `NPM_TOKEN` (PAT read:packages) sur le repo — ci-release/deploy-app le passent
  en build-arg `GITHUB_TOKEN` au Dockerfile.
- `src/instrumentation.ts` : **premier import** de `src/index.ts`, y renseigner
  `serviceName` (remplacer `CHANGE-ME` = nom de la fiche `apps/`).
- `otelHono()` : premier middleware de `app.ts`.
- Fiche `apps/<nom>.yml` : `internal_services: [signoz]` + env
  `OTEL_EXPORTER_OTLP_ENDPOINT: http://signoz-otel-collector:4318`.
- Dev sans collector : `OTEL_SDK_DISABLED=true`.

## Adapter ce template

1. Renommer le projet dans `package.json`
2. Renseigner `serviceName` dans `src/instrumentation.ts`
3. Configurer les variables dans `env/`
4. Supprimer `.git` si présent (c'est un template, pas un repo)
5. Créer un nouveau `git init` pour le projet
6. Ajouter le secret `NPM_TOKEN` sur le repo GitHub (package observability privé)
