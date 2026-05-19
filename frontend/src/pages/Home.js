import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
    {/* Hero */}
    <div style={styles.hero}>
      <div style={styles.badge}>🤖 AI-Powered Platform</div>
      <h1 style={styles.title}>Smart Complaint<br />Management System</h1>
      <p style={styles.subtitle}>
        Register your civic complaints online. Our AI instantly classifies priority,
        recommends the right department, and keeps you updated — all in one place.
      </p>
      <div style={styles.btnGroup}>
        <Link to="/register-complaint" style={styles.primaryBtn}>Register Complaint →</Link>
        <Link to="/complaints"         style={styles.outlineBtn}>View All Complaints</Link>
      </div>
    </div>

    {/* Stats */}
    <div style={styles.statsRow}>
      {[
        { label: "Complaints Resolved", value: "1,200+", icon: "✅" },
        { label: "Avg. Response Time",  value: "< 2 hrs", icon: "⚡" },
        { label: "Departments Covered", value: "8+",      icon: "🏛️" },
        { label: "AI Accuracy",         value: "97%",     icon: "🤖" },
      ].map((s) => (
        <div key={s.label} style={styles.statCard}>
          <div style={styles.statIcon}>{s.icon}</div>
          <div style={styles.statVal}>{s.value}</div>
          <div style={styles.statLabel}>{s.label}</div>
        </div>
      ))}
    </div>

    {/* Features */}
    <h2 style={{ textAlign: "center", marginBottom: 32, fontSize: 22, fontWeight: 700 }}>Key Features</h2>
    <div style={styles.featGrid}>
      {[
        { icon: "📝", title: "Easy Registration",   desc: "Submit complaints with category, location, and description in minutes." },
        { icon: "🤖", title: "AI Analysis",         desc: "Automatic priority detection, department recommendation, and summary." },
        { icon: "🔍", title: "Complaint Tracking",  desc: "Track status in real time. Filter, search, and manage all complaints." },
        { icon: "🔐", title: "Secure Auth",         desc: "JWT-based authentication with bcrypt-hashed passwords for safety." },
        { icon: "📊", title: "Status Updates",      desc: "Admins can update complaint status from Pending to Resolved." },
        { icon: "📍", title: "Location Search",     desc: "Find all complaints registered from a specific city or area." },
      ].map((f) => (
        <div key={f.title} style={styles.featCard}>
          <div style={styles.featIcon}>{f.icon}</div>
          <h3 style={styles.featTitle}>{f.title}</h3>
          <p style={styles.featDesc}>{f.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const styles = {
  hero: {
    textAlign: "center",
    padding: "48px 0 60px",
  },
  badge: {
    display: "inline-block",
    background: "#DBEAFE",
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 52,
    fontWeight: 800,
    lineHeight: 1.1,
    color: "#1E293B",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#64748B",
    maxWidth: 560,
    margin: "0 auto 32px",
    lineHeight: 1.6,
  },
  btnGroup: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" },
  primaryBtn: {
    background: "#2563EB",
    color: "#fff",
    padding: "14px 32px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 15,
  },
  outlineBtn: {
    background: "transparent",
    border: "2px solid #2563EB",
    color: "#2563EB",
    padding: "12px 32px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 15,
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 20,
    marginBottom: 64,
  },
  statCard: {
    background: "#fff",
    borderRadius: 12,
    padding: "24px 16px",
    textAlign: "center",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    border: "1px solid #E2E8F0",
  },
  statIcon:  { fontSize: 28, marginBottom: 8 },
  statVal:   { fontSize: 28, fontWeight: 800, color: "#2563EB" },
  statLabel: { fontSize: 13, color: "#64748B", marginTop: 4 },
  featGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 20,
    marginBottom: 48,
  },
  featCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    border: "1px solid #E2E8F0",
  },
  featIcon:  { fontSize: 32, marginBottom: 12 },
  featTitle: { fontWeight: 700, fontSize: 15, marginBottom: 8 },
  featDesc:  { fontSize: 13, color: "#64748B", lineHeight: 1.6 },
};

export default Home;
