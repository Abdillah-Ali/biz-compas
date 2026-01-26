const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
    const client = await pool.connect();
    try {
        console.log('🔄 Running Accounts migration...');

        await client.query(`
            CREATE TABLE IF NOT EXISTS accounts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL CHECK (type IN ('cash', 'bank', 'mobile')),
                balance DECIMAL(15, 2) DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Check if columns exist before adding them
        const checkTransactions = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'transactions' AND (column_name = 'payment_method' OR column_name = 'account_id');
        `);

        const existingColumns = checkTransactions.rows.map(r => r.column_name);

        if (!existingColumns.includes('payment_method')) {
            await client.query('ALTER TABLE transactions ADD COLUMN payment_method VARCHAR(50);');
            console.log('   - Added payment_method column to transactions');
        }

        if (!existingColumns.includes('account_id')) {
            await client.query('ALTER TABLE transactions ADD COLUMN account_id UUID REFERENCES accounts(id) ON DELETE SET NULL;');
            console.log('   - Added account_id column to transactions');
        }

        console.log('✅ Accounts migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();
