# ⚡ AI Tools Directory

A premium, full-featured directory of curated AI tools. The application features a stunning modern user interface with advanced glassmorphism styles, fluid animations, side-by-side comparison matrices, real-time update notifications, user submissions, OAuth verification, and an analytical admin dashboard.

The application is built with a **React + TypeScript + Vite** frontend and a **Node.js + Express + SQLite** backend, and is configured with **Capacitor** to build and run as a native Android mobile application.

---

## 🚀 Key Features

*   **✨ Immersive UI & Interactions**: Modern styling with interactive glassmorphism (`GlassSurface`), custom SVG layouts, particle backgrounds (`Particles`), scroll-based micro-interactions, and proximity text scaling (`VariableProximity`).
*   **🔍 Explore & Filter Catalog**: Filter tools by categories (Writing, Coding, Design, Video, and more) and pricing plans (Free, Freemium, Paid). Support for sorting by newest, trending, and name.
*   **⚖️ Side-by-Side Comparison Matrix**: Pick any two tools to compare ratings, pricing models, upvotes, websites, and detailed feature checklists (e.g., API access, mobile apps, team collaboration).
*   **📝 User Tool Submissions**: Guided stepper form for registered users to submit new AI tools. Form steps: `Basic Info` ➡️ `Details` ➡️ `Review & Submit`.
*   **👤 Member Profiles**: User bookmarks repository, customized user profiles with avatars, and listings of submitted tools.
*   **📈 Administrative Analytics Dashboard**: Real-time admin views charting user growth (using Recharts), tool category distributions, general counts (users, tools, reviews, bookmarks), and tabular views of the most upvoted tools.
*   **🔐 Secure Multi-Provider Authentication**: Email/password registration/login with password hashing (`bcrypt`), JWT token verification, and integration with **Google OAuth** and **GitHub OAuth**.
*   **📡 Real-Time Synchronicity**: WebSockets (`Socket.io`) connect the client to server, emitting events like `tool_added` to instantly broadcast and update all active user sessions without requiring refresh.
*   **📱 Native Mobile Capabilities**: Preloaded with **Capacitor**, compiling web bundles directly to Android applications.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework:** React 19 (TypeScript) & Vite
*   **Routing:** React Router v7
*   **Styling:** Tailwind CSS & Vanilla CSS (Fluid Glassmorphic overlays)
*   **Animations:** Framer Motion (for page transitions, active navigation dots, and interactive cards)
*   **Graphics & Backgrounds:** Three.js, React Three Fiber, OGL (for fluid background particle systems)
*   **Charts:** Recharts (for administrative visualizations)
*   **Scroll Mechanics:** Lenis (for premium smooth scrolling behavior)
*   **Icons:** Lucide React

### Backend
*   **Runtime:** Node.js (ES Modules import format)
*   **Web Framework:** Express 5
*   **Database:** SQLite (managed via high-performance `better-sqlite3` driver)
*   **Real-time Operations:** Socket.io (Server-Client WebSockets)
*   **Authentication:** JSON Web Tokens (JWT) & `google-auth-library`
*   **Security:** Hashed credentials using `bcrypt`

### Mobile Wrapper
*   **Framework:** Capacitor (@capacitor/core, @capacitor/android, @capacitor/cli)

---

## 📂 Project Architecture

```
AI Tools Directory/
├── .github/                   # GitHub action files
├── .vscode/                   # VS Code configuration scripts
├── android/                   # Generated native Android project (Capacitor)
├── public/                    # Static assets (logos, images, favicon)
├── server/                    # Backend server source files
│   ├── index.js               # Express application endpoints & Socket.io controller
│   ├── db.js                  # Database connector & table creation schemas
│   ├── database.sqlite        # SQLite local file database
│   ├── package.json           # Backend npm package list
│   └── .env                   # Backend environment configurations
├── src/                       # Frontend application source files
│   ├── App.tsx                # Main Router wrapper & core particle layout
│   ├── main.tsx               # Main entrypoint index
│   ├── index.css              # Custom font tokens, keyframes, and utilities
│   ├── components/            # Reusable React components
│   │   ├── Navbar.tsx         # Responsive header, search drawer, profile popover
│   │   ├── ToolCard.tsx       # Grid cards representing AI tools
│   │   ├── CategoryCard.tsx   # Slider cards representing distinct categories
│   │   ├── GlassSurface.tsx   # Custom dynamic glassmorphism component
│   │   ├── VariableProximity.tsx# Proximity-based interactive text effect
│   │   ├── GradualBlur.tsx    # Gradual backdrop blur animations
│   │   └── Particles.jsx      # Fluid particle graphics background
│   ├── context/               # Global state providers
│   │   └── AuthContext.tsx    # JWT storage, OAuth triggers, bookmarks/likes handlers
│   ├── data/                  # Mock data definitions & getter helpers
│   │   └── mockData.ts        # Database backup values and initial records
│   ├── lib/                   # Utility helpers
│   │   ├── utils.ts           # CSS merging, time converters, number formatters
│   │   └── icons.tsx          # Inline SVG definitions
│   ├── pages/                 # Full screen page route definitions
│   │   ├── LandingPage.tsx    # Marketing, hero header, category sliders, newsletters
│   │   ├── ExplorePage.tsx    # Catalog directory list, sidebar query tools
│   │   ├── ToolDetailPage.tsx # Single tool description, comments, reviews lists
│   │   ├── ComparePage.tsx    # Two-slot comparison matrix tables
│   │   ├── SubmitToolPage.tsx # Multistep tool wizard submissions
│   │   ├── ProfilePage.tsx    # User profile summaries & saves list
│   │   ├── AdminPage.tsx      # Charts & overview statistics metrics panels
│   │   └── LoginPage.tsx      # Login/Register credential or OAuth tabs
│   └── types/                 # TypeScript typings
│       └── index.ts           # Global model interface declarations
├── package.json               # Root npm packages and script configurations
├── tsconfig.json              # Main TypeScript rules configuration
├── capacitor.config.ts        # Capacitor project rules and identification tags
├── tailwind.config.js         # Tailwind system configurations
└── index.html                 # Main web container index
```

---

## 🗄️ Database Schema

The local SQLite database (`server/database.sqlite`) maintains two primary tables:

### 1. `users` Table
Stores registered member details:
*   `id` (TEXT, Primary Key): Unique random UUID.
*   `name` (TEXT): Full name of the user.
*   `email` (TEXT, Unique): Credentials email address.
*   `password_hash` (TEXT): Hashed representation of the password.
*   `created_at` (DATETIME): Auto timestamp of user signup.

### 2. `tools` Table
Stores cataloged AI directory tool details:
*   `id` (TEXT, Primary Key): Unique random UUID.
*   `name` (TEXT): Name of the AI tool.
*   `tagline` (TEXT): Quick overview summary.
*   `description` (TEXT): Long description about what the tool accomplishes.
*   `website` (TEXT): Link to the tool's product page.
*   `pricing` (TEXT): Pricing flag (`free`, `freemium`, or `paid`).
*   `logo` (TEXT): Image URL for the logo.
*   `category` (TEXT): Visual category matching tag.
*   `user_id` (TEXT): Foreign key referencing `users.id` who uploaded the entry.
*   `created_at` (DATETIME): Timestamp of tool submission.

---

## ⚙️ Setup & Installation

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [npm](https://www.npmjs.com/)

### 2. Clone the Repository
```bash
git clone <repository-url>
cd "AI Tools Directory"
```

### 3. Environment Configurations

#### Root Environment File (`.env`)
Create a `.env` file in the root directory:
```env
VITE_GOOGLE_CLIENT_ID="your-google-client-id"
VITE_GITHUB_CLIENT_ID="your-github-client-id"
```

#### Backend Environment File (`server/.env`)
Create a `.env` file in the `server` directory:
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
JWT_SECRET="your-jwt-signing-key"
PORT=5000
```

### 4. Install Dependencies
Run the command below in the project root directory to install packages for the React frontend:
```bash
npm install
```

Then install dependencies for the backend Express server:
```bash
cd server
npm install
cd ..
```

---

## 🏃 Running the Application

### Local Development
To run both the frontend dev server and the backend Express server concurrently, run the following command in the root folder:
```bash
npm run dev
```

*   **Frontend Client:** Runs at [http://localhost:5173/](http://localhost:5173/)
*   **Backend Server:** Runs at [http://localhost:5000/](http://localhost:5000/)

### Building for Production
To bundle the frontend for production:
```bash
npm run build
```
This generates a static single-page application inside the `dist/` directory.

---

## 📱 Mobile Deployment (Android)

The project uses Capacitor to package the compiled web assets into a native Android container.

### 1. Build Frontend Assets
Generate the production web build:
```bash
npm run build
```

### 2. Sync Web Assets with Capacitor
Update the android capacitor directory:
```bash
npx cap sync
```

### 3. Open the Project in Android Studio
Open the generated native files in Android Studio:
```bash
npx cap open android
```

From Android Studio, you can compile, test on an emulator, or export a signed `.apk` file for release.

---

## 🤝 Contribution Guidelines

1. **Keep Styling Modular**: Put reusable styling definitions in `src/index.css` or custom `.css` files rather than adding inline classes where possible.
2. **Follow Type Definitions**: Maintain interfaces inside `src/types/index.ts`. All page templates should use strong typings.
3. **Database migrations**: When modifying the database tables, adjust `server/db.js` initialization queries accordingly.
