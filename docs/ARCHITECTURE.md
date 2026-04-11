# HackOps Production Architecture

## Primary Runtime
- **Primary backend**: `backend-node` (Express + MongoDB)
- **Frontend**: `frontend` (React + Vite)
- **Legacy backend**: `backend` (FastAPI) is retained only for historical reference and local experimentation; it is not part of production deployment.

## Environment Topology
- **Development**
  - Frontend: localhost:3000
  - API: localhost:4000
  - Database: local MongoDB
- **Staging**
  - Frontend built by `deploy-staging.yml`
  - API deployed to staging host/domain with separate DB and secrets
- **Production**
  - Frontend deployed through GitHub Pages workflow (`deploy.yml`)
  - API deployed as `backend-node` service behind TLS/reverse proxy

## Security Boundaries
- JWT-protected routes (`/api/progress/*`, `/api/auth/me`)
- CORS allowlist via `CORS_ORIGIN` (comma-separated supported)
- Structured error envelopes include `requestId` for traceability
- Request ID propagated via `x-request-id`

## Operational Endpoints
- Liveness: `GET /api/health`
- Readiness: `GET /api/health/ready`
