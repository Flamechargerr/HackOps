# Production Readiness Checklist

## Architecture
- [x] Single production backend selected (`backend-node`)
- [x] Legacy backend isolated from production path
- [x] Dev/staging/prod topology documented

## API and Contracts
- [x] Auth contract standardized (`accessToken`, bearer token type)
- [x] `GET /api/auth/me` endpoint available
- [x] Consistent error envelope with request IDs

## Backend Hardening
- [x] Structured request/error logs
- [x] Request ID middleware
- [x] Readiness endpoint (`/api/health/ready`)
- [x] Graceful shutdown for SIGTERM/SIGINT
- [x] Seed strategy for initial challenge data

## Frontend Production Readiness
- [x] Environment-driven API base URL (no hardcoded fallback)
- [x] API timeout and retry-safe request handling
- [x] Auth initialization with robust invalid-token handling

## CI/CD and Security
- [x] CI workflow for backend tests and frontend build
- [x] Separate staging build workflow
- [x] Dependency review workflow for PRs

## Operational Readiness
- [x] Architecture docs updated
- [x] Runbook with incident and rollback procedure
