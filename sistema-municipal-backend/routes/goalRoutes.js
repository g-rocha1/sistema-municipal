const express = require("express");
const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");
const { authMiddleware, isAuthorized } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, isAuthorized(["master", "prefeito", "secretário"]), createGoal);
router.get("/", authMiddleware, isAuthorized(["master", "prefeito", "secretário"]), getGoals);
router.get("/:id", authMiddleware, isAuthorized(["master", "prefeito", "secretário"]), getGoalById);
router.put("/:id", authMiddleware, isAuthorized(["master", "prefeito", "secretário"]), updateGoal);
router.delete("/:id", authMiddleware, isAuthorized(["master", "prefeito"]), deleteGoal);

module.exports = router;