import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import "dotenv/config";

import app from "../app.js";

/**
 * TESTFÄLLE
 *
 * 1. Exisitert die Route?
 * 2. Funktionieren Standardwerte?
 * 3. Teste alle Ausnamen
 */

// Sign up -> unverified account -> verify -> verified account

// SignUp: right sign up
// SignUp: existing unverified user but false password
// SignUp: existing unverified user with right password
// Verify: verifiy with wrong email
// Verify: expired verification code
// ResendVerify: send verification code
// Verify: invalid Code
// SignIn: User not verfied yet
// Verify: verifiy with right code and data
// SignUp: existing verified user
// Verify: verifiy with none verifiaction code
// ResendVerify: non existing email
// ResendVerify: user already verified
// SignIn: Invalid Email
// SignIn: Invalid Password
// SignOut: right signOut

// IMPORTANT: For testing the verification Code, the code is set to 333555 in plain for the verification route
// Comment out line 83, 187 and line 29, 176

const api = "/peliplan/v1/auth";
const testUser = {
  name: "Test Account",
  password: "123123",
  email: "test@web.de",
};
const verificationCode = "333555";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Auth API Tests", () => {
  // right sign up logic
  test(`Right Sign Up`, async () => {
    const response = await request(app).post(`${api}/sign-up`).send(testUser);

    expect(response.status).toBe(201);
  });

  test("SignUp: existing unverified user but false password", async () => {
    const response = await request(app).post(`${api}/sign-up`).send({
      name: testUser.name,
      email: testUser.email,
      password: "111000", // wrong password
    });
    expect(response.status).toBe(409);
  });

  test("SignUp: existing unverified user with right password", async () => {
    const response = await request(app).post(`${api}/sign-up`).send(testUser);
    expect(response.status).toBe(201);
  });

  test("Verify: verifiy with wrong email", async () => {
    const response = await request(app).post(`${api}/verify`).send({
      code: verificationCode,
      email: "wrong-mail@web.de",
    });
    expect(response.body.message).toBe("Invalid verfication data");
  });

//   test("Verify: expired verification code", async () => {
//     await wait(6 * 60 * 1000); // warte 6 Minuten -> Code sollte ablaufen
//     const response = await request(app).post(`${api}/verify`).send({
//       code: verificationCode,
//       email: testUser.email,
//     });
//     expect(response.body.error).toBe("Code is expired");
//   }, 7*60*1000); // Testzeitlimit höher ansetzen

  test("ResendVerify: send verification code", async () => {
    const response = await request(app).post(`${api}/resend-verify`).send({
      email: testUser.email,
    });
    expect(response.body.message).toBe("VerificationCode sended");
  });

  test("Verify: invalid Code", async () => {
    const response = await request(app).post(`${api}/verify`).send({
      code: "000111",
      email: testUser.email,
    });
    expect(response.body.error).toBe("Invalid Verification Code.");
  });

  test("SignIn: User not verfied yet", async () => {
    const response = await request(app).post(`${api}/sign-in`).send(testUser);
    expect(response.body.message).toBe(
      "Please verify your email address first.",
    );
  });

  test("Verify: verifiy with right code and data", async () => {
    const response = await request(app).post(`${api}/verify`).send({
      code: verificationCode,
      email: testUser.email,
    });
    expect(response.body.success).toBe(true);
  });

  test("SignUp: existing verified user", async () => {
    const response = await request(app).post(`${api}/sign-up`).send(testUser);
    expect(response.status).toBe(409);
  });

  test("Verify: verifiy with none verifiaction code", async () => {
    const response = await request(app).post(`${api}/verify`).send({
      email: testUser.email,
      code: verificationCode,
    });
    expect(response.body.message).toBe("Invalid verfication data");
  });

  test("ResendVerify: non existing email", async () => {
    const response = await request(app)
      .post(`${api}/resend-verify`)
      .send({ email: "wrong-mail@web.de" });
    expect(response.body.message).toBe(
      "If an account exists, a verification code has been sent.",
    );
  });

  test("ResendVerify: user already verified", async () => {
    const response = await request(app)
      .post(`${api}/resend-verify`)
      .send({ email: testUser.email });
    expect(response.body.message).toBe(
      "If an account exists, a verification code has been sent.",
    );
  });

  test("SignIn: Invalid Email", async () => {
    const response = await request(app)
    .post(`${api}/sign-in`)
    .send({
        email: "wrong-mail@web.de",
        password: testUser.password
    })
    expect(response.body.message).toBe("Invalid email or password.")
  });

  test("SignIn: Invalid Passwird", async () => {
    const response = await request(app)
    .post(`${api}/sign-in`)
    .send({
        email: testUser.email,
        password: "000111"
    })
    expect(response.body.message).toBe("Invalid email or password.")
  });

  test("SignIn: right signOut", async () => {
    const response = await request(app)
    .post(`${api}/sign-in`)
    .send(testUser);
    expect(response.body.message).toBe("User Signed In successfully")
  })

  test("SignOut: right signOut", async () => {
    const response = await request(app)
    .post(`${api}/sign-out`)
    expect(response.body.message).toBe("User signed out successfully.")
  })

});
