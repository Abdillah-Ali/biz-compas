CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('cash', 'bank', 'mobile')),
    balance DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE transactions ADD COLUMN payment_method VARCHAR(50);
ALTER TABLE transactions ADD COLUMN account_id UUID REFERENCES accounts(id) ON DELETE SET NULL;
