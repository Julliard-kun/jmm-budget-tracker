import express, { Request, Response } from 'express';
import pool from '../../server/database';
import path from 'path';

const router = express.Router();

console.log("Redirections router loaded.");

// TO BE IMPLEMENTED
// function isLoggedIn(req: Request, res: Response, next: NextFunction) {
//     if (req.session.username) {
        
//     }
// }

router.get("/index", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "..", "..", "views", "index.html"));

});

router.get("/homepage", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "..", "..", "views", "homepage.html"));

});

router.get("/logout", async (req: Request, res: Response) => {
    let updateUserStatus = `UPDATE user SET user_status = 'offline'`
    try {
        const [updateUserStatusResult] = await pool.query(updateUserStatus);
        console.log("User status updated.");
        res.sendFile(path.join(__dirname, "..", "..", "views", "index.html"));


    } catch {
        console.log("Error updating user status.");
    }

});

export default router;