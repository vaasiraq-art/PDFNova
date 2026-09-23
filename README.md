# PDFNova - Free Online PDF Tools

A professional, feature-rich PDF tools website built with React, TypeScript, and Tailwind CSS. Deployed on Firebase Hosting.

![PDFNova](https://img.shields.io/badge/PDF-Tools-blue) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange)

## 🌟 Features

### PDF Tools (16 Total)
- **Merge PDF** - Combine multiple PDFs into one
- **Split PDF** - Extract pages from PDF
- **Compress PDF** - Reduce file size
- **Rotate PDF** - Rotate pages
- **PDF to JPG** - Convert PDF pages to images
- **PDF to Word** - Extract text as Word document
- **PDF to Text** - Extract plain text
- **JPG to PDF** - Convert images to PDF
- **PNG to PDF** - Convert PNG images
- **Images to PDF** - Multiple images to one PDF
- **Word to PDF** - Convert text files
- **Protect PDF** - Add password protection
- **Unlock PDF** - Remove encryption
- **Page Numbers** - Add page numbers
- **Watermark** - Add text watermark
- **PDF Reader** - Read PDFs with navigation

### Design Features
- ✅ Striped theme (HTML5 UP inspired)
- ✅ Dark sidebar with light content
- ✅ Blog-style post layout
- ✅ Responsive design
- ✅ Clean, professional UI
- ✅ 100% client-side processing
- ✅ No server uploads
- ✅ SEO optimized

## 🚀 Quick Deploy to Firebase

### Option 1: Automated Script (Recommended)

**Mac/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```bash
deploy.bat
```

### Option 2: Manual Deployment

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize
firebase init hosting

# 4. Build
npm run build

# 5. Deploy
firebase deploy
```

### Option 3: Add to package.json

Add this script to your `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && firebase deploy --only hosting"
  }
}
```

Then run:
```bash
npm run deploy
```

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Super quick 3-step deployment guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide with troubleshooting
- **[firebase.json](./firebase.json)** - Firebase configuration
- **[.firebaserc](./.firebaserc)** - Firebase project settings

## 🛠️ Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
pdfnova/
├── src/
│   ├── components/
│   │   └── Sidebar.tsx          # Dark sidebar navigation
│   ├── pages/
│   │   ├── Home.tsx             # Homepage with blog posts
│   │   ├── ToolPage.tsx         # PDF tool processor
│   │   └── PDFReader.tsx        # PDF reader
│   ├── data/
│   │   └── tools.ts             # Tool definitions
│   ├── App.tsx                  # Main app component
│   ├── index.css                # Striped theme styles
│   └── main.tsx                 # Entry point
├── public/                      # Static assets
├── dist/                        # Build output
├── firebase.json                # Firebase config
├── .firebaserc                  # Firebase project
├── deploy.sh                    # Deployment script (Unix)
├── deploy.bat                   # Deployment script (Windows)
├── DEPLOYMENT.md                # Full deployment guide
├── QUICKSTART.md                # Quick start guide
└── README.md                    # This file
```

## 🎨 Theme

This project uses the **Striped** theme from HTML5 UP, adapted for React:
- Clean, minimalistic design
- Dark sidebar with light content area
- Blog-style post layout
- Professional typography (Source Sans Pro, Raleway)
- Green accent color (#49bf9d)

## 🔒 Privacy & Security

- ✅ All PDF processing happens in the browser
- ✅ Files never leave the user's device
- ✅ No server uploads
- ✅ No registration required
- ✅ 100% free to use

## 📊 Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **pdf-lib** - PDF manipulation
- **pdf.js** - PDF rendering
- **React Router** - Navigation
- **Firebase Hosting** - Deployment

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 📝 License

This project is open source and available under the MIT License.

Design based on [Striped by HTML5 UP](https://html5up.net/striped) (CCA 3.0 license).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

- **Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Quick Start**: See [QUICKSTART.md](./QUICKSTART.md)
- **Firebase Docs**: https://firebase.google.com/docs/hosting
- **Issues**: Open an issue on GitHub

## 🎉 Live Demo

After deployment, your site will be available at:
- `https://pdfnova.web.app`
- `https://pdfnova.web.app`

---

**Made with ❤️ for the PDF community**

Star ⭐ this repo if you find it useful!
