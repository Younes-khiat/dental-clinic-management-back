const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/admin');
const medicControllers = require('../controllers/medic');

//route for admin home page
router.get('/', adminControllers.getAdminHomeData);

//route for admin all medics
router.get('/medics', adminControllers.getAdminMedics);

//route for admin all stock
router.get('/stock', adminControllers.getAdminStock);

//router forget calendar for a specific medic
router.get('/medics/medic', medicControllers.getMedicCalendar);

//router for get suivi patients for a specific medic
router.get('/medics/suiviPatients', medicControllers.getMedicSuiviPatients);

//router for addin a medic
router.post('/medics/addMedic', adminControllers.addMedic);

//editing stock
router.post('/removeFromStock', medicControllers.removeItemFromStock);

// add item to stock
router.post('/stock/addStock', adminControllers.addItemToStock);

module.exports = router;