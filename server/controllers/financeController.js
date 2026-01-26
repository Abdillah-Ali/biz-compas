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
    const { business_id, type, amount, category, description, date, payment_method, account_id } = req.body;
    try {
        // Start a transaction
        await db.query('BEGIN');

        const newTransaction = await db.query(
            'INSERT INTO transactions (business_id, user_id, type, amount, category, description, date, payment_method, account_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [business_id, req.user.id, type, amount, category, description, date, payment_method, account_id]
        );

        // Update account balance if account_id is provided
        if (account_id) {
            const balanceChange = type === 'income' ? amount : -amount;
            await db.query(
                'UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3',
                [balanceChange, account_id, req.user.id]
            );
        }

        await db.query('COMMIT');
        res.json(newTransaction.rows[0]);
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Accounts
exports.getAccounts = async (req, res) => {
    try {
        const accounts = await db.query('SELECT * FROM accounts WHERE user_id = $1', [req.user.id]);
        res.json(accounts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addAccount = async (req, res) => {
    const { name, type, balance } = req.body;
    try {
        const newAccount = await db.query(
            'INSERT INTO accounts (user_id, name, type, balance) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, name, type, balance || 0]
        );
        res.json(newAccount.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
