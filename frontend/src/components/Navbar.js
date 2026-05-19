import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.brand}>
          <span style={styles.brandIcon}>⚡</span>
          <span>SmartComplaint</span>
        </Link>

        <div style={styles.links}>
          <Link to="/"           style={{ ...styles.link, ...(isActive("/")           ? styles.activeLink : {}) }}>Home</Link>
          <Link to="/complaints" style={{ ...styles.link, ...(isActive("/complaints") ? styles.activeLink : {}) }}>Complaints</Link>
          <Link to="/register-complaint" style={{ ...styles.link, ...(isActive("/register-complaint") ? styles.activeLink : {}) }}>Submit</Link>
          {user ? (
            <>
              <span style={styles.userName}>👤 {user.name}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    style={styles.link}>Login</Link>
              <Link to="/signup"   style={styles.signupBtn}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: "#fff",
    borderBottom: "1px solid #E2E8F0",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 24px",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 700,
    fontSize: 18,
    color: "#2563EB",
  },
  brandIcon: { fontSize: 22 },
  links: { display: "flex", alignItems: "center", gap: 20 },
  link: { fontSize: 14, fontWeight: 500, color: "#64748B", transition: "color 0.2s" },
  activeLink: { color: "#2563EB", fontWeight: 600 },
  userName: { fontSize: 13, color: "#64748B" },
  logoutBtn: {
    background: "#EF4444",
    color: "#fff",
    border: "none",
    padding: "7px 16px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  signupBtn: {
    background: "#2563EB",
    color: "#fff",
    padding: "7px 16px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
  },
};

export default Navbar;
