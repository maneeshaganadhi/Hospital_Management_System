const request = require('supertest');
const app = require('../index'); // Adjust path to index.js if necessary
const mongoose = require('mongoose');
const Appointment = require('../models/appointmentmodels');

describe('Appointment API', () => {

    beforeAll(async () => {
        // Connect to a test database or use a separate test DB
        // For simplicity, assuming the main app connection or a test setup in index.js
        // If index.js starts the server, we might need to handle connection there
        // But since we are requiring it, let's see if it exports 'app'
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Appointment.deleteMany({});
    });

    it('should create an appointment successfully', async () => {
        const res = await request(app)
            .post('/api/addappointment') // Adjust route if necessary
            .send({
                doctorId: 'doc123',
                patientId: 'pat123',
                date: '2023-10-27',
                time: '10:00 AM',
                doctorName: 'Dr. Test',
                patientName: 'Test Patient'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.msg).toEqual('appointment added successfully');
    });

    it('should prevent double booking for the same doctor, date, and time', async () => {
        // First appointment
        await request(app)
            .post('/api/addappointment')
            .send({
                doctorId: 'doc123',
                patientId: 'pat123',
                date: '2023-10-27',
                time: '10:00 AM',
                doctorName: 'Dr. Test',
                patientName: 'Test Patient'
            });

        // Second appointment (same doctor, same time)
        const res = await request(app)
            .post('/api/addappointment')
            .send({
                doctorId: 'doc123',
                patientId: 'pat456',
                date: '2023-10-27',
                time: '10:00 AM',
                doctorName: 'Dr. Test',
                patientName: 'Another Patient'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body.msg).toEqual('Doctor is not available at this time');
    });

    it('should allow booking if the previous appointment is cancelled', async () => {
        // First appointment
        await Appointment.create({
            doctorId: 'doc123',
            patientId: 'pat123',
            date: '2023-10-27',
            time: '10:00 AM',
            status: 'cancelled'
        });

        // Second appointment (same doctor, same time, but previous is cancelled)
        const res = await request(app)
            .post('/api/addappointment')
            .send({
                doctorId: 'doc123',
                patientId: 'pat456',
                date: '2023-10-27',
                time: '10:00 AM',
                doctorName: 'Dr. Test',
                patientName: 'Another Patient'
            });

        expect(res.statusCode).toEqual(201);
    });
});
