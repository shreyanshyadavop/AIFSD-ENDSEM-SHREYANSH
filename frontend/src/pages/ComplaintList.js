import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getComplaints, searchByLocation, deleteComplaint } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "All", "Water Supply", "Electricity", "Roads & Infrastructure",
  "Sanitation & Garbage", "Public Safety", "Healthcare", "Education", "Other",
];
const STATUSES = ["All", "Pending", "In Progress", "Resolved", "Rejected"];

const ComplaintList = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [category, setCategory]     = useState("All");
  const [status, setStatus]         = useState("All");
  const [locationQ, setLocationQ]   = useState("");
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      if (locationQ.trim()) {
        const { data } = await searchByLocation(locationQ.trim());
        setComplaints(data.data);
        setTotalPages(1);
      } else {
        const params = { page, limit: 8 };
        if (category !== "All") params.category = category;
        if (status   !== "All") params.status   = status;
        const { data } = await getComplaints(params);
        setComplaints(data.data);
        setTotalPages(data.pages);
      }
    } catch (err) {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }, [category, status, locationQ, page]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await deleteComplaint(id);
      toast.success("Deleted");
      fetchComplaints();
    } catch {
      toast.error("Delete failed – admin access required");
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>All Complaints</h1>
          <p style={{ color: "#64748B" }}>Browse, filter, and manage complaints.</p>
        </div>
        <Link to="/register-complaint" className="btn btn-primary">+ Submit Complaint</Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 24, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div className="form-group" style={{ margin: 0, flex: 1, minWidth: 160 }}>
          <label>Category</label>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ margin: 0, flex: 1, minWidth: 140 }}>
          <label>Status</label>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ margin: 0, flex: 2, minWidth: 200 }}>
          <label>Search by Location</label>
          <input
            value={locationQ}
            onChange={(e) => { setLocationQ(e.target.value); setPage(1); }}
            placeholder="e.g. Ghaziabad"
          />
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => { setCategory("All"); setStatus("All"); setLocationQ(""); setPage(1); }}>
          Reset
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="spinner" />
      ) : complaints.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48, color: "#64748B" }}>
          <p style={{ fontSize: 48 }}>📭</p>
          <p style={{ marginTop: 12 }}>No complaints found.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {complaints.map((c) => (
            <ComplaintCard key={c._id} c={c} user={user} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
          <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</button>
          <span style={{ padding: "6px 12px", fontSize: 14 }}>Page {page} of {totalPages}</span>
          <button className="btn btn-outline btn-sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
};

const ComplaintCard = ({ c, user, onDelete }) => {
  const statusClass = {
    Pending: "badge-pending",
    "In Progress": "badge-progress",
    Resolved: "badge-resolved",
    Rejected: "badge-rejected",
  }[c.status] || "badge-pending";

  return (
    <div className="card" style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
          <span className={`badge ${statusClass}`}>{c.status}</span>
          <span className="badge" style={{ background: "#F1F5F9", color: "#475569" }}>{c.category}</span>
          {c.aiAnalysis?.priority && (
            <span className={`badge badge-${c.aiAnalysis.priority.toLowerCase()}`}>{c.aiAnalysis.priority}</span>
          )}
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{c.title}</h3>
        <p style={{ fontSize: 13, color: "#64748B", marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {c.description}
        </p>
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#94A3B8" }}>
          <span>👤 {c.name}</span>
          <span>📍 {c.location}</span>
          <span>🕒 {new Date(c.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 120 }}>
        <Link to={`/complaints/${c._id}`} className="btn btn-outline btn-sm" style={{ textAlign: "center" }}>View</Link>
        {user && (
          <>
            <Link to={`/complaints/${c._id}/edit`} className="btn btn-sm" style={{ background: "#F59E0B", color: "#fff", textAlign: "center" }}>Edit</Link>
            {user.role === "admin" && (
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(c._id)}>Delete</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ComplaintList;
