const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongodbErrorHandler = require('mongoose-mongodb-errors');
mongoose.Promise = global.Promise;

const orgCredentialSchema = new Schema({
  token: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: 'Pleaase supply a personal access token'
  },
  orgName: {
    type: String,
    trim: true,
    unique: true,
    required: 'Pleaase supply your Github org name'
  },
  availableRepos: {
    type: [String],
    default: [],
  },
});

orgCredentialSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('OrgCredentials', orgCredentialSchema);