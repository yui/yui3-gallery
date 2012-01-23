/**********************************************************************
 * A widget for editing many records at once.
 *
 * @module gallery-bulkedit
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
function BulkEditor()
{
	BulkEditor.superclass.constructor.apply(this, arguments);
}

BulkEditor.NAME = "bulkedit";

BulkEditor.ATTRS =
{
	/**
	 * @config ds
	 * @type {BulkEditDataSource}
	 * @writeonce
	 */
	ds:
	{
		validator: function(value)
		{
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
	 * @config fields
	 * @type {Object}
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
	 * @config paginator
	 * @type {Paginator}
	 * @writeonce
	 */
	paginator:
	{
		validator: function(value)
		{
			return (value instanceof Y.Paginator);
		},
		writeOnce: true
	},

	/**
	 * Extra key/value pairs to pass in the DataSource request.
	 * 
	 * @config requestExtra
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
	 * @config pingClass
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
	 * @config pingTimeout
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
 * @description Fires when widget-level validation messages need to be displayed.
 * @param msgs {Array} the messages to display
 */
/**
 * @event clearErrorNotification
 * @description Fires when widget-level validation messages should be cleared.
 */

var default_page_size = 1e9,

	id_prefix = 'bulk-editor',
	id_separator = '__',
	id_regex = new RegExp('^' + id_prefix + id_separator + '(.+?)(?:' + id_separator + '(.+?))?$'),

	field_container_class        = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'field-container'),
	field_container_class_prefix = field_container_class + '-',
	field_class_prefix           = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'field') + '-',

	class_re_prefix = '(?:^|\\s)(?:',
	class_re_suffix = ')(?:\\s|$)',

	status_prefix  = 'bulkedit-has',
	status_pattern = status_prefix + '([a-z]+)',
	status_re      = new RegExp(class_re_prefix + status_pattern + class_re_suffix),

	record_status_prefix  = 'bulkedit-hasrecord',
	record_status_pattern = record_status_prefix + '([a-z]+)',
	record_status_re      = new RegExp(class_re_prefix + record_status_pattern + class_re_suffix),

	message_container_class = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'message-text'),

	perl_flags_regex = /^\(\?([a-z]+)\)/;

BulkEditor.record_container_class     = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'bd');
BulkEditor.record_msg_container_class = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'record-message-container');

function switchPage(state)
{
	this.saveChanges();

	var pg = this.get('paginator');
	pg.setTotalRecords(state.totalRecords, true);
	pg.setStartIndex(state.recordOffset, true);
	pg.setRowsPerPage(state.rowsPerPage, true);
	pg.setPage(state.page, true);
	this._updatePageStatus();
	this.reload();
}

Y.extend(BulkEditor, Y.Widget,
{
	initializer: function(config)
	{
		if (config.paginator)
		{
			config.paginator.on('changeRequest', switchPage, this);
		}
	},

	renderUI: function()
	{
		this.clearServerErrors();
		this.reload();
	},

	/**
	 * Reloads the current page of records.  This will erase any changes
	 * unsaved changes!
	 */
	reload: function()
	{
		if (!this.busy)
		{
			this.plug(Y.Plugin.BusyOverlay);
		}
		this.busy.show();

		var pg = this.get('paginator');
		var request =
		{
			startIndex:  pg ? pg.getStartIndex() : 0,
			resultCount: pg ? pg.getRowsPerPage() : default_page_size
		};
		Y.mix(request, this.get('requestExtra'));

		var ds = this.get('ds');
		ds.sendRequest(
		{
			request: request,
			callback:
			{
				success: Y.bind(function(e)
				{
					this.busy.hide();
					if (pg && pg.getStartIndex() >= ds.getRecordCount())
					{
						pg.setPage(pg.getPreviousPage());
						return;
					}

					this._render(e.response);
					this._updatePaginator(e.response);
					this.scroll_to_index = -1;
				},
				this),

				failure: Y.bind(function()
				{
					Y.log('error loading data in BulkEditor', 'error');

					this.busy.hide();
					this.scroll_to_index = -1;
				},
				this)
			}
		});
	},

	/**
	 * Save the modified values from the current page of records.
	 */
	saveChanges: function()
	{
		var ds      = this.get('ds');
		var records = ds.getCurrentRecords();
		var id_key  = ds.get('uniqueIdKey');
		Y.Object.each(this.get('fields'), function(value, key)
		{
			Y.Array.each(records, function(r)
			{
				var node = this.getFieldElement(r, key);
				ds.updateValue(r[ id_key ], key, node.get('value'));
			},
			this);
		},
		this);
	},

	/**
	 * Retrieve *all* the data.  Do not call this if you use server-side
	 * pagination.
	 * 
	 * @param callback {Object} callback object which will be invoked by DataSource
	 */
	getAllValues: function(callback)
	{
		var request =
		{
			startIndex:  0,
			resultCount: this.get('ds').getRecordCount()
		};
		Y.mix(request, this.get('requestExtra'));

		this.get('ds').sendRequest(
		{
			request:  request,
			callback: callback
		});
	},

	/**
	 * @return {Object} map of all changed values, keyed by record id
	 */
	getChanges: function()
	{
		return this.get('ds').getChanges();
	},

	/**
	 * <p>Insert a new record.</p>
	 * 
	 * <p>You must reload() the widget after calling this function!</p>
	 * 
	 * @param index {Number} insertion index
	 * @param record {Object|String} record to insert or id of record to clone
	 * @return {String} the new record's id
	 */
	insertRecord: function(
		/* int */		index,
		/* object */	record)
	{
		var record_id = this.get('ds').insertRecord(index, record);
		if (index <= this.server_errors.records.length)
		{
			this.server_errors.records.splice(index,0, { id: record_id });
			// leave entry in record_map undefined
			this._updatePageStatus();
		}
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
	 * @param index {Number}
	 * @return {Boolean} true if the record was successfully removed
	 */
	removeRecord: function(
		/* int */ index)
	{
		if (this.get('ds').removeRecord(index))
		{
			if (index < this.server_errors.records.length)
			{
				var rec = this.server_errors.records[index];
				this.server_errors.records.splice(index,1);
				delete this.server_errors.record_map[ rec[ this.get('ds').get('uniqueIdKey') ] ];
				this._updatePageStatus();
			}
			return true;
		}
		else
		{
			return false;
		}
	},

	/**
	 * @param key {String} field key
	 * @return {Object} field configuration
	 */
	getFieldConfig: function(
		/* string */	key)
	{
		return this.get('fields')[key] || {};
	},

	/**
	 * @param record {String|Object} record id or record object
	 * @return {String} id of DOM element containing the record's input elements
	 */
	getRecordContainerId: function(
		/* string/object */ record)
	{
		if (Y.Lang.isString(record))
		{
			return id_prefix + id_separator + record;
		}
		else
		{
			return id_prefix + id_separator + record[ this.get('ds').get('uniqueIdKey') ];
		}
	},

	/**
	 * @param record {String|Object} record id or record object
	 * @param key {String} field key
	 * @return {String} id of DOM element containing the field's input element
	 */
	getFieldId: function(
		/* string/object */	record,
		/* string */		key)
	{
		return this.getRecordContainerId(record) + id_separator + key;
	},

	/**
	 * @param key {String|Node} field key or field input element
	 * @return {Object} object containing record and field_key
	 */
	getRecordAndFieldKey: function(
		/* string/element */	field)
	{
		var m = id_regex.exec(Y.Lang.isString(field) ? field : field.get('id'));
		if (m && m.length > 0)
		{
			return { record: this.get('ds').getCurrentRecordMap()[ m[1] ], field_key: m[2] };
		}
	},

	/**
	 * @param obj {Object|Node} record object, record container, or any node inside record container
	 * @return {String} record id
	 */
	getRecordId: function(
		/* object/element */	obj)
	{
		if (Y.Lang.isObject(obj) && !(obj instanceof Y.Node))
		{
			return obj[ this.get('ds').get('uniqueIdKey') ];
		}

		var node = obj.getAncestorByClassName(BulkEditor.record_container_class, true);
		if (node)
		{
			var m  = id_regex.exec(node.get('id'));
			if (m && m.length > 0)
			{
				return m[1];
			}
		}
	},

	/**
	 * @param record {String|Object|Node} record id, record object, record container, or any node inside record container
	 * @return {Node} node containing rendered record
	 */
	getRecordContainer: function(
		/* string/object/element */ record)
	{
		if (Y.Lang.isString(record))
		{
			var id = id_prefix + id_separator + record;
		}
		else if (record instanceof Y.Node)
		{
			return record.getAncestorByClassName(BulkEditor.record_container_class, true);
		}
		else	// record object
		{
			var id = this.getRecordContainerId(record);
		}

		return Y.one('#'+id);
	},

	/**
	 * @param record {String|Object|Node} record id, record object, record container, or any node inside record container
	 * @param key {String} field key
	 * @return {Node} node containing rendered field
	 */
	getFieldContainer: function(
		/* string/object/element */	record,
		/* string */				key)
	{
		var field = this.getFieldElement(record, key);
		return field.getAncestorByClassName(field_container_class, true);
	},

	/**
	 * @param record {String|Object|Node} record id, record object, record container, or any node inside record container
	 * @param key {String} field key
	 * @return {Node} field's input element
	 */
	getFieldElement: function(
		/* string/object/element */	record,
		/* string */				key)
	{
		if (record instanceof Y.Node)
		{
			record = this.getRecordId(record);
		}
		return Y.one('#'+this.getFieldId(record, key));
	},

	/**
	 * Paginate and/or scroll to make the specified record visible.  Record
	 * is pinged to help the user find it.
	 * 
	 * @param index {Number} record index
	 */
	showRecordIndex: function(
		/* int */ index)
	{
		if (index < 0 || this.get('ds').getRecordCount() <= index)
		{
			return;
		}

		var pg    = this.get('paginator');
		var start = pg ? pg.getStartIndex() : 0;
		var count = pg ? pg.getRowsPerPage() : default_page_size;
		if (start <= index && index < start+count)
		{
			var node = this.getRecordContainer(this.get('ds').getCurrentRecords()[ index - start ]);
			node.scrollIntoView();
			this.pingRecord(node);
		}
		else if (pg)
		{
			this.scroll_to_index = index;
			pg.setPage(1 + Math.floor(index / count));
		}
	},

	/**
	 * Paginate and/or scroll to make the specified record visible.  Record
	 * is pinged to help the user find it.
	 * 
	 * @param id {Number} record id
	 */
	showRecordId: function(
		/* string */ id)
	{
		var index = this.get('ds').recordIdToIndex(id);
		if (index >= 0)
		{
			this.showRecordIndex(index);
		}
	},

	/**
	 * Apply a class to the DOM element containing the record for a short
	 * while.  Your CSS can use this class to highlight the record in some
	 * way.
	 * 
	 * @param record {String|Object|Node} record id, record object, record container, or any node inside record container
	 */
	pingRecord: function(
		/* string/object/element */	record)
	{
		var ping = this.get('pingClass');
		if (ping)
		{
			var node = this.getRecordContainer(record);
			node.addClass(ping);
			Y.later(this.get('pingTimeout')*1000, null, function()
			{
				node.removeClass(ping);
			});
		}
	},

	/**
	 * Render the current page of records.
	 *
	 * @param response {Object} response from data source
	 * @protected
	 */
	_render: function(response)
	{
		Y.log('_render', 'debug');

		var container = this.get('contentBox');
		Y.Event.purgeElement(container);
		this._renderContainer(container);
		container.set('scrollTop', 0);
		container.set('scrollLeft', 0);

		Y.Array.each(response.results, function(record)
		{
			var node = this._renderRecordContainer(container, record);
			this._renderRecord(node, record);
		},
		this);

		if (this.auto_validate)
		{
			this.validate();
		}

		if (this.scroll_to_index >= 0)
		{
			this.showRecordIndex(this.scroll_to_index);
			this.scroll_to_index = -1;
		}
	},

	/**
	 * Derived class should override to create a structure for the records.
	 *
	 * @param container {Node}
	 * @protected
	 */
	_renderContainer: function(
		/* element */	container)
	{
		container.set('innerHTML', '');
	},

	/**
	 * Derived class must override to create a container for the record.
	 * 
	 * @param container {Node}
	 * @param record {Object} record data
	 * @protected
	 */
	_renderRecordContainer: function(
		/* element */	container,
		/* object */	record)
	{
		return null;
	},

	/**
	 * Derived class can override if it needs to do more than just call
	 * _renderField() for each field.
	 * 
	 * @param container {Node} record container
	 * @param record {Object} record data
	 * @protected
	 */
	_renderRecord: function(
		/* element */	container,
		/* object */	record)
	{
		Y.Object.each(this.get('fields'), function(field, key)
		{
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
	 * @param o {Object}
	 *	container {Node} record container,
	 *	key {String} field key,
	 *	value {Mixed} field value,
	 *	field {Object} field configuration,
	 *	record {Object} record data
	 * @protected
	 */
	_renderField: function(
		/* object */ o)
	{
	},

	/**
	 * Update the paginator to match the data source meta information.
	 * 
	 * @param response {Object} response from DataSource
	 * @protected
	 */
	_updatePaginator: function(response)
	{
		var pg = this.get('paginator');
		if (pg)
		{
			pg.setTotalRecords(this.get('ds').getRecordCount(), true);
		}
	},

	/**
	 * Clear errors received from the server.  This clears all displayed
	 * messages.
	 */
	clearServerErrors: function()
	{
		if (this.server_errors && this.server_errors.page &&
			this.server_errors.page.length)
		{
			this.fire('clearErrorNotification');
		}

		this.server_errors =
		{
			page:       [],
			records:    [],
			record_map: {}
		};

		var pg = this.get('paginator');
		if (pg)
		{
			pg.set('pageStatus', []);
		}
		this.first_error_page = -1;

		this._clearValidationMessages();
	},

	/**
	 * Set page level, record level, and field level errors received from
	 * the server.  A message can be either a string (assumed to be an
	 * error) or an object providing msg and type, where type can be
	 * 'error', 'warn', 'info', or 'success'.
	 * 
	 * @param page_errors {Array} list of page-level error messages
	 * @param record_field_errors {Array} list of objects *in record display order*,
	 *		each of which defines id (String), recordError (message),
	 *		and fieldErrors (map of field keys to error messages)
	 */
	setServerErrors: function(
		/* array */	page_errors,
		/* array */	record_field_errors)
	{
		if (this.server_errors.page.length &&
			(!page_errors || !page_errors.length))
		{
			this.fire('clearErrorNotification');
		}

		this.server_errors =
		{
			page:       page_errors || [],
			records:    record_field_errors || [],
			record_map: Y.Array.toObject(record_field_errors || [], 'id')
		};

		this._updatePageStatus();

		var pg = this.get('paginator');
		if (!pg || pg.getCurrentPage() === this.first_error_page)
		{
			this.validate();
		}
		else
		{
			this.auto_validate = true;
			pg.setPage(this.first_error_page);
		}
	},

	/**
	 * Update paginator to show which pages have errors.
	 *
	 * @protected
	 */
	_updatePageStatus: function()
	{
		var pg = this.get('paginator');
		if (!pg)
		{
			return;
		}

		var page_size = pg ? pg.getRowsPerPage() : default_page_size;
		var status    = this.page_status.slice(0);

		this.first_error_page = -1;

		var r = this.server_errors.records;
		for (var i=0; i<r.length; i++)
		{
			if (r[i].recordError || r[i].fieldErrors)
			{
				var j     = Math.floor(i / page_size);
				status[j] = 'error';
				if (this.first_error_page == -1)
				{
					this.first_error_page = i;
				}
			}
		}

		pg.set('pageStatus', status);
	},

	/**
	 * Validate the visible values (if using server-side pagination) or all
	 * the values (if using client-side pagination or no pagination).
	 * 
	 * @return {Boolean} true if all checked values are acceptable
	 */
	validate: function()
	{
		this.saveChanges();

		this._clearValidationMessages();
		this.auto_validate = true;

		var status = this._validateVisibleFields();
		var pg     = this.get('paginator');
		if (!status && pg)
		{
			this.page_status[ pg.getCurrentPage()-1 ] = 'error';
		}

		status = this._validateAllPages() && status;	// status last to guarantee call

		if (!status || this.server_errors.page.length ||
			this.server_errors.records.length)
		{
			var err = this.server_errors.page.slice(0);
			if (err.length === 0)
			{
				err.push(Y.FormManager.Strings.validation_error);
			}
			this.fire('notifyErrors', { msgs: err });

			this.get('contentBox').getElementsByClassName(BulkEditor.record_container_class).some(function(node)
			{
				if (node.hasClass(status_pattern))
				{
					node.scrollIntoView();
					return true;
				}
			});
		}

		this._updatePageStatus();
		return status;
	},

	/**
	 * Validate the visible values.
	 * 
	 * @param container {Node} if null, uses contentBox
	 * @return {Boolean} true if all checked values are acceptable
	 * @protected
	 */
	_validateVisibleFields: function(
		/* object */ container)
	{
		var status = true;

		if (!container)
		{
			container = this.get('contentBox');
		}

		// fields

		var e1 = container.getElementsByTagName('input');
		var e2 = container.getElementsByTagName('textarea');
		var e3 = container.getElementsByTagName('select');

		Y.FormManager.cleanValues(e1);
		Y.FormManager.cleanValues(e2);

		status = this._validateElements(e1) && status;	// status last to guarantee call
		status = this._validateElements(e2) && status;
		status = this._validateElements(e3) && status;

		// records -- after fields, since field class regex would wipe out record class

		container.getElementsByClassName(BulkEditor.record_container_class).each(function(node)
		{
			var id  = this.getRecordId(node);
			var err = this.server_errors.record_map[id];
			if (err && err.recordError)
			{
				err = err.recordError;
				if (Y.Lang.isString(err))
				{
					var msg  = err;
					var type = 'error';
				}
				else
				{
					var msg  = err.msg;
					var type = err.type;
				}
				this.displayRecordMessage(id, msg, type, false);
				status = status && !(type == 'error' || type == 'warn');
			}
		},
		this);

		return status;
	},

	/**
	 * Validate the given elements.
	 * 
	 * @param nodes {NodeList}
	 * @return {Boolean} true if all checked values are acceptable
	 * @protected
	 */
	_validateElements: function(
		/* array */ nodes)
	{
		var status = true;
		nodes.each(function(node)
		{
			var field_info = this.getRecordAndFieldKey(node);
			if (!field_info)
			{
				return;
			}

			var field    = this.getFieldConfig(field_info.field_key);
			var msg_list = field.validation && field.validation.msg;

			var info = Y.FormManager.validateFromCSSData(node, msg_list);
			if (info.error)
			{
				this.displayFieldMessage(node, info.error, 'error', false);
				status = false;
				return;
			}

			if (info.keepGoing)
			{
				if (field.validation && Y.Lang.isString(field.validation.regex))
				{
					var flags = '';
					var m     = perl_flags_regex.exec(field.validation.regex);
					if (m && m.length == 2)
					{
						flags                  = m[1];
						field.validation.regex = field.validation.regex.replace(perl_flags_regex, '');
					}
					field.validation.regex = new RegExp(field.validation.regex, flags);
				}

				if (field.validation &&
					field.validation.regex instanceof RegExp &&
					!field.validation.regex.test(node.get('value')))
				{
					this.displayFieldMessage(node, msg_list && msg_list.regex, 'error', false);
					status = false;
					return;
				}
			}

			if (field.validation &&
				Y.Lang.isFunction(field.validation.fn) &&
				!field.validation.fn.call(this, node))
			{
				status = false;
				return;
			}

			var err = this.server_errors.record_map[ this.getRecordId(field_info.record) ];
			if (err && err.fieldErrors)
			{
				var f = err.fieldErrors[ field_info.field_key ];
				if (f)
				{
					if (Y.Lang.isString(f))
					{
						var msg  = f;
						var type = 'error';
					}
					else
					{
						var msg  = f.msg;
						var type = f.type;
					}
					this.displayFieldMessage(node, msg, type, false);
					status = status && !(type == 'error' || type == 'warn');
					return;
				}
			}
		},
		this);

		return status;
	},

	/**
	 * If the data is stored locally and we paginate, validate all of it
	 * and mark the pages that have invalid values.
	 * 
	 * @return {Boolean} true if all checked values are acceptable
	 * @protected
	 */
	_validateAllPages: function()
	{
		var ds = this.get('ds');
		var pg = this.get('paginator');
		if (!pg || !ds._dataIsLocal())
		{
			return true;
		}

		if (!this.validation_node)
		{
			this.validation_node = Y.Node.create('<input></input>');
		}

		if (!this.validation_keys)
		{
			this.validation_keys = [];
			Y.Object.each(this.get('fields'), function(value, key)
			{
				if (value.validation)
				{
					this.validation_keys.push(key);
				}
			},
			this);
		}

		var count     = ds.getRecordCount();
		var page_size = pg.getRowsPerPage();
		for (var i=0; i<count; i++)
		{
			var status = true;
			Y.Array.each(this.validation_keys, function(key)
			{
				var field = this.get('fields')[key];
				var value = ds.getValue(i, key);

				this.validation_node.set('value', Y.Lang.isUndefined(value) ? '' : value);
				this.validation_node.set('className', field.validation.css || '');

				var info = Y.FormManager.validateFromCSSData(this.validation_node);
				if (info.error)
				{
					status = false;
					return;
				}

				if (info.keepGoing)
				{
					if (field.validation.regex instanceof RegExp &&
						!field.validation.regex.test(value))
					{
						status = false;
						return;
					}
				}
			},
			this);

			if (!status)
			{
				var j = Math.floor(i / page_size);
				i     = (j+1)*page_size - 1;	// skip to next page

				this.page_status[j] = 'error';
			}
		}

		return true;
	},

	/**
	 * Clear all displayed messages.
	 */
	_clearValidationMessages: function()
	{
		this.has_validation_messages = false;
		this.auto_validate           = false;
		this.page_status             = [];

		this.fire('clearErrorNotification');

		var container = this.get('contentBox');

		container.getElementsByClassName(status_pattern).removeClass(status_pattern);
		container.getElementsByClassName(record_status_pattern).removeClass(record_status_pattern);
		container.getElementsByClassName(message_container_class).set('innerHTML', '');
	},

	/**
	 * Display a message for the specified field.
	 * 
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
		if (Y.Lang.isUndefined(scroll))
		{
			scroll = !this.has_validation_messages;
		}

		var bd1     = this.getRecordContainer(e);
		var changed = this._updateRecordStatus(bd1, type, status_pattern, status_re, status_prefix);

		var bd2 = e.getAncestorByClassName(field_container_class);
		if (Y.FormManager.statusTakesPrecedence(this._getElementStatus(bd2, status_re), type))
		{
			if (msg)
			{
				var m = bd2.getElementsByClassName(message_container_class);
				if (m && m.size() > 0)
				{
					m.item(0).set('innerHTML', msg);
				}
			}

			bd2.replaceClass(status_pattern, status_prefix + type);
			this.has_validation_messages = true;
		}

		if (changed && scroll)
		{
			bd1.scrollIntoView();
		}
	},

	/**
	 * Display a message for the specified record.
	 * 
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
		if (Y.Lang.isUndefined(scroll))
		{
			scroll = !this.has_validation_messages;
		}

		var bd1     = this.getRecordContainer(id);
		var changed = this._updateRecordStatus(bd1, type, status_pattern, status_re, status_prefix);
		if (this._updateRecordStatus(bd1, type, record_status_pattern, record_status_re, record_status_prefix) &&
			msg)	// msg last to guarantee call
		{
			var bd2 = bd1.getElementsByClassName(BulkEditor.record_msg_container_class).item(0);
			if (bd2)
			{
				var m = bd2.getElementsByClassName(message_container_class);
				if (m && m.size() > 0)
				{
					m.item(0).set('innerHTML', msg);
				}
			}
		}

		if (changed && scroll)
		{
			bd1.scrollIntoView();
		}
	},

	/**
	 * @param n {Node}
	 * @param r {RegExp}
	 * @return {Mixed} status or false
	 * @protected
	 */
	_getElementStatus: function(
		/* Node */	n,
		/* regex */	r)
	{
		var m = r.exec(n.get('className'));
		return (m && m.length > 1 ? m[1] : false);
	},

	/**
	 * Update the status of the node, if the new status has higher precedence.
	 *
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
		if (Y.FormManager.statusTakesPrecedence(this._getElementStatus(bd, r), type))
		{
			bd.replaceClass(p, prefix + type);
			this.has_validation_messages = true;
			return true;
		}

		return false;
	}
});

//
// Markup
//

function cleanHTML(s)
{
	if (!s)
	{
		return '';
	}

	return s.toString()
			.replace(/<\/?script>/ig, '')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
}

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
BulkEditor.labelMarkup = function(o)
{
	var label = '<label for="{id}">{label}</label>';

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
BulkEditor.markup =
{
	input: function(o)
	{
		var input =
			'<div class="{cont}{key}">' +
				'{label}{msg1}' +
				'<input type="text" id="{id}" value="{value}" class="{field}{key} {yiv}" />' +
				'{msg2}' +
			'</div>';

		var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';

		return Y.Lang.sub(input,
		{
			cont:  field_container_class + ' ' + field_container_class_prefix,
			field: field_class_prefix,
			key:   o.key,
			id:    this.getFieldId(o.record, o.key),
			label: label,
			value: cleanHTML(o.value),
			yiv:   (o.field && o.field.validation && o.field.validation.css) || '',
			msg1:  label ? BulkEditor.error_msg_markup : '',
			msg2:  label ? '' : BulkEditor.error_msg_markup
		});
	},

	select: function(o)
	{
		var select =
			'<div class="{cont}{key}">' +
				'{label}{msg1}' +
				'<select id="{id}" class="{field}{key}">{options}</select>' +
				'{msg2}' +
			'</div>';

		var option = '<option value="{value}" {selected}>{text}</option>';

		var options = Y.Array.reduce(o.field.values, '', function(s, v)
		{
			return s + Y.Lang.sub(option,
			{
				value:    v.value,
				text:     cleanHTML(v.text),
				selected: o.value && o.value.toString() === v.value ? 'selected' : ''
			});
		});

		var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';

		return Y.Lang.sub(select,
		{
			cont:  	 field_container_class + ' ' + field_container_class_prefix,
			field:   field_class_prefix,
			key:     o.key,
			id:      this.getFieldId(o.record, o.key),
			label:   label,
			options: options,
			yiv:     (o.field && o.field.validation && o.field.validation.css) || '',
			msg1:    label ? BulkEditor.error_msg_markup : '',
			msg2:    label ? '' : BulkEditor.error_msg_markup
		});
	},

	textarea: function(o)
	{
		var textarea =
			'<div class="{cont}{key}">' +
				'{label}{msg1}' +
				'<textarea id="{id}" class="satg-textarea-field {prefix}{key} {yiv}">{value}</textarea>' +
				'{msg2}' +
			'</div>';

		var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';

		return Y.Lang.sub(textarea,
		{
			cont:   field_container_class + ' ' + field_container_class_prefix,
			prefix: field_class_prefix,
			key:    o.key,
			id:     this.getFieldId(o.record, o.key),
			label:  label,
			value:  cleanHTML(o.value),
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
BulkEditor.fieldMarkup = function(key, record)
{
	var field = this.getFieldConfig(key);
	return BulkEditor.markup[ field.type || 'input' ].call(this,
	{
		key:    key,
		value:  record[key],
		field:  field,
		record: record
	});
};

Y.BulkEditor = BulkEditor;
