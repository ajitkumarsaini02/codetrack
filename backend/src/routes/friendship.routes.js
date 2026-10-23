const express = require("express");
const router = express.Router();

const friendshipController = require("../controllers/friendship.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/", friendshipController.getFriends);
router.post("/request", friendshipController.sendRequest);
router.patch("/:id/respond", friendshipController.respondToRequest);

module.exports = router;
