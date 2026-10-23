const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../src/app");

test("POST /api/auth/register rejects missing fields", async () => {
  const response = await request(app).post("/api/auth/register").send({});

  assert.ok([400, 422].includes(response.status));
});

test("POST /api/auth/login rejects missing credentials", async () => {
  const response = await request(app).post("/api/auth/login").send({});

  assert.ok([400, 401, 422].includes(response.status));
});

test("GET /api/auth/me rejects requests without a token", async () => {
  const response = await request(app).get("/api/auth/me");

  assert.equal(response.status, 401);
});

test("GET /api/auth/me rejects an invalid token", async () => {
  const response = await request(app)
    .get("/api/auth/me")
    .set("Authorization", "Bearer invalid-token");

  assert.equal(response.status, 401);
});
