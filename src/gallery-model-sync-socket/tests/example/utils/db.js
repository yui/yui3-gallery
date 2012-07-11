var Collection = function () {
    this._lastId = 0;
    this.items = {};
};

Collection.prototype = {
    item: function (id) {
        return this.items[id];
    },

    add: function (item) {
        var id = this._generateId();
        item.id = id;
        return (this.items[id] = item);
    },

    update: function (item) {
        var id = item && item.id;
        this.items[id] && (this.items[id] = item);
    },

    remove: function (item) {
        var id = item && item.id;
        delete this.items[id];
    },

    toJSON: function () {
        var items       = this.items,
            ids         = Object.keys(items),
            collection  = [];

        // Sort Ids.
        ids.sort(function (a, b) {
            return a - b;
        });

        // Put items into a result-set.
        ids.forEach(function (id) {
            collection.push(items[id]);
        });

        return collection;
    },

    _generateId: function () {
        this._lastId++;
        return this._lastId;
    }
};

exports.Collection = Collection;
