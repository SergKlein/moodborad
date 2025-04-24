DO $$ BEGIN
    CREATE TYPE collaborator_role AS ENUM ('viewer', 'editor', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('active', 'archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    CREATE TYPE project_visibility AS ENUM ('private', 'public');
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "board_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"position" text NOT NULL,
	"size" text,
	"z_index" integer DEFAULT 0 NOT NULL,
	"board_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "boards" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"project_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "project_collaborators" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" "collaborator_role" DEFAULT 'viewer' NOT NULL,
	"project_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "project_rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_type" text NOT NULL,
	"project_id" serial NOT NULL
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"visibility" "project_visibility" DEFAULT 'private' NOT NULL,
	"design_style" text,
	"color_preferences" text,
	"budget" text,
	"timeline" text,
	"notes" text,
	"status" "project_status" DEFAULT 'active' NOT NULL,
	"visible_to_collaborators_when_archived" boolean DEFAULT false NOT NULL,
	"user_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "users" ALTER COLUMN "name" TYPE text;
EXCEPTION WHEN undefined_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "users" ADD COLUMN "image" text;
EXCEPTION WHEN duplicate_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "board_items" 
    ADD CONSTRAINT "board_items_board_id_boards_id_fk" 
    FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") 
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "boards" 
    ADD CONSTRAINT "boards_project_id_projects_id_fk" 
    FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") 
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "project_collaborators" 
    ADD CONSTRAINT "project_collaborators_project_id_projects_id_fk" 
    FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") 
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "project_collaborators" 
    ADD CONSTRAINT "project_collaborators_user_id_users_id_fk" 
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") 
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "project_rooms" 
    ADD CONSTRAINT "project_rooms_project_id_projects_id_fk" 
    FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") 
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "projects" 
    ADD CONSTRAINT "projects_user_id_users_id_fk" 
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") 
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "users" DROP COLUMN "password_hash";
EXCEPTION WHEN undefined_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "users" DROP COLUMN "role";
EXCEPTION WHEN undefined_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "users" DROP COLUMN "deleted_at";
EXCEPTION WHEN undefined_column THEN null; END $$;