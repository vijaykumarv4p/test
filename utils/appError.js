class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    console.log('AppError : ', message, statusCode);
    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
