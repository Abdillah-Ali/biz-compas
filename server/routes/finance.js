const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const auth = require('../middleware/auth');

// Businesses
router.get('/businesses', auth, financeController.getBusinesses);
router.post('/businesses', auth, financeController.addBusiness);

// Transactions
router.get('/transactions', auth, financeController.getTransactions);
router.post('/transactions', auth, financeController.addTransaction);

// Accounts
router.get('/accounts', auth, financeController.getAccounts);
router.post('/accounts', auth, financeController.addAccount);

module.exports = router;
