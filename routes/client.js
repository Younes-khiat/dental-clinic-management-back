const express = require('express');
const router = express.Router();
const clientControllers = require('../controllers/client');
const { getDates } = require('../models/client');
//route for client home page
router.get('/', clientControllers.getClientHomeData);

//route for client reserving
router.post('/reserve', clientControllers.reserve);
router.get('/dates', clientControllers.getDates);

module.exports = router;