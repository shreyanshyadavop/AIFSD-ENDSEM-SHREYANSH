import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ─────────────────────────────────────────────────────────────────────
export const registerUser  = (data) => API.post("/auth/register", data);
export const loginUser     = (data) => API.post("/auth/login",    data);
export const fetchMe       = ()     => API.get("/auth/me");

// ── Complaints ────────────────────────────────────────────────────────────────
export const createComplaint  = (data) => API.post("/complaints",             data);
export const getComplaints    = (params) => API.get("/complaints",           { params });
export const getComplaintById = (id)   => API.get(`/complaints/${id}`);
export const updateComplaint  = (id, data) => API.put(`/complaints/${id}`,  data);
export const deleteComplaint  = (id)   => API.delete(`/complaints/${id}`);
export const searchByLocation = (location) => API.get("/complaints/search", { params: { location } });

// ── AI ────────────────────────────────────────────────────────────────────────
export const analyzeComplaint = (data) => API.post("/ai/analyze", data);

export default API;
