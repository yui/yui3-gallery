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
_yuitest_coverage["/build/gallery-quickedit/gallery-quickedit.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-quickedit/gallery-quickedit.js",
    code: []
};
_yuitest_coverage["/build/gallery-quickedit/gallery-quickedit.js"].code=["YUI.add('gallery-quickedit', function(Y) {","","\"use strict\";","","/**"," * @module gallery-quickedit"," */","","/**"," * <p>The QuickEdit plugin provides a new mode for DataTable where all"," * values in the table can be edited simultaneously, controlled by the"," * column configuration.  Each editable cell contains an input field.  If"," * the user decides to save the changes, then you can extract the changed"," * values by calling <code><i>dt</i>.qe.getChanges()</code>.</p>"," *"," * <p>For a column to be editable in QuickEdit mode, the column"," * configuration must include <code>quickEdit</code>.  The contents of"," * this object define the column's behavior in QuickEdit mode.</p>"," *"," * <p>To move up or down within a column while in QuickEdit mode, hold down"," * the Ctrl key and press the up or down arrow.</p>"," *"," * <p>If a column should not be editable, but needs to be formatted"," * differently in QuickEdit mode, then you must define qeFormatter in"," * the column configuration. This is simply a normal cell formatter"," * function that will be used in QuickEdit mode.  The static functions"," * <code>readonly*Formatter</code> provide examples.</p>"," *"," * <p>The following configuration can be provided as part of"," * quickEdit:</p>"," *"," * <dl>"," *"," * <dt>changed</dt><dd>Optional.  The function to call with the old and new"," * value.  Should return true if the values are different.</dd>"," *"," * <dt>formatter</dt><dd>The cell formatter which will render an"," * appropriate form field: &lt;input type=\"text\"&gt;, &lt;textarea&gt;,"," * or &lt;select&gt;.</dd>"," *"," * <dt>validation</dt><dd>Validation configuration for every field in"," * the column.</dd>"," *"," * <dt>copyDown</dt><dd>If true, the top cell in the column will have a"," * button to copy the value down to the rest of the rows.</dd>"," *"," * </dl>"," *"," * <p>The following configuration can be provided as part of"," * quickEdit.validation:</p>"," *"," * <dl>"," *"," * <dt>css</dt><dd>CSS classes encoding basic validation rules:"," *  <dl>"," *  <dt><code>yiv-required</code></dt>"," *      <dd>Value must not be empty.</dd>"," *"," *  <dt><code>yiv-length:[x,y]</code></dt>"," *      <dd>String must be at least x characters and at most y characters."," *      At least one of x and y must be specified.</dd>"," *"," *  <dt><code>yiv-integer:[x,y]</code></dt>"," *      <dd>The integer value must be at least x and at most y."," *      x and y are both optional.</dd>"," *"," *  <dt><code>yiv-decimal:[x,y]</code></dt>"," *      <dd>The decimal value must be at least x and at most y.  Exponents are"," *      not allowed.  x and y are both optional.</dd>"," *  </dl>"," * </dd>"," *"," * <dt>fn</dt><dd>A function that will be called with the DataTable as its"," * scope and the cell's form element as the argument. Return true if the"," * value is valid. Otherwise, call this.qe.displayMessage(...) to display"," * an error and return false.</dd>"," *"," * <dt>msg</dt><dd>A map of types to messages that will be displayed"," * when a basic or regex validation rule fails. The valid types are:"," * required, min_length, max_length, integer, decimal, and regex."," * There is no default for type regex, so you must specify a message if"," * you configure a regex validation.</dd>"," *"," * <dt>regex</dt><dd>Regular expression that the value must satisfy in"," * order to be considered valid.</dd>"," *"," * </dl>"," *"," * <p>Custom QuickEdit Formatters</p>"," *"," * <p>To write a custom cell formatter for QuickEdit mode, you must"," * structure the function as follows:</p>"," *"," * <pre>"," * function myQuickEditFormatter(o) {"," * &nbsp;&nbsp;var markup ="," * &nbsp;&nbsp;&nbsp;&nbsp;'&lt;input type=\"text\" class=\"{yiv} quickedit-field quickedit-key:{key}\" value=\"{value}\"/&gt;' +"," * &nbsp;&nbsp;&nbsp;&nbsp;'{cd}' + Y.Plugin.DataTableQuickEdit.error_display_markup;"," *"," * &nbsp;&nbsp;var qe = o.column.quickEdit;"," * &nbsp;&nbsp;return Y.Lang.sub(markup, {"," * &nbsp;&nbsp;&nbsp;&nbsp;key: o.column.key,"," * &nbsp;&nbsp;&nbsp;&nbsp;value: o.value.toString().replace(/\"/g, '&quot;'),"," * &nbsp;&nbsp;&nbsp;&nbsp;yiv: qe.validation ? (qe.validation.css || '') : '',"," * &nbsp;&nbsp;&nbsp;&nbsp;cd: QuickEdit.copyDownFormatter.call(this, o)"," * &nbsp;&nbsp;});"," * };"," * </pre>"," *"," * <p>You can use textarea or select instead of input, but you can only"," * create a single field.</p>"," *"," * <p><code>extractMyEditableValue</code> does not have to be a separate"," * function. The work should normally be done inline in the formatter"," * function, but the name of the sample function makes the point clear.</p>"," *"," * @main gallery-quickedit"," * @class DataTableQuickEdit"," * @namespace Plugin"," * @extends Plugin.Base"," * @constructor"," * @param config {Object} Object literal to set component configuration."," */","function QuickEdit(config)","{","	QuickEdit.superclass.constructor.call(this, config);","}","","QuickEdit.NAME = \"QuickEditPlugin\";","QuickEdit.NS   = \"qe\";","","QuickEdit.ATTRS =","{","	/**","	 * @attribute changesAlwaysInclude","	 * @description Record keys to always include in result from getChanges().","	 * @type Array","	 */","	changesAlwaysInclude:","	{","		value:     [],","		validator: Y.Lang.isArray","	},","","	/**","	 * @attribute includeAllRowsInChanges","	 * @description If true, getChanges() returns a record for every row, even if the record is empty.  Set to false if you want getChanges() to only return records that contain data.","	 * @type Boolean","	 * @default true","	 */","	includeAllRowsInChanges:","	{","		value:     true,","		validator: Y.Lang.isBoolean","	},","","	/**","	 * @attribute includeRowIndexInChanges","	 * @description If true, getChanges() includes the row index in each record, using the _row_index key.","	 * @type Boolean","	 * @default false","	 */","	includeRowIndexInChanges:","	{","		value:     false,","		validator: Y.Lang.isBoolean","	}","};","","var quick_edit_re          = /quickedit-key:([^\\s]+)/,","	qe_row_status_prefix   = 'quickedit-has',","	qe_row_status_pattern  = qe_row_status_prefix + '([a-z]+)',","	qe_row_status_re       = new RegExp(Y.Node.class_re_prefix + qe_row_status_pattern + Y.Node.class_re_suffix),","	qe_cell_status_prefix  = 'quickedit-has',","	qe_cell_status_pattern = qe_cell_status_prefix + '([a-z]+)',","	qe_cell_status_re      = new RegExp(Y.Node.class_re_prefix + qe_cell_status_pattern + Y.Node.class_re_suffix);","","/**"," * The CSS class that marks the container for the error message inside a cell."," *"," * @property error_text_class"," * @static"," * @type {String}"," */","QuickEdit.error_text_class = 'quickedit-message-text';","","/**"," * The markup for the container for the error message inside a cell."," *"," * @property error_display_markup"," * @static"," * @type {String}"," */","QuickEdit.error_display_markup = '<div class=\"quickedit-message-text\"></div>';","","/**"," * The CSS class that marks the \"Copy Down\" button inside a cell."," *"," * @property copy_down_button_class"," * @static"," * @type {String}"," */","QuickEdit.copy_down_button_class = 'quickedit-copy-down';","","/**"," * Called with exactly the same arguments as any other cell"," * formatter, this function displays an input field."," *"," * @method textFormatter"," * @static"," * @param o {Object} standard DataTable formatter data"," */","QuickEdit.textFormatter = function(o)","{","	var markup =","		'<input type=\"text\" class=\"{yiv} quickedit-field quickedit-key:{key}\" value=\"{value}\"/>' +","		'{cd}' + QuickEdit.error_display_markup;","","	var qe = o.column.quickEdit;","	return Y.Lang.sub(markup,","	{","		key:   o.column.key,","		value: o.value.toString().replace(/\"/g, '&quot;'),","		yiv:   qe.validation ? (qe.validation.css || '') : '',","		cd:    QuickEdit.copyDownFormatter.call(this, o)","	});","};","","/**"," * Called with exactly the same arguments as any other cell"," * formatter, this function displays a textarea field."," *"," * @method textareaFormatter"," * @static"," * @param o {Object} standard DataTable formatter data"," */","QuickEdit.textareaFormatter = function(o)","{","	var markup =","		'<textarea class=\"{yiv} quickedit-field quickedit-key:{key}\">{value}</textarea>' +","		'{cd}' + QuickEdit.error_display_markup;","","	var qe = o.column.quickEdit;","	return Y.Lang.sub(markup,","	{","		key:   o.column.key,","		value: o.value,","		yiv:   qe.validation ? (qe.validation.css || '') : '',","		cd:    QuickEdit.copyDownFormatter.call(this, o)","	});","};","","/**"," * Called with exactly the same arguments as any other cell"," * formatter, this function displays an email address without the"," * anchor tag.  Use this as the column's qeFormatter if the column"," * should not be editable in QuickEdit mode."," *"," * @method readonlyEmailFormatter"," * @static"," * @param o {Object} standard DataTable formatter data"," */","QuickEdit.readonlyEmailFormatter = function(o)","{","	return (o.value || '');		// don't need to check for zero","};","","/**"," * Called with exactly the same arguments as any other cell"," * formatter, this function displays a link without the anchor tag."," * Use this as the column's qeFormatter if the column should not be"," * editable in QuickEdit mode."," *"," * @method readonlyLinkFormatter"," * @static"," * @param o {Object} standard DataTable formatter data"," */","QuickEdit.readonlyLinkFormatter = function(o)","{","	return (o.value || '');		// don't need to check for zero","};","","/*"," * Copy value from first cell to all other cells in the column."," *"," * @method copyDown"," * @private"," * @param e {Event} triggering event"," */","function copyDown(e)","{","	var cell  = e.currentTarget.ancestor('.yui3-datatable-cell');","	var field = cell.one('.quickedit-field');","	if (!field)","	{","		return;","	}","","	var value = Y.Lang.trim(field.get('value'));","	if (!value && value !== 0)","	{","		return;","	}","","	while (1)","	{","		cell = this.getCell(cell, 'below');","		if (!cell)","		{","			break;","		}","","		field = cell.one('.quickedit-field');","		if (field)","		{","			field.set('value', value);","		}","	}","}","","/**"," * Inserts a \"Copy down\" button if the cell is in the first row of the"," * DataTable.  Call this at the end of your QuickEdit formatter."," *"," * @method copyDownFormatter"," * @static"," * @param o {Object} cell formatter object"," * @param td {Node} cell"," */","QuickEdit.copyDownFormatter = function(o, td)","{","	if (o.column.quickEdit.copyDown && o.rowIndex === 0)","	{","		return Y.Lang.sub('<button title=\"Copy down\" class=\"{c}\">&darr;</button>',","		{","			c: QuickEdit.copy_down_button_class","		});","	}","	else","	{","		return '';","	}","};","","function wrapFormatter(editFmt, origFmt)","{","	return function(o)","	{","		if (!o.record && Y.Lang.isString(origFmt))","		{","			return origFmt;","		}","		else","		{","			return (o.record ? editFmt : origFmt).apply(this, arguments);","		}","	};","}","","/*"," * Shift the focus up/down within a column."," */","function moveFocus(e)","{","	var cell = this.getCell(e.target, e.charCode == 38 ? 'above' : 'below');","	if (cell)","	{","		var input = cell.one('.quickedit-field');","		if (input)","		{","			input.focus();","			input.select();","			e.halt(true);","		}","	}","}","","/*"," * Parse the column configuration for easy lookup."," */","function parseColumns()","{","	var forest = this.get('host').get('columns');","	var map    = {};","","	function accumulate(list, node)","	{","		if (Y.Lang.isString(node))","		{","			var col = { key: node };","			list.push(col);","			map[node] = col;","		}","		else if (node.children)","		{","			list = Y.reduce(node.children, list, accumulate);","		}","		else","		{","			list.push(node);","			map[ node.key ] = node;","		}","","		return list;","	}","","	this.column_list = Y.reduce(forest, [], accumulate);","	this.column_map  = map;","}","","/*"," * Validate the given form fields."," *"," * @method validateElements"," * @private"," * @param e {Array} Array of form fields."," * @return {boolean} true if all validation checks pass"," */","function validateElements(","	/* NodeList */ list)","{","	var host = this.get('host');","","	var status = true;","	var count  = list.size();","	for (var i=0; i<count; i++)","	{","		var e  = list.item(i);","		var qe = this.column_map[ this._getColumnKey(e) ].quickEdit;","		if (!qe)","		{","			continue;","		}","		var msg_list = qe.validation ? qe.validation.msg : null;","","		var info = Y.FormManager.validateFromCSSData(e, msg_list);","		if (info.error)","		{","			this.displayMessage(e, info.error, 'error');","			status = false;","			continue;","		}","","		if (info.keepGoing)","		{","			if (qe.validation &&","				qe.validation.regex instanceof RegExp &&","				!qe.validation.regex.test(e.get('value')))","			{","				this.displayMessage(e, msg_list ? msg_list.regex : null, 'error');","				status = false;","				continue;","			}","		}","","		if (qe.validation &&","			Y.Lang.isFunction(qe.validation.fn) &&","			!qe.validation.fn.call(host, e))","		{","			status = false;","			continue;","		}","	}","","	return status;","}","","Y.extend(QuickEdit, Y.Plugin.Base,","{","	initializer: function(config)","	{","		var host = this.get('host');","","		this.hasMessages = false;","","		parseColumns.call(this);","		this.get('host').after('columnsChange', parseColumns, this);","","		var h = this.afterHostEvent('render', function()","		{","			host.get('boundingBox').delegate('click', copyDown, '.'+QuickEdit.copy_down_button_class, host);","			h.detach();","		});","	},","","	/**","	 * Switch to QuickEdit mode.  Columns that have quickEdit defined will","	 * be editable.  If the table has paginators, you must hide them.","	 * ","	 * @method start","	 */","	start: function()","	{","		this.fire('clearErrorNotification');","","		var host      = this.get('host');","		this.saveSort = [];","		this.saveEdit = [];","		this.saveFmt  = {};","		for (var i=0; i<this.column_list.length; i++)","		{","			var col = this.column_list[i];","			var key = col.key;","			this.saveSort.push(col.sortable);","			col.sortable = false;","//			this.saveEdit.push(col.editor);","//			col.editor = null;","","			var qe  = col.quickEdit;","			var qef = col.qeFormatter;","			if (/*!col.hidden &&*/ (qe || qef))","			{","				var fn = null;","				if (qe && Y.Lang.isFunction(qe.formatter))","				{","					fn = qe.formatter;","				}","				else if (Y.Lang.isFunction(qef))","				{","					fn = qef;","				}","				else","				{","					fn = QuickEdit.textFormatter;","				}","","				if (fn)","				{","					this.saveFmt[key] =","					{","						formatter:     col.formatter,","						nodeFormatter: col.nodeFormatter,","						allowHTML:     col.allowHTML","					};","","					col.formatter     = wrapFormatter.call(this, fn, col.formatter || col.nodeFormatter);","					col.nodeFormatter = null;","					col.allowHTML     = true;","				}","			}","		}","","		var container = host.get('contentBox');","		container.addClass(host.getClassName('quickedit'));","		this.move_event_handle = container.on('key', moveFocus, 'down:38+ctrl,40+ctrl', host);","","		// trigger re-parsing of columns -- since we saved references to","		// the column objects, the original forest has been modified :)","		host.set('columns', host.get('columns'));","	},","","	/**","	 * Stop QuickEdit mode.  THIS DISCARDS ALL DATA!  If you want to save","	 * the data, call getChanges() BEFORE calling this function.  If the","	 * table has paginators, you must show them.","	 * ","	 * @method cancel","	 */","	cancel: function()","	{","		this.fire('clearErrorNotification');","","		for (var i=0; i<this.column_list.length; i++)","		{","			var col      = this.column_list[i];","			col.sortable = this.saveSort[i];","//			col.editor   = this.saveEdit[i];","		}","		delete this.saveSort;","		delete this.saveEdit;","","		Y.each(this.saveFmt, function(fmt, key)","		{","			var col           = this.column_map[key];","			col.formatter     = fmt.formatter;","			col.nodeFormatter = fmt.nodeFormatter;","			col.allowHTML     = fmt.allowHTML;","		},","		this);","		delete this.saveFmt;","","		var host      = this.get('host');","		var container = host.get('contentBox');","		container.removeClass(host.getClassName('quickedit'));","		if (this.move_event_handle)","		{","			this.move_event_handle.detach();","			delete this.move_event_handle;","		}","","		// trigger re-parsing of columns -- since we saved references to","		// the column objects, the original forest has been modified :)","		host.set('columns', host.get('columns'));","	},","","	/**","	 * Return the changed values.  For each row, an object is created with","	 * only the changed values.  The object keys are the column keys.  If","	 * you need values from particular columns to be included always, even","	 * if the value did not change, include the key `changesAlwaysInclude`","	 * in the plugin configuration and pass an array of column keys.","	 * If you need the row indexes, configure `includeRowIndexInChanges`.","	 * ","	 * If you only want the records with changes, configure","	 * `includeAllRowsInChanges` to be false.  For this to be useful, you","	 * will need to configure either `changesAlwaysInclude` or","	 * `includeRowIndexInChanges`.","	 *","	 * @method getChanges","	 * @return {mixed} array of objects if all validations pass, false otherwise","	 */","	getChanges: function()","	{","		if (!this.validate())","		{","			return false;","		}","","		var changes        = [],","			always_include = this.get('changesAlwaysInclude'),","			include_index  = this.get('includeRowIndexInChanges'),","			include_all    = this.get('includeAllRowsInChanges');","","		var host      = this.get('host');","		var rows      = host._tbodyNode.get('children');","		host.get('data').each(function(rec, i)","		{","			var list = rows.item(i).all('.quickedit-field');","","			var change  = {},","				changed = false;","","			var field_count = list.size();","			for (var j=0; j<field_count; j++)","			{","				var field = list.item(j);","				var key   = this._getColumnKey(field);","				var qe    = this.column_map[key].quickEdit;","				var prev  = rec.get(key);","","				var val = Y.Lang.trim(field.get('value'));","				if (qe.changed ? qe.changed(prev, val) :","						val !== (prev ? prev.toString() : ''))","				{","					change[key] = val;","					changed     = true;","				}","			}","","			if (changed || include_all)","			{","				for (var j=0; j<always_include.length; j++)","				{","					var key     = always_include[j];","					change[key] = rec.get(key);","				}","","				if (include_index)","				{","					change._row_index = i;","				}","","				changes.push(change);","			}","		},","		this);","","		return changes;","	},","","	/**","	 * Validate the QuickEdit data.","	 *","	 * @method validate","	 * @return {boolean} true if all validation checks pass","	 */","	validate: function()","	{","		this.clearMessages();","		var status = true;","		var host   = this.get('host');","","		var e1 = host._tbodyNode.getElementsByTagName('input');","		var e2 = host._tbodyNode.getElementsByTagName('textarea');","		var e3 = host._tbodyNode.getElementsByTagName('select');","","		status = validateElements.call(this, e1) && status;	// status last to guarantee call","		status = validateElements.call(this, e2) && status;","		status = validateElements.call(this, e3) && status;","","		if (!status)","		{","			this.fire('notifyErrors');","		}","","		return status;","	},","","	/**","	 * Clear all validation messages in QuickEdit mode.","	 * ","	 * @method clearMessages","	 */","	clearMessages: function()","	{","		this.hasMessages = false;","","		this.fire('clearErrorNotification');","","		var host = this.get('host');","		host._tbodyNode.getElementsByClassName(qe_row_status_pattern)","			.removeClass(qe_row_status_pattern);","		host._tbodyNode.getElementsByClassName(qe_cell_status_pattern)","			.removeClass(qe_cell_status_pattern);","		host._tbodyNode.all('.' + QuickEdit.error_text_class)","			.set('innerHTML', '');","	},","","	/**","	 * Display a message for a QuickEdit field.  If an existing message with","	 * a higher precedence is already visible, it will not be replaced.","	 *","	 * @method displayMessage","	 * @param e {Element} form field","	 * @param msg {String} message to display","	 * @param type {String} message type: error, warn, success, info","	 * @param scroll {boolean} If false, does not scroll, even if this is the first message to display.","	 */","	displayMessage: function(","		/* element */	e,","		/* string */	msg,","		/* string */	type,","		/* boolean */	scroll)","	{","		if (Y.Lang.isUndefined(scroll))","		{","			scroll = true;","		}","","		e       = Y.one(e);","		var row = e.getAncestorByTagName('tr');","		if (Y.FormManager.statusTakesPrecedence(this._getElementStatus(row, qe_row_status_re), type))","		{","			if (!this.hasMessages && scroll)","			{","				Y.one(row.get('firstChild')).scrollIntoView();","			}","","			row.replaceClass(qe_row_status_pattern, qe_row_status_prefix + type);","			this.hasMessages = true;","		}","","		var cell = e.getAncestorByTagName('td');","		if (Y.FormManager.statusTakesPrecedence(this._getElementStatus(cell, qe_cell_status_re), type))","		{","			if (msg)","			{","				cell.one('.' + QuickEdit.error_text_class)","					.set('innerHTML', msg);","			}","","			cell.replaceClass(qe_cell_status_pattern, qe_cell_status_prefix + type);","			this.hasMessages = true;","		}","	},","","	/**","	 * Return the status of the field.","	 *","	 * @method _getElementStatus","	 * @protected","	 * @param e {Node} form field","	 * @param r {RegExp} regex to match against className","	 * @return {String}","	 */","	_getElementStatus: function(","		/* Node */	e,","		/* regex */	r)","	{","		var m = e.get('className').match(r);","		return ((m && m.length) ? m[1] : false);","	},","","	/**","	 * Return the column key for the specified field.","	 * ","	 * @method _getColumnKey","	 * @protected","	 * @param e {Node} form field","	 * @return {String}","	 */","	_getColumnKey: function(","		/* Node */ e)","	{","		var m = quick_edit_re.exec(e.get('className'));","		return m[1];","	}","});","","Y.namespace(\"Plugin\");","Y.Plugin.DataTableQuickEdit = QuickEdit;","","","}, 'gallery-2012.10.31-20-00' ,{optional:['gallery-scrollintoview'], requires:['datatable-base','gallery-formmgr-css-validation','gallery-node-optimizations','gallery-funcprog'], skinnable:true});"];
_yuitest_coverage["/build/gallery-quickedit/gallery-quickedit.js"].lines = {"1":0,"3":0,"124":0,"126":0,"129":0,"130":0,"132":0,"170":0,"185":0,"194":0,"203":0,"213":0,"215":0,"219":0,"220":0,"237":0,"239":0,"243":0,"244":0,"263":0,"265":0,"278":0,"280":0,"290":0,"292":0,"293":0,"294":0,"296":0,"299":0,"300":0,"302":0,"305":0,"307":0,"308":0,"310":0,"313":0,"314":0,"316":0,"330":0,"332":0,"334":0,"341":0,"345":0,"347":0,"349":0,"351":0,"355":0,"363":0,"365":0,"366":0,"368":0,"369":0,"371":0,"372":0,"373":0,"381":0,"383":0,"384":0,"386":0,"388":0,"390":0,"391":0,"392":0,"394":0,"396":0,"400":0,"401":0,"404":0,"407":0,"408":0,"419":0,"422":0,"424":0,"425":0,"426":0,"428":0,"429":0,"430":0,"432":0,"434":0,"436":0,"437":0,"439":0,"440":0,"441":0,"444":0,"446":0,"450":0,"451":0,"452":0,"456":0,"460":0,"461":0,"465":0,"468":0,"472":0,"474":0,"476":0,"477":0,"479":0,"481":0,"482":0,"494":0,"496":0,"497":0,"498":0,"499":0,"500":0,"502":0,"503":0,"504":0,"505":0,"509":0,"510":0,"511":0,"513":0,"514":0,"516":0,"518":0,"520":0,"524":0,"527":0,"529":0,"536":0,"537":0,"538":0,"543":0,"544":0,"545":0,"549":0,"561":0,"563":0,"565":0,"566":0,"569":0,"570":0,"572":0,"574":0,"575":0,"576":0,"577":0,"580":0,"582":0,"583":0,"584":0,"585":0,"587":0,"588":0,"593":0,"614":0,"616":0,"619":0,"624":0,"625":0,"626":0,"628":0,"630":0,"633":0,"634":0,"636":0,"637":0,"638":0,"639":0,"641":0,"642":0,"645":0,"646":0,"650":0,"652":0,"654":0,"655":0,"658":0,"660":0,"663":0,"668":0,"679":0,"680":0,"681":0,"683":0,"684":0,"685":0,"687":0,"688":0,"689":0,"691":0,"693":0,"696":0,"706":0,"708":0,"710":0,"711":0,"713":0,"715":0,"735":0,"737":0,"740":0,"741":0,"742":0,"744":0,"746":0,"749":0,"750":0,"753":0,"754":0,"756":0,"758":0,"762":0,"763":0,"780":0,"781":0,"795":0,"796":0,"800":0,"801":0};
_yuitest_coverage["/build/gallery-quickedit/gallery-quickedit.js"].functions = {"QuickEdit:124":0,"textFormatter:213":0,"textareaFormatter:237":0,"readonlyEmailFormatter:263":0,"readonlyLinkFormatter:278":0,"copyDown:290":0,"copyDownFormatter:330":0,"(anonymous 2):347":0,"wrapFormatter:345":0,"moveFocus:363":0,"accumulate:386":0,"parseColumns:381":0,"validateElements:419":0,"(anonymous 3):479":0,"initializer:470":0,"start:492":0,"(anonymous 4):572":0,"cancel:559":0,"(anonymous 5):626":0,"getChanges:612":0,"validate:677":0,"clearMessages:704":0,"displayMessage:729":0,"_getElementStatus:776":0,"_getColumnKey:792":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-quickedit/gallery-quickedit.js"].coveredLines = 214;
_yuitest_coverage["/build/gallery-quickedit/gallery-quickedit.js"].coveredFunctions = 26;
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 1);
YUI.add('gallery-quickedit', function(Y) {

_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 3);
"use strict";

/**
 * @module gallery-quickedit
 */

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
 * @main gallery-quickedit
 * @class DataTableQuickEdit
 * @namespace Plugin
 * @extends Plugin.Base
 * @constructor
 * @param config {Object} Object literal to set component configuration.
 */
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 124);
function QuickEdit(config)
{
	_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "QuickEdit", 124);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 126);
QuickEdit.superclass.constructor.call(this, config);
}

_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 129);
QuickEdit.NAME = "QuickEditPlugin";
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 130);
QuickEdit.NS   = "qe";

_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 132);
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
	},

	/**
	 * @attribute includeAllRowsInChanges
	 * @description If true, getChanges() returns a record for every row, even if the record is empty.  Set to false if you want getChanges() to only return records that contain data.
	 * @type Boolean
	 * @default true
	 */
	includeAllRowsInChanges:
	{
		value:     true,
		validator: Y.Lang.isBoolean
	},

	/**
	 * @attribute includeRowIndexInChanges
	 * @description If true, getChanges() includes the row index in each record, using the _row_index key.
	 * @type Boolean
	 * @default false
	 */
	includeRowIndexInChanges:
	{
		value:     false,
		validator: Y.Lang.isBoolean
	}
};

_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 170);
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
 * @property error_text_class
 * @static
 * @type {String}
 */
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 185);
QuickEdit.error_text_class = 'quickedit-message-text';

/**
 * The markup for the container for the error message inside a cell.
 *
 * @property error_display_markup
 * @static
 * @type {String}
 */
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 194);
QuickEdit.error_display_markup = '<div class="quickedit-message-text"></div>';

/**
 * The CSS class that marks the "Copy Down" button inside a cell.
 *
 * @property copy_down_button_class
 * @static
 * @type {String}
 */
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 203);
QuickEdit.copy_down_button_class = 'quickedit-copy-down';

/**
 * Called with exactly the same arguments as any other cell
 * formatter, this function displays an input field.
 *
 * @method textFormatter
 * @static
 * @param o {Object} standard DataTable formatter data
 */
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 213);
QuickEdit.textFormatter = function(o)
{
	_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "textFormatter", 213);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 215);
var markup =
		'<input type="text" class="{yiv} quickedit-field quickedit-key:{key}" value="{value}"/>' +
		'{cd}' + QuickEdit.error_display_markup;

	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 219);
var qe = o.column.quickEdit;
	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 220);
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
 * @param o {Object} standard DataTable formatter data
 */
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 237);
QuickEdit.textareaFormatter = function(o)
{
	_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "textareaFormatter", 237);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 239);
var markup =
		'<textarea class="{yiv} quickedit-field quickedit-key:{key}">{value}</textarea>' +
		'{cd}' + QuickEdit.error_display_markup;

	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 243);
var qe = o.column.quickEdit;
	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 244);
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
 * @param o {Object} standard DataTable formatter data
 */
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 263);
QuickEdit.readonlyEmailFormatter = function(o)
{
	_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "readonlyEmailFormatter", 263);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 265);
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
 * @param o {Object} standard DataTable formatter data
 */
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 278);
QuickEdit.readonlyLinkFormatter = function(o)
{
	_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "readonlyLinkFormatter", 278);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 280);
return (o.value || '');		// don't need to check for zero
};

/*
 * Copy value from first cell to all other cells in the column.
 *
 * @method copyDown
 * @private
 * @param e {Event} triggering event
 */
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 290);
function copyDown(e)
{
	_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "copyDown", 290);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 292);
var cell  = e.currentTarget.ancestor('.yui3-datatable-cell');
	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 293);
var field = cell.one('.quickedit-field');
	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 294);
if (!field)
	{
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 296);
return;
	}

	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 299);
var value = Y.Lang.trim(field.get('value'));
	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 300);
if (!value && value !== 0)
	{
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 302);
return;
	}

	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 305);
while (1)
	{
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 307);
cell = this.getCell(cell, 'below');
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 308);
if (!cell)
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 310);
break;
		}

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 313);
field = cell.one('.quickedit-field');
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 314);
if (field)
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 316);
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
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 330);
QuickEdit.copyDownFormatter = function(o, td)
{
	_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "copyDownFormatter", 330);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 332);
if (o.column.quickEdit.copyDown && o.rowIndex === 0)
	{
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 334);
return Y.Lang.sub('<button title="Copy down" class="{c}">&darr;</button>',
		{
			c: QuickEdit.copy_down_button_class
		});
	}
	else
	{
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 341);
return '';
	}
};

_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 345);
function wrapFormatter(editFmt, origFmt)
{
	_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "wrapFormatter", 345);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 347);
return function(o)
	{
		_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "(anonymous 2)", 347);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 349);
if (!o.record && Y.Lang.isString(origFmt))
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 351);
return origFmt;
		}
		else
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 355);
return (o.record ? editFmt : origFmt).apply(this, arguments);
		}
	};
}

/*
 * Shift the focus up/down within a column.
 */
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 363);
function moveFocus(e)
{
	_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "moveFocus", 363);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 365);
var cell = this.getCell(e.target, e.charCode == 38 ? 'above' : 'below');
	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 366);
if (cell)
	{
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 368);
var input = cell.one('.quickedit-field');
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 369);
if (input)
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 371);
input.focus();
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 372);
input.select();
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 373);
e.halt(true);
		}
	}
}

/*
 * Parse the column configuration for easy lookup.
 */
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 381);
function parseColumns()
{
	_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "parseColumns", 381);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 383);
var forest = this.get('host').get('columns');
	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 384);
var map    = {};

	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 386);
function accumulate(list, node)
	{
		_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "accumulate", 386);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 388);
if (Y.Lang.isString(node))
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 390);
var col = { key: node };
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 391);
list.push(col);
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 392);
map[node] = col;
		}
		else {_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 394);
if (node.children)
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 396);
list = Y.reduce(node.children, list, accumulate);
		}
		else
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 400);
list.push(node);
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 401);
map[ node.key ] = node;
		}}

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 404);
return list;
	}

	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 407);
this.column_list = Y.reduce(forest, [], accumulate);
	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 408);
this.column_map  = map;
}

/*
 * Validate the given form fields.
 *
 * @method validateElements
 * @private
 * @param e {Array} Array of form fields.
 * @return {boolean} true if all validation checks pass
 */
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 419);
function validateElements(
	/* NodeList */ list)
{
	_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "validateElements", 419);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 422);
var host = this.get('host');

	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 424);
var status = true;
	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 425);
var count  = list.size();
	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 426);
for (var i=0; i<count; i++)
	{
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 428);
var e  = list.item(i);
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 429);
var qe = this.column_map[ this._getColumnKey(e) ].quickEdit;
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 430);
if (!qe)
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 432);
continue;
		}
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 434);
var msg_list = qe.validation ? qe.validation.msg : null;

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 436);
var info = Y.FormManager.validateFromCSSData(e, msg_list);
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 437);
if (info.error)
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 439);
this.displayMessage(e, info.error, 'error');
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 440);
status = false;
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 441);
continue;
		}

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 444);
if (info.keepGoing)
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 446);
if (qe.validation &&
				qe.validation.regex instanceof RegExp &&
				!qe.validation.regex.test(e.get('value')))
			{
				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 450);
this.displayMessage(e, msg_list ? msg_list.regex : null, 'error');
				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 451);
status = false;
				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 452);
continue;
			}
		}

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 456);
if (qe.validation &&
			Y.Lang.isFunction(qe.validation.fn) &&
			!qe.validation.fn.call(host, e))
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 460);
status = false;
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 461);
continue;
		}
	}

	_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 465);
return status;
}

_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 468);
Y.extend(QuickEdit, Y.Plugin.Base,
{
	initializer: function(config)
	{
		_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "initializer", 470);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 472);
var host = this.get('host');

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 474);
this.hasMessages = false;

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 476);
parseColumns.call(this);
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 477);
this.get('host').after('columnsChange', parseColumns, this);

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 479);
var h = this.afterHostEvent('render', function()
		{
			_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "(anonymous 3)", 479);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 481);
host.get('boundingBox').delegate('click', copyDown, '.'+QuickEdit.copy_down_button_class, host);
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 482);
h.detach();
		});
	},

	/**
	 * Switch to QuickEdit mode.  Columns that have quickEdit defined will
	 * be editable.  If the table has paginators, you must hide them.
	 * 
	 * @method start
	 */
	start: function()
	{
		_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "start", 492);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 494);
this.fire('clearErrorNotification');

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 496);
var host      = this.get('host');
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 497);
this.saveSort = [];
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 498);
this.saveEdit = [];
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 499);
this.saveFmt  = {};
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 500);
for (var i=0; i<this.column_list.length; i++)
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 502);
var col = this.column_list[i];
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 503);
var key = col.key;
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 504);
this.saveSort.push(col.sortable);
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 505);
col.sortable = false;
//			this.saveEdit.push(col.editor);
//			col.editor = null;

			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 509);
var qe  = col.quickEdit;
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 510);
var qef = col.qeFormatter;
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 511);
if (/*!col.hidden &&*/ (qe || qef))
			{
				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 513);
var fn = null;
				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 514);
if (qe && Y.Lang.isFunction(qe.formatter))
				{
					_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 516);
fn = qe.formatter;
				}
				else {_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 518);
if (Y.Lang.isFunction(qef))
				{
					_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 520);
fn = qef;
				}
				else
				{
					_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 524);
fn = QuickEdit.textFormatter;
				}}

				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 527);
if (fn)
				{
					_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 529);
this.saveFmt[key] =
					{
						formatter:     col.formatter,
						nodeFormatter: col.nodeFormatter,
						allowHTML:     col.allowHTML
					};

					_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 536);
col.formatter     = wrapFormatter.call(this, fn, col.formatter || col.nodeFormatter);
					_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 537);
col.nodeFormatter = null;
					_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 538);
col.allowHTML     = true;
				}
			}
		}

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 543);
var container = host.get('contentBox');
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 544);
container.addClass(host.getClassName('quickedit'));
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 545);
this.move_event_handle = container.on('key', moveFocus, 'down:38+ctrl,40+ctrl', host);

		// trigger re-parsing of columns -- since we saved references to
		// the column objects, the original forest has been modified :)
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 549);
host.set('columns', host.get('columns'));
	},

	/**
	 * Stop QuickEdit mode.  THIS DISCARDS ALL DATA!  If you want to save
	 * the data, call getChanges() BEFORE calling this function.  If the
	 * table has paginators, you must show them.
	 * 
	 * @method cancel
	 */
	cancel: function()
	{
		_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "cancel", 559);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 561);
this.fire('clearErrorNotification');

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 563);
for (var i=0; i<this.column_list.length; i++)
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 565);
var col      = this.column_list[i];
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 566);
col.sortable = this.saveSort[i];
//			col.editor   = this.saveEdit[i];
		}
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 569);
delete this.saveSort;
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 570);
delete this.saveEdit;

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 572);
Y.each(this.saveFmt, function(fmt, key)
		{
			_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "(anonymous 4)", 572);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 574);
var col           = this.column_map[key];
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 575);
col.formatter     = fmt.formatter;
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 576);
col.nodeFormatter = fmt.nodeFormatter;
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 577);
col.allowHTML     = fmt.allowHTML;
		},
		this);
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 580);
delete this.saveFmt;

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 582);
var host      = this.get('host');
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 583);
var container = host.get('contentBox');
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 584);
container.removeClass(host.getClassName('quickedit'));
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 585);
if (this.move_event_handle)
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 587);
this.move_event_handle.detach();
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 588);
delete this.move_event_handle;
		}

		// trigger re-parsing of columns -- since we saved references to
		// the column objects, the original forest has been modified :)
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 593);
host.set('columns', host.get('columns'));
	},

	/**
	 * Return the changed values.  For each row, an object is created with
	 * only the changed values.  The object keys are the column keys.  If
	 * you need values from particular columns to be included always, even
	 * if the value did not change, include the key `changesAlwaysInclude`
	 * in the plugin configuration and pass an array of column keys.
	 * If you need the row indexes, configure `includeRowIndexInChanges`.
	 * 
	 * If you only want the records with changes, configure
	 * `includeAllRowsInChanges` to be false.  For this to be useful, you
	 * will need to configure either `changesAlwaysInclude` or
	 * `includeRowIndexInChanges`.
	 *
	 * @method getChanges
	 * @return {mixed} array of objects if all validations pass, false otherwise
	 */
	getChanges: function()
	{
		_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "getChanges", 612);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 614);
if (!this.validate())
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 616);
return false;
		}

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 619);
var changes        = [],
			always_include = this.get('changesAlwaysInclude'),
			include_index  = this.get('includeRowIndexInChanges'),
			include_all    = this.get('includeAllRowsInChanges');

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 624);
var host      = this.get('host');
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 625);
var rows      = host._tbodyNode.get('children');
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 626);
host.get('data').each(function(rec, i)
		{
			_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "(anonymous 5)", 626);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 628);
var list = rows.item(i).all('.quickedit-field');

			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 630);
var change  = {},
				changed = false;

			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 633);
var field_count = list.size();
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 634);
for (var j=0; j<field_count; j++)
			{
				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 636);
var field = list.item(j);
				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 637);
var key   = this._getColumnKey(field);
				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 638);
var qe    = this.column_map[key].quickEdit;
				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 639);
var prev  = rec.get(key);

				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 641);
var val = Y.Lang.trim(field.get('value'));
				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 642);
if (qe.changed ? qe.changed(prev, val) :
						val !== (prev ? prev.toString() : ''))
				{
					_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 645);
change[key] = val;
					_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 646);
changed     = true;
				}
			}

			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 650);
if (changed || include_all)
			{
				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 652);
for (var j=0; j<always_include.length; j++)
				{
					_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 654);
var key     = always_include[j];
					_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 655);
change[key] = rec.get(key);
				}

				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 658);
if (include_index)
				{
					_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 660);
change._row_index = i;
				}

				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 663);
changes.push(change);
			}
		},
		this);

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 668);
return changes;
	},

	/**
	 * Validate the QuickEdit data.
	 *
	 * @method validate
	 * @return {boolean} true if all validation checks pass
	 */
	validate: function()
	{
		_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "validate", 677);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 679);
this.clearMessages();
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 680);
var status = true;
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 681);
var host   = this.get('host');

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 683);
var e1 = host._tbodyNode.getElementsByTagName('input');
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 684);
var e2 = host._tbodyNode.getElementsByTagName('textarea');
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 685);
var e3 = host._tbodyNode.getElementsByTagName('select');

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 687);
status = validateElements.call(this, e1) && status;	// status last to guarantee call
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 688);
status = validateElements.call(this, e2) && status;
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 689);
status = validateElements.call(this, e3) && status;

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 691);
if (!status)
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 693);
this.fire('notifyErrors');
		}

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 696);
return status;
	},

	/**
	 * Clear all validation messages in QuickEdit mode.
	 * 
	 * @method clearMessages
	 */
	clearMessages: function()
	{
		_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "clearMessages", 704);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 706);
this.hasMessages = false;

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 708);
this.fire('clearErrorNotification');

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 710);
var host = this.get('host');
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 711);
host._tbodyNode.getElementsByClassName(qe_row_status_pattern)
			.removeClass(qe_row_status_pattern);
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 713);
host._tbodyNode.getElementsByClassName(qe_cell_status_pattern)
			.removeClass(qe_cell_status_pattern);
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 715);
host._tbodyNode.all('.' + QuickEdit.error_text_class)
			.set('innerHTML', '');
	},

	/**
	 * Display a message for a QuickEdit field.  If an existing message with
	 * a higher precedence is already visible, it will not be replaced.
	 *
	 * @method displayMessage
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
		_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "displayMessage", 729);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 735);
if (Y.Lang.isUndefined(scroll))
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 737);
scroll = true;
		}

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 740);
e       = Y.one(e);
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 741);
var row = e.getAncestorByTagName('tr');
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 742);
if (Y.FormManager.statusTakesPrecedence(this._getElementStatus(row, qe_row_status_re), type))
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 744);
if (!this.hasMessages && scroll)
			{
				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 746);
Y.one(row.get('firstChild')).scrollIntoView();
			}

			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 749);
row.replaceClass(qe_row_status_pattern, qe_row_status_prefix + type);
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 750);
this.hasMessages = true;
		}

		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 753);
var cell = e.getAncestorByTagName('td');
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 754);
if (Y.FormManager.statusTakesPrecedence(this._getElementStatus(cell, qe_cell_status_re), type))
		{
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 756);
if (msg)
			{
				_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 758);
cell.one('.' + QuickEdit.error_text_class)
					.set('innerHTML', msg);
			}

			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 762);
cell.replaceClass(qe_cell_status_pattern, qe_cell_status_prefix + type);
			_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 763);
this.hasMessages = true;
		}
	},

	/**
	 * Return the status of the field.
	 *
	 * @method _getElementStatus
	 * @protected
	 * @param e {Node} form field
	 * @param r {RegExp} regex to match against className
	 * @return {String}
	 */
	_getElementStatus: function(
		/* Node */	e,
		/* regex */	r)
	{
		_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "_getElementStatus", 776);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 780);
var m = e.get('className').match(r);
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 781);
return ((m && m.length) ? m[1] : false);
	},

	/**
	 * Return the column key for the specified field.
	 * 
	 * @method _getColumnKey
	 * @protected
	 * @param e {Node} form field
	 * @return {String}
	 */
	_getColumnKey: function(
		/* Node */ e)
	{
		_yuitest_coverfunc("/build/gallery-quickedit/gallery-quickedit.js", "_getColumnKey", 792);
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 795);
var m = quick_edit_re.exec(e.get('className'));
		_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 796);
return m[1];
	}
});

_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 800);
Y.namespace("Plugin");
_yuitest_coverline("/build/gallery-quickedit/gallery-quickedit.js", 801);
Y.Plugin.DataTableQuickEdit = QuickEdit;


}, 'gallery-2012.10.31-20-00' ,{optional:['gallery-scrollintoview'], requires:['datatable-base','gallery-formmgr-css-validation','gallery-node-optimizations','gallery-funcprog'], skinnable:true});
