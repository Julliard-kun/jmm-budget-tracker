import express, { Request, Response } from 'express';
import pool from '../../server/database';

const router = express.Router();

// API endpoint to get purchase data
router.get("/api/purchases", async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                item_name,
                item_quantity,
                item_price,
                (item_quantity * item_price) as total_cost,
                date_purchased
            FROM item_inventory
            ORDER BY date_purchased DESC
        `;
        
        const [results] = await pool.query(query) as [any[], any];
        res.json({ success: true, data: results });
    } catch (error) {
        console.error("Error fetching purchase data:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching purchase data" 
        });
    }
});

export default router;

