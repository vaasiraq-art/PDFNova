# 🚀 Quick Start: Deploy PDFNova to Firebase

## Super Quick Deploy (3 Steps)

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login & Initialize
```bash
firebase login
firebase init hosting
```

When prompted:
- Public directory: `dist`
- Single-page app: `Yes`
- GitHub deploys: `No`

### 3. Deploy
```bash
npm run build
firebase deploy
```

**That's it!** Your site is live at `https://your-project-id.web.app`

---

## Using the Automated Script

### On Mac/Linux:
```bash
chmod +x deploy.sh
./deploy.sh
```

### On Windows:
```bash
deploy.bat
```

---

## Add Deploy Script to package.json

Add this to your `package.json` scripts section:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && firebase deploy --only hosting"
  }
}
```

Then deploy with one command:
```bash
npm run deploy
```

---

## First Time Setup Checklist

- [ ] Install Firebase CLI: `npm install -g firebase-tools`
- [ ] Login to Firebase: `firebase login`
- [ ] Initialize project: `firebase init hosting`
- [ ] Update `.firebaserc` with your project ID
- [ ] Build project: `npm run build`
- [ ] Deploy: `firebase deploy`

---

## Common Issues

### "firebase: command not found"
```bash
npm install -g firebase-tools
```

### "Error: Not in a Firebase app directory"
```bash
firebase init hosting
```

### "Error: Failed to list Firebase projects"
```bash
firebase login
```

### Build errors
```bash
npm install
npm run build
```

---

## Need Help?

- Read the full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Firebase Docs: https://firebase.google.com/docs/hosting
- Stack Overflow: https://stackoverflow.com/questions/tagged/firebase-hosting

---

**Ready to deploy?** Run `npm run deploy` and you're live in under 2 minutes! 🎉
