const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
let toursRouter = require('./routers/toursRouter');

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
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// test mongodb

// const userSchema = mongoose.Schema({
//   userName: {
//     type: String,
//     unique: true,
//     required: [true, 'User name is required'],
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//   },
// });

// const user = mongoose.model('User', userSchema);
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
