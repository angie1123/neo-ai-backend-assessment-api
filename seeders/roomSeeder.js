import Room from "../modules/Room.js";
export const seedRooms = async () => {
  try {
    const roomTypes = [
      { type: "Single", number: 40, price: 50, capacity: 2, startNumber: 100 },
      { type: "Double", number: 30, price: 70, capacity: 3, startNumber: 200 },
      { type: "Suite", number: 20, price: 100, capacity: 4, startNumber: 300 },
      { type: "Deluxe", number: 10, price: 150, capacity: 5, startNumber: 400 },
    ];

   

    for (const { type, number, price, capacity, startNumber } of roomTypes) {
      let roomNumber = startNumber;

      for (let i = 1; i <= number; i++) {
        //check if room already existed
        const existingRoom = await Room.findOne({
          where: { room_number: ++roomNumber },
        });

        if (existingRoom) return;

        await Room.create({
          room_number: ++roomNumber, // pass to room number after +1,if roomNumber++ ,it will pass before increment ,first number will become 100 instead of 101
          room_type: type,
          price_per_night: price,
          capacity: capacity,
          status: "available",
        });
      }
    }

    console.log("Rooms seeded successfully");
  } catch (error) {
    console.error("Error seeding rooms:", error);
  }
};
