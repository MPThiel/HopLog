# HopLog 🍺

A mobile-first, responsive full-stack Beer Tasting Log web app. Built with React, Vite, Tailwind CSS, and Firebase Firestore.

## Features
- **Beer List**: View beers grouped alphabetically by style. Search by name or brewery. Sort by date, rating, or style.
- **Beer Details**: Full view of tasting notes, ratings, ABV%, volume, country, and style.
- **Add & Edit**: Intuitive form to log new beers or update existing entries.
- **Auto-Seed**: On first launch with an empty database, auto-populates 6 sample beers so the app looks great instantly.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd HopLog
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Duplicate the `.env.example` file and rename it to `.env.local` (or `.env`).
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Firebase project credentials in `.env.local`:
   ```env
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

## Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Enable Firestore Database in "Test mode" (or set up security rules for a single user).
3. Register a Web App in settings to get the config keys for your `.env` file.
4. The app creates a `beers` collection and automatically adds sample data if the collection is empty.

## Setup for Netlify Deployment
This project is configured as a Single Page Application (SPA), meaning it handles routing client-side. The `netlify.toml` file included handles redirecting all traffic to `index.html` to prevent 404 errors on deep links.

1. Connect your GitHub repository to Netlify.
2. Set the build command to `npm run build`.
3. Set the publish directory to `dist`.
4. In the Netlify dashboard, navigate to **Site Settings > Environment Variables** and add all the `VITE_FIREBASE_*` variables from your `.env.local` file.
5. Deploy!
