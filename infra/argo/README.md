# 🚀 Argo CD + Argo CD Image Updater – GitOps Deployment for Party

This guide explains how to set up Argo CD to deploy the Party Helm chart from your GitHub repository using GitOps principles, and how to enable automatic image updates using Argo CD Image Updater.

---

## 📦 Installation

### 1. Install Argo CD via Helm

```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update

helm install argocd argo/argo-cd \
  -n argocd \
  --create-namespace \
  --set installCRDs=true
```

---

### 2. Forward Port to Access UI (Optional for Local Use)

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```
Then open: [https://localhost:8080](https://localhost:8080)

---

### 3. Retrieve Initial Admin Password

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d && echo
```
- **Username:** `admin`
- **Password:** (output above)

---

## 🔐 GitHub Credentials for Argo CD and Image Updater

### 4. Create GitHub Access Token

- Generate a [Personal Access Token (classic)](https://github.com/settings/tokens)
- **Minimum scope:** `repo`
- Save the token securely.

---

### 5. Create GitHub Secrets

Create a combined file at `infra/secrets/github-secrets.yaml`:

```yaml
# Argo CD access to private Git repo
apiVersion: v1
kind: Secret
metadata:
  name: github-repo-secret
  namespace: argocd
  labels:
    argocd.argoproj.io/secret-type: repository
type: Opaque
stringData:
  url: https://github.com/your-username/your-repo
  username: your-username
  password: your-github-pat
---
# Argo CD Image Updater write-back credentials
apiVersion: v1
kind: Secret
metadata:
  name: image-updater-git-writer
  namespace: argocd
  labels:
    argocd.argoproj.io/secret-type: repo-creds
type: Opaque
stringData:
  url: https://github.com/your-username/your-repo
  username: your-username
  password: your-github-pat
```

Apply it:

```bash
cp infra/argo/github-secrets.example.yaml infra/argo/github-secrets.yaml
kubectl apply -f infra/argo/github-secrets.yaml -n argocd
```

Then restart repo-server to apply access:

```bash
kubectl rollout restart deployment argocd-repo-server -n argocd
```

---

## 🔁 Install Argo CD Image Updater

```bash
helm upgrade --install argocd-image-updater argo/argocd-image-updater \
  --namespace argocd \
  --create-namespace \
  --set config.argoCD.namespace=argocd \
  --set config.logLevel=info \
  --set config.git.writeBackMethod=git:secret \
  --set config.git.branch=main \
  --set image.tag=v0.16.0
```

---

## 🔧 Application Setup

### 6. Define Argo CD Application with Image Update Annotations

Create or edit `infra/argo/application.yaml`:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: party-app
  namespace: argocd
  annotations:
    argocd-image-updater.argoproj.io/image-list: |
      server=ghcr.io/william-wtr92/party-server
      client=ghcr.io/william-wtr92/party-client
    argocd-image-updater.argoproj.io/client.update-strategy: latestDigest
    argocd-image-updater.argoproj.io/server.update-strategy: latestDigest
    argocd-image-updater.argoproj.io/write-back-method: git:secret
    argocd-image-updater.argoproj.io/git-branch: main
spec:
  project: default
  source:
    repoURL: https://github.com/william-wtr92/party
    targetRevision: main
    path: infra/helm/party
    helm:
      valueFiles:
        - values.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: party
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

Apply it:

```bash
kubectl apply -f infra/argo/application.yaml
```

---

## 🚀 Workflow After Pushing to Main

- **CI:** Push image to GHCR on push to main (handled by your GitHub Actions workflow).
- **CD:** Argo Image Updater triggers automatically:
  - Detects the new image pushed to ghcr.io
  - Edits `values.yaml` in Git
  - Commits and pushes the change
  - Argo CD picks it up and syncs automatically

To trigger manually:

```bash
kubectl delete pod -l app.kubernetes.io/name=argocd-image-updater -n argocd
```

---

## ✅ Verification

To confirm it works:

```bash
kubectl logs -n argocd deploy/argocd-image-updater
```

Look for logs like:

```
INFO [party-app] Found 1 image update(s)
INFO [party-app] Writing back updated values.yaml to Git
```

---

## 📌 Notes

- **Don’t commit sensitive tokens (like PATs) to Git.**
- Use `.gitignore` for your `*.secret.yaml` files.
- Ensure your `values.yaml` contains:

```yaml
server:
  image: ghcr.io/your-username/party-server
  tag: latest
client:
  image: ghcr.io/your-username/party-client
  tag: latest
```