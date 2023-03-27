const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return connection.end();
});

describe("/api/categories", () => {
  it("GET: 200: responds with an array of all the category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        const categories = response.body;
        expect(categories).toHaveLength(4);
        expect(categories).toBeInstanceOf(Array);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  it("GET: 404: responds with an error when wrong pathway typed in", () => {
    return request(app)
      .get("/api/incorrectpath")
      .expect(404)
      .then((response) => {
        const output = "Incorrect Path!";
        expect(response.body.msg).toBe(output);
      });
  });
});
