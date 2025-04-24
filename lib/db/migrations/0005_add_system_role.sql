-- Migration file: 0005_add_system_role.sql

-- Create Enum for system roles
DO $$ BEGIN
    CREATE TYPE system_role AS ENUM ('superadmin', 'moderator');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Add system_role column to users table
ALTER TABLE users
ADD COLUMN system_role system_role; -- Defaults to NULL

-- Optional: Grant superadmin role to a specific user
-- UPDATE users SET system_role = 'superadmin' WHERE email = 'your_admin_email@example.com'; 