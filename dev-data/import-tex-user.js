const fs = require('fs');

const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

dotenv.config({ path: '../config.env' });
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
