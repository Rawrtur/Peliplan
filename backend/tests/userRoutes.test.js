import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import "dotenv/config";

import app from "../app.js";

const api = "/peliplan/v1/users";

/**
 * Test Protocoll:
 *
 * 1. sign up with the test User and test Admin
 * 2. copy the tokens below for the token variable
 * 3. comment the sendVerificationEmail function out (lines 265, 153)
 * 4. set the verifactionCode Varaible in the user.controller.js file line 142 to "111333"
 * 4. set the rawToken Varaible in the user.controller.js file line 255 to "111333"
 * 5. run the tests
 * 6. reset the changes on the user.controller.js file
 */
const AdminToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWYzNDIwZDljZWUxMWVmZDQzNTg5NGQiLCJpYXQiOjE3OTQzMjcyMDMsImV4cCI6MTc5NDQxMzYwM30.8Lg00QJp9_YZIreQcI3nTLKKX112rYsVGdoHFeclggo";
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWVkYzlkMzNiY2EzMWZiMjUzYWM4YjQiLCJpYXQiOjE3OTQzMjY3MTUsImV4cCI6MTc5NDQxMzExNX0.Np3btu-3J9L-VokGLKhYR1xrMrXPt1F1h43DxO2zu9U";
const testUser = {
  name: "Test Account",
  password: "123123",
  email: "test@web.de",
};
const testAdmin = {
  name: "Test Admin",
  password: "123123",
  email: "test@admin.de",
};
const verificationCode = "111333";
const PasswordToken = "a7f3c91e82b4d60f5a1e9c73d8b2f406";
const existingUserId = "6af3420d9cee11efd435894d";

/**
 * 0. getUsers non user
 * 1. getUsers non admin
 * 2. getUsers admin
 * 3. getUserById non authorized
 * 4. getUserById  authorized but non admin with wrong id
 * 5. getUserById  authorized with admin with wrong id
 * 6. getUserById authorized with right id
 * 7. updateUsersPassword non authorized
 * 8. updateUsersPassword authorized with worng old Password
 * 9. updateUsersPassword authorized with right old Password
 * 10. updateEmail non authorized
 * 11. updateEmail authorized with wrong Password
 * 12. updateEmail authorized with current email as new email
 * 13. updateEmail authorized with right Password but existing email
 * 14. updateEmail authorized with right Password
 * 15. UpdateName non authorized
 * 16. UpdateName authorized with wrong password
 * 17. UpdateName authorized with right password
 * 18. forgotPassword with wrong email
 * 19. forgotPassword with right email
 * 20. resetPassword with wrong token
 * 21. resetPassword with right token
 * 22. DeleteUser non authorized
 * 23. DeleteUser authorized
 */

describe("User API Tests", () => {
  test(`0: getUsers non user`, async () => {
    const response = await request(app)
      .get(`${api}`)
      .set("Authorization", `Bearer ${"1245651gt4h425"}`);
    expect(response.status).toBe(401);
  });

  test(`1: getUsers non admin`, async () => {
    const response = await request(app)
      .get(`${api}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(401);
  });

  test(`2: getUsers admin`, async () => {
    const response = await request(app)
      .get(`${api}`)
      .set("Authorization", `Bearer ${AdminToken}`);
    expect(response.status).toBe(200);
  });

  test(`3: getUserById non authorized`, async () => {
    const response = await request(app)
      .get(`${api}/user/${existingUserId}`)
      .set("Authorization", `Bearer ${"12462ggv324f3"}`);
    expect(response.status).toBe(401);
  });

  test(`4: getUserById authorized non admin`, async () => {
    const response = await request(app)
      .get(`${api}/user/${existingUserId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(401);
  });

  test(`5: getUserById authorized with admin with wrong id`, async () => {
    const response = await request(app)
      .get(`${api}/user/${"1234je3"}`)
      .set("Authorization", `Bearer ${AdminToken}`);
    expect(response.status).toBe(404);
  });

  test(`6: getUserById authorized with admin with right id`, async () => {
    const response = await request(app)
      .get(`${api}/user/${existingUserId}`)
      .set("Authorization", `Bearer ${AdminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Test Admin");
  });

  test(`7: updateUsersPassword non authorized`, async () => {
    const response = await request(app)
      .put(`${api}/password/me`)
      .set("Authorization", `Bearer ${"fewfcbuhr34rz"}`)
      .send({ oldPassword: testUser.password, newPassword: "123123" });
    expect(response.status).toBe(401);
  });

  test(`8: updateUsersPassword authorized with wrong old Password`, async () => {
    const response = await request(app)
      .put(`${api}/password/me`)
      .set("Authorization", `Bearer ${token}`)
      .send({ oldPassword: "000000", newPassword: "123123" });
    expect(response.status).toBe(400);
  });

  test(`9: updateUsersPassword authorized with right old Password`, async () => {
    const response = await request(app)
      .put(`${api}/password/me`)
      .set("Authorization", `Bearer ${token}`)
      .send({ oldPassword: testUser.password, newPassword: "123123" });
    expect(response.status).toBe(200);
  });

  test(`10: updateEmail unauthorized`, async () => {
    const response = await request(app)
      .put(`${api}/email/me`)
      .set("Authorization", `Bearer ${"21e2edief2"}`)
      .send({ newEmail: "testnew@web.de", password: testUser.password });
    expect(response.status).toBe(401);
  });

  test(`10: updateEmail authorized with wrong password`, async () => {
    const response = await request(app)
      .put(`${api}/email/me`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newEmail: "testnew@web.de", password: "000000" });
    expect(response.status).toBe(400);
  });

  test(`12: updateEmail authorized with current email as new email`, async () => {
    const response = await request(app)
      .put(`${api}/email/me`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newEmail: testUser.email, password: testUser.password });
    expect(response.body.message).toBe("Email is already up to date.");
  });

  test(`13: updateEmail authorized with right Password but existing email`, async () => {
    const response = await request(app)
      .put(`${api}/email/me`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newEmail: testAdmin.email, password: testUser.password });
    expect(response.status).toBe(409);
  });

  test(`14: updateEmail authorized with right Password`, async () => {
    const response = await request(app)
      .put(`${api}/email/me`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newEmail: "test-new@web.de", password: testUser.password });
    expect(response.status).toBe(200);

    const response2 = await request(app).post(`/peliplan/v1/auth/verify`).send({
      code: verificationCode,
      email: testUser.email,
    });
    expect(response2.status).toBe(200);
    token = response2.body.data.token;
    
    // zuruck setzen
    await request(app)
      .put(`${api}/email/me`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newEmail: testUser.email, password: testUser.password });

    const response3 = await request(app).post(`/peliplan/v1/auth/verify`).send({
      code: verificationCode,
      email: testUser.email,
    });
    token = response3.body.data.token;
  });

  test(`15: UpdateName non authorized`, async () => {
    const response = await request(app)
      .put(`${api}/name/me`)
      .set("Authorization", `Bearer ${"diehfeifh2fd8"}`)
      .send({ newName: "Test New", password: testUser.password });
    expect(response.status).toBe(401);
  });

  test(`16: UpdateName authorized with wrong password`, async () => {
    const response = await request(app)
      .put(`${api}/name/me`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newName: "Test New", password: "000000" });
    expect(response.status).toBe(400);
  });

  test(`17: UpdateName authorized with right password`, async () => {
    const response = await request(app)
      .put(`${api}/name/me`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newName: "Test New", password: testUser.password });
    expect(response.status).toBe(200);
    // zuruck setzen
    await request(app)
      .put(`${api}/name/me`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newName: testUser.name, password: testUser.password });
  });

  test(`18: forgotPassword with wrong email`, async () => {
    const response = await request(app)
      .put(`${api}/forgot-password/me`)
      .send({ email: "wrong@mail.de"});
    expect(response.body.message).toBe("If the email address exists, a link has been sent.");
  });

  test(`19: forgotPassword with right email`, async () => {
    const response = await request(app)
      .put(`${api}/forgot-password/me`)
      .send({ email: testUser.email});
    expect(response.body.message).toBe("If the email address exists, a link has been sent.");
  });

  test(`20: resetPassword with wrong token`, async () => {
    const response = await request(app)
      .put(`${api}/reset-password/me`)
      .send({ token: "c5e7a91d3b8f2046e2d5c7a9f1b30468", newPassword: testUser.password});
    expect(response.status).toBe(400)
  });

  test(`21: resetPassword with right token`, async () => {
    const response = await request(app)
      .put(`${api}/reset-password/me`)
      .send({token: PasswordToken, newPassword: testUser.password});
    expect(response.status).toBe(200)
  });

});
