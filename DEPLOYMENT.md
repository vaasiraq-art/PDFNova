# PDFNova — GitHub to Firebase Hosting

Firebase project: `pdfnova-8ff02`  
Firebase Hosting site: `pdfnova`  
Live URL: https://pdfnova.web.app

## Recommended GitHub connection

Firebase's supported GitHub Actions setup is:

```bash
firebase login
firebase init hosting:github
```

When prompted, select Firebase project `pdfnova-8ff02` and the Hosting site `pdfnova`. The Firebase CLI creates the deployment service account and stores the credential as a GitHub Actions secret.

The repository workflow is `.github/workflows/deploy.yml`. It runs on pushes to `main`, type-checks the code, builds `dist`, and deploys the `pdfnova` Hosting target to the live channel.

## GitHub secret

If you keep the workflow already committed in this repo, the required GitHub Actions secret is:

`FIREBASE_SERVICE_ACCOUNT`

Create it under GitHub → **Settings → Secrets and variables → Actions**. Never commit the service-account JSON to the repository.

## Manual local deploy

```bash
npm ci
npm run typecheck
npm run build
firebase deploy --only hosting:pdfnova
```

## What is intentionally not in the app

Firebase Hosting does not require the Firebase Web SDK configuration in `index.html`, so the deployed site no longer exposes a Firebase API key just for hosting. If you later add Authentication, Firestore, Storage, or Analytics, add only the client SDK/config required for that feature and secure the corresponding data with Firebase rules.

## Security

See `SECURITY.md` for the current security hardening and GitHub Actions guidance.
