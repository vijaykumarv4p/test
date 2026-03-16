exports.mongoSanitizer = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj) return;

    Object.keys(obj).forEach((key) => {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    });
  };

  sanitize(req.body);
  sanitize(req.params);
  sanitize(req.query);

  next();
};
