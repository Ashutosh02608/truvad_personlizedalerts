# TRUVAD° — Personalized Regulatory Alerts

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat&logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Private-slate.svg)](#)

An enterprise-grade regulatory intelligence alert platform built for compliance teams, financial institutions, legal advisors, and fintechs. **TRUVAD°** enables users to configure custom, real-time synthesised circular alerts from global regulators and central banks with OTP-verified email delivery.

---

## Key Features

- **Global Regulators Database**: Curated catalog of global supervisory bodies across key jurisdictions:
  - **India**: RBI, SEBI, IRDAI, IFSCA
  - **Europe**: ECB, EBA, ESMA, EIOPA
  - **United Kingdom**: PRA, FCA
  - **United States**: Federal Reserve, SEC, CFTC, OCC, FinCEN
  - **Asia-Pacific**: MAS (Singapore), HKMA (Hong Kong), ASIC (Australia), JFSA (Japan)
  - **Global Standards**: BIS, FATF, FSB, IOSCO
- **Two-Step OTP Verification**: Secure subscription verification workflow using 6-digit one-time passcodes sent via email.
- **Custom Cadence**: Subscribers can choose between:
  - `Real-time`: Instant alerts as circulars and updates are published
  - `Daily`: Synthesised morning executive brief
  - `Weekly`: Consolidated strategic regulatory digest
- **User Feedback & Inquiry Portal**: Integrated feedback modal enabling users to contact the team and submit inquiries directly into the database.
- **Supabase Integration**: PostgreSQL storage with Row-Level Security (RLS) policies for subscriber preferences and incoming feedback.
- **Modern Responsive UI**: Built with React 19 and Next.js 16 App Router, featuring sticky blurred navigation, animated modals, and full mobile drawer support.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS & CSS Modules (no heavy utility dependencies)
- **Database & Auth**: [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- **Email Delivery**: [Nodemailer](https://nodemailer.com/) (SMTP / Gmail App Passwords)

---

## Project Structure

```text
├── app/
│   ├── api/
│   │   ├── alerts/
│   │   │   ├── route.js              # Read / update alert subscriptions
│   │   │   ├── send-otp/route.js     # Generates & dispatches 6-digit OTP
│   │   │   └── verify-otp/route.js   # Validates OTP & records subscription
│   │   └── feedback/
│   │       └── route.js              # Receives user feedback & dispatches notifications
│   ├── personalized-alerts/
│   │   └── page.js                   # Dedicated standalone alerts page
│   ├── globals.css                   # Global variables & typography
│   ├── layout.js                     # Root layout
│   └── page.js                       # Home landing page with integrated alerts form
├── components/
│   ├── FeedbackModal.jsx             # User feedback modal dialog
│   ├── FloatingSettingsWidget.jsx    # Floating quick-access settings widget
│   ├── HeroLeft.jsx                  # Product hero and value proposition
│   ├── Navbar.jsx                    # Sticky navigation with mobile menu drawer
│   ├── OtpModal.jsx                  # 6-digit OTP input dialog
│   ├── PersonalizedAlertsForm.jsx    # Main interactive regulator selection form
│   └── PersonalizedUpdatesSection.jsx# Feature highlights component
├── lib/
│   ├── mailClient.js                 # Nodemailer transporter & HTML email templates
│   ├── otpStore.js                   # In-memory OTP storage with expiration checks
│   ├── regulators.js                 # Comprehensive database of regulatory authorities
│   └── supabaseClient.js             # Supabase client singleton
└── supabase/
    └── schema.sql                    # Postgres table definitions and RLS policies
```

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Ashutosh02608/Truvad_personlizedalerts.git
cd Truvad_personlizedalerts
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Populate the required credentials:

```ini
# Supabase Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Email Dispatcher Configuration (SMTP)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
FEEDBACK_TARGET_EMAIL=notifications@yourdomain.com
```

> **Note on Gmail SMTP**: If using Gmail, generate a 16-character App Password via your [Google Account Security](https://myaccount.google.com/apppasswords) page.

### 3. Setup Supabase Database

Run the SQL script located in [`supabase/schema.sql`](supabase/schema.sql) in your Supabase SQL Editor:
- Creates `public.personalized_alerts` table
- Creates `public.feedback` table
- Configures Row Level Security (RLS) policies and performance indexes

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server with Turbopack |
| `npm run build` | Builds optimized production bundle |
| `npm run start` | Runs the production server |
| `npm run lint` | Runs ESLint validation across all code |

---

## API Documentation

### `POST /api/alerts/send-otp`
Dispatches a 6-digit verification code to the target email.
- **Request Body**: `{ "email": "user@example.com" }`
- **Response**: `{ "success": true, "message": "OTP sent successfully" }`

### `POST /api/alerts/verify-otp`
Validates the OTP and persists the subscriber's selected regulators.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp": "123456",
    "regulators": ["rbi", "sebi", "ecb", "sec"],
    "cadence": "realtime"
  }
  ```
- **Response**: `{ "success": true, "data": { ... } }`

### `POST /api/feedback`
Captures user feedback and optionally notifies the support team via email.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "feedback": "Would love to see integration with Canadian OSFI."
  }
  ```

---

## License

Proprietary and Confidential. Copyright © TRUVAD. All rights reserved.
