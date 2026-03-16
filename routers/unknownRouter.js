const AppError = require('../utils/appError');
exports.unknownRoute = (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} request!`, 404));
};
