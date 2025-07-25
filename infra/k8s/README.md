# 🔐 Kubernetes Static Resources – `infra/k8s/`

This directory contains **manually managed Kubernetes resources**, i.e., resources **not handled by Helm charts**.

## 📦 Why aren't these resources managed with Helm?

Some resources need to be shared across multiple applications or are too global to be versioned within a specific Helm chart.  
Managing them with Helm often leads to ownership errors (e.g., `helm upgrade` fails because the resource already exists without the correct labels).

## 📁 Current Contents

### `cert-manager/`

Contains resources related to **cert-manager**, installed and maintained manually:

- `ClusterIssuer letsencrypt-prod`:
  - Used to obtain TLS certificates via Let's Encrypt (ACME)
  - Shared by all apps exposed over HTTPS (via Ingress NGINX)
  - Managed outside of Helm to avoid conflicts between releases

### 💡 Example Installation Command

Cert-manager is installed using the official manifest (not Helm):

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml
```

Then, the ClusterIssuer is created:

```bash
kubectl apply -f infra/k8s/cert-manager/cluster-issuer.yaml
```
