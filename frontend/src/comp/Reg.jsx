import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reg = () => {

  let [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "patient"
  });

  let [msg, setMsg] = useState("");
  let navigate = useNavigate();

  let fun = (e) => {
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  let reg = async () => {

    if (!data.name || !data.email || !data.phone || !data.password) {
      setMsg("Please fill all fields");
      return;
    }

    try {
      let res = await axios.post(
        "/api/register",
        data
      );

      if (res.data.msg === "User added successfully") {
        navigate("/login");
      } else {
        setMsg(res.data.msg);
      }

    } catch (err) {
      console.error("Registration error:", err);
      setMsg(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div id="registration-page" className="form-container register-container">
      <div className="form-box">
        <h2>Create Account</h2>

        {msg && <p style={{ color: "red", textAlign: "center" }}>{msg}</p>}

        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" className="form-input" placeholder="Enter Name" onChange={fun} />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" className="form-input" placeholder="Enter Email" onChange={fun} />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone" className="form-input" placeholder="Enter Phone" onChange={fun} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" className="form-input" placeholder="Enter Password" onChange={fun} />
          </div>
        </div>

        <button onClick={reg} className="submit-btn">Register</button>

        <div className="form-footer">
          Already have an account? <span onClick={() => navigate("/login")} style={{ color: "var(--primary)", cursor: "pointer", fontWeight: "600" }}>Login here</span>
        </div>
      </div>
    </div>
  );
};

export default Reg;
