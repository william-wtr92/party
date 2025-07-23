output "eso_reader_email" {
  value       = module.eso.eso_reader_email
  description = "Email of the ESO service account"
}

output "eso_reader_key" {
  value       = module.eso.eso_reader_key
  sensitive   = true
  description = "Private key (JSON) for ESO GCP service account"
}
