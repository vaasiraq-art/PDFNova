# Browser API-key security

PDFNova currently does not need to ship a Firebase Web API key merely to use Firebase Hosting, so no Firebase API key is embedded in the application source.

If a browser-based Firebase or Google API is added later:

- A browser API key is not a service-account private key.
- Restrict browser keys by HTTP referrers and, where supported, by the APIs they may call.
- Never commit service-account JSON files or private keys.
- Use Firebase Authentication and Security Rules to protect application data.

Google's API-key guidance:
https://cloud.google.com/docs/authentication/api-keys
