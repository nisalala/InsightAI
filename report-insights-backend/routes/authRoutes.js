// POST /api/auth/sync
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// router.post("/sync", async (req, res) => {
//   const { email, name } = req.body;

//   if (!email) {
//     return res.status(400).json({ error: "supabaseId and email required" });
//   }

//   try {
//     let user = await prisma.user.findUnique({ where: { id: supabaseId } });

//     if (!user) {
//       user = await prisma.user.create({
//         data: {
//           id: supabaseId,
//           email,
//           name: name || null,
//         },
//       });
//       console.log("✅ New user created in backend:", supabaseId);
//     } else {
//       console.log("⚡ User already exists in backend:", supabaseId);
//     }

//     res.json(user);
//   } catch (error) {
//     console.error("❌ Error syncing user:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

export default router;
