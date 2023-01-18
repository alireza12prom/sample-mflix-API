module.exports = {
    payload: {},
    options: {
        issuer: 'TEST',
        audience: `http://${process.env.HOST}:${process.env.PORT}`,
        expiresIn:'12h',
        algorithm: 'RS256'
    }
}
