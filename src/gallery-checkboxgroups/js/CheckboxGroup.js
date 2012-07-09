"use strict";

/**********************************************************************
 * Various behaviors that can be attached to a group of checkboxes.
 *
 * @module gallery-checkboxgroups
 * @main gallery-checkboxgroups
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
	 * @method getCheckboxList
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
	 * @method splice
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
		else if (cb_list && cb_list._node)
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

	/**
	 * Call this if you modify the checkbox programmatically, since that
	 * will not fire a click event.
	 * 
	 * @method checkboxChanged
	 * @param cb {Node|String} checkbox that was modified
	 */
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
	 * @method enforceConstraints
	 * @param cb_list {String|Object|Array} The list of checkboxes
	 * @param index {Int} The index of the checkbox that changed
	 */
	enforceConstraints: function(
		/* NodeList */	cb_list,
		/* int */		index)
	{
	},

	/**
	 * @method allChecked
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
	 * @method allUnchecked
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
	 * @method allDisabled
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
