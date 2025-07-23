# 🚀 Argo CD – GitOps Deployment for Party

This guide explains how to set up Argo CD to deploy the Party Helm chart from your GitHub repository using GitOps principles.

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

### 2. Forward Port to Access UI (optional for local use)

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Open [https://localhost:8080](https://localhost:8080) in your browser.

### 3. Retrieve Initial Admin Password

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d && echo
```

- **Username:** `admin`
- **Password:** (output above)

> ⚠️ This secret is deleted automatically if you change the admin password.

## 🔐 Add GitHub Credentials (for Private Repositories)

### 4. Prepare a GitHub Access Token (PAT)

- Go to [GitHub Personal Access Tokens](https://github.com/settings/tokens).
- Click **Generate new token (classic)**.
- Minimum required scope: `repo` ✅ (full control is not needed).
- Name it **ArgoCD Access** and copy the token.

### 5. Create the Kubernetes Secret for GitHub Access

- Copy the example file:

  ```bash
  cp infra/secrets/github-repo-secret.example.yaml infra/secrets/github-repo-secret.yaml
  ```

- Edit `infra/secrets/github-repo-secret.yaml` to match your repo and credentials:

  ```yaml
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
    password: your-personal-access-token
  ```

- Apply the secret:

  ```bash
  kubectl apply -f infra/secrets/github-repo-secret.yaml
  ```

> 💡 This secret is not versioned. Ensure `infra/secrets/github-repo-secret.yaml` is listed in `.gitignore`.

**Optional but recommended:** Restart the Argo CD repo server to reload credentials.

```bash
kubectl rollout restart deployment argocd-repo-server -n argocd
```

## 🔧 Application Setup

Once your `infra/helm/party` chart is pushed to a GitHub repository:

### 6. Deploy the Application via Argo CD

```bash
kubectl apply -f infra/argo/application.yaml -n argocd
```

Your `application.yaml` should look like:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: party-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: git@github.com:your-org/your-repo.git
    targetRevision: main
    path: infra/helm/party
    helm:
      valueFiles:
        - values.yaml
        - values.secret.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: party
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

> Replace `repoURL` and `targetRevision` with your actual GitHub repository URL and branch.

## ✅ Verification

- The Argo CD UI should show your `party-app` as **Healthy** and **Synced**.
- Your app is deployed in the `party` namespace.
- If you use External Secrets, ensure secrets are correctly synced.

## 🔐 Notes

- If your GitHub repository is private, configure an SSH deploy key or HTTPS token access.
- You may also use Argo CD Git credentials via a Secret (not covered here).
