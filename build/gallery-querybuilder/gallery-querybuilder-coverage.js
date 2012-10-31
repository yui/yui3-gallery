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
_yuitest_coverage["/build/gallery-querybuilder/gallery-querybuilder.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-querybuilder/gallery-querybuilder.js",
    code: []
};
_yuitest_coverage["/build/gallery-querybuilder/gallery-querybuilder.js"].code=["YUI.add('gallery-querybuilder', function(Y) {","","\"use strict\";","","var has_bubble_problem = (0 < Y.UA.ie && Y.UA.ie < 9);","","/**********************************************************************"," * Widget which allows user to build a list of query criteria, e.g., for"," * searching.  All the conditions are either AND'ed or OR'ed.  For a more"," * general query builder, see gallery-exprbuilder."," * "," * @module gallery-querybuilder"," */","","/**"," * <p>The default package provides two data types:  String (which can also"," * be used for numbers) and Select (which provides a menu of options).  The"," * plugin API allows defining additional data types, e.g., date range or"," * multi-select.  Every plugin must be registered in"," * `Y.QueryBuilder.plugin_mapping`.  Plugins must implement the following"," * functions:</p>"," *"," * <dl>"," * <dt>`constructor(qb, config)`</dt>"," * <dd>The arguments passed to the constructor are the QueryBuilder instance"," *		and the `pluginConfig` set on the QueryBuilder instance."," *		At the minimum, this function should initalize form field name patterns"," *		using `config.field_prefix`.</dd>"," * <dt>`create(query_index, var_config, op_list, value)`<dt>"," * <dd>This function must create the additional cells for the query row and"," *		populate these cells appropriately.  (The QueryBuilder widget will"," *		insert the cells into the table.)  `var_config` is the"," *		item from the QueryBuilder's `var_list` that the user"," *		selected.  `op_list` is the item from the QueryBuilder's"," *		`operators` which matches the variable selected by the"," *		user.  `value` is optional.  If specified, it is the"," *		initial value(s) to be displayed by the plugin.</dd>"," * <dt>`postCreate(query_index, var_config, op_list, value)`</dt>"," * <dd>Optional.  If it exists, it will be called after the cells returned by"," *		`create()` have been inserted into the table.  The arguments"," *		are the same as `create()`.</dd>"," * <dt>`destroy()`</dt>"," * <dd>Destroy the plugin.  (The QueryBuilder widget will remove the cells"," *		and purge all events.)</dd>"," * <dt>`updateName(new_index)`</dt>"," * <dd>Update the names of the form fields managed by the plugin.</dd>"," * <dt>`set(query_index, data)`</dt>"," * <dd>Set the displayed value(s) by extracting values from data (a map)"," *		based on the current names of the plugin's form fields.</dd>"," * <dt>`toDatabaseQuery()`</dt>"," * <dd>Return an array of arrays.  Each inner array contains an operation"," *		and a value.  The default String and Select plugins each return"," *		a single inner array.  A date range plugin would return two inner"," *		arrays, one for the start date and one for the end date.</dd>"," * <dt>`validate()`</dt>"," * <dd>Optional.  If additional validations are required beyond the basic"," *		validations encoded in CSS, this function should check them.  If"," *		the input is not valid, call `displayFieldMessage()`"," *		on the QueryBuilder object and return false.  Otherwise, return"," *		true.</dd>"," * </dl>"," *"," * @class QueryBuilder"," * @extends Widget"," * @constructor"," * @param var_list {Array} List of variables that be included in the query."," * @param var_list.name {String} The name of the variable.  Set as the `value` for the select option."," * @param var_list.type {String} The variable type.  Used to determine which plugin to instantiate. Must match a key in `Y.QueryBuilder.plugin_mapping`. (You can add new plugins to this global mapping.)"," * @param var_list.text {String} The text displayed when the variable is selected."," * @param var_list.** {Mixed} plugin-specific configuration"," * @param operators {Object} Map of variable types to list of operators. Each operator is an object defining `value` and `text`."," * @param config {Object} Widget configuration"," */","","function QueryBuilder(","	/* array */		var_list,","	/* object */	operators,","	/* object */	config)","{","	if (!Y.FormManager)","	{","		Y.FormManager =","		{","			row_marker_class:    '',","			field_marker_class:  '',","			status_marker_class: '',","			required_class:      ''","		};","	}","","	// list of variables that can be queried","","	this.var_list = var_list.slice(0);","","	// list of possible query operations for each data type","","	this.op_list      = Y.clone(operators, true);","	this.op_list.none = [];","","	// table rows containing the query elements","","	this.row_list = [];","","	QueryBuilder.superclass.constructor.call(this, config);","}","","QueryBuilder.NAME = \"querybuilder\";","","QueryBuilder.ATTRS =","{","	/**","	 * The prompt displayed when a new item is added to the query.","	 *","	 * @attribute chooseVarPrompt","	 * @type {String}","	 * @default \"Choose a variable\"","	 * @writeonce","	 */","	chooseVarPrompt:","	{","		value:     'Choose a Variable',","		validator: Y.Lang.isString,","		writeOnce: true","	},","","	/**","	 * All generated form field names start with this prefix.  This avoids","	 * conflicts if you have more than one QueryBuilder on a page.","	 *","	 * @attribute fieldPrefix","	 * @type {String}","	 * @default \"\"","	 * @writeonce","	 */","	fieldPrefix:","	{","		value:     '',","		validator: Y.Lang.isString,","		writeOnce: true","	},","","	/**","	 * Configuration passed to plugins when they are constructed.","	 *","	 * @attribute pluginConfig","	 * @type {Object}","	 * @default {}","	 * @writeonce","	 */","	pluginConfig:","	{","		value:     {},","		validator: Y.Lang.isObject,","		writeOnce: true","	}","};","","/**"," * @event queryChanged"," * @description Fires when the query is modified."," * @param info {Object} `remove` is `true` if a row was removed"," */","","function initVarList()","{","	this.var_list.unshift(","	{","		name: 'yui3-querybuilder-choose-prompt',","		type: 'none',","		text: this.get('chooseVarPrompt')","	});","}","","function findRow(","	/* array */		row_list,","	/* element */	query_row)","{","	var count = row_list.length;","	for (var i=0; i<count; i++)","	{","		if (row_list[i].row == query_row)","		{","			return i;","		}","	}","","	return -1;","}","","function insertRow(","	/* event */		e,","	/* element */	query_row)","{","	e.halt();","	this.appendNew();","}","","function removeRow(","	/* event */		e,","	/* element */	query_row)","{","	e.halt();","","	var i = findRow(this.row_list, query_row);","	if (i >= 0)","	{","		this.remove(i);","	}","}","","function changeVar(","	/* event */		e,","	/* element */	query_row)","{","	var i = findRow(this.row_list, query_row);","	if (i >= 0)","	{","		this.update(i);","	}","}","","function keyUp(e)","{","	if (e.keyCode != 13)","	{","		this._notifyChanged();","	}","}","","Y.extend(QueryBuilder, Y.Widget,","{","	initializer: function(config)","	{","		var field_prefix                      = this.get('fieldPrefix');","		this.var_menu_name_pattern            = field_prefix + 'query_var_{i}';","		this.get('pluginConfig').field_prefix = field_prefix;","		this.plugin_column_count              = 0;	// expands as needed","","		initVarList.call(this);","	},","","	renderUI: function()","	{","		var container = this.get('contentBox');","		container.on('change', this._notifyChanged, this);","		container.on('keyup', keyUp, this);","","		this.table = Y.Node.create('<table></table>');","		container.appendChild(this.table);","","		this.appendNew();","	},","","	destructor: function()","	{","		for (var i=0; i<this.row_list.length; i++)","		{","			if (this.row_list[i].plugin)","			{","				this.row_list[i].plugin.destroy();","			}","		}","","		this.row_list = null;","		this.table    = null;","	},","","	/**","	 * Reset the query.","	 *","	 * @method reset","	 * @param var_list {Array} If specified, the list of available variables is replaced.","	 * @param operators {Object} If specified, the operators for all variable types will be replaced.","	 */","	reset: function(","		/* array */		var_list,","		/* object */	operators)","	{","		this._allow_remove_last_row = true;","","		for (var i=this.row_list.length-1; i>=0; i--)","		{","			this.remove(i);","		}","","		this._allow_remove_last_row = false;","","		if (var_list)","		{","			this.var_list = var_list.slice(0);","			initVarList.call(this);","		}","","		if (operators)","		{","			this.op_list      = Y.clone(operators, true);","			this.op_list.none = [];","		}","","		this.has_messages = false;","		this.appendNew();","	},","","	/**","	 * Append a new query condition to the table.","	 *","	 * @method appendNew","	 * @param name {String} If specified, this variable is selected.","	 * @param value {Mixed} If specified, this value is selected.  Refer to the appropriate plugin documentation to figure out what data to pass.","	 * @return {Object} plugin that was created for the row, if any","	 */","	appendNew: function(","		/* string */	name,","		/* mixed */		value)","	{","		// if has single, neutral row, use it","","		if (name && this.row_list.length == 1)","		{","			var var_menu = this.row_list[0].var_menu;","			if (var_menu.get('selectedIndex') === 0)","			{","				for (var i=0; i<this.var_list.length; i++)","				{","					if (this.var_list[i].name == name)","					{","						var_menu.set('selectedIndex', i);","						break;","					}","				}","","				this.update(0, value);","				return this.row_list[0].plugin;","			}","		}","","		// create new row","","		var new_index  = this.row_list.length;","		var query_body = Y.Node.create('<tbody></tbody>');","		query_body.set('className', Y.FormManager.row_marker_class);","","		// error row","","		var error_row = Y.Node.create('<tr></tr>');","		error_row.set('className', this.getClassName('error'));","		query_body.appendChild(error_row);","","		var error_cell = this._createContainer();","		error_cell.set('colSpan', 1 + this.plugin_column_count);","		error_cell.set('innerHTML', '<p class=\"' + Y.FormManager.status_marker_class + '\"></p>');","		error_row.appendChild(error_cell);","","		error_row.appendChild(this._createContainer());","","		// criterion row","","		var query_row = Y.Node.create('<tr></tr>');","		query_row.set('className', this.getClassName('criterion'));","		query_body.appendChild(query_row);","","		// cell for query variable menu","","		var var_cell = this._createContainer();","		var_cell.set('className', this.getClassName('variable'));","		query_row.appendChild(var_cell);","","		// menu for selecting query variable","","		var_cell.set('innerHTML', this._variablesMenu(this.variableName(new_index)));","","		var var_menu = var_cell.one('select');","		var_menu.on('change', changeVar, this, query_row);","","		var options = Y.Node.getDOMNode(var_menu).options;","		for (var i=0; i<this.var_list.length; i++)","		{","			options[i] = new Option(this.var_list[i].text, this.var_list[i].name);","			if (this.var_list[i].name == name)","			{","				var_menu.set('selectedIndex', i);","			}","		}","","		if (has_bubble_problem)","		{","			var_menu.on('change', this._notifyChanged, this);","		}","","		// controls for this row","","		var control_cell = this._createContainer();","		control_cell.set('className', this.getClassName('controls'));","		control_cell.set('innerHTML', this._rowControls());","		query_row.appendChild(control_cell);","","		var insert_control = control_cell.one('.'+this.getClassName('insert'));","		if (insert_control)","		{","			insert_control.on('click', insertRow, this, query_row);","		}","","		var remove_control = control_cell.one('.'+this.getClassName('remove'));","		if (remove_control)","		{","			remove_control.on('click', removeRow, this, query_row);","		}","","		// insert into DOM after fully constructed","","		this.table.appendChild(query_body);","","		var obj =","		{","			body:     query_body,","			row:      query_row,","			var_menu: var_menu,","			control:  control_cell,","			error:    error_cell","		};","		this.row_list.push(obj);","		this.update(new_index, value);","","		query_body.scrollIntoView();","","		return this.row_list[new_index].plugin;","	},","","	/**","	 * Set the value of the specified row.","	 *","	 * @method update","	 * @param row_index {int} The index of the row","	 * @param value {Mixed} If specified, the value to set (Refer to the appropriate plugin documentation to figure out what data to pass.)","	 */","	update: function(","		/* int */		row_index,","		/* string */	value)","	{","		var query_row    = this.row_list[row_index].row;","		var control_cell = this.row_list[row_index].control;","","		// clear error","","		this.row_list[row_index].error.one('.'+Y.FormManager.status_marker_class).set('innerHTML', '');","","		// remove all but the first cell (variable name) and last cell (controls)","","		if (this.row_list[row_index].plugin)","		{","			this.row_list[row_index].plugin.destroy();","			this.row_list[row_index].plugin = null;","		}","","		while (query_row.get('children').size() > 2)","		{","			var child = query_row.get('children').item(0).next();","			child.remove(true);","		}","","		// re-build the table row","","		var var_menu     = this.row_list[row_index].var_menu;","		var selected_var = this.var_list[ var_menu.get('selectedIndex') ];","","		var cells = [];","		if (selected_var.type == 'none')","		{","			query_row.addClass(this.getClassName('empty'));","		}","		else","		{","			query_row.removeClass(this.getClassName('empty'));","","			this.row_list[row_index].plugin =","				new QueryBuilder.plugin_mapping[ selected_var.type ](","					this, this.get('pluginConfig'));","			cells =","				this.row_list[row_index].plugin.create(","					row_index, selected_var,","					this.op_list[ selected_var.type ], value);","		}","","		while (cells.length < this.plugin_column_count)","		{","			cells.push(this._createContainer());","		}","","		for (var i=0; i<cells.length; i++)","		{","			query_row.insertBefore(cells[i], control_cell);","		}","","		if (cells.length > this.plugin_column_count)","		{","			var col_span = 1 + cells.length;","			for (var i=0; i<this.row_list.length; i++)","			{","				var row = this.row_list[i].row;","				this.row_list[i].error.set('colSpan', col_span);","","				if (row != query_row)","				{","					var control = this.row_list[i].control;","","					for (var j=this.plugin_column_count; j<cells.length; j++)","					{","						row.insertBefore(this._createContainer(), control);","					}","				}","			}","","			this.plugin_column_count = cells.length;","		}","","		var plugin = this.row_list[row_index].plugin;","		if (plugin && Y.Lang.isFunction(plugin.postCreate))","		{","			this.row_list[row_index].plugin.postCreate(","				row_index, selected_var,","				this.op_list[ selected_var.type ], value);","		}","	},","","	/**","	 * Removes the specified row.","	 *","	 * @method remove","	 * @param row_index {int} The index of the row","	 * @return {boolean} `true` if successful","	 */","	remove: function(","		/* int */	row_index)","	{","		// sanity checks","","		if (this.row_list.length <= 0)","		{","			return false;","		}","","		// last row cannot be removed","","		if (!this._allow_remove_last_row && this.row_list.length == 1)","		{","			var var_menu = this.row_list[0].var_menu;","			var_menu.set('selectedIndex', 0);","			this.update(0);","			this.fire('queryChanged', {remove: true});","			return true;","		}","","		var query_body = this.row_list[row_index].body;","		if (query_body === null)","		{","			return false;","		}","","		// remove row","","		if (this.row_list[row_index].plugin)","		{","			this.row_list[row_index].plugin.destroy();","		}","","		query_body.remove(true);","		this.row_list.splice(row_index, 1);","","		// renumber remaining rows","","		Y.Array.each(this.row_list, function(row, i)","		{","			var var_menu = row.var_menu;","			var_menu.setAttribute('name', this.variableName(i));","","			var selected_var = this.var_list[ var_menu.get('selectedIndex') ];","			if (selected_var.type != 'none')","			{","				row.plugin.updateName(i);","			}","		},","		this);","","		this.fire('queryChanged', {remove: true});","		return true;","	},","","	/**","	 * Validate the fields in each row.","	 * ","	 * @method validateFields","	 * @return {Boolean} `true` if all values are valid","	 */","	validateFields: function()","	{","		this.clearFieldMessages();","","		var status = true;","		Y.Array.each(this.row_list, function(row, i)","		{","			var info;","			row.row.all('input').some(function(n)","			{","				info = Y.FormManager.validateFromCSSData(n);","","				if (info.error)","				{","					this.displayFieldMessage(n, info.error, 'error');","					status = false;","					return true;","				}","			},","			this);","","			if ((!info || info.keepGoing) && row.plugin && Y.Lang.isFunction(row.plugin.validate))","			{","				status = row.plugin.validate() && status;	// status last to guarantee call to validate()","			}","		},","		this);","","		return status;","	},","","	/**","	 * @method clearFieldMessages","	 */","	clearFieldMessages: function()","	{","		this.has_messages = false;","","		this.get('contentBox').all('input').each(function(n)","		{","			Y.FormManager.clearMessage(n);","		});","","		this.get('contentBox').all('select').each(function(n)","		{","			Y.FormManager.clearMessage(n);","		});","	},","","	/**","	 * Display a message for the specified field.","	 * ","	 * @method displayFieldMessage","	 * @param e {String|Object} The selector for the element or the element itself","	 * @param msg {String} The message","	 * @param type {String} The message type (see Y.FormManager.status_order)","	 * @param [scroll] {boolean} `true` if the form row should be scrolled into view","	 * @return {boolean} true if the message was displayed, false if a higher precedence message was already there","	 */","	displayFieldMessage: function(","		/* id/object */	e,","		/* string */	msg,","		/* string */	type,","		/* boolean */	scroll)","	{","		if (Y.FormManager.displayMessage(e, msg, type, this.has_messages, scroll))","		{","			this.has_messages = true;","			return true;","		}","		else","		{","			return false;","		}","	},","","	/**","	 * Returns plugin used for the specified row, if any.","	 *","	 * @method getPlugin","	 * @param row_index {int} The index of the row","	 * @return {Object} the plugin for the row, if any","	 */","	getPlugin: function(","		/* int */	row_index)","	{","		return this.row_list[row_index].plugin;","	},","","	/**","	 * @method toDatabaseQuery","	 * @return {Array} list of [var, op, value] tuples suitable for a database query","	 */","	toDatabaseQuery: function()","	{","		var result = [];","","		for (var i=0; i<this.row_list.length; i++)","		{","			var row    = this.row_list[i];","			var plugin = row.plugin;","			if (plugin)","			{","				var list = plugin.toDatabaseQuery();","				for (var j=0; j<list.length; j++)","				{","					result.push([ row.var_menu.get('value') ].concat(list[j]));","				}","			}","		}","","		return result;","	},","","	/*","	 * API for plugins","	 */","","	/**","	 * @method _createContainer","	 * @protected","	 * @return {DOM element} container for one piece of a query row","	 */","	_createContainer: function()","	{","		return Y.Node.create('<td></td>');","	},","","	/**","	 * Fires the queryChanged event.","	 *","	 * @method _notifyChanged","	 * @protected","	 */","	_notifyChanged: function()","	{","		this.fire('queryChanged');","	},","","	/*","	 * Form element names.","	 */","","	/**","	 * @method variableName","	 * @param i {int} query row index","	 * @return {String} name for the select form element listing the available query variables","	 */","	variableName: function(","		/* int */	i)","	{","		return Y.Lang.sub(this.var_menu_name_pattern, {i:i});","	},","","	//","	// Markup","	//","","	/**","	 * @method _variablesMenu","	 * @protected","	 * @param menu_name {String} name for the select form element","	 * @return {String} markup for the query variable menu","	 */","	_variablesMenu: function(","		/* string */	menu_name)","	{","		// This must use a select tag!","","		var markup = '<select name=\"{n}\" class=\"{f} {c}\" />';","","		return Y.Lang.sub(markup,","		{","			n: menu_name,","			f: Y.FormManager.field_marker_class,","			c: this.getClassName('field')","		});","	},","","	/**","	 * @method _rowControls","	 * @protected","	 * @return {String} markup for the row controls (insert and remove)","	 */","	_rowControls: function()","	{","		var markup =","			'<button class=\"{cr}\">&ndash;</button>' +","			'<button class=\"{ci}\">+</button>';","","		if (!this._controls_markup)","		{","			this._controls_markup = Y.Lang.sub(markup,","			{","				ci: this.getClassName('insert'),","				cr: this.getClassName('remove')","			});","		}","","		return this._controls_markup;","	}","});","","Y.QueryBuilder = QueryBuilder;","","/**"," * <p>Environment information.</p>"," * "," * <dl>"," * <dt>has_bubble_problem</dt>"," * <dd>True if change events from select elements do not bubble.</dd>"," * </dl>"," * "," * @property Env"," * @type {Object}"," * @static"," */","Y.QueryBuilder.Env =","{","	has_bubble_problem: has_bubble_problem","};","/**"," * @module gallery-querybuilder"," */","","/**********************************************************************"," * <p>Plugin for accepting a string or number.  All the operators specified"," * for this plugin are displayed on a menu.</p>"," * "," * <p>In the <code>var_list</code> configuration, specify"," * <code>validation</code> to provide CSS classes that will be interpreted"," * by <code>Y.FormManager</code>.</p>"," * "," * <p>To enable autocomplete, define <code>autocomplete</code> in the"," * <code>var_list</code> configuration.  The object will be used as the"," * configuration for <code>Y.Plugin.AutoComplete</code>.  If you specify"," * <code>autocomplete.containerClassName</code>, this CSS class will be"," * added to the container generated by the autocomplete plugin.</p>"," * "," * <p>The <code>value</code> argument passed to"," * <code>QueryBuilder.appendNew()</code> must be an array with two"," * elements: <code>[ operator_name, value ]</code>.</p>"," * "," * @namespace QueryBuilder"," * @class String"," */","","QueryBuilder.String = function(","	/* object */	query_builder,","	/* object */	config)","{","	this.qb = query_builder;","","	this.op_menu_name_pattern   = config.field_prefix + 'query_op_{i}';","	this.val_input_name_pattern = config.field_prefix + 'query_val_{i}';","};","","QueryBuilder.String.prototype =","{","	create: function(","		/* int */		query_index,","		/* object */	var_config,","		/* array */		op_list,","		/* array */		value)","	{","		var op_cell = this.qb._createContainer();","		op_cell.set('className', this.qb.getClassName('operator'));","		op_cell.set('innerHTML', this._operationsMenu(this.operationName(query_index)));","		this.op_menu = op_cell.one('select');","","		var options = Y.Node.getDOMNode(this.op_menu).options;","		for (var i=0; i<op_list.length; i++)","		{","			options[i] = new Option(op_list[i].text, op_list[i].value);","		}","","		value = value || ['',''];","		if (value[0])","		{","			this.op_menu.set('value', value[0]);","		}","","		if (has_bubble_problem)","		{","			this.op_menu.on('change', this.qb._notifyChanged, this.qb);","		}","","		var value_cell = this.qb._createContainer();","		value_cell.set('className', this.qb.getClassName('value'));","		value_cell.set('innerHTML', this._valueInput(this.valueName(query_index), var_config.validation));","		this.value_input = value_cell.one('input');","		this.value_input.set('value', value[1]);	// avoid formatting","","		return [ op_cell, value_cell ];","	},","","	postCreate: function(","		/* int */		query_index,","		/* object */	var_config,","		/* array */		op_list,","		/* array */		value)","	{","		Y.Lang.later(1, this, function()	// hack for IE7","		{","			if (this.value_input)		// could be destroyed","			{","				if (var_config.autocomplete)","				{","					var config    = Y.clone(var_config.autocomplete, true);","					config.render = Y.one('body');","					this.value_input.plug(Y.Plugin.AutoComplete, config);","","					if (var_config.autocomplete.containerClassName)","					{","						this.value_input.ac.get('boundingBox').addClass(var_config.autocomplete.containerClassName);","					}","				}","","				try","				{","					this.value_input.focus();","				}","				catch (e)","				{","					// IE will complain if field is invisible, instead of just ignoring it","				}","			}","		});","	},","","	destroy: function()","	{","		if (this.value_input.unplug)","		{","			this.value_input.unplug(Y.Plugin.AutoComplete);","		}","","		this.op_menu     = null;","		this.value_input = null;","	},","","	updateName: function(","		/* int */	new_index)","	{","		this.op_menu.setAttribute('name', this.operationName(new_index));","		this.value_input.setAttribute('name', this.valueName(new_index));","	},","","	set: function(","		/* int */	query_index,","		/* map */	data)","	{","		this.op_menu.set('value', data[ this.operationName(query_index) ]);","		this.value_input.set('value', data[ this.valueName(query_index) ]);","	},","","	toDatabaseQuery: function()","	{","		return [ [ this.op_menu.get('value'), this.value_input.get('value') ] ];","	},","","	/* *********************************************************************","	 * Form element names.","	 */","","	operationName: function(","		/* int */	i)","	{","		return Y.Lang.sub(this.op_menu_name_pattern, {i:i});","	},","","	valueName: function(","		/* int */	i)","	{","		return Y.Lang.sub(this.val_input_name_pattern, {i:i});","	},","","	//","	// Markup","	//","","	_operationsMenu: function(","		/* string */	menu_name)","	{","		// This must use a select tag!","","		var markup = '<select name=\"{n}\" class=\"{f} {c}\" />';","","		return Y.Lang.sub(markup,","		{","			n: menu_name,","			f: Y.FormManager.field_marker_class,","			c: this.qb.getClassName('field')","		});","	},","","	_valueInput: function(","		/* string */	input_name,","		/* string */	validation_class)","	{","		// This must use an input tag!","","		var markup = '<input type=\"text\" name=\"{n}\" class=\"yiv-required {f} {c}\"/>';","","		return Y.Lang.sub(markup,","		{","			n: input_name,","			f: Y.FormManager.field_marker_class,","			c: validation_class + ' ' + this.qb.getClassName('field')","		});","	}","};","/**"," * @module gallery-querybuilder"," */","","/**********************************************************************"," * <p>Plugin for choosing from a list of values.  In the"," * <code>var_list</code> configuration, specify <code>value_list</code> as"," * a list of objects, each defining <code>value</code> and"," * <code>text</code>.</p>"," * "," * <p>There must be exactly one operator specified for this plugin.</p>"," * "," * <p>The <code>value</code> argument passed to"," * <code>QueryBuilder.appendNew()</code> must be a string: the value of the"," * menu item to select.</p>"," * "," * @namespace QueryBuilder"," * @class Select"," */","","QueryBuilder.Select = function(","	/* object */	query_builder,","	/* object */	config)","{","	this.qb = query_builder;","","	this.val_input_name_pattern = config.field_prefix + 'query_val_{i}';","};","","QueryBuilder.Select.prototype =","{","	create: function(","		/* int */		query_index,","		/* object */	var_config,","		/* array */		op_list,","		/* string */	value)","	{","		var value_cell = this.qb._createContainer();","		value_cell.set('className', this.qb.getClassName('value'));","		value_cell.set('innerHTML', this._valuesMenu(this.valueName(query_index)));","		this.value_menu = value_cell.one('select');","","		var options    = Y.Node.getDOMNode(this.value_menu).options;","		var value_list = var_config.value_list;","		for (var i=0; i<value_list.length; i++)","		{","			options[i] = new Option(value_list[i].text, value_list[i].value);","		}","","		if (value)","		{","			this.value_menu.set('value', value);","		}","","		if (has_bubble_problem)","		{","			this.value_menu.on('change', this.qb._notifyChanged, this.qb);","		}","","		this.db_query_equals = op_list[0];","","		return [ value_cell ];","	},","","	postCreate: function(","		/* int */		query_index,","		/* object */	var_config,","		/* array */		op_list,","		/* array */		value)","	{","		try","		{","			this.value_menu.focus();","		}","		catch (e)","		{","			// IE will complain if field is invisible, instead of just ignoring it","		}","	},","","	destroy: function()","	{","		this.value_menu = null;","	},","","	updateName: function(","		/* int */	new_index)","	{","		this.value_menu.setAttribute('name', this.valueName(new_index));","	},","","	set: function(","		/* int */	query_index,","		/* map */	data)","	{","		this.value_menu.set('value', data[ this.valueName(query_index) ]);","	},","","	toDatabaseQuery: function()","	{","		return [ [ this.db_query_equals, this.value_menu.get('value') ] ];","	},","","	/* *********************************************************************","	 * Form element names.","	 */","","	valueName: function(","		/* int */	i)","	{","		return Y.Lang.sub(this.val_input_name_pattern, {i:i});","	},","","	//","	// Markup","	//","","	_valuesMenu: function(","		/* string */	menu_name)","	{","		// This must use a select tag!","","		var markup = '<select name=\"{n}\" class=\"{f} {c}\" />';","","		return Y.Lang.sub(markup,","		{","			n: menu_name,","			f: Y.FormManager.field_marker_class,","			c: this.qb.getClassName('field')","		});","	}","};","/**"," * @module gallery-querybuilder"," */","","/**"," * @class QueryBuilder"," */","","/**"," * <p>Mapping of variable types to plugin classes.  (Always introduce new"," * variable types rather than changing the existing mappings.)</p>"," * "," * <dl>"," * <dt>string</dt>"," * <dd>Generic string.</dd>"," * <dt>number</dt>"," * <dd>Generic number.  You must specify appropriate validations, e.g., yiv-integer or yiv-decimal.</dd>"," * <dt>select</dt>"," * <dd>Generic list of values.</dd>"," * </dl>"," *"," * @property plugin_mapping"," * @type {Object}"," * @static"," */","QueryBuilder.plugin_mapping =","{","	string: QueryBuilder.String,","	number: QueryBuilder.String,","	select: QueryBuilder.Select","};","","","}, 'gallery-2012.10.31-20-00' ,{optional:['gallery-scrollintoview','autocomplete'], requires:['widget','gallery-formmgr'], skinnable:true});"];
_yuitest_coverage["/build/gallery-querybuilder/gallery-querybuilder.js"].lines = {"1":0,"3":0,"5":0,"75":0,"80":0,"82":0,"93":0,"97":0,"98":0,"102":0,"104":0,"107":0,"109":0,"164":0,"166":0,"174":0,"178":0,"179":0,"181":0,"183":0,"187":0,"190":0,"194":0,"195":0,"198":0,"202":0,"204":0,"205":0,"207":0,"211":0,"215":0,"216":0,"218":0,"222":0,"224":0,"226":0,"230":0,"234":0,"235":0,"236":0,"237":0,"239":0,"244":0,"245":0,"246":0,"248":0,"249":0,"251":0,"256":0,"258":0,"260":0,"264":0,"265":0,"279":0,"281":0,"283":0,"286":0,"288":0,"290":0,"291":0,"294":0,"296":0,"297":0,"300":0,"301":0,"318":0,"320":0,"321":0,"323":0,"325":0,"327":0,"328":0,"332":0,"333":0,"339":0,"340":0,"341":0,"345":0,"346":0,"347":0,"349":0,"350":0,"351":0,"352":0,"354":0,"358":0,"359":0,"360":0,"364":0,"365":0,"366":0,"370":0,"372":0,"373":0,"375":0,"376":0,"378":0,"379":0,"381":0,"385":0,"387":0,"392":0,"393":0,"394":0,"395":0,"397":0,"398":0,"400":0,"403":0,"404":0,"406":0,"411":0,"413":0,"421":0,"422":0,"424":0,"426":0,"440":0,"441":0,"445":0,"449":0,"451":0,"452":0,"455":0,"457":0,"458":0,"463":0,"464":0,"466":0,"467":0,"469":0,"473":0,"475":0,"478":0,"484":0,"486":0,"489":0,"491":0,"494":0,"496":0,"497":0,"499":0,"500":0,"502":0,"504":0,"506":0,"508":0,"513":0,"516":0,"517":0,"519":0,"537":0,"539":0,"544":0,"546":0,"547":0,"548":0,"549":0,"550":0,"553":0,"554":0,"556":0,"561":0,"563":0,"566":0,"567":0,"571":0,"573":0,"574":0,"576":0,"577":0,"579":0,"584":0,"585":0,"596":0,"598":0,"599":0,"601":0,"602":0,"604":0,"606":0,"608":0,"609":0,"610":0,"615":0,"617":0,"622":0,"630":0,"632":0,"634":0,"637":0,"639":0,"659":0,"661":0,"662":0,"666":0,"680":0,"689":0,"691":0,"693":0,"694":0,"695":0,"697":0,"698":0,"700":0,"705":0,"719":0,"730":0,"745":0,"763":0,"765":0,"780":0,"784":0,"786":0,"793":0,"797":0,"811":0,"841":0,"845":0,"847":0,"848":0,"851":0,"859":0,"860":0,"861":0,"862":0,"864":0,"865":0,"867":0,"870":0,"871":0,"873":0,"876":0,"878":0,"881":0,"882":0,"883":0,"884":0,"885":0,"887":0,"896":0,"898":0,"900":0,"902":0,"903":0,"904":0,"906":0,"908":0,"912":0,"914":0,"926":0,"928":0,"931":0,"932":0,"938":0,"939":0,"946":0,"947":0,"952":0,"962":0,"968":0,"980":0,"982":0,"996":0,"998":0,"1026":0,"1030":0,"1032":0,"1035":0,"1043":0,"1044":0,"1045":0,"1046":0,"1048":0,"1049":0,"1050":0,"1052":0,"1055":0,"1057":0,"1060":0,"1062":0,"1065":0,"1067":0,"1076":0,"1078":0,"1088":0,"1094":0,"1101":0,"1106":0,"1116":0,"1128":0,"1130":0,"1163":0};
_yuitest_coverage["/build/gallery-querybuilder/gallery-querybuilder.js"].functions = {"QueryBuilder:75":0,"initVarList:164":0,"findRow:174":0,"insertRow:190":0,"removeRow:198":0,"changeVar:211":0,"keyUp:222":0,"initializer:232":0,"renderUI:242":0,"destructor:254":0,"reset:275":0,"appendNew:312":0,"update:436":0,"(anonymous 2):571":0,"remove:532":0,"(anonymous 4):602":0,"(anonymous 3):599":0,"validateFields:594":0,"(anonymous 5):632":0,"(anonymous 6):637":0,"clearFieldMessages:628":0,"displayFieldMessage:653":0,"getPlugin:677":0,"toDatabaseQuery:687":0,"_createContainer:717":0,"_notifyChanged:728":0,"variableName:742":0,"_variablesMenu:758":0,"_rowControls:778":0,"String:841":0,"create:853":0,"(anonymous 7):896":0,"postCreate:890":0,"destroy:924":0,"updateName:935":0,"set:942":0,"toDatabaseQuery:950":0,"operationName:959":0,"valueName:965":0,"_operationsMenu:975":0,"_valueInput:990":0,"Select:1026":0,"create:1037":0,"postCreate:1070":0,"destroy:1086":0,"updateName:1091":0,"set:1097":0,"toDatabaseQuery:1104":0,"valueName:1113":0,"_valuesMenu:1123":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-querybuilder/gallery-querybuilder.js"].coveredLines = 293;
_yuitest_coverage["/build/gallery-querybuilder/gallery-querybuilder.js"].coveredFunctions = 51;
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1);
YUI.add('gallery-querybuilder', function(Y) {

_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 3);
"use strict";

_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 5);
var has_bubble_problem = (0 < Y.UA.ie && Y.UA.ie < 9);

/**********************************************************************
 * Widget which allows user to build a list of query criteria, e.g., for
 * searching.  All the conditions are either AND'ed or OR'ed.  For a more
 * general query builder, see gallery-exprbuilder.
 * 
 * @module gallery-querybuilder
 */

/**
 * <p>The default package provides two data types:  String (which can also
 * be used for numbers) and Select (which provides a menu of options).  The
 * plugin API allows defining additional data types, e.g., date range or
 * multi-select.  Every plugin must be registered in
 * `Y.QueryBuilder.plugin_mapping`.  Plugins must implement the following
 * functions:</p>
 *
 * <dl>
 * <dt>`constructor(qb, config)`</dt>
 * <dd>The arguments passed to the constructor are the QueryBuilder instance
 *		and the `pluginConfig` set on the QueryBuilder instance.
 *		At the minimum, this function should initalize form field name patterns
 *		using `config.field_prefix`.</dd>
 * <dt>`create(query_index, var_config, op_list, value)`<dt>
 * <dd>This function must create the additional cells for the query row and
 *		populate these cells appropriately.  (The QueryBuilder widget will
 *		insert the cells into the table.)  `var_config` is the
 *		item from the QueryBuilder's `var_list` that the user
 *		selected.  `op_list` is the item from the QueryBuilder's
 *		`operators` which matches the variable selected by the
 *		user.  `value` is optional.  If specified, it is the
 *		initial value(s) to be displayed by the plugin.</dd>
 * <dt>`postCreate(query_index, var_config, op_list, value)`</dt>
 * <dd>Optional.  If it exists, it will be called after the cells returned by
 *		`create()` have been inserted into the table.  The arguments
 *		are the same as `create()`.</dd>
 * <dt>`destroy()`</dt>
 * <dd>Destroy the plugin.  (The QueryBuilder widget will remove the cells
 *		and purge all events.)</dd>
 * <dt>`updateName(new_index)`</dt>
 * <dd>Update the names of the form fields managed by the plugin.</dd>
 * <dt>`set(query_index, data)`</dt>
 * <dd>Set the displayed value(s) by extracting values from data (a map)
 *		based on the current names of the plugin's form fields.</dd>
 * <dt>`toDatabaseQuery()`</dt>
 * <dd>Return an array of arrays.  Each inner array contains an operation
 *		and a value.  The default String and Select plugins each return
 *		a single inner array.  A date range plugin would return two inner
 *		arrays, one for the start date and one for the end date.</dd>
 * <dt>`validate()`</dt>
 * <dd>Optional.  If additional validations are required beyond the basic
 *		validations encoded in CSS, this function should check them.  If
 *		the input is not valid, call `displayFieldMessage()`
 *		on the QueryBuilder object and return false.  Otherwise, return
 *		true.</dd>
 * </dl>
 *
 * @class QueryBuilder
 * @extends Widget
 * @constructor
 * @param var_list {Array} List of variables that be included in the query.
 * @param var_list.name {String} The name of the variable.  Set as the `value` for the select option.
 * @param var_list.type {String} The variable type.  Used to determine which plugin to instantiate. Must match a key in `Y.QueryBuilder.plugin_mapping`. (You can add new plugins to this global mapping.)
 * @param var_list.text {String} The text displayed when the variable is selected.
 * @param var_list.** {Mixed} plugin-specific configuration
 * @param operators {Object} Map of variable types to list of operators. Each operator is an object defining `value` and `text`.
 * @param config {Object} Widget configuration
 */

_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 75);
function QueryBuilder(
	/* array */		var_list,
	/* object */	operators,
	/* object */	config)
{
	_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "QueryBuilder", 75);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 80);
if (!Y.FormManager)
	{
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 82);
Y.FormManager =
		{
			row_marker_class:    '',
			field_marker_class:  '',
			status_marker_class: '',
			required_class:      ''
		};
	}

	// list of variables that can be queried

	_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 93);
this.var_list = var_list.slice(0);

	// list of possible query operations for each data type

	_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 97);
this.op_list      = Y.clone(operators, true);
	_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 98);
this.op_list.none = [];

	// table rows containing the query elements

	_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 102);
this.row_list = [];

	_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 104);
QueryBuilder.superclass.constructor.call(this, config);
}

_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 107);
QueryBuilder.NAME = "querybuilder";

_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 109);
QueryBuilder.ATTRS =
{
	/**
	 * The prompt displayed when a new item is added to the query.
	 *
	 * @attribute chooseVarPrompt
	 * @type {String}
	 * @default "Choose a variable"
	 * @writeonce
	 */
	chooseVarPrompt:
	{
		value:     'Choose a Variable',
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * All generated form field names start with this prefix.  This avoids
	 * conflicts if you have more than one QueryBuilder on a page.
	 *
	 * @attribute fieldPrefix
	 * @type {String}
	 * @default ""
	 * @writeonce
	 */
	fieldPrefix:
	{
		value:     '',
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * Configuration passed to plugins when they are constructed.
	 *
	 * @attribute pluginConfig
	 * @type {Object}
	 * @default {}
	 * @writeonce
	 */
	pluginConfig:
	{
		value:     {},
		validator: Y.Lang.isObject,
		writeOnce: true
	}
};

/**
 * @event queryChanged
 * @description Fires when the query is modified.
 * @param info {Object} `remove` is `true` if a row was removed
 */

_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 164);
function initVarList()
{
	_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "initVarList", 164);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 166);
this.var_list.unshift(
	{
		name: 'yui3-querybuilder-choose-prompt',
		type: 'none',
		text: this.get('chooseVarPrompt')
	});
}

_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 174);
function findRow(
	/* array */		row_list,
	/* element */	query_row)
{
	_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "findRow", 174);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 178);
var count = row_list.length;
	_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 179);
for (var i=0; i<count; i++)
	{
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 181);
if (row_list[i].row == query_row)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 183);
return i;
		}
	}

	_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 187);
return -1;
}

_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 190);
function insertRow(
	/* event */		e,
	/* element */	query_row)
{
	_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "insertRow", 190);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 194);
e.halt();
	_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 195);
this.appendNew();
}

_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 198);
function removeRow(
	/* event */		e,
	/* element */	query_row)
{
	_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "removeRow", 198);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 202);
e.halt();

	_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 204);
var i = findRow(this.row_list, query_row);
	_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 205);
if (i >= 0)
	{
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 207);
this.remove(i);
	}
}

_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 211);
function changeVar(
	/* event */		e,
	/* element */	query_row)
{
	_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "changeVar", 211);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 215);
var i = findRow(this.row_list, query_row);
	_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 216);
if (i >= 0)
	{
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 218);
this.update(i);
	}
}

_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 222);
function keyUp(e)
{
	_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "keyUp", 222);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 224);
if (e.keyCode != 13)
	{
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 226);
this._notifyChanged();
	}
}

_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 230);
Y.extend(QueryBuilder, Y.Widget,
{
	initializer: function(config)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "initializer", 232);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 234);
var field_prefix                      = this.get('fieldPrefix');
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 235);
this.var_menu_name_pattern            = field_prefix + 'query_var_{i}';
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 236);
this.get('pluginConfig').field_prefix = field_prefix;
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 237);
this.plugin_column_count              = 0;	// expands as needed

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 239);
initVarList.call(this);
	},

	renderUI: function()
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "renderUI", 242);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 244);
var container = this.get('contentBox');
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 245);
container.on('change', this._notifyChanged, this);
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 246);
container.on('keyup', keyUp, this);

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 248);
this.table = Y.Node.create('<table></table>');
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 249);
container.appendChild(this.table);

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 251);
this.appendNew();
	},

	destructor: function()
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "destructor", 254);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 256);
for (var i=0; i<this.row_list.length; i++)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 258);
if (this.row_list[i].plugin)
			{
				_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 260);
this.row_list[i].plugin.destroy();
			}
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 264);
this.row_list = null;
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 265);
this.table    = null;
	},

	/**
	 * Reset the query.
	 *
	 * @method reset
	 * @param var_list {Array} If specified, the list of available variables is replaced.
	 * @param operators {Object} If specified, the operators for all variable types will be replaced.
	 */
	reset: function(
		/* array */		var_list,
		/* object */	operators)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "reset", 275);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 279);
this._allow_remove_last_row = true;

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 281);
for (var i=this.row_list.length-1; i>=0; i--)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 283);
this.remove(i);
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 286);
this._allow_remove_last_row = false;

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 288);
if (var_list)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 290);
this.var_list = var_list.slice(0);
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 291);
initVarList.call(this);
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 294);
if (operators)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 296);
this.op_list      = Y.clone(operators, true);
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 297);
this.op_list.none = [];
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 300);
this.has_messages = false;
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 301);
this.appendNew();
	},

	/**
	 * Append a new query condition to the table.
	 *
	 * @method appendNew
	 * @param name {String} If specified, this variable is selected.
	 * @param value {Mixed} If specified, this value is selected.  Refer to the appropriate plugin documentation to figure out what data to pass.
	 * @return {Object} plugin that was created for the row, if any
	 */
	appendNew: function(
		/* string */	name,
		/* mixed */		value)
	{
		// if has single, neutral row, use it

		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "appendNew", 312);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 318);
if (name && this.row_list.length == 1)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 320);
var var_menu = this.row_list[0].var_menu;
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 321);
if (var_menu.get('selectedIndex') === 0)
			{
				_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 323);
for (var i=0; i<this.var_list.length; i++)
				{
					_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 325);
if (this.var_list[i].name == name)
					{
						_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 327);
var_menu.set('selectedIndex', i);
						_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 328);
break;
					}
				}

				_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 332);
this.update(0, value);
				_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 333);
return this.row_list[0].plugin;
			}
		}

		// create new row

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 339);
var new_index  = this.row_list.length;
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 340);
var query_body = Y.Node.create('<tbody></tbody>');
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 341);
query_body.set('className', Y.FormManager.row_marker_class);

		// error row

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 345);
var error_row = Y.Node.create('<tr></tr>');
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 346);
error_row.set('className', this.getClassName('error'));
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 347);
query_body.appendChild(error_row);

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 349);
var error_cell = this._createContainer();
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 350);
error_cell.set('colSpan', 1 + this.plugin_column_count);
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 351);
error_cell.set('innerHTML', '<p class="' + Y.FormManager.status_marker_class + '"></p>');
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 352);
error_row.appendChild(error_cell);

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 354);
error_row.appendChild(this._createContainer());

		// criterion row

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 358);
var query_row = Y.Node.create('<tr></tr>');
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 359);
query_row.set('className', this.getClassName('criterion'));
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 360);
query_body.appendChild(query_row);

		// cell for query variable menu

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 364);
var var_cell = this._createContainer();
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 365);
var_cell.set('className', this.getClassName('variable'));
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 366);
query_row.appendChild(var_cell);

		// menu for selecting query variable

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 370);
var_cell.set('innerHTML', this._variablesMenu(this.variableName(new_index)));

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 372);
var var_menu = var_cell.one('select');
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 373);
var_menu.on('change', changeVar, this, query_row);

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 375);
var options = Y.Node.getDOMNode(var_menu).options;
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 376);
for (var i=0; i<this.var_list.length; i++)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 378);
options[i] = new Option(this.var_list[i].text, this.var_list[i].name);
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 379);
if (this.var_list[i].name == name)
			{
				_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 381);
var_menu.set('selectedIndex', i);
			}
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 385);
if (has_bubble_problem)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 387);
var_menu.on('change', this._notifyChanged, this);
		}

		// controls for this row

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 392);
var control_cell = this._createContainer();
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 393);
control_cell.set('className', this.getClassName('controls'));
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 394);
control_cell.set('innerHTML', this._rowControls());
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 395);
query_row.appendChild(control_cell);

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 397);
var insert_control = control_cell.one('.'+this.getClassName('insert'));
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 398);
if (insert_control)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 400);
insert_control.on('click', insertRow, this, query_row);
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 403);
var remove_control = control_cell.one('.'+this.getClassName('remove'));
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 404);
if (remove_control)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 406);
remove_control.on('click', removeRow, this, query_row);
		}

		// insert into DOM after fully constructed

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 411);
this.table.appendChild(query_body);

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 413);
var obj =
		{
			body:     query_body,
			row:      query_row,
			var_menu: var_menu,
			control:  control_cell,
			error:    error_cell
		};
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 421);
this.row_list.push(obj);
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 422);
this.update(new_index, value);

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 424);
query_body.scrollIntoView();

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 426);
return this.row_list[new_index].plugin;
	},

	/**
	 * Set the value of the specified row.
	 *
	 * @method update
	 * @param row_index {int} The index of the row
	 * @param value {Mixed} If specified, the value to set (Refer to the appropriate plugin documentation to figure out what data to pass.)
	 */
	update: function(
		/* int */		row_index,
		/* string */	value)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "update", 436);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 440);
var query_row    = this.row_list[row_index].row;
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 441);
var control_cell = this.row_list[row_index].control;

		// clear error

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 445);
this.row_list[row_index].error.one('.'+Y.FormManager.status_marker_class).set('innerHTML', '');

		// remove all but the first cell (variable name) and last cell (controls)

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 449);
if (this.row_list[row_index].plugin)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 451);
this.row_list[row_index].plugin.destroy();
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 452);
this.row_list[row_index].plugin = null;
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 455);
while (query_row.get('children').size() > 2)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 457);
var child = query_row.get('children').item(0).next();
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 458);
child.remove(true);
		}

		// re-build the table row

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 463);
var var_menu     = this.row_list[row_index].var_menu;
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 464);
var selected_var = this.var_list[ var_menu.get('selectedIndex') ];

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 466);
var cells = [];
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 467);
if (selected_var.type == 'none')
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 469);
query_row.addClass(this.getClassName('empty'));
		}
		else
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 473);
query_row.removeClass(this.getClassName('empty'));

			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 475);
this.row_list[row_index].plugin =
				new QueryBuilder.plugin_mapping[ selected_var.type ](
					this, this.get('pluginConfig'));
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 478);
cells =
				this.row_list[row_index].plugin.create(
					row_index, selected_var,
					this.op_list[ selected_var.type ], value);
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 484);
while (cells.length < this.plugin_column_count)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 486);
cells.push(this._createContainer());
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 489);
for (var i=0; i<cells.length; i++)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 491);
query_row.insertBefore(cells[i], control_cell);
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 494);
if (cells.length > this.plugin_column_count)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 496);
var col_span = 1 + cells.length;
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 497);
for (var i=0; i<this.row_list.length; i++)
			{
				_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 499);
var row = this.row_list[i].row;
				_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 500);
this.row_list[i].error.set('colSpan', col_span);

				_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 502);
if (row != query_row)
				{
					_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 504);
var control = this.row_list[i].control;

					_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 506);
for (var j=this.plugin_column_count; j<cells.length; j++)
					{
						_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 508);
row.insertBefore(this._createContainer(), control);
					}
				}
			}

			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 513);
this.plugin_column_count = cells.length;
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 516);
var plugin = this.row_list[row_index].plugin;
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 517);
if (plugin && Y.Lang.isFunction(plugin.postCreate))
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 519);
this.row_list[row_index].plugin.postCreate(
				row_index, selected_var,
				this.op_list[ selected_var.type ], value);
		}
	},

	/**
	 * Removes the specified row.
	 *
	 * @method remove
	 * @param row_index {int} The index of the row
	 * @return {boolean} `true` if successful
	 */
	remove: function(
		/* int */	row_index)
	{
		// sanity checks

		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "remove", 532);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 537);
if (this.row_list.length <= 0)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 539);
return false;
		}

		// last row cannot be removed

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 544);
if (!this._allow_remove_last_row && this.row_list.length == 1)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 546);
var var_menu = this.row_list[0].var_menu;
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 547);
var_menu.set('selectedIndex', 0);
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 548);
this.update(0);
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 549);
this.fire('queryChanged', {remove: true});
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 550);
return true;
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 553);
var query_body = this.row_list[row_index].body;
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 554);
if (query_body === null)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 556);
return false;
		}

		// remove row

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 561);
if (this.row_list[row_index].plugin)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 563);
this.row_list[row_index].plugin.destroy();
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 566);
query_body.remove(true);
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 567);
this.row_list.splice(row_index, 1);

		// renumber remaining rows

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 571);
Y.Array.each(this.row_list, function(row, i)
		{
			_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "(anonymous 2)", 571);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 573);
var var_menu = row.var_menu;
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 574);
var_menu.setAttribute('name', this.variableName(i));

			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 576);
var selected_var = this.var_list[ var_menu.get('selectedIndex') ];
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 577);
if (selected_var.type != 'none')
			{
				_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 579);
row.plugin.updateName(i);
			}
		},
		this);

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 584);
this.fire('queryChanged', {remove: true});
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 585);
return true;
	},

	/**
	 * Validate the fields in each row.
	 * 
	 * @method validateFields
	 * @return {Boolean} `true` if all values are valid
	 */
	validateFields: function()
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "validateFields", 594);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 596);
this.clearFieldMessages();

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 598);
var status = true;
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 599);
Y.Array.each(this.row_list, function(row, i)
		{
			_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "(anonymous 3)", 599);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 601);
var info;
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 602);
row.row.all('input').some(function(n)
			{
				_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "(anonymous 4)", 602);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 604);
info = Y.FormManager.validateFromCSSData(n);

				_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 606);
if (info.error)
				{
					_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 608);
this.displayFieldMessage(n, info.error, 'error');
					_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 609);
status = false;
					_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 610);
return true;
				}
			},
			this);

			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 615);
if ((!info || info.keepGoing) && row.plugin && Y.Lang.isFunction(row.plugin.validate))
			{
				_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 617);
status = row.plugin.validate() && status;	// status last to guarantee call to validate()
			}
		},
		this);

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 622);
return status;
	},

	/**
	 * @method clearFieldMessages
	 */
	clearFieldMessages: function()
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "clearFieldMessages", 628);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 630);
this.has_messages = false;

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 632);
this.get('contentBox').all('input').each(function(n)
		{
			_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "(anonymous 5)", 632);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 634);
Y.FormManager.clearMessage(n);
		});

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 637);
this.get('contentBox').all('select').each(function(n)
		{
			_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "(anonymous 6)", 637);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 639);
Y.FormManager.clearMessage(n);
		});
	},

	/**
	 * Display a message for the specified field.
	 * 
	 * @method displayFieldMessage
	 * @param e {String|Object} The selector for the element or the element itself
	 * @param msg {String} The message
	 * @param type {String} The message type (see Y.FormManager.status_order)
	 * @param [scroll] {boolean} `true` if the form row should be scrolled into view
	 * @return {boolean} true if the message was displayed, false if a higher precedence message was already there
	 */
	displayFieldMessage: function(
		/* id/object */	e,
		/* string */	msg,
		/* string */	type,
		/* boolean */	scroll)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "displayFieldMessage", 653);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 659);
if (Y.FormManager.displayMessage(e, msg, type, this.has_messages, scroll))
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 661);
this.has_messages = true;
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 662);
return true;
		}
		else
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 666);
return false;
		}
	},

	/**
	 * Returns plugin used for the specified row, if any.
	 *
	 * @method getPlugin
	 * @param row_index {int} The index of the row
	 * @return {Object} the plugin for the row, if any
	 */
	getPlugin: function(
		/* int */	row_index)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "getPlugin", 677);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 680);
return this.row_list[row_index].plugin;
	},

	/**
	 * @method toDatabaseQuery
	 * @return {Array} list of [var, op, value] tuples suitable for a database query
	 */
	toDatabaseQuery: function()
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "toDatabaseQuery", 687);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 689);
var result = [];

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 691);
for (var i=0; i<this.row_list.length; i++)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 693);
var row    = this.row_list[i];
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 694);
var plugin = row.plugin;
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 695);
if (plugin)
			{
				_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 697);
var list = plugin.toDatabaseQuery();
				_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 698);
for (var j=0; j<list.length; j++)
				{
					_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 700);
result.push([ row.var_menu.get('value') ].concat(list[j]));
				}
			}
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 705);
return result;
	},

	/*
	 * API for plugins
	 */

	/**
	 * @method _createContainer
	 * @protected
	 * @return {DOM element} container for one piece of a query row
	 */
	_createContainer: function()
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "_createContainer", 717);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 719);
return Y.Node.create('<td></td>');
	},

	/**
	 * Fires the queryChanged event.
	 *
	 * @method _notifyChanged
	 * @protected
	 */
	_notifyChanged: function()
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "_notifyChanged", 728);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 730);
this.fire('queryChanged');
	},

	/*
	 * Form element names.
	 */

	/**
	 * @method variableName
	 * @param i {int} query row index
	 * @return {String} name for the select form element listing the available query variables
	 */
	variableName: function(
		/* int */	i)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "variableName", 742);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 745);
return Y.Lang.sub(this.var_menu_name_pattern, {i:i});
	},

	//
	// Markup
	//

	/**
	 * @method _variablesMenu
	 * @protected
	 * @param menu_name {String} name for the select form element
	 * @return {String} markup for the query variable menu
	 */
	_variablesMenu: function(
		/* string */	menu_name)
	{
		// This must use a select tag!

		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "_variablesMenu", 758);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 763);
var markup = '<select name="{n}" class="{f} {c}" />';

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 765);
return Y.Lang.sub(markup,
		{
			n: menu_name,
			f: Y.FormManager.field_marker_class,
			c: this.getClassName('field')
		});
	},

	/**
	 * @method _rowControls
	 * @protected
	 * @return {String} markup for the row controls (insert and remove)
	 */
	_rowControls: function()
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "_rowControls", 778);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 780);
var markup =
			'<button class="{cr}">&ndash;</button>' +
			'<button class="{ci}">+</button>';

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 784);
if (!this._controls_markup)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 786);
this._controls_markup = Y.Lang.sub(markup,
			{
				ci: this.getClassName('insert'),
				cr: this.getClassName('remove')
			});
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 793);
return this._controls_markup;
	}
});

_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 797);
Y.QueryBuilder = QueryBuilder;

/**
 * <p>Environment information.</p>
 * 
 * <dl>
 * <dt>has_bubble_problem</dt>
 * <dd>True if change events from select elements do not bubble.</dd>
 * </dl>
 * 
 * @property Env
 * @type {Object}
 * @static
 */
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 811);
Y.QueryBuilder.Env =
{
	has_bubble_problem: has_bubble_problem
};
/**
 * @module gallery-querybuilder
 */

/**********************************************************************
 * <p>Plugin for accepting a string or number.  All the operators specified
 * for this plugin are displayed on a menu.</p>
 * 
 * <p>In the <code>var_list</code> configuration, specify
 * <code>validation</code> to provide CSS classes that will be interpreted
 * by <code>Y.FormManager</code>.</p>
 * 
 * <p>To enable autocomplete, define <code>autocomplete</code> in the
 * <code>var_list</code> configuration.  The object will be used as the
 * configuration for <code>Y.Plugin.AutoComplete</code>.  If you specify
 * <code>autocomplete.containerClassName</code>, this CSS class will be
 * added to the container generated by the autocomplete plugin.</p>
 * 
 * <p>The <code>value</code> argument passed to
 * <code>QueryBuilder.appendNew()</code> must be an array with two
 * elements: <code>[ operator_name, value ]</code>.</p>
 * 
 * @namespace QueryBuilder
 * @class String
 */

_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 841);
QueryBuilder.String = function(
	/* object */	query_builder,
	/* object */	config)
{
	_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "String", 841);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 845);
this.qb = query_builder;

	_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 847);
this.op_menu_name_pattern   = config.field_prefix + 'query_op_{i}';
	_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 848);
this.val_input_name_pattern = config.field_prefix + 'query_val_{i}';
};

_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 851);
QueryBuilder.String.prototype =
{
	create: function(
		/* int */		query_index,
		/* object */	var_config,
		/* array */		op_list,
		/* array */		value)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "create", 853);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 859);
var op_cell = this.qb._createContainer();
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 860);
op_cell.set('className', this.qb.getClassName('operator'));
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 861);
op_cell.set('innerHTML', this._operationsMenu(this.operationName(query_index)));
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 862);
this.op_menu = op_cell.one('select');

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 864);
var options = Y.Node.getDOMNode(this.op_menu).options;
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 865);
for (var i=0; i<op_list.length; i++)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 867);
options[i] = new Option(op_list[i].text, op_list[i].value);
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 870);
value = value || ['',''];
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 871);
if (value[0])
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 873);
this.op_menu.set('value', value[0]);
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 876);
if (has_bubble_problem)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 878);
this.op_menu.on('change', this.qb._notifyChanged, this.qb);
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 881);
var value_cell = this.qb._createContainer();
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 882);
value_cell.set('className', this.qb.getClassName('value'));
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 883);
value_cell.set('innerHTML', this._valueInput(this.valueName(query_index), var_config.validation));
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 884);
this.value_input = value_cell.one('input');
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 885);
this.value_input.set('value', value[1]);	// avoid formatting

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 887);
return [ op_cell, value_cell ];
	},

	postCreate: function(
		/* int */		query_index,
		/* object */	var_config,
		/* array */		op_list,
		/* array */		value)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "postCreate", 890);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 896);
Y.Lang.later(1, this, function()	// hack for IE7
		{
			_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "(anonymous 7)", 896);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 898);
if (this.value_input)		// could be destroyed
			{
				_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 900);
if (var_config.autocomplete)
				{
					_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 902);
var config    = Y.clone(var_config.autocomplete, true);
					_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 903);
config.render = Y.one('body');
					_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 904);
this.value_input.plug(Y.Plugin.AutoComplete, config);

					_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 906);
if (var_config.autocomplete.containerClassName)
					{
						_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 908);
this.value_input.ac.get('boundingBox').addClass(var_config.autocomplete.containerClassName);
					}
				}

				_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 912);
try
				{
					_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 914);
this.value_input.focus();
				}
				catch (e)
				{
					// IE will complain if field is invisible, instead of just ignoring it
				}
			}
		});
	},

	destroy: function()
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "destroy", 924);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 926);
if (this.value_input.unplug)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 928);
this.value_input.unplug(Y.Plugin.AutoComplete);
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 931);
this.op_menu     = null;
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 932);
this.value_input = null;
	},

	updateName: function(
		/* int */	new_index)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "updateName", 935);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 938);
this.op_menu.setAttribute('name', this.operationName(new_index));
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 939);
this.value_input.setAttribute('name', this.valueName(new_index));
	},

	set: function(
		/* int */	query_index,
		/* map */	data)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "set", 942);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 946);
this.op_menu.set('value', data[ this.operationName(query_index) ]);
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 947);
this.value_input.set('value', data[ this.valueName(query_index) ]);
	},

	toDatabaseQuery: function()
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "toDatabaseQuery", 950);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 952);
return [ [ this.op_menu.get('value'), this.value_input.get('value') ] ];
	},

	/* *********************************************************************
	 * Form element names.
	 */

	operationName: function(
		/* int */	i)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "operationName", 959);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 962);
return Y.Lang.sub(this.op_menu_name_pattern, {i:i});
	},

	valueName: function(
		/* int */	i)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "valueName", 965);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 968);
return Y.Lang.sub(this.val_input_name_pattern, {i:i});
	},

	//
	// Markup
	//

	_operationsMenu: function(
		/* string */	menu_name)
	{
		// This must use a select tag!

		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "_operationsMenu", 975);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 980);
var markup = '<select name="{n}" class="{f} {c}" />';

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 982);
return Y.Lang.sub(markup,
		{
			n: menu_name,
			f: Y.FormManager.field_marker_class,
			c: this.qb.getClassName('field')
		});
	},

	_valueInput: function(
		/* string */	input_name,
		/* string */	validation_class)
	{
		// This must use an input tag!

		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "_valueInput", 990);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 996);
var markup = '<input type="text" name="{n}" class="yiv-required {f} {c}"/>';

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 998);
return Y.Lang.sub(markup,
		{
			n: input_name,
			f: Y.FormManager.field_marker_class,
			c: validation_class + ' ' + this.qb.getClassName('field')
		});
	}
};
/**
 * @module gallery-querybuilder
 */

/**********************************************************************
 * <p>Plugin for choosing from a list of values.  In the
 * <code>var_list</code> configuration, specify <code>value_list</code> as
 * a list of objects, each defining <code>value</code> and
 * <code>text</code>.</p>
 * 
 * <p>There must be exactly one operator specified for this plugin.</p>
 * 
 * <p>The <code>value</code> argument passed to
 * <code>QueryBuilder.appendNew()</code> must be a string: the value of the
 * menu item to select.</p>
 * 
 * @namespace QueryBuilder
 * @class Select
 */

_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1026);
QueryBuilder.Select = function(
	/* object */	query_builder,
	/* object */	config)
{
	_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "Select", 1026);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1030);
this.qb = query_builder;

	_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1032);
this.val_input_name_pattern = config.field_prefix + 'query_val_{i}';
};

_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1035);
QueryBuilder.Select.prototype =
{
	create: function(
		/* int */		query_index,
		/* object */	var_config,
		/* array */		op_list,
		/* string */	value)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "create", 1037);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1043);
var value_cell = this.qb._createContainer();
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1044);
value_cell.set('className', this.qb.getClassName('value'));
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1045);
value_cell.set('innerHTML', this._valuesMenu(this.valueName(query_index)));
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1046);
this.value_menu = value_cell.one('select');

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1048);
var options    = Y.Node.getDOMNode(this.value_menu).options;
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1049);
var value_list = var_config.value_list;
		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1050);
for (var i=0; i<value_list.length; i++)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1052);
options[i] = new Option(value_list[i].text, value_list[i].value);
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1055);
if (value)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1057);
this.value_menu.set('value', value);
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1060);
if (has_bubble_problem)
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1062);
this.value_menu.on('change', this.qb._notifyChanged, this.qb);
		}

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1065);
this.db_query_equals = op_list[0];

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1067);
return [ value_cell ];
	},

	postCreate: function(
		/* int */		query_index,
		/* object */	var_config,
		/* array */		op_list,
		/* array */		value)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "postCreate", 1070);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1076);
try
		{
			_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1078);
this.value_menu.focus();
		}
		catch (e)
		{
			// IE will complain if field is invisible, instead of just ignoring it
		}
	},

	destroy: function()
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "destroy", 1086);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1088);
this.value_menu = null;
	},

	updateName: function(
		/* int */	new_index)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "updateName", 1091);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1094);
this.value_menu.setAttribute('name', this.valueName(new_index));
	},

	set: function(
		/* int */	query_index,
		/* map */	data)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "set", 1097);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1101);
this.value_menu.set('value', data[ this.valueName(query_index) ]);
	},

	toDatabaseQuery: function()
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "toDatabaseQuery", 1104);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1106);
return [ [ this.db_query_equals, this.value_menu.get('value') ] ];
	},

	/* *********************************************************************
	 * Form element names.
	 */

	valueName: function(
		/* int */	i)
	{
		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "valueName", 1113);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1116);
return Y.Lang.sub(this.val_input_name_pattern, {i:i});
	},

	//
	// Markup
	//

	_valuesMenu: function(
		/* string */	menu_name)
	{
		// This must use a select tag!

		_yuitest_coverfunc("/build/gallery-querybuilder/gallery-querybuilder.js", "_valuesMenu", 1123);
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1128);
var markup = '<select name="{n}" class="{f} {c}" />';

		_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1130);
return Y.Lang.sub(markup,
		{
			n: menu_name,
			f: Y.FormManager.field_marker_class,
			c: this.qb.getClassName('field')
		});
	}
};
/**
 * @module gallery-querybuilder
 */

/**
 * @class QueryBuilder
 */

/**
 * <p>Mapping of variable types to plugin classes.  (Always introduce new
 * variable types rather than changing the existing mappings.)</p>
 * 
 * <dl>
 * <dt>string</dt>
 * <dd>Generic string.</dd>
 * <dt>number</dt>
 * <dd>Generic number.  You must specify appropriate validations, e.g., yiv-integer or yiv-decimal.</dd>
 * <dt>select</dt>
 * <dd>Generic list of values.</dd>
 * </dl>
 *
 * @property plugin_mapping
 * @type {Object}
 * @static
 */
_yuitest_coverline("/build/gallery-querybuilder/gallery-querybuilder.js", 1163);
QueryBuilder.plugin_mapping =
{
	string: QueryBuilder.String,
	number: QueryBuilder.String,
	select: QueryBuilder.Select
};


}, 'gallery-2012.10.31-20-00' ,{optional:['gallery-scrollintoview','autocomplete'], requires:['widget','gallery-formmgr'], skinnable:true});
