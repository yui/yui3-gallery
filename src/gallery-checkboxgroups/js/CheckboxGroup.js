"use strict";

var Direction =
{
	SLIDE_UP:   0,
	SLIDE_DOWN: 1
};

/**********************************************************************
 * <p>Base class for enforcing constraints on groups of checkboxes.</p>
 *
 * <p>Derived classes must override <code>enforceConstraints()</code>.</p>
 * 
 * @module gallery-checkboxgroups
 * @class CheckboxGroup
 * @constructor
 * @param cb_list {String|Object|Array} The list of checkboxes to manage
 */

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
	/**
	 * @return {Array} List of managed checkboxes
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
	 * @param cb_list {String|Object|Array} The list of checkboxes to insert at <code>start</code>
	 */
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

		if (cb_list && Y.Lang.isNumber(cb_list.length))
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

	/**
	 * Derived classes must override this function to implement the desired behavior.
	 * 
	 * @param cb_list {String|Object|Array} The list of checkboxes
	 * @param index {Int} The index of the checkbox that changed
	 */
	enforceConstraints: function(
		/* array */	cb_list,
		/* int */	index)
	{
	},

	/**
	 * @return {boolean} <code>true</code> if all checkboxes are checked
	 */
	allChecked: function()
	{
		var count = this.cb_list.length;
		for (var i=0; i<count; i++)
		{
			if (!this.cb_list[i].get('disabled') && !this.cb_list[i].get('checked'))
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

	/**
	 * @return {boolean} <code>true</code> if all checkboxes are disabled
	 */
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
