const express = require("express");
const db = require("../db");
const router = express.Router();

/* GET PRODUCTS BY CATEGORY */
router.get("/:category", (req, res) => {
  const category = req.params.category;

  db.query(
    "SELECT * FROM products WHERE category = ?",
    [category],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});

/* GET PRODUCT BY ID */
router.get("/item/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM products WHERE id = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows[0]);
    }
  );
});

/* ADD PRODUCT (ADMIN) */
router.post("/add", (req, res) => {
  const { name, price, category, image, description } = req.body;

  db.query(
    "INSERT INTO products (name, price, category, image, description) VALUES (?,?,?,?,?)",
    [name, price, category, image, description],
    () => res.json({ message: "Product Added" })
  );
});

/* DELETE PRODUCT */
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM products WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Delete failed" });
      }
      res.json({ message: "Product deleted successfully" });
    }
  );
});

/* UPDATE PRODUCT (KEEP OLD IMAGE IF NOT PROVIDED) */
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { name, price, category, image, description } = req.body;

  if (image) {
    // Image updated
    db.query(
      `UPDATE products 
       SET name=?, price=?, category=?, image=?, description=? 
       WHERE id=?`,
      [name, price, category, image, description, id],
      (err) => {
        if (err) return res.status(500).json({ message: "Update failed" });
        res.json({ message: "Product updated with image" });
      }
    );
  } else {
    // Image NOT updated → keep old image
    db.query(
      `UPDATE products 
       SET name=?, price=?, category=?, description=? 
       WHERE id=?`,
      [name, price, category, description, id],
      (err) => {
        if (err) return res.status(500).json({ message: "Update failed" });
        res.json({ message: "Product updated without image" });
      }
    );
  }
});


module.exports = router;

