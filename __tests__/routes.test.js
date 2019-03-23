const request = require("supertest");
const app = require("../app");
const fs = require("fs");
const user1 = request.agent();
const agent = require('supertest').agent;


const createAuthenticatedUser = (done) => {
  // const httpServer = app.listen();
  const authenticatedUser = agent(app);
  console.log('authenticatedUser', authenticatedUser);
  authenticatedUser
    .get('/login/github/callback')
    .end((error, resp) => {
      done(authenticatedUser);
      // httpServer.close();
    });
}

describe('GET /select-repos', () => {
  test('it should work', () => {
    createAuthenticatedUser(async (request) => {
      const response = await request(app).get('/blah-repos');
      console.log('response.statusCode', response.statusCode);
      expect(response.statusCode).toBe(404);
      // request
      //   .get('/blah-repos')
      //   .expect(200)
      //   .end((err, res) => {
      //     console.log(res.body);
      //     // t.end(err);
      //   });
    });
  });
});


// user1
//   .post('http://localhost:3000/login/github')
//   .send({ user: 'hunter@hunterloftis.com', password: 'password' })
//   .end(function (err, res) {
//     // user1 will manage its own cookies
//     // res.redirects contains an Array of redirects
//   });

describe('GET /nowhere', () => {
  test('404 should be returned', async () => {
    const response = await request(app).get('/nowhere');
    expect(response.statusCode).toBe(404);
  });
});

describe('GET /', () => {
  test('index view should be rendered', async () => {
    const response = await request(app).get('/').type('text/html');
    expect(response.text).toBeDefined();
  });

  test('index view should be redirected if credentials exist', async () => {
    let parsedData = JSON.parse(fs.readFileSync('./orgCredentials.json', 'utf8'));
    const response = await request(app).get('/');

    if (Object.keys(parsedData).length !== 0) {
      expect(response.statusCode).toBe(302);
    }
  });
});

describe('GET /select-repos without auth', () => {
  test('non-authed routes should redirect', async () => {


    // var user1 = request.agent(app);
    // user1.getCookies();
    // console.log('user1', user1);
    // user1
    //   .get('http://localhost:3000/login/github')
    //   // .send({ user: 'hunter@hunterloftis.com', password: 'password' })
    //   .end(function (err, res) {
    //     console.log('res is', res);
    //     // user1 will manage its own cookies
    //     // res.redirects contains an Array of redirects
    //   });



    const response = await request(app).get('/select-repos');
    expect(response.statusCode).toBe(302);
  });
});

// describe('GET /select-repos', () => {
//   test('non-authed routes should redirect', async () => {
//     const response = await request(app).get('/select-repos');
//     expect(response.statusCode).toBe(302);
//   });
// });