require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const session=require("express-session");

const { HoldingsModel } = require("./model/HoldingsModel");

const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const passport=require("./config/passport");
const authRoutes=require("./routes/auth");
const ensureAuthenticated=require("./middleware/auth");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const allowedOrigins = ["http://localhost:3000", "https://zerodha-clone-7wef.onrender.com"];


app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(bodyParser.json());

// Session FIRST
app.use(
  session({
    secret: "zerodha_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport AFTER session
app.use(passport.initialize());
app.use(passport.session());

// Routes LAST
app.use("/auth", authRoutes);

app.get("/allHoldings", ensureAuthenticated, async (req, res) => {
  const holdings = await HoldingsModel.find({});
  res.json(holdings);
});

app.get(
  "/allPositions",
  ensureAuthenticated,
  async (req, res) => {
    try {
      const allPositions = await PositionsModel.find({});
      res.status(200).json(allPositions);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch positions",
        error: err.message,
      });
    }
  }
);

app.post(
  "/newOrder",
  ensureAuthenticated,
  async (req, res) => {
    try {
      const { name, qty, price, mode } = req.body;

      const newOrder = new OrdersModel({
        name,
        qty,
        price,
        mode,
      });

      await newOrder.save();

      res.status(201).json({
        success: true,
        message: "Order saved successfully",
        order: newOrder,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to save order",
        error: err.message,
      });
    }
  }
);


mongoose
  .connect(uri)
  .then(() => {
    console.log("DB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
