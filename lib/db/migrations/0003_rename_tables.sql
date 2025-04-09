-- Rename project_rooms to rooms
ALTER TABLE project_rooms RENAME TO rooms;

-- Rename boards to spaces
ALTER TABLE boards RENAME TO spaces;

-- Rename board_items to space_items
ALTER TABLE board_items RENAME TO space_items;

-- Rename foreign key constraints
ALTER TABLE spaces 
  RENAME CONSTRAINT boards_project_id_projects_id_fk 
  TO spaces_project_id_projects_id_fk;

ALTER TABLE space_items 
  RENAME CONSTRAINT board_items_board_id_boards_id_fk 
  TO space_items_space_id_spaces_id_fk;

-- Rename columns
ALTER TABLE space_items 
  RENAME COLUMN board_id TO space_id; 