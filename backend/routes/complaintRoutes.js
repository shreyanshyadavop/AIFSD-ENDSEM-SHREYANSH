const express = require("express");
const { body } = require("express-validator");
const {
  addComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  searchByLocation,
} = require("../controllers/complaintController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Validation rules
const complaintValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("location").notEmpty().withMessage("Location is required"),
];

// Public routes
router.get("/search", searchByLocation);            // GET /api/complaints/search?location=...
router.get("/",       getAllComplaints);             // GET /api/complaints
router.get("/:id",    getComplaintById);            // GET /api/complaints/:id

// Semi-protected (login optional for submission)
router.post("/", complaintValidation, addComplaint); // POST /api/complaints

// Protected routes (admin)
router.put("/:id",    protect, updateComplaint);    // PUT /api/complaints/:id
router.delete("/:id", protect, adminOnly, deleteComplaint); // DELETE /api/complaints/:id

module.exports = router;
