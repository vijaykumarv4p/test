const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const express = require('express');
const mongoose = require('mongoose');
// const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const cookieParser = require('cookie-parser');

const toursRouter = require('./routers/toursRouter');
const userRouter = require('./routers/userRouter');
const authRouter = require('./routers/authRouter');
const uploadRouter = require('./routers/uploadRouter');
const { unknownRoute } = require('./routers/unknownRouter');
const commanRouter = require('./routers/commanRouter');
const helmet = require('helmet');
const { xssSanitizer } = require('./middleware/xssSanitizer');
const { mongoSanitizer } = require('./middleware/mongoSanitizer');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
const cors = require('cors');
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
app.use(
  cors({
    origin: '*',
    exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length'],
  }),
); // enables CORS for all routes

app.use(express.json({ limit: '10kb' })); // body parser, reading data from body into req.body
app.use(cookieParser()); // cookie parser
app.use(helmet()); // headers security
app.use(xssSanitizer); // data sanitization against XSS
app.use(mongoSanitizer); // data sanitization against NoSQL query injection
app.use(hpp({ whitelist: [] })); // prevent parameter pollution
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public')); // for serving static files
app.use('/api', limiter); // limit requests from same API

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/video', commanRouter);
app.use(unknownRoute);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
