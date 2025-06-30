import dotenv from 'dotenv';
import express, { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import path from 'path';
import pool from './database';
import loginRouter from '../assets/ts/login';
import redirectionsRouter from '../assets/ts/redirections';
import tablesRouter from '../assets/ts/tables';

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3636', 10);
const HOSTNAME: string = process.env.HOSTNAME || 'localhost';
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later."
});

// Middleware
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(limiter);

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 2 * 60 * 60 * 1000 // 2 hours
    }
}));

// Attach routers
app.use('/', loginRouter);
app.use('/', redirectionsRouter);
app.use('/', tablesRouter);

// Serve static files from src/assets
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// Serve index.html as the default page
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// 404 handler 
app.use((req: Request, res: Response) => {
    res.status(404).sendFile(path.join(__dirname, '..', 'views', '404.html'));
});

// 500 handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).sendFile(path.join(__dirname, '..', 'views', '500.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app; 