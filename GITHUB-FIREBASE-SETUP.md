# Connect PDFNova GitHub -> Firebase Hosting

Firebase's supported Hosting GitHub flow can create the deployment credential and workflow for the repository.

## 1. Push the project to GitHub

Use a repository whose production branch is `main`.

## 2. Connect the repository to Firebase

From the project root run:

```bash
firebase login
firebase target:apply hosting pdfnova pdfnova
firebase init hosting:github
```

Select Firebase project `pdfnova-8ff02`. When asked for the Hosting site, use the existing `pdfnova` site that serves `https://pdfnova.web.app`.

Firebase's GitHub setup creates/encrypts the deployment service-account credential and stores it in the GitHub repository as a secret.

## 3. Keep the production secret out of Git

The workflow in this repo expects:

`FIREBASE_SERVICE_ACCOUNT`

GitHub path: **Settings -> Secrets and variables -> Actions**.

Do not paste the service-account JSON into source files, README files, or `firebase.json`.

## 4. Production deployment

A push to `main` runs:

1. `npm ci`
2. `npm run typecheck`
3. `npm run build`
4. Firebase Hosting deployment to the `pdfnova` target and live channel

Live site:

https://pdfnova.web.app

## 5. Important

Do not create a second Firebase Hosting site just because the Firebase project ID is `pdfnova-8ff02`. The existing site ID is `pdfnova`, which matches the URL you gave me. The included `.firebaserc`, `firebase.json`, and GitHub workflow are configured for that target.

## 6. Optional production protection

In GitHub, use **Settings -> Environments -> production** and add required reviewers if you want manual approval before a production deploy.
