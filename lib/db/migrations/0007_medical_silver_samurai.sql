DO $$ BEGIN
    CREATE TYPE "public"."system_role" AS ENUM('superadmin', 'moderator');
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint

DO $$ BEGIN
    -- Проверяем существование таблицы users
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
    ) THEN
        ALTER TABLE "users" ADD COLUMN "system_role" "system_role";
    END IF;
EXCEPTION WHEN duplicate_column THEN null; END $$;