const fs = require('fs');
const express = require('express');
const port = 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let toursRouter = require('./routers/toursRouter');

app.use('/api/v1/tours', toursRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
