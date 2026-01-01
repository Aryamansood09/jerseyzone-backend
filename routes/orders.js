const express = require("express");
const router = express.Router();
const db = require("../db");

// Utils
const sendEmail = require("../utils/sendEmail");
const invoiceTemplate = require("../utils/invoiceTemplate");
const generateInvoice = require("../utils/generateInvoice"); // PDF generator

/* =========================
   SAVE ORDER + SEND EMAIL
   ========================= */
router.post("/save", async (req, res) => {
    const {
        user_id,
        name,
        phone,
        address,
        city,
        pincode,
        items,
        total,
        razorpay_order_id,
        razorpay_payment_id,
        email
    } = req.body;

    const sql = `
        INSERT INTO orders
        (user_id, customer_name, phone, address, city, pincode,
         items, total_amount,
         razorpay_order_id, razorpay_payment_id, payment_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            user_id,
            name,
            phone,
            address,
            city,
            pincode,
            JSON.stringify(items),
            total,
            razorpay_order_id,
            razorpay_payment_id,
            "PAID"
        ],
        async (err) => {
            if (err) {
                console.error("DB ERROR:", err);
                return res.status(500).json({ error: "Order save failed" });
            }

            /* =========================
               SEND EMAIL (NON-BLOCKING)
               ========================= */
            try {
                const orderData = {
                    id: razorpay_order_id,
                    name,
                    phone,
                    address,
                    city,
                    pincode,
                    items,
                    total
                };

                const html = invoiceTemplate(orderData);

                await sendEmail(
                    email || process.env.EMAIL_USER,
                    "🧾 JerseyZone Order Confirmation",
                    html
                );
            } catch (mailErr) {
                console.error("EMAIL ERROR:", mailErr);
            }

            res.json({ status: "order_saved_and_emailed" });
        }
    );
});

/* =========================
   GET ALL ORDERS (ADMIN)
   ========================= */
router.get("/all", (req, res) => {
    db.query(
        "SELECT * FROM orders ORDER BY created_at DESC",
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );
});

/* =========================
   GET USER ORDERS
   ========================= */
router.get("/user/:userId", (req, res) => {
    db.query(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
        [req.params.userId],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );
});

/* =========================
   DOWNLOAD INVOICE (PDF)
   ========================= */
router.get("/invoice/:id", (req, res) => {
    const orderId = req.params.id;

    db.query(
        "SELECT * FROM orders WHERE id = ?",
        [orderId],
        (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).send("Order not found");
            }

            generateInvoice(res, results[0]); // ✅ SINGLE SOURCE
        }
    );
});

module.exports = router;
