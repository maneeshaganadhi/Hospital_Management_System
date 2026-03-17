import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [receptionists, setReceptionists] = useState([]); // Mocking receptionists for now if no endpoint exists
  const [bills, setBills] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "", email: "", phone: "", password: "", specialization: "", role: "doctor", image: "", experience: "", consultationfee: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [showAddReceptionist, setShowAddReceptionist] = useState(false);
  const [newReceptionist, setNewReceptionist] = useState({
    name: "", email: "", phone: "", password: "", role: "receptionist", address: ""
  });

  const [showReceptionistModal, setShowReceptionistModal] = useState(false);
  const [selectedReceptionist, setSelectedReceptionist] = useState(null);

  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
    fetchAppointments();
    fetchBills();
    fetchFeedbacks();
    fetchReceptionists();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("/api/getdoctors");
      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get("/api/getpatients");
      setPatients(res.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("/api/getappointments");
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchBills = async () => {
    try {
      const res = await axios.get("/api/getbills");
      setBills(res.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("/api/getfeedbacks");
      setFeedbacks(res.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const fetchReceptionists = async () => {
    try {
      const res = await axios.get("/api/getreceptionists");
      setReceptionists(res.data);
    } catch (error) {
      console.error("Error fetching receptionists:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewDoctor({ ...newDoctor, [e.target.name]: e.target.value });
  };

  const handleReceptionistInputChange = (e) => {
    setNewReceptionist({ ...newReceptionist, [e.target.name]: e.target.value });
  };

  const handleDoctorSubmit = async () => {
    try {
      if (isEditing) {
        // Create a copy and remove immutable fields
        const { _id, userId, role, ...updateData } = newDoctor;
        await axios.put(`/api/updatedoctorbyid/${editId}`, updateData);
        alert("Doctor updated successfully");
      } else {
        await axios.post("/api/adddoctor", newDoctor);
        alert("Doctor added successfully");
      }
      setShowAddDoctor(false);
      setIsEditing(false);
      setEditId(null);
      fetchDoctors();
      setNewDoctor({ name: "", email: "", phone: "", password: "", specialization: "", role: "doctor", image: "", experience: "", consultationfee: "" });
    } catch (error) {
      console.error("Error saving doctor:", error);
      alert("Failed to save doctor");
    }
  };

  const handleEditDoctor = (doctor) => {
    setNewDoctor(doctor);
    setIsEditing(true);
    setEditId(doctor._id);
    setShowAddDoctor(true);
  };

  const deleteDoctor = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await axios.delete(`/api/deletedoctorbyid/${id}`);
        fetchDoctors();
      } catch (error) {
        console.error("Error deleting doctor:", error);
      }
    }
  };

  const deletePatient = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await axios.delete(`/api/deletepatientbyid/${id}`);
        fetchPatients();
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  const deleteFeedback = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await axios.delete(`/api/deletefeedbackbyid/${id}`);
        fetchFeedbacks();
      } catch (error) {
        console.error("Error deleting feedback:", error);
      }
    }
  };

  const [isEditingReceptionist, setIsEditingReceptionist] = useState(false);
  const [editReceptionistId, setEditReceptionistId] = useState(null);

  const handleReceptionistSubmit = async () => {
    try {
      if (isEditingReceptionist) {
        const { _id, userId, role, ...updateData } = newReceptionist;
        await axios.put(`/api/updateuserbyid/${editReceptionistId}`, updateData);
        alert("Receptionist updated successfully");
      } else {
        await axios.post("/api/register", newReceptionist);
        alert("Receptionist added successfully");
      }
      setShowAddReceptionist(false);
      setIsEditingReceptionist(false);
      setEditReceptionistId(null);
      fetchReceptionists();
      setNewReceptionist({ name: "", email: "", phone: "", password: "", role: "receptionist", address: "" });
    } catch (error) {
      console.error("Error saving receptionist:", error);
      alert("Failed to save receptionist");
    }
  };

  const handleEditReceptionist = (receptionist) => {
    setNewReceptionist(receptionist);
    setIsEditingReceptionist(true);
    setEditReceptionistId(receptionist.userId);
    setShowAddReceptionist(true);
  };

  const deleteReceptionist = async (id) => {
    if (window.confirm("Are you sure you want to delete this receptionist?")) {
      try {
        await axios.delete(`/api/deletereceptionistbyid/${id}`);
        fetchReceptionists();
      } catch (error) {
        console.error("Error deleting receptionist:", error);
      }
    }
  };


  // Derived Statistics
  const totalRevenue = bills.reduce((acc, curr) => acc + (curr.status === "Paid" ? Number(curr.amount) : 0), 0);
  const pendingRevenue = bills.reduce((acc, curr) => acc + (curr.status === "Pending" ? Number(curr.amount) : 0), 0);

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="dashboard-title">
            <h3>Admin</h3>
          </div>
          <button onClick={() => setActiveTab("dashboard")} className={`sidebar-btn ${activeTab === "dashboard" ? "active" : ""}`}>
            📊 Dashboard
          </button>
          <button onClick={() => setActiveTab("doctors")} className={`sidebar-btn ${activeTab === "doctors" ? "active" : ""}`}>
            👨‍⚕️ Doctors
          </button>
          <button onClick={() => setActiveTab("patients")} className={`sidebar-btn ${activeTab === "patients" ? "active" : ""}`}>
            🤒 Patients
          </button>
          <button onClick={() => setActiveTab("appointments")} className={`sidebar-btn ${activeTab === "appointments" ? "active" : ""}`}>
            📅 Appointments
          </button>
          <button onClick={() => setActiveTab("receptionists")} className={`sidebar-btn ${activeTab === "receptionists" ? "active" : ""}`}>
            💁 Receptionists
          </button>
          <button onClick={() => setActiveTab("reports")} className={`sidebar-btn ${activeTab === "reports" ? "active" : ""}`}>
            📈 Reports
          </button>
          <button onClick={() => setActiveTab("feedbacks")} className={`sidebar-btn ${activeTab === "feedbacks" ? "active" : ""}`}>
            💬 Feedbacks
          </button>
        </div>

        {/* Content Area */}
        <div className="dashboard-content">
          {activeTab === "dashboard" && (
            <>
              <div className="dashboard-title">
                <h2>Admin Overview</h2>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Doctors</h3>
                  <p>{doctors.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Patients</h3>
                  <p>{patients.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Receptionists</h3>
                  <p>{receptionists.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Appointments</h3>
                  <p>{appointments.length}</p>
                </div>
                <div className="stat-card" style={{ borderLeft: "4px solid #16a34a" }}>
                  <h3>Total Revenue</h3>
                  <p>${totalRevenue}</p>
                </div>
              </div>
            </>
          )}

          {activeTab === "doctors" && (
            <>
              <div className="dashboard-title">
                <h2>Manage Doctors</h2>
                <button onClick={() => {
                  setNewDoctor({ name: "", email: "", phone: "", password: "", specialization: "", role: "doctor", image: "", experience: "", consultationfee: "" });
                  setIsEditing(false);
                  setShowAddDoctor(!showAddDoctor);
                }} className="submit-btn" style={{ width: "auto", marginBottom: "20px" }}>
                  {showAddDoctor ? "Close Form" : "Add New Doctor"}
                </button>
              </div>


              {showAddDoctor && (
                <div className="form-box" style={{ maxWidth: "100%", margin: "0 0 20px 0" }}>
                  <h3>{isEditing ? "Edit Doctor" : "Add New Doctor"}</h3>
                  <div className="dashboard-grid" style={{ minHeight: "auto", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <input name="name" className="form-input" placeholder="Name" value={newDoctor.name || ""} onChange={handleInputChange} />
                    <input name="email" className="form-input" placeholder="Email" value={newDoctor.email || ""} onChange={handleInputChange} disabled={isEditing} style={isEditing ? { backgroundColor: "#f1f5f9" } : {}} />
                    <input name="phone" className="form-input" placeholder="Phone" value={newDoctor.phone || ""} onChange={handleInputChange} />
                    {!isEditing && (
                      <input name="password" type="password" className="form-input" placeholder="Password" value={newDoctor.password || ""} onChange={handleInputChange} />
                    )}
                    <input name="specialization" className="form-input" placeholder="Specialization" value={newDoctor.specialization || ""} onChange={handleInputChange} />
                    <input name="experience" type="number" className="form-input" placeholder="Experience (Years)" value={newDoctor.experience || ""} onChange={handleInputChange} />
                    <input name="consultationfee" type="number" className="form-input" placeholder="Consultation Fee" value={newDoctor.consultationfee || ""} onChange={handleInputChange} />
                    <input name="image" className="form-input" placeholder="Image URL (optional)" value={newDoctor.image || ""} onChange={handleInputChange} />
                  </div>
                  <button onClick={handleDoctorSubmit} className="submit-btn" style={{ marginTop: "15px", width: "auto" }}>{isEditing ? "Update" : "Submit"}</button>
                </div>
              )}

              <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "15px", textAlign: "left" }}>Image</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Name</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Email</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Phone</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Specialization</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Exp (Yrs)</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Fee</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((d) => (
                    <tr key={d._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "15px" }}>
                        <img src={d.image || "https://via.placeholder.com/150"} alt={d.name} style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} />
                      </td>
                      <td style={{ padding: "15px" }}><strong>{d.name}</strong></td>
                      <td style={{ padding: "15px" }}>{d.email}</td>
                      <td style={{ padding: "15px" }}>{d.phone}</td>
                      <td style={{ padding: "15px" }}>{d.specialization}</td>
                      <td style={{ padding: "15px" }}>{d.experience}</td>
                      <td style={{ padding: "15px" }}>${d.consultationfee}</td>
                      <td style={{ padding: "15px", whiteSpace: "nowrap" }}>
                        <button onClick={() => handleEditDoctor(d)} className="action-btn" style={{ marginRight: "10px", color: "var(--primary)", borderColor: "var(--primary)" }}>Edit</button>
                        <button onClick={() => deleteDoctor(d._id)} className="action-btn" style={{ color: "red", borderColor: "red" }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab === "appointments" && (
            <>
              <div className="dashboard-title">
                <h2>Manage Appointments</h2>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "15px", textAlign: "left" }}>Date</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Doctor</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Patient</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((app) => {
                      const doctor = doctors.find(d => d._id === app.doctorId || d.userId === app.doctorId);
                      const patient = patients.find(p => p._id === app.patientId || p.userId === app.patientId);
                      return (
                        <tr key={app._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "15px" }}>{new Date(app.date).toLocaleDateString()}</td>
                          <td style={{ padding: "15px" }}>{doctor ? doctor.name : app.doctorName || "Unknown Doctor"}</td>
                          <td style={{ padding: "15px" }}>{patient ? patient.name : app.patientName || "Unknown Patient"}</td>
                          <td style={{ padding: "15px" }}>
                            <span className={`badge ${app.status === 'Completed' ? 'badge-success' : app.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ padding: "20px", textAlign: "center", color: "#666" }}>No appointments found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {activeTab === "patients" && (
            <>
              <div className="dashboard-title">
                <h2>Manage Patients</h2>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "15px", textAlign: "left" }}>Name</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Email</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Phone</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "15px" }}><strong>{p.name}</strong></td>
                      <td style={{ padding: "15px" }}>{p.email}</td>
                      <td style={{ padding: "15px" }}>{p.phone}</td>
                      <td style={{ padding: "15px" }}>
                        <button
                          onClick={() => { setSelectedPatient(p); setShowPatientModal(true); }}
                          className="action-btn"
                          style={{ marginRight: "10px", color: "var(--primary)", borderColor: "var(--primary)" }}
                        >
                          View
                        </button>
                        <button onClick={() => deletePatient(p._id)} className="action-btn" style={{ color: "red", borderColor: "red" }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab === "receptionists" && (
            <>
              <div className="dashboard-title">
                <h2>Manage Receptionists</h2>
                <button onClick={() => {
                  setNewReceptionist({ name: "", email: "", phone: "", password: "", role: "receptionist" });
                  setIsEditingReceptionist(false);
                  setShowAddReceptionist(!showAddReceptionist);
                }} className="submit-btn" style={{ width: "auto", marginBottom: "20px" }}>
                  {showAddReceptionist ? "Close Form" : "Add New Receptionist"}
                </button>
              </div>

              {showAddReceptionist && (
                <div className="form-box" style={{ maxWidth: "100%", margin: "0 0 20px 0" }}>
                  <h3>{isEditingReceptionist ? "Edit Receptionist" : "Add New Receptionist"}</h3>
                  <div className="dashboard-grid" style={{ minHeight: "auto", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <input name="name" className="form-input" placeholder="Name" value={newReceptionist.name || ""} onChange={handleReceptionistInputChange} />
                    <input name="email" className="form-input" placeholder="Email" value={newReceptionist.email || ""} onChange={handleReceptionistInputChange} />
                    <input name="phone" className="form-input" placeholder="Phone" value={newReceptionist.phone || ""} onChange={handleReceptionistInputChange} />
                    <input name="address" className="form-input" placeholder="Address" value={newReceptionist.address || ""} onChange={handleReceptionistInputChange} />
                    <input name="password" type="password" className="form-input" placeholder={isEditingReceptionist ? "Password (leave blank to keep current)" : "Password"} value={newReceptionist.password || ""} onChange={handleReceptionistInputChange} />
                  </div>
                  <button onClick={handleReceptionistSubmit} className="submit-btn" style={{ marginTop: "15px", width: "auto" }}>{isEditingReceptionist ? "Update" : "Submit"}</button>
                </div>
              )}

              <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "15px", textAlign: "left" }}>Name</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Email</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Phone</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {receptionists.map((r) => (
                    <tr key={r._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "15px" }}><strong>{r.name}</strong></td>
                      <td style={{ padding: "15px" }}>{r.email}</td>
                      <td style={{ padding: "15px" }}>{r.phone}</td>
                      <td style={{ padding: "15px" }}>
                        <button
                          onClick={() => { setSelectedReceptionist(r); setShowReceptionistModal(true); }}
                          className="action-btn"
                          style={{ marginRight: "10px", color: "var(--primary)", borderColor: "var(--primary)" }}
                        >
                          View
                        </button>
                        <button onClick={() => handleEditReceptionist(r)} className="action-btn" style={{ marginRight: "10px", color: "var(--primary)", borderColor: "var(--primary)" }}>Edit</button>
                        <button onClick={() => deleteReceptionist(r._id)} className="action-btn" style={{ color: "red", borderColor: "red" }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab === "reports" && (
            <>
              <div className="dashboard-title">
                <h2>Financial Reports</h2>
              </div>
              <div className="stats-grid">
                <div className="stat-card" style={{ borderLeft: "4px solid #16a34a" }}>
                  <h3>Total Revenue (Paid)</h3>
                  <p>${totalRevenue}</p>
                </div>
                <div className="stat-card" style={{ borderLeft: "4px solid #eab308" }}>
                  <h3>Pending Bills</h3>
                  <p>${pendingRevenue}</p>
                </div>
                <div className="stat-card" style={{ borderLeft: "4px solid #3b82f6" }}>
                  <h3>Total Invoiced</h3>
                  <p>${totalRevenue + pendingRevenue}</p>
                </div>
              </div>

              <h3 style={{ marginTop: "30px", marginBottom: "15px" }}>Recent Transactions</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "15px", textAlign: "left" }}>Patient</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Amount</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.slice(0, 5).map((b) => (
                    <tr key={b._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "15px" }}>{b.patientName || b.patientId}</td>
                      <td style={{ padding: "15px" }}>${b.amount}</td>
                      <td style={{ padding: "15px" }}>
                        <span className={`badge ${b.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab === "feedbacks" && (
            <>
              <div className="dashboard-title">
                <h2>User Feedback</h2>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "15px", textAlign: "left" }}>Date</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Name</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Rating</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Feedback</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.length > 0 ? (
                    feedbacks.map((f, i) => (
                      <tr key={f._id || i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "15px" }}>{new Date(f.date).toLocaleDateString()}</td>
                        <td style={{ padding: "15px" }}><strong>{f.name}</strong></td>
                        <td style={{ padding: "15px" }}>{f.rating} ⭐</td>
                        <td style={{ padding: "15px" }}>{f.feedback}</td>
                        <td style={{ padding: "15px" }}>
                          <button onClick={() => deleteFeedback(f._id)} className="action-btn" style={{ color: "red", borderColor: "red" }}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ padding: "20px", textAlign: "center", color: "#666" }}>No feedback available yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {showPatientModal && selectedPatient && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", width: "500px", maxHeight: "80vh", overflowY: "auto", boxShadow: "var(--shadow-md)" }}>
            <h3 style={{ marginBottom: "20px", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" }}>Patient Details</h3>

            <div style={{ display: "grid", gap: "15px" }}>
              <div><strong>Name:</strong> <span style={{ color: "var(--text-muted)" }}>{selectedPatient.name}</span></div>
              <div><strong>Email:</strong> <span style={{ color: "var(--text-muted)" }}>{selectedPatient.email}</span></div>
              <div><strong>Phone:</strong> <span style={{ color: "var(--text-muted)" }}>{selectedPatient.phone}</span></div>
              <div><strong>Age:</strong> <span style={{ color: "var(--text-muted)" }}>{selectedPatient.age}</span></div>
              <div><strong>Gender:</strong> <span style={{ color: "var(--text-muted)" }}>{selectedPatient.gender}</span></div>
              <div><strong>Blood Group:</strong> <span style={{ color: "var(--text-muted)" }}>{selectedPatient.bloodgroup}</span></div>
              <div><strong>Address:</strong> <span style={{ color: "var(--text-muted)" }}>{selectedPatient.address}</span></div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "25px" }}>
              <button onClick={() => setShowPatientModal(false)} className="submit-btn" style={{ width: "auto" }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showReceptionistModal && selectedReceptionist && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", width: "500px", maxHeight: "80vh", overflowY: "auto", boxShadow: "var(--shadow-md)" }}>
            <h3 style={{ marginBottom: "20px", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" }}>Receptionist Details</h3>

            <div style={{ display: "grid", gap: "15px" }}>
              <div><strong>Name:</strong> <span style={{ color: "var(--text-muted)" }}>{selectedReceptionist.name}</span></div>
              <div><strong>Email:</strong> <span style={{ color: "var(--text-muted)" }}>{selectedReceptionist.email}</span></div>
              <div><strong>Phone:</strong> <span style={{ color: "var(--text-muted)" }}>{selectedReceptionist.phone}</span></div>
              <div><strong>Address:</strong> <span style={{ color: "var(--text-muted)" }}>{selectedReceptionist.address || "N/A"}</span></div>
              <div><strong>Date Joined:</strong> <span style={{ color: "var(--text-muted)" }}>{new Date(selectedReceptionist.date).toLocaleDateString()}</span></div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "25px" }}>
              <button onClick={() => setShowReceptionistModal(false)} className="submit-btn" style={{ width: "auto" }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
