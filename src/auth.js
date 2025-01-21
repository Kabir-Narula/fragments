const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const logger = require('./logger');

// Create a Cognito JWT Verifier
const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_COGNITO_POOL_ID,
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
  tokenUse: 'id', // We're verifying an Identity token
});

// Pre-cache JWKS (public keys) to avoid runtime delays
jwtVerifier
  .hydrate()
  .then(() => logger.info('Cognito JWKS successfully cached'))
  .catch((err) => logger.error({ err }, 'Unable to cache Cognito JWKS'));

// Configure Passport's Bearer strategy
module.exports.strategy = () =>
  new BearerStrategy(async (token, done) => {
    try {
      // Verify the token
      const user = await jwtVerifier.verify(token);
      logger.debug({ user }, 'Verified user token');
      done(null, user); // Pass the verified user object
    } catch (err) {
      logger.error({ err, token }, 'Token verification failed');
      done(null, false); // Authentication failed
    }
  });

// Helper to authenticate using Passport
module.exports.authenticate = () => passport.authenticate('bearer', { session: false });
