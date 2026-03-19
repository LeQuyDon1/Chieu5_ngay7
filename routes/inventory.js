const express = require("express");
const router = express.Router();
const Inventory = require("../schemas/inventory");


router.get("/", async (req, res) => {
    try {
        const data = await Inventory.find().populate("product");
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const data = await Inventory.findById(req.params.id).populate("product");
        if (!data) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post("/add-stock", async (req, res) => {
    try {
        const { product, quantity } = req.body;

        const inv = await Inventory.findOne({ product });
        if (!inv) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        inv.stock += quantity;
        await inv.save();

        res.json(inv);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post("/remove-stock", async (req, res) => {
    try {
        const { product, quantity } = req.body;

        const inv = await Inventory.findOne({ product });
        if (!inv) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        if (inv.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock" });
        }

        inv.stock -= quantity;
        await inv.save();

        res.json(inv);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post("/reserve", async (req, res) => {
    try {
        const { product, quantity } = req.body;

        const inv = await Inventory.findOne({ product });
        if (!inv) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        if (inv.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock" });
        }

        inv.stock -= quantity;
        inv.reserved += quantity;

        await inv.save();

        res.json(inv);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post("/sold", async (req, res) => {
    try {
        const { product, quantity } = req.body;

        const inv = await Inventory.findOne({ product });
        if (!inv) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        if (inv.reserved < quantity) {
            return res.status(400).json({ message: "Not enough reserved" });
        }

        inv.reserved -= quantity;
        inv.soldCount += quantity;

        await inv.save();

        res.json(inv);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;