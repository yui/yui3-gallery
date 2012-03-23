"use strict";

/**********************************************************************
 * Item stored by LinkedList.
 * 
 * @class LinkedListItem
 */

/**
 * @method constructor
 * @param value {Mixed} value to store
 * @private
 */

function LinkedListItem(
	/* object */	value)
{
	this.value = value;
	this._prev = this._next = null;
}

LinkedListItem.prototype =
{
	/**
	 * @return {LinkedListItem} previous item or null
	 */
	prev: function()
	{
		return this._prev;
	},

	/**
	 * @return {LinkedListItem} next item or null
	 */
	next: function()
	{
		return this._next;
	}
};

Y.LinkedListItem = LinkedListItem;
