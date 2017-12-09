const { api } = require('../api');
const Fuse = require('Fuse.js');

const getItems = () => new Promise((resolve, reject) => api.load('items', {}, false, null, resolve, reject))
const getItem = id => api.promise.items([id])

const getDatabase = () => {
    const options = {
        shouldSort: true,
        threshold: 0.1,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          "name"
        ]
      };
    return getItems()
        .then(() => new Fuse(api.data.items, options));
}

let database = null;

const initDbIfRequired = () => getDatabase().then(db => {
        database = db;
        return database;
    });

const fixedRange = (min, value, max) => Math.max(min, Math.min(value, max))

const searchDatabase = (searchString, n = 10) => initDbIfRequired().then(db => db.search(searchString).slice(0, fixedRange(2, n, 10)))

module.exports = {
    search: searchDatabase,
    get: getItem
};