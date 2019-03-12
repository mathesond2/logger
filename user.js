const currentOrgCredentials = require("./orgCredentials.json");

let User = module.exports = {
  correctCredentials: false,
  client: null,
  correctAccessToken: null,
  orgCredentials: {
    token: null,
    orgName: null,
  },
  githubOrg: null,
  orgRepos: [],
  toggleCorrectCredentials: () => {
    User.correctCredentials = false;
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
    User.orgRepos.forEach((obj, i) => {
      if (currentOrgCredentials.availableRepos &&
        !currentOrgCredentials.availableRepos.includes(obj.name)) user.orgRepos.splice(i, 1);
    });
  },
};