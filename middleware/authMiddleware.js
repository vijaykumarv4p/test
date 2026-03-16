exports.restrictToSelfOrAdmin = (req, res, next) => {
  const resourceId = req.params.id;

  if (req.user.role === 'admin') {
    return next();
  }

  if (req.user._id.toString() !== resourceId) {
    return next(
      new AppError('You are not allowed to modify this resource', 403),
    );
  }

  next();
};

// exports.isAuthorized = (...roles) => {
//   return (req, res, next) => {
//     console.log('roles', roles, req?.user?.role);

//     if (!roles.includes(req?.user?.role)) {
//       return next(
//         new AppError('You do not have permission to perform this action', 403),
//       );
//     }
//     next();
//   };
// };
// exports.isAuthenticated = asyncHandler(async (req, res, next) => {
//   // const token = req.cookies?.authToken;

//   const token = req.headers?.authorization?.startsWith('Bearer')
//     ? req.headers?.authorization.split(' ')[1]
//     : null;

//   if (!token) {
//     return next(
//       new AppError('You are not logged in! Please log in to get access.', 403),
//     );
//   }
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   req.user = decoded;
//   console.log('Decoded user from token:', decoded, req.user);
//   next();
// });
