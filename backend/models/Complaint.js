const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema(
  {
    // ── User info ──────────────────────────────────────────────────
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    // ── Complaint details ──────────────────────────────────────────
    title: {
      type: String,
      required: [true, "Complaint title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Complaint description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Water Supply",
        "Electricity",
        "Roads & Infrastructure",
        "Sanitation & Garbage",
        "Public Safety",
        "Healthcare",
        "Education",
        "Other",
      ],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    // ── AI Analysis ────────────────────────────────────────────────
    aiAnalysis: {
      priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical", null],
        default: undefined,
      },
      department:   { type: String, default: undefined },
      summary:      { type: String, default: undefined },
      autoResponse: { type: String, default: undefined },
    },
    // ── Linked user (optional) ────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", ComplaintSchema);
