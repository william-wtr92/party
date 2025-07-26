# 🌍 Global Infrastructure Bootstrap Guide

> **Before you begin:**  
> Make sure you have followed the detailed instructions in:
>
> - [`infra/terraform/README.md`](../terraform/README.md)
> - [`infra/helm/party/README.md`](../helm/party/README.md)
> - [`infra/argo/README.md`](../argo/README.md)

---

## 1️⃣ Provision GCP Infrastructure

```bash
cd infra/terraform
terraform init
terraform apply
```

This will create:

- A GKE cluster
- Google Secret Manager setup
- A service account key `eso-creds.json` for External Secrets Operator

---

## 2️⃣ Inject ESO Credentials into Kubernetes

Export the service account key:

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

---

## 3️⃣ Add Helm Repositories

```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo add external-secrets https://charts.external-secrets.io
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
```

---

## 4️⃣ Install Core Tools via Helm

### a. Argo CD

```bash
helm install argocd argo/argo-cd \
  -n argocd --create-namespace \
  --set installCRDs=true
```

### b. External Secrets Operator (ESO)

```bash
helm install external-secrets external-secrets/external-secrets \
  -n external-secrets --create-namespace \
  --set installCRDs=true
```

> ESO will use the GCP credentials secret (`eso-gcp-creds`) created earlier.

### c. Prometheus (Monitoring - Base)

```bash
helm install prometheus prometheus-community/prometheus \
  -n monitoring --create-namespace
```

This installs Prometheus with the default configuration, including Kubernetes metrics and node-exporter (already integrated in the chart).

---

### d. Grafana (Dashboards)

```bash
helm install grafana grafana/grafana \
  -n monitoring --create-namespace \
  --set adminPassword=admin \
  --set service.type=ClusterIP \
  --set persistence.enabled=true \
  --set persistence.size=2Gi
```

---

## 5️⃣ Declare the Application in Argo CD

```bash
kubectl apply -f infra/argo/application.yaml -n argocd
```

Argo CD will now sync your Helm chart from the main branch.

---

## 6️⃣ Verify Everything is Working

### Check Argo CD is ready

```bash
kubectl -n argocd rollout status deploy/argocd-server
```

### (Optional) Port-forward the Argo CD UI locally

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Then open [https://localhost:8080](https://localhost:8080) or use your public Argo CD domain.

---

### Check secrets

```bash
# ESO status
kubectl get externalsecret -n party

# Synced secrets
kubectl get secret party-secrets -n party
```

---

### Check Prometheus

```bash
kubectl -n monitoring rollout status deploy/prometheus-server
```

### Check Grafana

```bash
kubectl -n monitoring rollout status deploy/grafana
```

### Port-forward the UIs locally

**Prometheus UI**

```bash
kubectl port-forward svc/prometheus-server -n monitoring 9090:80
```

→ Access: [http://localhost:9090](http://localhost:9090)

**Grafana UI**

```bash
kubectl port-forward svc/grafana -n monitoring 3000:80
```

→ Access: [http://localhost:3000](http://localhost:3000)  
→ Login: `admin` / `admin`

---

## ✅ Next Steps

- Manage application logic & secrets: [`helm/party/README.md`](../helm/party/README.md)
- Manage Argo CD applications: [`argo/README.md`](../argo/README.md)
