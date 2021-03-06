const express = require("express");
const {
  getNotes,
  createNote,
  getSingleNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", protect, getNotes);
router.post("/create", protect, createNote);
router.get("/:id", getSingleNote);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

module.exports = router;
