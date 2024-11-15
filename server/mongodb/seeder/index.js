import seedDatabase1 from "./seed1.js";
import seedDatabase2 from "./seed2.js";
import mongoose from "mongoose";

const runSeeder = async () => {
  if (process.env.RUN_SEEDER === "true") {
    console.log("Running seeders...");
    let a = 1;

    // Ensure that the database connection is fully established before running seeders
    if (mongoose.connection.readyState === 1) {
      await seedDatabase1();
      await seedDatabase2();
      console.log("Seeding completed successfully");
    } else {
      console;
      console.error("Database not connected. Cannot run seeders.");
    }
  }
};

export default runSeeder;
