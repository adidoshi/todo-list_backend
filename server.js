const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const logger = require("morgan");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

// Connect DB
const connectDB = require("./config/db");
connectDB();

// Middleware
app.use(express.json());
app.use(logger("tiny"));
app.use(cors());

// Initial
app.get("/", (req, res) => {
  res.json({
    message: `Server is running`,
    title: "Welcome to todo notes maker API",
  });
});

// Routes -
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

// Error Handlers -
app.use(notFound);
app.use(errorHandler);

// Server connection
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is up on http://localhost:${PORT}`);
});
