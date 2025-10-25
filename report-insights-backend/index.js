import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import userRoutes from "./routes/userRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// test database connection
app.get("/testdb", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});


app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
