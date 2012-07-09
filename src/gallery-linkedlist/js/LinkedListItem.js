"use strict";

/**
 * @module gallery-linkedlist
 */

/**********************************************************************
 * Item stored by LinkedList.
 * 
 * @class LinkedListItem
 * @method constructor
 * @private
 * @param value {Mixed} value to store
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
	 * @method prev
	 * @return {LinkedListItem} previous item or null
	 */
	prev: function()
	{
		return this._prev;
	},

	/**
	 * @method next
	 * @return {LinkedListItem} next item or null
	 */
	next: function()
	{
		return this._next;
	}
};

Y.LinkedListItem = LinkedListItem;
