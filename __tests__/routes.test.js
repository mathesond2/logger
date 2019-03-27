const request = require("supertest");
const app = require("../app");
const fs = require("fs");
const bodyParser = require('body-parser')
app.use(bodyParser.json());

const credentials = {
  token: process.env.PERSONAL_ACCESS_TOKEN,
  orgName: process.env.GITHUB_ORG,
};

describe('GET /nowhere', () => {
  test('404 should be returned', async () => {
    const response = await request(app).get('/nowhere');
    expect(response.statusCode).toBe(404);
  });
});

describe('GET /', () => {
  beforeAll(async () => {
    try {
      response = await request(app).get('/');
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  });

  test('view should be rendered', () => {
    expect(response.text).toBeDefined();
  });

  test('view should be redirected if credentials exist', () => {
    try {
      let parsedData = JSON.parse(fs.readFileSync('./orgCredentials.json', 'utf8'));
      if (Object.keys(parsedData).length !== 0) {
        expect(response.statusCode).toBe(302);
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  });
});

describe('POST /register-org', () => {
  let response;
  beforeAll(async () => {
    try {
      response = await request(app)
        .post('/register-org')
        .send(credentials)
        .set('Accept', 'application/json');
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  });

  test('302 should be returned', () => {
    expect(response.statusCode).toBe(302);
  });

  test('credentials should be saved', () => {
    let parsedData = JSON.parse(fs.readFileSync('./orgCredentials.json', 'utf8'));
    expect(Object.keys(parsedData).length).toBeGreaterThan(0);
    expect(Object.keys(parsedData)).toContain('token');
    expect(Object.keys(parsedData)).toContain('orgName');
  });
});

describe('GET /add-issue', () => {
  let response;
  let parsedData;
  beforeAll(async () => {
    parsedData = JSON.parse(fs.readFileSync('./orgCredentials.json', 'utf8'));
    try {
      response = await request(app).get('/add-issue');
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  });

  test('non-authed routes should redirect', () => {
    if (Object.keys(parsedData).length === 0) {
      expect(response.statusCode).toBe(302);
    }
  });

  test('200 should be returned', () => {
    if (Object.keys(parsedData).length !== 0) {
      expect(response.statusCode).toBe(200);
    }
  });

  test('view should be rendered', () => {
    expect(response.text).toBeDefined();
  });
});

describe('GET /update-repos', () => {
  let response;
  beforeAll(async () => {
    try {
      response = await request(app).get('/update-repos');
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  });

  test('200 should be returned', () => {
    expect(response.statusCode).toBe(200);
  });

  test('view should be rendered', () => {
    expect(response.text).toBeDefined();
  });
});

describe('POST /update-repos', () => {
  let response;
  let reposToUpdate = ['bigTest1', 'bigTest2'];

  beforeAll(async () => {
    try {
      response = await request(app)
        .post('/update-repos')
        .send(reposToUpdate)
        .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  });

  test('302 should be returned', () => {
    expect(response.statusCode).toBe(302);
  });

  // test('credentials should contain availableRepos', () => {
  //   let parsedData = JSON.parse(fs.readFileSync('./orgCredentials.json', 'utf8'));
  //   expect(Object.keys(parsedData)).toContain('availableRepos');
  // });
});

describe('GET /settings', () => {
  test('view should be rendered', async () => {
    try {
      const response = await request(app).get('/settings').type('text/html');
      expect(response.text).toBeDefined();
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  });
});

// describe('GET /reset-credentials', () => {
//   let response;
//   let parsedData;
//   beforeAll(async () => {
//     parsedData = JSON.parse(fs.readFileSync('./orgCredentials.json', 'utf8'));
//     try {
//       response = await request(app).get('/reset-credentials');
//     } catch (err) {
//       console.log(`Error: ${err}`);
//     }
//   });

//   test('credentials should be removed', async () => {
//     expect(Object.keys(parsedData).length).toEqual(0);
//   });

//   test('re-direct should occur', async () => {
//     expect(response.statusCode).toBe(302);
//   });
// });