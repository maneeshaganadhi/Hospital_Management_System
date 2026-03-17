import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import Ct from "./Ct";

const Nav = () => {
  const navigate = useNavigate();
  const { state, updstate } = useContext(Ct);
  const user = state.token ? state : null;

  const logout = () => {
    sessionStorage.removeItem("user");
    updstate({ token: "", uid: "", name: "", role: "" }); // Explicitly clear all fields
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        🏥 Ravi Hospitals
      </Link>

      <div className="nav-links">
        {/* Home always visible */}
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/contact">Contact Us</Link>

        {/* If NOT logged in */}
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {/* If logged in */}
        {user && (
          <>
            {user.role === "doctor" && <Link to="/doctor">Dashboard</Link>}
            {user.role === "patient" && <Link to="/patient">Dashboard</Link>}
            {user.role === "receptionist" && <Link to="/receptionist">Dashboard</Link>}
            {user.role === "admin" && <Link to="/admin">Dashboard</Link>}

            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav >
  );
};

export default Nav;
