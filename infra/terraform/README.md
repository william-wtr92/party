# 🌍 Terraform GCP Infrastructure – Party Project

Infrastructure as Code using Terraform to deploy the GCP backend for the Party platform.

## 🧱 Modular Architecture

The `infra/terraform/` directory follows a modular approach:

```
infra/
├── terraform/
│   ├── main.tf              # Module declarations
│   ├── variables.tf         # Global variables
│   ├── outputs.tf           # Global outputs (ESO key, etc.)
│   ├── modules/
│   │   ├── k8s/             # GKE Cluster
│   │   └── secrets/         # Secrets for ESO (Google Secret Manager + Service Account)
```

## ⚙️ Modules

### modules/k8s/

Provisions a Kubernetes (GKE) cluster with:

- An autoscaled node pool
- A regional cluster
- Credentials retrievable via `get-credentials`

### modules/secrets/

Provisions:

- Secrets in Secret Manager
- A Service Account with the Secret Manager Secret Accessor role
- A JSON key exported as output, used by External Secrets Operator (ESO) in Kubernetes

## 🚧 Prerequisites

- Google Cloud SDK (`gcloud`)
- Terraform CLI (>= 1.3)
- An initialized GCP project with billing enabled

## ✅ Enable Required APIs

```bash
gcloud services enable compute.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

## 🚀 Deployment

### 1. Configure Variables

Set in `terraform.tfvars` or via command line:

```hcl
project_id   = "party-XXXX"
region       = "europe-west1-[b|c|d]"

secrets = {
    DB_PASSWORD              = ""
    REDIS_PASSWORD           = ""
    SECURITY_JWT_SECRET      = ""
    SECURITY_PASSWORD_PEPPER = ""
    SECURITY_COOKIE_SECRET   = ""
    METRICS_PASSWORD         = ""
}
```

### 2. Initialize Terraform

```bash
cd infra/terraform
terraform init
```

### 3. Apply Infrastructure

```bash
terraform apply
```

### 4. Retrieve Credentials to Interact with GKE Cluster

```bash
gcloud container clusters get-credentials party-cluster \
  --region europe-west1-b \
  --project party-XXXX
```

Replace `b` if your cluster is in another zone (e.g., `europe-west1-c`).

## 🔐 ESO Key for External Secrets

After applying, extract the ESO key (Service Account JSON):

```bash
terraform output -raw eso_reader_key > eso-creds.json
```

Then create the secret in Kubernetes:

```bash
kubectl create namespace external-secrets

kubectl create secret generic eso-gcp-creds \
  --from-file=credentials.json=eso-creds.json \
  -n external-secrets
```