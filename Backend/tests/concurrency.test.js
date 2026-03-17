const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const Appointment = require('../models/appointmentmodels');

describe('Appointment Concurrency API', () => {

    beforeAll(async () => {
        // Database connection should be handled by app or setup file
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Appointment.deleteMany({});
    });

    it('should prevent multiple bookings for the same slot when requests are concurrent', async () => {
        const appointmentData = {
            doctorId: 'doc_race_test',
            patientId: 'pat_race_1',
            date: '2025-01-01',
            time: '10:00 AM',
            doctorName: 'Dr. Race',
            patientName: 'Patient Race 1'
        };

        const req1 = request(app).post('/api/addappointment').send(appointmentData);
        const req2 = request(app).post('/api/addappointment').send({ ...appointmentData, patientId: 'pat_race_2', patientName: 'Patient Race 2' });

        const results = await Promise.all([req1, req2]);

        const successCount = results.filter(r => r.statusCode === 201).length;
        const failCount = results.filter(r => r.statusCode === 400 || r.statusCode === 500).length;

        // One should succeed, one should fail (either 400 from our check or 500 from Mongo E11000 duplicate key)
        expect(successCount).toBe(1);
        expect(failCount).toBe(1);
    });
});
