export function sendSuccess(res, data, message, statusCode = 200) {
  const response = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

export function sendError(res, error, statusCode = 500) {
  const response = {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

