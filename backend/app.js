import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3000'],
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
