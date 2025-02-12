// Fix NODE_ENV typo and test handling
if (
  process.env.AWS_COGNITO_POOL_ID &&
  process.env.AWS_COGNITO_CLIENT_ID &&
  process.env.HTPASSWD_FILE
) {
  throw new Error('Configuration conflict: Cannot use both Cognito and Basic Auth');
}

if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  module.exports = require('./cognito');
} else if (process.env.HTPASSWD_FILE && process.env.NODE_ENV !== 'production') { // Fixed typo here
  module.exports = require('./basic-auth');
} else {
  throw new Error('Missing authentication configuration');
}