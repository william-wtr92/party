ALTER TABLE "participants" RENAME TO "events_participants";--> statement-breakpoint
ALTER TABLE "events_participants" DROP CONSTRAINT "participants_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "events_participants" DROP CONSTRAINT "participants_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events_participants" ADD CONSTRAINT "events_participants_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events_participants" ADD CONSTRAINT "events_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
