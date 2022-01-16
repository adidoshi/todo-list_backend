const express = require("express");
const {
  registerUser,
  loginUser,
  updateUserProfile,
  userDetails,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", protect, updateUserProfile);
router.get("/details", protect, userDetails);

module.exports = router;
