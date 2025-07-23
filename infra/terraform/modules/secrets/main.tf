resource "google_secret_manager_secret" "app_secrets" {
  for_each = var.secrets

  secret_id = each.key
  
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "app_secrets_versions" {
  for_each = var.secrets

  secret      = google_secret_manager_secret.app_secrets[each.key].id
  secret_data = each.value
}

resource "google_service_account" "eso_reader" {
  account_id   = "eso-reader"
  display_name = "ESO Secret Reader"
}

resource "google_project_iam_member" "eso_reader_access" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.eso_reader.email}"
}

resource "google_service_account_key" "eso_reader_key" {
  service_account_id = google_service_account.eso_reader.name
  private_key_type   = "TYPE_GOOGLE_CREDENTIALS_FILE"
  key_algorithm      = "KEY_ALG_RSA_2048"
  keepers = {
    sa_email = google_service_account.eso_reader.email
  }
  depends_on = [google_project_iam_member.eso_reader_access]
}