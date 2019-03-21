const currentOrgCredentials = require("./orgCredentials.json");
const fs = require("fs");

let User = module.exports = {
  client: null,
  correctAccessToken: null,
  orgCredentials: {
    token: null,
    orgName: null,
  },
  githubOrg: null,
  orgRepos: [],
  removeCredentials: () => {
    User.orgCredentials = {};
    fs.writeFile('orgCredentials.json', JSON.stringify(User.orgCredentials), 'utf8', function () { });
  },
  changeGithubOrg: (name) => {
    User.githubOrg = User.client.org(name);
  },
  handleUserData: (data) => {
    User.orgRepos = [];
    data.forEach(function (obj) {
      var newObj = {
        name: obj.name,
        description: obj.description
      };
      User.orgRepos.push(newObj);
    });
    return User.orgRepos;
  },
  filterUserData: () => {
    let parsedData = JSON.parse(fs.readFileSync('./orgCredentials.json', 'utf8'));
    User.orgRepos.forEach((obj, i) => {
      if (parsedData.availableRepos &&
        !parsedData.availableRepos.includes(obj.name)) User.orgRepos.splice(i, 1);
    });
    return User.orgRepos;
  },
};