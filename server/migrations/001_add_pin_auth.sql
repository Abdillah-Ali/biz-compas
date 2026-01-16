-- Migration: Add PIN authentication fields to users table
-- Run this script to update the database for mobile PIN login

ALTER TABLE users 
ADD COLUMN pin_hash VARCHAR(255),
ADD COLUMN pin_set BOOLEAN DEFAULT FALSE,
ADD COLUMN pin_attempts INTEGER DEFAULT 0,
ADD COLUMN pin_locked_until TIMESTAMP WITH TIME ZONE;

-- Create index for faster PIN lookup
CREATE INDEX idx_users_pin_set ON users(pin_set);

COMMENT ON COLUMN users.pin_hash IS 'Bcrypt hashed 4-digit PIN for mobile authentication';
COMMENT ON COLUMN users.pin_set IS 'Flag indicating if user has set up their PIN';
COMMENT ON COLUMN users.pin_attempts IS 'Counter for failed PIN attempts (for rate limiting)';
COMMENT ON COLUMN users.pin_locked_until IS 'Timestamp until which PIN login is locked due to too many failed attempts';
