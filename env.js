const PRODUCTION = 'production';
const NODE_ENV = process.pkg ? PRODUCTION : process.env.NODE_ENV;

module.exports = NODE_ENV;