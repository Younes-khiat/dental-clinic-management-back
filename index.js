const express = require('express');
const userRouter = require('./routes/users');
const clientRouter = require('./routes/client');
const medicRouter = require('./routes/medic');
const adminRouter = require('./routes/admin');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use('/users', userRouter);
app.use('/client', clientRouter);
app.use('/medic', medicRouter);
app.use('/admin', adminRouter);

app.listen(3006, () => {
    console.log("Server is listening on port 3006");
});