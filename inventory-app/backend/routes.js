const express = require("express");
const router = express.Router();
const db = require("./db");

// Get all items with item type using JOIN
router.get("/items", (req, res) => {
    const sql = `SELECT items.id, items.name, items.purchase_date, items.stock_available, item_types.type_name 
                 FROM items 
                 JOIN item_types ON items.item_type_id = item_types.id`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get all item types
router.get("/item-types", (req, res) => {
    db.query("SELECT * FROM item_types", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add new item
router.post("/items", (req, res) => {
    const { name, purchase_date, stock_available, item_type_id } = req.body;
    if (!name || !purchase_date || !item_type_id)
        return res.status(400).json({ error: "All fields are required" });

    const sql = "INSERT INTO items (name, purchase_date, stock_available, item_type_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, purchase_date, stock_available, item_type_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Item added successfully", id: result.insertId });
    });
});

// Delete an item by ID
router.delete("/items/:id", (req, res) => {
    const itemId = req.params.id;
    const sql = "DELETE FROM items WHERE id = ?";

    db.query(sql, [itemId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json({ message: "Item deleted successfully" });
    });
});

module.exports = router;
