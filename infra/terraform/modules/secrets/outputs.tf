output "eso_reader_email" {
  value       = google_service_account.eso_reader.email
  description = "Email of the service account used by ESO"
}

output "eso_reader_key" {
  value       = google_service_account_key.eso_reader_key.private_key
  sensitive   = true
  description = "Private key (JSON) of the ESO service account"
}
