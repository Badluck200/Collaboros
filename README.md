# Collaboros - Creative Marketplace Platform

A modern, full-stack platform for graphic designers and photographers to showcase work, collaborate with clients, and get hired. Clients can browse creatives, request projects, and manage deliverables.

##  Project Overview

**Concept:** A curated, high-quality marketplace and portfolio hub for creatives combining portfolio display, job requests, messaging, and client management.

**Tech Stack:**
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)

##  Project Structure

```
collaboros/
├── src/                   # Frontend source (Next.js)
│   ├── app/              # Pages and layouts
│   ├── components/       # Reusable components
│   └── types/            # TypeScript types
│
├── backend/              # Express backend
│   ├── src/
│   │   ├── config/       # Database connection
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth and other middleware
│   │   ├── models/       # MongoDB schemas
│   │   └── routes/       # API endpoints
│   └── .env.example      # Environment template
│
└── README.md            # This file
```

##  Getting Started

### Prerequisites
- Node.js 16+
- MongoDB (local or cloud - Atlas, MongoDB Community, etc.)
- npm or yarn

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI:
```
MONGODB_URI=mongodb://localhost:27017/collaboros
JWT_SECRET=your_secure_secret_key
```

5. Run development server:
```bash
npm run dev
```

Backend will be available at: `http://localhost:5000`

##  MVP Features

### For Creatives:
-  User profile and portfolio creation
-  Upload and showcase work (images with descriptions and tags)
-  **Post archive/hide** - Remove posts from public view without deleting
-  **Maturity settings** - Mark work as Safe for Work or +18
- Receive and manage job requests
- Deliver files to clients
- Messaging with clients
- Track ratings and reviews

### For Clients:
-  Browse and filter creatives by style, location, service
-  **Maturity filter** - Toggle +18 content on/off in account settings
- Search and discover portfolios
- Post job requests
- Message with creatives
- Manage projects and deliverables
- Rate and review work

### Platform Features:
-  Clean, modern, warm aesthetic (amber brown accent colors)
-  Professional portfolio display
-  Content moderation for mature work
   User authentication (JWT)
-  MongoDB database with comprehensive models
- Real-time messaging
- Reviews and ratings system

##  Design

**Style:** Clean, modern, visual-first with a warm, cozy aesthetic

**Colors:**
- Background: Cream/Warm Beige (#faf8f3)
- Foreground: Warm Dark Brown (#2c2416)
- Accent: Amber Brown (#b8860b)
- Gold: Warm Gold (#d4a574)

**Typography:** Modern, readable (Inter, Aeonik)

**Logo:** Circular "C" inspired by Ouroboros (continuous creative cycle)

##  Adding Images

1. Prepare your images (recommended formats: .jpg, .webp, .png)
2. Place them in `public/images/` folder
3. Use these filenames:
   - `portfolio-hero.jpg` - Hero section
   - `client-browse.jpg` - Client browsing section
   - `portfolio-1.jpg`, `portfolio-2.jpg`, `portfolio-3.jpg` - Portfolio examples
   - `portfolio-work-1.jpg`, `portfolio-work-2.jpg` - Portfolio displays
   - `profile-avatar.jpg` - User avatar

See `public/images/README.md` for detailed guidelines.

##  Database Models

### User
- Authentication and profile information
- User type (creative or client)
- Maturity content filter setting
- Avatar and bio

### PortfolioPost
- Portfolio items with images
- Maturity level (sfw or mature)
- Archive/hide functionality
- Tags and category

### JobRequest
- Client job postings
- Budget and deadline
- Status tracking
- Proposal management

### Message
- Direct messaging between users
- Read/unread status

### Review
- Client reviews of creatives
- Star ratings (1-5)
- Comments

##  API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

*(Additional endpoints for portfolio, jobs, messaging coming soon)*

##  Development

### Frontend Commands
```bash
npm run dev      # Development server
npm run build    # Build for production
npm run lint     # Run ESLint
```

### Backend Commands
```bash
cd backend
npm run dev      # Development server with auto-reload
npm run build    # TypeScript compilation
npm run start    # Production server
npm run lint     # Run ESLint
```

## 🔐 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/collaboros
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

## 📝 Features in Development

- [ ] Portfolio post CRUD routes
- [ ] Job request management
- [ ] Messaging system
- [ ] Reviews and ratings
- [ ] Search and advanced filtering
- [ ] File upload service
- [ ] Image optimization
- [ ] Email notifications
- [ ] Subscription/payment system
- [ ] Admin dashboard

## 🤝 Contributing

This is an MVP project. Future contributions welcome!

## 📄 License

ISC

---

**Status:** MVP Phase - Core features implemented and ready for expansion
