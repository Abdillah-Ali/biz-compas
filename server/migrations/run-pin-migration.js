const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
    const client = await pool.connect();
    try {
        console.log('🔄 Running PIN authentication migration...');

        await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS pin_hash VARCHAR(255),
            ADD COLUMN IF NOT EXISTS pin_set BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS pin_attempts INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS pin_locked_until TIMESTAMP WITH TIME ZONE;
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_users_pin_set ON users(pin_set);
        `);

        console.log('✅ Migration completed successfully!');
        console.log('   - Added pin_hash column');
        console.log('   - Added pin_set column');
        console.log('   - Added pin_attempts column');
        console.log('   - Added pin_locked_until column');
        console.log('   - Created index on pin_set');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();
