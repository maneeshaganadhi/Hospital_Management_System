import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Ct from "../comp/Ct";

const DoctorDashboard = () => {
  const { state } = useContext(Ct);

  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState({});
  const [patients, setPatients] = useState([]);

  const [newPrescription, setNewPrescription] = useState({
    patientId: "",
    diagnosis: "",
    medicine: "",
    notes: ""
  });

  useEffect(() => {
    if (state.uid) {
      fetchPatients();
      fetchAppointments();
      fetchProfile();
    }
  }, [state.uid]);

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

      const myAppointments = res.data.filter(
        app => app.doctorId === state.uid || app.doctorName === state.name
      );

      setAppointments(myAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/getdoctors");

      const myProfile = res.data.find(
        d => d.userId === state.uid || d.email === state.name
      );

      if (myProfile) setProfile(myProfile);
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`/api/updateappointmentbyid/${id}`, { status });

      setAppointments(prev =>
        prev.map(app =>
          app._id === id ? { ...app, status } : app
        )
      );

      alert(`Appointment ${status}`);
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handlePrescriptionSubmit = async () => {
    try {

      if (!newPrescription.patientId) {
        alert("Select patient");
        return;
      }

      const prescriptionData = {
        patientId: newPrescription.patientId,
        doctorId: state.uid,
        doctorName: state.name,
        diagnosis: newPrescription.diagnosis,
        medicine: newPrescription.medicine,
        notes: newPrescription.notes
      };

      console.log("Submitting prescription:", prescriptionData);

      await axios.post("/api/addprescription", prescriptionData);

      alert("Prescription added successfully");

      setNewPrescription({
        patientId: "",
        diagnosis: "",
        medicine: "",
        notes: ""
      });

    } catch (error) {
      console.error("Error adding prescription:", error);
      alert("Failed to add prescription");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">

        {/* Sidebar */}

        <div className="dashboard-sidebar">
          <h3>Dr. {state.name}</h3>

          <button
            className={activeTab === "appointments" ? "sidebar-btn active" : "sidebar-btn"}
            onClick={() => setActiveTab("appointments")}
          >
            📅 Appointments
          </button>

          <button
            className={activeTab === "prescription" ? "sidebar-btn active" : "sidebar-btn"}
            onClick={() => setActiveTab("prescription")}
          >
            💊 Write Prescription
          </button>

          <button
            className={activeTab === "profile" ? "sidebar-btn active" : "sidebar-btn"}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile
          </button>
        </div>


        {/* Content */}

        <div className="dashboard-content">

          {/* APPOINTMENTS */}

          {activeTab === "appointments" && (
            <>
              <h2>My Appointments</h2>

              {appointments.length === 0 ? (
                <p>No appointments found</p>
              ) : (
                <div className="appointments-grid">
                  {appointments.map(app => {

                    const patient = patients.find(
                      p => p._id === app.patientId || p.userId === app.patientId
                    );

                    return (
                      <div key={app._id} className="appointment-card">

                        <h4>{patient ? patient.name : "Unknown Patient"}</h4>

                        <p>Date: {app.date}</p>
                        <p>Time: {app.time}</p>

                        <p>Status: {app.status}</p>

                        <div>

                          {app.status === "pending" && (
                            <>
                              <button onClick={() => handleStatusUpdate(app._id, "confirmed")}>
                                Confirm
                              </button>

                              <button onClick={() => handleStatusUpdate(app._id, "cancelled")}>
                                Cancel
                              </button>
                            </>
                          )}

                          {app.status === "confirmed" && (
                            <button onClick={() => handleStatusUpdate(app._id, "completed")}>
                              Complete
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setNewPrescription({
                                ...newPrescription,
                                patientId: app.patientId
                              });
                              setActiveTab("prescription");
                            }}
                          >
                            Prescribe
                          </button>

                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}


          {/* PRESCRIPTION */}

          {activeTab === "prescription" && (
            <>
              <h2>Write Prescription</h2>

              <div className="form-box">

                <label>Select Patient</label>

                <select
                  value={newPrescription.patientId}
                  onChange={(e) =>
                    setNewPrescription({
                      ...newPrescription,
                      patientId: e.target.value
                    })
                  }
                >
                  <option value="">Select Patient</option>

                  {patients.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>


                <label>Diagnosis</label>

                <input
                  value={newPrescription.diagnosis}
                  onChange={(e) =>
                    setNewPrescription({
                      ...newPrescription,
                      diagnosis: e.target.value
                    })
                  }
                />


                <label>Medicine</label>

                <input
                  value={newPrescription.medicine}
                  onChange={(e) =>
                    setNewPrescription({
                      ...newPrescription,
                      medicine: e.target.value
                    })
                  }
                />


                <label>Notes</label>

                <textarea
                  value={newPrescription.notes}
                  onChange={(e) =>
                    setNewPrescription({
                      ...newPrescription,
                      notes: e.target.value
                    })
                  }
                />

                <button onClick={handlePrescriptionSubmit}>
                  Submit Prescription
                </button>

              </div>
            </>
          )}


          {/* PROFILE */}

          {activeTab === "profile" && (
            <>
              <h2>Doctor Profile</h2>

              {profile ? (
                <div>

                  <p>Name: Dr. {profile.name}</p>

                  <p>Email: {profile.email}</p>

                  <p>Phone: {profile.phone}</p>

                  <p>Specialization: {profile.specialization}</p>

                  <p>Experience: {profile.experience} years</p>

                  <p>Consultation Fee: ${profile.consultationfee}</p>

                </div>
              ) : (
                <p>Loading...</p>
              )}

            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;