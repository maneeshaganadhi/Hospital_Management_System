import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Ct from "./Ct";

const EditProfile = () => {
    const { state, updstate } = useContext(Ct);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (!state.uid) {
            navigate("/login");
        } else {
            fetchProfile();
        }
    }, [state.uid]);

    const fetchProfile = async () => {
        try {
            // Determine endpoint based on role
            let endpoint = "";
            let data = {};

            if (state.role === "doctor") {
                const res = await axios.get("/api/getdoctors");
                data = res.data.find(d => d.userId === state.uid || d.email === state.name);
            } else if (state.role === "patient") {
                const res = await axios.get("/api/getpatients");
                data = res.data.find(p => p.userId === state.uid || p.email === state.name); // Fallback
            }

            if (data) {
                setFormData(data);
            } else {
                setMsg("Profile not found.");
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching profile", error);
            setMsg("Error loading profile.");
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (state.role === "doctor") {
                await axios.put(`/api/updatedoctorbyid/${formData._id}`, formData);
            } else if (state.role === "patient") {
                await axios.put(`/api/updatepatientbyid/${formData._id}`, formData);
            } else {
                setMsg("Cannot update this role.");
                return;
            }
            setMsg("Profile updated successfully!");

            // Redirect back to dashboard after 1.5s
            setTimeout(() => {
                if (state.role === "doctor") navigate("/doctor");
                else if (state.role === "patient") navigate("/patient");
            }, 1000);

        } catch (error) {
            console.error("Update error", error);
            setMsg("Failed to update profile.");
        }
    };

    if (loading) return <div className="dashboard-container">Loading...</div>;

    return (
        <div className="reset-container">
            <div className="reset-box" style={{ maxWidth: "600px" }}>
                <h2>Edit Profile</h2>
                {msg && <div className={`alert ${msg.includes("success") ? "success" : "error"}`}>{msg}</div>}

                <form onSubmit={handleSubmit} className="dashboard-grid" style={{ minHeight: "auto", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

                    {/* Common Fields */}
                    <div className="form-group">
                        <label>Name</label>
                        <input className="form-input" name="name" value={formData.name || ""} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input className="form-input" name="email" value={formData.email || ""} disabled style={{ backgroundColor: "#f1f5f9" }} />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input className="form-input" name="phone" value={formData.phone || ""} onChange={handleChange} />
                    </div>

                    {/* Doctor Specific */}
                    {state.role === "doctor" && (
                        <>
                            <div className="form-group">
                                <label>Experience (Years)</label>
                                <input className="form-input" type="number" name="experience" value={formData.experience || ""} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Specialization</label>
                                <input className="form-input" name="specialization" value={formData.specialization || ""} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Consultation Fee</label>
                                <input className="form-input" type="number" name="consultationfee" value={formData.consultationfee || ""} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Profile Image URL</label>
                                <input className="form-input" name="image" value={formData.image || ""} onChange={handleChange} placeholder="https://..." />
                            </div>
                        </>
                    )}

                    {/* Patient Specific */}
                    {state.role === "patient" && (
                        <>
                            <div className="form-group">
                                <label>Age</label>
                                <input className="form-input" type="number" name="age" value={formData.age || ""} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select className="form-input" name="gender" value={formData.gender || ""} onChange={handleChange}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ gridColumn: "span 2" }}>
                                <label>Address</label>
                                <input className="form-input" name="address" value={formData.address || ""} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Blood Group</label>
                                <input className="form-input" name="bloodgroup" value={formData.bloodgroup || ""} onChange={handleChange} />
                            </div>
                        </>
                    )}

                    <div style={{ gridColumn: "span 2", marginTop: "20px", display: "flex", gap: "15px" }}>
                        <button type="submit" className="submit-btn">Save Changes</button>
                        <button type="button" className="action-btn" onClick={() => navigate(-1)}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
