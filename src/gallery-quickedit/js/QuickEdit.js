"use strict";

/**
 * <p>The QuickEdit plugin provides a new mode for DataTable where all
 * values in the table can be edited simultaneously, controlled by the
 * column configuration.  Each editable cell contains an input field.  If
 * the user decides to save the changes, then you can extract the changed
 * values by calling <code><i>dt</i>.qe.getChanges()</code>.</p>
 *
 * <p>For a column to be editable in QuickEdit mode, the column
 * configuration must include <code>quickEdit</code>.  The contents of
 * this object define the column's behavior in QuickEdit mode.</p>
 *
 * <p>To move up or down within a column while in QuickEdit mode, hold down
 * the Ctrl key and press the up or down arrow.</p>
 *
 * <p>If a column should not be editable, but needs to be formatted
 * differently in QuickEdit mode, then you must define qeFormatter in
 * the column configuration. This is simply a normal cell formatter
 * function that will be used in QuickEdit mode.  The static functions
 * <code>readonly*Formatter</code> provide examples.</p>
 *
 * <p>The following configuration can be provided as part of
 * quickEdit:</p>
 *
 * <dl>
 *
 * <dt>changed</dt><dd>Optional.  The function to call with the old and new
 * value.  Should return true if the values are different.</dd>
 *
 * <dt>formatter</dt><dd>The cell formatter which will render an
 * appropriate form field: &lt;input type="text"&gt;, &lt;textarea&gt;,
 * or &lt;select&gt;.</dd>
 *
 * <dt>validation</dt><dd>Validation configuration for every field in
 * the column.</dd>
 *
 * <dt>copyDown</dt><dd>If true, the top cell in the column will have a
 * button to copy the value down to the rest of the rows.</dd>
 *
 * </dl>
 *
 * <p>The following configuration can be provided as part of
 * quickEdit.validation:</p>
 *
 * <dl>
 *
 * <dt>css</dt><dd>CSS classes encoding basic validation rules:
 *  <dl>
 *  <dt><code>yiv-required</code></dt>
 *      <dd>Value must not be empty.</dd>
 *
 *  <dt><code>yiv-length:[x,y]</code></dt>
 *      <dd>String must be at least x characters and at most y characters.
 *      At least one of x and y must be specified.</dd>
 *
 *  <dt><code>yiv-integer:[x,y]</code></dt>
 *      <dd>The integer value must be at least x and at most y.
 *      x and y are both optional.</dd>
 *
 *  <dt><code>yiv-decimal:[x,y]</code></dt>
 *      <dd>The decimal value must be at least x and at most y.  Exponents are
 *      not allowed.  x and y are both optional.</dd>
 *  </dl>
 * </dd>
 *
 * <dt>fn</dt><dd>A function that will be called with the DataTable as its
 * scope and the cell's form element as the argument. Return true if the
 * value is valid. Otherwise, call this.qe.displayMessage(...) to display
 * an error and return false.</dd>
 *
 * <dt>msg</dt><dd>A map of types to messages that will be displayed
 * when a basic or regex validation rule fails. The valid types are:
 * required, min_length, max_length, integer, decimal, and regex.
 * There is no default for type regex, so you must specify a message if
 * you configure a regex validation.</dd>
 *
 * <dt>regex</dt><dd>Regular expression that the value must satisfy in
 * order to be considered valid.</dd>
 *
 * </dl>
 *
 * <p>Custom QuickEdit Formatters</p>
 *
 * <p>To write a custom cell formatter for QuickEdit mode, you must
 * structure the function as follows:</p>
 *
 * <pre>
 * function myQuickEditFormatter(o) {
 * &nbsp;&nbsp;var markup =
 * &nbsp;&nbsp;&nbsp;&nbsp;'&lt;input type="text" class="{yiv} quickedit-field quickedit-key:{key}" value="{value}"/&gt;' +
 * &nbsp;&nbsp;&nbsp;&nbsp;'{cd}' + Y.Plugin.DataTableQuickEdit.error_display_markup;
 *
 * &nbsp;&nbsp;var qe = o.column.quickEdit;
 * &nbsp;&nbsp;return Y.Lang.sub(markup, {
 * &nbsp;&nbsp;&nbsp;&nbsp;key: o.column.key,
 * &nbsp;&nbsp;&nbsp;&nbsp;value: o.value.toString().replace(/"/g, '&quot;'),
 * &nbsp;&nbsp;&nbsp;&nbsp;yiv: qe.validation ? (qe.validation.css || '') : '',
 * &nbsp;&nbsp;&nbsp;&nbsp;cd: QuickEdit.copyDownFormatter.call(this, o)
 * &nbsp;&nbsp;});
 * };
 * </pre>
 *
 * <p>You can use textarea or select instead of input, but you can only
 * create a single field.</p>
 *
 * <p><code>extractMyEditableValue</code> does not have to be a separate
 * function. The work should normally be done inline in the formatter
 * function, but the name of the sample function makes the point clear.</p>
 *
 * @module gallery-quickedit
 * @namespace Plugin
 * @class DataTableQuickEdit
 * @extends Plugin.Base
 * @constructor
 * @param config {Object} Object literal to set component configuration.
 */
function QuickEdit(config)
{
	QuickEdit.superclass.constructor.call(this, config);
}

QuickEdit.NAME = "QuickEditPlugin";
QuickEdit.NS   = "qe";

QuickEdit.ATTRS =
{
	/**
	 * @attribute changesAlwaysInclude
	 * @description Record keys to always include in result from getChanges().
	 * @type Array
	 */
	changesAlwaysInclude:
	{
		value:     [],
		validator: Y.Lang.isArray
	}
};

var quick_edit_re          = /quickedit-key:([^\s]+)/,
	qe_row_status_prefix   = 'quickedit-has',
	qe_row_status_pattern  = qe_row_status_prefix + '([a-z]+)',
	qe_row_status_re       = new RegExp(Y.Node.class_re_prefix + qe_row_status_pattern + Y.Node.class_re_suffix),
	qe_cell_status_prefix  = 'quickedit-has',
	qe_cell_status_pattern = qe_cell_status_prefix + '([a-z]+)',
	qe_cell_status_re      = new RegExp(Y.Node.class_re_prefix + qe_cell_status_pattern + Y.Node.class_re_suffix);

/**
 * The CSS class that marks the container for the error message inside a cell.
 *
 * @property Y.Plugin.DataTableQuickEdit.error_text_class
 * @type {String}
 */
QuickEdit.error_text_class = 'quickedit-message-text';

/**
 * The markup for the container for the error message inside a cell.
 *
 * @property Y.Plugin.DataTableQuickEdit.error_display_markup
 * @type {String}
 */
QuickEdit.error_display_markup = '<div class="quickedit-message-text"></div>';

/**
 * The CSS class that marks the "Copy Down" button inside a cell.
 *
 * @property Y.Plugin.DataTableQuickEdit.copy_down_button_class
 * @type {String}
 */
QuickEdit.copy_down_button_class = 'quickedit-copy-down';

/**
 * Called with exactly the same arguments as any other cell
 * formatter, this function displays an input field.
 *
 * @method textFormatter
 * @static
 */
QuickEdit.textFormatter = function(o)
{
	var markup =
		'<input type="text" class="{yiv} quickedit-field quickedit-key:{key}" value="{value}"/>' +
		'{cd}' + QuickEdit.error_display_markup;

	var qe = o.column.quickEdit;
	return Y.Lang.sub(markup,
	{
		key:   o.column.key,
		value: o.value.toString().replace(/"/g, '&quot;'),
		yiv:   qe.validation ? (qe.validation.css || '') : '',
		cd:    QuickEdit.copyDownFormatter.call(this, o)
	});
};

/**
 * Called with exactly the same arguments as any other cell
 * formatter, this function displays a textarea field.
 *
 * @method textareaFormatter
 * @static
 */
QuickEdit.textareaFormatter = function(o)
{
	var markup =
		'<textarea class="{yiv} quickedit-field quickedit-key:{key}">{value}</textarea>' +
		'{cd}' + QuickEdit.error_display_markup;

	var qe = o.column.quickEdit;
	return Y.Lang.sub(markup,
	{
		key:   o.column.key,
		value: o.value,
		yiv:   qe.validation ? (qe.validation.css || '') : '',
		cd:    QuickEdit.copyDownFormatter.call(this, o)
	});
};

/**
 * Called with exactly the same arguments as any other cell
 * formatter, this function displays an email address without the
 * anchor tag.  Use this as the column's qeFormatter if the column
 * should not be editable in QuickEdit mode.
 *
 * @method readonlyEmailFormatter
 * @static
 */
QuickEdit.readonlyEmailFormatter = function(o)
{
	return (o.value || '');		// don't need to check for zero
};

/**
 * Called with exactly the same arguments as any other cell
 * formatter, this function displays a link without the anchor tag.
 * Use this as the column's qeFormatter if the column should not be
 * editable in QuickEdit mode.
 *
 * @method readonlyLinkFormatter
 * @static
 */
QuickEdit.readonlyLinkFormatter = function(o)
{
	return (o.value || '');		// don't need to check for zero
};

/**
 * Copy value from first cell to all other cells in the column.
 *
 * @param e {Event} triggering event
 * @private
 */
function copyDown(e)
{
	var cell  = e.currentTarget.ancestor('.yui3-datatable-cell');
	var field = cell.one('.quickedit-field');
	if (!field)
	{
		return;
	}

	var value = Y.Lang.trim(field.get('value'));
	if (!value && value !== 0)
	{
		return;
	}

	while (1)
	{
		cell = this.getCell(cell, 'below');
		if (!cell)
		{
			break;
		}

		field = cell.one('.quickedit-field');
		if (field)
		{
			field.set('value', value);
		}
	}
}

/**
 * Inserts a "Copy down" button if the cell is in the first row of the
 * DataTable.  Call this at the end of your QuickEdit formatter.
 *
 * @method copyDownFormatter
 * @static
 * @param o {Object} cell formatter object
 * @param td {Node} cell
 */
QuickEdit.copyDownFormatter = function(o, td)
{
	if (o.column.quickEdit.copyDown && o.rowIndex === 0)
	{
		return Y.Lang.sub('<button title="Copy down" class="{c}">&darr;</button>',
		{
			c: QuickEdit.copy_down_button_class
		});
	}
	else
	{
		return '';
	}
};

function wrapFormatter(editFmt, origFmt)
{
	return function(o)
	{
		if (!o.record && Y.Lang.isString(origFmt))
		{
			return origFmt;
		}
		else
		{
			return (o.record ? editFmt : origFmt).apply(this, arguments);
		}
	};
}

/**
 * Shift the focus up/down within a column.
 *
 * @private
 */
function moveFocus(e)
{
	var cell = this.getCell(e.target, e.charCode == 38 ? 'above' : 'below');
	if (cell)
	{
		var input = cell.one('.quickedit-field');
		if (input)
		{
			input.focus();
			input.select();
			e.halt(true);
		}
	}
}

/**
 * Parse the column configuration for easy lookup.
 */
function parseColumns()
{
	var forest = this.get('host').get('columns');
	var map    = {};

	function accumulate(list, node)
	{
		if (Y.Lang.isString(node))
		{
			var col = { key: node };
			list.push(col);
			map[node] = col;
		}
		else if (node.children)
		{
			list = Y.reduce(node.children, list, accumulate);
		}
		else
		{
			list.push(node);
			map[ node.key ] = node;
		}

		return list;
	}

	this.column_list = Y.reduce(forest, [], accumulate);
	this.column_map  = map;
}

/**
 * Validate the given form fields.
 *
 * @param e {Array} Array of form fields.
 * @return {boolean} true if all validation checks pass
 * @private
 */
function validateElements(
	/* NodeList */ list)
{
	var host = this.get('host');

	var status = true;
	var count  = list.size();
	for (var i=0; i<count; i++)
	{
		var e  = list.item(i);
		var qe = this.column_map[ this._getColumnKey(e) ].quickEdit;
		if (!qe)
		{
			continue;
		}
		var msg_list = qe.validation ? qe.validation.msg : null;

		var info = Y.FormManager.validateFromCSSData(e, msg_list);
		if (info.error)
		{
			this.displayMessage(e, info.error, 'error');
			status = false;
			continue;
		}

		if (info.keepGoing)
		{
			if (qe.validation &&
				qe.validation.regex instanceof RegExp &&
				!qe.validation.regex.test(e.get('value')))
			{
				this.displayMessage(e, msg_list ? msg_list.regex : null, 'error');
				status = false;
				continue;
			}
		}

		if (qe.validation &&
			Y.Lang.isFunction(qe.validation.fn) &&
			!qe.validation.fn.call(host, e))
		{
			status = false;
			continue;
		}
	}

	return status;
}

Y.extend(QuickEdit, Y.Plugin.Base,
{
	initializer: function(config)
	{
		var host = this.get('host');

		this.hasMessages = false;

		parseColumns.call(this);
		this.get('host').after('columnsChange', parseColumns, this);

		var h = this.afterHostEvent('render', function()
		{
			host.get('boundingBox').delegate('click', copyDown, '.'+QuickEdit.copy_down_button_class, host);
			h.detach();
		});
	},

	/**
	 * Switch to QuickEdit mode.  Columns that have quickEdit defined will
	 * be editable.  If the table has paginators, you must hide them.
	 */
	start: function()
	{
		this.fire('clearErrorNotification');

		var host      = this.get('host');
		this.saveSort = [];
		this.saveEdit = [];
		this.saveFmt  = {};
		for (var i=0; i<this.column_list.length; i++)
		{
			var col = this.column_list[i];
			var key = col.key;
			this.saveSort.push(col.sortable);
			col.sortable = false;
//			this.saveEdit.push(col.editor);
//			col.editor = null;

			var qe  = col.quickEdit;
			var qef = col.qeFormatter;
			if (/*!col.hidden &&*/ (qe || qef))
			{
				var fn = null;
				if (qe && Y.Lang.isFunction(qe.formatter))
				{
					fn = qe.formatter;
				}
				else if (Y.Lang.isFunction(qef))
				{
					fn = qef;
				}
				else
				{
					fn = QuickEdit.textFormatter;
				}

				if (fn)
				{
					this.saveFmt[key] =
					{
						formatter:     col.formatter,
						nodeFormatter: col.nodeFormatter,
						allowHTML:     col.allowHTML
					};

					col.formatter     = wrapFormatter.call(this, fn, col.formatter || col.nodeFormatter);
					col.nodeFormatter = null;
					col.allowHTML     = true;
				}
			}
		}

		var container = host.get('contentBox');
		container.addClass(host.getClassName('quickedit'));
		this.move_event_handle = container.on('key', moveFocus, 'down:38+ctrl,40+ctrl', host);

		// trigger re-parsing of columns -- since we saved references to
		// the column objects, the original forest has been modified :)
		host.set('columns', host.get('columns'));
	},

	/**
	 * Stop QuickEdit mode.  THIS DISCARDS ALL DATA!  If you want to save
	 * the data, call getChanges() BEFORE calling this function.  If the
	 * table has paginators, you must show them.
	 */
	cancel: function()
	{
		this.fire('clearErrorNotification');

		for (var i=0; i<this.column_list.length; i++)
		{
			var col      = this.column_list[i];
			col.sortable = this.saveSort[i];
//			col.editor   = this.saveEdit[i];
		}
		delete this.saveSort;
		delete this.saveEdit;

		Y.each(this.saveFmt, function(fmt, key)
		{
			var col           = this.column_map[key];
			col.formatter     = fmt.formatter;
			col.nodeFormatter = fmt.nodeFormatter;
			col.allowHTML     = fmt.allowHTML;
		},
		this);
		delete this.saveFmt;

		var host      = this.get('host');
		var container = host.get('contentBox');
		container.removeClass(host.getClassName('quickedit'));
		if (this.move_event_handle)
		{
			this.move_event_handle.detach();
			delete this.move_event_handle;
		}

		// trigger re-parsing of columns -- since we saved references to
		// the column objects, the original forest has been modified :)
		host.set('columns', host.get('columns'));
	},

	/**
	 * Return the changed values.  For each row, an object is created with
	 * only the changed values.  The object keys are the column keys.  If
	 * you need values from particular columns to be included always, even
	 * if the value did not change, include the key "changesAlwaysInclude"
	 * in the plugin configuration and pass an array of column keys.
	 *
	 * @return {mixed} array of objects if all validations pass, false otherwise
	 */
	getChanges: function()
	{
		if (!this.validate())
		{
			return false;
		}

		var changes       = [];
		var alwaysInclude = this.get('changesAlwaysInclude');

		var host      = this.get('host');
		var rows      = host._tbodyNode.get('children');
		host.get('data').each(function(rec, i)
		{
			var list = rows.item(i).all('.quickedit-field');

			var change = {};
			changes.push(change);

			var field_count = list.size();
			for (var j=0; j<field_count; j++)
			{
				var field = list.item(j);
				var key   = this._getColumnKey(field);
				var qe    = this.column_map[key].quickEdit;
				var prev  = rec.get(key);

				var val = Y.Lang.trim(field.get('value'));
				if (qe.changed ? qe.changed(prev, val) :
						val !== (prev ? prev.toString() : ''))
				{
					change[key] = val;
				}
			}

			for (var j=0; j<alwaysInclude.length; j++)
			{
				var key     = alwaysInclude[j];
				change[key] = rec.get(key);
			}
		},
		this);

		return changes;
	},

	/**
	 * Validate the QuickEdit data.
	 *
	 * @return {boolean} true if all validation checks pass
	 */
	validate: function()
	{
		this.clearMessages();
		var status = true;
		var host   = this.get('host');

		var e1 = host._tbodyNode.getElementsByTagName('input');
		var e2 = host._tbodyNode.getElementsByTagName('textarea');
		var e3 = host._tbodyNode.getElementsByTagName('select');

		status = validateElements.call(this, e1) && status;	// status last to guarantee call
		status = validateElements.call(this, e2) && status;
		status = validateElements.call(this, e3) && status;

		if (!status)
		{
			this.fire('notifyErrors');
		}

		return status;
	},

	/**
	 * Clear all validation messages in QuickEdit mode.
	 */
	clearMessages: function()
	{
		this.hasMessages = false;

		this.fire('clearErrorNotification');

		var host = this.get('host');
		host._tbodyNode.getElementsByClassName(qe_row_status_pattern)
			.removeClass(qe_row_status_pattern);
		host._tbodyNode.getElementsByClassName(qe_cell_status_pattern)
			.removeClass(qe_cell_status_pattern);
		host._tbodyNode.all('.' + QuickEdit.error_text_class)
			.set('innerHTML', '');
	},

	/**
	 * Display a message for a QuickEdit field.  If an existing message with
	 * a higher precedence is already visible, it will not be replaced.
	 *
	 * @param e {Element} form field
	 * @param msg {String} message to display
	 * @param type {String} message type: error, warn, success, info
	 * @param scroll {boolean} If false, does not scroll, even if this is the first message to display.
	 */
	displayMessage: function(
		/* element */	e,
		/* string */	msg,
		/* string */	type,
		/* boolean */	scroll)
	{
		if (Y.Lang.isUndefined(scroll))
		{
			scroll = true;
		}

		e       = Y.one(e);
		var row = e.getAncestorByTagName('tr');
		if (Y.FormManager.statusTakesPrecedence(this._getElementStatus(row, qe_row_status_re), type))
		{
			if (!this.hasMessages && scroll)
			{
				Y.one(row.get('firstChild')).scrollIntoView();
			}

			row.replaceClass(qe_row_status_pattern, qe_row_status_prefix + type);
			this.hasMessages = true;
		}

		var cell = e.getAncestorByTagName('td');
		if (Y.FormManager.statusTakesPrecedence(this._getElementStatus(cell, qe_cell_status_re), type))
		{
			if (msg)
			{
				cell.one('.' + QuickEdit.error_text_class)
					.set('innerHTML', msg);
			}

			cell.replaceClass(qe_cell_status_pattern, qe_cell_status_prefix + type);
			this.hasMessages = true;
		}
	},

	/**
	 * Return the status of the field.
	 *
	 * @param e {Node} form field
	 * @param r {RegExp} regex to match against className
	 * @return {String}
	 * @protected
	 */
	_getElementStatus: function(
		/* Node */	e,
		/* regex */	r)
	{
		var m = e.get('className').match(r);
		return ((m && m.length) ? m[1] : false);
	},

	/**
	 * Return the column key for the specified field.
	 * 
	 * @param e {Node} form field
	 * @return {String}
	 * @protected
	 */
	_getColumnKey: function(
		/* Node */ e)
	{
		var m = quick_edit_re.exec(e.get('className'));
		return m[1];
	}
});

Y.namespace("Plugin");
Y.Plugin.DataTableQuickEdit = QuickEdit;
