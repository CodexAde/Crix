import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Required for Render to handle secure cookies correctly
app.set("trust proxy", 1);

// Robust CORS setup
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000'
];

if (process.env.FRONTEND_URL) {
    // Add the raw URL
    allowedOrigins.push(process.env.FRONTEND_URL);
    // Add with https:// if missing
    if (!process.env.FRONTEND_URL.startsWith('http')) {
        allowedOrigins.push(`https://${process.env.FRONTEND_URL}`);
    }
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin matches allowed list (loose check for slashes)
        const isAllowed = allowedOrigins.some(allowed => 
            origin === allowed || origin === allowed.replace(/\/$/, "")
        );

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log("Blocked CORS Origin:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from './routes/user.routes.js';
import syllabusRouter from './routes/syllabus.routes.js';
import aiRouter from './routes/ai.routes.js';
import progressRouter from './routes/progress.routes.js';

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/syllabus", syllabusRouter);
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/progress", progressRouter);

app.get('/', (req, res) => {
    res.send('Cerix Backend is running!');
});

export { app };
