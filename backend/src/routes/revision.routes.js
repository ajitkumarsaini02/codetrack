const express = require("express");
const router = express.Router();

const revisionController = require("../controllers/revision.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/", revisionController.getRevisions);
router.post("/", revisionController.createRevision);
router.patch("/:id", revisionController.updateRevision);
router.delete("/:id", revisionController.deleteRevision);

module.exports = router;
