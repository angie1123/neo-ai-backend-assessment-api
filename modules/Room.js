import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Room = sequelize.define(
  "Room",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    room_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    room_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    price_per_night: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "available",
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn("NOW"),
    },
  },
  { timestamps: true },
);

export default Room;
