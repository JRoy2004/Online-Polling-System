import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import authRoutes from "./routes/auth/auth.js"; // Import your authentication routes
import pollRoutes from "./routes/polls/polls.js"; // Import your poll routes
import userRoutes from "./routes/user/UsernameToUserId.js";
import SuserRoutes from "./routes/user/user.js";
import { protect } from "./middleware/auth.js"; // Import middleware for protection

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/polls", protect, pollRoutes);
app.use("/api/user", userRoutes);
app.use("/api/users", SuserRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.get("/", async (req, res) => {
  res.send("Hello from D-poll API");
});
const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () =>
      console.log(`Server has started on port http://localhost:${PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
