import express, { Request, Response} from 'express';
import pool from '../../server/database';

const router = express.Router();

console.log("Login router loaded");

// Authentication route
// TODO: Implement encryption for password
router.post('/authentication', async (req: Request, res: Response) => {
    let getUsernameInput = req.body.usernameInput;
    let getPasswordInput = req.body.passwordInput;

    console.log("Username: " + getUsernameInput + " Password: " + getPasswordInput);
    
    let userStatus = `SELECT user_status FROM user WHERE username = ?`;

    try {
        const [userStatusResults] = await pool.query(userStatus, [getUsernameInput]) as [any[], any];
        console.log("User status results: ", userStatusResults);
        
        if (userStatusResults.length === 0) {
            console.log("User not found.");
            res.json({ message: "User not found." });

        } else if (userStatusResults[0].user_status === "online") {
            res.json({ message: "User already online" });

        } else {
            let credentialsQuery = `SELECT username, password FROM user WHERE username = ?`;

            const [credentialsQueryResults] = await pool.query(credentialsQuery, [getUsernameInput]) as [any[], any];

            if (credentialsQueryResults.length === 0) {
                res.json({ message: "User not found."});

            } else {
                if (credentialsQueryResults[0].username === getUsernameInput && credentialsQueryResults[0].password ) {
                    // TO BE FIXED:req.session.username = credentialsQueryResults[0].username;
                    res.json({ success: true, message: "Login succesful."})
                    
                    let updateUserStatus = `UPDATE user SET user_status = 'online' WHERE username = ?`;

                    try {
                        await pool.query(updateUserStatus, [getUsernameInput]);
                        console.log("User status updated to online");

                        // Add redirections.ts
                    } catch (error) {
                        console.error("Error updating user status: ", error);
                    }
                    
                } else {
                    res.json({ message: "Invalid credentials."});
                }

            }
        }

    } catch (error) {
        console.error("Error querying user status: ", error);
        res.status(500).json({ error: "Database error" });
    }
});

export default router;