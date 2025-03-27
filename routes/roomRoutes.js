import express from "express";
import Room from "../modules/Room.js";
import { authenticateToken } from "./authRoutes.js";
import assignRoomToCustomer from "../controllers/roomController.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const rooms = await Room.findAll({ where: { status: "available" } });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/assignRoom", authenticateToken, assignRoomToCustomer);

router.put("/updateRoomDetails/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { price, room_type, status, email } = req.body;
    if (email !== req.user.email) {
      return res.status(403).json({ message: "Unauthorized: Email mismatch" });
    }
    const room = await Room.findByPk(id); //findByPk stand for find by primary key
    if (!room) return res.status(404).json({ message: "Room not found" });

    await Room.update(
      { price, status, room_type },
      { where: { id, status: "available" } },
    );
    res.status(200).json({ message: "Room details updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("deleteRoom/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const room = await Room.findByPk(id);
  if (!room) return res.status(404).json({ message: "Room not found" });
  await Room.destroy({ where: { id } });

  res.status(200).json({ message: "Room deleted successfully" });
});

export { router as roomRoutes };
