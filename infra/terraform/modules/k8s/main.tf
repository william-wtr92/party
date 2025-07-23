resource "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.region

  remove_default_node_pool = true
  initial_node_count       = 1

  ip_allocation_policy {}

  timeouts {
    create = "30m"
    update = "40m"
  }
}

resource "google_container_node_pool" "primary_nodes" {
  name       = var.pool_name
  location   = var.region
  cluster    = google_container_cluster.primary.name

  node_config {
    machine_type = "e2-medium"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }

  node_count = 2

  timeouts {
    create = "30m"
    update = "20m"
  }
}
