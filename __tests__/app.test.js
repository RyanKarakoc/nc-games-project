const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
require("jest-sorted");

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
        const categories = response.body.categories;
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

describe("/api/reviews/:rewiew_id", () => {
  it("GET: 200: should respond with a object sorted by the id", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then((response) => {
        const reviews = response.body.reviews;
        reviews.forEach((review) => {
          expect(review.review_id).toBe(2);
          expect(review.title).toBe("Jenga");
          expect(review.designer).toBe("Leslie Scott");
          expect(review.owner).toBe("philippaclaire9");
          expect(review.review_img_url).toBe(
            "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700"
          );
          expect(review.review_body).toBe("Fiddly fun for all the family");
          expect(review.category).toBe("dexterity");
          expect(typeof review.created_at).toBe("string");
          expect(review.votes).toBe(5);
        });
      });
  });
  it("400: response with a bad request for an invalid review ID (i.e not a number)", () => {
    return request(app)
      .get("/api/reviews/not-a-num")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid ID");
      });
  });
  it("404: response with bad request for an ID that does not exist", () => {
    return request(app)
      .get("/api/reviews/553")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("No such parametric endpoint");
      });
  });
});

describe("/api/reviews", () => {
  it("GET: 200: should respond with an array object with the reviews and comment count sorted in descending date order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const reviews = response.body.reviews;
        expect(reviews).toHaveLength(13);
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
        const createdAtArray = reviews.map((review) => {
          return review.created_at;
        });
        expect(createdAtArray).toBeSorted({
          descending: true,
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

describe("/api/reviews/:review_id/comments", () => {
  it("GET: 200: should respond with an array of comments for the given review_id", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        let length = 0;
        while (length < comments.length) {
          length++;
        }
        expect(comments).toHaveLength(length);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 3,
          });
        });
        createdAtArry = comments.map((comment) => {
          return comment.created_at;
        });
        expect(createdAtArry).toBeSorted({ descending: true });
      });
  });
  it("GET 200: should respond with an empty array when there are no comments for a legitimate review_id", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toEqual([]);
      });
  });
  it("GET: 404: responds with an error msg when no comments for an invalid review_id", () => {
    return request(app)
      .get("/api/reviews/1007776633/comments")
      .expect(404)
      .then((response) => {
        const output = "No such review ID";
        expect(response.body.msg).toBe(output);
      });
  });
  it("400: response with a bad request for an invalid review ID (i.e not a number)", () => {
    return request(app)
      .get("/api/reviews/not-a-num/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid ID");
      });
  });
});
