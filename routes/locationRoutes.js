const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController.js');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/update', authMiddleware, locationController.updateLocation);
router.get('/nearby', authMiddleware, locationController.getNearbyEducators);

module.exports = router;