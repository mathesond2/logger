const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.Promise = global.Promise;

const orgCredentialSchema = new Schema({
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

orgCredentialSchema.plugin(passportLocalMongoose, { usernameField: 'orgName' });
orgCredentialSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('OrgCredentials', orgCredentialSchema);