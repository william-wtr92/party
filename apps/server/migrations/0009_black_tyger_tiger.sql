CREATE TABLE IF NOT EXISTS "address_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address_id" uuid NOT NULL,
	"user_id" uuid,
	"event_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP MATERIALIZED VIEW "public"."event_summary";--> statement-breakpoint
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_event_id_events_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address_links" ADD CONSTRAINT "address_links_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address_links" ADD CONSTRAINT "address_links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address_links" ADD CONSTRAINT "address_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN IF EXISTS "event_id";--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."event_summary" WITH (autovacuum_enabled = true) AS (select "events"."id", "events"."name", "events"."type", "addresses"."city", "addresses"."region", "events"."start_date", "events"."end_date", "events"."slots", "events"."remaining_slots", "events"."free", "events"."price", "events"."created_at" from "events" inner join "address_links" on "events"."id" = "address_links"."event_id" inner join "addresses" on "address_links"."address_id" = "addresses"."id" where "events"."remaining_slots" > 0);