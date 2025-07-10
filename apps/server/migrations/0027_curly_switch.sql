ALTER TABLE "events" DROP CONSTRAINT "events_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "city" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "region" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "street_number" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "street" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "country" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "postal_code" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
