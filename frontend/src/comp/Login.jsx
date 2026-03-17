import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Ct from "./Ct";

const Login = () => {

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { updstate } = useContext(Ct);

  const fun = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleLogin = async () => {
    if (!data.email || !data.password) {
      setMsg("Please fill all fields");
      return;
    }

    try {
      let res = await axios.post("/api/login", { ...data, email: data.email.toLowerCase() });

      if (res.data.token) {
        console.log(res.data);

        // Create a flat user object
        const userInfo = {
          token: res.data.token,
          uid: res.data.user.id,
          name: res.data.user.name,
          role: res.data.user.role,
        };

        // Save to sessionStorage (Temporary Session)
        sessionStorage.setItem("user", JSON.stringify(userInfo));

        // Update global state
        updstate(userInfo);

        // Redirect based on role
        if (userInfo.role === "admin") {
          navigate("/admin");
        } else if (userInfo.role === "doctor") {
          navigate("/doctor");
        } else if (userInfo.role === "patient") {
          navigate("/patient");
        } else if (userInfo.role === "receptionist") {
          navigate("/receptionist");
        }
      } else {
        setMsg(res.data.msg);
      }
    } catch (err) {
      console.error("Login error:", err);
      setMsg(err.response?.data?.msg || "Login Failed");
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Login Portal</h2>

        {msg && <p style={{ color: "red", textAlign: "center" }}>{msg}</p>}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            onChange={fun}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Enter your password"
            onChange={fun}
          />
        </div>



        <button onClick={handleLogin} className="submit-btn">Login</button>

        <div className="form-footer">
          <Link to="/resetpassword" style={{ display: "block", marginBottom: "10px", color: "var(--primary)", textDecoration: "none" }}>Forgot Password?</Link>
          Don't have an account? <span onClick={() => navigate("/register")} style={{ color: "var(--primary)", cursor: "pointer", fontWeight: "600" }}>Register here</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
