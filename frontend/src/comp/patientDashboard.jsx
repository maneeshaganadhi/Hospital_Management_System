import { useEffect, useState, useContext } from "react";
import axios from "axios"
import Ct from "../comp/Ct";

const PatientDashboard = () => {
  const { state } = useContext(Ct);
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    doctorId: "",
    date: "",
    time: ""
  });
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    if (state.uid) {
      if (activeTab === "appointments") {
        fetchAppointments();
      } else if (activeTab === "book") {
        fetchDoctors();
      } else if (activeTab === "prescriptions") {
        fetchPrescriptions();
      } else if (activeTab === "profile") {
        fetchProfile();
      }
    }
  }, [state.uid, activeTab]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`/api/getpatientbyuserid/${state.uid}`);
      setProfileData(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      // If 404, we might want to start with empty data but pre-fill name from state
      if (error.response && error.response.status === 404) {
        setProfileData({ ...profileData, name: state.name });
      }
    }
  };

  const handleProfileUpdate = async () => {
    try {
      if (profileData._id) {
        // Update existing profile
        await axios.put(`/api/updatepatientbyid/${profileData._id}`, profileData);
        alert("Profile updated successfully");
      } else {
        // Create new profile
        const newProfile = { ...profileData, userId: state.uid };
        // If email is missing in profileData, try to add it from state if available, or keep as is
        if (!newProfile.email && state.email) newProfile.email = state.email;

        await axios.post("/api/addpatient", newProfile);
        alert("Profile created successfully");
      }
      setIsEditingProfile(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const fetchPrescriptions = async () => {
    try {
      console.log("Fetching prescriptions for Patient User ID:", state.uid);
      const res = await axios.get(`/api/getprescriptionsbypatientid/${state.uid}`);
      console.log("Prescriptions found:", res.data);
      setPrescriptions(res.data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("/api/getappointments");
      const myAppointments = res.data.filter(app => app.patientId === state.uid || app.patientName === state.name);
      setAppointments(myAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("/api/getdoctors");
      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleBookAppointment = async () => {
    if (!newAppointment.doctorId || !newAppointment.date || !newAppointment.time) {
      alert("Please fill all fields");
      return;
    }

    const doctor = doctors.find(d => d._id === newAppointment.doctorId || d.userId === newAppointment.doctorId); // Handle both ID types if mixed

    // Fallback if doctor object structure varies
    const doctorName = doctor ? doctor.name : "Unknown Doctor";
    const doctorIdToSave = doctor ? (doctor.userId || doctor._id) : newAppointment.doctorId;

    const appointmentData = {
      patientId: state.uid,
      patientName: state.name,
      doctorId: doctorIdToSave,
      doctorName: doctorName,
      date: newAppointment.date,
      time: newAppointment.time,
      status: "pending"
    };


    try {
      setLoading(true);
      await axios.post("/api/addappointment", appointmentData);
      alert("Appointment booked successfully");
      setActiveTab("appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert(error.response?.data?.msg || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="dashboard-title">
            <h3>{state.name}</h3>
          </div>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`sidebar-btn ${activeTab === "appointments" ? "active" : ""}`}
          >
            📅 My Appointments
          </button>
          <button
            onClick={() => setActiveTab("book")}
            className={`sidebar-btn ${activeTab === "book" ? "active" : ""}`}
          >
            ➕ Book Appointment
          </button>
          <button
            onClick={() => setActiveTab("prescriptions")}
            className={`sidebar-btn ${activeTab === "prescriptions" ? "active" : ""}`}
          >
            💊 Medical History
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`sidebar-btn ${activeTab === "profile" ? "active" : ""}`}
          >
            👤 My Profile
          </button>
        </div>

        {/* Content Area */}
        <div className="dashboard-content">
          {activeTab === "appointments" && (
            <>
              <div className="dashboard-title">
                <h2>My Appointments</h2>
              </div>
              {appointments.length === 0 ? (
                <p>No appointments found.</p>
              ) : (
                <div className="appointments-grid">
                  {appointments.map((app) => (
                    <div key={app._id} className="appointment-card">
                      <div className="app-header">
                        <div className="patient-info">
                          <h4>{app.doctorName || "Unknown Doctor"}</h4>
                        </div>
                        <span className="app-date">{app.date}</span>
                      </div>
                      <div style={{ margin: "10px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Time: {app.time}</span>
                        <span className={`badge ${app.status === 'confirmed' ? 'badge-success' : app.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                          {app.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "book" && (
            <>
              <div className="dashboard-title">
                <h2>Book Appointment</h2>
              </div>
              <div className="form-box" style={{ maxWidth: "600px", margin: "0", boxShadow: "none", padding: "0" }}>
                <div className="form-group">
                  <label>Select Doctor</label>
                  <select
                    value={newAppointment.doctorId}
                    onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(d => (
                      <option key={d._id} value={d.userId || d._id}>
                        {d.name} - {d.specialization}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="dashboard-grid" style={{ minHeight: "auto", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    />
                  </div>
                </div>
                <button onClick={handleBookAppointment} disabled={loading} className="submit-btn" style={{ width: "fit-content", padding: "12px 30px", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Booking..." : "Book Appointment"}
                </button>
              </div>
            </>
          )}

          {activeTab === "prescriptions" && (
            <>
              <div className="dashboard-title">
                <h2>Medical History</h2>
              </div>
              {prescriptions.length === 0 ? (
                <p>No prescriptions found.</p>
              ) : (
                <div className="appointments-grid">
                  {prescriptions.map((p) => (
                    <div key={p._id} className="appointment-card" style={{ borderLeft: "4px solid var(--secondary)" }}>
                      <div className="app-header">
                        <div className="patient-info">
                          <h4>Dr. {p.doctorName || p.doctorId}</h4>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Prescription</span>
                        </div>
                      </div>
                      <div style={{ marginBottom: "10px" }}>
                        <strong style={{ color: "var(--text-main)" }}>Diagnosis: </strong>
                        <span style={{ color: "var(--text-muted)" }}>{p.diagnosis}</span>
                      </div>
                      <div style={{ marginBottom: "10px" }}>
                        <strong style={{ color: "var(--text-main)" }}>Medicine: </strong>
                        <span style={{ color: "var(--text-muted)" }}>{p.medicine}</span>
                      </div>
                      {p.notes && (
                        <div style={{ marginTop: "10px", padding: "10px", background: "#f8fafc", borderRadius: "6px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                          <em>"{p.notes}"</em>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "profile" && (
            <>
              <div className="dashboard-title">
                <h2>My Profile</h2>
                <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="submit-btn" style={{ width: "auto" }}>
                  {isEditingProfile ? "Cancel Edit" : "Edit Profile"}
                </button>
              </div>
              <div className="form-box" style={{ maxWidth: "100%", margin: "0", boxShadow: "none", padding: "0" }}>

                {/* READ ONLY VIEW */}
                {!isEditingProfile && (
                  <div className="dashboard-grid" style={{ minHeight: "auto", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div><strong>Name:</strong> <p style={{ marginTop: "5px", color: "var(--text-muted)" }}>{profileData.name || "N/A"}</p></div>
                    <div><strong>Email:</strong> <p style={{ marginTop: "5px", color: "var(--text-muted)" }}>{profileData.email || "N/A"}</p></div>
                    <div><strong>Phone:</strong> <p style={{ marginTop: "5px", color: "var(--text-muted)" }}>{profileData.phone || "N/A"}</p></div>
                    <div><strong>Age:</strong> <p style={{ marginTop: "5px", color: "var(--text-muted)" }}>{profileData.age || "N/A"}</p></div>
                    <div><strong>Gender:</strong> <p style={{ marginTop: "5px", color: "var(--text-muted)" }}>{profileData.gender || "N/A"}</p></div>
                    <div><strong>Blood Group:</strong> <p style={{ marginTop: "5px", color: "var(--text-muted)" }}>{profileData.bloodgroup || "N/A"}</p></div>
                    <div style={{ gridColumn: "span 2" }}><strong>Address:</strong> <p style={{ marginTop: "5px", color: "var(--text-muted)" }}>{profileData.address || "N/A"}</p></div>
                  </div>
                )}

                {/* EDIT FORM VIEW */}
                {isEditingProfile && (
                  <>
                    <div className="dashboard-grid" style={{ minHeight: "auto", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      <div className="form-group">
                        <label>Name</label>
                        <input className="form-input" value={profileData.name || ""} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input className="form-input" value={profileData.email || ""} disabled style={{ backgroundColor: "#f1f5f9" }} />
                      </div>
                      <div className="form-group">
                        <label>Phone</label>
                        <input className="form-input" value={profileData.phone || ""} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Age</label>
                        <input className="form-input" type="number" value={profileData.age || ""} onChange={(e) => setProfileData({ ...profileData, age: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Gender</label>
                        <select className="form-input" value={profileData.gender || ""} onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })} >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Blood Group</label>
                        <input className="form-input" value={profileData.bloodgroup || ""} onChange={(e) => setProfileData({ ...profileData, bloodgroup: e.target.value })} />
                      </div>
                      <div className="form-group" style={{ gridColumn: "span 2" }}>
                        <label>Address</label>
                        <input className="form-input" value={profileData.address || ""} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} />
                      </div>
                    </div>
                    <button onClick={handleProfileUpdate} className="submit-btn" style={{ marginTop: "20px", width: "fit-content", padding: "12px 30px" }}>
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
