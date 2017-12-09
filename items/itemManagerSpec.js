var manager = require('./itemManager')

describe("Item manager", () => it("needs to grab all items", done => {
    manager.search('twilight')
    .then(
        items => expect(items).toEqual(null),
        err => expect(err.message).toBe(false)
    )
    .then(done)
}));
