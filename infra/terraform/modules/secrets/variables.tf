variable "project_id" {
  description = "GCP project ID"
}

variable "secrets" {
  type        = map(string)
  description = "Map of secret keys and values for the application"
}

variable "namespace" {
  type    = string
  default = "external-secrets"
}
