const request = require('supertest');
const app = require('../index'); // Adjust path to index.js
const mongoose = require('mongoose');

describe('User API', () => {

    beforeAll(async () => {
        // Connect to a test database
        const mongoUri = "mongodb://127.0.0.1:27017/hospital_test";
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should pass a basic test', () => {
        expect(1 + 1).toBe(2);
    });

    // Add more tests here
});
