import { seedRooms } from "./seeders/roomSeeder.js";
import express  from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import sequelize  from "./config/database.js";
import { authRoutes } from "./routes/authRoutes.js";
import { roomRoutes } from "./routes/roomRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Hotel Management API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await sequelize.sync({ alter: true });
  await seedRooms();
});
