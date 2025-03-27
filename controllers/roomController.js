import Room from "../modules/Room.js";
import { User } from "../modules/User.js";

const assignRoomToCustomer = async (req, res) => {
  try {
    const { email, roomType, duration } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    //find available room based on request type
    const availableRooms = await Room.findAll({
      where: {
        room_type: roomType,
        status: "available",
      },
    });

    //if no room available,return status 400
    if (availableRooms.length === 0) {
      return res
        .status(400)
        .json({ message: `No available rooms for type ${roomType}` });
    }

    //otherwise randomly assign room to customer
    //availableRoom is an array contain all available room
    //use .length to select random index
    const randomIndex =
      availableRooms[Math.floor(Math.random() * availableRooms.length)];
    const assignedRoom = availableRooms[randomIndex];

    await assignedRoom.update({
      status: "booked",
      duration: duration,
    });
    const { room_number, room_type, status } = assignedRoom;
    const { name, phoneNumber } = user;
    //mark room as booked

    return res.status(200).json({
      message: "Room assigned successfully",
      userDetails: {
        name,
        email,
        phoneNumber,
      },
      roomDetails: {
        room_number,
        room_type,
        status,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "failed to assign room" });
  }
};

export default assignRoomToCustomer;
