# PDFNova — GitHub to Firebase Hosting

Firebase project: `pdfnova-8ff02`

Firebase Hosting site target: `pdfnova`

Live URL:

https://pdfnova.web.app

## 1. One-time Firebase setup

From the project root:

```bash
firebase login
firebase target:apply hosting pdfnova pdfnova
firebase init hosting:github
```

Select the Firebase project `pdfnova-8ff02` and the existing Hosting site `pdfnova`.

Firebase's GitHub setup creates/encrypts the deployment credential and stores it as a GitHub Actions secret.

## 2. GitHub secret

The workflow expects:

`FIREBASE_SERVICE_ACCOUNT`

GitHub path:

**Settings → Secrets and variables → Actions**

Never commit the service-account JSON to this repository.

## 3. Production workflow

Every push to `main` triggers:

```
npm ci
npm run typecheck
npm run build
Firebase Hosting deploy -> target pdfnova -> live channel
```

## 4. Local deployment

```bash
npm ci
npm run typecheck
npm run build
firebase deploy --only hosting:pdfnova
```

## 5. Security

See [SECURITY.md](./SECURITY.md).

The application no longer includes Firebase SDK initialization in `index.html` because Firebase Hosting does not require it.

## 6. Production protection

In GitHub, use:

**Settings → Environments → production**

You can add required reviewers or other environment protection rules before live deployment.
