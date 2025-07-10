ALTER TABLE "address_links" DROP CONSTRAINT "address_links_address_id_addresses_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address_links" ADD CONSTRAINT "address_links_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
