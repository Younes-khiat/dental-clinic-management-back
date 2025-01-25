const express = require('express');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/users');
const clientRouter = require('./routes/client');
const medicRouter = require('./routes/medic');
const adminRouter = require('./routes/admin');
const cors = require('cors');

const app = express();
app.use(cookieParser());
require('dotenv').config();
const path = require('path');

// Allow requests from specific origin
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // If you need to allow cookies or authentication headers
  }));

app.use(express.json());
app.use('/users', userRouter);
app.use('/client', clientRouter);
app.use('/medic', medicRouter);
app.use('/admin', adminRouter);

app.listen(3006, () => {
    console.log("Server is listening on port 3006");
});