# PDFNova - Free Online PDF Tools

A React + TypeScript PDF utility website designed for browser-side PDF processing and Firebase Hosting deployment.

## Features

- Merge, split, compress, rotate, and organize PDFs
- Convert PDF/JPG/PNG files
- Add page numbers and watermarks
- Protect and unlock PDFs
- Built-in PDF reader
- Browser-side processing for the core tools

## GitHub -> Firebase Hosting

Firebase project:

`pdfnova-8ff02`

Firebase Hosting site:

`pdfnova`

Live URL:

https://pdfnova.web.app

Production deploys are handled by `.github/workflows/deploy.yml` when `main` changes.

The workflow:

1. installs dependencies with `npm ci`
2. runs `npm run typecheck`
3. runs `npm run build`
4. deploys the `dist` directory to the `pdfnova` Firebase Hosting target

Required GitHub Actions secret:

`FIREBASE_SERVICE_ACCOUNT`

Never put the service-account JSON in the repository.

## Local development

```bash
npm ci
npm run dev
```

Build:

```bash
npm run typecheck
npm run build
```

Manual Firebase deployment:

```bash
firebase login
firebase target:apply hosting pdfnova pdfnova
firebase deploy --only hosting:pdfnova
```

## Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [GITHUB-FIREBASE-SETUP.md](./GITHUB-FIREBASE-SETUP.md)
- [SECURITY.md](./SECURITY.md)
- [firebase.json](./firebase.json)
- [.firebaserc](./.firebaserc)

## Privacy

Core PDF processing is designed to run in the browser, so files do not need to be uploaded to a PDFNova backend.

## License

This project is open source and includes an adaptation of the Striped theme by HTML5 UP under its applicable license.
