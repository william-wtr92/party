DROP MATERIALIZED VIEW "public"."event_summary";--> statement-breakpoint
ALTER TABLE "events" RENAME COLUMN "date" TO "start_date";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_event_date";--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "end_date" timestamp NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_event_start_date" ON "events" USING btree ("start_date");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."event_summary" WITH (autovacuum_enabled = true) AS (select "events"."id", "events"."name", "events"."type", "addresses"."city", "addresses"."region", "events"."start_date", "events"."end_date", "events"."slots", "events"."remaining_slots", "events"."free", "events"."price", "events"."created_at" from "events" inner join "addresses" on "events"."id" = "addresses"."event_id" where "events"."remaining_slots" > 0);