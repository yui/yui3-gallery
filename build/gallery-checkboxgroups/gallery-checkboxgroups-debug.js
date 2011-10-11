YUI.add('gallery-checkboxgroups', function(Y) {

"use strict";

/**********************************************************************
 * Various behaviors that can be attached to a group of checkboxes.
 *
 * @module gallery-checkboxgroups
 */

/**
 * <p>Base class for enforcing constraints on groups of checkboxes.</p>
 *
 * <p>Derived classes must override <code>enforceConstraints()</code>.</p>
 * 
 * @class CheckboxGroup
 * @constructor
 * @param cb_list {String|Node|NodeList} The list of checkboxes to manage
 */

function CheckboxGroup(
	/* string/Node/NodeList */	cb_list)
{
	this.cb_list = new Y.NodeList('');
	this.ev_list = [];
	this.splice(0, 0, cb_list);

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
	/**
	 * @return {NodeList} List of managed checkboxes
	 */
	getCheckboxList: function()
	{
		return this.cb_list;
	},

	/**
	 * Same functionality as <code>Array.splice()</code>.  Operates on the
	 * list of managed checkboxes.
	 * 
	 * @param start {Int} Insertion index
	 * @param delete_count {Int} Number of items to remove, starting from <code>start</code>
	 * @param cb_list {String|Node|NodeList} The list of checkboxes to insert at <code>start</code>
	 */
	splice: function(
		/* int */					start,
		/* int */					delete_count,
		/* string/Node/NodeList */	cb_list)
	{
		for (var i=start; i<delete_count; i++)
		{
			this.ev_list[i].detach();
		}

		if (Y.Lang.isString(cb_list))
		{
			cb_list = Y.all(cb_list);
		}

		if (cb_list instanceof Y.NodeList)
		{
			cb_list.each(function(cb, i)
			{
				var j=start+i, k=(i===0 ? delete_count : 0);
				this.cb_list.splice(j, k, cb);
				this.ev_list.splice(j, k, cb.on('click', checkboxChanged, this));
			},
			this);
		}
		else if (cb_list instanceof Y.Node)
		{
			this.cb_list.splice(start, delete_count, cb_list);
			this.ev_list.splice(start, delete_count, cb_list.on('click', checkboxChanged, this));
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
		if (this.ignore_change || this.cb_list.isEmpty() || this.allDisabled())
		{
			return;
		}

		cb = Y.one(cb);

		this.cb_list.each(function(cb1, i)
		{
			if (cb1 == cb)
			{
				this.enforceConstraints(this.cb_list, i);
			}
		},
		this);
	},

	/**
	 * Derived classes must override this function to implement the desired behavior.
	 * 
	 * @param cb_list {String|Object|Array} The list of checkboxes
	 * @param index {Int} The index of the checkbox that changed
	 */
	enforceConstraints: function(
		/* NodeList */	cb_list,
		/* int */		index)
	{
	},

	/**
	 * @return {boolean} <code>true</code> if all checkboxes are checked
	 */
	allChecked: function()
	{
		var count = this.cb_list.size();
		for (var i=0; i<count; i++)
		{
			var cb = this.cb_list.item(i);
			if (!cb.get('disabled') && !cb.get('checked'))
			{
				return false;
			}
		}

		return true;
	},

	/**
	 * @return {boolean} <code>true</code> if all checkboxes are unchecked
	 */
	allUnchecked: function()
	{
		var count = this.cb_list.size();
		for (var i=0; i<count; i++)
		{
			if (this.cb_list.item(i).get('checked'))
			{
				return false;
			}
		}

		return true;
	},

	/**
	 * @return {boolean} <code>true</code> if all checkboxes are disabled
	 */
	allDisabled: function()
	{
		var count = this.cb_list.size();
		for (var i=0; i<count; i++)
		{
			if (!this.cb_list.item(i).get('disabled'))
			{
				return false;
			}
		}

		return true;
	}
};

Y.CheckboxGroup = CheckboxGroup;
/**********************************************************************
 * At least one checkbox must be selected.  If the last one is turned off,
 * the active, adjacent one is turned on.  The exact algorithm is explained
 * in "Tog on Interface".  The checkboxes are assumed to be ordered in the
 * order they were added.
 * 
 * @class AtLeastOneCheckboxGroup
 * @extends CheckboxGroup
 * @constructor
 * @param cb_list {String|Node|NodeList} The list of checkboxes to manage
 */

function AtLeastOneCheckboxGroup(
	/* string/Node/NodeList */	cb_list)
{
	this.direction = AtLeastOneDirection.SLIDE_UP;
	AtLeastOneCheckboxGroup.superclass.constructor.call(this, cb_list);
}

var AtLeastOneDirection =
{
	SLIDE_UP:   0,
	SLIDE_DOWN: 1
};

function getNextActiveIndex(
	/* NodeList */	cb_list,
	/* int */		index)
{
	if (cb_list.size() < 2)
		{
		return index;
		}

	var new_index = index;
	do
		{
		if (new_index === 0)
			{
			this.direction = AtLeastOneDirection.SLIDE_DOWN;
			}
		else if (new_index == cb_list.size()-1)
			{
			this.direction = AtLeastOneDirection.SLIDE_UP;
			}

		if (this.direction == AtLeastOneDirection.SLIDE_UP)
			{
			new_index = Math.max(0, new_index-1);
			}
		else
			{
			new_index = Math.min(cb_list.size()-1, new_index+1);
			}
		}
		while (cb_list.item(new_index).get('disabled'));

	return new_index;
}

Y.extend(AtLeastOneCheckboxGroup, CheckboxGroup,
{
	enforceConstraints: function(
		/* NodeList */	cb_list,
		/* int */		index)
	{
		if (cb_list.item(index).get('checked') || !this.allUnchecked())
		{
			this.direction = AtLeastOneDirection.SLIDE_UP;
			return;
		}

		// slide to the adjacent checkbox, skipping over disabled ones

		var new_index = getNextActiveIndex.call(this, cb_list, index);
		if (new_index == index)											// may have hit the end and bounced back
			{
			new_index = getNextActiveIndex.call(this, cb_list, index);	// if newID == id, then there is only one enabled
			}

		// turn the new checkbox on

		this.ignore_change = true;
		cb_list.item(new_index).set('checked', true);
		this.ignore_change = false;
	}
});

Y.AtLeastOneCheckboxGroup = AtLeastOneCheckboxGroup;
/**********************************************************************
 * At most one checkbox can be selected.  If one is turned on, the active
 * one is turned off.
 * 
 * @class AtMostOneCheckboxGroup
 * @extends CheckboxGroup
 * @constructor
 * @param cb_list {String|Node|NodeList} The list of checkboxes to manage
 */

function AtMostOneCheckboxGroup(
	/* string/Node/NodeList */	cb_list)
{
	AtMostOneCheckboxGroup.superclass.constructor.call(this, cb_list);
}

Y.extend(AtMostOneCheckboxGroup, CheckboxGroup,
{
	enforceConstraints: function(
		/* NodeList */	cb_list,
		/* int */	index)
	{
		if (!cb_list.item(index).get('checked'))
		{
			return;
		}

		var count = cb_list.size();
		for (var i=0; i<count; i++)
		{
			if (i != index)
			{
				cb_list.item(i).set('checked', false);
			}
		}
	}
});

Y.AtMostOneCheckboxGroup = AtMostOneCheckboxGroup;
/**********************************************************************
 * All checkboxes can be selected and a select-all checkbox is available
 * to check all. This check-all box is automatically changed if any other
 * checkbox changes state.
 * 
 * @class SelectAllCheckboxGroup
 * @extends CheckboxGroup
 * @constructor
 * @param select_all_cb {String|Object} The checkbox that triggers "select all"
 * @param cb_list {String|Node|NodeList} The list of checkboxes to manage
 */

function SelectAllCheckboxGroup(
	/* string/Node */			select_all_cb,
	/* string/Node/NodeList */	cb_list)
{
	this.select_all_cb = Y.one(select_all_cb);
	this.select_all_cb.on('click', this.toggleSelectAll, this);

	SelectAllCheckboxGroup.superclass.constructor.call(this, cb_list);
}

Y.extend(SelectAllCheckboxGroup, CheckboxGroup,
{
	getSelectAllCheckbox: function()
	{
		return this.select_all_cb;
	},

	toggleSelectAll: function()
	{
		var checked = this.select_all_cb.get('checked');
		var count   = this.cb_list.size();
		for (var i=0; i<count; i++)
		{
			var cb = this.cb_list.item(i);
			if (!cb.get('disabled'))
			{
				cb.set('checked', checked);
			}
		}
	},

	enforceConstraints: function(
		/* NodeList */	cb_list,
		/* int */		index)
	{
		this.select_all_cb.set('checked', this.allChecked());
	}
});

Y.SelectAllCheckboxGroup = SelectAllCheckboxGroup;
/**********************************************************************
 * Enables the given list of nodes if any checkboxes are checked.
 * 
 * @class EnableIfAnyCheckboxGroup
 * @extends CheckboxGroup
 * @constructor
 * @param cb_list {String|Node|NodeList} The list of checkboxes to manage
 * @param nodes {String|NodeList} The nodes to enable/disable
 */

function EnableIfAnyCheckboxGroup(
	/* string/Node/NodeList */	cb_list,
	/* string/NodeList */		nodes)
{
	this.nodes = Y.Lang.isString(nodes) ? Y.all(nodes) : nodes;
	EnableIfAnyCheckboxGroup.superclass.constructor.call(this, cb_list);
	this.enforceConstraints(this.cb_list, 0);
}

Y.extend(EnableIfAnyCheckboxGroup, CheckboxGroup,
{
	enforceConstraints: function(
		/* NodeList */	cb_list,
		/* int */		index)
	{
		var disable = this.allUnchecked();
		this.nodes.each(function(node)
		{
			node.set('disabled', disable);
		});
	}
});

Y.EnableIfAnyCheckboxGroup = EnableIfAnyCheckboxGroup;


}, 'gallery-2011.08.31-20-57' ,{requires:['node-base']});
