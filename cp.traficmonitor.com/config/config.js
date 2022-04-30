const deepMerge = require('deepmerge');
const config = require('./config.json');

module.exports = deepMerge(config.default, config[process.env.NODE_ENV || 'production']);
