# PDFNova Security

## Hosting and deployment

PDFNova is a Vite/React single-page application deployed as static content with Firebase Hosting.
The repository does **not** need a Firebase service-account JSON file. GitHub Actions should receive the deployment credential only through a GitHub Actions secret named `FIREBASE_SERVICE_ACCOUNT`.

Never commit:

- Firebase service-account JSON files
- private keys
- `.env` files containing secrets
- access tokens or passwords

The repository `.gitignore` excludes common local secret and Firebase files.

## Firebase web configuration

Firebase Hosting itself does not require a Firebase Web SDK configuration in `index.html`. PDFNova therefore does not ship a Firebase API key just to host the website.

If Firebase services such as Authentication, Firestore, Storage, or Analytics are added later, use the official client SDK configuration for those services. Browser Firebase configuration is not equivalent to a service-account credential; authorization must still be enforced with Authentication and Firebase Security Rules where applicable.

For Google API keys used by browser applications, add HTTP-referrer restrictions and API restrictions in Google Cloud Console. Google recommends application restrictions that limit which websites can use a browser key. See:
https://cloud.google.com/docs/authentication/api-keys

## GitHub Actions security

The production workflow:

- runs only from `main` or from a manual dispatch;
- grants the job only `contents: read` permission;
- uses a GitHub Actions secret for Firebase deployment credentials;
- uses an environment named `production`, allowing environment protection rules to be added in GitHub;
- builds from the lockfile with `npm ci` before deployment.

Create the required repository secret in GitHub:

`Settings -> Secrets and variables -> Actions -> New repository secret`

Name:

`FIREBASE_SERVICE_ACCOUNT`

The value must be the complete service-account JSON created by Firebase's GitHub setup flow.

## Firebase Hosting headers

`firebase.json` enables:

- Content Security Policy (CSP)
- clickjacking protection with `frame-ancestors` and `X-Frame-Options`
- MIME sniffing protection
- strict referrer handling
- a restrictive Permissions Policy
- HTTPS-only transport enforcement via HSTS
- immutable caching for fingerprinted assets
- no-store caching for `index.html` so new deployments are picked up promptly

Review the CSP whenever a new third-party script, analytics SDK, API, worker, or external asset provider is added.

## Client-side PDF privacy

PDFNova's core PDF processing is designed to happen in the user's browser. Do not describe a tool as server-side private processing unless a backend has actually been added and verified.

## Incident response

If a Firebase service-account key or another credential is accidentally committed:

1. Revoke/delete the exposed credential immediately.
2. Create a replacement credential.
3. Update the GitHub Actions secret.
4. Remove the credential from repository history where appropriate.
5. Review Firebase/Google Cloud audit logs for unexpected activity.
