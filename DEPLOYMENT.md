# Deploy PDFNova to Firebase Hosting

This guide will help you deploy your PDFNova website to Firebase Hosting for free.

## Prerequisites

- Google Account
- Node.js installed (v14 or higher)
- Your PDFNova project files

## Step 1: Install Firebase CLI

Open your terminal and run:

```bash
npm install -g firebase-tools
```

Verify installation:

```bash
firebase --version
```

## Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser window. Sign in with your Google account and grant permissions.

## Step 3: Initialize Firebase in Your Project

Navigate to your project directory:

```bash
cd path/to/your/project
```

Initialize Firebase:

```bash
firebase init
```

When prompted:
1. **Are you ready to proceed?** → Yes
2. **Which Firebase features?** → Select "Hosting" (use spacebar to select, enter to confirm)
3. **Select a default Firebase project** → Choose "Create a new project" or select existing
4. **What do you want to use as your public directory?** → Type `dist`
5. **Configure as a single-page app?** → Yes
6. **Set up automatic builds with GitHub?** → No (unless you want CI/CD)
7. **File dist/index.html already exists. Overwrite?** → No

## Step 4: Update Configuration Files

The initialization created `firebase.json` and `.firebaserc`. Update `.firebaserc` with your project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

You can find your project ID in the Firebase Console under Project Settings.

## Step 5: Build Your Project

Before deploying, build your project:

```bash
npm run build
```

This creates the `dist` folder with optimized production files.

## Step 6: Deploy to Firebase

Deploy your site:

```bash
firebase deploy
```

You should see output like:
```
✔ Deploy complete!

Hosting URL: https://your-project-id.web.app
```

## Step 7: Access Your Site

Your site is now live at:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

## Optional: Custom Domain

To use a custom domain:

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the instructions to verify domain ownership
4. Add DNS records as instructed
5. Wait for SSL certificate provisioning (usually 24 hours)

## Optional: Environment Variables

If you need environment variables (like API keys):

1. Go to Firebase Console → Project Settings → General
2. Scroll to "Your apps" section
3. Add your config variables
4. Update your code to use `process.env.VARIABLE_NAME`

## Troubleshooting

### Build fails
- Make sure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run build`

### Deploy fails
- Verify you're logged in: `firebase login`
- Check project ID in `.firebaserc`
- Ensure `dist` folder exists after build

### Site shows 404
- Verify `firebase.json` has correct rewrite rules
- Check that `index.html` exists in `dist` folder

## Useful Commands

```bash
# Preview site locally before deploying
firebase serve

# Deploy only hosting
firebase deploy --only hosting

# Deploy to a specific channel (for testing)
firebase hosting:channel:deploy preview

# List all deployments
firebase hosting:clone

# Rollback to previous version
firebase hosting:rollback
```

## Performance Tips

1. **Enable caching** - Already configured in `firebase.json`
2. **Use CDN** - Firebase automatically uses Google's CDN
3. **Optimize images** - Compress before uploading
4. **Enable HTTP/2** - Automatic with Firebase Hosting
5. **Use preloading** - Add `<link rel="preload">` for critical resources

## Next Steps

- Set up custom domain
- Configure analytics (Firebase Analytics)
- Add authentication if needed
- Set up CI/CD with GitHub Actions
- Monitor performance in Firebase Console

## Support

- [Firebase Documentation](https://firebase.google.com/docs/hosting)
- [Firebase Community](https://firebase.community/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase-hosting)

---

**Congratulations!** Your PDFNova website is now deployed on Firebase Hosting. 🎉
