const db = require('../db');

// Businesses
exports.getBusinesses = async (req, res) => {
    try {
        const businesses = await db.query('SELECT * FROM businesses WHERE user_id = $1', [req.user.id]);
        res.json(businesses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addBusiness = async (req, res) => {
    const { name, category, color } = req.body;
    try {
        const newBusiness = await db.query(
            'INSERT INTO businesses (user_id, name, category, color) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, name, category, color || '#3b82f6']
        );
        res.json(newBusiness.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await db.query(
            'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
            [req.user.id]
        );
        res.json(transactions.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addTransaction = async (req, res) => {
    const { business_id, type, amount, category, description, date } = req.body;
    try {
        const newTransaction = await db.query(
            'INSERT INTO transactions (business_id, user_id, type, amount, category, description, date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [business_id, req.user.id, type, amount, category, description, date]
        );
        res.json(newTransaction.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
