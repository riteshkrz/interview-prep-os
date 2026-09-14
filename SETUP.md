# 🛠️ Project Setup & Installation Guide

Complete, step-by-step walkthrough for setting up, configuring, and running **Interview Prep OS** locally and in production.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Quick Local Setup (Zero-Config Mode)](#2-quick-local-setup-zero-config-mode)
3. [Environment Configuration](#3-environment-configuration)
4. [Supabase Cloud Database Setup](#4-supabase-cloud-database-setup-optional)
5. [Configuring Authentication & Email (Resend)](#5-configuring-authentication--email-resend)
6. [Available Scripts & Commands](#6-available-scripts--commands)
7. [Running Automated Tests](#7-running-automated-tests)
8. [Production Deployment](#8-production-deployment)
9. [Troubleshooting & FAQs](#9-troubleshooting--faqs)

---

## 1. Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js**: `v18.0.0` or higher (`v20.x LTS` recommended)
  - Verify with: `node -v`
- **npm**: `v9.0.0` or higher (comes with Node.js)
  - Verify with: `npm -v`
- **Git**: `v2.x` or higher
  - Verify with: `git --version`
- **A Modern Browser**: Chrome, Brave, Edge, Firefox, or Safari

*(Optional)* A free account at [Supabase.com](https://supabase.com) if you want multi-device cloud synchronization and authentication.

---

## 2. Quick Local Setup (Zero-Config Mode)

**Interview Prep OS is designed local-first.** You can run and use the full application immediately without setting up any backend or database! It will automatically save all your progress, checklist items, and solve times in your browser's `localStorage`.

### Step 1: Clone the Repository
```bash
# Using SSH (recommended if you have GitHub SSH keys configured)
git clone git@github.com:riteshkrz/interview-prep-os.git

# Or using HTTPS
git clone https://github.com/riteshkrz/interview-prep-os.git

# Move into the project directory
cd interview-prep-os
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Launch Local Development Server
```bash
npm run dev
```

You will see terminal output similar to:
```text
  VITE v6.4.3  ready in 46 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open **`http://localhost:5173/`** in your browser:
- **Landing Page**: `http://localhost:5173/#/`
- **Interactive Dashboard**: `http://localhost:5173/#/dashboard`
- **Sign In / Account**: `http://localhost:5173/#/signin`

---

## 3. Environment Configuration

To enable cloud synchronization across multiple devices (e.g. laptop and phone/tablet), create a local environment file:

```bash
cp .env.example .env
```

Open `.env` in your editor:

```env
# Supabase Project URL (found in Project Settings -> API)
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Anon / Public API Key (found in Project Settings -> API)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Security Note**: Never commit your `.env` file to Git. The `.gitignore` file is already pre-configured to ignore `.env`, `.env.local`, and sensitive secrets.

---

## 4. Supabase Cloud Database Setup (Optional)

If you want cross-device synchronization and user accounts, set up your Supabase project:

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Click **New Project**.
3. Choose an organization, enter a project name (e.g., `interview-prep-os`), generate a secure database password, and select the region closest to you.
4. Click **Create new project** and wait $\approx 2$ minutes for provisioning.

### Step 2: Retrieve API Keys
1. In your Supabase Dashboard, click the **Settings** gear icon $\to$ **API**.
2. Copy **Project URL** and paste it into `VITE_SUPABASE_URL` in `.env`.
3. Copy **anon / public key** and paste it into `VITE_SUPABASE_ANON_KEY` in `.env`.

### Step 3: Run Database Migrations (In Order)
Go to **SQL Editor** in your Supabase dashboard (**SQL Editor** $\to$ **New query**). Execute the migration scripts from the `supabase/` folder in the following order:

#### 1. `supabase/schema.sql` (Core Schema & Security)
- Creates the `user_prep_state` table for storing JSONB state snapshots.
- Adds Row-Level Security (RLS) policies so users can only access their own data.
- Configures real-time replication via `supabase_realtime`.
- Creates `access_passes` table for activation keys and PIN verification.

#### 2. `supabase/seed_questions.sql` (Question Catalog)
- Populates the initial question taxonomy and problem metadata.

#### 3. `supabase/update_100_dsa_problems.sql` (100 Core DSA Problems)
- Seeds the comprehensive 100-problem curriculum spanning all 14 algorithmic patterns (Two Pointers, Sliding Window, DP, Graphs, Binary Search, etc.) with difficulties, hints, and test scenarios.

#### 4. `supabase/update_20_system_designs.sql` (20 Production System Specs)
- Seeds the 20 production-grade distributed system specs (Rate Limiters, DynamoDB-like KV Store, Payment Gateways, Autocomplete Trie, etc.).

---

## 5. Configuring Authentication & Email (Resend)

By default, Supabase provides built-in email auth with a rate limit of 3 emails per hour. To use custom transactional emails via **Resend**:

1. **Sign Up for Resend**: Go to [resend.com](https://resend.com) and create a free account.
2. **Verify Your Sending Domain**: In Resend, add and verify your domain (e.g., `interviewprepos.com`) with DNS records (MX, SPF, DKIM).
3. **Generate an API Key**: In Resend $\to$ **API Keys** $\to$ **Create API Key** (Permissions: *Full Access*). Copy the `re_...` key.
4. **Connect to Supabase**:
   - In Supabase Dashboard, navigate to **Project Settings** $\to$ **Authentication** $\to$ **SMTP Settings**.
   - Enable **Custom SMTP**.
   - **Sender Email**: `noreply@yourdomain.com` (or `onboarding@resend.dev` for sandbox testing)
   - **Sender Name**: `Interview Prep OS`
   - **Host**: `smtp.resend.com`
   - **Port**: `465` (SSL) or `587` (TLS)
   - **Username**: `resend`
   - **Password**: Your Resend API Key (`re_...`)
5. Click **Save Changes**.

---

## 6. Available Scripts & Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Vite dev server with hot module replacement (HMR). |
| `npm run build` | Compiles and bundles production-ready assets into the `dist/` directory. |
| `npm run preview` | Starts a local static web server to preview the production build in `dist/`. |

---

## 7. Running Automated Tests

The repository contains lightweight verification test runners in the `scratch/` directory:

```bash
# Test sidebar toggle and keyboard shortcut logic (⌘B)
node scratch/test_sidebar_toggle_simulation.mjs

# Test header decluttering, user avatar & sign-in mount
node scratch/test_logout_header.mjs

# Test signout flow and redirect to #/signin
node scratch/test_signout_redirect.mjs

# Test PDF Store digital guides catalog
node scratch/test_pdf_store.mjs
```

---

## 8. Production Deployment

### Option A: Vercel (Recommended)
1. Push your code to your GitHub repository:
   ```bash
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your `interview-prep-os` GitHub repository.
4. Set the Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-public-key`
6. Click **Deploy**.

### Option B: Netlify
1. Connect your repository in [netlify.com](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set your environment variables under **Site configuration** $\to$ **Environment variables**.

---

## 9. Troubleshooting & FAQs

### Q: Port 5173 is already in use?
Vite will automatically detect if port 5173 is occupied and offer port 5174 (e.g. `http://localhost:5174/`). You can specify a custom port with:
```bash
npx vite --port 3000
```

### Q: Why does the Cloud Sync pill say "Local Only"?
This means you haven't configured a `.env` file or your `VITE_SUPABASE_URL` is empty. The application continues functioning smoothly using browser `localStorage`. To enable cloud sync, follow [Section 3](#3-environment-configuration).

### Q: Why does the sidebar disappear on smaller laptop windows?
Press `⌘B` (or `Ctrl+B`) or click the **Sidebar** button in the top left of the header to restore the sidebar. The UI is responsive down to mobile viewports.

### Q: How do I clear my local state and start fresh?
You can reset your state at any time by clicking the **Reset / Clean Sprint** option in the workspace sidebar, or by opening browser DevTools $\to$ Application $\to$ Local Storage and clearing the keys.
