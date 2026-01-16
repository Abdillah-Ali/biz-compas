const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const auth = require('../middleware/auth');

router.get('/businesses', auth, financeController.getBusinesses);
router.post('/businesses', auth, financeController.addBusiness);

router.get('/transactions', auth, financeController.getTransactions);
router.post('/transactions', auth, financeController.addTransaction);

module.exports = router;
