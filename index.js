const express = require('express');
const userRouter = require('./routes/users');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use('/users',userRouter);
app.use('/home',homeRouter);

app.listen(3006, () => {
    console.log("Server is listening on port 3006");
});