## K8S
module "k8s" {
  source       = "./modules/k8s"
  project_id   = var.project_id
  region       = var.region
  cluster_name = var.cluster_name
  pool_name    = var.pool_name
}

## Secrets - ESO
module "eso" {
  source     = "./modules/secrets"
  project_id = var.project_id
  secrets    = var.secrets
}