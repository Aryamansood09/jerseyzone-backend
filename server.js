require("dotenv").config();

const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/products");
const uploadRoutes = require("./routes/upload"); // ✅ ADD THIS

const app = express();

app.use(cors());
app.use(express.json());

// ✅ STATIC FOLDER (IMPORTANT)
app.use("/uploads", express.static("uploads"));

// ✅ ROUTES
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes); // ✅ ADD THIS
app.use("/api/payment", require("./routes/payment"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/auth", require("./routes/auth"));


app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
