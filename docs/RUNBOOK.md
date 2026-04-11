# HackOps Operations Runbook

## Startup checks
1. Confirm `backend-node/.env` has valid `JWT_SECRET`, `MONGODB_URI`, `CORS_ORIGIN`.
2. Verify DB connectivity using `GET /api/health/ready`.
3. Confirm auth flow using `POST /api/auth/login` and `GET /api/auth/me`.

## Incident response
1. Identify failing request `requestId` from client response/error.
2. Search backend logs by `requestId`.
3. Validate DB connection status and restart service if needed.
4. Roll back to previous deployment artifact if issue is release-related.

## Rollback
1. Re-deploy previous known-good backend container/build.
2. Re-run health and readiness checks.
3. Confirm login/profile retrieval works end-to-end.

## Data safety
- Ensure MongoDB backups are scheduled by hosting platform.
- Validate backup restore process at least monthly in staging.
