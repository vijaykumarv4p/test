const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
let toursRouter = require('./routers/toursRouter');
let userRouter = require('./routers/userRouter');
dotenv.config({ path: './config.env' });
mongoose.set('debug', true);
const port = process.env.PORT;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DBPASSWORD);

const connectDB = async () => {
  try {
    const res = await mongoose.connect(DB, {});
    console.error('DB Connected to:', res.connection.host);
  } catch (error) {
    console.error('DB Connection error : ', error.message);
  }
};
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// const newUser = new user({
//   userName: 'vijay',
//   password: 'mypassword',
// });

// newUser
//   .save()
//   .then((res) => {
//     console.log('New user ', res);
//   })
//   .catch((error) => {
//     console.log(' error ', error);
//   });
