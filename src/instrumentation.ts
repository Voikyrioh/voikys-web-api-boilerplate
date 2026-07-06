/**
 * Init OpenTelemetry — DOIT rester le premier import de src/index.ts :
 * le patch des modules (pg/mongodb/ioredis/http/fetch) précède leurs imports
 * applicatifs. Endpoint via env OTEL_EXPORTER_OTLP_ENDPOINT (prod :
 * http://signoz-otel-collector:4318, fiche app `internal_services: [signoz]`).
 * Kill switch dev : OTEL_SDK_DISABLED=true.
 */
import { initObservability } from '@Voikyrioh/observability'

// TODO template : remplacer par le nom du service (= nom de la fiche apps/)
initObservability({ serviceName: 'CHANGE-ME' })
