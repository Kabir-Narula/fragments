// auth/index.js - Updated Version

// New implementation - prioritizes Basic Auth if HTPASSWD_FILE exists
if (process.env.HTPASSWD_FILE) {
  const path = require('path');
  const fs = require('fs');
  const htpasswdPath = path.resolve(process.env.HTPASSWD_FILE);

  if (!fs.existsSync(htpasswdPath)) {
    throw new Error(`HTPASSWD file not found at ${htpasswdPath}`);
  }

  console.log('Using Basic Auth with file:', htpasswdPath);
  module.exports = require('./basic-auth');
} 
// Fallback to Cognito if configured
else if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  console.log('Using Cognito Auth');
  module.exports = require('./cognito');
} 
else {
  throw new Error('Missing authentication configuration');
}

/* OLD IMPLEMENTATION (commented out)
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
*/