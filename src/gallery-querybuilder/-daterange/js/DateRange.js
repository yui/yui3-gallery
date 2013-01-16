"use strict";

/**********************************************************************
 * Date range
 *
 * Database query operations in op_list: [lower-bound, upper-bound]
 */

DynamicFilter.DateRange = function(
	/* object */	dynamic_filter,
	/* object */	config)
{
	this.df = dynamic_filter;

	// prefix allows multiple forms per page

	if (Lang.isObject(config.field_prefix))
	{
		this.val_start_date_name_pattern = config.field_prefix.start_date;
		this.val_end_date_name_pattern   = config.field_prefix.end_date;
	}
	else
	{
		this.val_start_date_name_pattern = config.field_prefix + 'filter_start_date_{i}';
		this.val_end_date_name_pattern   = config.field_prefix + 'filter_end_date_{i}';
	}

	this.submit_date_as_string = config.submit_date_as_string;
	this.form                  = config.form;
};

var DFDateRange               = DynamicFilter.DateRange,
	date_text_suffix          = '_date_text',
	calendar_container_suffix = '_calendar_container';

DFDateRange.start_date_marker_class = 'satg-filter-start-date';
DFDateRange.end_date_marker_class   = 'satg-filter-end-date';

function initDate(
	/* calendar */		cal,
	/* input field */	input,
	/* int/string */	date)
{
	if (Lang.isNumber(date))
	{
		cal.setDate(new Date(date));
	}
	else
	{
		input.value = date;
		cal.sync();
	}
};

function validateDateRange(form, e)
{
	var inputs = e._satg_date_range;
	if (!inputs[0].value && !inputs[1].value)
	{
		this.displayMessage(e, YAHOO.SATG.Locale.SATGDynamicFilter.date_range_required, 'error');
		return false;
	}
	else
	{
		return true;
	}
}

DFDateRange.prototype =
{
	create: function(
		/* int */		filter_index,
		/* object */	var_config,
		/* array */		op_list,
		/* array */		value)
	{
		this.start_cell           = this.df._createContainer();
		this.start_cell.className = DFDateRange.start_date_marker_class;
		var start_name            = this.startDateName(filter_index);
		this.start_cell.innerHTML = this._startDateInput(start_name, var_config.validation);

		this.end_cell           = this.df._createContainer();
		this.end_cell.className = DFDateRange.end_date_marker_class;
		var end_name            = this.endDateName(filter_index);
		this.end_cell.innerHTML = this._endDateInput(end_name, var_config.validation);

		this.db_query_lower = op_list[0];
		this.db_query_upper = op_list[1];

		return [ this.start_cell, this.end_cell ];
	},

	postCreate: function(
		/* int */		filter_index,
		/* object */	var_config,
		/* array */		op_list,
		/* array */		value)
	{
		// IE6 crashes if we call getElementsByTagName() before adding it to the DOM

		this.start_inputs = this.start_cell.getElementsByTagName('input');
		this.end_inputs   = this.end_cell.getElementsByTagName('input');

		if (this.form instanceof YAHOO.SATG.Form)
		{
			this.start_inputs[1]._satg_date_range = [ this.start_inputs[0], this.end_inputs[0] ];
			this.form.setFunction(Dom.generateId(this.start_inputs[1]), validateDateRange);
		}

		var start_container = Dom.get(this.startDateName(filter_index) + calendar_container_suffix);
		var end_container   = Dom.get(this.endDateName(filter_index) + calendar_container_suffix);
		this.containers     = [ start_container, end_container ]

		this.cal = new CalendarPair(start_container, end_container,
									this.start_inputs[1], this.end_inputs[1]);
		this.cal.s_calendar.setTimestampInput(this.start_inputs[0], this.submit_date_as_string);
		this.cal.e_calendar.setTimestampInput(this.end_inputs[0], this.submit_date_as_string);

		if (var_config.start_no_date_prompt)
		{
			this.cal.s_calendar.showNoDateOption(var_config.start_no_date_prompt);
		}

		if (var_config.end_no_date_prompt)
		{
			this.cal.e_calendar.showNoDateOption(var_config.end_no_date_prompt);
		}

		if (value instanceof Array && value.length == 2)
		{
			initDate(this.cal.s_calendar, this.start_inputs[1], value[0]);
			initDate(this.cal.e_calendar, this.end_inputs[1], value[1]);
		}

		this.cal.s_calendar.calendar.selectEvent.subscribe(this.df._notifyChanged, null, this.df);
		this.cal.e_calendar.calendar.selectEvent.subscribe(this.df._notifyChanged, null, this.df);

		// setting focus doesn't work -- calendar does not remain visible
	},

	destroy: function()
	{
		// DynamicFilter calls Event.purgeElement()

		this.cal.destroy();

		this.start_cell   = null;
		this.start_inputs = null;
		this.end_cell     = null;
		this.end_inputs   = null;
		this.containers   = null;
	},

	updateName: function(
		/* int */	new_index)
	{
		var name = this.startDateName(new_index);
		this.start_inputs[0].setAttribute('name', name);
		this.start_inputs[1].setAttribute('name', name + date_text_suffix);

		var name = this.endDateName(new_index);
		this.end_inputs[0].setAttribute('name', name);
		this.end_inputs[1].setAttribute('name', name + date_text_suffix);
	},

	set: function(
		/* int */	filter_index,
		/* map */	data)
	{
		initDate(this.cal.s_calendar, this.start_inputs[1],
			parseInt(data[ this.startDateName(filter_index) ], 10));

		initDate(this.cal.e_calendar, this.end_inputs[1],
			parseInt(data[ this.endDateName(filter_index) ], 10));
	},

	toDatabaseQuery: function()
	{
		var result = [];

		if (this.start_inputs[0].value)
		{
			result.push([ this.db_query_lower, this.start_inputs[0].value ]);
		}

		if (this.end_inputs[0].value)
		{
			result.push([ this.db_query_upper, this.end_inputs[0].value ]);
		}

		return result;
	},

	/**********************************************************************
	 * Form element names.
	 */

	startDateName: function(
		/* int */	i)
	{
		return Lang.substitute(this.val_start_date_name_pattern, {i:i});
	},

	endDateName: function(
		/* int */	i)
	{
		return Lang.substitute(this.val_end_date_name_pattern, {i:i});
	},

	//
	// Markup
	//

	_startDateInput: function(
		/* string */	input_name,
		/* string */    validation_class)
	{
		// This must use an input tag!
		// The hidden input must be first!

		var markup =
			'<input type="hidden" name="{vn}"/>' +
			'<input type="text" name="{tn}" class="satg-field satg-filter-field {c}"/> &ndash;' +
			'<div id="{cid}"></div>';

		return Lang.substitute(markup,
		{
			vn:  input_name,
			tn:  input_name + date_text_suffix,
			cid: input_name + calendar_container_suffix,
			c: validation_class || ''
		});
	},

	_endDateInput: function(
		/* string */	input_name,
		/* string */    validation_class)
	{
		// This must use an input tag!
		// The hidden input must be first!

		var markup =
			'<input type="hidden" name="{vn}"/>' +
			'<input type="text" name="{tn}" class="satg-field satg-filter-field {c}"/>' +
			'<div id="{cid}"></div>';

		return Lang.substitute(markup,
		{
			vn:  input_name,
			tn:  input_name + date_text_suffix,
			cid: input_name + calendar_container_suffix,
			c: validation_class || ''
		});
	}
};
