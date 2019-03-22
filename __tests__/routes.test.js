const request = require("supertest");
const app = require("../app");
const fs = require("fs");

// describe("GET /sample ", () => {
//   test("it should respond with an array of students", async () => {
//     const response = await request(app).get("/sample");
//     expect(response.body).toEqual(["Elie", "Matt", "Joel", "Michael"]);
//     // expect(response.statusCode).toBe(200);
//   });
// });

describe("GET / ", () => {
  test("index view should be rendered", async () => {
    const response = await request(app).get("/").type('text/html');
    expect(response.text).toBeDefined();
  });

  test("index view should be redirected if credentials exist", async () => {
    let parsedData = JSON.parse(fs.readFileSync('./orgCredentials.json', 'utf8'));
    const response = await request(app).get("/").type('text/html');

    if (Object.keys(parsedData).length !== 0) {
      expect(response.statusCode).toBe(302);
    }
  });
}); 