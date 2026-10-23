const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../src/app");

test("GET /api/sheets returns all available sheets", async () => {
  const response = await request(app).get("/api/sheets");
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(Array.isArray(response.body.data));
  assert.ok(response.body.data.length >= 3);
});

test("GET /api/sheets/leetcode returns phases and topics", async () => {
  const response = await request(app).get("/api/sheets/leetcode");
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.id, "leetcode");
  assert.ok(Array.isArray(response.body.data.phases));
  assert.ok(response.body.data.phases.length > 0);
});

test("POST /api/sheets/track rejects unauthenticated requests", async () => {
  const response = await request(app)
    .post("/api/sheets/track")
    .send({ title: "Two Sum", platform: "leetcode", status: "solved" });

  assert.equal(response.status, 401);
});
