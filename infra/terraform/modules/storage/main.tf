resource "google_storage_bucket" "party_backups" {
  name     = "party-app-backups-${var.project_id}" 
  location = var.bucket_location
  project  = var.project_id

  storage_class = "STANDARD"

  versioning {
    enabled = true
  }

  uniform_bucket_level_access = true

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age = 30 
    }
  }

  force_destroy = false
}

resource "google_service_account" "backup_sa" {
  account_id   = "party-backup"
  display_name = "Service Account for automated PostgreSQL backups"
  project      = var.project_id
}

resource "google_project_iam_member" "backup_sa_storage" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.backup_sa.email}"
}

resource "google_project_iam_member" "backup_sa_logging" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.backup_sa.email}"
}

resource "google_service_account_iam_binding" "workload_identity_binding" {
  service_account_id = google_service_account.backup_sa.name
  role               = "roles/iam.workloadIdentityUser"
  members = [
    "serviceAccount:${var.project_id}.svc.id.goog[party/backup-job]"
  ]
}