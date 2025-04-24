DO $$ BEGIN
    CREATE TYPE "public"."generation_design_type" AS ENUM('Interior', 'Exterior', 'Garden', 'General');
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    CREATE TYPE "public"."generation_prompt_role" AS ENUM('system', 'user', 'assistant');
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    CREATE TYPE "public"."generation_tool_type" AS ENUM('design', 'redisign', 'textures', 'restyle', 'recolor', 'referenced', 'idea');
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "generation_prompts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"tool_type" "generation_tool_type",
	"design_type" "generation_design_type",
	"role" "generation_prompt_role" DEFAULT 'system',
	"prompt_template" text NOT NULL,
	"negative_prompt" text,
	"variables" jsonb,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "generation_prompts_name_unique" UNIQUE("name")
);--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "project_rooms" RENAME TO "rooms";
EXCEPTION WHEN undefined_table THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "board_items" RENAME TO "space_items";
EXCEPTION WHEN undefined_table THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "boards" RENAME TO "spaces";
EXCEPTION WHEN undefined_table THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "space_items" RENAME COLUMN "board_id" TO "space_id";
EXCEPTION WHEN undefined_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "space_items" DROP CONSTRAINT "board_items_board_id_boards_id_fk";
EXCEPTION WHEN undefined_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "spaces" DROP CONSTRAINT "boards_project_id_projects_id_fk";
EXCEPTION WHEN undefined_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "rooms" DROP CONSTRAINT "project_rooms_project_id_projects_id_fk";
EXCEPTION WHEN undefined_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "space_items" ALTER COLUMN "type" SET DATA TYPE varchar;
EXCEPTION WHEN undefined_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "space_items" ALTER COLUMN "content" SET DATA TYPE jsonb USING CASE 
        WHEN content IS NULL THEN NULL 
        WHEN content::text = '' THEN '{}'::jsonb 
        ELSE content::jsonb 
    END;
    ALTER TABLE "space_items" ALTER COLUMN "content" DROP NOT NULL;
EXCEPTION WHEN undefined_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "space_items" ALTER COLUMN "position" SET DATA TYPE jsonb USING CASE 
        WHEN position IS NULL THEN NULL 
        WHEN position::text = '' THEN '{}'::jsonb 
        ELSE position::jsonb 
    END;
    ALTER TABLE "space_items" ALTER COLUMN "position" DROP NOT NULL;
EXCEPTION WHEN undefined_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "space_items" ALTER COLUMN "size" SET DATA TYPE jsonb USING CASE 
        WHEN size IS NULL THEN NULL 
        WHEN size::text = '' THEN '{}'::jsonb 
        ELSE size::jsonb 
    END;
EXCEPTION WHEN undefined_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "spaces" ALTER COLUMN "name" SET DATA TYPE varchar;
EXCEPTION WHEN undefined_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "space_items" ADD COLUMN "style" jsonb;
EXCEPTION WHEN duplicate_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "spaces" ADD COLUMN "room_id" serial NOT NULL;
EXCEPTION WHEN duplicate_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "spaces" ADD COLUMN "type" varchar;
EXCEPTION WHEN duplicate_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "rooms" ADD COLUMN "name" varchar NOT NULL;
EXCEPTION WHEN duplicate_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "rooms" ADD COLUMN "description" text;
EXCEPTION WHEN duplicate_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "rooms" ADD COLUMN "type" varchar;
EXCEPTION WHEN duplicate_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "rooms" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
EXCEPTION WHEN duplicate_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "rooms" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;
EXCEPTION WHEN duplicate_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "space_items" ADD CONSTRAINT "space_items_space_id_spaces_id_fk" 
    FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") 
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "spaces" ADD CONSTRAINT "spaces_project_id_projects_id_fk" 
    FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") 
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "spaces" ADD CONSTRAINT "spaces_room_id_rooms_id_fk" 
    FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") 
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "rooms" ADD CONSTRAINT "rooms_project_id_projects_id_fk" 
    FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") 
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "space_items" DROP COLUMN "z_index";
EXCEPTION WHEN undefined_column THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "rooms" DROP COLUMN "room_type";
EXCEPTION WHEN undefined_column THEN null; END $$;