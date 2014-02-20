/**
 * @module gallery-querybuilder
 */

/**********************************************************************
 * Plugin for choosing from a list of values.  In the `var_list`
 * configuration, specify `value_list` as a list of objects, each defining
 * `value` and `text`.
 * 
 * There must be exactly one operator specified for this plugin.
 * 
 * The `value` argument passed to `QueryBuilder.appendNew()` must be a
 * string: the value of the menu item to select.
 * 
 * @namespace QueryBuilder
 * @class Select
 */

QueryBuilder.Select = function(
	/* object */	query_builder,
	/* object */	config)
{
	this.qb = query_builder;

	this.val_input_name_pattern = config.field_prefix + 'query_val_{i}';
};

QueryBuilder.Select.prototype =
{
	create: function(
		/* int */		query_index,
		/* object */	var_config,
		/* array */		op_list,
		/* string */	value)
	{
		var value_cell = this.qb._createContainer();
		value_cell.set('className', this.qb.getClassName('value'));
		value_cell.set('innerHTML', this._valuesMenu(this.valueName(query_index)));
		this.value_menu = value_cell.one('select');

		var options    = Y.Node.getDOMNode(this.value_menu).options;
		var value_list = var_config.value_list;
		for (var i=0; i<value_list.length; i++)
		{
			options[i] = new Option(value_list[i].text, value_list[i].value);
		}

		if (value)
		{
			this.value_menu.set('value', value);
		}

		if (has_bubble_problem)
		{
			this.value_menu.on('change', this.qb._notifyChanged, this.qb);
		}

		this.db_query_equals = op_list[0];

		return [ value_cell ];
	},

	postCreate: function(
		/* int */		query_index,
		/* object */	var_config,
		/* array */		op_list,
		/* array */		value)
	{
		this.value_menu.focus();
	},

	destroy: function()
	{
		this.value_menu = null;
	},

	updateName: function(
		/* int */	new_index)
	{
		this.value_menu.setAttribute('name', this.valueName(new_index));
	},

	set: function(
		/* int */	query_index,
		/* map */	data)
	{
		this.value_menu.set('value', data[ this.valueName(query_index) ]);
	},

	toDatabaseQuery: function()
	{
		return [ [ this.db_query_equals, this.value_menu.get('value') ] ];
	},

	/* *********************************************************************
	 * Form element names.
	 */

	valueName: function(
		/* int */	i)
	{
		return Y.Lang.sub(this.val_input_name_pattern, {i:i});
	},

	//
	// Markup
	//

	_valuesMenu: function(
		/* string */	menu_name)
	{
		// This must use a select tag!

		var markup = '<select name="{n}" class="{f} {c}" />';

		return Y.Lang.sub(markup,
		{
			n: menu_name,
			f: Y.FormManager.field_marker_class,
			c: this.qb.getClassName('field')
		});
	}
};
