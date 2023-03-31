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
  describe("Get requests", () => {
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
    it("GET: 200: should respond with the comments count for specified review_id", () => {
      return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .then((response) => {
          const commentCount = response.body.reviews[0].comment_count;
          expect(commentCount).toBe(3);
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
  describe("PATCH: requests:", () => {
    it("PATCH: 200: should accept an object with a key and value which will add votes onto the original votes value", () => {
      const input = { inc_votes: 10 };
      return request(app)
        .patch("/api/reviews/5")
        .send(input)
        .expect(200)
        .expect("Content-Type", /json/)
        .then((response) => {
          const votes = response.body.review.votes;
          const output = 15;
          expect(votes).toBe(output);
        });
    });
    it("PATCH: 200: should accept an object with a key and value which will subtract votes off the original votes value", () => {
      const input = { inc_votes: -4 };
      return request(app)
        .patch("/api/reviews/5")
        .send(input)
        .expect(200)
        .expect("Content-Type", /json/)
        .then((response) => {
          const votes = response.body.review.votes;
          const output = 1;
          expect(votes).toBe(output);
        });
    });
    it("PATCH: 400: should respond with a bad request when the wrong key is used", () => {
      const input = { wrong_key: 10 };
      return request(app)
        .patch("/api/reviews/5")
        .send(input)
        .expect(400)
        .expect("Content-Type", /json/)
        .then((response) => {
          const output = "Wrong key used";
          expect(response.body.msg).toBe(output);
        });
    });
    it("PATCH: 400: should respond with a bad request when the wrong data type is used as a vote", () => {
      const input = { inc_votes: "ten" };
      return request(app)
        .patch("/api/reviews/5")
        .send(input)
        .expect(400)
        .expect("Content-Type", /json/)
        .then((response) => {
          const output = "Vote is not a number";
          expect(response.body.msg).toBe(output);
        });
    });
    it("PATCH: 400: should respond with a bad request when theres in another key added into the object", () => {
      const input = { inv_votes: "ten", whyIsThisKeyHere: "whats going on?" };
      return request(app)
        .patch("/api/reviews/5")
        .send(input)
        .expect(400)
        .expect("Content-Type", /json/)
        .then((response) => {
          const output = "To many properties";
          expect(response.body.msg).toBe(output);
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
});

describe("/api/reviews", () => {
  describe("GET requests", () => {
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
  describe("GET Query requests", () => {
    it("GET 200: responds with a category query for social deduction", () => {
      return request(app)
        .get("/api/reviews?category=social+deduction")
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews).toHaveLength(11);
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: "social deduction",
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    it("GET: 200: GET 200: responds with a category query for dexterity", () => {
      return request(app)
        .get("/api/reviews?category=dexterity")
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews).toHaveLength(1);
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: "dexterity",
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    it("GET: 200: GET 200: responds with a category query for euro game", () => {
      return request(app)
        .get("/api/reviews?category=euro+game")
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews).toHaveLength(1);
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: "euro game",
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    it("GET 404: should respond with bad request category that does not exist is queried", () => {
      return request(app)
        .get("/api/reviews?category=this+does+not+exist")
        .expect(404)
        .then((response) => {
          const reviews = response.body.msg;
          const output = "Category not found";
          expect(reviews).toBe(output);
        });
    });
    it("GET: 200: should respond with reviews sorted by owner column(defauls to date)", () => {
      return request(app)
        .get("/api/reviews?sort_by=owner")
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews).toHaveLength(13);
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
            const sortedOwners = reviews.map((review) => {
              return review.owner;
            });
            expect(sortedOwners).toBeSorted({ descending: true });
          });
        });
    });
    it("GET: 200: should respond with reviews sorted by comment count column (defauls to date)", () => {
      return request(app)
        .get("/api/reviews?sort_by=comment_count")
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews).toHaveLength(13);
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
            const sortedCommentCount = reviews.map((review) => {
              return review.comment_count;
            });
            expect(sortedCommentCount).toBeSorted({ descending: true });
          });
        });
    });
    it("GET: 404: should respond with not found when trying to sort by a column name that does not exist is entered", () => {
      return request(app)
        .get("/api/reviews?sort_by=this_column_does_not_exist")
        .expect(404)
        .then((response) => {
          const output = "Invalid sort by query";
          expect(response.body.msg).toBe(output);
        });
    });
    it("GET: 200: should respond with queries allowed to be sorted in ascending order", () => {
      return request(app)
        .get("/api/reviews?sort_by=owner&&order=asc")
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews).toHaveLength(13);
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
            const sortedOwners = reviews.map((review) => {
              return review.owner;
            });
            expect(sortedOwners).toBeSorted({ ascending: true });
          });
        });
    });
    it("GET: 200: should respond with queries allowed to be sorted in descending order", () => {
      return request(app)
        .get("/api/reviews?sort_by=comment_count&&order=desc")
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews).toHaveLength(13);
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
            const sortedCommentCount = reviews.map((review) => {
              return review.comment_count;
            });
            expect(sortedCommentCount).toBeSorted({ descending: true });
          });
        });
    });
    it("GET: 400: should respond with bad request when trying so order by an invalid order query", () => {
      return request(app)
        .get("/api/reviews?sort_by=owner&&order=not_a_valid_order")
        .expect(400)
        .then((response) => {
          const output = "Invalid order by query";
          expect(response.body.msg).toBe(output);
        });
    });
    it("GET:200: should respond with a category query with aditional sort by querys and order query", () => {
      return request(app)
        .get(
          "/api/reviews?category=social+deduction&&sort_by=owner&&order=desc"
        )
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          // console.log(reviews)
          const sortedOwner = reviews.map((review) => {
            return review.owner;
          });
          expect(sortedOwner).toBeSorted({ descending: true });
        });
    });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  describe(" GET requests", () => {
    it("GET: 200: should respond with an array of comments for the given review_id", () => {
      return request(app)
        .get("/api/reviews/3/comments")
        .expect(200)
        .then((response) => {
          const comments = response.body.comments;
          expect(comments).toHaveLength(3);
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
          createdAtArray = comments.map((comment) => {
            return comment.created_at;
          });
          expect(createdAtArray).toBeSorted({ descending: true });
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
    it("GET: 400: response with a bad request for an invalid review ID (i.e not a number)", () => {
      return request(app)
        .get("/api/reviews/not-a-num/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid ID");
        });
    });
  });
  describe("POST requests", () => {
    it("POST: 201: should accept a object with a username and a body and respond with the posted comment ", () => {
      const input = {
        username: "bainesface",
        body: "This is my favourite game so far!",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(input)
        .expect(201)
        .expect("Content-Type", /json/)
        .then((response) => {
          const msg = response.body.msg;
          const output = input.body;
          expect(msg).toBe(output);
        });
    });
    it("POST: 201: ignores unecessary properties on the object", () => {
      const input = {
        username: "bainesface",
        body: "This is my favourite game so far!",
        unescessary: "this is unecesarry",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(input)
        .expect(201)
        .expect("Content-Type", /json/)
        .then((response) => {
          const msg = response.body.msg;
          const output = input.body;
          expect(msg).toBe(output);
        });
    });
    it("POST: 400: should respond with an error message when no username exists", () => {
      const input = {
        username: "username-doesnt-exist",
        body: "This is my favourite game so far!",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(input)
        .expect(400)
        .expect("Content-Type", /json/)
        .then((response) => {
          const output = "No such username";
          expect(response.body.msg).toBe(output);
        });
    });
    it("POST: 400: should recieve an error message when body is an empty comment", () => {
      const input = {
        username: "bainesface",
        body: "",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(input)
        .expect(400)
        .expect("Content-Type", /json/)
        .then((response) => {
          const output = "No body comment";
          expect(response.body.msg).toBe(output);
        });
    });
    it("POST: 400: responds with a bad request for an invalid ID (i.e not a number)", () => {
      return request(app)
        .get("/api/reviews/not-a-num/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid ID");
        });
    });
    it("POST: 400: bad request responds with a bad request when object is missing a property", () => {
      const input = {
        username: "bainesface",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(input)
        .expect(400)
        .expect("Content-Type", /json/)
        .then((response) => {
          const output = "Missing property";
          expect(response.body.msg).toBe(output);
        });
    });
    it("POST: 404: responds with not found when a non existant id is used", () => {
      return request(app)
        .get("/api/reviews/553/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("No such review ID");
        });
    });
  });
});

describe("/api/comments/:commet_id", () => {
  it("DELETE: 204: should delete the given comment relevent to the comment_id", () => {
    return request(app)
      .delete("/api/comments/4")
      .expect(204)
      .then((response) => {
        const msg = response.body;
        const output = {};
        expect(msg).toEqual(output);
      });
  });
  it("DELETE: 404: should respond with bad request when comment id does not exist", () => {
    return request(app)
      .delete("/api/comments/456")
      .expect(404)
      .then((response) => {
        const msg = response.body.msg;
        const output = "Comment ID does not exist";
        expect(msg).toBe(output);
      });
  });
  it("DELETE: 400: should respond with bad request for an invalid comment ID (i.e not a number)", () => {
    return request(app)
      .delete("/api/comments/not-a-num")
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        const output = "Invalid ID";
        expect(msg).toBe(output);
      });
  });
});

describe("/api/users", () => {
  describe("Get requests", () => {
    it("GET: 200: should respond with an array of objects of all the users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const users = response.body.users;
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
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
});
