ALTER TABLE "events_participants" ALTER COLUMN "payement_status" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "events_participants" ALTER COLUMN "payement_status" SET NOT NULL;