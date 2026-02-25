import express from "express";
import cors from "cors";
import pool from "./db.js";

import userRouter from "./routes/userRoutes.js";
import itemRouter from "./routes/groceryRoutes.js";
import locationRouter from "./routes/locationRoutes.js";
import vendorRouter from "./routes/vendorRoutes.js";
import purchaseRouter from "./routes/purchaseRoutes.js";
import preparedItemRouter from "./routes/preparedItemRoutes.js";
import distributeRouter from "./routes/distributeRoutes.js";
import inventoryRouter from "./routes/inventoryRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";

import salesRouter from "./routes/salesRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1");
    res.json({ status: "ok", db: true });
  } catch (err) {
    res.status(500).json({ status: "error", db: false, error: err.message });
  }
});

// User routes
app.use("/api", userRouter);
// Sales routes
app.use("/api", salesRouter);
// Item routes
app.use("/api", itemRouter);
// Location routes
app.use("/api", locationRouter);
// Vendor routes
app.use("/api", vendorRouter);
// Purchase routes
app.use("/api", purchaseRouter);

// Prepared Items routes
app.use("/api", preparedItemRouter);

// Distributed Items routes
app.use("/api", distributeRouter);

// Inventory routes
app.use("/api", inventoryRouter);

// Dashboard routes
app.use("/api", dashboardRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
