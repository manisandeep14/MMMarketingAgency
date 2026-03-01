import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDatabase from './config/database.js';
import { configureCloudinary } from './config/cloudinary.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminInviteRoutes from './routes/adminInviteRoutes.js';

import workshopRoutes from "./routes/workshopRoutes.js";


dotenv.config();

const app = express();

/* 🔹 REQUIRED FOR VERCEL + RATE LIMIT */
app.set('trust proxy', 1);

/* 🔹 CONNECT SERVICES */
connectDatabase();
configureCloudinary();

/* 🔹 SECURITY & MIDDLEWARE */

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://mm-marketing-agency-6rqw.vercel.app",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.options("*", cors());





app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* 🔹 RATE LIMITER */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

/* 🔹 ROUTES */
app.use('/api/admin/invites', adminInviteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);  
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/workshop-request", workshopRoutes);

/* 🔹 HEALTH CHECK */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MM Furniture API is running 🚀',
  });
});

/* 🔹 GLOBAL ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

/* 🔹 LOCAL SERVER ONLY (NOT VERCEL) */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});


export default app;
