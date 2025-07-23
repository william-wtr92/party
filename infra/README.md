# 🚀 Global Infrastructure Bootstrap Guide

> **Before you begin:**  
> Make sure you have followed the detailed instructions in:
> - [`infra/terraform/README.md`](./terraform/README.md)
> - [`infra/helm/party/README.md`](./helm/party/README.md)
> - [`infra/argo/README.md`](./argo/README.md)

---

## 1. Provision GCP with Terraform

```bash
cd infra/terraform
terraform init
terraform apply
```

This will create:
- a GKE cluster
- an `eso-creds.json` key for External Secrets

---

## 2. Inject the ESO Key into Kubernetes

```bash
kubectl create namespace external-secrets

kubectl create secret generic eso-gcp-creds \
  --from-file=credentials.json=eso-creds.json \
  -n external-secrets
```

---

## 3. Install Helm Dependencies

```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo add external-secrets https://charts.external-secrets.io
helm repo update
```

---

## 4. Install Argo CD and External Secrets

```bash
helm install argocd argo/argo-cd \
  -n argocd --create-namespace \
  --set installCRDs=true

helm install external-secrets external-secrets/external-secrets \
  -n external-secrets --create-namespace \
  --set installCRDs=true \
  --set secretStore.gcp.secretAccessSA.email=$(terraform output -raw eso_reader_email)
```

---

## 5. Declare the Application in Argo CD

```bash
kubectl apply -f infra/argo/application.yaml -n argocd
```

---

## ✅ Next Steps

- Access Argo CD ([see argo/README.md](./argo/README.md))
- Manage secrets ([see helm/party/README.md](./helm/party/README.md))