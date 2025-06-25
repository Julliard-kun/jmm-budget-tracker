import express, { Request, Response} from 'express';
import pool from '../../server/database';

const router = express.Router();

console.log("Login router loaded");

// Authentication route
router.post('/authentication', (req: Request, res: Response) => {
    let usernameInput = req.body.username;
    let passwordInput = req.body.password;

    console.log(usernameInput, passwordInput);

});

export default router;