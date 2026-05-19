import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getComplaintById, updateComplaint } from "../utils/api";

const STATUSES = ["Pending", "In Progress", "Resolved", "Rejected"];

const EditComplaint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus]       = useState("Pending");
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    getComplaintById(id)
      .then(({ data }) => { setComplaint(data.data); setStatus(data.data.status); })
      .catch(() => toast.error("Complaint not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateComplaint(id, { status });
      toast.success("Status updated!");
      navigate(`/complaints/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!complaint) return <p style={{ textAlign: "center", marginTop: 48 }}>Complaint not found.</p>;

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: "0 24px" }}>
      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#2563EB", fontSize: 14, marginBottom: 20, cursor: "pointer" }}>
        ← Back
      </button>

      <div className="page-header">
        <h1>Update Complaint</h1>
        <p>Change the status of this complaint.</p>
      </div>

      <div className="card">
        <div style={{ background: "#F8FAFC", borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: 4 }}>Complaint</p>
          <p style={{ fontWeight: 700 }}>{complaint.title}</p>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>{complaint.category} • {complaint.location}</p>
        </div>

        <div className="form-group">
          <label>Update Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Status colour preview */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                border: status === s ? "2px solid #2563EB" : "2px solid transparent",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                ...statusStyle(s),
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1, justifyContent: "center" }}>
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
          <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ flex: 1, justifyContent: "center" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const statusStyle = (s) => ({
  Pending:      { background: "#FEF3C7", color: "#92400E" },
  "In Progress":{ background: "#DBEAFE", color: "#1E40AF" },
  Resolved:     { background: "#D1FAE5", color: "#065F46" },
  Rejected:     { background: "#FEE2E2", color: "#991B1B" },
}[s] || {});

export default EditComplaint;
