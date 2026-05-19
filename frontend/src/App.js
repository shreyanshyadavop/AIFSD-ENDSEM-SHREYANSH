import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar            from "./components/Navbar";
import Home              from "./pages/Home";
import Login             from "./pages/Login";
import Signup            from "./pages/Signup";
import RegisterComplaint from "./pages/RegisterComplaint";
import ComplaintList     from "./pages/ComplaintList";
import ComplaintDetail   from "./pages/ComplaintDetail";
import EditComplaint     from "./pages/EditComplaint";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Navbar />
        <main>
          <Routes>
            <Route path="/"                         element={<Home />} />
            <Route path="/login"                    element={<Login />} />
            <Route path="/signup"                   element={<Signup />} />
            <Route path="/register-complaint"       element={<RegisterComplaint />} />
            <Route path="/complaints"               element={<ComplaintList />} />
            <Route path="/complaints/:id"           element={<ComplaintDetail />} />
            <Route path="/complaints/:id/edit"      element={<EditComplaint />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
