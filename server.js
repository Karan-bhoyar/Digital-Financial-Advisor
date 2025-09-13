// server.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/financialApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// ✅ Schema
const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  userType: { type: String, enum: ["client", "advisor"] },
  age: Number,
  incomeRange: String,
  financialGoals: String
});
const User = mongoose.model("User", userSchema);

// ✅ Signup (v1)
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { fullName, email, password, phone, userType } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword, phone, userType });
    await newUser.save();

    res.json({ msg: "Signup successful!" });
  } catch (err) {
    res.status(500).json({});
  }
});

// ✅ Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ success: false, msg: "⚠️ Please fill all fields" });
    }

    // Find user
    const user = await User.findOne({ email, userType });
    if (!user) {
      return res.status(401).json({ success: false, msg: "❌ Invalid email or user type" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: "❌ Incorrect password" });
    }

    // Success
    return res.json({
      success: true,
      msg: "✅ Login successful!",
      user: { name: user.fullName, email: user.email, type: user.userType }
    });

  } catch (err) {
    res.status(500).json({ });
  }
});

// ✅ Signup (v2 with extra fields)
app.post("/signup", async (req, res) => {
  try {
    const { type, fullName, email, password, phone, age, incomeRange, financialGoals } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userType: type,
      fullName,
      email,
      password: hashedPassword,
      phone,
      age,
      incomeRange,
      financialGoals
    });

    await newUser.save();
    res.json({ message: "Signup successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ });
  }
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 Financial Advisor API is running!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
