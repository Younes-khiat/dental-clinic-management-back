const express = require('express');
const router = express.Router();
const clientControllers = require('../controllers/client');

router.get('/', clientControllers.getClientHomeData);

module.exports = router;