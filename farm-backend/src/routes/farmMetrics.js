const express = require('express');
const router = express.Router();
const { getFarmMetrics, updateFarmMetrics, updateTotalEggs } = require('../controllers/farmMetricsController');
const auth = require('../middleware/auth');

// Get farm metrics (accessible to all authenticated users)
router.get('/', auth, getFarmMetrics);

// Update farm metrics (admin only)
router.put('/', auth, updateFarmMetrics);

// Update total eggs from production data (admin only)
router.post('/update-eggs', auth, updateTotalEggs);

module.exports = router;



<<<<<<< HEAD



=======
>>>>>>> 29f384aae82d1760c7f378f3db37cf8074b26258
