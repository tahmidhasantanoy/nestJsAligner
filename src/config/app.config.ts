export default () => (
    {
        app: {
            port: process.env.PORT || 8000,
            saltRounds: process.env.SALT_ROUNDS || 10
        }
    }
)