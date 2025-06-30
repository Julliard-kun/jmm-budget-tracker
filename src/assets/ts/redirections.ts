import express, { Request, Response, NextFunction } from 'express';
import pool from '../../server/database';
import path from 'path';

const router = express.Router();

console.log("Redirections router loaded.");

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

// API endpoint to get user session data
router.get("/api/user-session", isLoggedIn, (req: Request, res: Response) => {
    res.json({
        first_name: req.session.first_name,
        last_name: req.session.last_name,
        username: req.session.username
    });
});

router.get("/tables", isLoggedIn, (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "..", "..", "views", "tables.html"));

});

router.get("/logout", async (req: Request, res: Response) => {
    if (req.session.username) {
        let updateUserStatus = `UPDATE user SET user_status = 'offline' WHERE username = ?`;
        try {
            await pool.query(updateUserStatus, [req.session.username]);
            console.log("User status updated to offline.");
        } catch (error) {
            console.log("Error updating user status:", error);
        }
    }

    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.log("Error destroying session:", err);
        }
        res.redirect("/index");
    });
});

export default router;