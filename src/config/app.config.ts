export default () => ({
  app: {
    port: process.env.PORT || 8000,
    saltRounds: process.env.SALT_ROUNDS || 10,
    jwtSecret: process.env.ACCESS_TOKEN,
    jwtExpiresIn: process.env.EXPIRES_IN,
    jwtRefreshSecret: process.env.REFRESH_SECRET,
    jwtRefreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  },
});
