const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const cookieParser = require('cookie-parser');
dotenv.config({ path: './config.env' });
const toursRouter = require('./routers/toursRouter');
const userRouter = require('./routers/userRouter');
const authRouter = require('./routers/authRouter');
const helmate = require('helmet');

const hpp = require('hpp');

const port = process.env.PORT;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DBPASSWORD);

const connectDB = async () => {
  try {
    const res = await mongoose.connect(DB, {});
    console.error('DB Connected to :', res.connection.host);
  } catch (error) {
    console.error('DB Connection error : ', error.message);
  }
};
connectDB();

const app = express();

app.use(helmate());

app.use(cookieParser());
app.use(hpp({ whitelist: [] }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} request!`, 404));
});

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// CastErrorits id error
//  ValidationError is for validation error
//11000 MongoError: Duplicate key error is for unique field duplicate error

// JsonWebTokenError is for invalid token error
// TokenExpiredError is for expired token error
// 11000 is for duplicate key error code
// 404 is for not found error
// 400 is for bad request error
// 401 is for unauthorized error
// 403 is for forbidden error
// 500 is for internal server error
// 200 is for success
// 201 is for created
// 204 is for no content
//  400 is for bad request error
// 401 is for unauthorized error
// 403 is for forbidden error
// 404 is for not found error
// 500 is for internal server error
