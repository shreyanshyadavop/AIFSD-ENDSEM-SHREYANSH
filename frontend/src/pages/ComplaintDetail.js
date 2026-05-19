import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getComplaintById, analyzeComplaint } from "../utils/api";

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    getComplaintById(id)
      .then(({ data }) => setComplaint(data.data))
      .catch(() => toast.error("Complaint not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const runAI = async () => {
    setAnalyzing(true);
    try {
      const { data } = await analyzeComplaint({
        complaintId: complaint._id,
        title:       complaint.title,
        description: complaint.description,
        category:    complaint.category,
        location:    complaint.location,
      });
      setComplaint({ ...complaint, aiAnalysis: data.data });
      toast.success("AI analysis complete!");
    } catch {
      toast.error("AI analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!complaint) return <p style={{ textAlign: "center", marginTop: 48 }}>Complaint not found.</p>;

  const ai = complaint.aiAnalysis;
  const statusClass = {
    Pending: "badge-pending",
    "In Progress": "badge-progress",
    Resolved: "badge-resolved",
    Rejected: "badge-rejected",
  }[complaint.status] || "badge-pending";

  return (
    <div style={{ maxWidth: 760, margin: "40px auto", padding: "0 24px" }}>
      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#2563EB", fontSize: 14, marginBottom: 20, cursor: "pointer" }}>
        ← Back
      </button>

      {/* Main card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className={`badge ${statusClass}`}>{complaint.status}</span>
            <span className="badge" style={{ background: "#F1F5F9", color: "#475569" }}>{complaint.category}</span>
          </div>
          <Link to={`/complaints/${id}/edit`} className="btn btn-outline btn-sm">Edit Status</Link>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{complaint.title}</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          <InfoBox label="Name"     value={complaint.name} />
          <InfoBox label="Location" value={complaint.location} />
          <InfoBox label="Date"     value={new Date(complaint.createdAt).toLocaleDateString()} />
        </div>

        <div style={{ background: "#F8FAFC", borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <Label>Description</Label>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#334155" }}>{complaint.description}</p>
        </div>

        <p style={{ fontSize: 12, color: "#94A3B8" }}>Contact: {complaint.email}</p>
      </div>

      {/* AI Analysis */}
      <div className="card" style={{ borderTop: "4px solid #2563EB" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>🤖 AI Analysis</h2>
          <button className="btn btn-primary btn-sm" onClick={runAI} disabled={analyzing}>
            {analyzing ? "Analyzing..." : ai?.priority ? "Re-Analyze" : "Run AI Analysis"}
          </button>
        </div>

        {ai?.priority ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <InfoBox label="Priority"   value={ai.priority}   color={priorityColor(ai.priority)} />
              <InfoBox label="Department" value={ai.department} />
            </div>
            <div style={{ background: "#F8FAFC", borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <Label>Summary</Label>
              <p style={{ fontSize: 14, color: "#334155" }}>{ai.summary}</p>
            </div>
            <div style={{ background: "#EFF6FF", borderRadius: 8, padding: 16 }}>
              <Label>Auto Response</Label>
              <p style={{ fontSize: 14, color: "#1E40AF" }}>{ai.autoResponse}</p>
            </div>
          </>
        ) : (
          <p style={{ color: "#94A3B8", textAlign: "center", padding: "20px 0" }}>
            No AI analysis yet. Click "Run AI Analysis" to get insights.
          </p>
        )}
      </div>
    </div>
  );
};

const InfoBox = ({ label, value, color }) => (
  <div style={{ background: "#F8FAFC", borderRadius: 8, padding: 12 }}>
    <Label>{label}</Label>
    <p style={{ fontWeight: 600, fontSize: 14, color: color || "#1E293B" }}>{value}</p>
  </div>
);

const Label = ({ children }) => (
  <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{children}</p>
);

const priorityColor = (p) => ({ Low: "#10B981", Medium: "#D97706", High: "#EF4444", Critical: "#7C3AED" }[p] || "#1E293B");

export default ComplaintDetail;
