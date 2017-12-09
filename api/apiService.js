const client = require('gw2api-client');
const memoryCache = require('gw2api-client/build/cache/memory')

// Get an instance of an API client
let api = client();

// Optional: Set the language of the client
api.language('en');
api.cacheStorage(memoryCache(options));

module.exports = api;