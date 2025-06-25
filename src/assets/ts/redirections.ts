import express, { Request, Response, NextFunction } from 'express';
import pool from '../../server/database';
import path from 'path';

const router = express.Router();

console.log("Redirections router loaded.");

// TO BE IMPLEMENTED
async function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (req.session.username) {
        let username = req.session.username;
        let statusQuery = `SELECT user_status FROM user WHERE username = ?`;

        try {
            const [statusQueryResult] = await pool.query(statusQuery, [username]) as any[];

            if (statusQueryResult[0].user_status === "online") {
                console.log("Authorized access.");
                next();
            }
            
        } catch {
            console.log("Error checking user status.");
        }

    } else {
        console.log("Unauthorized access.");
        res.redirect("/index");
    }
}

router.get("/index", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "..", "..", "views", "index.html"));

});

router.get("/homepage", isLoggedIn, (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "..", "..", "views", "homepage.html"));

});


router.get("/tables", isLoggedIn, (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "..", "..", "views", "tables.html"));

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