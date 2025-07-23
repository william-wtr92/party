output "kubeconfig_command" {
  value = "Run this command to connect to the cluster:\ngcloud container clusters get-credentials ${google_container_cluster.primary.name} --region ${var.region} --project ${var.project_id}"
}