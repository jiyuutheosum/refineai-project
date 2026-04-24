# RefineAI - Resume Feedback Platform

Feature-first React 18 + Vite app with modular architecture for AI-powered resume analysis.

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| Framework | React 18 + Vite |
| State | Redux Toolkit (feature slices) |
| Routing | React Router v6 |
| Styling | TailwindCSS + CSS Tokens |
| Forms | React Hook Form |
| Animation | Framer Motion |
| Charts | Recharts + D3.js |
| Testing | Jest + RTL |

## 🏗️ Architecture

**Feature-First Modular Design:**

```
src/
├── app/              # App-wide setup only (router/store/providers/layouts)
├── features/         # Self-contained domains
│   └── resume-upload/
│       ├── pages/
│       ├── components/
│       ├── hooks/
│       ├── store/ (slice/selectors)
│       ├── services/
│       ├── utils/
│       ├── schemas/
│       └── constants/
├── shared/           # Cross-feature reusables
│   ├── components/ui/
│   ├── lib/ (cn.js)
│   └── hooks/
└── styles/           # Globals + Tailwind + tokens
```

**Rules:** app→features/shared, features→shared only. Thin pages, business logic in features.

## 🚀 Quick Start

```bash
npm install
npm run start  # http://localhost:5170
npm run build  # production
```

## 📁 Features Implemented

- **resume-upload**: Full workflow (validation, processing, Redux, auto-navigate)
- **resume-analysis**: Components ready (ActionPanel, FeedbackCard, ResumePreview)
- **manual-resume-editor**: Editor tools (SectionEditor, FeedbackSidebar)
- **feedback-summary**: Charts (ScoreCard, SectionBreakdown)

## 🧩 Extending Features

1. Create `features/[new-feature]/pages/[Name]Page.jsx` (thin)
2. Add `store/[name]Slice.js/selectors.js`
3. Business logic in `hooks/services/utils/`
4. Add route in `app/router/Routes.jsx`
5. Update `app/store/index.js` reducer

## 🎨 Customization

- **Tailwind**: Edit `tailwind.config.js`, tokens in `styles/globals.css`
- **Theme**: CSS vars in `:root` (light/dark)
- **Routes**: `app/router/Routes.jsx`

## 📊 Upcoming

Apply pattern to remaining features, add unit tests, real API integration, auth.

Modern, scalable resume feedback platform ready for production.

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── client/src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```