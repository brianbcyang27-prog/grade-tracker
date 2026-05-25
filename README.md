# MYP Grade Tracker (IB System)

A full-stack web application for IB MYP students to track criteria-based grading (A/B/C/D) across semesters and subjects. Built with React + Firebase.

## Features

### Authentication
- Google Sign-In (OAuth)
- Email + Password registration & login
- Persistent login sessions

### Grade Tracking
- MYP Criteria-based grading (A, B, C, D)
- Semester-based organization (9G1S, 9G2S, 10G1S, 10G2S)
- 15+ subjects supported
- Automatic grade calculation with IB MYP boundaries (0-32 scale)

### Dashboard
- GPA equivalent per semester
- Overall performance trend
- Subject cards with total score (/32), grade band, and trend indicators
- No raw assignment data — summaries only

### Subject Detail
- **Assessment Table**: Strict table with Criterion, Title, Date, Score, Max Score, Status columns
- **Computed Summary**: A/B/C/D averages, total score, grade band
- **What-If Simulator**: Adjust scores and see grade impact in real-time

### Timeline View
- Chronological view of all assignments
- Filter by subject and criterion
- Daily organization with overdue indicators

### Mini Input Panel
- Sidebar quick-add form
- Instant Firestore writes with real-time updates

### Data Tools
- CSV Export
- CSV Import
- AI Suggestions (weakest criterion detection, grade gap analysis)

### UI
- Dark mode + light mode
- Card-based layout
- Sidebar navigation
- Smooth transitions
- Responsive design (mobile + desktop)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS 4 |
| State | Zustand |
| Routing | React Router 7 |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| Charts | Recharts |

## Architecture

```
RAW DATA LAYER    → Firestore (grades collection)
LOGIC LAYER       → Utils (grading calculations)
DASHBOARD LAYER   → Components (summaries only)
```

## Setup

### Prerequisites

- Node.js 18+
- A Firebase project with Authentication and Firestore enabled

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → Sign-in methods → Enable **Google** and **Email/Password**
4. Create a **Firestore Database** in production mode
5. Go to **Project Settings** → **General** → **Your apps** → **Web app** → Copy the config
6. Deploy Firestore security rules from `firestore.rules`

### Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase config:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
npm run preview
```

## Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Deploy

### Vercel / Netlify

1. Build: `npm run build`
2. Set environment variables in the dashboard
3. Deploy the `dist/` folder

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

## MYP Grade Boundaries

| Score | Grade | Label |
|---|---|---|
| 1-5 | F | Failing |
| 6-9 | D- | Very Limited |
| 10-11 | D | Limited |
| 12-15 | C | Satisfactory |
| 16-19 | C+ | Adequate |
| 20-23 | B | Good |
| 24-27 | A- | Excellent |
| 28-32 | A | Outstanding |

## License

MIT
