if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/build/gallery-bulkedit/gallery-bulkedit.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-bulkedit/gallery-bulkedit.js",
    code: []
};
_yuitest_coverage["/build/gallery-bulkedit/gallery-bulkedit.js"].code=["YUI.add('gallery-bulkedit', function(Y) {","","\"use strict\";","","/**"," * @module gallery-bulkedit"," */","","/**********************************************************************"," * <p>BulkEditDataSource manages a YUI DataSource + diffs (insertions,"," * removals, changes to values).</p>"," * "," * <p>The YUI DataSource must be immutable, e.g., if it is an XHR"," * datasource, the data must not change.</p>"," * "," * <p>By using a DataSource, we can support both client-side pagination"," * (all data pre-loaded, best-effort save allowed) and server-side"," * pagination (load data when needed, only all-or-nothing save allowed)."," * Server-side pagination is useful when editing a large amount of existing"," * records or after uploading a large number of new records. (Store the new"," * records in a scratch space, so everything does not have to be sent back"," * to the client after parsing.)  In the case of bulk upload, server-side"," * validation will catch errors in unviewed records.</p>"," * "," * <p>The responseSchema passed to the YUI DataSource must include a"," * comparator for each field that should not be treated like a string."," * This comparator can either be 'string' (the default), 'integer',"," * 'decimal', 'boolean', or a function which takes two arguments.</p>"," *"," * @class BulkEdit"," * @namespace DataSource"," * @extends DataSource.Local "," * @constructor"," * @param config {Object}"," */","function BulkEditDataSource()","{","	BulkEditDataSource.superclass.constructor.apply(this, arguments);","}","","BulkEditDataSource.NAME = \"bulkEditDataSource\";","","BulkEditDataSource.ATTRS =","{","	/**","	 * The original data.  This must be immutable, i.e., the values must","	 * not change.","	 * ","	 * @attribute ds","	 * @type {DataSource}","	 * @required","	 * @writeonce","	 */","	ds:","	{","		writeOnce: true","	},","","	/**","	 * The function to convert the initial request into a request usable by","	 * the underlying DataSource.  This function takes one argument: state","	 * (startIndex,resultCount,...).","	 * ","	 * @attribute generateRequest","	 * @type {Function}","	 * @required","	 * @writeonce","	 */","	generateRequest:","	{","		validator: Y.Lang.isFunction,","		writeOnce: true","	},","","	/**","	 * The name of the key in each record that stores an identifier which","	 * is unique across the entire data set.","	 * ","	 * @attribute uniqueIdKey","	 * @type {String}","	 * @required","	 * @writeonce","	 */","	uniqueIdKey:","	{","		validator: Y.Lang.isString,","		writeOnce: true","	},","","	/**","	 * The function to call to generate a unique id for a new record.  The","	 * default generates \"bulk-edit-new-id-#\".","	 * ","	 * @attribute generateUniqueId","	 * @type {Function}","	 * @writeonce","	 */","	generateUniqueId:","	{","		value: function()","		{","			idCounter++;","			return uniqueIdPrefix + idCounter;","		},","		validator: Y.Lang.isFunction,","		writeOnce: true","	},","","	/**","	 * OGNL expression telling how to extract the startIndex from the","	 * received data, e.g., <code>.meta.startIndex</code>.  If it is not","	 * provided, startIndex is always assumed to be zero.","	 * ","	 * @attribute startIndexExpr","	 * @type {String}","	 * @writeonce","	 */","	startIndexExpr:","	{","		validator: Y.Lang.isString,","		writeOnce: true","	},","","	/**","	 * OGNL expression telling where in the response to store the total","	 * number of records, e.g., <code>.meta.totalRecords</code>.  This is","	 * only appropriate for DataSources that always return the entire data","	 * set.","	 * ","	 * @attribute totalRecordsReturnExpr","	 * @type {String}","	 * @writeonce","	 */","	totalRecordsReturnExpr:","	{","		validator: Y.Lang.isString,","		writeOnce: true","	},","","	/**","	 * The function to call to extract the total number of","	 * records from the response.","	 * ","	 * @attribute extractTotalRecords","	 * @type {Function}","	 * @required","	 * @writeonce","	 */","	extractTotalRecords:","	{","		validator: Y.Lang.isFunction,","		writeOnce: true","	}","};","","var uniqueIdPrefix = 'bulk-edit-new-id-',","	idCounter = 0,","","	inserted_prefix = 'be-ds-i:',","	inserted_re     = /^be-ds-i:/,","	removed_prefix  = 'be-ds-r:',","	removed_re      = /^be-ds-r:/;","","BulkEditDataSource.comparator =","{","	'string': function(a,b)","	{","		return (Y.Lang.trim(a.toString()) === Y.Lang.trim(b.toString()));","	},","","	'integer': function(a,b)","	{","		return (parseInt(a,10) === parseInt(b,10));","	},","","	'decimal': function(a,b)","	{","		return (parseFloat(a,10) === parseFloat(b,10));","	},","","	'boolean': function(a,b)","	{","		return (((a && b) || (!a && !b)) ? true : false);","	}","};","","function fromDisplayIndex(","	/* int */ index)","{","	var count = -1;","	for (var i=0; i<this._index.length; i++)","	{","		var j = this._index[i];","		if (!removed_re.test(j))","		{","			count++;","			if (count === index)","			{","				return i;","			}","		}","	}","","	return false;","}","","function adjustRequest()","{","	var r = this._callback.request;","	this._callback.adjust =","	{","		origStart: r.startIndex,","		origCount: r.resultCount","	};","","	if (!this._index)","	{","		return;","	}","","	// find index of first record to request","","	var start = Math.min(r.startIndex, this._index.length);","	var end   = 0;","	for (var i=0; i<start; i++)","	{","		var j = this._index[i];","		if (!inserted_re.test(j))","		{","			end++;","		}","","		if (removed_re.test(j))","		{","			start++;","		}","	}","","	r.startIndex = end;","","	this._callback.adjust.indexStart = i;","","	// adjust number of records to request","","	var count = 0;","	while (i < this._index.length && count < this._callback.adjust.origCount)","	{","		var j = this._index[i];","		if (inserted_re.test(j))","		{","			r.resultCount--;","		}","","		if (removed_re.test(j))","		{","			r.resultCount++;","		}","		else","		{","			count++;","		}","","		i++;","	}","","	this._callback.adjust.indexEnd = i;","}","","function internalSuccess(e)","{","	if (!e.response || e.error ||","		!Y.Lang.isArray(e.response.results))","	{","		internalFailure.apply(this, arguments);","		return;","	}","","	// synch response arrives before setting _tId","","	if (!Y.Lang.isUndefined(this._callback._tId) &&","		e.tId !== this._callback._tId)","	{","		return; 	// cancelled request","	}","","	this._callback.response = e.response;","	checkFinished.call(this);","}","","function internalFailure(e)","{","	if (e.tId === this._callback._tId)","	{","		this._callback.error    = e.error;","		this._callback.response = e.response;","		this.fire('response', this._callback);","	}","}","","function checkFinished()","{","	if (this._generatingRequest || !this._callback.response)","	{","		return;","	}","","	if (!this._fields)","	{","		this._fields = {};","		Y.Array.each(this.get('ds').schema.get('schema').resultFields, function(value)","		{","			if (Y.Lang.isObject(value))","			{","				this._fields[ value.key ] = value;","			}","		},","		this);","	}","","	var response = {};","	Y.mix(response, this._callback.response);","	response.results = [];","	response         = Y.clone(response, true);","","	var dataStartIndex = 0;","	if (this.get('startIndexExpr'))","	{","		eval('dataStartIndex=this._callback.response'+this.get('startIndexExpr'));","	}","","	var startIndex   = this._callback.request.startIndex - dataStartIndex;","	response.results = this._callback.response.results.slice(startIndex, startIndex + this._callback.request.resultCount);","","	// insertions/removals","","	if (!this._index)","	{","		if (this.get('totalRecordsReturnExpr'))","		{","			eval('response'+this.get('totalRecordsReturnExpr')+'='+this._callback.response.results.length);","		}","		this._count = this.get('extractTotalRecords')(response);","","		this._index = [];","		for (var i=0; i<this._count; i++)","		{","			this._index.push(i);","		}","	}","	else","	{","		var adjust = this._callback.adjust;","		for (var i=adjust.indexStart, k=0; i<adjust.indexEnd; i++, k++)","		{","			var j = this._index[i];","			if (inserted_re.test(j))","			{","				var id = j.substr(inserted_prefix.length);","				response.results.splice(k,0, Y.clone(this._new[id], true));","			}","			else if (removed_re.test(j))","			{","				response.results.splice(k,1);","				k--;","			}","		}","	}","","	// save results so we can refer to them later","","	this._records   = [];","	this._recordMap = {};","	var uniqueIdKey = this.get('uniqueIdKey');","","	Y.Array.each(response.results, function(value)","	{","		var rec = Y.clone(value, true);","		this._records.push(rec);","		this._recordMap[ rec[ uniqueIdKey ] ] = rec;","	},","	this);","","	// merge in diffs","","	Y.Array.each(response.results, function(rec)","	{","		var diff = this._diff[ rec[ uniqueIdKey ] ];","		if (diff)","		{","			Y.mix(rec, diff, true);","		}","	},","	this);","","	this._callback.response = response;","	this.fire('response', this._callback);","}","","Y.extend(BulkEditDataSource, Y.DataSource.Local,","{","	initializer: function(config)","	{","		if (!(config.ds instanceof Y.DataSource.Local))","		{","			Y.error('BulkEditDataSource requires DataSource');","		}","","		if (!config.generateRequest)","		{","			Y.error('BulkEditDataSource requires generateRequest function');","		}","","		if (!config.uniqueIdKey)","		{","			Y.error('BulkEditDataSource requires uniqueIdKey configuration');","		}","","		if (!config.extractTotalRecords)","		{","			Y.error('BulkEditDataSource requires extractTotalRecords function');","		}","","		this._index = null;","		this._count = 0;","		this._new   = {};","		this._diff  = {};","	},","","	/**","	 * @method _dataIsLocal","	 * @protected","	 * @return {boolean} true if the raw data is stored locally","	 */","	_dataIsLocal: function()","	{","		return (Y.Lang.isArray(this.get('ds').get('source')));","	},","","	/**","	 * Flush the underlying datasource's cache.","	 * ","	 * @method _flushCache","	 * @protected","	 */","	_flushCache: function()","	{","		var ds = this.get('ds');","		if (ds.cache && Y.Lang.isFunction(ds.cache.flush))","		{","			ds.cache.flush();","		}","	},","","	/**","	 * Use this instead of any meta information in response.","	 * ","	 * @method getRecordCount","	 * @return {Number} the total number of records","	 */","	getRecordCount: function()","	{","		return this._count;","	},","","	/**","	 * @method getCurrentRecords","	 * @return {Number} the records returned by the latest request","	 */","	getCurrentRecords: function()","	{","		return this._records;","	},","","	/**","	 * @method getCurrentRecordMap","	 * @return {Object} the records returned by the latest request, keyed by record id","	 */","	getCurrentRecordMap: function()","	{","		return this._recordMap;","	},","","	/**","	 * @method getValue","	 * @param record_index {Number}","	 * @param key {String} field key","	 * @return {mixed} the value of the specified field in the specified record","	 */","	getValue: function(","		/* int */		record_index,","		/* string */	key)","	{","		if (!this._dataIsLocal())","		{","			Y.error('BulkEditDataSource.getValue() can only be called when using a local datasource');","		}","","		var j = fromDisplayIndex.call(this, record_index);","		if (j === false)","		{","			return false;","		}","","		j = this._index[j];","		if (inserted_re.test(j))","		{","			var record_id = j.substr(inserted_prefix.length);","			var record    = this._new[ record_id ];","		}","		else","		{","			var record    = this.get('ds').get('source')[j];","			var record_id = record[ this.get('uniqueIdKey') ];","		}","","		if (this._diff[ record_id ] &&","			!Y.Lang.isUndefined(this._diff[ record_id ][ key ]))","		{","			return this._diff[ record_id ][ key ];","		}","		else","		{","			return record[key];","		}","	},","","	/**","	 * When using a remote datasource, this will include changes made to","	 * deleted records.","	 * ","	 * @method getChanges","	 * @return {Object} map of all changed values, keyed by record id","	 */","	getChanges: function()","	{","		return this._diff;","	},","","	/**","	 * @method getRemovedRecordIndexes","	 * @return {Array} list of removed record indices, based on initial ordering","	 */","	getRemovedRecordIndexes: function()","	{","		var list = [];","		Y.Array.each(this._index, function(j)","		{","			if (removed_re.test(j))","			{","				list.push(parseInt(j.substr(removed_prefix.length), 10));","			}","		});","","		return list;","	},","","	/**","	 * You must reload() the widget after calling this function!","	 * ","	 * @method insertRecord","	 * @protected","	 * @param index {Number} insertion index","	 * @param record {Object|String} record to insert or id of record to clone","	 * @return {String} id of newly inserted record","	 */","	insertRecord: function(","		/* int */		index,","		/* object */	record)","	{","		this._count++;","","		var record_id = String(this.get('generateUniqueId')());","","		this._new[ record_id ]                            = {};","		this._new[ record_id ][ this.get('uniqueIdKey') ] = record_id;","","		var j = fromDisplayIndex.call(this, index);","		if (j === false)","		{","			j = this._index.length;","		}","		this._index.splice(j, 0, inserted_prefix+record_id);","","		if (record && !Y.Lang.isObject(record))		// clone existing record","		{","			var s    = record.toString();","			record   = Y.clone(this._recordMap[s] || this._new[s], true);","			var diff = this._diff[s];","			if (record && diff)","			{","				Y.mix(record, diff, true);","			}","		}","","		if (record)		// insert initial values into _diff","		{","			var uniqueIdKey = this.get('uniqueIdKey');","			Y.Object.each(record, function(value, key)","			{","				if (key != uniqueIdKey)","				{","					this.updateValue(record_id, key, value);","				}","			},","			this);","		}","","		return record_id;","	},","","	/**","	 * You must reload() the widget after calling this function!","	 * ","	 * @method removeRecord","	 * @protected","	 * @param index {Number} index of record to remove","	 * @return {boolean} true if record was removed","	 */","	removeRecord: function(","		/* int */ index)","	{","		var j = fromDisplayIndex.call(this, index);","		if (j === false)","		{","			return false;","		}","","		this._count--;","","		if (inserted_re.test(this._index[j]))","		{","			var record_id = this._index[j].substr(inserted_prefix.length);","			delete this._new[ record_id ];","			this._index.splice(j,1);","		}","		else","		{","			if (this._dataIsLocal())","			{","				var record_id = this.get('ds').get('source')[ this._index[j] ][ this.get('uniqueIdKey') ].toString();","			}","","			this._index[j] = removed_prefix + this._index[j];","		}","","		if (record_id)","		{","			delete this._diff[ record_id ];","		}","","		return true;","	},","","	/**","	 * Update a value in a record.","	 *","	 * @method updateValue","	 * @protected","	 * @param record_id {String}","	 * @param key {String} field key","	 * @param value {String} new item value","	 */","	updateValue: function(","		/* string */	record_id,","		/* string */	key,","		/* string */	value)","	{","		if (key == this.get('uniqueIdKey'))","		{","			Y.error('BulkEditDataSource.updateValue() does not allow changing the id for a record.  Use BulkEditDataSource.updateRecordId() instead.');","		}","","		record_id = record_id.toString();","","		var record = this._recordMap[ record_id ];","		if (record && this._getComparator(key)(Y.Lang.isValue(record[key]) ? record[key] : '', Y.Lang.isValue(value) ? value : ''))","		{","			if (this._diff[ record_id ])","			{","				delete this._diff[ record_id ][ key ];","			}","		}","		else	// might be new record","		{","			if (!this._diff[ record_id ])","			{","				this._diff[ record_id ] = {};","			}","			this._diff[ record_id ][ key ] = value;","		}","	},","","	/**","	 * @method _getComparator","	 * @protected","	 * @param key {String} field key","	 * @return {Function} comparator function for the given field","	 */","	_getComparator: function(","		/* string */ key)","	{","		var f = (this._fields[key] && this._fields[key].comparator) || 'string';","		if (Y.Lang.isFunction(f))","		{","			return f;","		}","		else if (BulkEditDataSource.comparator[f])","		{","			return BulkEditDataSource.comparator[f];","		}","		else","		{","			return BulkEditDataSource.comparator.string;","		}","	},","","	/**","	 * Merge changes into the underlying data, to flush diffs for a record.","	 * Only usable with DataSource.Local.  When using best-effort save on","	 * the server, call this for each record that was successfully saved.","	 *","	 * @method mergeChanges","	 * @param record_id {String}","	 */","	mergeChanges: function(","		/* string */ record_id)","	{","		if (!this._dataIsLocal())","		{","			Y.error('BulkEditDataSource.mergeChanges() can only be called when using a local datasource');","		}","","		record_id = record_id.toString();","","		function merge(rec)","		{","			if (rec[ this.get('uniqueIdKey') ].toString() === record_id)","			{","				var diff = this._diff[ record_id ];","				if (diff)","				{","					Y.mix(rec, diff, true);","					delete this._diff[ record_id ];","				}","				return true;","			}","		}","","		var found = false;","		this._flushCache();","","		Y.Array.some(this.get('ds').get('source'), function(value)","		{","			if (merge.call(this, value))","			{","				found = true;","				return true;","			}","		},","		this);","","		if (!found)","		{","			Y.Object.some(this._new, function(value)","			{","				if (merge.call(this, value))","				{","					found = true;","					return true;","				}","			},","			this);","		}","	},","","	/**","	 * <p>Completely remove a record, from both the display and the","	 * underlying data.  Only usable with DataSource.Local.  When using","	 * best-effort save on the server, call this for each record that was","	 * successfully deleted.</p>","	 * ","	 * <p>You must reload() the widget after calling this function!</p>","	 * ","	 * @method killRecord","	 * @param record_id {String}","	 */","	killRecord: function(","		/* string */ record_id)","	{","		if (!this._dataIsLocal())","		{","			Y.error('BulkEditDataSource.killRecord() can only be called when using a local datasource');","		}","","		record_id = record_id.toString();","","		function kill(rec)","		{","			if (rec[ this.get('uniqueIdKey') ].toString() === record_id)","			{","				var info = {};","				this.recordIdToIndex(record_id, info);","","				var j = this._index[ info.internal_index ];","				this._index.splice(info.internal_index, 1);","				if (!inserted_re.test(j))","				{","					for (var i=info.internal_index; i<this._index.length; i++)","					{","						var k = this._index[i];","						if (removed_re.test(k))","						{","							this._index[i] = removed_prefix +","								(parseInt(k.substr(removed_prefix.length), 10)-1);","						}","						else if (!inserted_re.test(k))","						{","							this._index[i]--;","						}","					}","				}","","				this._count--;","				delete this._diff[ record_id ];","				return true;","			}","		}","","		var found = false;","		this._flushCache();","","		var data = this.get('ds').get('source');","		Y.Array.some(data, function(value, i)","		{","			if (kill.call(this, value))","			{","				data.splice(i,1);","				found = true;","				return true;","			}","		},","		this);","","		if (!found)","		{","			Y.Object.some(this._new, function(value, id)","			{","				if (kill.call(this, value))","				{","					delete this._new[id];","					found = true;","					return true;","				}","			},","			this);","		}","	},","","	/**","	 * <p>Change the id of a record.  Only usable with DataSource.Local.","	 * When using best-effort save on the server, call this for each newly","	 * created record that was successfully saved.</p>","	 * ","	 * <p>You must reload() the widget after calling this function!</p>","	 * ","	 * @method updateRecordId","	 * @param orig_record_id {String}","	 * @param new_record_id {String}","	 */","	updateRecordId: function(","		/* string */	orig_record_id,","		/* string */	new_record_id)","	{","		if (!this._dataIsLocal())","		{","			Y.error('BulkEditDataSource.updateRecordId() can only be called when using a local datasource');","		}","","		orig_record_id = orig_record_id.toString();","		new_record_id  = new_record_id.toString();","","		function update(rec)","		{","			if (rec[ this.get('uniqueIdKey') ].toString() === orig_record_id)","			{","				var info = {};","				this.recordIdToIndex(orig_record_id, info);","				var j = info.internal_index;","				if (inserted_re.test(this._index[j]))","				{","					this._index[j] = inserted_prefix + new_record_id;","				}","","				rec[ this.get('uniqueIdKey') ] = new_record_id;","				if (this._diff[ orig_record_id ])","				{","					this._diff[ new_record_id ] = this._diff[ orig_record_id ];","					delete this._diff[ orig_record_id ];","				}","				return true;","			}","		}","","		var found = false;","		this._flushCache();","","		Y.Array.some(this.get('ds').get('source'), function(value)","		{","			if (update.call(this, value))","			{","				found = true;","				return true;","			}","		},","		this);","","		if (!found)","		{","			Y.Object.some(this._new, function(value, id)","			{","				if (update.call(this, value))","				{","					this._new[ new_record_id ] = value;","					delete this._new[id];","					found = true;","					return true;","				}","			},","			this);","		}","	},","","	/**","	 * Find the index of the given record id.  Only usable with","	 * DataSource.Local.","	 * ","	 * @method recordIdToIndex","	 * @param record_id {String}","	 * @return {Number} index or record or -1 if not found","	 */","	recordIdToIndex: function(","		/* string */	record_id,","		/* object */	return_info)","	{","		if (!this._dataIsLocal())","		{","			Y.error('BulkEditDataSource.recordIdToIndex() can only be called when using a local datasource');","		}","","		record_id = record_id.toString();","","		var records = this.get('ds').get('source');","		var count   = 0;","		for (var i=0; i<this._index.length; i++)","		{","			var j   = this._index[i];","			var ins = inserted_re.test(j);","			var del = removed_re.test(j);","			if ((ins &&","				 j.substr(inserted_prefix.length) === record_id) ||","				(!ins && !del &&","				 records[j][ this.get('uniqueIdKey') ].toString() === record_id))","			{","				if (return_info)","				{","					return_info.internal_index = i;","				}","				return count;","			}","","			if (!del)","			{","				count++;","			}","		}","","		return -1;","	},","","	/**","	 * Merges edits into data and returns result.","	 * ","	 * @method _defRequestFn","	 * @protected","	 */","	_defRequestFn: function(e)","	{","		this._callback = e;","		adjustRequest.call(this);","","		this._generatingRequest = true;","","		this._callback._tId = this.get('ds').sendRequest(","		{","			request: this.get('generateRequest')(this._callback.request),","			callback:","			{","				success: Y.bind(internalSuccess, this),","				failure: Y.bind(internalFailure, this)","			}","		});","","		this._generatingRequest = false;","		checkFinished.call(this);","	}","});","","Y.BulkEditDataSource = BulkEditDataSource;","Y.namespace('DataSource').BulkEdit = BulkEditDataSource;","/**********************************************************************"," * A widget for editing many records at once."," *"," * @module gallery-bulkedit"," * @main gallery-bulkedit"," */","","/**"," * <p>BulkEditor provides the basic structure for editing all the records"," * in a BulkEditDataSource.  The fields for editing a record are rendered"," * into a \"row\".  This could be a div, a tbody, or something else.</p>"," * "," * <p>All event handlers must be placed on the container, not individual"," * DOM elements.</p>"," * "," * <p>Errors must be returned from the server in the order in which records"," * are displayed.  Because of this, when data is sent to the server:</p>"," * <ul>"," * <li>If the server knows the ordering, you can send the diffs.  (Diffs are an unordered map, keyed on the record id.)</li>"," * <li>If the server doesn't know the ordering, you must send all the data.</li>"," * </ul>"," *"," * @class BulkEditor"," * @extends Widget"," * @constructor"," * @param config {Object}"," */","function BulkEditor()","{","	BulkEditor.superclass.constructor.apply(this, arguments);","}","","BulkEditor.NAME = \"bulkedit\";","","BulkEditor.ATTRS =","{","	/**","	 * @attribute ds","	 * @type {DataSource.BulkEdit}","	 * @required","	 * @writeonce","	 */","	ds:","	{","		validator: function(value)","		{","			return (value instanceof BulkEditDataSource);","		},","		writeOnce: true","	},","","	/**","	 * Configuration for each field: type (input|select|textarea), label,","	 * validation (css, regex, msg, fn; see","	 * gallery-formmgr-css-validation).  Derived classes can require","	 * additional keys.","	 *","	 * @attribute fields","	 * @type {Object}","	 * @required","	 * @writeonce","	 */","	fields:","	{","		validator: Y.Lang.isObject,","		writeOnce: true","	},","","	/**","	 * Paginator for switching between pages of records.  BulkEditor","	 * expects it to be configured to display ValidationPageLinks, so the","	 * user can see which pages have errors that need to be fixed.","	 *","	 * @attribute paginator","	 * @type {Paginator}","	 * @writeonce","	 */","	paginator:","	{","		validator: function(value)","		{","			return (value instanceof Y.Paginator);","		},","		writeOnce: true","	},","","	/**","	 * Extra key/value pairs to pass in the DataSource request.","	 * ","	 * @attribute requestExtra","	 * @type {Object}","	 * @writeonce","	 */","	requestExtra:","	{","		value:     {},","		validator: Y.Lang.isObject,","		writeOnce: true","	},","","	/**","	 * CSS class used to temporarily highlight a record.","	 *","	 * @attribute pingClass","	 * @type {String}","	 * @default \"yui3-bulkedit-ping\"","	 */","	pingClass:","	{","		value:     Y.ClassNameManager.getClassName(BulkEditor.NAME, 'ping'),","		validator: Y.Lang.isString","	},","","	/**","	 * Duration in seconds that pingClass is applied to a record.","	 *","	 * @attribute pingTimeout","	 * @type {Number}","	 * @default 2","	 */","	pingTimeout:","	{","		value:     2,","		validator: Y.Lang.isNumber","	}","};","","/**"," * @event notifyErrors"," * @description Fired when widget-level validation messages need to be displayed."," * @param msgs {Array} the messages to display"," */","/**"," * @event clearErrorNotification"," * @description Fired when widget-level validation messages should be cleared."," */","/**"," * @event pageRendered"," * @description Fired every time after the editor has rendered a page."," */","","var default_page_size = 1e9,","","	id_prefix = 'bulk-editor',","	id_separator = '__',","	id_regex = new RegExp('^' + id_prefix + id_separator + '(.+?)(?:' + id_separator + '(.+?))?$'),","","	status_prefix  = 'bulkedit-has',","	status_pattern = status_prefix + '([a-z]+)',","	status_re      = new RegExp(Y.Node.class_re_prefix + status_pattern + Y.Node.class_re_suffix),","","	record_status_prefix  = 'bulkedit-hasrecord',","	record_status_pattern = record_status_prefix + '([a-z]+)',","	record_status_re      = new RegExp(Y.Node.class_re_prefix + record_status_pattern + Y.Node.class_re_suffix),","","	message_container_class = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'message-text'),","","	perl_flags_regex = /^\\(\\?([a-z]+)\\)/;","","BulkEditor.record_container_class     = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'bd');","BulkEditor.record_msg_container_class = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'record-message-container');","","BulkEditor.field_container_class        = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'field-container');","BulkEditor.field_container_class_prefix = BulkEditor.field_container_class + '-';","BulkEditor.field_class_prefix           = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'field') + '-';","","function switchPage(state)","{","	this.saveChanges();","","	var pg = this.get('paginator');","	pg.setTotalRecords(state.totalRecords, true);","	pg.setStartIndex(state.recordOffset, true);","	pg.setRowsPerPage(state.rowsPerPage, true);","	pg.setPage(state.page, true);","	this._updatePageStatus();","	this.reload();","}","","Y.extend(BulkEditor, Y.Widget,","{","	initializer: function(config)","	{","		if (config.paginator)","		{","			config.paginator.on('changeRequest', switchPage, this);","		}","	},","","	renderUI: function()","	{","		this.clearServerErrors();","		this.reload();","	},","","	bindUI: function()","	{","		this._attachEvents(this.get('contentBox'));","	},","","	/**","	 * Attaches events to the container.","	 *","	 * @method _attachEvents","	 * @param container {Node} node to which events should be attached","	 * @protected","	 */","	_attachEvents: function(","		/* node */	container)","	{","		Y.delegate('bulkeditor|click', handleCheckboxMultiselect, container, '.checkbox-multiselect input', this);","	},","","	/**","	 * Reloads the current page of records.  This will erase any changes","	 * unsaved changes!","	 * ","	 * @method reload","	 */","	reload: function()","	{","		if (!this.busy)","		{","			this.plug(Y.Plugin.BusyOverlay);","		}","		this.busy.show();","","		var pg = this.get('paginator');","		var request =","		{","			startIndex:  pg ? pg.getStartIndex() : 0,","			resultCount: pg ? pg.getRowsPerPage() : default_page_size","		};","		Y.mix(request, this.get('requestExtra'));","","		var ds = this.get('ds');","		ds.sendRequest(","		{","			request: request,","			callback:","			{","				success: Y.bind(function(e)","				{","					this.busy.hide();","					if (pg && pg.getStartIndex() >= ds.getRecordCount())","					{","						pg.setPage(pg.getPreviousPage());","						return;","					}","","					this._render(e.response);","					this._updatePaginator(e.response);","					this.scroll_to_index = -1;","				},","				this),","","				failure: Y.bind(function()","				{","","					this.busy.hide();","					this.scroll_to_index = -1;","				},","				this)","			}","		});","	},","","	/**","	 * Save the modified values from the current page of records.","	 * ","	 * @method saveChanges","	 */","	saveChanges: function()","	{","		var ds      = this.get('ds');","		var records = ds.getCurrentRecords();","		var id_key  = ds.get('uniqueIdKey');","		Y.Object.each(this.get('fields'), function(field, key)","		{","			Y.Array.each(records, function(r)","			{","				var node = this.getFieldElement(r, key),","					tag  = node.get('tagName').toLowerCase(),","					value;","				if (tag == 'input' && node.get('type').toLowerCase() == 'checkbox')","				{","					value = node.get('checked') ? field.values.on : field.values.off;","				}","				else if (tag == 'select' && node.get('multiple'))","				{","					value = Y.reduce(Y.Node.getDOMNode(node).options, [], function(v, o)","					{","						if (o.selected)","						{","							v.push(o.value);","						}","						return v;","					});","				}","				else","				{","					value = node.get('value');","				}","","				ds.updateValue(r[ id_key ], key, value);","			},","			this);","		},","		this);","	},","","	/**","	 * Retrieve *all* the data.  Do not call this if you use server-side","	 * pagination.","	 * ","	 * @method getAllValues","	 * @param callback {Object} callback object which will be invoked by DataSource","	 */","	getAllValues: function(callback)","	{","		var request =","		{","			startIndex:  0,","			resultCount: this.get('ds').getRecordCount()","		};","		Y.mix(request, this.get('requestExtra'));","","		this.get('ds').sendRequest(","		{","			request:  request,","			callback: callback","		});","	},","","	/**","	 * @method getChanges","	 * @return {Object} map of all changed values, keyed by record id","	 */","	getChanges: function()","	{","		return this.get('ds').getChanges();","	},","","	/**","	 * <p>Insert a new record.</p>","	 * ","	 * <p>You must reload() the widget after calling this function!</p>","	 * ","	 * @method insertRecord","	 * @param index {Number} insertion index","	 * @param record {Object|String} record to insert or id of record to clone","	 * @return {String} the new record's id","	 */","	insertRecord: function(","		/* int */		index,","		/* object */	record)","	{","		var record_id = this.get('ds').insertRecord(index, record);","		if (index <= this.server_errors.records.length)","		{","			this.server_errors.records.splice(index,0, { id: record_id });","			// leave entry in record_map undefined","			this._updatePageStatus();","		}","		return record_id;","	},","","	/**","	 * <p>Remove a record.  The removal will be recorded in the diffs.","	 * There is no way to un-remove a record, so if you need that","	 * functionality, you may want to use highlighting to indicate removed","	 * records instead.</p>","	 * ","	 * <p>You must reload() the widget after calling this function!</p>","	 * ","	 * @method removeRecord","	 * @param index {Number}","	 * @return {Boolean} true if the record was successfully removed","	 */","	removeRecord: function(","		/* int */ index)","	{","		if (this.get('ds').removeRecord(index))","		{","			if (index < this.server_errors.records.length)","			{","				var rec = this.server_errors.records[index];","				this.server_errors.records.splice(index,1);","				delete this.server_errors.record_map[ rec[ this.get('ds').get('uniqueIdKey') ] ];","				this._updatePageStatus();","			}","			return true;","		}","		else","		{","			return false;","		}","	},","","	/**","	 * @method getFieldConfig","	 * @param key {String} field key","	 * @return {Object} field configuration","	 */","	getFieldConfig: function(","		/* string */	key)","	{","		return this.get('fields')[key] || {};","	},","","	/**","	 * @method getRecordContainerId","	 * @param record {String|Object} record id or record object","	 * @return {String} id of DOM element containing the record's input elements","	 */","	getRecordContainerId: function(","		/* string/object */ record)","	{","		if (Y.Lang.isString(record))","		{","			return id_prefix + id_separator + record;","		}","		else","		{","			return id_prefix + id_separator + record[ this.get('ds').get('uniqueIdKey') ];","		}","	},","","	/**","	 * @method getFieldId","	 * @param record {String|Object} record id or record object","	 * @param key {String} field key","	 * @return {String} id of DOM element containing the field's input element","	 */","	getFieldId: function(","		/* string/object */	record,","		/* string */		key)","	{","		return this.getRecordContainerId(record) + id_separator + key;","	},","","	/**","	 * @method getRecordAndFieldKey","	 * @param key {String|Node} field key or field input element","	 * @return {Object} object containing record and field_key","	 */","	getRecordAndFieldKey: function(","		/* string/element */	field)","	{","		var m = id_regex.exec(Y.Lang.isString(field) ? field : field.get('id'));","		if (m && m.length > 0)","		{","			return { record: this.get('ds').getCurrentRecordMap()[ m[1] ], field_key: m[2] };","		}","	},","","	/**","	 * @method getRecordId","	 * @param obj {Object|Node} record object, record container, or any node inside record container","	 * @return {String} record id","	 */","	getRecordId: function(","		/* object/element */	obj)","	{","		if (Y.Lang.isObject(obj) && !obj._node)","		{","			return obj[ this.get('ds').get('uniqueIdKey') ];","		}","","		var node = obj.getAncestorByClassName(BulkEditor.record_container_class, true);","		if (node)","		{","			var m  = id_regex.exec(node.get('id'));","			if (m && m.length > 0)","			{","				return m[1];","			}","		}","	},","","	/**","	 * @method getRecordContainer","	 * @param record {String|Object|Node} record id, record object, record container, or any node inside record container","	 * @return {Node} node containing rendered record","	 */","	getRecordContainer: function(","		/* string/object/element */ record)","	{","		if (Y.Lang.isString(record))","		{","			var id = id_prefix + id_separator + record;","		}","		else if (record && record._node)","		{","			return record.getAncestorByClassName(BulkEditor.record_container_class, true);","		}","		else	// record object","		{","			var id = this.getRecordContainerId(record);","		}","","		return Y.one('#'+id);","	},","","	/**","	 * @method getFieldContainer","	 * @param record {String|Object|Node} record id, record object, record container, or any node inside record container","	 * @param key {String} field key","	 * @return {Node} node containing rendered field","	 */","	getFieldContainer: function(","		/* string/object/element */	record,","		/* string */				key)","	{","		var field = this.getFieldElement(record, key);","		return field.getAncestorByClassName(BulkEditor.field_container_class, true);","	},","","	/**","	 * @method getFieldElement","	 * @param record {String|Object|Node} record id, record object, record container, or any node inside record container","	 * @param key {String} field key","	 * @return {Node} field's input element","	 */","	getFieldElement: function(","		/* string/object/element */	record,","		/* string */				key)","	{","		if (record && record._node)","		{","			record = this.getRecordId(record);","		}","		return Y.one('#'+this.getFieldId(record, key));","	},","","	/**","	 * Paginate and/or scroll to make the specified record visible.  Record","	 * is pinged to help the user find it.","	 * ","	 * @method showRecordIndex","	 * @param index {Number} record index","	 */","	showRecordIndex: function(","		/* int */ index)","	{","		if (index < 0 || this.get('ds').getRecordCount() <= index)","		{","			return;","		}","","		var pg    = this.get('paginator');","		var start = pg ? pg.getStartIndex() : 0;","		var count = pg ? pg.getRowsPerPage() : default_page_size;","		if (start <= index && index < start+count)","		{","			var node = this.getRecordContainer(this.get('ds').getCurrentRecords()[ index - start ]);","			node.scrollIntoView();","			this.pingRecord(node);","		}","		else if (pg)","		{","			this.scroll_to_index = index;","			pg.setPage(1 + Math.floor(index / count));","		}","	},","","	/**","	 * Paginate and/or scroll to make the specified record visible.  Record","	 * is pinged to help the user find it.","	 * ","	 * @method showRecordId","	 * @param id {Number} record id","	 */","	showRecordId: function(","		/* string */ id)","	{","		var index = this.get('ds').recordIdToIndex(id);","		if (index >= 0)","		{","			this.showRecordIndex(index);","		}","	},","","	/**","	 * Apply a class to the DOM element containing the record for a short","	 * while.  Your CSS can use this class to highlight the record in some","	 * way.","	 * ","	 * @method pingRecord","	 * @param record {String|Object|Node} record id, record object, record container, or any node inside record container","	 */","	pingRecord: function(","		/* string/object/element */	record)","	{","		var ping = this.get('pingClass');","		if (ping)","		{","			var node = this.getRecordContainer(record);","			node.addClass(ping);","			Y.later(this.get('pingTimeout')*1000, null, function()","			{","				node.removeClass(ping);","			});","		}","	},","","	/**","	 * Render the current page of records.","	 *","	 * @method _render","	 * @protected","	 * @param response {Object} response from data source","	 */","	_render: function(response)","	{","","		var container = this.get('contentBox');","		this._renderContainer(container);","		container.set('scrollTop', 0);","		container.set('scrollLeft', 0);","","		Y.Array.each(response.results, function(record)","		{","			var node = this._renderRecordContainer(container, record);","			this._renderRecord(node, record);","		},","		this);","","		this.fire('pageRendered');","","		if (this.auto_validate)","		{","			this.validate();","		}","","		if (this.scroll_to_index >= 0)","		{","			this.showRecordIndex(this.scroll_to_index);","			this.scroll_to_index = -1;","		}","	},","","	/**","	 * Derived class should override to create a structure for the records.","	 *","	 * @method _renderContainer","	 * @protected","	 * @param container {Node}","	 */","	_renderContainer: function(","		/* element */	container)","	{","		container.set('innerHTML', '');","	},","","	/**","	 * Derived class must override to create a container for the record.","	 * ","	 * @method _renderRecordContainer","	 * @protected","	 * @param container {Node}","	 * @param record {Object} record data","	 */","	_renderRecordContainer: function(","		/* element */	container,","		/* object */	record)","	{","		return null;","	},","","	/**","	 * Derived class can override if it needs to do more than just call","	 * _renderField() for each field.","	 * ","	 * @method _renderRecord","	 * @protected","	 * @param container {Node} record container","	 * @param record {Object} record data","	 */","	_renderRecord: function(","		/* element */	container,","		/* object */	record)","	{","		Y.Object.each(this.get('fields'), function(field, key)","		{","			this._renderField(","			{","				container: container,","				key:       key,","				value:     record[key],","				field:     field,","				record:    record","			});","		},","		this);","	},","","	/**","	 * If _renderRecord is not overridden, derived class must override this","	 * function to render the field.","	 * ","	 * @method _renderField","	 * @protected","	 * @param o {Object}","	 *	container {Node} record container,","	 *	key {String} field key,","	 *	value {Mixed} field value,","	 *	field {Object} field configuration,","	 *	record {Object} record data","	 */","	_renderField: function(","		/* object */ o)","	{","	},","","	/**","	 * Update the paginator to match the data source meta information.","	 * ","	 * @method _updatePaginator","	 * @protected","	 * @param response {Object} response from DataSource","	 */","	_updatePaginator: function(response)","	{","		var pg = this.get('paginator');","		if (pg)","		{","			pg.setTotalRecords(this.get('ds').getRecordCount(), true);","		}","	},","","	/**","	 * Clear errors received from the server.  This clears all displayed","	 * messages.","	 * ","	 * @method clearServerErrors","	 */","	clearServerErrors: function()","	{","		if (this.server_errors && this.server_errors.page &&","			this.server_errors.page.length)","		{","			this.fire('clearErrorNotification');","		}","","		this.server_errors =","		{","			page:       [],","			records:    [],","			record_map: {}","		};","","		var pg = this.get('paginator');","		if (pg)","		{","			pg.set('pageStatus', []);","		}","		this.first_error_page = -1;","","		this._clearValidationMessages();","	},","","	/**","	 * Set page level, record level, and field level errors received from","	 * the server.  A message can be either a string (assumed to be an","	 * error) or an object providing msg and type, where type can be","	 * 'error', 'warn', 'info', or 'success'.","	 * ","	 * @method setServerErrors","	 * @param page_errors {Array} list of page-level error messages","	 * @param record_field_errors {Array} list of objects *in record display order*,","	 *		each of which defines id (String), recordError (message),","	 *		and fieldErrors (map of field keys to error messages)","	 */","	setServerErrors: function(","		/* array */	page_errors,","		/* array */	record_field_errors)","	{","		if (this.server_errors.page.length &&","			(!page_errors || !page_errors.length))","		{","			this.fire('clearErrorNotification');","		}","","		this.server_errors =","		{","			page:       page_errors || [],","			records:    record_field_errors || [],","			record_map: Y.Array.toObject(record_field_errors || [], 'id')","		};","","		this._updatePageStatus();","","		var pg = this.get('paginator');","		if (!pg || pg.getCurrentPage() === this.first_error_page)","		{","			this.validate();","		}","		else","		{","			this.auto_validate = true;","			pg.setPage(this.first_error_page);","		}","	},","","	/**","	 * Update paginator to show which pages have errors.","	 *","	 * @method _updatePageStatus","	 * @protected","	 */","	_updatePageStatus: function()","	{","		var pg = this.get('paginator');","		if (!pg)","		{","			return;","		}","","		var page_size = pg ? pg.getRowsPerPage() : default_page_size;","		var status    = this.page_status.slice(0);","","		this.first_error_page = -1;","","		var r = this.server_errors.records;","		for (var i=0; i<r.length; i++)","		{","			if (r[i].recordError || r[i].fieldErrors)","			{","				var j     = Math.floor(i / page_size);","				status[j] = 'error';","				if (this.first_error_page == -1)","				{","					this.first_error_page = i;","				}","			}","		}","","		pg.set('pageStatus', status);","	},","","	/**","	 * Validate the visible values (if using server-side pagination) or all","	 * the values (if using client-side pagination or no pagination).","	 * ","	 * @method validate","	 * @return {Boolean} true if all checked values are acceptable","	 */","	validate: function()","	{","		this.saveChanges();","","		this._clearValidationMessages();","		this.auto_validate = true;","","		var status = this._validateVisibleFields();","		var pg     = this.get('paginator');","		if (!status && pg)","		{","			this.page_status[ pg.getCurrentPage()-1 ] = 'error';","		}","","		status = this._validateAllPages() && status;	// status last to guarantee call","","		if (!status || this.server_errors.page.length ||","			this.server_errors.records.length)","		{","			var err = this.server_errors.page.slice(0);","			if (err.length === 0)","			{","				err.push(Y.FormManager.Strings.validation_error);","			}","			this.fire('notifyErrors', { msgs: err });","","			this.get('contentBox').getElementsByClassName(BulkEditor.record_container_class).some(function(node)","			{","				if (node.hasClass(status_pattern))","				{","					node.scrollIntoView();","					return true;","				}","			});","		}","","		this._updatePageStatus();","		return status;","	},","","	/**","	 * Validate the visible values.","	 * ","	 * @method _validateVisibleFields","	 * @protected","	 * @param container {Node} if null, uses contentBox","	 * @return {Boolean} true if all checked values are acceptable","	 */","	_validateVisibleFields: function(","		/* object */ container)","	{","		var status = true;","","		if (!container)","		{","			container = this.get('contentBox');","		}","","		// fields","","		var e1 = container.getElementsByTagName('input');","		var e2 = container.getElementsByTagName('textarea');","		var e3 = container.getElementsByTagName('select');","","		Y.FormManager.cleanValues(e1);","		Y.FormManager.cleanValues(e2);","","		status = this._validateElements(e1) && status;	// status last to guarantee call","		status = this._validateElements(e2) && status;","		status = this._validateElements(e3) && status;","","		// records -- after fields, since field class regex would wipe out record class","","		container.getElementsByClassName(BulkEditor.record_container_class).each(function(node)","		{","			var id  = this.getRecordId(node);","			var err = this.server_errors.record_map[id];","			if (err && err.recordError)","			{","				err = err.recordError;","				if (Y.Lang.isString(err))","				{","					var msg  = err;","					var type = 'error';","				}","				else","				{","					var msg  = err.msg;","					var type = err.type;","				}","				this.displayRecordMessage(id, msg, type, false);","				status = status && !(type == 'error' || type == 'warn');","			}","		},","		this);","","		return status;","	},","","	/**","	 * Validate the given elements.","	 * ","	 * @method _validateElements","	 * @protected","	 * @param nodes {NodeList}","	 * @return {Boolean} true if all checked values are acceptable","	 */","	_validateElements: function(","		/* array */ nodes)","	{","		var status = true;","		nodes.each(function(node)","		{","			var field_info = this.getRecordAndFieldKey(node);","			if (!field_info)","			{","				return;","			}","","			var field    = this.getFieldConfig(field_info.field_key);","			var msg_list = field.validation && field.validation.msg;","","			var info = Y.FormManager.validateFromCSSData(node, msg_list);","			if (info.error)","			{","				this.displayFieldMessage(node, info.error, 'error', false);","				status = false;","				return;","			}","","			if (info.keepGoing)","			{","				if (field.validation && Y.Lang.isString(field.validation.regex))","				{","					var flags = '';","					var m     = perl_flags_regex.exec(field.validation.regex);","					if (m && m.length == 2)","					{","						flags                  = m[1];","						field.validation.regex = field.validation.regex.replace(perl_flags_regex, '');","					}","					field.validation.regex = new RegExp(field.validation.regex, flags);","				}","","				if (field.validation &&","					field.validation.regex instanceof RegExp &&","					!field.validation.regex.test(node.get('value')))","				{","					this.displayFieldMessage(node, msg_list && msg_list.regex, 'error', false);","					status = false;","					return;","				}","			}","","			if (field.validation &&","				Y.Lang.isFunction(field.validation.fn) &&","				!field.validation.fn.call(this, node))","			{","				status = false;","				return;","			}","","			var err = this.server_errors.record_map[ this.getRecordId(field_info.record) ];","			if (err && err.fieldErrors)","			{","				var f = err.fieldErrors[ field_info.field_key ];","				if (f)","				{","					if (Y.Lang.isString(f))","					{","						var msg  = f;","						var type = 'error';","					}","					else","					{","						var msg  = f.msg;","						var type = f.type;","					}","					this.displayFieldMessage(node, msg, type, false);","					status = status && !(type == 'error' || type == 'warn');","					return;","				}","			}","		},","		this);","","		return status;","	},","","	/**","	 * If the data is stored locally and we paginate, validate all of it","	 * and mark the pages that have invalid values.","	 * ","	 * @method _validateAllPages","	 * @protected","	 * @return {Boolean} true if all checked values are acceptable","	 */","	_validateAllPages: function()","	{","		var ds = this.get('ds');","		var pg = this.get('paginator');","		if (!pg || !ds._dataIsLocal())","		{","			return true;","		}","","		if (!this.validation_node)","		{","			this.validation_node = Y.Node.create('<input></input>');","		}","","		if (!this.validation_keys)","		{","			this.validation_keys = [];","			Y.Object.each(this.get('fields'), function(value, key)","			{","				if (value.validation)","				{","					this.validation_keys.push(key);","				}","			},","			this);","		}","","		var count     = ds.getRecordCount();","		var page_size = pg.getRowsPerPage();","		for (var i=0; i<count; i++)","		{","			var status = true;","			Y.Array.each(this.validation_keys, function(key)","			{","				var field = this.get('fields')[key];","				var value = ds.getValue(i, key);","","				this.validation_node.set('value', Y.Lang.isUndefined(value) ? '' : value);","				this.validation_node.set('className', field.validation.css || '');","","				var info = Y.FormManager.validateFromCSSData(this.validation_node);","				if (info.error)","				{","					status = false;","					return;","				}","","				if (info.keepGoing)","				{","					if (field.validation.regex instanceof RegExp &&","						!field.validation.regex.test(value))","					{","						status = false;","						return;","					}","				}","			},","			this);","","			if (!status)","			{","				var j = Math.floor(i / page_size);","				i     = (j+1)*page_size - 1;	// skip to next page","","				this.page_status[j] = 'error';","			}","		}","","		return true;","	},","","	/**","	 * Clear all displayed messages.","	 * ","	 * @method _clearValidationMessages","	 */","	_clearValidationMessages: function()","	{","		this.has_validation_messages = false;","		this.auto_validate           = false;","		this.page_status             = [];","","		this.fire('clearErrorNotification');","","		var container = this.get('contentBox');","","		container.getElementsByClassName(status_pattern).removeClass(status_pattern);","		container.getElementsByClassName(record_status_pattern).removeClass(record_status_pattern);","		container.getElementsByClassName(message_container_class).set('innerHTML', '');","	},","","	/**","	 * Display a message for the specified field.","	 * ","	 * @method displayFieldMessage","	 * @param e {Node} field input element","	 * @param msg {String} message to display","	 * @param type {String} message type:  error, warn, info, success","	 * @param scroll {Boolean} whether or not to scroll to the field","	 */","	displayFieldMessage: function(","		/* element */	e,","		/* string */	msg,","		/* string */	type,","		/* boolean */	scroll)","	{","		if (Y.Lang.isUndefined(scroll))","		{","			scroll = !this.has_validation_messages;","		}","","		var bd1     = this.getRecordContainer(e);","		var changed = this._updateRecordStatus(bd1, type, status_pattern, status_re, status_prefix);","","		var bd2 = e.getAncestorByClassName(BulkEditor.field_container_class);","		if (Y.FormManager.statusTakesPrecedence(this._getElementStatus(bd2, status_re), type))","		{","			if (msg)","			{","				var m = bd2.getElementsByClassName(message_container_class);","				if (m && m.size() > 0)","				{","					m.item(0).set('innerHTML', msg);","				}","			}","","			bd2.replaceClass(status_pattern, status_prefix + type);","			this.has_validation_messages = true;","		}","","		if (changed && scroll)","		{","			bd1.scrollIntoView();","		}","	},","","	/**","	 * Display a message for the specified record.","	 * ","	 * @method displayRecordMessage","	 * @param id {String} record id","	 * @param msg {String} message to display","	 * @param type {String} message type:  error, warn, info, success","	 * @param scroll {Boolean} whether or not to scroll to the field","	 */","	displayRecordMessage: function(","		/* string */	id,","		/* string */	msg,","		/* string */	type,","		/* boolean */	scroll)","	{","		if (Y.Lang.isUndefined(scroll))","		{","			scroll = !this.has_validation_messages;","		}","","		var bd1     = this.getRecordContainer(id);","		var changed = this._updateRecordStatus(bd1, type, status_pattern, status_re, status_prefix);","		if (this._updateRecordStatus(bd1, type, record_status_pattern, record_status_re, record_status_prefix) &&","			msg)	// msg last to guarantee call","		{","			var bd2 = bd1.getElementsByClassName(BulkEditor.record_msg_container_class).item(0);","			if (bd2)","			{","				var m = bd2.getElementsByClassName(message_container_class);","				if (m && m.size() > 0)","				{","					m.item(0).set('innerHTML', msg);","				}","			}","		}","","		if (changed && scroll)","		{","			bd1.scrollIntoView();","		}","	},","","	/**","	 * @method _getElementStatus","	 * @protected","	 * @param n {Node}","	 * @param r {RegExp}","	 * @return {Mixed} status or false","	 */","	_getElementStatus: function(","		/* Node */	n,","		/* regex */	r)","	{","		var m = r.exec(n.get('className'));","		return (m && m.length > 1 ? m[1] : false);","	},","","	/**","	 * Update the status of the node, if the new status has higher precedence.","	 *","	 * @method _updateRecordStatus","	 * @param bd {Node}","	 * @param type {String} new status","	 * @param p {String} pattern for extracting status","	 * @param r {RegExpr} regex for extracting status","	 * @param prefix {String} status prefix","	 * @return {Boolean} true if status was modified","	 */","	_updateRecordStatus: function(","		/* element */	bd,","		/* string */	type,","		/* string */	p,","		/* regex */		r,","		/* string */	prefix)","	{","		if (Y.FormManager.statusTakesPrecedence(this._getElementStatus(bd, r), type))","		{","			bd.replaceClass(p, prefix + type);","			this.has_validation_messages = true;","			return true;","		}","","		return false;","	}","});","","//","// Markup","//","","BulkEditor.cleanHTML = function(s)","{","	return (Y.Lang.isValue(s) ? Y.Escape.html(s) : '');","};","","/**"," * @property Y.BulkEditor.error_msg_markup"," * @type {String}"," * @static"," */","BulkEditor.error_msg_markup = Y.Lang.sub('<div class=\"{c}\"></div>',","{","	c: message_container_class","});","","/**"," * @method labelMarkup"," * @static"," * @param o {Object}"," *	key {String} field key,"," *	value {Mixed} field value,"," *	field {Object} field configuration,"," *	record {Object} record data"," * @return {String} markup for the label of the specified field"," */","BulkEditor.labelMarkup = function(o)","{","	var label = '<label for=\"{id}\">{label}</label>';","","	return Y.Lang.sub(label,","	{","		id:    this.getFieldId(o.record, o.key),","		label: o.field.label","	});","};","","/**"," * Map of field type (input,select,textarea) to function that generates the"," * required markup.  You can add additional entries.  Each function takes a"," * single argument: an object defining"," *	key {String} field key,"," *	value {Mixed} field value,"," *	field {Object} field configuration,"," *	record {Object} record data"," *"," * @property Y.BulkEditor.markup"," * @type {Object}"," * @static"," */","BulkEditor.markup =","{","	input: function(o)","	{","		var input =","			'<div class=\"{cont}{key}\">' +","				'{label}{msg1}' +","				'<input type=\"text\" id=\"{id}\" value=\"{value}\" class=\"{field}{key} {yiv}\" />' +","				'{msg2}' +","			'</div>';","","		var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';","","		return Y.Lang.sub(input,","		{","			cont:  BulkEditor.field_container_class + ' ' + BulkEditor.field_container_class_prefix,","			field: BulkEditor.field_class_prefix,","			key:   o.key,","			id:    this.getFieldId(o.record, o.key),","			label: label,","			value: BulkEditor.cleanHTML(o.value),","			yiv:   (o.field && o.field.validation && o.field.validation.css) || '',","			msg1:  label ? BulkEditor.error_msg_markup : '',","			msg2:  label ? '' : BulkEditor.error_msg_markup","		});","	},","","	select: function(o)","	{","		var select =","			'<div class=\"{cont}{key}\">' +","				'{label}{msg1}' +","				'<select id=\"{id}\" class=\"{field}{key}\">{options}</select>' +","				'{msg2}' +","			'</div>';","","		var option = '<option value=\"{value}\" {selected}>{text}</option>';","","		var options = Y.Array.reduce(o.field.values, '', function(s, v)","		{","			return s + Y.Lang.sub(option,","			{","				value:    v.value,","				text:     BulkEditor.cleanHTML(v.text),","				selected: o.value && o.value.toString() === v.value ? 'selected=\"selected\"' : ''","			});","		});","","		var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';","","		return Y.Lang.sub(select,","		{","			cont:  	 BulkEditor.field_container_class + ' ' + BulkEditor.field_container_class_prefix,","			field:   BulkEditor.field_class_prefix,","			key:     o.key,","			id:      this.getFieldId(o.record, o.key),","			label:   label,","			options: options,","			yiv:     (o.field && o.field.validation && o.field.validation.css) || '',","			msg1:    label ? BulkEditor.error_msg_markup : '',","			msg2:    label ? '' : BulkEditor.error_msg_markup","		});","	},","","	checkbox: function(o)","	{","		var checkbox =","			'<div class=\"{cont}{key}\">' +","				'<input type=\"checkbox\" id=\"{id}\" {value} class=\"{field}{key}\" /> ' +","				'<label for=\"{id}\">{label}</label>' +","				'{msg}' +","			'</div>';","","		var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';","","		return Y.Lang.sub(checkbox,","		{","			cont:  BulkEditor.field_container_class + ' ' + BulkEditor.field_container_class_prefix,","			field: BulkEditor.field_class_prefix,","			key:   o.key,","			id:    this.getFieldId(o.record, o.key),","			label: label,","			value: o.value == o.field.values.on ? 'checked=\"checked\"' : '',","			msg:   BulkEditor.error_msg_markup","		});","	},","","	checkboxMultiselect: function(o)","	{","		var select =","			'<div class=\"{cont}{key}\">' +","				'{label}{msg}' +","				'<div id=\"{id}-cbs\" class=\"checkbox-multiselect\">{cbs}</div>' +","				'<select id=\"{id}\" class=\"{field}{key}\" multiple=\"multiple\" style=\"display:none;\">{options}</select>' +","			'</div>';","","		var id        = this.getFieldId(o.record, o.key),","			has_value = Y.Lang.isArray(o.value);","","		var checkbox =","			'<p class=\"checkbox-multiselect-checkbox\">' +","				'<input type=\"checkbox\" id=\"{id}-{value}\" value=\"{value}\" {checked} /> ' +","				'<label for=\"{id}-{value}\">{label}</label>' +","			'</p>';","","		var cbs = Y.Array.reduce(o.field.values, '', function(s, v)","		{","			return s + Y.Lang.sub(checkbox,","			{","				id:      id,","				value:   v.value,","				checked: has_value && Y.Array.indexOf(o.value, v.value) >= 0 ? 'checked=\"checked\"' : '',","				label:   BulkEditor.cleanHTML(v.text)","			});","		});","","		var option = '<option value=\"{value}\" {selected}>{text}</option>';","","		var options = Y.Array.reduce(o.field.values, '', function(s, v)","		{","			return s + Y.Lang.sub(option,","			{","				value:    v.value,","				text:     BulkEditor.cleanHTML(v.text),","				selected: has_value && Y.Array.indexOf(o.value, v.value) >= 0 ? 'selected=\"selected\"' : ''","			});","		});","","		var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';","","		return Y.Lang.sub(select,","		{","			cont:  	 BulkEditor.field_container_class + ' ' + BulkEditor.field_container_class_prefix,","			field:   BulkEditor.field_class_prefix,","			key:     o.key,","			id:      id,","			label:   label,","			cbs:     cbs,","			options: options,","			yiv:     (o.field && o.field.validation && o.field.validation.css) || '',","			msg:     BulkEditor.error_msg_markup","		});","	},","","	textarea: function(o)","	{","		var textarea =","			'<div class=\"{cont}{key}\">' +","				'{label}{msg1}' +","				'<textarea id=\"{id}\" class=\"satg-textarea-field {prefix}{key} {yiv}\">{value}</textarea>' +","				'{msg2}' +","			'</div>';","","		var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';","","		return Y.Lang.sub(textarea,","		{","			cont:   BulkEditor.field_container_class + ' ' + BulkEditor.field_container_class_prefix,","			prefix: BulkEditor.field_class_prefix,","			key:    o.key,","			id:     this.getFieldId(o.record, o.key),","			label:  label,","			value:  BulkEditor.cleanHTML(o.value),","			yiv:    (o.field && o.field.validation && o.field.validation.css) || '',","			msg1:   label ? BulkEditor.error_msg_markup : '',","			msg2:   label ? '' : BulkEditor.error_msg_markup","		});","	}","};","","/**"," * @method fieldMarkup"," * @static"," * @param key {String} field key"," * @param record {Object}"," * @return {String} markup for the specified field"," */","BulkEditor.fieldMarkup = function(key, record)","{","	var field = this.getFieldConfig(key);","	return BulkEditor.markup[ field.type || 'input' ].call(this,","	{","		key:    key,","		value:  record[key],","		field:  field,","		record: record","	});","};","","function handleCheckboxMultiselect(e)","{","	var cb     = e.currentTarget,","		value  = cb.get('value'),","		select = cb.ancestor('.checkbox-multiselect').next('select');","","	Y.some(Y.Node.getDOMNode(select).options, function(o)","	{","		if (o.value == value)","		{","			o.selected = cb.get('checked');","			return true;","		}","	});","}","","Y.BulkEditor = BulkEditor;","/**"," * @module gallery-bulkedit"," */","","/**"," * <p>HTMLTableBulkEditor builds an HTML table with one tbody for each"," * record.</p>"," *"," * @class HTMLTableBulkEditor"," * @extends BulkEditor "," * @constructor"," * @param config {Object}"," */","function HTMLTableBulkEditor()","{","	HTMLTableBulkEditor.superclass.constructor.apply(this, arguments);","}","","HTMLTableBulkEditor.NAME = \"htmltablebulkedit\";","","HTMLTableBulkEditor.ATTRS =","{","	/**","	 * Configuration for each column: key, label, formatter.","	 *","	 * @attribute columns","	 * @type {Array}","	 * @required","	 * @writeonce","	 */","	columns:","	{","		validator: Y.Lang.isObject,","		writeOnce: true","	},","","	/**","	 * <p>Array of event delegations that will be attached to the container","	 * via Y.delegate().  Each item is an object defining type, nodes, fn.","	 * The function will be called in the context of the BulkEditor","	 * instance.</p>","	 * ","	 * <p>Attaching events to the container before the table is created does","	 * not work in all browsers.</p>","	 *","	 * @attribute events","	 * @type {Array}","	 * @writeonce","	 */","	events:","	{","		validator: Y.Lang.isObject,","		writeOnce: true","	}","};","","var cell_class        = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'cell'),","	cell_class_prefix = cell_class + '-',","	odd_class         = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'odd'),","	even_class        = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'even'),","	msg_class         = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'record-message'),","	liner_class       = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'liner'),","","	input_class          = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'input'),","	textarea_class       = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'textarea'),","	select_class         = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'select'),","	checkbox_class       = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'checkbox'),","	cb_multiselect_class = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'checkbox-multiselect');","","/**"," * Renders an input element in the cell."," *"," * @method inputFormatter"," * @static"," * @param o {Object} cell, key, value, field, column, record"," */","HTMLTableBulkEditor.inputFormatter = function(o)","{","	o.cell.set('innerHTML', BulkEditor.markup.input.call(this, o));","	o.cell.addClass(input_class);","};","","/**"," * Renders a textarea element in the cell."," *"," * @method textareaFormatter"," * @static"," * @param o {Object} cell, key, value, field, column, record"," */","HTMLTableBulkEditor.textareaFormatter = function(o)","{","	o.cell.set('innerHTML', BulkEditor.markup.textarea.call(this, o));","	o.cell.addClass(textarea_class);","};","","/**"," * Renders a select element in the cell."," *"," * @method selectFormatter"," * @static"," * @param o {Object} cell, key, value, field, column, record"," */","HTMLTableBulkEditor.selectFormatter = function(o)","{","	o.cell.set('innerHTML', BulkEditor.markup.select.call(this, o));","	o.cell.addClass(select_class);","};","","/**"," * Renders a checkbox element in the cell."," *"," * @method checkboxFormatter"," * @static"," * @param o {Object} cell, key, value, field, column, record"," */","HTMLTableBulkEditor.checkboxFormatter = function(o)","{","	o.cell.set('innerHTML', BulkEditor.markup.checkbox.call(this, o));","	o.cell.addClass(checkbox_class);","};","","/**"," * Renders a set of checkboxes for multiselect in the cell."," *"," * @method checkboxMultiselectFormatter"," * @static"," * @param o {Object} cell, key, value, field, column, record"," */","HTMLTableBulkEditor.checkboxMultiselectFormatter = function(o)","{","	o.cell.set('innerHTML', BulkEditor.markup.checkboxMultiselect.call(this, o));","	o.cell.addClass(cb_multiselect_class);","};","","/**"," * Map of field type to cell formatter."," *"," * @property Y.HTMLTableBulkEditor.defaults"," * @type {Object}"," * @static"," */","HTMLTableBulkEditor.defaults =","{","	input:","	{","		formatter: HTMLTableBulkEditor.inputFormatter","	},","","	select:","	{","		formatter: HTMLTableBulkEditor.selectFormatter","	},","","	checkbox:","	{","		formatter: HTMLTableBulkEditor.checkboxFormatter","	},","","	checkboxMultiselect:","	{","		formatter: HTMLTableBulkEditor.checkboxMultiselectFormatter","	},","","	textarea:","	{","		formatter: HTMLTableBulkEditor.textareaFormatter","	}","};","","function moveFocus(e)","{","	e.halt();","","	var info = this.getRecordAndFieldKey(e.target);","	if (!info)","	{","		return;","	}","","	var bd = this.getRecordContainer(e.target);","	if (bd && e.keyCode == 38)","	{","		bd = bd.previous();","	}","	else if (bd)","	{","		bd = bd.next();","	}","","	var id = bd && this.getRecordId(bd);","	if (id)","	{","		var field = this.getFieldElement(id, info.field_key);","		if (field)","		{","			try","			{","				field.focus();","				field.select();","			}","			catch (ex)","			{","				// no way to determine in IE if focus will fail","				// no way to determine if browser allows focus to select elements","			}","		}","	}","}","","Y.extend(HTMLTableBulkEditor, BulkEditor,","{","	bindUI: function()","	{","		// attach events after creating the table","	},","","	_renderContainer: function(","		/* element */	container)","	{","		var table_class = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME);","","		if (!this.table ||","			container.get('firstChild').get('tagName').toLowerCase() != 'table' ||","			!container.get('firstChild').hasClass(table_class))","		{","			var s = Y.Lang.sub('<table class=\"{t}\"><thead class=\"{hd}\"><tr>',","			{","				t:  table_class,","				hd: Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'hd')","			});","","			var row_markup = '<th class=\"{cell} {prefix}{key}\">{label}</th>';","","			s = Y.Array.reduce(this.get('columns'), s, function(s, column)","			{","				return s + Y.Lang.sub(row_markup,","				{","					cell:   cell_class,","					prefix: cell_class_prefix,","					key:    column.key,","					label:  column.label || '&nbsp;'","				});","			});","","			s += '</tr></thead></table>';","","			container.set('innerHTML', s);","			this.table = container.get('firstChild');","","			this._attachEvents(this.table);","			Y.on('key', moveFocus, this.table, 'down:38,40+ctrl', this);","","			Y.Object.each(this.get('events'), function(e)","			{","				Y.delegate(e.type, e.fn, this.table, e.nodes, this);","			},","			this);","		}","		else","		{","			while (this.table.get('children').size() > 1)","			{","				this.table.get('lastChild').remove().destroy(true);","			}","		}","	},","","	_renderRecordContainer: function(","		/* element */	container,","		/* object */	record)","	{","		var body = Y.Node.create('<tbody></tbody>');","		body.set('id', this.getRecordContainerId(record));","		body.set('className',","			BulkEditor.record_container_class + ' ' +","			((this.table.get('children').size() % 2) ? odd_class : even_class));	// accounts for th row","","		var msg_row = Y.Node.create('<tr></tr>');","		msg_row.set('className', BulkEditor.record_msg_container_class);","","		var msg_cell = Y.Node.create('<td></td>');","		msg_cell.set('colSpan', this.get('columns').length);","		msg_cell.set('className', msg_class);","		msg_cell.set('innerHTML', BulkEditor.error_msg_markup);","","		msg_row.appendChild(msg_cell);","		body.appendChild(msg_row);","","		var row = Y.Node.create('<tr></tr>');","		body.appendChild(row);","","		this.table.appendChild(body);","		return row;","	},","","	_renderRecord: function(","		/* element */	row,","		/* object */	record)","	{","		Y.Array.each(this.get('columns'), function(column)","		{","			var key    = column.key;","			var field  = this.getFieldConfig(key);","","			// create cell","","			var cell = Y.Node.create('<td></td>');","			cell.set('className', cell_class + ' ' + cell_class_prefix + key);","","			// create liner","","			var liner = Y.Node.create('<div></div>');","			liner.set('className', liner_class);","","			// fill in liner","","			var f = null;","			if (Y.Lang.isFunction(column.formatter))","			{","				f = column.formatter;","			}","			else if (field.type && HTMLTableBulkEditor.defaults[ field.type ])","			{","				f = HTMLTableBulkEditor.defaults[ field.type ].formatter;","			}","			else","			{","				if (field.type)","				{","				}","","				f = HTMLTableBulkEditor.defaults.input.formatter;","			}","","			if (f)","			{","				f.call(this,","				{","					cell:   liner,","					key:    key,","					value:  record[key],","					field:  field,","					column: column,","					record: record","				});","			}","","			// append cell","","			cell.appendChild(liner);","			row.appendChild(cell);","		},","		this);","	}","});","","Y.HTMLTableBulkEditor = HTMLTableBulkEditor;","","","}, 'gallery-2012.10.10-19-59' ,{optional:['datasource','dataschema','gallery-paginator'], requires:['widget','datasource-local','gallery-busyoverlay','gallery-formmgr-css-validation','gallery-node-optimizations','gallery-scrollintoview','array-extras','gallery-funcprog','escape','event-key','gallery-nodelist-extras2'], skinnable:true});"];
_yuitest_coverage["/build/gallery-bulkedit/gallery-bulkedit.js"].lines = {"1":0,"3":0,"36":0,"38":0,"41":0,"43":0,"102":0,"103":0,"156":0,"164":0,"168":0,"173":0,"178":0,"183":0,"187":0,"190":0,"191":0,"193":0,"194":0,"196":0,"197":0,"199":0,"204":0,"207":0,"209":0,"210":0,"216":0,"218":0,"223":0,"224":0,"225":0,"227":0,"228":0,"230":0,"233":0,"235":0,"239":0,"241":0,"245":0,"246":0,"248":0,"249":0,"251":0,"254":0,"256":0,"260":0,"263":0,"266":0,"269":0,"271":0,"274":0,"275":0,"280":0,"283":0,"286":0,"287":0,"290":0,"292":0,"294":0,"295":0,"296":0,"300":0,"302":0,"304":0,"307":0,"309":0,"310":0,"312":0,"314":0,"320":0,"321":0,"322":0,"323":0,"325":0,"326":0,"328":0,"331":0,"332":0,"336":0,"338":0,"340":0,"342":0,"344":0,"345":0,"347":0,"352":0,"353":0,"355":0,"356":0,"358":0,"359":0,"361":0,"363":0,"364":0,"371":0,"372":0,"373":0,"375":0,"377":0,"378":0,"379":0,"385":0,"387":0,"388":0,"390":0,"395":0,"396":0,"399":0,"403":0,"405":0,"408":0,"410":0,"413":0,"415":0,"418":0,"420":0,"423":0,"424":0,"425":0,"426":0,"436":0,"447":0,"448":0,"450":0,"462":0,"471":0,"480":0,"493":0,"495":0,"498":0,"499":0,"501":0,"504":0,"505":0,"507":0,"508":0,"512":0,"513":0,"516":0,"519":0,"523":0,"536":0,"545":0,"546":0,"548":0,"550":0,"554":0,"570":0,"572":0,"574":0,"575":0,"577":0,"578":0,"580":0,"582":0,"584":0,"586":0,"587":0,"588":0,"589":0,"591":0,"595":0,"597":0,"598":0,"600":0,"602":0,"608":0,"622":0,"623":0,"625":0,"628":0,"630":0,"632":0,"633":0,"634":0,"638":0,"640":0,"643":0,"646":0,"648":0,"651":0,"668":0,"670":0,"673":0,"675":0,"676":0,"678":0,"680":0,"685":0,"687":0,"689":0,"702":0,"703":0,"705":0,"707":0,"709":0,"713":0,"728":0,"730":0,"733":0,"735":0,"737":0,"739":0,"740":0,"742":0,"743":0,"745":0,"749":0,"750":0,"752":0,"754":0,"756":0,"757":0,"762":0,"764":0,"766":0,"768":0,"769":0,"790":0,"792":0,"795":0,"797":0,"799":0,"801":0,"802":0,"804":0,"805":0,"806":0,"808":0,"810":0,"811":0,"813":0,"816":0,"818":0,"823":0,"824":0,"825":0,"829":0,"830":0,"832":0,"833":0,"835":0,"837":0,"838":0,"839":0,"844":0,"846":0,"848":0,"850":0,"851":0,"852":0,"874":0,"876":0,"879":0,"880":0,"882":0,"884":0,"886":0,"887":0,"888":0,"889":0,"891":0,"894":0,"895":0,"897":0,"898":0,"900":0,"904":0,"905":0,"907":0,"909":0,"911":0,"912":0,"917":0,"919":0,"921":0,"923":0,"924":0,"925":0,"926":0,"945":0,"947":0,"950":0,"952":0,"953":0,"954":0,"956":0,"957":0,"958":0,"959":0,"964":0,"966":0,"968":0,"971":0,"973":0,"977":0,"988":0,"989":0,"991":0,"993":0,"1003":0,"1004":0,"1008":0,"1009":0,"1037":0,"1039":0,"1042":0,"1044":0,"1056":0,"1091":0,"1151":0,"1169":0,"1170":0,"1172":0,"1173":0,"1174":0,"1176":0,"1178":0,"1180":0,"1181":0,"1182":0,"1183":0,"1184":0,"1185":0,"1186":0,"1189":0,"1193":0,"1195":0,"1201":0,"1202":0,"1207":0,"1220":0,"1231":0,"1233":0,"1235":0,"1237":0,"1238":0,"1243":0,"1245":0,"1246":0,"1253":0,"1254":0,"1256":0,"1257":0,"1260":0,"1261":0,"1262":0,"1269":0,"1270":0,"1284":0,"1285":0,"1286":0,"1287":0,"1289":0,"1291":0,"1294":0,"1296":0,"1298":0,"1300":0,"1302":0,"1304":0,"1306":0,"1311":0,"1314":0,"1330":0,"1335":0,"1337":0,"1350":0,"1367":0,"1368":0,"1370":0,"1372":0,"1374":0,"1392":0,"1394":0,"1396":0,"1397":0,"1398":0,"1399":0,"1401":0,"1405":0,"1417":0,"1428":0,"1430":0,"1434":0,"1448":0,"1459":0,"1460":0,"1462":0,"1474":0,"1476":0,"1479":0,"1480":0,"1482":0,"1483":0,"1485":0,"1498":0,"1500":0,"1502":0,"1504":0,"1508":0,"1511":0,"1524":0,"1525":0,"1538":0,"1540":0,"1542":0,"1555":0,"1557":0,"1560":0,"1561":0,"1562":0,"1563":0,"1565":0,"1566":0,"1567":0,"1569":0,"1571":0,"1572":0,"1586":0,"1587":0,"1589":0,"1604":0,"1605":0,"1607":0,"1608":0,"1609":0,"1611":0,"1626":0,"1627":0,"1628":0,"1629":0,"1631":0,"1633":0,"1634":0,"1638":0,"1640":0,"1642":0,"1645":0,"1647":0,"1648":0,"1662":0,"1677":0,"1693":0,"1695":0,"1734":0,"1735":0,"1737":0,"1749":0,"1752":0,"1755":0,"1762":0,"1763":0,"1765":0,"1767":0,"1769":0,"1788":0,"1791":0,"1794":0,"1801":0,"1803":0,"1804":0,"1806":0,"1810":0,"1811":0,"1823":0,"1824":0,"1826":0,"1829":0,"1830":0,"1832":0,"1834":0,"1835":0,"1837":0,"1839":0,"1840":0,"1841":0,"1843":0,"1848":0,"1860":0,"1862":0,"1863":0,"1865":0,"1866":0,"1867":0,"1869":0,"1872":0,"1874":0,"1877":0,"1878":0,"1880":0,"1882":0,"1884":0,"1886":0,"1888":0,"1889":0,"1894":0,"1895":0,"1909":0,"1911":0,"1913":0,"1918":0,"1919":0,"1920":0,"1922":0,"1923":0,"1925":0,"1926":0,"1927":0,"1931":0,"1933":0,"1934":0,"1935":0,"1937":0,"1938":0,"1940":0,"1941":0,"1945":0,"1946":0,"1948":0,"1949":0,"1954":0,"1968":0,"1969":0,"1971":0,"1972":0,"1974":0,"1977":0,"1978":0,"1980":0,"1981":0,"1983":0,"1984":0,"1985":0,"1988":0,"1990":0,"1992":0,"1993":0,"1994":0,"1996":0,"1997":0,"1999":0,"2002":0,"2006":0,"2007":0,"2008":0,"2012":0,"2016":0,"2017":0,"2020":0,"2021":0,"2023":0,"2024":0,"2026":0,"2028":0,"2029":0,"2033":0,"2034":0,"2036":0,"2037":0,"2038":0,"2044":0,"2057":0,"2058":0,"2059":0,"2061":0,"2064":0,"2066":0,"2069":0,"2071":0,"2072":0,"2074":0,"2076":0,"2082":0,"2083":0,"2084":0,"2086":0,"2087":0,"2089":0,"2090":0,"2092":0,"2093":0,"2095":0,"2096":0,"2098":0,"2099":0,"2102":0,"2104":0,"2107":0,"2108":0,"2114":0,"2116":0,"2117":0,"2119":0,"2123":0,"2133":0,"2134":0,"2135":0,"2137":0,"2139":0,"2141":0,"2142":0,"2143":0,"2161":0,"2163":0,"2166":0,"2167":0,"2169":0,"2170":0,"2172":0,"2174":0,"2175":0,"2177":0,"2181":0,"2182":0,"2185":0,"2187":0,"2206":0,"2208":0,"2211":0,"2212":0,"2213":0,"2216":0,"2217":0,"2219":0,"2220":0,"2222":0,"2227":0,"2229":0,"2244":0,"2245":0,"2266":0,"2268":0,"2269":0,"2270":0,"2273":0,"2281":0,"2283":0,"2291":0,"2306":0,"2308":0,"2310":0,"2330":0,"2334":0,"2341":0,"2343":0,"2359":0,"2366":0,"2368":0,"2370":0,"2378":0,"2380":0,"2396":0,"2403":0,"2405":0,"2419":0,"2426":0,"2429":0,"2435":0,"2437":0,"2446":0,"2448":0,"2450":0,"2458":0,"2460":0,"2476":0,"2483":0,"2485":0,"2507":0,"2509":0,"2510":0,"2519":0,"2521":0,"2525":0,"2527":0,"2529":0,"2530":0,"2535":0,"2549":0,"2551":0,"2554":0,"2556":0,"2592":0,"2612":0,"2614":0,"2615":0,"2625":0,"2627":0,"2628":0,"2638":0,"2640":0,"2641":0,"2651":0,"2653":0,"2654":0,"2664":0,"2666":0,"2667":0,"2677":0,"2705":0,"2707":0,"2709":0,"2710":0,"2712":0,"2715":0,"2716":0,"2718":0,"2720":0,"2722":0,"2725":0,"2726":0,"2728":0,"2729":0,"2731":0,"2733":0,"2734":0,"2745":0,"2755":0,"2757":0,"2761":0,"2767":0,"2769":0,"2771":0,"2780":0,"2782":0,"2783":0,"2785":0,"2786":0,"2788":0,"2790":0,"2796":0,"2798":0,"2807":0,"2808":0,"2809":0,"2813":0,"2814":0,"2816":0,"2817":0,"2818":0,"2819":0,"2821":0,"2822":0,"2824":0,"2825":0,"2827":0,"2828":0,"2835":0,"2837":0,"2838":0,"2842":0,"2843":0,"2847":0,"2848":0,"2852":0,"2853":0,"2855":0,"2857":0,"2859":0,"2863":0,"2867":0,"2870":0,"2872":0,"2885":0,"2886":0,"2892":0};
_yuitest_coverage["/build/gallery-bulkedit/gallery-bulkedit.js"].functions = {"BulkEditDataSource:36":0,"value:100":0,"\'string\':166":0,"\'integer\':171":0,"\'decimal\':176":0,"\'boolean\':181":0,"fromDisplayIndex:187":0,"adjustRequest:207":0,"internalSuccess:269":0,"internalFailure:290":0,"(anonymous 2):310":0,"(anonymous 3):375":0,"(anonymous 4):385":0,"checkFinished:300":0,"initializer:401":0,"_dataIsLocal:434":0,"_flushCache:445":0,"getRecordCount:460":0,"getCurrentRecords:469":0,"getCurrentRecordMap:478":0,"getValue:489":0,"getChanges:534":0,"(anonymous 5):546":0,"getRemovedRecordIndexes:543":0,"(anonymous 6):598":0,"insertRecord:566":0,"removeRecord:619":0,"updateValue:663":0,"_getComparator:699":0,"merge:735":0,"(anonymous 7):752":0,"(anonymous 8):764":0,"mergeChanges:725":0,"kill:797":0,"(anonymous 9):833":0,"(anonymous 10):846":0,"killRecord:787":0,"update:882":0,"(anonymous 11):907":0,"(anonymous 12):919":0,"updateRecordId:870":0,"recordIdToIndex:941":0,"_defRequestFn:986":0,"BulkEditor:1037":0,"validator:1054":0,"validator:1089":0,"switchPage:1176":0,"initializer:1191":0,"renderUI:1199":0,"bindUI:1205":0,"_attachEvents:1217":0,"(anonymous 13):1251":0,"(anonymous 14):1266":0,"reload:1229":0,"(anonymous 17):1300":0,"(anonymous 16):1289":0,"(anonymous 15):1287":0,"saveChanges:1282":0,"getAllValues:1328":0,"getChanges:1348":0,"insertRecord:1363":0,"removeRecord:1389":0,"getFieldConfig:1414":0,"getRecordContainerId:1425":0,"getFieldId:1444":0,"getRecordAndFieldKey:1456":0,"getRecordId:1471":0,"getRecordContainer:1495":0,"getFieldContainer:1520":0,"getFieldElement:1534":0,"showRecordIndex:1552":0,"showRecordId:1583":0,"(anonymous 18):1609":0,"pingRecord:1601":0,"(anonymous 19):1631":0,"_render:1623":0,"_renderContainer:1659":0,"_renderRecordContainer:1673":0,"(anonymous 20):1693":0,"_renderRecord:1689":0,"_updatePaginator:1732":0,"clearServerErrors:1747":0,"setServerErrors:1784":0,"_updatePageStatus:1821":0,"(anonymous 21):1884":0,"validate:1858":0,"(anonymous 22):1931":0,"_validateVisibleFields:1906":0,"(anonymous 23):1969":0,"_validateElements:1965":0,"(anonymous 24):2072":0,"(anonymous 25):2087":0,"_validateAllPages:2055":0,"_clearValidationMessages:2131":0,"displayFieldMessage:2155":0,"displayRecordMessage:2200":0,"_getElementStatus:2240":0,"_updateRecordStatus:2259":0,"cleanHTML:2281":0,"labelMarkup:2306":0,"input:2332":0,"(anonymous 26):2368":0,"select:2357":0,"checkbox:2394":0,"(anonymous 27):2435":0,"(anonymous 28):2448":0,"checkboxMultiselect:2417":0,"textarea:2474":0,"fieldMarkup:2507":0,"(anonymous 29):2525":0,"handleCheckboxMultiselect:2519":0,"HTMLTableBulkEditor:2549":0,"inputFormatter:2612":0,"textareaFormatter:2625":0,"selectFormatter:2638":0,"checkboxFormatter:2651":0,"checkboxMultiselectFormatter:2664":0,"moveFocus:2705":0,"(anonymous 30):2769":0,"(anonymous 31):2788":0,"_renderContainer:2752":0,"_renderRecordContainer:2803":0,"(anonymous 32):2835":0,"_renderRecord:2831":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-bulkedit/gallery-bulkedit.js"].coveredLines = 766;
_yuitest_coverage["/build/gallery-bulkedit/gallery-bulkedit.js"].coveredFunctions = 125;
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1);
YUI.add('gallery-bulkedit', function(Y) {

_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 3);
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
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 36);
function BulkEditDataSource()
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "BulkEditDataSource", 36);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 38);
BulkEditDataSource.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 41);
BulkEditDataSource.NAME = "bulkEditDataSource";

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 43);
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
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "value", 100);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 102);
idCounter++;
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 103);
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

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 156);
var uniqueIdPrefix = 'bulk-edit-new-id-',
	idCounter = 0,

	inserted_prefix = 'be-ds-i:',
	inserted_re     = /^be-ds-i:/,
	removed_prefix  = 'be-ds-r:',
	removed_re      = /^be-ds-r:/;

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 164);
BulkEditDataSource.comparator =
{
	'string': function(a,b)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "\'string\'", 166);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 168);
return (Y.Lang.trim(a.toString()) === Y.Lang.trim(b.toString()));
	},

	'integer': function(a,b)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "\'integer\'", 171);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 173);
return (parseInt(a,10) === parseInt(b,10));
	},

	'decimal': function(a,b)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "\'decimal\'", 176);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 178);
return (parseFloat(a,10) === parseFloat(b,10));
	},

	'boolean': function(a,b)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "\'boolean\'", 181);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 183);
return (((a && b) || (!a && !b)) ? true : false);
	}
};

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 187);
function fromDisplayIndex(
	/* int */ index)
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "fromDisplayIndex", 187);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 190);
var count = -1;
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 191);
for (var i=0; i<this._index.length; i++)
	{
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 193);
var j = this._index[i];
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 194);
if (!removed_re.test(j))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 196);
count++;
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 197);
if (count === index)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 199);
return i;
			}
		}
	}

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 204);
return false;
}

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 207);
function adjustRequest()
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "adjustRequest", 207);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 209);
var r = this._callback.request;
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 210);
this._callback.adjust =
	{
		origStart: r.startIndex,
		origCount: r.resultCount
	};

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 216);
if (!this._index)
	{
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 218);
return;
	}

	// find index of first record to request

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 223);
var start = Math.min(r.startIndex, this._index.length);
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 224);
var end   = 0;
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 225);
for (var i=0; i<start; i++)
	{
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 227);
var j = this._index[i];
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 228);
if (!inserted_re.test(j))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 230);
end++;
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 233);
if (removed_re.test(j))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 235);
start++;
		}
	}

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 239);
r.startIndex = end;

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 241);
this._callback.adjust.indexStart = i;

	// adjust number of records to request

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 245);
var count = 0;
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 246);
while (i < this._index.length && count < this._callback.adjust.origCount)
	{
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 248);
var j = this._index[i];
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 249);
if (inserted_re.test(j))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 251);
r.resultCount--;
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 254);
if (removed_re.test(j))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 256);
r.resultCount++;
		}
		else
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 260);
count++;
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 263);
i++;
	}

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 266);
this._callback.adjust.indexEnd = i;
}

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 269);
function internalSuccess(e)
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "internalSuccess", 269);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 271);
if (!e.response || e.error ||
		!Y.Lang.isArray(e.response.results))
	{
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 274);
internalFailure.apply(this, arguments);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 275);
return;
	}

	// synch response arrives before setting _tId

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 280);
if (!Y.Lang.isUndefined(this._callback._tId) &&
		e.tId !== this._callback._tId)
	{
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 283);
return; 	// cancelled request
	}

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 286);
this._callback.response = e.response;
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 287);
checkFinished.call(this);
}

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 290);
function internalFailure(e)
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "internalFailure", 290);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 292);
if (e.tId === this._callback._tId)
	{
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 294);
this._callback.error    = e.error;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 295);
this._callback.response = e.response;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 296);
this.fire('response', this._callback);
	}
}

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 300);
function checkFinished()
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "checkFinished", 300);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 302);
if (this._generatingRequest || !this._callback.response)
	{
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 304);
return;
	}

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 307);
if (!this._fields)
	{
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 309);
this._fields = {};
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 310);
Y.Array.each(this.get('ds').schema.get('schema').resultFields, function(value)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 2)", 310);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 312);
if (Y.Lang.isObject(value))
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 314);
this._fields[ value.key ] = value;
			}
		},
		this);
	}

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 320);
var response = {};
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 321);
Y.mix(response, this._callback.response);
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 322);
response.results = [];
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 323);
response         = Y.clone(response, true);

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 325);
var dataStartIndex = 0;
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 326);
if (this.get('startIndexExpr'))
	{
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 328);
eval('dataStartIndex=this._callback.response'+this.get('startIndexExpr'));
	}

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 331);
var startIndex   = this._callback.request.startIndex - dataStartIndex;
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 332);
response.results = this._callback.response.results.slice(startIndex, startIndex + this._callback.request.resultCount);

	// insertions/removals

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 336);
if (!this._index)
	{
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 338);
if (this.get('totalRecordsReturnExpr'))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 340);
eval('response'+this.get('totalRecordsReturnExpr')+'='+this._callback.response.results.length);
		}
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 342);
this._count = this.get('extractTotalRecords')(response);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 344);
this._index = [];
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 345);
for (var i=0; i<this._count; i++)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 347);
this._index.push(i);
		}
	}
	else
	{
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 352);
var adjust = this._callback.adjust;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 353);
for (var i=adjust.indexStart, k=0; i<adjust.indexEnd; i++, k++)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 355);
var j = this._index[i];
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 356);
if (inserted_re.test(j))
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 358);
var id = j.substr(inserted_prefix.length);
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 359);
response.results.splice(k,0, Y.clone(this._new[id], true));
			}
			else {_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 361);
if (removed_re.test(j))
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 363);
response.results.splice(k,1);
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 364);
k--;
			}}
		}
	}

	// save results so we can refer to them later

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 371);
this._records   = [];
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 372);
this._recordMap = {};
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 373);
var uniqueIdKey = this.get('uniqueIdKey');

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 375);
Y.Array.each(response.results, function(value)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 3)", 375);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 377);
var rec = Y.clone(value, true);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 378);
this._records.push(rec);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 379);
this._recordMap[ rec[ uniqueIdKey ] ] = rec;
	},
	this);

	// merge in diffs

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 385);
Y.Array.each(response.results, function(rec)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 4)", 385);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 387);
var diff = this._diff[ rec[ uniqueIdKey ] ];
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 388);
if (diff)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 390);
Y.mix(rec, diff, true);
		}
	},
	this);

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 395);
this._callback.response = response;
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 396);
this.fire('response', this._callback);
}

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 399);
Y.extend(BulkEditDataSource, Y.DataSource.Local,
{
	initializer: function(config)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "initializer", 401);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 403);
if (!(config.ds instanceof Y.DataSource.Local))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 405);
Y.error('BulkEditDataSource requires DataSource');
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 408);
if (!config.generateRequest)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 410);
Y.error('BulkEditDataSource requires generateRequest function');
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 413);
if (!config.uniqueIdKey)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 415);
Y.error('BulkEditDataSource requires uniqueIdKey configuration');
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 418);
if (!config.extractTotalRecords)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 420);
Y.error('BulkEditDataSource requires extractTotalRecords function');
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 423);
this._index = null;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 424);
this._count = 0;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 425);
this._new   = {};
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 426);
this._diff  = {};
	},

	/**
	 * @method _dataIsLocal
	 * @protected
	 * @return {boolean} true if the raw data is stored locally
	 */
	_dataIsLocal: function()
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_dataIsLocal", 434);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 436);
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
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_flushCache", 445);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 447);
var ds = this.get('ds');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 448);
if (ds.cache && Y.Lang.isFunction(ds.cache.flush))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 450);
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
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "getRecordCount", 460);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 462);
return this._count;
	},

	/**
	 * @method getCurrentRecords
	 * @return {Number} the records returned by the latest request
	 */
	getCurrentRecords: function()
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "getCurrentRecords", 469);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 471);
return this._records;
	},

	/**
	 * @method getCurrentRecordMap
	 * @return {Object} the records returned by the latest request, keyed by record id
	 */
	getCurrentRecordMap: function()
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "getCurrentRecordMap", 478);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 480);
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
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "getValue", 489);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 493);
if (!this._dataIsLocal())
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 495);
Y.error('BulkEditDataSource.getValue() can only be called when using a local datasource');
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 498);
var j = fromDisplayIndex.call(this, record_index);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 499);
if (j === false)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 501);
return false;
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 504);
j = this._index[j];
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 505);
if (inserted_re.test(j))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 507);
var record_id = j.substr(inserted_prefix.length);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 508);
var record    = this._new[ record_id ];
		}
		else
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 512);
var record    = this.get('ds').get('source')[j];
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 513);
var record_id = record[ this.get('uniqueIdKey') ];
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 516);
if (this._diff[ record_id ] &&
			!Y.Lang.isUndefined(this._diff[ record_id ][ key ]))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 519);
return this._diff[ record_id ][ key ];
		}
		else
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 523);
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
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "getChanges", 534);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 536);
return this._diff;
	},

	/**
	 * @method getRemovedRecordIndexes
	 * @return {Array} list of removed record indices, based on initial ordering
	 */
	getRemovedRecordIndexes: function()
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "getRemovedRecordIndexes", 543);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 545);
var list = [];
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 546);
Y.Array.each(this._index, function(j)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 5)", 546);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 548);
if (removed_re.test(j))
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 550);
list.push(parseInt(j.substr(removed_prefix.length), 10));
			}
		});

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 554);
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
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "insertRecord", 566);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 570);
this._count++;

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 572);
var record_id = String(this.get('generateUniqueId')());

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 574);
this._new[ record_id ]                            = {};
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 575);
this._new[ record_id ][ this.get('uniqueIdKey') ] = record_id;

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 577);
var j = fromDisplayIndex.call(this, index);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 578);
if (j === false)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 580);
j = this._index.length;
		}
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 582);
this._index.splice(j, 0, inserted_prefix+record_id);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 584);
if (record && !Y.Lang.isObject(record))		// clone existing record
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 586);
var s    = record.toString();
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 587);
record   = Y.clone(this._recordMap[s] || this._new[s], true);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 588);
var diff = this._diff[s];
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 589);
if (record && diff)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 591);
Y.mix(record, diff, true);
			}
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 595);
if (record)		// insert initial values into _diff
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 597);
var uniqueIdKey = this.get('uniqueIdKey');
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 598);
Y.Object.each(record, function(value, key)
			{
				_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 6)", 598);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 600);
if (key != uniqueIdKey)
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 602);
this.updateValue(record_id, key, value);
				}
			},
			this);
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 608);
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
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "removeRecord", 619);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 622);
var j = fromDisplayIndex.call(this, index);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 623);
if (j === false)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 625);
return false;
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 628);
this._count--;

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 630);
if (inserted_re.test(this._index[j]))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 632);
var record_id = this._index[j].substr(inserted_prefix.length);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 633);
delete this._new[ record_id ];
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 634);
this._index.splice(j,1);
		}
		else
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 638);
if (this._dataIsLocal())
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 640);
var record_id = this.get('ds').get('source')[ this._index[j] ][ this.get('uniqueIdKey') ].toString();
			}

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 643);
this._index[j] = removed_prefix + this._index[j];
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 646);
if (record_id)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 648);
delete this._diff[ record_id ];
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 651);
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
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "updateValue", 663);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 668);
if (key == this.get('uniqueIdKey'))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 670);
Y.error('BulkEditDataSource.updateValue() does not allow changing the id for a record.  Use BulkEditDataSource.updateRecordId() instead.');
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 673);
record_id = record_id.toString();

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 675);
var record = this._recordMap[ record_id ];
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 676);
if (record && this._getComparator(key)(Y.Lang.isValue(record[key]) ? record[key] : '', Y.Lang.isValue(value) ? value : ''))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 678);
if (this._diff[ record_id ])
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 680);
delete this._diff[ record_id ][ key ];
			}
		}
		else	// might be new record
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 685);
if (!this._diff[ record_id ])
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 687);
this._diff[ record_id ] = {};
			}
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 689);
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
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_getComparator", 699);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 702);
var f = (this._fields[key] && this._fields[key].comparator) || 'string';
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 703);
if (Y.Lang.isFunction(f))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 705);
return f;
		}
		else {_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 707);
if (BulkEditDataSource.comparator[f])
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 709);
return BulkEditDataSource.comparator[f];
		}
		else
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 713);
return BulkEditDataSource.comparator.string;
		}}
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
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "mergeChanges", 725);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 728);
if (!this._dataIsLocal())
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 730);
Y.error('BulkEditDataSource.mergeChanges() can only be called when using a local datasource');
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 733);
record_id = record_id.toString();

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 735);
function merge(rec)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "merge", 735);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 737);
if (rec[ this.get('uniqueIdKey') ].toString() === record_id)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 739);
var diff = this._diff[ record_id ];
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 740);
if (diff)
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 742);
Y.mix(rec, diff, true);
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 743);
delete this._diff[ record_id ];
				}
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 745);
return true;
			}
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 749);
var found = false;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 750);
this._flushCache();

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 752);
Y.Array.some(this.get('ds').get('source'), function(value)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 7)", 752);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 754);
if (merge.call(this, value))
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 756);
found = true;
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 757);
return true;
			}
		},
		this);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 762);
if (!found)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 764);
Y.Object.some(this._new, function(value)
			{
				_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 8)", 764);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 766);
if (merge.call(this, value))
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 768);
found = true;
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 769);
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
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "killRecord", 787);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 790);
if (!this._dataIsLocal())
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 792);
Y.error('BulkEditDataSource.killRecord() can only be called when using a local datasource');
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 795);
record_id = record_id.toString();

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 797);
function kill(rec)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "kill", 797);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 799);
if (rec[ this.get('uniqueIdKey') ].toString() === record_id)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 801);
var info = {};
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 802);
this.recordIdToIndex(record_id, info);

				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 804);
var j = this._index[ info.internal_index ];
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 805);
this._index.splice(info.internal_index, 1);
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 806);
if (!inserted_re.test(j))
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 808);
for (var i=info.internal_index; i<this._index.length; i++)
					{
						_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 810);
var k = this._index[i];
						_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 811);
if (removed_re.test(k))
						{
							_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 813);
this._index[i] = removed_prefix +
								(parseInt(k.substr(removed_prefix.length), 10)-1);
						}
						else {_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 816);
if (!inserted_re.test(k))
						{
							_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 818);
this._index[i]--;
						}}
					}
				}

				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 823);
this._count--;
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 824);
delete this._diff[ record_id ];
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 825);
return true;
			}
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 829);
var found = false;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 830);
this._flushCache();

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 832);
var data = this.get('ds').get('source');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 833);
Y.Array.some(data, function(value, i)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 9)", 833);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 835);
if (kill.call(this, value))
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 837);
data.splice(i,1);
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 838);
found = true;
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 839);
return true;
			}
		},
		this);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 844);
if (!found)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 846);
Y.Object.some(this._new, function(value, id)
			{
				_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 10)", 846);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 848);
if (kill.call(this, value))
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 850);
delete this._new[id];
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 851);
found = true;
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 852);
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
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "updateRecordId", 870);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 874);
if (!this._dataIsLocal())
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 876);
Y.error('BulkEditDataSource.updateRecordId() can only be called when using a local datasource');
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 879);
orig_record_id = orig_record_id.toString();
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 880);
new_record_id  = new_record_id.toString();

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 882);
function update(rec)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "update", 882);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 884);
if (rec[ this.get('uniqueIdKey') ].toString() === orig_record_id)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 886);
var info = {};
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 887);
this.recordIdToIndex(orig_record_id, info);
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 888);
var j = info.internal_index;
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 889);
if (inserted_re.test(this._index[j]))
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 891);
this._index[j] = inserted_prefix + new_record_id;
				}

				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 894);
rec[ this.get('uniqueIdKey') ] = new_record_id;
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 895);
if (this._diff[ orig_record_id ])
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 897);
this._diff[ new_record_id ] = this._diff[ orig_record_id ];
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 898);
delete this._diff[ orig_record_id ];
				}
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 900);
return true;
			}
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 904);
var found = false;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 905);
this._flushCache();

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 907);
Y.Array.some(this.get('ds').get('source'), function(value)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 11)", 907);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 909);
if (update.call(this, value))
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 911);
found = true;
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 912);
return true;
			}
		},
		this);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 917);
if (!found)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 919);
Y.Object.some(this._new, function(value, id)
			{
				_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 12)", 919);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 921);
if (update.call(this, value))
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 923);
this._new[ new_record_id ] = value;
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 924);
delete this._new[id];
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 925);
found = true;
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 926);
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
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "recordIdToIndex", 941);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 945);
if (!this._dataIsLocal())
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 947);
Y.error('BulkEditDataSource.recordIdToIndex() can only be called when using a local datasource');
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 950);
record_id = record_id.toString();

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 952);
var records = this.get('ds').get('source');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 953);
var count   = 0;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 954);
for (var i=0; i<this._index.length; i++)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 956);
var j   = this._index[i];
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 957);
var ins = inserted_re.test(j);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 958);
var del = removed_re.test(j);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 959);
if ((ins &&
				 j.substr(inserted_prefix.length) === record_id) ||
				(!ins && !del &&
				 records[j][ this.get('uniqueIdKey') ].toString() === record_id))
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 964);
if (return_info)
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 966);
return_info.internal_index = i;
				}
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 968);
return count;
			}

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 971);
if (!del)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 973);
count++;
			}
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 977);
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
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_defRequestFn", 986);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 988);
this._callback = e;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 989);
adjustRequest.call(this);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 991);
this._generatingRequest = true;

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 993);
this._callback._tId = this.get('ds').sendRequest(
		{
			request: this.get('generateRequest')(this._callback.request),
			callback:
			{
				success: Y.bind(internalSuccess, this),
				failure: Y.bind(internalFailure, this)
			}
		});

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1003);
this._generatingRequest = false;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1004);
checkFinished.call(this);
	}
});

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1008);
Y.BulkEditDataSource = BulkEditDataSource;
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1009);
Y.namespace('DataSource').BulkEdit = BulkEditDataSource;
/**********************************************************************
 * A widget for editing many records at once.
 *
 * @module gallery-bulkedit
 * @main gallery-bulkedit
 */

/**
 * <p>BulkEditor provides the basic structure for editing all the records
 * in a BulkEditDataSource.  The fields for editing a record are rendered
 * into a "row".  This could be a div, a tbody, or something else.</p>
 * 
 * <p>All event handlers must be placed on the container, not individual
 * DOM elements.</p>
 * 
 * <p>Errors must be returned from the server in the order in which records
 * are displayed.  Because of this, when data is sent to the server:</p>
 * <ul>
 * <li>If the server knows the ordering, you can send the diffs.  (Diffs are an unordered map, keyed on the record id.)</li>
 * <li>If the server doesn't know the ordering, you must send all the data.</li>
 * </ul>
 *
 * @class BulkEditor
 * @extends Widget
 * @constructor
 * @param config {Object}
 */
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1037);
function BulkEditor()
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "BulkEditor", 1037);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1039);
BulkEditor.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1042);
BulkEditor.NAME = "bulkedit";

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1044);
BulkEditor.ATTRS =
{
	/**
	 * @attribute ds
	 * @type {DataSource.BulkEdit}
	 * @required
	 * @writeonce
	 */
	ds:
	{
		validator: function(value)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "validator", 1054);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1056);
return (value instanceof BulkEditDataSource);
		},
		writeOnce: true
	},

	/**
	 * Configuration for each field: type (input|select|textarea), label,
	 * validation (css, regex, msg, fn; see
	 * gallery-formmgr-css-validation).  Derived classes can require
	 * additional keys.
	 *
	 * @attribute fields
	 * @type {Object}
	 * @required
	 * @writeonce
	 */
	fields:
	{
		validator: Y.Lang.isObject,
		writeOnce: true
	},

	/**
	 * Paginator for switching between pages of records.  BulkEditor
	 * expects it to be configured to display ValidationPageLinks, so the
	 * user can see which pages have errors that need to be fixed.
	 *
	 * @attribute paginator
	 * @type {Paginator}
	 * @writeonce
	 */
	paginator:
	{
		validator: function(value)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "validator", 1089);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1091);
return (value instanceof Y.Paginator);
		},
		writeOnce: true
	},

	/**
	 * Extra key/value pairs to pass in the DataSource request.
	 * 
	 * @attribute requestExtra
	 * @type {Object}
	 * @writeonce
	 */
	requestExtra:
	{
		value:     {},
		validator: Y.Lang.isObject,
		writeOnce: true
	},

	/**
	 * CSS class used to temporarily highlight a record.
	 *
	 * @attribute pingClass
	 * @type {String}
	 * @default "yui3-bulkedit-ping"
	 */
	pingClass:
	{
		value:     Y.ClassNameManager.getClassName(BulkEditor.NAME, 'ping'),
		validator: Y.Lang.isString
	},

	/**
	 * Duration in seconds that pingClass is applied to a record.
	 *
	 * @attribute pingTimeout
	 * @type {Number}
	 * @default 2
	 */
	pingTimeout:
	{
		value:     2,
		validator: Y.Lang.isNumber
	}
};

/**
 * @event notifyErrors
 * @description Fired when widget-level validation messages need to be displayed.
 * @param msgs {Array} the messages to display
 */
/**
 * @event clearErrorNotification
 * @description Fired when widget-level validation messages should be cleared.
 */
/**
 * @event pageRendered
 * @description Fired every time after the editor has rendered a page.
 */

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1151);
var default_page_size = 1e9,

	id_prefix = 'bulk-editor',
	id_separator = '__',
	id_regex = new RegExp('^' + id_prefix + id_separator + '(.+?)(?:' + id_separator + '(.+?))?$'),

	status_prefix  = 'bulkedit-has',
	status_pattern = status_prefix + '([a-z]+)',
	status_re      = new RegExp(Y.Node.class_re_prefix + status_pattern + Y.Node.class_re_suffix),

	record_status_prefix  = 'bulkedit-hasrecord',
	record_status_pattern = record_status_prefix + '([a-z]+)',
	record_status_re      = new RegExp(Y.Node.class_re_prefix + record_status_pattern + Y.Node.class_re_suffix),

	message_container_class = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'message-text'),

	perl_flags_regex = /^\(\?([a-z]+)\)/;

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1169);
BulkEditor.record_container_class     = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'bd');
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1170);
BulkEditor.record_msg_container_class = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'record-message-container');

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1172);
BulkEditor.field_container_class        = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'field-container');
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1173);
BulkEditor.field_container_class_prefix = BulkEditor.field_container_class + '-';
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1174);
BulkEditor.field_class_prefix           = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'field') + '-';

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1176);
function switchPage(state)
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "switchPage", 1176);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1178);
this.saveChanges();

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1180);
var pg = this.get('paginator');
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1181);
pg.setTotalRecords(state.totalRecords, true);
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1182);
pg.setStartIndex(state.recordOffset, true);
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1183);
pg.setRowsPerPage(state.rowsPerPage, true);
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1184);
pg.setPage(state.page, true);
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1185);
this._updatePageStatus();
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1186);
this.reload();
}

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1189);
Y.extend(BulkEditor, Y.Widget,
{
	initializer: function(config)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "initializer", 1191);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1193);
if (config.paginator)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1195);
config.paginator.on('changeRequest', switchPage, this);
		}
	},

	renderUI: function()
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "renderUI", 1199);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1201);
this.clearServerErrors();
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1202);
this.reload();
	},

	bindUI: function()
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "bindUI", 1205);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1207);
this._attachEvents(this.get('contentBox'));
	},

	/**
	 * Attaches events to the container.
	 *
	 * @method _attachEvents
	 * @param container {Node} node to which events should be attached
	 * @protected
	 */
	_attachEvents: function(
		/* node */	container)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_attachEvents", 1217);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1220);
Y.delegate('bulkeditor|click', handleCheckboxMultiselect, container, '.checkbox-multiselect input', this);
	},

	/**
	 * Reloads the current page of records.  This will erase any changes
	 * unsaved changes!
	 * 
	 * @method reload
	 */
	reload: function()
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "reload", 1229);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1231);
if (!this.busy)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1233);
this.plug(Y.Plugin.BusyOverlay);
		}
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1235);
this.busy.show();

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1237);
var pg = this.get('paginator');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1238);
var request =
		{
			startIndex:  pg ? pg.getStartIndex() : 0,
			resultCount: pg ? pg.getRowsPerPage() : default_page_size
		};
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1243);
Y.mix(request, this.get('requestExtra'));

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1245);
var ds = this.get('ds');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1246);
ds.sendRequest(
		{
			request: request,
			callback:
			{
				success: Y.bind(function(e)
				{
					_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 13)", 1251);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1253);
this.busy.hide();
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1254);
if (pg && pg.getStartIndex() >= ds.getRecordCount())
					{
						_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1256);
pg.setPage(pg.getPreviousPage());
						_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1257);
return;
					}

					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1260);
this._render(e.response);
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1261);
this._updatePaginator(e.response);
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1262);
this.scroll_to_index = -1;
				},
				this),

				failure: Y.bind(function()
				{

					_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 14)", 1266);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1269);
this.busy.hide();
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1270);
this.scroll_to_index = -1;
				},
				this)
			}
		});
	},

	/**
	 * Save the modified values from the current page of records.
	 * 
	 * @method saveChanges
	 */
	saveChanges: function()
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "saveChanges", 1282);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1284);
var ds      = this.get('ds');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1285);
var records = ds.getCurrentRecords();
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1286);
var id_key  = ds.get('uniqueIdKey');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1287);
Y.Object.each(this.get('fields'), function(field, key)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 15)", 1287);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1289);
Y.Array.each(records, function(r)
			{
				_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 16)", 1289);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1291);
var node = this.getFieldElement(r, key),
					tag  = node.get('tagName').toLowerCase(),
					value;
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1294);
if (tag == 'input' && node.get('type').toLowerCase() == 'checkbox')
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1296);
value = node.get('checked') ? field.values.on : field.values.off;
				}
				else {_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1298);
if (tag == 'select' && node.get('multiple'))
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1300);
value = Y.reduce(Y.Node.getDOMNode(node).options, [], function(v, o)
					{
						_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 17)", 1300);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1302);
if (o.selected)
						{
							_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1304);
v.push(o.value);
						}
						_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1306);
return v;
					});
				}
				else
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1311);
value = node.get('value');
				}}

				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1314);
ds.updateValue(r[ id_key ], key, value);
			},
			this);
		},
		this);
	},

	/**
	 * Retrieve *all* the data.  Do not call this if you use server-side
	 * pagination.
	 * 
	 * @method getAllValues
	 * @param callback {Object} callback object which will be invoked by DataSource
	 */
	getAllValues: function(callback)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "getAllValues", 1328);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1330);
var request =
		{
			startIndex:  0,
			resultCount: this.get('ds').getRecordCount()
		};
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1335);
Y.mix(request, this.get('requestExtra'));

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1337);
this.get('ds').sendRequest(
		{
			request:  request,
			callback: callback
		});
	},

	/**
	 * @method getChanges
	 * @return {Object} map of all changed values, keyed by record id
	 */
	getChanges: function()
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "getChanges", 1348);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1350);
return this.get('ds').getChanges();
	},

	/**
	 * <p>Insert a new record.</p>
	 * 
	 * <p>You must reload() the widget after calling this function!</p>
	 * 
	 * @method insertRecord
	 * @param index {Number} insertion index
	 * @param record {Object|String} record to insert or id of record to clone
	 * @return {String} the new record's id
	 */
	insertRecord: function(
		/* int */		index,
		/* object */	record)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "insertRecord", 1363);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1367);
var record_id = this.get('ds').insertRecord(index, record);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1368);
if (index <= this.server_errors.records.length)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1370);
this.server_errors.records.splice(index,0, { id: record_id });
			// leave entry in record_map undefined
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1372);
this._updatePageStatus();
		}
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1374);
return record_id;
	},

	/**
	 * <p>Remove a record.  The removal will be recorded in the diffs.
	 * There is no way to un-remove a record, so if you need that
	 * functionality, you may want to use highlighting to indicate removed
	 * records instead.</p>
	 * 
	 * <p>You must reload() the widget after calling this function!</p>
	 * 
	 * @method removeRecord
	 * @param index {Number}
	 * @return {Boolean} true if the record was successfully removed
	 */
	removeRecord: function(
		/* int */ index)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "removeRecord", 1389);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1392);
if (this.get('ds').removeRecord(index))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1394);
if (index < this.server_errors.records.length)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1396);
var rec = this.server_errors.records[index];
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1397);
this.server_errors.records.splice(index,1);
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1398);
delete this.server_errors.record_map[ rec[ this.get('ds').get('uniqueIdKey') ] ];
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1399);
this._updatePageStatus();
			}
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1401);
return true;
		}
		else
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1405);
return false;
		}
	},

	/**
	 * @method getFieldConfig
	 * @param key {String} field key
	 * @return {Object} field configuration
	 */
	getFieldConfig: function(
		/* string */	key)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "getFieldConfig", 1414);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1417);
return this.get('fields')[key] || {};
	},

	/**
	 * @method getRecordContainerId
	 * @param record {String|Object} record id or record object
	 * @return {String} id of DOM element containing the record's input elements
	 */
	getRecordContainerId: function(
		/* string/object */ record)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "getRecordContainerId", 1425);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1428);
if (Y.Lang.isString(record))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1430);
return id_prefix + id_separator + record;
		}
		else
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1434);
return id_prefix + id_separator + record[ this.get('ds').get('uniqueIdKey') ];
		}
	},

	/**
	 * @method getFieldId
	 * @param record {String|Object} record id or record object
	 * @param key {String} field key
	 * @return {String} id of DOM element containing the field's input element
	 */
	getFieldId: function(
		/* string/object */	record,
		/* string */		key)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "getFieldId", 1444);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1448);
return this.getRecordContainerId(record) + id_separator + key;
	},

	/**
	 * @method getRecordAndFieldKey
	 * @param key {String|Node} field key or field input element
	 * @return {Object} object containing record and field_key
	 */
	getRecordAndFieldKey: function(
		/* string/element */	field)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "getRecordAndFieldKey", 1456);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1459);
var m = id_regex.exec(Y.Lang.isString(field) ? field : field.get('id'));
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1460);
if (m && m.length > 0)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1462);
return { record: this.get('ds').getCurrentRecordMap()[ m[1] ], field_key: m[2] };
		}
	},

	/**
	 * @method getRecordId
	 * @param obj {Object|Node} record object, record container, or any node inside record container
	 * @return {String} record id
	 */
	getRecordId: function(
		/* object/element */	obj)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "getRecordId", 1471);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1474);
if (Y.Lang.isObject(obj) && !obj._node)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1476);
return obj[ this.get('ds').get('uniqueIdKey') ];
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1479);
var node = obj.getAncestorByClassName(BulkEditor.record_container_class, true);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1480);
if (node)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1482);
var m  = id_regex.exec(node.get('id'));
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1483);
if (m && m.length > 0)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1485);
return m[1];
			}
		}
	},

	/**
	 * @method getRecordContainer
	 * @param record {String|Object|Node} record id, record object, record container, or any node inside record container
	 * @return {Node} node containing rendered record
	 */
	getRecordContainer: function(
		/* string/object/element */ record)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "getRecordContainer", 1495);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1498);
if (Y.Lang.isString(record))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1500);
var id = id_prefix + id_separator + record;
		}
		else {_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1502);
if (record && record._node)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1504);
return record.getAncestorByClassName(BulkEditor.record_container_class, true);
		}
		else	// record object
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1508);
var id = this.getRecordContainerId(record);
		}}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1511);
return Y.one('#'+id);
	},

	/**
	 * @method getFieldContainer
	 * @param record {String|Object|Node} record id, record object, record container, or any node inside record container
	 * @param key {String} field key
	 * @return {Node} node containing rendered field
	 */
	getFieldContainer: function(
		/* string/object/element */	record,
		/* string */				key)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "getFieldContainer", 1520);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1524);
var field = this.getFieldElement(record, key);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1525);
return field.getAncestorByClassName(BulkEditor.field_container_class, true);
	},

	/**
	 * @method getFieldElement
	 * @param record {String|Object|Node} record id, record object, record container, or any node inside record container
	 * @param key {String} field key
	 * @return {Node} field's input element
	 */
	getFieldElement: function(
		/* string/object/element */	record,
		/* string */				key)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "getFieldElement", 1534);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1538);
if (record && record._node)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1540);
record = this.getRecordId(record);
		}
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1542);
return Y.one('#'+this.getFieldId(record, key));
	},

	/**
	 * Paginate and/or scroll to make the specified record visible.  Record
	 * is pinged to help the user find it.
	 * 
	 * @method showRecordIndex
	 * @param index {Number} record index
	 */
	showRecordIndex: function(
		/* int */ index)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "showRecordIndex", 1552);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1555);
if (index < 0 || this.get('ds').getRecordCount() <= index)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1557);
return;
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1560);
var pg    = this.get('paginator');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1561);
var start = pg ? pg.getStartIndex() : 0;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1562);
var count = pg ? pg.getRowsPerPage() : default_page_size;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1563);
if (start <= index && index < start+count)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1565);
var node = this.getRecordContainer(this.get('ds').getCurrentRecords()[ index - start ]);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1566);
node.scrollIntoView();
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1567);
this.pingRecord(node);
		}
		else {_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1569);
if (pg)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1571);
this.scroll_to_index = index;
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1572);
pg.setPage(1 + Math.floor(index / count));
		}}
	},

	/**
	 * Paginate and/or scroll to make the specified record visible.  Record
	 * is pinged to help the user find it.
	 * 
	 * @method showRecordId
	 * @param id {Number} record id
	 */
	showRecordId: function(
		/* string */ id)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "showRecordId", 1583);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1586);
var index = this.get('ds').recordIdToIndex(id);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1587);
if (index >= 0)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1589);
this.showRecordIndex(index);
		}
	},

	/**
	 * Apply a class to the DOM element containing the record for a short
	 * while.  Your CSS can use this class to highlight the record in some
	 * way.
	 * 
	 * @method pingRecord
	 * @param record {String|Object|Node} record id, record object, record container, or any node inside record container
	 */
	pingRecord: function(
		/* string/object/element */	record)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "pingRecord", 1601);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1604);
var ping = this.get('pingClass');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1605);
if (ping)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1607);
var node = this.getRecordContainer(record);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1608);
node.addClass(ping);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1609);
Y.later(this.get('pingTimeout')*1000, null, function()
			{
				_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 18)", 1609);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1611);
node.removeClass(ping);
			});
		}
	},

	/**
	 * Render the current page of records.
	 *
	 * @method _render
	 * @protected
	 * @param response {Object} response from data source
	 */
	_render: function(response)
	{

		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_render", 1623);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1626);
var container = this.get('contentBox');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1627);
this._renderContainer(container);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1628);
container.set('scrollTop', 0);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1629);
container.set('scrollLeft', 0);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1631);
Y.Array.each(response.results, function(record)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 19)", 1631);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1633);
var node = this._renderRecordContainer(container, record);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1634);
this._renderRecord(node, record);
		},
		this);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1638);
this.fire('pageRendered');

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1640);
if (this.auto_validate)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1642);
this.validate();
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1645);
if (this.scroll_to_index >= 0)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1647);
this.showRecordIndex(this.scroll_to_index);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1648);
this.scroll_to_index = -1;
		}
	},

	/**
	 * Derived class should override to create a structure for the records.
	 *
	 * @method _renderContainer
	 * @protected
	 * @param container {Node}
	 */
	_renderContainer: function(
		/* element */	container)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_renderContainer", 1659);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1662);
container.set('innerHTML', '');
	},

	/**
	 * Derived class must override to create a container for the record.
	 * 
	 * @method _renderRecordContainer
	 * @protected
	 * @param container {Node}
	 * @param record {Object} record data
	 */
	_renderRecordContainer: function(
		/* element */	container,
		/* object */	record)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_renderRecordContainer", 1673);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1677);
return null;
	},

	/**
	 * Derived class can override if it needs to do more than just call
	 * _renderField() for each field.
	 * 
	 * @method _renderRecord
	 * @protected
	 * @param container {Node} record container
	 * @param record {Object} record data
	 */
	_renderRecord: function(
		/* element */	container,
		/* object */	record)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_renderRecord", 1689);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1693);
Y.Object.each(this.get('fields'), function(field, key)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 20)", 1693);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1695);
this._renderField(
			{
				container: container,
				key:       key,
				value:     record[key],
				field:     field,
				record:    record
			});
		},
		this);
	},

	/**
	 * If _renderRecord is not overridden, derived class must override this
	 * function to render the field.
	 * 
	 * @method _renderField
	 * @protected
	 * @param o {Object}
	 *	container {Node} record container,
	 *	key {String} field key,
	 *	value {Mixed} field value,
	 *	field {Object} field configuration,
	 *	record {Object} record data
	 */
	_renderField: function(
		/* object */ o)
	{
	},

	/**
	 * Update the paginator to match the data source meta information.
	 * 
	 * @method _updatePaginator
	 * @protected
	 * @param response {Object} response from DataSource
	 */
	_updatePaginator: function(response)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_updatePaginator", 1732);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1734);
var pg = this.get('paginator');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1735);
if (pg)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1737);
pg.setTotalRecords(this.get('ds').getRecordCount(), true);
		}
	},

	/**
	 * Clear errors received from the server.  This clears all displayed
	 * messages.
	 * 
	 * @method clearServerErrors
	 */
	clearServerErrors: function()
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "clearServerErrors", 1747);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1749);
if (this.server_errors && this.server_errors.page &&
			this.server_errors.page.length)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1752);
this.fire('clearErrorNotification');
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1755);
this.server_errors =
		{
			page:       [],
			records:    [],
			record_map: {}
		};

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1762);
var pg = this.get('paginator');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1763);
if (pg)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1765);
pg.set('pageStatus', []);
		}
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1767);
this.first_error_page = -1;

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1769);
this._clearValidationMessages();
	},

	/**
	 * Set page level, record level, and field level errors received from
	 * the server.  A message can be either a string (assumed to be an
	 * error) or an object providing msg and type, where type can be
	 * 'error', 'warn', 'info', or 'success'.
	 * 
	 * @method setServerErrors
	 * @param page_errors {Array} list of page-level error messages
	 * @param record_field_errors {Array} list of objects *in record display order*,
	 *		each of which defines id (String), recordError (message),
	 *		and fieldErrors (map of field keys to error messages)
	 */
	setServerErrors: function(
		/* array */	page_errors,
		/* array */	record_field_errors)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "setServerErrors", 1784);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1788);
if (this.server_errors.page.length &&
			(!page_errors || !page_errors.length))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1791);
this.fire('clearErrorNotification');
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1794);
this.server_errors =
		{
			page:       page_errors || [],
			records:    record_field_errors || [],
			record_map: Y.Array.toObject(record_field_errors || [], 'id')
		};

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1801);
this._updatePageStatus();

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1803);
var pg = this.get('paginator');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1804);
if (!pg || pg.getCurrentPage() === this.first_error_page)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1806);
this.validate();
		}
		else
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1810);
this.auto_validate = true;
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1811);
pg.setPage(this.first_error_page);
		}
	},

	/**
	 * Update paginator to show which pages have errors.
	 *
	 * @method _updatePageStatus
	 * @protected
	 */
	_updatePageStatus: function()
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_updatePageStatus", 1821);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1823);
var pg = this.get('paginator');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1824);
if (!pg)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1826);
return;
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1829);
var page_size = pg ? pg.getRowsPerPage() : default_page_size;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1830);
var status    = this.page_status.slice(0);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1832);
this.first_error_page = -1;

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1834);
var r = this.server_errors.records;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1835);
for (var i=0; i<r.length; i++)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1837);
if (r[i].recordError || r[i].fieldErrors)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1839);
var j     = Math.floor(i / page_size);
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1840);
status[j] = 'error';
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1841);
if (this.first_error_page == -1)
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1843);
this.first_error_page = i;
				}
			}
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1848);
pg.set('pageStatus', status);
	},

	/**
	 * Validate the visible values (if using server-side pagination) or all
	 * the values (if using client-side pagination or no pagination).
	 * 
	 * @method validate
	 * @return {Boolean} true if all checked values are acceptable
	 */
	validate: function()
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "validate", 1858);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1860);
this.saveChanges();

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1862);
this._clearValidationMessages();
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1863);
this.auto_validate = true;

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1865);
var status = this._validateVisibleFields();
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1866);
var pg     = this.get('paginator');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1867);
if (!status && pg)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1869);
this.page_status[ pg.getCurrentPage()-1 ] = 'error';
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1872);
status = this._validateAllPages() && status;	// status last to guarantee call

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1874);
if (!status || this.server_errors.page.length ||
			this.server_errors.records.length)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1877);
var err = this.server_errors.page.slice(0);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1878);
if (err.length === 0)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1880);
err.push(Y.FormManager.Strings.validation_error);
			}
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1882);
this.fire('notifyErrors', { msgs: err });

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1884);
this.get('contentBox').getElementsByClassName(BulkEditor.record_container_class).some(function(node)
			{
				_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 21)", 1884);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1886);
if (node.hasClass(status_pattern))
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1888);
node.scrollIntoView();
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1889);
return true;
				}
			});
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1894);
this._updatePageStatus();
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1895);
return status;
	},

	/**
	 * Validate the visible values.
	 * 
	 * @method _validateVisibleFields
	 * @protected
	 * @param container {Node} if null, uses contentBox
	 * @return {Boolean} true if all checked values are acceptable
	 */
	_validateVisibleFields: function(
		/* object */ container)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_validateVisibleFields", 1906);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1909);
var status = true;

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1911);
if (!container)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1913);
container = this.get('contentBox');
		}

		// fields

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1918);
var e1 = container.getElementsByTagName('input');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1919);
var e2 = container.getElementsByTagName('textarea');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1920);
var e3 = container.getElementsByTagName('select');

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1922);
Y.FormManager.cleanValues(e1);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1923);
Y.FormManager.cleanValues(e2);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1925);
status = this._validateElements(e1) && status;	// status last to guarantee call
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1926);
status = this._validateElements(e2) && status;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1927);
status = this._validateElements(e3) && status;

		// records -- after fields, since field class regex would wipe out record class

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1931);
container.getElementsByClassName(BulkEditor.record_container_class).each(function(node)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 22)", 1931);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1933);
var id  = this.getRecordId(node);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1934);
var err = this.server_errors.record_map[id];
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1935);
if (err && err.recordError)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1937);
err = err.recordError;
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1938);
if (Y.Lang.isString(err))
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1940);
var msg  = err;
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1941);
var type = 'error';
				}
				else
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1945);
var msg  = err.msg;
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1946);
var type = err.type;
				}
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1948);
this.displayRecordMessage(id, msg, type, false);
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1949);
status = status && !(type == 'error' || type == 'warn');
			}
		},
		this);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1954);
return status;
	},

	/**
	 * Validate the given elements.
	 * 
	 * @method _validateElements
	 * @protected
	 * @param nodes {NodeList}
	 * @return {Boolean} true if all checked values are acceptable
	 */
	_validateElements: function(
		/* array */ nodes)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_validateElements", 1965);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1968);
var status = true;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1969);
nodes.each(function(node)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 23)", 1969);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1971);
var field_info = this.getRecordAndFieldKey(node);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1972);
if (!field_info)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1974);
return;
			}

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1977);
var field    = this.getFieldConfig(field_info.field_key);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1978);
var msg_list = field.validation && field.validation.msg;

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1980);
var info = Y.FormManager.validateFromCSSData(node, msg_list);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1981);
if (info.error)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1983);
this.displayFieldMessage(node, info.error, 'error', false);
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1984);
status = false;
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1985);
return;
			}

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1988);
if (info.keepGoing)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1990);
if (field.validation && Y.Lang.isString(field.validation.regex))
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1992);
var flags = '';
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1993);
var m     = perl_flags_regex.exec(field.validation.regex);
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1994);
if (m && m.length == 2)
					{
						_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1996);
flags                  = m[1];
						_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1997);
field.validation.regex = field.validation.regex.replace(perl_flags_regex, '');
					}
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 1999);
field.validation.regex = new RegExp(field.validation.regex, flags);
				}

				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2002);
if (field.validation &&
					field.validation.regex instanceof RegExp &&
					!field.validation.regex.test(node.get('value')))
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2006);
this.displayFieldMessage(node, msg_list && msg_list.regex, 'error', false);
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2007);
status = false;
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2008);
return;
				}
			}

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2012);
if (field.validation &&
				Y.Lang.isFunction(field.validation.fn) &&
				!field.validation.fn.call(this, node))
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2016);
status = false;
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2017);
return;
			}

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2020);
var err = this.server_errors.record_map[ this.getRecordId(field_info.record) ];
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2021);
if (err && err.fieldErrors)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2023);
var f = err.fieldErrors[ field_info.field_key ];
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2024);
if (f)
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2026);
if (Y.Lang.isString(f))
					{
						_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2028);
var msg  = f;
						_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2029);
var type = 'error';
					}
					else
					{
						_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2033);
var msg  = f.msg;
						_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2034);
var type = f.type;
					}
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2036);
this.displayFieldMessage(node, msg, type, false);
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2037);
status = status && !(type == 'error' || type == 'warn');
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2038);
return;
				}
			}
		},
		this);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2044);
return status;
	},

	/**
	 * If the data is stored locally and we paginate, validate all of it
	 * and mark the pages that have invalid values.
	 * 
	 * @method _validateAllPages
	 * @protected
	 * @return {Boolean} true if all checked values are acceptable
	 */
	_validateAllPages: function()
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_validateAllPages", 2055);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2057);
var ds = this.get('ds');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2058);
var pg = this.get('paginator');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2059);
if (!pg || !ds._dataIsLocal())
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2061);
return true;
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2064);
if (!this.validation_node)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2066);
this.validation_node = Y.Node.create('<input></input>');
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2069);
if (!this.validation_keys)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2071);
this.validation_keys = [];
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2072);
Y.Object.each(this.get('fields'), function(value, key)
			{
				_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 24)", 2072);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2074);
if (value.validation)
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2076);
this.validation_keys.push(key);
				}
			},
			this);
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2082);
var count     = ds.getRecordCount();
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2083);
var page_size = pg.getRowsPerPage();
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2084);
for (var i=0; i<count; i++)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2086);
var status = true;
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2087);
Y.Array.each(this.validation_keys, function(key)
			{
				_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 25)", 2087);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2089);
var field = this.get('fields')[key];
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2090);
var value = ds.getValue(i, key);

				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2092);
this.validation_node.set('value', Y.Lang.isUndefined(value) ? '' : value);
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2093);
this.validation_node.set('className', field.validation.css || '');

				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2095);
var info = Y.FormManager.validateFromCSSData(this.validation_node);
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2096);
if (info.error)
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2098);
status = false;
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2099);
return;
				}

				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2102);
if (info.keepGoing)
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2104);
if (field.validation.regex instanceof RegExp &&
						!field.validation.regex.test(value))
					{
						_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2107);
status = false;
						_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2108);
return;
					}
				}
			},
			this);

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2114);
if (!status)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2116);
var j = Math.floor(i / page_size);
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2117);
i     = (j+1)*page_size - 1;	// skip to next page

				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2119);
this.page_status[j] = 'error';
			}
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2123);
return true;
	},

	/**
	 * Clear all displayed messages.
	 * 
	 * @method _clearValidationMessages
	 */
	_clearValidationMessages: function()
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_clearValidationMessages", 2131);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2133);
this.has_validation_messages = false;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2134);
this.auto_validate           = false;
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2135);
this.page_status             = [];

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2137);
this.fire('clearErrorNotification');

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2139);
var container = this.get('contentBox');

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2141);
container.getElementsByClassName(status_pattern).removeClass(status_pattern);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2142);
container.getElementsByClassName(record_status_pattern).removeClass(record_status_pattern);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2143);
container.getElementsByClassName(message_container_class).set('innerHTML', '');
	},

	/**
	 * Display a message for the specified field.
	 * 
	 * @method displayFieldMessage
	 * @param e {Node} field input element
	 * @param msg {String} message to display
	 * @param type {String} message type:  error, warn, info, success
	 * @param scroll {Boolean} whether or not to scroll to the field
	 */
	displayFieldMessage: function(
		/* element */	e,
		/* string */	msg,
		/* string */	type,
		/* boolean */	scroll)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "displayFieldMessage", 2155);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2161);
if (Y.Lang.isUndefined(scroll))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2163);
scroll = !this.has_validation_messages;
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2166);
var bd1     = this.getRecordContainer(e);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2167);
var changed = this._updateRecordStatus(bd1, type, status_pattern, status_re, status_prefix);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2169);
var bd2 = e.getAncestorByClassName(BulkEditor.field_container_class);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2170);
if (Y.FormManager.statusTakesPrecedence(this._getElementStatus(bd2, status_re), type))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2172);
if (msg)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2174);
var m = bd2.getElementsByClassName(message_container_class);
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2175);
if (m && m.size() > 0)
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2177);
m.item(0).set('innerHTML', msg);
				}
			}

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2181);
bd2.replaceClass(status_pattern, status_prefix + type);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2182);
this.has_validation_messages = true;
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2185);
if (changed && scroll)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2187);
bd1.scrollIntoView();
		}
	},

	/**
	 * Display a message for the specified record.
	 * 
	 * @method displayRecordMessage
	 * @param id {String} record id
	 * @param msg {String} message to display
	 * @param type {String} message type:  error, warn, info, success
	 * @param scroll {Boolean} whether or not to scroll to the field
	 */
	displayRecordMessage: function(
		/* string */	id,
		/* string */	msg,
		/* string */	type,
		/* boolean */	scroll)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "displayRecordMessage", 2200);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2206);
if (Y.Lang.isUndefined(scroll))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2208);
scroll = !this.has_validation_messages;
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2211);
var bd1     = this.getRecordContainer(id);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2212);
var changed = this._updateRecordStatus(bd1, type, status_pattern, status_re, status_prefix);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2213);
if (this._updateRecordStatus(bd1, type, record_status_pattern, record_status_re, record_status_prefix) &&
			msg)	// msg last to guarantee call
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2216);
var bd2 = bd1.getElementsByClassName(BulkEditor.record_msg_container_class).item(0);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2217);
if (bd2)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2219);
var m = bd2.getElementsByClassName(message_container_class);
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2220);
if (m && m.size() > 0)
				{
					_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2222);
m.item(0).set('innerHTML', msg);
				}
			}
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2227);
if (changed && scroll)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2229);
bd1.scrollIntoView();
		}
	},

	/**
	 * @method _getElementStatus
	 * @protected
	 * @param n {Node}
	 * @param r {RegExp}
	 * @return {Mixed} status or false
	 */
	_getElementStatus: function(
		/* Node */	n,
		/* regex */	r)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_getElementStatus", 2240);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2244);
var m = r.exec(n.get('className'));
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2245);
return (m && m.length > 1 ? m[1] : false);
	},

	/**
	 * Update the status of the node, if the new status has higher precedence.
	 *
	 * @method _updateRecordStatus
	 * @param bd {Node}
	 * @param type {String} new status
	 * @param p {String} pattern for extracting status
	 * @param r {RegExpr} regex for extracting status
	 * @param prefix {String} status prefix
	 * @return {Boolean} true if status was modified
	 */
	_updateRecordStatus: function(
		/* element */	bd,
		/* string */	type,
		/* string */	p,
		/* regex */		r,
		/* string */	prefix)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_updateRecordStatus", 2259);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2266);
if (Y.FormManager.statusTakesPrecedence(this._getElementStatus(bd, r), type))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2268);
bd.replaceClass(p, prefix + type);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2269);
this.has_validation_messages = true;
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2270);
return true;
		}

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2273);
return false;
	}
});

//
// Markup
//

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2281);
BulkEditor.cleanHTML = function(s)
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "cleanHTML", 2281);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2283);
return (Y.Lang.isValue(s) ? Y.Escape.html(s) : '');
};

/**
 * @property Y.BulkEditor.error_msg_markup
 * @type {String}
 * @static
 */
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2291);
BulkEditor.error_msg_markup = Y.Lang.sub('<div class="{c}"></div>',
{
	c: message_container_class
});

/**
 * @method labelMarkup
 * @static
 * @param o {Object}
 *	key {String} field key,
 *	value {Mixed} field value,
 *	field {Object} field configuration,
 *	record {Object} record data
 * @return {String} markup for the label of the specified field
 */
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2306);
BulkEditor.labelMarkup = function(o)
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "labelMarkup", 2306);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2308);
var label = '<label for="{id}">{label}</label>';

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2310);
return Y.Lang.sub(label,
	{
		id:    this.getFieldId(o.record, o.key),
		label: o.field.label
	});
};

/**
 * Map of field type (input,select,textarea) to function that generates the
 * required markup.  You can add additional entries.  Each function takes a
 * single argument: an object defining
 *	key {String} field key,
 *	value {Mixed} field value,
 *	field {Object} field configuration,
 *	record {Object} record data
 *
 * @property Y.BulkEditor.markup
 * @type {Object}
 * @static
 */
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2330);
BulkEditor.markup =
{
	input: function(o)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "input", 2332);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2334);
var input =
			'<div class="{cont}{key}">' +
				'{label}{msg1}' +
				'<input type="text" id="{id}" value="{value}" class="{field}{key} {yiv}" />' +
				'{msg2}' +
			'</div>';

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2341);
var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2343);
return Y.Lang.sub(input,
		{
			cont:  BulkEditor.field_container_class + ' ' + BulkEditor.field_container_class_prefix,
			field: BulkEditor.field_class_prefix,
			key:   o.key,
			id:    this.getFieldId(o.record, o.key),
			label: label,
			value: BulkEditor.cleanHTML(o.value),
			yiv:   (o.field && o.field.validation && o.field.validation.css) || '',
			msg1:  label ? BulkEditor.error_msg_markup : '',
			msg2:  label ? '' : BulkEditor.error_msg_markup
		});
	},

	select: function(o)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "select", 2357);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2359);
var select =
			'<div class="{cont}{key}">' +
				'{label}{msg1}' +
				'<select id="{id}" class="{field}{key}">{options}</select>' +
				'{msg2}' +
			'</div>';

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2366);
var option = '<option value="{value}" {selected}>{text}</option>';

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2368);
var options = Y.Array.reduce(o.field.values, '', function(s, v)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 26)", 2368);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2370);
return s + Y.Lang.sub(option,
			{
				value:    v.value,
				text:     BulkEditor.cleanHTML(v.text),
				selected: o.value && o.value.toString() === v.value ? 'selected="selected"' : ''
			});
		});

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2378);
var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2380);
return Y.Lang.sub(select,
		{
			cont:  	 BulkEditor.field_container_class + ' ' + BulkEditor.field_container_class_prefix,
			field:   BulkEditor.field_class_prefix,
			key:     o.key,
			id:      this.getFieldId(o.record, o.key),
			label:   label,
			options: options,
			yiv:     (o.field && o.field.validation && o.field.validation.css) || '',
			msg1:    label ? BulkEditor.error_msg_markup : '',
			msg2:    label ? '' : BulkEditor.error_msg_markup
		});
	},

	checkbox: function(o)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "checkbox", 2394);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2396);
var checkbox =
			'<div class="{cont}{key}">' +
				'<input type="checkbox" id="{id}" {value} class="{field}{key}" /> ' +
				'<label for="{id}">{label}</label>' +
				'{msg}' +
			'</div>';

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2403);
var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2405);
return Y.Lang.sub(checkbox,
		{
			cont:  BulkEditor.field_container_class + ' ' + BulkEditor.field_container_class_prefix,
			field: BulkEditor.field_class_prefix,
			key:   o.key,
			id:    this.getFieldId(o.record, o.key),
			label: label,
			value: o.value == o.field.values.on ? 'checked="checked"' : '',
			msg:   BulkEditor.error_msg_markup
		});
	},

	checkboxMultiselect: function(o)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "checkboxMultiselect", 2417);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2419);
var select =
			'<div class="{cont}{key}">' +
				'{label}{msg}' +
				'<div id="{id}-cbs" class="checkbox-multiselect">{cbs}</div>' +
				'<select id="{id}" class="{field}{key}" multiple="multiple" style="display:none;">{options}</select>' +
			'</div>';

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2426);
var id        = this.getFieldId(o.record, o.key),
			has_value = Y.Lang.isArray(o.value);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2429);
var checkbox =
			'<p class="checkbox-multiselect-checkbox">' +
				'<input type="checkbox" id="{id}-{value}" value="{value}" {checked} /> ' +
				'<label for="{id}-{value}">{label}</label>' +
			'</p>';

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2435);
var cbs = Y.Array.reduce(o.field.values, '', function(s, v)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 27)", 2435);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2437);
return s + Y.Lang.sub(checkbox,
			{
				id:      id,
				value:   v.value,
				checked: has_value && Y.Array.indexOf(o.value, v.value) >= 0 ? 'checked="checked"' : '',
				label:   BulkEditor.cleanHTML(v.text)
			});
		});

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2446);
var option = '<option value="{value}" {selected}>{text}</option>';

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2448);
var options = Y.Array.reduce(o.field.values, '', function(s, v)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 28)", 2448);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2450);
return s + Y.Lang.sub(option,
			{
				value:    v.value,
				text:     BulkEditor.cleanHTML(v.text),
				selected: has_value && Y.Array.indexOf(o.value, v.value) >= 0 ? 'selected="selected"' : ''
			});
		});

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2458);
var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2460);
return Y.Lang.sub(select,
		{
			cont:  	 BulkEditor.field_container_class + ' ' + BulkEditor.field_container_class_prefix,
			field:   BulkEditor.field_class_prefix,
			key:     o.key,
			id:      id,
			label:   label,
			cbs:     cbs,
			options: options,
			yiv:     (o.field && o.field.validation && o.field.validation.css) || '',
			msg:     BulkEditor.error_msg_markup
		});
	},

	textarea: function(o)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "textarea", 2474);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2476);
var textarea =
			'<div class="{cont}{key}">' +
				'{label}{msg1}' +
				'<textarea id="{id}" class="satg-textarea-field {prefix}{key} {yiv}">{value}</textarea>' +
				'{msg2}' +
			'</div>';

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2483);
var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2485);
return Y.Lang.sub(textarea,
		{
			cont:   BulkEditor.field_container_class + ' ' + BulkEditor.field_container_class_prefix,
			prefix: BulkEditor.field_class_prefix,
			key:    o.key,
			id:     this.getFieldId(o.record, o.key),
			label:  label,
			value:  BulkEditor.cleanHTML(o.value),
			yiv:    (o.field && o.field.validation && o.field.validation.css) || '',
			msg1:   label ? BulkEditor.error_msg_markup : '',
			msg2:   label ? '' : BulkEditor.error_msg_markup
		});
	}
};

/**
 * @method fieldMarkup
 * @static
 * @param key {String} field key
 * @param record {Object}
 * @return {String} markup for the specified field
 */
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2507);
BulkEditor.fieldMarkup = function(key, record)
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "fieldMarkup", 2507);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2509);
var field = this.getFieldConfig(key);
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2510);
return BulkEditor.markup[ field.type || 'input' ].call(this,
	{
		key:    key,
		value:  record[key],
		field:  field,
		record: record
	});
};

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2519);
function handleCheckboxMultiselect(e)
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "handleCheckboxMultiselect", 2519);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2521);
var cb     = e.currentTarget,
		value  = cb.get('value'),
		select = cb.ancestor('.checkbox-multiselect').next('select');

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2525);
Y.some(Y.Node.getDOMNode(select).options, function(o)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 29)", 2525);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2527);
if (o.value == value)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2529);
o.selected = cb.get('checked');
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2530);
return true;
		}
	});
}

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2535);
Y.BulkEditor = BulkEditor;
/**
 * @module gallery-bulkedit
 */

/**
 * <p>HTMLTableBulkEditor builds an HTML table with one tbody for each
 * record.</p>
 *
 * @class HTMLTableBulkEditor
 * @extends BulkEditor 
 * @constructor
 * @param config {Object}
 */
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2549);
function HTMLTableBulkEditor()
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "HTMLTableBulkEditor", 2549);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2551);
HTMLTableBulkEditor.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2554);
HTMLTableBulkEditor.NAME = "htmltablebulkedit";

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2556);
HTMLTableBulkEditor.ATTRS =
{
	/**
	 * Configuration for each column: key, label, formatter.
	 *
	 * @attribute columns
	 * @type {Array}
	 * @required
	 * @writeonce
	 */
	columns:
	{
		validator: Y.Lang.isObject,
		writeOnce: true
	},

	/**
	 * <p>Array of event delegations that will be attached to the container
	 * via Y.delegate().  Each item is an object defining type, nodes, fn.
	 * The function will be called in the context of the BulkEditor
	 * instance.</p>
	 * 
	 * <p>Attaching events to the container before the table is created does
	 * not work in all browsers.</p>
	 *
	 * @attribute events
	 * @type {Array}
	 * @writeonce
	 */
	events:
	{
		validator: Y.Lang.isObject,
		writeOnce: true
	}
};

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2592);
var cell_class        = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'cell'),
	cell_class_prefix = cell_class + '-',
	odd_class         = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'odd'),
	even_class        = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'even'),
	msg_class         = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'record-message'),
	liner_class       = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'liner'),

	input_class          = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'input'),
	textarea_class       = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'textarea'),
	select_class         = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'select'),
	checkbox_class       = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'checkbox'),
	cb_multiselect_class = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'checkbox-multiselect');

/**
 * Renders an input element in the cell.
 *
 * @method inputFormatter
 * @static
 * @param o {Object} cell, key, value, field, column, record
 */
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2612);
HTMLTableBulkEditor.inputFormatter = function(o)
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "inputFormatter", 2612);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2614);
o.cell.set('innerHTML', BulkEditor.markup.input.call(this, o));
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2615);
o.cell.addClass(input_class);
};

/**
 * Renders a textarea element in the cell.
 *
 * @method textareaFormatter
 * @static
 * @param o {Object} cell, key, value, field, column, record
 */
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2625);
HTMLTableBulkEditor.textareaFormatter = function(o)
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "textareaFormatter", 2625);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2627);
o.cell.set('innerHTML', BulkEditor.markup.textarea.call(this, o));
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2628);
o.cell.addClass(textarea_class);
};

/**
 * Renders a select element in the cell.
 *
 * @method selectFormatter
 * @static
 * @param o {Object} cell, key, value, field, column, record
 */
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2638);
HTMLTableBulkEditor.selectFormatter = function(o)
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "selectFormatter", 2638);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2640);
o.cell.set('innerHTML', BulkEditor.markup.select.call(this, o));
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2641);
o.cell.addClass(select_class);
};

/**
 * Renders a checkbox element in the cell.
 *
 * @method checkboxFormatter
 * @static
 * @param o {Object} cell, key, value, field, column, record
 */
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2651);
HTMLTableBulkEditor.checkboxFormatter = function(o)
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "checkboxFormatter", 2651);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2653);
o.cell.set('innerHTML', BulkEditor.markup.checkbox.call(this, o));
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2654);
o.cell.addClass(checkbox_class);
};

/**
 * Renders a set of checkboxes for multiselect in the cell.
 *
 * @method checkboxMultiselectFormatter
 * @static
 * @param o {Object} cell, key, value, field, column, record
 */
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2664);
HTMLTableBulkEditor.checkboxMultiselectFormatter = function(o)
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "checkboxMultiselectFormatter", 2664);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2666);
o.cell.set('innerHTML', BulkEditor.markup.checkboxMultiselect.call(this, o));
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2667);
o.cell.addClass(cb_multiselect_class);
};

/**
 * Map of field type to cell formatter.
 *
 * @property Y.HTMLTableBulkEditor.defaults
 * @type {Object}
 * @static
 */
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2677);
HTMLTableBulkEditor.defaults =
{
	input:
	{
		formatter: HTMLTableBulkEditor.inputFormatter
	},

	select:
	{
		formatter: HTMLTableBulkEditor.selectFormatter
	},

	checkbox:
	{
		formatter: HTMLTableBulkEditor.checkboxFormatter
	},

	checkboxMultiselect:
	{
		formatter: HTMLTableBulkEditor.checkboxMultiselectFormatter
	},

	textarea:
	{
		formatter: HTMLTableBulkEditor.textareaFormatter
	}
};

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2705);
function moveFocus(e)
{
	_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "moveFocus", 2705);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2707);
e.halt();

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2709);
var info = this.getRecordAndFieldKey(e.target);
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2710);
if (!info)
	{
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2712);
return;
	}

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2715);
var bd = this.getRecordContainer(e.target);
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2716);
if (bd && e.keyCode == 38)
	{
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2718);
bd = bd.previous();
	}
	else {_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2720);
if (bd)
	{
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2722);
bd = bd.next();
	}}

	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2725);
var id = bd && this.getRecordId(bd);
	_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2726);
if (id)
	{
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2728);
var field = this.getFieldElement(id, info.field_key);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2729);
if (field)
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2731);
try
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2733);
field.focus();
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2734);
field.select();
			}
			catch (ex)
			{
				// no way to determine in IE if focus will fail
				// no way to determine if browser allows focus to select elements
			}
		}
	}
}

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2745);
Y.extend(HTMLTableBulkEditor, BulkEditor,
{
	bindUI: function()
	{
		// attach events after creating the table
	},

	_renderContainer: function(
		/* element */	container)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_renderContainer", 2752);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2755);
var table_class = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2757);
if (!this.table ||
			container.get('firstChild').get('tagName').toLowerCase() != 'table' ||
			!container.get('firstChild').hasClass(table_class))
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2761);
var s = Y.Lang.sub('<table class="{t}"><thead class="{hd}"><tr>',
			{
				t:  table_class,
				hd: Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'hd')
			});

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2767);
var row_markup = '<th class="{cell} {prefix}{key}">{label}</th>';

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2769);
s = Y.Array.reduce(this.get('columns'), s, function(s, column)
			{
				_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 30)", 2769);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2771);
return s + Y.Lang.sub(row_markup,
				{
					cell:   cell_class,
					prefix: cell_class_prefix,
					key:    column.key,
					label:  column.label || '&nbsp;'
				});
			});

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2780);
s += '</tr></thead></table>';

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2782);
container.set('innerHTML', s);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2783);
this.table = container.get('firstChild');

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2785);
this._attachEvents(this.table);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2786);
Y.on('key', moveFocus, this.table, 'down:38,40+ctrl', this);

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2788);
Y.Object.each(this.get('events'), function(e)
			{
				_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 31)", 2788);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2790);
Y.delegate(e.type, e.fn, this.table, e.nodes, this);
			},
			this);
		}
		else
		{
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2796);
while (this.table.get('children').size() > 1)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2798);
this.table.get('lastChild').remove().destroy(true);
			}
		}
	},

	_renderRecordContainer: function(
		/* element */	container,
		/* object */	record)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_renderRecordContainer", 2803);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2807);
var body = Y.Node.create('<tbody></tbody>');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2808);
body.set('id', this.getRecordContainerId(record));
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2809);
body.set('className',
			BulkEditor.record_container_class + ' ' +
			((this.table.get('children').size() % 2) ? odd_class : even_class));	// accounts for th row

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2813);
var msg_row = Y.Node.create('<tr></tr>');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2814);
msg_row.set('className', BulkEditor.record_msg_container_class);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2816);
var msg_cell = Y.Node.create('<td></td>');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2817);
msg_cell.set('colSpan', this.get('columns').length);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2818);
msg_cell.set('className', msg_class);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2819);
msg_cell.set('innerHTML', BulkEditor.error_msg_markup);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2821);
msg_row.appendChild(msg_cell);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2822);
body.appendChild(msg_row);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2824);
var row = Y.Node.create('<tr></tr>');
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2825);
body.appendChild(row);

		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2827);
this.table.appendChild(body);
		_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2828);
return row;
	},

	_renderRecord: function(
		/* element */	row,
		/* object */	record)
	{
		_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "_renderRecord", 2831);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2835);
Y.Array.each(this.get('columns'), function(column)
		{
			_yuitest_coverfunc("/build/gallery-bulkedit/gallery-bulkedit.js", "(anonymous 32)", 2835);
_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2837);
var key    = column.key;
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2838);
var field  = this.getFieldConfig(key);

			// create cell

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2842);
var cell = Y.Node.create('<td></td>');
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2843);
cell.set('className', cell_class + ' ' + cell_class_prefix + key);

			// create liner

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2847);
var liner = Y.Node.create('<div></div>');
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2848);
liner.set('className', liner_class);

			// fill in liner

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2852);
var f = null;
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2853);
if (Y.Lang.isFunction(column.formatter))
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2855);
f = column.formatter;
			}
			else {_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2857);
if (field.type && HTMLTableBulkEditor.defaults[ field.type ])
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2859);
f = HTMLTableBulkEditor.defaults[ field.type ].formatter;
			}
			else
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2863);
if (field.type)
				{
				}

				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2867);
f = HTMLTableBulkEditor.defaults.input.formatter;
			}}

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2870);
if (f)
			{
				_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2872);
f.call(this,
				{
					cell:   liner,
					key:    key,
					value:  record[key],
					field:  field,
					column: column,
					record: record
				});
			}

			// append cell

			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2885);
cell.appendChild(liner);
			_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2886);
row.appendChild(cell);
		},
		this);
	}
});

_yuitest_coverline("/build/gallery-bulkedit/gallery-bulkedit.js", 2892);
Y.HTMLTableBulkEditor = HTMLTableBulkEditor;


}, 'gallery-2012.10.10-19-59' ,{optional:['datasource','dataschema','gallery-paginator'], requires:['widget','datasource-local','gallery-busyoverlay','gallery-formmgr-css-validation','gallery-node-optimizations','gallery-scrollintoview','array-extras','gallery-funcprog','escape','event-key','gallery-nodelist-extras2'], skinnable:true});
