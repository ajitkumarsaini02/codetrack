const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../src/app");

test("GET /api/dashboard rejects unauthenticated requests", async () => {
  const response = await request(app).get("/api/dashboard");

  assert.equal(response.status, 401);
});

test("GET /api/dashboard rejects an invalid token", async () => {
  const response = await request(app)
    .get("/api/dashboard")
    .set("Authorization", "Bearer invalid-token");

  assert.equal(response.status, 401);
});
