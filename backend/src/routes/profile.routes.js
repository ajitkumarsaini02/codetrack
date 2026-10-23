const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profile.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/", profileController.getProfile);
router.patch("/", profileController.updateProfile);
router.put("/", profileController.updateProfile);

module.exports = router;
