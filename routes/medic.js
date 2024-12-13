const express = require('express');
const router = express.Router();
const medicControllers = require('../controllers/medic');

// getting medic home data
router.get('/', medicControllers.getMedicHomeData);

// getting medic's calendar
router.get('/calendar', medicControllers.getMedicCalendar);

// getting medic's suivi patients
router.get('/suiviPatients', medicControllers.getMedicSuiviPatients);

//adding new client to suivi patients
router.post('/suiviPatients/addClient', medicControllers.addClientToSuiviPatients);

router.post('/removeFromStock', medicControllers.removeItemFromStock);

module.exports = router;
