# MM Furniture E-Commerce Platform

## Overview
A full-stack MERN (MongoDB, Express.js, React.js, Node.js) e-commerce platform for furniture shopping with payment integration, email services, and admin dashboard.

## Project Structure
```
.
├── backend/               # Node.js Express backend
│   ├── src/
│   │   ├── models/       # Mongoose schemas (User, Product, Cart, Order, Wishlist)
│   │   ├── controllers/  # Business logic handlers
│   │   ├── routes/       # API route definitions
│   │   ├── middleware/   # Auth, upload, validation middleware
│   │   ├── config/       # DB, Cloudinary, Nodemailer config
│   │   └── utils/        # JWT, email templates, helpers
│   └── .env              # Environment variables
│
├── frontend/             # React Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable React components (Navbar, Footer)
│   │   ├── pages/        # Page components (Home, Products, Cart, Admin, etc.)
│   │   ├── redux/        # Redux Toolkit state management
│   │   └── utils/        # API client, helpers
│   └── .env              # Frontend environment variables
│
└── attached_assets/      # PDF blueprint and other assets
```

## Recent Changes (November 7, 2025)
- ✅ Initialized complete MERN project structure
- ✅ Set up backend with Express.js and MongoDB connection
- ✅ Created all MongoDB models with Mongoose schemas
- ✅ Implemented JWT authentication system with email verification
- ✅ Built comprehensive Product, Cart, Wishlist, and Order APIs
- ✅ Integrated Cloudinary for image uploads
- ✅ Integrated Razorpay payment gateway
- ✅ Set up React frontend with TailwindCSS and Redux Toolkit
- ✅ Created authentication pages (Login, Register, Email Verification, Password Reset)
- ✅ Built product browsing with search and filters
- ✅ Implemented Cart, Wishlist, and Checkout with Razorpay
- 🔄 Currently building: Profile, Orders, and Admin Dashboard pages

## Technology Stack
**Frontend:**
- React.js 18 with Vite
- Redux Toolkit for state management
- TailwindCSS for styling
- React Router for navigation
- Axios for API calls
- React Toastify for notifications

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Nodemailer for email services
- Razorpay SDK for payments
- Cloudinary for image storage
- Multer for file uploads

**Database:**
- MongoDB (local development, MongoDB Atlas for production)

## Features Implemented
### User Features:
- User registration with email verification
- Login/logout with JWT authentication
- Password reset via email
- Browse products with search, category filter, and price range
- Product details with image gallery
- Add/remove products from cart and wishlist
- Multi-address management
- Checkout with Razorpay payment integration
- Order history and tracking
- User profile management

### Admin Features (In Progress):
- Admin login with role-based access
- Dashboard with analytics
- Product CRUD operations with image upload
- Order management with status updates
- User management

## API Endpoints
**Auth:** `/api/auth/*` - register, login, verify-email, forgot-password, reset-password, profile
**Products:** `/api/products/*` - CRUD operations, filtering, search
**Cart:** `/api/cart/*` - get, add, update, remove items
**Wishlist:** `/api/wishlist/*` - get, add, remove items
**Orders:** `/api/orders/*` - create, get user orders, razorpay integration
**Admin:** `/api/admin/*` - dashboard stats, user management, order management

## Environment Setup
Backend requires:
- `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- `FRONTEND_URL`

Frontend requires:
- `VITE_API_URL`

## Running the Application
**Frontend:** Port 5000 (Vite dev server with hot reload)
**Backend:** Port 3000 (Express server)

Frontend is configured to connect to backend at `http://localhost:3000/api`

## User Preferences
- No TypeScript - Pure JavaScript implementation
- Aesthetic and user-friendly design with TailwindCSS
- Complete MERN stack as requested

## Next Steps
1. Complete Profile and Orders pages
2. Build Admin Dashboard
3. Add sample products for testing
4. Test full user flow (registration → shopping → checkout → order)
5. Deploy to production (Vercel for frontend, Render for backend)
