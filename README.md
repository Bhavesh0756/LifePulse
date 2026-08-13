# LifePulse 🩸

> **Connecting Lives. Saving Lives.**
> A Privacy-First HealthTech Blood Donation Coordination Platform.

---

## 🌟 Core Differentiator
LifePulse connects verified healthcare institutions (Hospitals) with compatible and available donors with strict privacy preservation:
- Hospitals create urgent or routine blood requests.
- The system evaluates and prioritizes potential donors using a **Logistical/Platform Prioritization Score** based on blood group compatibility, proximity/location, availability, and verification status.
- **Privacy Rule**: Donor phone numbers and email addresses remain strictly hidden from hospitals until the donor explicitly reviews and accepts the request.

---

## 🏗 Project Architecture

```
lifepulse/
├── frontend/             # React + Vite + Tailwind CSS + TanStack Router
│   ├── src/
│   │   ├── animations/   # GSAP & Framer Motion animations
│   │   ├── assets/       # Media & graphics
│   │   ├── components/   # UI components & Radix UI primitives
│   │   ├── context/      # React state & authentication contexts
│   │   ├── data/         # Static datasets & compatibility matrices
│   │   ├── hooks/        # Custom React hooks
│   │   ├── layouts/      # Dashboard & Public layouts
│   │   ├── pages/        # Route views (Donor, Hospital, Admin, Public)
│   │   ├── routes/       # TanStack Router definitions
│   │   ├── services/     # API integration services
│   │   └── utils/        # Logistical scoring & formatting helpers
└── backend/              # Node.js + Express + Mongoose + JWT
    ├── src/
    │   ├── config/       # DB & Server configuration
    │   ├── controllers/  # API request handlers
    │   ├── middleware/   # Auth, role-checking, error handling
    │   ├── models/       # MongoDB schemas (User, Donor, Hospital, Request)
    │   ├── routes/       # Express route handlers
    │   ├── services/     # Business logic & donor matching algorithms
    │   ├── utils/        # JWT & encryption helpers
    │   └── validators/   # Input validation schemas
```

---

## 🎨 Visual Identity & Color Palette

- **Primary Red**: `#D7193F`
- **Deep Crimson**: `#A80F2D`
- **Midnight Navy**: `#081B3A`
- **Slate Navy**: `#243B53`
- **Background**: `#F7F9FC`
- **Success**: `#16A34A`
- **Warning**: `#F59E0B`
- **Danger**: `#DC2626`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB (Local or Atlas instance)

### Installation & Running Locally

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables**:
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`

3. **Start Development Servers**:
   ```bash
   # Run both Frontend & Backend concurrently
   npm run dev

   # Or run independently:
   npm run dev:backend   # Express server at http://localhost:5000
   npm run dev:frontend  # Vite dev server at http://localhost:5173
   ```
