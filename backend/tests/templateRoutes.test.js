import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import "dotenv/config";

import app from "../app.js";

/**
 * Test Protocoll
 *
 * 1. Log in with the testUser and otherUser details
 * 2. paste the tokens below in the variables
 * 3. create a test Template for the otherUser
 * 4. Get all the Templates from other user
 * 5. paste template id below in the variable
 */

const api = "/peliplan/v1/templates";
const testUser = {
  password: "123123",
  email: "test@web.de",
};

const otherUser = {
  password: "123123",
  email: "test@admin.de",
};

// Token fuer testUser
const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWVkYzlkMzNiY2EzMWZiMjUzYWM4YjQiLCJpYXQiOjE3OTQ0OTUxNTQsImV4cCI6MTc5NDU4MTU1NH0.DsxyIxhIG9rlWq89TM_FADu9-OaYJUlIXZVTI0pmz9Y";
// Token fuer otherUser
const otherToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWYzNDIwZDljZWUxMWVmZDQzNTg5NGQiLCJpYXQiOjE3OTQ0OTUxMzQsImV4cCI6MTc5NDU4MTUzNH0.u3NiOCnYnTjF_vJucdMKCTtfTaW3pH9IvGgLDhNGvOY";
// Id for the test Template for deletion
const testTemplateId = "6af5dcdf53ccee6cbeb328f9";
/**
 * 1. getAllTemplates non auth
 * 2. getAllTemplates non admin
 * 3. getAllTemplates right request
 * 4. getUserTemplates non auth
 * 5. getUserTemplates right request
 * 6. createTemplate non auth
 * 7. createTemplate wrong todo format
 * 8. createTemplate right format (only title)
 * 9. createTemplate right format (only todo name)
 * 10. createTemplate right format (start end time)
 * 11. createTemplate right format (start duration)
 * 12. createTemplate right format (only duration)
 * 13. getTemplateDetails non auth
 * 14. getTemplateDetails wrong template id
 * 15. getTemplateDetails right request
 * 16. updateTemplate non auth
 * 17. updateTemplate wrong template id
 * 18. updateTemplate wrong todo format
 * 19. updateTemplate right request
 * 20. deleteTemplate non auth
 * 21. deleteTemplate from other user
 * 22. deleteTemplate right format
 */

describe("Template API Tests", () => {
  test("1. getAllTemplates non auth", async () => {
    const response = await request(app).get(`${api}`)
    .set("Authorization", `Bearer ${"13djf2f2f"}`);
    expect(response.status).toBe(401);
  });

  test("2. getAllTemplates non admin", async () => {
    const response = await request(app).get(`${api}`)
    .set("Authorization", `Bearer ${testToken}`);
    expect(response.body.message).toBe("Forbidden");
  });


  test("3. getAllTemplates right request", async () => {
    const response = await request(app).get(`${api}`)
    .set("Authorization", `Bearer ${otherToken}`);
    expect(response.status).toBe(200);
  });

  test("4. getUserTemplates non auth", async () => {
    const response = await request(app)
    .get(`${api}/me`)
    .set("Authorization", `Bearer ${"ifjeiff29f2"}`);
    expect(response.status).toBe(401);
  })

  test("5. getUserTemplates right request", async () => {
    const response = await request(app)
    .get(`${api}/me`)
    .set("Authorization", `Bearer ${testToken}`);
    expect(response.status).toBe(200);
  });

  test("6. createTemplate non auth", async () => {
    const response = await request(app)
    .post(`${api}/me`)
    .set("Authorization", `Bearer ${"fef43f34fg3q"}`)
    .send({title: "Test Template"});
    expect(response.status).toBe(401);
  });

  test("7. createTemplate wrong todo format", async () => {
    const response = await request(app)
    .post(`${api}/me`)
    .set("Authorization", `Bearer ${testToken}`)
    .send({title: "Test Template", todos: [{title: "Test"}]});
    expect(response.status).toBe(400);
  });

  test("8. createTemplate right format (only title)", async () => {
    const response = await request(app)
    .post(`${api}/me`)
    .set("Authorization", `Bearer ${testToken}`)
    .send({title: "Test Template0"});
    expect(response.status).toBe(201);
  });

  test("9. createTemplate right format (only todo name)", async () => {
    const response = await request(app)
    .post(`${api}/me`)
    .set("Authorization", `Bearer ${testToken}`)
    .send({title: "Test Template1", todos:[ {name:"Test"}]});
    expect(response.status).toBe(201);
  });

  test("10. createTemplate right format (start end time)", async () => {
    const response = await request(app)
    .post(`${api}/me`)
    .set("Authorization", `Bearer ${testToken}`)
    .send({title: "Test Template2", todos: [{name: "Duration", startTime: new Date(), endTime: new Date()}]});
    expect(response.status).toBe(201);
  });

  test("11. createTemplate right format (start duration)", async () => {
    const response = await request(app)
    .post(`${api}/me`)
    .set("Authorization", `Bearer ${testToken}`)
    .send({title: "Test Template3",todos: [{name: "Duration", startTime: new Date(), duration: 60 * 60 * 1000}]});
    expect(response.status).toBe(201);
  });

  test("12. createTemplate rightformat (only duration)", async () => {
    const response = await request(app)
    .post(`${api}/me`)
    .set("Authorization", `Bearer ${testToken}`)
    .send({title: "Test Template4", todos: [{name: "duration", duration: 60*60*1000}]});
    expect(response.status).toBe(201);
  });

  test("13. getTemplateDetails non auth", async () => {
    const response = await request(app)
    .get(`${api}/template`)
    .set("Authorization", `Bearer ${"f2fij2fij2f93"}`)
    .send({id:testTemplateId});
    expect(response.status).toBe(401);
  });

  test("14. getTemplateDetails wrong template id", async () => {
    const response = await request(app)
    .get(`${api}/template`)
    .set("Authorization", `Bearer ${testToken}`)
    .send({id:testTemplateId});
    expect(response.status).toBe(404);
  });

   test("15. getTemplateDetails right request", async () => {
    const response = await request(app)
    .get(`${api}/template`)
    .set("Authorization", `Bearer ${otherToken}`)
    .send({id:testTemplateId});
    expect(response.status).toBe(200);
  });

  test("16. updateTemplate non auth", async () => {
    const response = await request(app)
    .put(`${api}/template`)
    .set("Authorization", `Bearer ${"i2f923fuc92f"}`)
    .send({id:testTemplateId, title: "New Title", todos: [{name:"new Todo"}]});
    expect(response.status).toBe(401);
  });

  test("17. updateTemplate wrong template id", async () => {
    const response = await request(app)
    .put(`${api}/template`)
    .set("Authorization", `Bearer ${testToken}`)
    .send({id:testTemplateId, title: "New Title", todos: [{name:"new Todo"}]});
    expect(response.status).toBe(404);
  });

  test("18. updateTemplate wrong todo format", async () => {
    const response = await request(app)
    .put(`${api}/template`)
    .set("Authorization", `Bearer ${otherToken}`)
    .send({id:testTemplateId, title: "New Title", todos: [{title:"new Todo"}]});
    expect(response.status).toBe(400);
  });

  test("19. updateTemplate right request" , async () => {
    const response = await request(app)
    .put(`${api}/template`)
    .set("Authorization", `Bearer ${otherToken}`)
    .send({id:testTemplateId, title: "New Title", todos: [{name:"new Todo"}]});
    expect(response.status).toBe(201);
  });

  test("20 deleteTemplate non auth" , async () => {
    const response = await request(app)
    .delete(`${api}/template`)
    .set("Authorization", `Bearer ${"2i23fj23"}`)
    .send({id:testTemplateId,});
    expect(response.status).toBe(401);
  });

  test("21 deleteTemplate from other User" , async () => {
    await request(app)
    .delete(`${api}/template`)
    .set("Authorization", `Bearer ${testToken}`)
    .send({id:testTemplateId,}); // try to delete

    const response = await request(app)
    .delete(`${api}/template`)
    .set("Authorization", `Bearer ${otherToken}`)
    .send({id:testTemplateId});
    expect(response.status).toBe(200); // should exist
  });

  test("22 deleteTemplate non auth" , async () => {
    const response = await request(app)
    .delete(`${api}/template`)
    .set("Authorization", `Bearer ${otherToken}`)
    .send({id:testTemplateId,});
    expect(response.status).toBe(200);
  });
});
