# Collaboros Backend API

Node.js/Express backend for Collaboros platform with MongoDB database.

## Getting Started

### Prerequisites
- Node.js 16+
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string and JWT secret

### Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm run build
npm start
```

### API Routes

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Project Structure

```
backend/
├── src/
│   ├── config/       # Database and configuration
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Express middleware
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── types/        # TypeScript types
│   └── index.ts      # Main application file
├── dist/             # Compiled JavaScript
├── .env.example      # Environment variables template
├── package.json      # Dependencies
└── tsconfig.json     # TypeScript config
```

### Models

1. **User** - User accounts with settings (creative or client)
   - Maturity filter setting for content
   - User type (creative or client)
   - Profile information

2. **PortfolioPost** - Portfolio items/posts
   - Maturity level (sfw or mature)
   - Archive/hide functionality
   - Images and descriptions

3. **JobRequest** - Job postings by clients
   - Budget and deadline
   - Status tracking
   - Proposal management

4. **Message** - Direct messaging between users
   - Sender and recipient
   - Read status

5. **Review** - Reviews and ratings for creatives
   - Star ratings (1-5)
   - Comments

### Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/collaboros
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

### Features

✓ User authentication with JWT  
✓ MongoDB integration  
✓ Portfolio post management  
✓ Job request system  
✓ Messaging  
✓ Reviews and ratings  
✓ Maturity content filtering  
✓ CORS enabled  

### Next Steps

- Add portfolio post routes
- Add job request routes
- Add messaging routes
- Add review routes
- Add user profile routes
- Implement file upload for images
- Add search and filtering
