import express, { Request, Response } from 'express';
import pool from '../../server/database';

const router = express.Router();

// Get table structure
router.get("/api/table-structure", async (req: Request, res: Response) => {
    try {
        const query = `
            SHOW COLUMNS FROM item_inventory
        `;
        const [columns] = await pool.query(query) as [any[], any];
        
        // Format column names for display
        const formattedColumns = columns.map((col: any) => ({
            field: col.Field,
            displayName: col.Field.split('_').map((word: string) => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
        }));

        res.json({ success: true, columns: formattedColumns });
    } catch (error) {
        console.error("Error fetching table structure:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching table structure"
        });
    }
});

// API endpoint to get purchase data
router.get("/api/purchases", async (req: Request, res: Response) => {
    try {
        // First get the columns
        const [columns] = await pool.query('SHOW COLUMNS FROM item_inventory') as [any[], any];
        const columnNames = columns.map((col: any) => col.Field);

        // Build the SELECT query dynamically
        const selectFields = [
            ...columnNames,
            '(item_quantity * item_price) as total_cost'
        ].join(', ');

        const query = `
            SELECT ${selectFields}
            FROM item_inventory
            ORDER BY date_purchased DESC
        `;
        
        const [results] = await pool.query(query) as [any[], any];
        res.json({ 
            success: true, 
            data: results,
            columns: columns.map((col: any) => ({
                field: col.Field,
                type: col.Type
            }))
        });
    } catch (error) {
        console.error("Error fetching purchase data:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching purchase data" 
        });
    }
});

// Add Purchase Item
router.post("/api/add-purchase", async (req: Request, res: Response) => {
    try {
        const { itemName, itemQuantity, itemPrice, itemDate } = req.body;
        let totalCost = itemQuantity * itemPrice;

        const addPurchaseQuery = `INSERT INTO item_inventory (item_name, item_quantity, item_price, total_cost, date_purchased) VALUES (?, ?, ?, ?)`;

        const [result] = await pool.query(addPurchaseQuery, [itemName, itemQuantity, itemPrice, totalCost,itemDate]) as [any[], any[]];

        res.json({
            success: true,
            message: "Purchase added successfully"
        });

    } catch (error) {
        console.error("Error adding purchase: ", error);
        res.status(500).json({
            success: false,
            message: "Error adding purchase"
        });
    }

});

export default router;

