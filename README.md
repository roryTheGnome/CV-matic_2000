# CV-matic 2000

## 📖 Overview

CV-matic 2000 is a full-stack web application designed for managing users, CVs, projects, and professional profiles.

The system allows users to:

* manage their personal profiles,
* create and edit CVs,
* assign skills, languages, and projects,
* preview and export CVs as PDF documents.

The application is built using **Next.js (App Router)** with SSR/SSG support and communicates with a **GraphQL backend**.

---

## 🚀 Live Demo

Deployed on Vercel:
[https://cv-matic-2000-cvmatic.vercel.app](https://cv-matic-2000.vercel.app/login)

---

## ⚙️ Features

### 🔐 Authentication

* Login / Signup
* JWT authentication (access + refresh tokens)
* Token stored in localStorage
* Forgot & Reset password

### 👤 User Management

* Users list with search & sorting
* User profile editing
* Avatar upload (Cloudinary integration)
* Manage user skills and languages

### 📄 CV Management

* Create / update / delete CVs
* Assign skills and projects to CVs
* Edit CV details

### 📁 Projects

* View projects list
* Assign projects to CVs

### 🧠 Skills & Languages

* Add / edit / remove skills with mastery levels
* Add / edit / remove languages with proficiency

### 🖨️ CV Preview & Export

* Preview full CV
* Export CV to PDF (A4 format, multi-page)

### ⚙️ Settings

* Theme switching (next-themes)
* Internationalization (next-intl)

---

## 🛠️ Tech Stack

### Core

* Next.js 16 (App Router)
* React 19
* TypeScript

### State Management

* Zustand

### API Layer

* GraphQL
* Apollo Client

### Styling

* Tailwind CSS

### Utilities

* Axios
* JWT Decode / JOSE
* js-cookie

### UI & UX

* Lucide Icons
* React Hot Toast

### File & PDF

* html2pdf.js
* Cloudinary (avatars)

---

## 📦 Dependencies

Main dependencies:

* @apollo/client
* graphql
* zustand
* next
* react / react-dom
* tailwindcss
* next-themes
* next-intl
* axios
* html2pdf.js
* js-cookie
* jwt-decode
* jose

---

## 📁 Project Structure

```
src/
  actions/            
  api/graphql         # Mutations &  Queries
  app/                # Next.js App Router pages  
  components/         # Reusable UI components
  config/             # Config files
  constants/          
  cypress/e2e/        # E2E Tests
  lib/                # Custom hooks & Apollo Client
  messages/           # Dictionaries
  providers/          # Client , Server and Modal providers
  public/             # Public Folder  
  store/              # authStore & modalStore  
  types/              # TypeScript types
  utils/              # Utilities
```

---

## ⚙️ Getting Started

### 1. Clone repository

```bash
git clone https://github.com/roryTheGnome/CV-matic_2000.git
cd CV-matic_2000
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

### 4. Run development server

```bash
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

## 🔌 Backend Setup

This project requires a locally running GraphQL backend.

Follow instructions provided in the 'launching a local backend' file to start the backend server.

---

## 🧪 Unit Tests

Run unit tests:

```bash
npm run test
```

Run in watch mode:

```bash
npm run test:watch
```

Test stack:

* Jest
* React Testing Library

---

## 🧪 E2E Tests (Cypress)

Run Cypress:

```bash
npx cypress open
```

### Test Structure (by test cases)

#### Authentication

* Register new user
* Login user

#### User Profile

* Edit user profile

#### Skills

* Add skill
* Edit skill mastery
* Remove skill

#### Languages

* Add language
* Edit proficiency
* Remove language

#### Profile Viewing

* Display other user profiles
* Display skills and languages of other users

📌 Additional tests:

* [to be continued]

---

## 🔄 API Integration

The application uses GraphQL queries and mutations via Apollo Client.

Examples:

* login / signup
* users / user
* cvs / cv
* projects
* skills / languages

All data is fetched dynamically from the backend.

---

## 🔐 Authentication Details

* JWT-based authentication
* Access + refresh tokens
* Tokens stored in localStorage
* Automatic token refresh implemented

---

## 📌 Implementation Notes

* Role-based access (Admin / Employee)
* Protected routes for authenticated users
* Read-only mode for чужие (non-owned) resources
* Form validation + backend error handling
* Avatar upload limited to 500KB and supported formats

---

## 🧾 Git Workflow

Repository follows **Conventional Commits** enforced via commitlint.

### Allowed commit types

* init
* feat
* fix
* docs
* style
* refactor
* perf
* test
* build
* ci
* chore
* revert

### Examples

* feat: implement login flow
* fix: handle token refresh error

Commits:
[https://github.com/roryTheGnome/CV-matic_2000/commits/master/](https://github.com/roryTheGnome/CV-matic_2000/commits/master/)

---

## 👥 Team

* [Mykyta Korotych](https://github.com/NikitaBenzin)
* [Odul Kafadar](https://github.com/roryTheGnome)

---
