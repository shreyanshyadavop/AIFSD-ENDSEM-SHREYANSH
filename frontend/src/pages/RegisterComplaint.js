import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createComplaint, analyzeComplaint } from "../utils/api";

const CATEGORIES = [
  "Water Supply", "Electricity", "Roads & Infrastructure",
  "Sanitation & Garbage", "Public Safety", "Healthcare", "Education", "Other",
];

const initialForm = {
  name: "", email: "", title: "", description: "",
  category: "", location: "", status: "Pending",
};

const RegisterComplaint = () => {
  const [form, setForm]       = useState(initialForm);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name)        e.name        = "Name is required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.title)       e.title       = "Title is required";
    if (!form.description) e.description = "Description is required";
    if (!form.category)    e.category    = "Category is required";
    if (!form.location)    e.location    = "Location is required";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      // 1. Save complaint
      const { data: complaint } = await createComplaint(form);
      const savedId = complaint.data._id;

      // 2. Run AI analysis
      const { data: ai } = await analyzeComplaint({
        complaintId: savedId,
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
      });
      setAiResult(ai.data);
      toast.success("Complaint submitted & AI analysis complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (aiResult) {
    return (
      <div style={{ maxWidth: 680, margin: "40px auto", padding: "0 24px" }}>
        <div className="card" style={{ borderTop: "4px solid #10B981" }}>
          <h2 style={{ color: "#10B981", marginBottom: 8 }}>✅ Complaint Submitted!</h2>
          <p style={{ color: "#64748B", marginBottom: 24 }}>AI has analyzed your complaint:</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <Info label="Priority"   value={aiResult.priority}   color={priorityColor(aiResult.priority)} />
            <Info label="Department" value={aiResult.department} />
          </div>

          <div style={{ background: "#F8FAFC", borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <Label>Summary</Label>
            <p style={{ fontSize: 14, color: "#334155" }}>{aiResult.summary}</p>
          </div>

          <div style={{ background: "#EFF6FF", borderRadius: 8, padding: 16, marginBottom: 24 }}>
            <Label>Auto-Response to You</Label>
            <p style={{ fontSize: 14, color: "#1E40AF" }}>{aiResult.autoResponse}</p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-primary" onClick={() => navigate("/complaints")}>View All Complaints</button>
            <button className="btn btn-outline" onClick={() => { setAiResult(null); setForm(initialForm); }}>Submit Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: "40px auto", padding: "0 24px" }}>
      <div className="page-header">
        <h1>Register Complaint</h1>
        <p>Fill in the details below. AI will analyze your complaint automatically.</p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="grid-2">
          <Field label="Your Name" name="name"  value={form.name}  onChange={handleChange} error={errors.name}  placeholder="Rahul Kumar" />
          <Field label="Email"     name="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="rahul@gmail.com" type="email" />
        </div>

        <Field label="Complaint Title" name="title" value={form.title} onChange={handleChange} error={errors.title} placeholder="e.g. Water Leakage Issue" />

        <div className="form-group">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">-- Select Category --</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="error-msg">{errors.category}</p>}
        </div>

        <Field label="Location" name="location" value={form.location} onChange={handleChange} error={errors.location} placeholder="e.g. Ghaziabad" />

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your complaint in detail..." rows={5} />
          {errors.description && <p className="error-msg">{errors.description}</p>}
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: 14 }}>
          {loading ? "Submitting & Analyzing..." : "🚀 Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const Field = ({ label, name, value, onChange, error, placeholder, type = "text" }) => (
  <div className="form-group">
    <label>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} />
    {error && <p className="error-msg">{error}</p>}
  </div>
);

const Label = ({ children }) => (
  <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{children}</p>
);

const Info = ({ label, value, color }) => (
  <div style={{ background: "#F8FAFC", borderRadius: 8, padding: 14 }}>
    <Label>{label}</Label>
    <p style={{ fontWeight: 700, fontSize: 15, color: color || "#1E293B" }}>{value}</p>
  </div>
);

const priorityColor = (p) => ({ Low: "#10B981", Medium: "#F59E0B", High: "#EF4444", Critical: "#7C3AED" }[p] || "#1E293B");

export default RegisterComplaint;
