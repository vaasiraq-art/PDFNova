# PDFNova Security

## GitHub -> Firebase deployment

PDFNova is a Vite/React single-page application deployed with Firebase Hosting.

The repository must never contain a Firebase service-account JSON file, private key, GitHub token, or other deployment credential. GitHub Actions should receive the Firebase deployment credential only through the encrypted GitHub Actions secret:

`FIREBASE_SERVICE_ACCOUNT`

The production workflow runs only from `main` or by manual dispatch and grants the job only `contents: read`.

## Firebase Web configuration

Firebase Hosting does not require the Firebase Web SDK configuration in `index.html`. PDFNova therefore does not ship a Firebase API key just to host the site.

If Firebase Authentication, Firestore, Storage, or Analytics is added later, use the official client SDK configuration for that feature and enforce authorization with Firebase Authentication and Security Rules where applicable.

A browser Firebase API key is not equivalent to a service-account private key. For Google browser API keys, use application restrictions and API restrictions in Google Cloud Console.

## Firebase Hosting hardening

The current `firebase.json` enables:

- Content Security Policy (CSP)
- clickjacking protection with `frame-ancestors` and `X-Frame-Options`
- MIME-sniffing protection
- strict referrer handling
- restrictive Permissions Policy
- HSTS
- immutable caching for static assets
- no-store caching for `index.html`

Review the CSP whenever a third-party script, API, worker, analytics SDK, or external asset provider is added.

## Client-side PDF privacy

PDFNova's core PDF processing is designed to happen in the browser. Do not describe a tool as server-side private processing unless a backend has actually been added and verified.

## Incident response

If a credential is accidentally committed:

1. Revoke or delete the exposed credential immediately.
2. Create a replacement credential.
3. Update the GitHub Actions secret.
4. Remove the credential from repository history where appropriate.
5. Review Firebase/Google Cloud audit logs for unexpected activity.
