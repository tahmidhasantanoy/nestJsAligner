export default () => ({
  port: process.env.PORT || 5132,
  saltRounds: process.env.SALT_ROUNDS || 10,
  // jwtSecret: process.env.ACCESS_TOKEN,
  // jwtExpiresIn: process.env.EXPIRES_IN,
  // jwtRefreshSecret: process.env.REFRESH_SECRET,
  // jwtRefreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  jwt: {
    secret: process.env.ACCESS_TOKEN,
    expiresIn: process.env.EXPIRES_IN,
  },
  agenda: {
    uri: process.env.AGENDA_DB_URI || process.env.MONGODB_URI,
  },
  externalServices: {
    billing: process.env.BILLING_SERVICE_URL,
    business: process.env.BUSINESS_SERVICE_URL,
    subscription: process.env.SUBSCRIPTION_SERVICE_URL,
    vbs: process.env.VBS_SERVICE_URL,
    meta: process.env.META_SERVICE_URL,
    rbac: process.env.RBAC_SERVICE_URL,
  },
});
