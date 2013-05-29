"use strict";

/**
 * @module gallery-bulkedit
 */

/**********************************************************************
 * <p>BulkEditDataSource manages a YUI DataSource + diffs (insertions,
 * removals, changes to values).</p>
 * 
 * <p>The YUI DataSource must be immutable, e.g., if it is an XHR
 * datasource, the data must not change.</p>
 * 
 * <p>By using a DataSource, we can support both client-side pagination
 * (all data pre-loaded, best-effort save allowed) and server-side
 * pagination (load data when needed, only all-or-nothing save allowed).
 * Server-side pagination is useful when editing a large amount of existing
 * records or after uploading a large number of new records. (Store the new
 * records in a scratch space, so everything does not have to be sent back
 * to the client after parsing.)  In the case of bulk upload, server-side
 * validation will catch errors in unviewed records.</p>
 * 
 * <p>The responseSchema passed to the YUI DataSource must include a
 * comparator for each field that should not be treated like a string.
 * This comparator can either be 'string' (the default), 'integer',
 * 'decimal', 'boolean', or a function which takes two arguments.</p>
 *
 * @class BulkEdit
 * @namespace DataSource
 * @extends DataSource.Local 
 * @constructor
 * @param config {Object}
 */
function BulkEditDataSource()
{
	BulkEditDataSource.superclass.constructor.apply(this, arguments);
}

BulkEditDataSource.NAME = "bulkEditDataSource";

BulkEditDataSource.ATTRS =
{
	/**
	 * The original data.  This must be immutable, i.e., the values must
	 * not change.
	 * 
	 * @attribute ds
	 * @type {DataSource}
	 * @required
	 * @writeonce
	 */
	ds:
	{
		writeOnce: true
	},

	/**
	 * The function to convert the initial request into a request usable by
	 * the underlying DataSource.  This function takes one argument: state
	 * (startIndex,resultCount,...).
	 * 
	 * @attribute generateRequest
	 * @type {Function}
	 * @required
	 * @writeonce
	 */
	generateRequest:
	{
		validator: Y.Lang.isFunction,
		writeOnce: true
	},

	/**
	 * The name of the key in each record that stores an identifier which
	 * is unique across the entire data set.
	 * 
	 * @attribute uniqueIdKey
	 * @type {String}
	 * @required
	 * @writeonce
	 */
	uniqueIdKey:
	{
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * The function to call to generate a unique id for a new record.  The
	 * default generates "bulk-edit-new-id-#".
	 * 
	 * @attribute generateUniqueId
	 * @type {Function}
	 * @writeonce
	 */
	generateUniqueId:
	{
		value: function()
		{
			idCounter++;
			return uniqueIdPrefix + idCounter;
		},
		validator: Y.Lang.isFunction,
		writeOnce: true
	},

	/**
	 * OGNL expression telling how to extract the startIndex from the
	 * received data, e.g., <code>.meta.startIndex</code>.  If it is not
	 * provided, startIndex is always assumed to be zero.
	 * 
	 * @attribute startIndexExpr
	 * @type {String}
	 * @writeonce
	 */
	startIndexExpr:
	{
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * OGNL expression telling where in the response to store the total
	 * number of records, e.g., <code>.meta.totalRecords</code>.  This is
	 * only appropriate for DataSources that always return the entire data
	 * set.
	 * 
	 * @attribute totalRecordsReturnExpr
	 * @type {String}
	 * @writeonce
	 */
	totalRecordsReturnExpr:
	{
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * The function to call to extract the total number of
	 * records from the response.
	 * 
	 * @attribute extractTotalRecords
	 * @type {Function}
	 * @required
	 * @writeonce
	 */
	extractTotalRecords:
	{
		validator: Y.Lang.isFunction,
		writeOnce: true
	}
};

var uniqueIdPrefix = 'bulk-edit-new-id-',
	idCounter = 0,

	inserted_prefix = 'be-ds-i:',
	inserted_re     = /^be-ds-i:/,
	removed_prefix  = 'be-ds-r:',
	removed_re      = /^be-ds-r:/;

BulkEditDataSource.comparator =
{
	'string': function(a,b)
	{
		return (Y.Lang.trim(a.toString()) === Y.Lang.trim(b.toString()));
	},

	'integer': function(a,b)
	{
		return (parseInt(a,10) === parseInt(b,10));
	},

	'decimal': function(a,b)
	{
		return (parseFloat(a,10) === parseFloat(b,10));
	},

	'boolean': function(a,b)
	{
		return (((a && b) || (!a && !b)) ? true : false);
	}
};

function fromDisplayIndex(
	/* int */ index)
{
	var count = -1;
	for (var i=0; i<this._index.length; i++)
	{
		var j = this._index[i];
		if (!removed_re.test(j))
		{
			count++;
			if (count === index)
			{
				return i;
			}
		}
	}

	return false;
}

function adjustRequest()
{
	var r = this._callback.request;
	this._callback.adjust =
	{
		origStart: r.startIndex,
		origCount: r.resultCount
	};

	if (!this._index)
	{
		return;
	}

	// find index of first record to request

	var start = Math.min(r.startIndex, this._index.length);
	var end   = 0;
	for (var i=0; i<start; i++)
	{
		var j = this._index[i];
		if (!inserted_re.test(j))
		{
			end++;
		}

		if (removed_re.test(j))
		{
			start++;
		}
	}

	r.startIndex = end;

	this._callback.adjust.indexStart = i;

	// adjust number of records to request

	var count = 0;
	while (i < this._index.length && count < this._callback.adjust.origCount)
	{
		var j = this._index[i];
		if (inserted_re.test(j))
		{
			r.resultCount--;
		}

		if (removed_re.test(j))
		{
			r.resultCount++;
		}
		else
		{
			count++;
		}

		i++;
	}

	this._callback.adjust.indexEnd = i;
}

function internalSuccess(e)
{
	if (!e.response || e.error ||
		!Y.Lang.isArray(e.response.results))
	{
		internalFailure.apply(this, arguments);
		return;
	}

	// synch response arrives before setting _tId

	if (!Y.Lang.isUndefined(this._callback._tId) &&
		e.tId !== this._callback._tId)
	{
		return; 	// cancelled request
	}

	this._callback.response = e.response;
	checkFinished.call(this);
}

function internalFailure(e)
{
	if (e.tId === this._callback._tId)
	{
		this._callback.error    = e.error;
		this._callback.response = e.response;
		this.fire('response', this._callback);
	}
}

function checkFinished()
{
	if (this._generatingRequest || !this._callback.response)
	{
		return;
	}

	if (!this._fields)
	{
		this._fields = {};
		Y.Array.each(this.get('ds').schema.get('schema').resultFields, function(value)
		{
			if (Y.Lang.isObject(value))
			{
				this._fields[ value.key ] = value;
			}
		},
		this);
	}

	var response = {};
	Y.mix(response, this._callback.response);
	response.results = [];
	response         = Y.clone(response, true);

	var dataStartIndex = 0;
	if (this.get('startIndexExpr'))
	{
		eval('dataStartIndex=this._callback.response'+this.get('startIndexExpr'));
	}

	var startIndex   = this._callback.request.startIndex - dataStartIndex;
	response.results = this._callback.response.results.slice(startIndex, startIndex + this._callback.request.resultCount);

	// insertions/removals

	if (!this._index)
	{
		if (this.get('totalRecordsReturnExpr'))
		{
			eval('response'+this.get('totalRecordsReturnExpr')+'='+this._callback.response.results.length);
		}
		this._count = this.get('extractTotalRecords')(response);

		this._index = [];
		for (var i=0; i<this._count; i++)
		{
			this._index.push(i);
		}
	}
	else
	{
		var adjust = this._callback.adjust;
		for (var i=adjust.indexStart, k=0; i<adjust.indexEnd; i++, k++)
		{
			var j = this._index[i];
			if (inserted_re.test(j))
			{
				var id = j.substr(inserted_prefix.length);
				response.results.splice(k,0, Y.clone(this._new[id], true));
			}
			else if (removed_re.test(j))
			{
				response.results.splice(k,1);
				k--;
			}
		}
	}

	// save results so we can refer to them later

	var uniqueIdKey = this.get('uniqueIdKey');

	if (!this._callback.request.out_of_band)
	{
		this._records   = [];
		this._recordMap = {};

		Y.Array.each(response.results, function(value)
		{
			var rec = Y.clone(value, true);
			this._records.push(rec);
			this._recordMap[ rec[ uniqueIdKey ] ] = rec;
		},
		this);
	}

	// merge in diffs

	Y.Array.each(response.results, function(rec)
	{
		var diff = this._diff[ rec[ uniqueIdKey ] ];
		if (diff)
		{
			Y.mix(rec, diff, true);
		}
	},
	this);

	this._callback.response = response;
	this.fire('response', this._callback);
}

Y.extend(BulkEditDataSource, Y.DataSource.Local,
{
	initializer: function(config)
	{
		if (!(config.ds instanceof Y.DataSource.Local))
		{
			Y.error('BulkEditDataSource requires DataSource');
		}

		if (!config.generateRequest)
		{
			Y.error('BulkEditDataSource requires generateRequest function');
		}

		if (!config.uniqueIdKey)
		{
			Y.error('BulkEditDataSource requires uniqueIdKey configuration');
		}

		if (!config.extractTotalRecords)
		{
			Y.error('BulkEditDataSource requires extractTotalRecords function');
		}

		this._index = null;
		this._count = 0;
		this._new   = {};
		this._diff  = {};
	},

	/**
	 * @method _dataIsLocal
	 * @protected
	 * @return {boolean} true if the raw data is stored locally
	 */
	_dataIsLocal: function()
	{
		return (Y.Lang.isArray(this.get('ds').get('source')));
	},

	/**
	 * Flush the underlying datasource's cache.
	 * 
	 * @method _flushCache
	 * @protected
	 */
	_flushCache: function()
	{
		var ds = this.get('ds');
		if (ds.cache && Y.Lang.isFunction(ds.cache.flush))
		{
			ds.cache.flush();
		}
	},

	/**
	 * Use this instead of any meta information in response.
	 * 
	 * @method getRecordCount
	 * @return {Number} the total number of records
	 */
	getRecordCount: function()
	{
		return this._count;
	},

	/**
	 * @method getCurrentRecords
	 * @return {Number} the records returned by the latest request
	 */
	getCurrentRecords: function()
	{
		return this._records;
	},

	/**
	 * @method getCurrentRecordMap
	 * @return {Object} the records returned by the latest request, keyed by record id
	 */
	getCurrentRecordMap: function()
	{
		return this._recordMap;
	},

	/**
	 * @method getValue
	 * @param record_index {Number}
	 * @param key {String} field key
	 * @return {mixed} the value of the specified field in the specified record
	 */
	getValue: function(
		/* int */		record_index,
		/* string */	key)
	{
		if (!this._dataIsLocal())
		{
			Y.error('BulkEditDataSource.getValue() can only be called when using a local datasource');
		}

		var j = fromDisplayIndex.call(this, record_index);
		if (j === false)
		{
			return false;
		}

		j = this._index[j];
		if (inserted_re.test(j))
		{
			var record_id = j.substr(inserted_prefix.length);
			var record    = this._new[ record_id ];
		}
		else
		{
			var record    = this.get('ds').get('source')[j];
			var record_id = record[ this.get('uniqueIdKey') ];
		}

		if (this._diff[ record_id ] &&
			!Y.Lang.isUndefined(this._diff[ record_id ][ key ]))
		{
			return this._diff[ record_id ][ key ];
		}
		else
		{
			return record[key];
		}
	},

	/**
	 * When using a remote datasource, this will include changes made to
	 * deleted records.
	 * 
	 * @method getChanges
	 * @return {Object} map of all changed values, keyed by record id
	 */
	getChanges: function()
	{
		return this._diff;
	},

	/**
	 * @method getRemovedRecordIndexes
	 * @return {Array} list of removed record indices, based on initial ordering
	 */
	getRemovedRecordIndexes: function()
	{
		var list = [];
		Y.Array.each(this._index, function(j)
		{
			if (removed_re.test(j))
			{
				list.push(parseInt(j.substr(removed_prefix.length), 10));
			}
		});

		return list;
	},

	/**
	 * You must reload() the widget after calling this function!
	 * 
	 * @method insertRecord
	 * @protected
	 * @param index {Number} insertion index
	 * @param record {Object|String} record to insert or id of record to clone
	 * @return {String} id of newly inserted record
	 */
	insertRecord: function(
		/* int */		index,
		/* object */	record)
	{
		this._count++;

		var record_id = String(this.get('generateUniqueId')());

		this._new[ record_id ]                            = {};
		this._new[ record_id ][ this.get('uniqueIdKey') ] = record_id;

		var j = fromDisplayIndex.call(this, index);
		if (j === false)
		{
			j = this._index.length;
		}
		this._index.splice(j, 0, inserted_prefix+record_id);

		if (record && !Y.Lang.isObject(record))		// clone existing record
		{
			var s    = record.toString();
			record   = Y.clone(this._recordMap[s] || this._new[s], true);
			var diff = this._diff[s];
			if (record && diff)
			{
				Y.mix(record, diff, true);
			}
		}

		if (record)		// insert initial values into _diff
		{
			var uniqueIdKey = this.get('uniqueIdKey');
			Y.Object.each(record, function(value, key)
			{
				if (key != uniqueIdKey)
				{
					this.updateValue(record_id, key, value);
				}
			},
			this);
		}

		return record_id;
	},

	/**
	 * You must reload() the widget after calling this function!
	 * 
	 * @method removeRecord
	 * @protected
	 * @param index {Number} index of record to remove
	 * @return {boolean} true if record was removed
	 */
	removeRecord: function(
		/* int */ index)
	{
		var j = fromDisplayIndex.call(this, index);
		if (j === false)
		{
			return false;
		}

		this._count--;

		if (inserted_re.test(this._index[j]))
		{
			var record_id = this._index[j].substr(inserted_prefix.length);
			delete this._new[ record_id ];
			this._index.splice(j,1);
		}
		else
		{
			if (this._dataIsLocal())
			{
				var record_id = this.get('ds').get('source')[ this._index[j] ][ this.get('uniqueIdKey') ].toString();
			}

			this._index[j] = removed_prefix + this._index[j];
		}

		if (record_id)
		{
			delete this._diff[ record_id ];
		}

		return true;
	},

	/**
	 * Update a value in a record.
	 *
	 * @method updateValue
	 * @protected
	 * @param record_id {String}
	 * @param key {String} field key
	 * @param value {String} new item value
	 */
	updateValue: function(
		/* string */	record_id,
		/* string */	key,
		/* string */	value)
	{
		if (key == this.get('uniqueIdKey'))
		{
			Y.error('BulkEditDataSource.updateValue() does not allow changing the id for a record.  Use BulkEditDataSource.updateRecordId() instead.');
		}

		record_id = record_id.toString();

		var record = this._recordMap[ record_id ];
		if (record && this._getComparator(key)(Y.Lang.isValue(record[key]) ? record[key] : '', Y.Lang.isValue(value) ? value : ''))
		{
			if (this._diff[ record_id ])
			{
				delete this._diff[ record_id ][ key ];
			}
		}
		else	// might be new record
		{
			if (!this._diff[ record_id ])
			{
				this._diff[ record_id ] = {};
			}
			this._diff[ record_id ][ key ] = value;
		}
	},

	/**
	 * @method _getComparator
	 * @protected
	 * @param key {String} field key
	 * @return {Function} comparator function for the given field
	 */
	_getComparator: function(
		/* string */ key)
	{
		var f = (this._fields[key] && this._fields[key].comparator) || 'string';
		if (Y.Lang.isFunction(f))
		{
			return f;
		}
		else if (BulkEditDataSource.comparator[f])
		{
			return BulkEditDataSource.comparator[f];
		}
		else
		{
			return BulkEditDataSource.comparator.string;
		}
	},

	/**
	 * Merge changes into the underlying data, to flush diffs for a record.
	 * Only usable with DataSource.Local.  When using best-effort save on
	 * the server, call this for each record that was successfully saved.
	 *
	 * @method mergeChanges
	 * @param record_id {String}
	 */
	mergeChanges: function(
		/* string */ record_id)
	{
		if (!this._dataIsLocal())
		{
			Y.error('BulkEditDataSource.mergeChanges() can only be called when using a local datasource');
		}

		record_id = record_id.toString();

		function merge(rec)
		{
			if (rec[ this.get('uniqueIdKey') ].toString() === record_id)
			{
				var diff = this._diff[ record_id ];
				if (diff)
				{
					Y.mix(rec, diff, true);
					delete this._diff[ record_id ];
				}
				return true;
			}
		}

		var found = false;
		this._flushCache();

		Y.Array.some(this.get('ds').get('source'), function(value)
		{
			if (merge.call(this, value))
			{
				found = true;
				return true;
			}
		},
		this);

		if (!found)
		{
			Y.Object.some(this._new, function(value)
			{
				if (merge.call(this, value))
				{
					found = true;
					return true;
				}
			},
			this);
		}
	},

	/**
	 * <p>Completely remove a record, from both the display and the
	 * underlying data.  Only usable with DataSource.Local.  When using
	 * best-effort save on the server, call this for each record that was
	 * successfully deleted.</p>
	 * 
	 * <p>You must reload() the widget after calling this function!</p>
	 * 
	 * @method killRecord
	 * @param record_id {String}
	 */
	killRecord: function(
		/* string */ record_id)
	{
		if (!this._dataIsLocal())
		{
			Y.error('BulkEditDataSource.killRecord() can only be called when using a local datasource');
		}

		record_id = record_id.toString();

		function kill(rec)
		{
			if (rec[ this.get('uniqueIdKey') ].toString() === record_id)
			{
				var info = {};
				this.recordIdToIndex(record_id, info);

				var j = this._index[ info.internal_index ];
				this._index.splice(info.internal_index, 1);
				if (!inserted_re.test(j))
				{
					for (var i=info.internal_index; i<this._index.length; i++)
					{
						var k = this._index[i];
						if (removed_re.test(k))
						{
							this._index[i] = removed_prefix +
								(parseInt(k.substr(removed_prefix.length), 10)-1);
						}
						else if (!inserted_re.test(k))
						{
							this._index[i]--;
						}
					}
				}

				this._count--;
				delete this._diff[ record_id ];
				return true;
			}
		}

		var found = false;
		this._flushCache();

		var data = this.get('ds').get('source');
		Y.Array.some(data, function(value, i)
		{
			if (kill.call(this, value))
			{
				data.splice(i,1);
				found = true;
				return true;
			}
		},
		this);

		if (!found)
		{
			Y.Object.some(this._new, function(value, id)
			{
				if (kill.call(this, value))
				{
					delete this._new[id];
					found = true;
					return true;
				}
			},
			this);
		}
	},

	/**
	 * <p>Change the id of a record.  Only usable with DataSource.Local.
	 * When using best-effort save on the server, call this for each newly
	 * created record that was successfully saved.</p>
	 * 
	 * <p>You must reload() the widget after calling this function!</p>
	 * 
	 * @method updateRecordId
	 * @param orig_record_id {String}
	 * @param new_record_id {String}
	 */
	updateRecordId: function(
		/* string */	orig_record_id,
		/* string */	new_record_id)
	{
		if (!this._dataIsLocal())
		{
			Y.error('BulkEditDataSource.updateRecordId() can only be called when using a local datasource');
		}

		orig_record_id = orig_record_id.toString();
		new_record_id  = new_record_id.toString();

		function update(rec)
		{
			if (rec[ this.get('uniqueIdKey') ].toString() === orig_record_id)
			{
				var info = {};
				this.recordIdToIndex(orig_record_id, info);
				var j = info.internal_index;
				if (inserted_re.test(this._index[j]))
				{
					this._index[j] = inserted_prefix + new_record_id;
				}

				rec[ this.get('uniqueIdKey') ] = new_record_id;
				if (this._diff[ orig_record_id ])
				{
					this._diff[ new_record_id ] = this._diff[ orig_record_id ];
					delete this._diff[ orig_record_id ];
				}
				return true;
			}
		}

		var found = false;
		this._flushCache();

		Y.Array.some(this.get('ds').get('source'), function(value)
		{
			if (update.call(this, value))
			{
				found = true;
				return true;
			}
		},
		this);

		if (!found)
		{
			Y.Object.some(this._new, function(value, id)
			{
				if (update.call(this, value))
				{
					this._new[ new_record_id ] = value;
					delete this._new[id];
					found = true;
					return true;
				}
			},
			this);
		}
	},

	/**
	 * Find the index of the given record id.  Only usable with
	 * DataSource.Local.
	 * 
	 * @method recordIdToIndex
	 * @param record_id {String}
	 * @return {Number} index or record or -1 if not found
	 */
	recordIdToIndex: function(
		/* string */	record_id,
		/* object */	return_info)
	{
		if (!this._dataIsLocal())
		{
			Y.error('BulkEditDataSource.recordIdToIndex() can only be called when using a local datasource');
		}

		record_id = record_id.toString();

		var records = this.get('ds').get('source');
		var count   = 0;
		for (var i=0; i<this._index.length; i++)
		{
			var j   = this._index[i];
			var ins = inserted_re.test(j);
			var del = removed_re.test(j);
			if ((ins &&
				 j.substr(inserted_prefix.length) === record_id) ||
				(!ins && !del &&
				 records[j][ this.get('uniqueIdKey') ].toString() === record_id))
			{
				if (return_info)
				{
					return_info.internal_index = i;
				}
				return count;
			}

			if (!del)
			{
				count++;
			}
		}

		return -1;
	},

	/**
	 * Merges edits into data and returns result.
	 * 
	 * @method _defRequestFn
	 * @protected
	 */
	_defRequestFn: function(e)
	{
		this._callback = e;
		adjustRequest.call(this);

		this._generatingRequest = true;

		this._callback._tId = this.get('ds').sendRequest(
		{
			request: this.get('generateRequest')(this._callback.request),
			callback:
			{
				success: Y.bind(internalSuccess, this),
				failure: Y.bind(internalFailure, this)
			}
		});

		this._generatingRequest = false;
		checkFinished.call(this);
	}
});

Y.BulkEditDataSource = BulkEditDataSource;
Y.namespace('DataSource').BulkEdit = BulkEditDataSource;
