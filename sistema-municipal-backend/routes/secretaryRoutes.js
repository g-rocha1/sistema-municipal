const express = require("express");
const { getSecretaries } = require("../controllers/secretaryController");
const { authMiddleware, isAuthorized } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, isAuthorized(["master", "prefeito"]), getSecretaries);

module.exports = router;