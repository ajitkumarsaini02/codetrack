const express = require("express");
const router = express.Router();

const platformController = require("../controllers/platform.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/", platformController.getPlatforms);
router.post("/", platformController.addPlatform);
router.delete("/:id", platformController.deletePlatform);
router.post("/sync", platformController.syncPlatforms);
router.post("/:platform/sync", platformController.syncOnePlatform);

module.exports = router;
