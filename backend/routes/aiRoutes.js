const express = require("express");
const { analyzeComplaint, analyzeAndSave } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/analyze",           analyzeComplaint);          // POST /api/ai/analyze
router.post("/analyze/:id", protect, analyzeAndSave);        // POST /api/ai/analyze/:id

module.exports = router;
