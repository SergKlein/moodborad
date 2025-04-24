-- Migration file: 0004_add_generation_prompts.sql

-- Create Enums for Generation Prompts
DO $$ BEGIN
    CREATE TYPE generation_tool_type AS ENUM ('design', 'redisign', 'textures', 'restyle', 'recolor', 'referenced', 'idea');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE generation_design_type AS ENUM ('Interior', 'Exterior', 'Garden', 'General');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE generation_prompt_role AS ENUM ('system', 'user', 'assistant');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Create generation_prompts Table
CREATE TABLE IF NOT EXISTS generation_prompts (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    tool_type generation_tool_type,
    design_type generation_design_type,
    role generation_prompt_role DEFAULT 'system',
    prompt_template TEXT NOT NULL,
    negative_prompt TEXT,
    variables JSONB,
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Optional: Add index for faster lookups by type
CREATE INDEX IF NOT EXISTS idx_generation_prompts_type ON generation_prompts (tool_type, design_type); 