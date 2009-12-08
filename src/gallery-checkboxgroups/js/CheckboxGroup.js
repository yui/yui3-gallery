/**********************************************************************
 * <p>Base class for enforcing constraints on groups of checkboxes.</p>
 *
 * <p>Derived classes must override enforceConstraints.</p>
 */

var Direction =
{
	SLIDE_UP:   0,
	SLIDE_DOWN: 1
};

function CheckboxGroup(
	/* string/object/array */	cb_list)
{
	if (arguments.length === 0)	// derived class prototype
	{
		return;
	}

	this.cb_list = [];
	this.ev_list = [];
	this.splice(0, 0, cb_list);

	this.direction     = Direction.SLIDE_UP;
	this.ignore_change = false;
}

function checkboxChanged(
	/* event */		e,
	/* object */	obj)
{
	this.checkboxChanged(e.target);
}

CheckboxGroup.prototype =
{
	getCheckboxList: function()
	{
		return this.cb_list;
	},

	splice: function(
		/* int */					start,
		/* int */					delete_count,
		/* string/object/array */	cb_list)
	{
		for (var i=start; i<delete_count; i++)
		{
			this.ev_list[i].detach();
		}

		if (Y.Lang.isString(cb_list))
		{
			var node_list = Y.all(cb_list);

			cb_list = [];
			node_list.each(function(cb)
			{
				this.push(cb);
			},
			cb_list);
		}

		if (cb_list instanceof Array ||
			(cb_list && cb_list.length))
		{
			for (i=0; i<cb_list.length; i++)
			{
				var j=start+i, k=(i===0 ? delete_count : 0);
				this.cb_list.splice(j, k, Y.one(cb_list[i]));
				this.ev_list.splice(j, k, this.cb_list[j].on('click', checkboxChanged, this));
			}
		}
		else
		{
			this.cb_list.splice(start, delete_count);
			this.ev_list.splice(start, delete_count);
		}
	},

	checkboxChanged: function(
		/* checkbox */	cb)
	{
		if (this.ignore_change || !this.cb_list.length || this.allDisabled())
		{
			return;
		}

		cb = Y.one(cb);

		var count = this.cb_list.length;
		for (var i=0; i<count; i++)
		{
			if (cb == this.cb_list[i])
			{
				this.enforceConstraints(this.cb_list, i);
			}
		}
	},

	enforceConstraints: function(
		/* array */	cb_list,
		/* int */	index)
	{
	},

	allChecked: function()
	{
		var count = this.cb_list.length;
		for (var i=0; i<count; i++)
		{
			if (!this.cb_list[i].get('checked'))
			{
				return false;
			}
		}

		return true;
	},

	allUnchecked: function()
	{
		var count = this.cb_list.length;
		for (var i=0; i<count; i++)
		{
			if (this.cb_list[i].get('checked'))
			{
				return false;
			}
		}

		return true;
	},

	allDisabled: function()
	{
		var count = this.cb_list.length;
		for (var i=0; i<count; i++)
		{
			if (!this.cb_list[i].get('disabled'))
			{
				return false;
			}
		}

		return true;
	}
};

Y.CheckboxGroup = CheckboxGroup;
