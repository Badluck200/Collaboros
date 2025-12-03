# MongoDB Setup Guide for Collaboros

## Option 1: MongoDB Community Edition (Local)

### Windows Installation

1. **Download MongoDB Community Edition**
   - Visit: https://www.mongodb.com/try/download/community
   - Select "Windows" as the OS
   - Download the `.msi` installer

2. **Run the Installer**
   - Execute the downloaded `.msi` file
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service" (optional but recommended)
   - Installation path: `C:\Program Files\MongoDB\Server\7.0\` (or latest version)

3. **Verify Installation**
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service**
   ```powershell
   # If installed as service:
   net start MongoDB
   
   # Or manually:
   mongod --dbpath "C:\data\db"
   ```
   First create the data directory if it doesn't exist:
   ```powershell
   mkdir C:\data\db
   ```

5. **Connect with MongoDB Shell**
   ```powershell
   mongosh
   ```

6. **Configure Connection String**
   Create/update `.env` file in `backend/` folder:
   ```
   MONGODB_URI=mongodb://localhost:27017/collaboros
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   API_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:3000
   ```

7. **Create Database and Collections**
   ```powershell
   mongosh
   ```
   Then in the mongosh shell:
   ```javascript
   // Switch to collaboros database (creates if doesn't exist)
   use collaboros
   
   // Create collections with validation
   db.createCollection("users")
   db.createCollection("portfolioposts")
   db.createCollection("jobrequests")
   db.createCollection("messages")
   db.createCollection("reviews")
   
   // Verify collections
   show collections
   ```

---

## Option 2: MongoDB Atlas (Cloud - Recommended for MVP)

### Setup Steps

1. **Create MongoDB Atlas Account**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Verify email

2. **Create a Free Cluster**
   - Click "Create a Deployment"
   - Select "M0 Free Cluster" (free tier, perfect for MVP)
   - Choose cloud provider (AWS recommended)
   - Choose region closest to you
   - Click "Create Cluster"

3. **Configure Network Access**
   - Go to "Network Access" tab
   - Click "Add IP Address"
   - Select "Allow access from anywhere" (0.0.0.0/0) for development
   - ⚠️ For production, use specific IP addresses

4. **Create Database User**
   - Go to "Database Access" tab
   - Click "Add New Database User"
   - Set username: `collaboros_user`
   - Generate secure password (save this!)
   - Select "Read and Write to any database"
   - Click "Add User"

5. **Get Connection String**
   - Go to "Clusters" tab
   - Click "Connect" button
   - Select "Drivers" option
   - Copy the connection string
   - Will look like: `mongodb+srv://username:password@cluster.mongodb.net/collaboros?retryWrites=true&w=majority`

6. **Configure .env File**
   ```
   MONGODB_URI=mongodb+srv://collaboros_user:your_password@cluster.mongodb.net/collaboros?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   API_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:3000
   ```

7. **Collections Auto-Create**
   - MongoDB Atlas will automatically create collections when your app first writes to them
   - No manual collection creation needed

---

## Testing the Connection

### 1. Using MongoDB Shell

```powershell
# For local MongoDB
mongosh "mongodb://localhost:27017/collaboros"

# For MongoDB Atlas (replace with your connection string)
mongosh "mongodb+srv://collaboros_user:password@cluster.mongodb.net/collaboros"
```

### 2. Test with Backend

Start your backend server:
```powershell
cd backend
npm run dev
```

You should see in console:
```
✓ Connected to MongoDB
✓ Collaboros Backend running on http://localhost:5000
✓ Environment: development
```

### 3. Test API Health Check

```powershell
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "message": "Collaboros API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 4. Test with Postman or API Client

#### Register New User
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/register`
- **Body (JSON):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "userType": "creative"
}
```

#### Expected Response (201 Created):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011"
}
```

---

## Important MongoDB Configuration Notes

### Default Ports
- **MongoDB Local:** 27017
- **MongoDB Shell:** 27017

### Connection String Components
- `mongodb://` - Protocol for local databases
- `mongodb+srv://` - Protocol for MongoDB Atlas (DNS seed list)
- `localhost:27017` - Local server address
- `/collaboros` - Database name
- `?retryWrites=true&w=majority` - Write concern options

### Security Best Practices
- ✅ Use strong passwords for database users
- ✅ Use MongoDB Atlas IP whitelist in production (not 0.0.0.0/0)
- ✅ Enable network encryption
- ✅ Rotate JWT_SECRET regularly
- ✅ Never commit `.env` file with credentials to Git

### Troubleshooting

**Connection Refused Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
- Solution: Ensure MongoDB service is running
  - Windows: `net start MongoDB`
  - Restart: `net stop MongoDB` then `net start MongoDB`

**Authentication Failed**
```
Error: authentication failed
```
- Solution: Verify MongoDB Atlas credentials in .env file
- Ensure IP is whitelisted in Atlas Network Access

**Cannot Find mongod/mongosh**
- Solution: Add MongoDB to PATH
  ```powershell
  $env:Path += ";C:\Program Files\MongoDB\Server\7.0\bin"
  ```

---

## Environment Variables Setup

Create `backend/.env` file with:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/collaboros
# OR for Atlas:
# MONGODB_URI=mongodb+srv://collaboros_user:password@cluster.mongodb.net/collaboros?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_change_in_production

# URLs
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

After setting up, restart your backend server:
```powershell
npm run dev
```

---

## Next Steps

1. ✅ MongoDB installed and running
2. ✅ Connection string configured in .env
3. ✅ Backend server connected to database
4. ✅ Test API endpoints with Postman
5. 🔜 Test all API routes (portfolio, jobs, messages, reviews, users)
6. 🔜 Connect frontend to backend API
7. 🔜 Deploy to production

---

## API Endpoint Reference

With MongoDB setup complete, all these endpoints are now ready to use:

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login

### Portfolio
- `GET /api/portfolio/browse` - Browse all posts
- `POST /api/portfolio` - Create new portfolio post
- `GET /api/portfolio/my-posts` - Get user's posts
- `GET /api/portfolio/:postId` - Get single post
- `PUT /api/portfolio/:postId` - Update post
- `PATCH /api/portfolio/:postId/archive` - Archive post
- `PATCH /api/portfolio/:postId/hide` - Hide post
- `DELETE /api/portfolio/:postId` - Delete post

### Jobs
- `GET /api/jobs` - Browse all jobs
- `POST /api/jobs` - Post new job
- `GET /api/jobs/my-jobs` - Get user's jobs
- `GET /api/jobs/:jobId` - Get single job
- `PUT /api/jobs/:jobId` - Update job
- `PATCH /api/jobs/:jobId/close` - Close job
- `DELETE /api/jobs/:jobId` - Delete job

### Messaging
- `GET /api/messages/conversation/:userId` - Get conversation history
- `GET /api/messages/conversations/list` - List all conversations
- `POST /api/messages` - Send message
- `PATCH /api/messages/:messageId/read` - Mark as read
- `DELETE /api/messages/:messageId` - Delete message

### Reviews
- `GET /api/reviews/creative/:creativeId` - Get creative reviews
- `GET /api/reviews/job/:jobId` - Get job reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review

### Users
- `GET /api/users/:userId` - Get user profile
- `GET /api/users` - Get current user (authenticated)
- `PUT /api/users` - Update profile
- `PUT /api/users/settings/preferences` - Update settings (maturity filter, etc.)
- `GET /api/users/search/creatives` - Search creatives
- `DELETE /api/users` - Delete account

---

## Support

For MongoDB documentation:
- Local: https://docs.mongodb.com/manual/
- Atlas: https://docs.mongodb.com/atlas/

For Node.js/Express + MongoDB:
- Mongoose docs: https://mongoosejs.com/
