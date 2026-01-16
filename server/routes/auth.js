const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const pinAuthController = require('../controllers/pinAuthController');

router.post(
    '/signup',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    authController.signup
);

router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);

// PIN Authentication Routes (Mobile)
router.post('/pin-login', pinAuthController.loginWithPin);
router.post('/set-pin', auth, pinAuthController.setPin);
router.get('/check-pin-status', pinAuthController.checkPinStatus);
router.post('/migrate-to-pin', pinAuthController.migrateToPin);

module.exports = router;
