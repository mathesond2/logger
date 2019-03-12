let User = module.exports = {
  correctCredentials: false,
  client: null,
  correctAccessToken: null,
  orgCredentials: {
    token: null,
    orgName: null,
  },
  toggleCorrectCredentials: () => {
    User.correctCredentials = false;
  }
};