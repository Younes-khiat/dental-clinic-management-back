const express = require('express');
const router = express.Router();
const medicControllers = require('../controllers/medic');

router.get('/', medicControllers.getMedicHomeData);

module.exports = router;
