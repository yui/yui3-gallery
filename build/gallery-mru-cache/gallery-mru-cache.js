YUI.add('gallery-mru-cache', function(Y) {

/**********************************************************************
 * <p>Cache which drops items based on "most recently used."  Items are
 * dropped when a user-defined criterion is exceeded, e.g., total size or
 * number of items.</p>
 * 
 * <p>The items are stored in a map of {data,mru_item_ref}.  The MRU items
 * are stored in a doubly linked list (which stores the map keys) to allow
 * easy re-ordering and dropping of items.  Every cache hit moves the
 * associated MRU item to the front of the list.</p>
 * 
 * @module gallery-mru-cache
 * @class MRUCache
 * @constructor
 * @param config {Object}
 *	<dl>
 *	<dt>metric</dt>
 *	<dd>(Required) Function which computes the metric for an item.  It receives the value as an argument and must return a positive number.</dd>
 *	<dt>limit</dt>
 *	<dd>(Required) Maximum allowed value of the metric.  Items are dropped off the end of the MRU list until the metric is less than or equal to the limit.</dd>
 *	<dt>meta</dt>
 *	<dd>Function which attaches meta data to an item when it is added to the cache.  It receives the value as an argument.</dd>
 *	<dt>stats</dt>
 *	<dd>Pass true if you want to collect basic statistics.  Pass a function if you want to control what information is stored for each key.  The function receives the key, the value, and the stat object.</dd>
 *	</dl>
 */

function MRUCache(config)
{
	this._metric_fn = config.metric;
	this._limit     = config.limit;
	this._meta      = config.meta;
	this._stats     = config.stats ? initStats() : null;

	if (Y.Lang.isFunction(config.stats))
	{
		this._stats_key_meta = config.stats;
	}

	this.clear();
}

function initStats()
{
	return { gets: 0, keys: {} };
}

function initKeyStats(keys, key)
{
	if (!keys[key])
	{
		keys[key] = { puts: 0, gets: 0 };
	}
}

MRUCache.prototype =
{
	/**
	 * Retrieve a value.
	 * 
	 * @param key {String} the key of the object to retrieve
	 * @return {Mixed} the stored object, or undefined if the slot is empty
	 */
	get: function(
		/* string */	key)
	{
		var obj = this._store[key];
		if (obj)
		{
			this._mru.prepend(obj.mru);

			if (this._stats)
			{
				this._stats.gets++;

				initKeyStats(this._stats.keys, key);
				this._stats.keys[key].gets++;
			}

			return obj.data;
		}
	},

	/**
	 * Store a value.
	 * 
	 * @param key {String} the key of the value
	 * @param value {Object} the value to store
	 * @return {boolean} false if the key has already been used
	 */
	put: function(
		/* string */	key,
		/* obj/fn */	value)
	{
		var exists = !Y.Lang.isUndefined(this._store[key]);
		if (exists)
		{
			return false;
		}

		var obj =
		{
			data: value,
			mru:  this._mru.prepend(key)
		};

		if (this._meta)
		{
			obj.meta = this._meta(value);
		}

		this._store[key] = obj;

		this._metric += this._metric_fn(value);
		while (this._metric > this._limit)
		{
			this.remove(this._mru.tail().value);
		}

		if (this._stats)
		{
			initKeyStats(this._stats.keys, key);
			this._stats.keys[key].puts++;

			if (this._stats_key_meta)
			{
				this._stats_key_meta(key, value, this._stats.keys[key]);
			}
		}

		return true;
	},

	/**
	 * Store a value.
	 * 
	 * @param key {String} the key of the value
	 * @param value {Object} the value to store
	 * @return {Mixed} the original value that was in the slot, or undefined if the slot is empty
	 */
	replace: function(
		/* string */	key,
		/* obj/fn */	value)
	{
		var orig = this.remove(key);
		this.put(key, value);
		return orig;
	},

	/**
	 * Remove an value.
	 * 
	 * @param key {String} the key of the value
	 * @return {mixed} the value that was removed, or undefined if the slot was empty
	 */
	remove: function(
		/* string */	key)
	{
		var orig = this._store[key];
		delete this._store[key];
		if (orig)
		{
			this._mru.remove(orig.mru);
			this._metric -= this._metric_fn(orig.data);
			return orig.data;
		}
	},

	/**
	 * Remove all values.
	 */
	clear: function()
	{
		this._store  = {};
		this._mru    = new Y.LinkedList();
		this._metric = 0;
	},

	/**
	 * This resets all the values.
	 *
	 * @return {Object} the current stats
	 */
	dumpStats: function()
	{
		var stats   = this._stats;
		this._stats = initStats();
		return stats;
	}
};

Y.MRUCache = MRUCache;


}, 'gallery-2012.03.23-18-00' ,{requires:['gallery-linkedlist']});
