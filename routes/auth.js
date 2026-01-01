const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("../db");

/* ======================
   USER SIGNUP
   ====================== */
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [name, email, hashedPassword], (err) => {
        if (err) return res.status(400).json({ error: "User already exists" });
        res.json({ status: "signup_success" });
    });
});

/* ======================
   USER LOGIN
   ====================== */
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;

    db.query(sql, [email], async (err, results) => {
        if (err || results.length === 0)
            return res.status(400).json({ error: "Invalid credentials" });

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match)
            return res.status(400).json({ error: "Invalid credentials" });

        res.json({
            status: "login_success",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    });
});

module.exports = router;
