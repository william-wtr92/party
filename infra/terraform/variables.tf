variable "project_id" {
  description = "GCP project ID"
}

variable "region" {
  description = "value for the region"
}

variable "cluster_name" {
  default = "party-cluster"
}

variable "pool_name" {
  default = "default-pool"
}

variable "secrets" {
  type        = map(string)
  description = "Map of secret keys and values for the application"
}

variable "bucket_location" {
  description = "Location for the storage bucket"
  default     = "europe-west1"
}