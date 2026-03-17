const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function runTest() {
    const doctorId = "debug_doc_" + Date.now(); // Unique doc ID for this run to avoid clashes with real data initially
    const date = "2023-12-25";
    const time = "10:00";

    const appointmentData = {
        doctorId,
        patientId: "patient_1",
        date,
        time,
        doctorName: "Debug Doctor",
        patientName: "Patient One",
        status: "pending"
    };

    console.log(`[TEST] Attempting Booking 1 for Doc ${doctorId} at ${date} ${time}...`);
    try {
        const res1 = await axios.post(`${BASE_URL}/addappointment`, appointmentData);
        console.log(`[TEST] Booking 1 Result: ${res1.status} - ${JSON.stringify(res1.data)}`);
    } catch (err) {
        console.log(`[TEST] Booking 1 Failed: ${err.response?.status} - ${JSON.stringify(err.response?.data)}`);
    }

    console.log(`[TEST] Attempting Booking 2 (Same Details) for Doc ${doctorId} at ${date} ${time}...`);
    try {
        const res2 = await axios.post(`${BASE_URL}/addappointment`, { ...appointmentData, patientId: "patient_2", patientName: "Patient Two" });
        console.log(`[TEST] Booking 2 Result: ${res2.status} - ${JSON.stringify(res2.data)}`);
    } catch (err) {
        console.log(`[TEST] Booking 2 Failed: ${err.response?.status} - ${JSON.stringify(err.response?.data)}`);
    }
}

runTest();
