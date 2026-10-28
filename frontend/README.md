# CodeTrack Frontend 🌲

> **Reactive Developer Dashboard & DSA Progress Tracker**  
> Built with React 19, Vite 8, and the **Forest Green, Warm Cream & Terracotta** design system.

<br />

<div align="center">

[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=d3dotjs&logoColor=white)](https://recharts.org/)
[![Lucide](https://img.shields.io/badge/Lucide-F56565?style=for-the-badge&logo=feather&logoColor=white)](https://lucide.dev/)

</div>

---

## 🎨 Design System

CodeTrack features a cohesive, accessible dual-theme design system implemented using semantic CSS variables.

### Palette Overview

* **Forest Green (`#315B40` / `#739775`)**: Establishes the primary brand identity, primary CTA buttons, and active navigation indicators.
* **Warm Cream (`#F4F0E5` / `#F5F0E5`)**: Provides soothing background surfaces in light mode and soft, readable text contrast in dark mode.
* **Terracotta (`#D47E62` / `#B95F45`)**: Used selectively for highlights, unread notification badges, active navigation pips, and hard difficulty markers.

### Theme Variables

#### Dark Mode (`[data-theme="dark"]`)
* `--background`: `#111812` (Deep Forest canvas)
* `--sidebar`: `#151F18` (Sidebar background)
* `--navbar`: `#151F18` (Top navigation bar)
* `--card`: `#1D2A20` (Surface cards)
* `--surface-elevated`: `#263529` (Hover & elevated controls)
* `--border`: `#354638` (Muted stone borders)
* `--text-primary`: `#F4F0E5` (Warm Cream primary text)
* `--text-secondary`: `#B5BEAE` (Sage secondary text)
* `--primary`: `#315B40` (Forest Green CTA)
* `--accent`: `#739775` (Sage accent)
* `--terracotta`: `#D47E62` (Terracotta highlight)

#### Light Mode (`[data-theme="light"]`)
* `--background`: `#F5F0E5` (Warm Cream canvas)
* `--sidebar`: `#FBF8F0` (Off-white cream sidebar)
* `--navbar`: `#FFFFFF` (Clean white navbar)
* `--card`: `#FFFCF5` (Soft ivory card surface)
* `--surface-elevated`: `#EFE7D7` (Stone elevated controls)
* `--border`: `#DED5C4` (Warm stone borders)
* `--text-primary`: `#24352A` (Deep Forest text)
* `--text-secondary`: `#626C5F` (Muted slate text)
* `--primary`: `#315B40` (Forest Green CTA)
* `--accent`: `#739775` (Sage accent)
* `--terracotta`: `#B95F45` (Deep Terracotta highlight)

---

## 📁 Frontend Directory Structure

```text
frontend/
├── public/                     # Static brand assets
│   ├── logo-icon.svg           # Scalable vector logo
│   ├── logo-icon.png           # 512x512 HD app icon
│   ├── favicon.png             # Browser tab icon
│   ├── apple-touch-icon.png    # iOS bookmark icon
│   └── site.webmanifest        # PWA manifest
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── ActivityChart.jsx   # Recharts weekly activity area chart
│   │   ├── Button.jsx          # Primary, secondary & terracotta buttons
│   │   ├── EmptyState.jsx      # Generic empty state illustration
│   │   ├── Header.jsx          # Page title & subtitle header
│   │   ├── Logo.jsx            # Dynamic inline vector brand mark
│   │   ├── Navbar.jsx          # Top navbar with search & notifications
│   │   ├── PlatformCard.jsx    # Live profile statistics card
│   │   ├── ProblemTable.jsx    # Problem management table
│   │   ├── ProgressBar.jsx     # Linear progress indicator
│   │   ├── Sidebar.jsx         # Grouped navigation sidebar
│   │   └── StatCard.jsx        # Dashboard metric KPI card
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state & session
│   │   └── ThemeContext.jsx    # Dark/Light theme switching & persistence
│   ├── hooks/
│   │   ├── useAuth.js          # Authentication hook
│   │   └── useTheme.js         # Theme toggle hook
│   ├── layouts/
│   │   ├── AuthLayout.jsx      # Split screen auth container
│   │   └── MainLayout.jsx      # Shell layout with responsive drawer
│   ├── pages/
│   │   ├── Dashboard.jsx       # Real-time metrics, chart & platform cards
│   │   ├── Sheets.jsx          # Curated DSA Mastery Roadmaps
│   │   ├── Problems.jsx        # Custom problem tracker & filters
│   │   ├── Leaderboard.jsx     # Community ranking podium & table
│   │   ├── Profile.jsx         # User profile & linked accounts
│   │   ├── Settings.jsx        # Profile & theme customization
│   │   ├── Login.jsx           # User sign-in
│   │   └── Register.jsx        # User registration
│   ├── services/
│   │   └── api.js              # Axios API service instances
│   ├── App.css                 # Component & layout design rules
│   ├── index.css               # Design tokens & typography setup
│   ├── App.jsx                 # Route definitions
│   └── main.jsx                # Application root
├── index.html                  # HTML template with Google Fonts preload
├── package.json
└── vite.config.js
```

---

## 🚀 Development Scripts

```bash
# Start local development server (http://localhost:5173)
npm run dev

# Run ESLint validation
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📱 Responsive Layout
* **Desktop (1024px+)**: Fixed 248px sidebar with grouped navigation and full metrics canvas.
* **Tablet (768px - 1023px)**: Fluid layouts with responsive grids and adapted stat cards.
* **Mobile (<768px)**: Off-canvas sidebar drawer with backdrop blur, touch-friendly navigation, and auto-closing on route navigation.
