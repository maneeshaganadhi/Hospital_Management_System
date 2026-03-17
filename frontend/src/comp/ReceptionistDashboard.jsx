import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Ct from "./Ct";

const ReceptionistDashboard = () => {
  const { state } = useContext(Ct);
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [billAmount, setBillAmount] = useState(0);
  const [consultationFee, setConsultationFee] = useState(0);
  const [medicines, setMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({ name: "", quantity: 1, price: 0 });
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    password: "",
    address: "",
    bloodgroup: "",
    role: "patient"
  });

  const [profileData, setProfileData] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [patients, setPatients] = useState([]);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    if (activeTab === "appointments") {
      fetchAppointments();
    } else if (activeTab === "billing") {
      fetchAppointments();
      fetchBills();
    } else if (activeTab === "profile") {
      fetchProfile();
    } else if (activeTab === "patients") {
      fetchPatients();
    }
  }, [activeTab]);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("/api/getpatients");
      setPatients(res.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
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

  const [isEditingBill, setIsEditingBill] = useState(false);
  const [editingBillId, setEditingBillId] = useState(null);

  const handleGenerateBill = async (appointment) => {
    setSelectedAppointment(appointment);
    try {
      const res = await axios.get(`/api/getdoctorbyid/${appointment.doctorId}`);
      if (res.data && res.data.consultationfee) {
        setConsultationFee(res.data.consultationfee);
        setBillAmount(res.data.consultationfee);
      } else {
        setConsultationFee(0);
        setBillAmount(0);
      }
      setMedicines([]);
      setNewMedicine({ name: "", quantity: 1, price: 0 });
      setIsEditingBill(false);
      setEditingBillId(null);
    } catch (error) {
      console.error("Error fetching doctor fee:", error);
      setConsultationFee(0);
      setBillAmount(0);
    }
    setShowBillModal(true);
  };

  const handleEditBill = (bill) => {
    setSelectedAppointment({
      patientId: bill.patientId,
      patientName: bill.patientName,
      doctorId: bill.doctorId,
      doctorName: bill.doctorName,
      _id: bill.appointmentId
    });
    setConsultationFee(bill.consultationFee || 0);
    setMedicines(bill.medicines || []);
    setBillAmount(bill.amount || 0);
    setIsEditingBill(true);
    setEditingBillId(bill._id);
    setShowBillModal(true);
  };

  const submitBill = async () => {
    if (!selectedAppointment) return alert("No appointment/bill selected");
    if (!billAmount) return alert("Please enter amount");

    const billData = {
      patientId: selectedAppointment.patientId,
      patientName: selectedAppointment.patientName,
      doctorId: selectedAppointment.doctorId,
      doctorName: selectedAppointment.doctorName,
      appointmentId: selectedAppointment._id,
      amount: billAmount,
      consultationFee,
      medicines,
      status: isEditingBill ? "Pending" : "Pending" // Keep status pending on edit unless specified otherwise
    };

    try {
      if (isEditingBill) {
        console.log("Updating bill:", editingBillId, billData);
        const res = await axios.put(`/api/updatebillbyid/${editingBillId}`, billData);
        alert("Bill updated successfully");
        // Update local state
        setBills(prev => prev.map(b => b._id === editingBillId ? res.data.updatedBill : b));
      } else {
        console.log("Submitting bill:", billData);
        const res = await axios.post("/api/addbill", billData);
        alert("Bill generated successfully");
        if (res.data && res.data.data) {
          setBills(prev => [...prev, res.data.data]);
        } else {
          fetchBills();
        }
      }

      setShowBillModal(false);
      setBillAmount(0);
      setConsultationFee(0);
      setMedicines([]);
      setIsEditingBill(false);
      setEditingBillId(null);
    } catch (error) {
      console.error("Error saving bill:", error);
      alert("Failed to save bill");
    }
  };

  const markAsPaid = async (id) => {
    try {
      // Optimistic update: Update UI immediately
      setBills(prevBills => prevBills.map(b =>
        b._id === id ? { ...b, status: "Paid" } : b
      ));

      await axios.put(`/api/updatebillbyid/${id}`, { status: "Paid" });
      fetchBills(); // Confirm with server data
    } catch (error) {
      console.error("Error updating bill:", error);
      fetchBills(); // Revert/Refresh on error
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

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/updateappointmentbyid/${id}`, { status });
      fetchAppointments(); // Refresh list
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/profile", {
        headers: { Authorization: state.token }
      });
      setProfileData(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await axios.put(`/api/updateuserbyid/${profileData._id}`, profileData);
      alert("Profile updated successfully");
      setIsEditingProfile(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const registerPatient = async () => {
    try {
      await axios.post("/api/register", newPatient);
      alert("Patient registered successfully");
      setNewPatient({
        name: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        password: "",
        address: "",
        bloodgroup: "",
        role: "patient"
      });
    } catch (error) {
      console.error("Error registering patient:", error);
      alert(error.response?.data?.msg || "Failed to register patient");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="dashboard-title">
            <h3>Receptionist</h3>
          </div>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`sidebar-btn ${activeTab === "appointments" ? "active" : ""}`}
          >
            📅 Appointments
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`sidebar-btn ${activeTab === "billing" ? "active" : ""}`}
          >
            💰 Billing
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`sidebar-btn ${activeTab === "register" ? "active" : ""}`}
          >
            👤 Register Patient
          </button>
          <button
            onClick={() => setActiveTab("patients")}
            className={`sidebar-btn ${activeTab === "patients" ? "active" : ""}`}
          >
            🏥 Patients
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`sidebar-btn ${activeTab === "profile" ? "active" : ""}`}
          >
            My Profile
          </button>
          {/* Receptionist might share user update logic or have their own, assuming generic for now if they have a profile */}
          {/* <button onClick={() => window.location.href = "/editprofile"} className="sidebar-btn">⚙️ Edit Profile</button> */}
        </div>

        {/* Content Area */}
        <div className="dashboard-content">
          {activeTab === "appointments" && (
            <>
              <div className="dashboard-title">
                <h2>Manage Appointments</h2>
              </div>
              {appointments.length === 0 ? (
                <p>No appointments found.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                        <th style={{ padding: "15px", textAlign: "left" }}>Patient</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>Doctor</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>Date/Time</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>Status</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((app) => (
                        <tr key={app._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "15px" }}>
                            <strong>{app.patientName || app.patientId}</strong>
                          </td>
                          <td style={{ padding: "15px" }}>{app.doctorName || app.doctorId}</td>
                          <td style={{ padding: "15px" }}>{app.date} <br /> <small style={{ color: "var(--text-muted)" }}>{app.time}</small></td>
                          <td style={{ padding: "15px" }}>
                            <span className={`badge ${app.status === 'confirmed' ? 'badge-success' : app.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                              {app.status}
                            </span>
                          </td>
                          <td style={{ padding: "15px" }}>
                            {app.status === 'pending' && (
                              <div style={{ display: "flex", gap: "5px" }}>
                                <button onClick={() => updateStatus(app._id, 'confirmed')} className="action-btn" style={{ padding: "6px 12px", color: "green", borderColor: "green" }}>Confirm</button>
                                <button onClick={() => updateStatus(app._id, 'cancelled')} className="action-btn" style={{ padding: "6px 12px", color: "red", borderColor: "red" }}>Cancel</button>
                              </div>
                            )}
                            {app.status === 'confirmed' && (
                              <button onClick={() => updateStatus(app._id, 'completed')} className="action-btn" style={{ padding: "6px 12px" }}>Complete</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeTab === "billing" && (
            <>
              <div className="dashboard-title">
                <h2>Billing Dashboard</h2>
              </div>

              <h3 style={{ fontSize: "1.2rem", color: "var(--text-main)", marginBottom: "15px" }}>Pending Bills</h3>
              <div style={{ overflowX: "auto", marginBottom: "40px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ padding: "15px", textAlign: "left" }}>Patient</th>
                      <th style={{ padding: "15px", textAlign: "left" }}>Doctor</th>
                      <th style={{ padding: "15px", textAlign: "left" }}>Date</th>
                      <th style={{ padding: "15px", textAlign: "left" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.filter(a => (a.status === 'completed' || a.status === 'confirmed') && !bills.some(b => String(b.appointmentId) === String(a._id))).map((app) => (
                      <tr key={app._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "15px" }}><strong>{app.patientName || app.patientId}</strong></td>
                        <td style={{ padding: "15px" }}>{app.doctorName || app.doctorId}</td>
                        <td style={{ padding: "15px" }}>{app.date}</td>
                        <td style={{ padding: "15px" }}>
                          <button onClick={() => handleGenerateBill(app)} className="submit-btn" style={{ width: "auto", padding: "8px 16px", fontSize: "0.9rem" }}>Generate Bill</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 style={{ fontSize: "1.2rem", color: "var(--text-main)", marginBottom: "15px" }}>History</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ padding: "15px", textAlign: "left" }}>Patient</th>
                      <th style={{ padding: "15px", textAlign: "left" }}>Amount</th>
                      <th style={{ padding: "15px", textAlign: "left" }}>Status</th>
                      <th style={{ padding: "15px", textAlign: "left" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((b) => (
                      <tr key={b._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "15px" }}><strong>{b.patientName || b.patientId}</strong></td>
                        <td style={{ padding: "15px" }}>${b.amount}</td>
                        <td style={{ padding: "15px" }}>
                          <span className={`badge ${b.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: "15px" }}>
                          {b.status === 'Pending' && (
                            <div style={{ display: "flex", gap: "5px" }}>
                              <button onClick={() => handleEditBill(b)} className="action-btn" style={{ padding: "6px 12px", color: "var(--primary)", borderColor: "var(--primary)" }}>Edit</button>
                              <button onClick={() => markAsPaid(b._id)} className="action-btn" style={{ padding: "6px 12px", color: "green", borderColor: "green" }}>Mark Paid</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "register" && (
            <div className="form-box" style={{ maxWidth: "800px", margin: "0" }}>
              <div className="dashboard-title">
                <h2>Register New Patient</h2>
              </div>
              <div className="dashboard-grid" style={{ minHeight: "auto", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-input" name="name" value={newPatient.name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-input" name="email" value={newPatient.email} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-input" name="phone" value={newPatient.phone} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input className="form-input" name="age" type="number" value={newPatient.age} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select className="form-input" name="gender" value={newPatient.gender} onChange={handleInputChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <input className="form-input" name="bloodgroup" value={newPatient.bloodgroup} onChange={handleInputChange} />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>Address</label>
                  <input className="form-input" name="address" value={newPatient.address} onChange={handleInputChange} />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>Password</label>
                  <input className="form-input" name="password" placeholder="Create password" type="password" value={newPatient.password} onChange={handleInputChange} />
                </div>
              </div>
              <button onClick={registerPatient} className="submit-btn" style={{ marginTop: "20px" }}>Register Patient</button>
            </div>
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
                    <div><strong>Role:</strong> <p style={{ marginTop: "5px", color: "var(--text-muted)" }}>{profileData.role || "N/A"}</p></div>
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
                    </div>
                    <button onClick={handleProfileUpdate} className="submit-btn" style={{ marginTop: "20px", width: "fit-content", padding: "12px 30px" }}>
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {activeTab === "patients" && (
            <>
              <div className="dashboard-title">
                <h2>Patient Records</h2>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ padding: "15px", textAlign: "left" }}>Name</th>
                      <th style={{ padding: "15px", textAlign: "left" }}>Phone</th>
                      <th style={{ padding: "15px", textAlign: "left" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p) => (
                      <tr key={p._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "15px" }}><strong>{p.name}</strong></td>
                        <td style={{ padding: "15px" }}>{p.phone}</td>
                        <td style={{ padding: "15px" }}>
                          <button
                            className="action-btn"
                            style={{ color: "var(--primary)", borderColor: "var(--primary)" }}
                            onClick={() => {
                              setSelectedPatient(p);
                              setShowPatientModal(true);
                            }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

      {showBillModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", width: "600px", maxHeight: "80vh", overflowY: "auto", boxShadow: "var(--shadow-md)" }}>
            <h3 style={{ marginBottom: "20px" }}>{isEditingBill ? "Edit Bill" : "Generate Bill"}</h3>
            <p style={{ marginBottom: "15px" }}><strong>Patient:</strong> {selectedAppointment?.patientName}</p>

            <div className="form-group">
              <label>Consultation Fee ($)</label>
              <input
                type="number"
                className="form-input"
                value={consultationFee}
                onChange={(e) => {
                  const fee = parseFloat(e.target.value) || 0;
                  setConsultationFee(fee);
                  const medTotal = medicines.reduce((sum, item) => sum + item.total, 0);
                  setBillAmount(fee + medTotal);
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ marginBottom: "10px" }}>Medicines</h4>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                <input
                  placeholder="Medicine Name"
                  className="form-input"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  className="form-input"
                  value={newMedicine.quantity}
                  onChange={(e) => setNewMedicine({ ...newMedicine, quantity: parseFloat(e.target.value) || 1 })}
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="form-input"
                  value={newMedicine.price}
                  onChange={(e) => setNewMedicine({ ...newMedicine, price: parseFloat(e.target.value) || 0 })}
                />
                <button
                  className="submit-btn"
                  style={{ width: "100%" }}
                  onClick={() => {
                    if (!newMedicine.name || !newMedicine.price) return alert("Enter valid medicine details");
                    const total = newMedicine.quantity * newMedicine.price;
                    const updatedMedicines = [...medicines, { ...newMedicine, total }];
                    setMedicines(updatedMedicines);
                    setBillAmount(consultationFee + updatedMedicines.reduce((sum, item) => sum + item.total, 0));
                    setNewMedicine({ name: "", quantity: 1, price: 0 });
                  }}
                >Add</button>
              </div>

              {medicines.length > 0 && (
                <table style={{ width: "100%", fontSize: "0.9rem", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9" }}>
                      <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Qty</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Price</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Total</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>X</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((med, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "8px" }}>{med.name}</td>
                        <td style={{ padding: "8px" }}>{med.quantity}</td>
                        <td style={{ padding: "8px" }}>${med.price}</td>
                        <td style={{ padding: "8px" }}>${med.total}</td>
                        <td style={{ padding: "8px" }}>
                          <button
                            style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}
                            onClick={() => {
                              const updated = medicines.filter((_, i) => i !== idx);
                              setMedicines(updated);
                              setBillAmount(consultationFee + updated.reduce((sum, item) => sum + item.total, 0));
                            }}
                          >✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="form-group">
              <label><strong>Total Amount ($)</strong></label>
              <input
                type="number"
                className="form-input"
                value={billAmount}
                readOnly
                style={{ backgroundColor: "#f8fafc", fontWeight: "bold" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button onClick={() => setShowBillModal(false)} className="action-btn">Cancel</button>
              <button onClick={submitBill} className="submit-btn" style={{ width: "auto" }}>{isEditingBill ? "Update Bill" : "Submit Bill"}</button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default ReceptionistDashboard;
