YUI.add('gallery-model-sync-yql', function(Y) {

/**
An Extension which provides a YQL sync implementation that can be mixed into a
Model or ModelList subclass.

@module gallery-model-sync-yql
**/

/**
This makes it trivial for your Model or ModelList subclasses to load data from
YQL.

**Note:** that `read` is the only `sync()` action that is supported at this
time, you will not be able to `save()` data to YQL.

@TODO: Example

@class ModelSync.YQL
@extension Model ModelList
**/

var YQLSync,

    Lang    = Y.Lang,
    sub     = Lang.sub,
    isValue = Lang.isValue;

// *** YQLSYnc *** //

YQLSync = function () {};

YQLSync.prototype = {

    // *** Public Properties *** //

    /**
    A String which is the YQL query. The query will be passed to `buildQuery()`
    where, by default, will be processed by `Y.Lang.sub()`; which is useful when
    the YQL query for a Model type matches a specific pattern and can use simple
    replacement tokens:

    @example
        'SELECT * FROM flickr.photos.info WHERE photo_id={id}'

    @property query
    @type String
    @default ''
    **/
    query : '',

    /**
    A Y.Cache instance to be used to store the YQL query results. You may wish
    to use a Y.CacheOffline instance to make subsequent loads of your app fast.

    @property cache
    @type Cache
    @default undefined
    **/

    // *** Lifecycle Methods *** //

    initializer : function (config) {
        config || (config = {});
        isValue(config.query) && (this.query = config.query);
    },

    // *** Public Methods *** //

    /**
    Returns a processed YQL query by taking the `query` String and substituting
    any replacement tokens with the `options` passed to `load()`, and if it's a
    Model instance, substituting the Model's `id`.

    @method  buildQuery
    @param {Object} [options] Sync options.
    @return {String} The query to be sent to YQL.
    **/
    buildQuery : function (options) {
        options || (options = {});
        return sub(this.query, Y.merge(options,
            (this instanceof Y.Model) && { id: this.get('id') }));
    },

    /**
    Communicates with YQL by sending sending over the YQL query and receiving
    JSON results back.

    This method is called internally by load(), save(), and destroy().

    **Note:** This will only actually do something when called via load().

    @method sync
    @param {String} action Sync action to perform. May be one of the following:

      * read  : Load an existing model.

    @param {Object} [options] Sync options.
    @param {callback} [callback] Called when the sync operation finishes.
      @param {Error|null} callback.err If an error occurred, this parameter will
        contain the error. If the sync operation succeeded, _err_ will be
        falsy.
      @param {Any} [callback.response] The YQL results. This value will be
        passed to the parse() method, which is expected to parse it and return
        an attribute hash or array depending on whether the method is
        called on a Model or ModelList.
    **/
    sync : function (action, options, callback) {
        if (action !== 'read') {
            // TODO: return some error dingus here.
            return callback(null);
        }

        var query   = this.buildQuery(options),
            cache   = this.cache,
            results = cache && cache.retrieve(query);

        if (results) {
            // return cached results if we got ’em
            return callback(null, results.response);
        }

        Y.YQL(query, function(r){
            if (r.error) {
                callback(r.error, r);
            } else {
                results = r.query.results;
                cache && cache.add(query, results);
                callback(null, results);
            }
        });
    }

};

// *** Namespace *** //

Y.namespace('ModelSync').YQL = YQLSync;


}, 'gallery-2011.08.24-23-44' ,{requires:['yql'], skinnable:false, optional:['cache', 'cache-offline']});
