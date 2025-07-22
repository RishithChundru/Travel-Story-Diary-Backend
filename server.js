import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors'; 
import connectDB from './config/db.js'; 
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; 
import travelStoryRoutes from './routes/travelStory.js';
import { errorHandler } from './middleware/errorMiddleware.js'; 

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors())

const allowedOrigins = ['https://travel-story-diary-frontend.vercel.app'];


const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS for origin:', origin); 
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, 
    optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/travelstories', travelStoryRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`.cyan.underline));