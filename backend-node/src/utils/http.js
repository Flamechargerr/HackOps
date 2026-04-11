export function buildErrorBody({ code, message, requestId, details }) {
  const body = {
    error: {
      code,
      message,
      requestId,
    },
  };

  if (details) body.error.details = details;
  return body;
}

export function sendError(res, status, { code, message, requestId, details }) {
  return res.status(status).json(buildErrorBody({ code, message, requestId, details }));
}
