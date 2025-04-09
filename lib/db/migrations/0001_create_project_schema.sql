-- Create enums
DO $$ BEGIN
    CREATE TYPE project_visibility AS ENUM ('private', 'public');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('active', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE collaborator_role AS ENUM ('viewer', 'editor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    visibility project_visibility NOT NULL DEFAULT 'private',
    design_style TEXT,
    color_preferences TEXT,
    budget TEXT,
    timeline TEXT,
    notes TEXT,
    status project_status NOT NULL DEFAULT 'active',
    visible_to_collaborators_when_archived BOOLEAN NOT NULL DEFAULT FALSE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create project rooms table
CREATE TABLE IF NOT EXISTS project_rooms (
    id SERIAL PRIMARY KEY,
    room_type TEXT NOT NULL,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE
);

-- Create project collaborators table
CREATE TABLE IF NOT EXISTS project_collaborators (
    id SERIAL PRIMARY KEY,
    role collaborator_role NOT NULL DEFAULT 'viewer',
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Create boards table
CREATE TABLE IF NOT EXISTS boards (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create board items table
CREATE TABLE IF NOT EXISTS board_items (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    position TEXT NOT NULL, -- JSON as text: { x: number, y: number }
    size TEXT, -- JSON as text: { width: number, height: number }
    z_index INTEGER NOT NULL DEFAULT 0,
    board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_visibility ON projects(visibility);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_rooms_project_id ON project_rooms(project_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_project_id ON project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_user_id ON project_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_boards_project_id ON boards(project_id);
CREATE INDEX IF NOT EXISTS idx_board_items_board_id ON board_items(board_id); 