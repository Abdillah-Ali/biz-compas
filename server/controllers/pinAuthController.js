const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Set or update user PIN (mobile only)
exports.setPin = async (req, res) => {
    try {
        const { pin, confirmPin } = req.body;
        const userId = req.user.id; // From auth middleware

        // Validate PIN
        if (!pin || !confirmPin) {
            return res.status(400).json({ message: 'PIN and confirmation required' });
        }

        if (pin !== confirmPin) {
            return res.status(400).json({ message: 'PINs do not match' });
        }

        if (!/^\d{4}$/.test(pin)) {
            return res.status(400).json({ message: 'PIN must be exactly 4 digits' });
        }

        // Hash the PIN
        const pin_hash = await bcrypt.hash(pin, 10);

        // Update user's PIN
        await pool.query(
            'UPDATE users SET pin_hash = $1, pin_set = TRUE, pin_attempts = 0, pin_locked_until = NULL WHERE id = $2',
            [pin_hash, userId]
        );

        res.json({
            success: true,
            message: 'PIN set successfully'
        });
    } catch (error) {
        console.error('Set PIN error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login with PIN (mobile only)
exports.loginWithPin = async (req, res) => {
    try {
        const { email, pin } = req.body;

        // Validate input
        if (!email || !pin) {
            return res.status(400).json({ message: 'Email and PIN required' });
        }

        if (!/^\d{4}$/.test(pin)) {
            return res.status(400).json({ message: 'Invalid PIN format' });
        }

        // Get user
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if PIN is set
        if (!user.pin_set || !user.pin_hash) {
            return res.status(403).json({
                message: 'PIN not set',
                requirePinSetup: true,
                userId: user.id
            });
        }

        // Check if account is locked
        if (user.pin_locked_until && new Date(user.pin_locked_until) > new Date()) {
            const lockMinutes = Math.ceil((new Date(user.pin_locked_until) - new Date()) / 60000);
            return res.status(429).json({
                message: `Too many failed attempts. Try again in ${lockMinutes} minute(s)`,
                locked: true,
                lockedUntil: user.pin_locked_until
            });
        }

        // Verify PIN
        const validPin = await bcrypt.compare(pin, user.pin_hash);

        if (!validPin) {
            // Increment failed attempts
            const newAttempts = (user.pin_attempts || 0) + 1;
            let lockUntil = null;

            // Lock account after 5 failed attempts
            if (newAttempts >= 5) {
                lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
                await pool.query(
                    'UPDATE users SET pin_attempts = $1, pin_locked_until = $2 WHERE id = $3',
                    [newAttempts, lockUntil, user.id]
                );
                return res.status(429).json({
                    message: 'Too many failed attempts. Account locked for 15 minutes.',
                    locked: true,
                    lockedUntil: lockUntil
                });
            }

            await pool.query(
                'UPDATE users SET pin_attempts = $1 WHERE id = $2',
                [newAttempts, user.id]
            );

            const attemptsLeft = 5 - newAttempts;
            return res.status(401).json({
                message: `Invalid PIN. ${attemptsLeft} attempt(s) remaining`,
                attemptsLeft
            });
        }

        // Reset failed attempts on successful login
        await pool.query(
            'UPDATE users SET pin_attempts = 0, pin_locked_until = NULL WHERE id = $1',
            [user.id]
        );

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('PIN login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Check PIN status
exports.checkPinStatus = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: 'Email required' });
        }

        const result = await pool.query(
            'SELECT id, email, pin_set FROM users WHERE email = $1',
            [email]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            pinSet: user.pin_set || false,
            userId: user.id
        });
    } catch (error) {
        console.error('Check PIN status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update existing password to temporary PIN (for migration)
exports.migrateToPin = async (req, res) => {
    try {
        const { email, password, pin, confirmPin } = req.body;

        // Validate input
        if (!email || !password || !pin || !confirmPin) {
            return res.status(400).json({ message: 'All fields required' });
        }

        if (pin !== confirmPin) {
            return res.status(400).json({ message: 'PINs do not match' });
        }

        if (!/^\d{4}$/.test(pin)) {
            return res.status(400).json({ message: 'PIN must be exactly 4 digits' });
        }

        // Verify password first
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Hash and set PIN
        const pin_hash = await bcrypt.hash(pin, 10);

        await pool.query(
            'UPDATE users SET pin_hash = $1, pin_set = TRUE, pin_attempts = 0, pin_locked_until = NULL WHERE id = $2',
            [pin_hash, user.id]
        );

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'PIN created successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Migrate to PIN error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
