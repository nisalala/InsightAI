//user-related API endpoints
// routes/userRoutes.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();



// GET user's database config by email
router.get("/:email/database", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email } // find by email
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ databaseAPI: user.databaseAPI || null });
  } catch (err) {
    console.error("Error fetching DB config:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/auth/sync
router.post("/sync", async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Use upsert to create or update user by email
    const user = await prisma.user.upsert({
      where: { email }, // look up by email
      update: { name }, // if exists, update name
      create: { email, name }, // if not exists, create new user
    });

    console.log("✅ User synced with backend:", user.email);
    res.json(user);
  } catch (error) {
    console.error("❌ Error syncing user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/users/:email/database - Update user's database API
router.put("/:email/database", async (req, res) => {
  const { email } = req.params;
  const { databaseAPI } = req.body;

  if (!databaseAPI) {
    return res.status(400).json({ error: "databaseAPI is required" });
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { databaseAPI },
    });

    res.json({ message: "Database API updated successfully", user });
  } catch (err) {
    console.error("Error updating DB config:", err);
    
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get all users (test)
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { activities: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Create user
router.post("/", async (req, res) => {
  const { email, name } = req.body;
  try {
    const user = await prisma.user.create({
      data: { email, name },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});



export default router;
