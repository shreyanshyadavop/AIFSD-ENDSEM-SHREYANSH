const { validationResult } = require("express-validator");
const Complaint = require("../models/Complaint");

// ── @route  POST /api/complaints ──────────────────────────────────────────────
const addComplaint = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const complaint = await Complaint.create({
      ...req.body,
      user: req.user ? req.user._id : null,
    });
    res.status(201).json({ success: true, message: "Complaint registered successfully.", data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route  GET /api/complaints ───────────────────────────────────────────────
const getAllComplaints = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status)   filter.status   = status;

    const skip  = (page - 1) * limit;
    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: complaints,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route  GET /api/complaints/:id ──────────────────────────────────────────
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint)
      return res.status(404).json({ success: false, message: "Complaint not found." });
    res.json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route  PUT /api/complaints/:id ──────────────────────────────────────────
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!complaint)
      return res.status(404).json({ success: false, message: "Complaint not found." });
    res.json({ success: true, message: "Complaint updated.", data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route  DELETE /api/complaints/:id ───────────────────────────────────────
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint)
      return res.status(404).json({ success: false, message: "Complaint not found." });
    res.json({ success: true, message: "Complaint deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route  GET /api/complaints/search?location=Ghaziabad ────────────────────
const searchByLocation = async (req, res) => {
  try {
    const { location } = req.query;
    if (!location)
      return res.status(400).json({ success: false, message: "Location query parameter is required." });

    const complaints = await Complaint.find({
      location: { $regex: location, $options: "i" },
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  searchByLocation,
};
