ALTER TABLE "user" DROP CONSTRAINT "user_full_name_unique";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "full_name";