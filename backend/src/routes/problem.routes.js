const express = require("express");
const router = express.Router();

const problemController = require("../controllers/problem.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/", problemController.getProblems);
router.post("/", problemController.createProblem);
router.get("/:id", problemController.getProblemById);
router.put("/:id", problemController.updateProblem);
router.delete("/:id", problemController.deleteProblem);

module.exports = router;
