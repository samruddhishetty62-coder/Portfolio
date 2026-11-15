require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  featured: { type: Boolean, default: false }
});
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, maxlength: 120 },
  message: { type: String, required: true, trim: true, maxlength: 1500 },
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model("Project", projectSchema);
const Message = mongoose.model("Message", messageSchema);

app.get("/api/health", (_req, res) => res.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "not connected" }));

app.get("/api/projects", async (_req, res) => {
  try {
    const projects = await Project.find().sort({ featured: -1, title: 1 }).lean();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Could not load projects." });
  }
});

app.post("/api/messages", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please enter a name, valid email, and message." });
  }
  try {
    await Message.create({ name, email, message });
    res.status(201).json({ success: true, message: "Thanks! Your message has been saved." });
  } catch (error) {
    res.status(500).json({ error: "Message could not be saved. Please try again later." });
  }
});

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      const count = await Project.countDocuments();
      if (count === 0) {
        await Project.insertMany([
          {
            title: "Food Wastage Reduction Management and Expiry Alerts",
            description: "A concept for tracking food availability and expiry dates, helping reduce avoidable food waste through timely alerts and clear item records.",
            tags: ["Project", "Food management", "Expiry alerts"],
            featured: true
          },
          {
            title: "Hostel Mess Management System",
            description: "A system concept to organize hostel mess information and make everyday mess management more convenient for students and administrators.",
            tags: ["Project", "Management system", "Student-focused"],
            featured: true
          }
        ]);
      }
      console.log("Connected to MongoDB.");
    } catch (error) {
      console.error("MongoDB connection failed:", error.message);
    }
  } else {
    console.warn("MONGODB_URI is not set. The website will run, but database features will be unavailable.");
  }

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  app.listen(PORT, () => console.log(`Portfolio running on port ${PORT}`));
}
start();
