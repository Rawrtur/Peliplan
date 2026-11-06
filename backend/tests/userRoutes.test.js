import { describe, test, expect } from '@jest/globals';
import request from 'supertest';
import 'dotenv/config';

import app from '../app.js';

const api = "/peliplan/v1/users"
const existingUserId = "6aed16d111d8d54408cbde02"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWVkMTZkMTExZDhkNTQ0MDhjYmRlMDIiLCJpYXQiOjE3OTM5MjM4OTQsImV4cCI6MTc5NDAxMDI5NH0.R_XKFM06Iv730hf_aRL-bzqVQVTl2ToerbdNHZa2_Lg"
// verwende `toEqual()` anstatt `toBe()` für Objecte

describe('User API Tests', () => {

    test(`GET ${api}`, async () => {

        const response = await request(app)
            .get(`${api}`);

        expect(response.status).toBe(200);

    });

    test(`GET ${api}/user/${existingUserId}`, async()=> {

        const response = await request(app).get(`${api}/user/${existingUserId}`).set('Authorization', `Bearer ${token}`);
        expect(response.body.data).toBeDefined();
        expect(response.body.data._id).toBe(existingUserId);
    })

});