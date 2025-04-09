CREATE TYPE "public"."taxonomy_type" AS ENUM('room', 'space', 'idea', 'design', 'color', 'style', 'general');--> statement-breakpoint
CREATE TABLE "project_taxonomies" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" serial NOT NULL,
	"taxonomy_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "taxonomies" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "taxonomy_type" NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"icon" text,
	"color" text,
	"parent_id" integer,
	"order" integer DEFAULT 0,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "board_items" ALTER COLUMN "z_index" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "project_taxonomies" ADD CONSTRAINT "project_taxonomies_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_taxonomies" ADD CONSTRAINT "project_taxonomies_taxonomy_id_taxonomies_id_fk" FOREIGN KEY ("taxonomy_id") REFERENCES "public"."taxonomies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taxonomies" ADD CONSTRAINT "taxonomies_parent_id_taxonomies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."taxonomies"("id") ON DELETE no action ON UPDATE no action;