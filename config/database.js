import Sequelize from "sequelize";

const sequelize = new Sequelize(
  process.env.DATABASE_URL || {
    dialect: "postgres",
    host: "localhost",
    port: process.env.PORT || 5432,
    database: process.env.DB_NAME || "neon ai assessment db",
    logging: false,
   
  },
);

export default sequelize;
