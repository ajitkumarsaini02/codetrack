const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../src/app");

test("GET /api/platforms rejects unauthenticated requests", async () => {
  const response = await request(app).get("/api/platforms");

  assert.equal(response.status, 401);
});

test("POST /api/platforms rejects unauthenticated requests", async () => {
  const response = await request(app)
    .post("/api/platforms")
    .send({ platform: "leetcode", username: "tourist" });

  assert.equal(response.status, 401);
});

test("POST /api/platforms/sync rejects unauthenticated requests", async () => {
  const response = await request(app).post("/api/platforms/sync");

  assert.equal(response.status, 401);
});

test("GET /api/platforms rejects an invalid token", async () => {
  const response = await request(app)
    .get("/api/platforms")
    .set("Authorization", "Bearer invalid-token");

  assert.equal(response.status, 401);
});
