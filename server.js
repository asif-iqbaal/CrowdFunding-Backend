import express from 'express';
import passport from 'passport';
import session from 'express-session';
import 'dotenv/config';
import { connectDB } from './DB/index.js';
import ErrorMiddleware from './MiddleWare/error.middleware.js';
import UserRoutes from './Routes/user.router.js';
import CampaignRoutes from './Routes/campaign.router.js';
import DonationRoutes from './Routes/donation.router.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const port = 3000;

// Configure CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
// Parse incoming request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Session configuration
app.use(session({ 
  secret: process.env.JWT_SECRET, 
  resave: false, 
  saveUninitialized: true 
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up routes
app.use( UserRoutes);
app.use( CampaignRoutes); 
app.use( DonationRoutes); 

// Error handling middleware
app.use(ErrorMiddleware);

// Connect to the database and start the server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
  });
});
