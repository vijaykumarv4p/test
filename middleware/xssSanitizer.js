const xss = require('xss');

exports.xssSanitizer = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj) return;

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'string') {
        obj[key] = xss(obj[key]);
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    });
  };

  sanitize(req?.body);
  sanitize(req?.query);
  sanitize(req?.params);

  // next();
};
