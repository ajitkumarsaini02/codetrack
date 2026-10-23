const express = require("express");
const router = express.Router();

const sheetController = require("../controllers/sheet.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", sheetController.getSheets);
router.get("/:id", sheetController.getSheetById);
router.post("/track", authMiddleware, sheetController.trackSheetProblem);
router.post("/import-all", authMiddleware, sheetController.importAllSheetProblems);

module.exports = router;
