ALTER TABLE "event_details" RENAME TO "events_details";--> statement-breakpoint
ALTER TABLE "events_details" DROP CONSTRAINT "event_details_event_id_events_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events_details" ADD CONSTRAINT "events_details_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
