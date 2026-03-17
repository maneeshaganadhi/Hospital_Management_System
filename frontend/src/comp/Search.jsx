import { useState } from "react";
import axios from "axios";
import "./Search.css";

const Search = () => {
  const [key, setKey] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const BASE_URL = "/api";

  const handleSearch = async () => {
    if (!key) return;

    try {
      const docRes = await axios.get(
        `${BASE_URL}/searchdoctors/${key}`
      );

      setDoctors(docRes.data);
    } catch (error) {
      console.log("Search error:", error);
    }
  };

  return (
    <div className="search-container">
      <div className="search-content">
        <div className="search-header">
          <h2>Find Doctors</h2>
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or specialization..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        <div className="results-section">
          {doctors.length > 0 && (
            <>
              <h3>Doctors Found ({doctors.length})</h3>
              <div className="results-grid">
                {doctors.map((d) => (
                  <div key={d._id} className="result-card">
                    <p><b>Name:</b> {d.name}</p>
                    <p><b>Specialization:</b> {d.specialization}</p>
                    <p><b>Email:</b> {d.email}</p>
                    <p><b>Phone:</b> {d.phone}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {doctors.length === 0 && key && (
            <p className="no-results">No doctors found. Try a different search term.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
