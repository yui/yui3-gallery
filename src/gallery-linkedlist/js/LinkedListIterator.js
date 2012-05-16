/**
 * @module gallery-linkedlist
 */

/**********************************************************************
 * Iterator for LinkedList.  Stable except when the next item is removed by
 * calling list.remove() instead of iter.removeNext().  When items are
 * inserted into an empty list, the pointer remains at the end, not the
 * beginning.
 *
 * @class LinkedListIterator
 * @method constructor
 * @private
 * @param list {LinkedList}
 */

function LinkedListIterator(
	/* LinkedList */    list)
{
	this._list = list;
	this.moveToBeginning();
}

LinkedListIterator.prototype =
{
	/**
	 * @method atBeginning
	 * @return {Boolean} true if at the beginning
	 */
	atBeginning: function()
	{
		return (!this._next || (!this._at_end && !this._next._prev));
	},

	/**
	 * @method atEnd
	 * @return {Boolean} true if at the end
	 */
	atEnd: function()
	{
		return (!this._next || this._at_end);
	},

	/**
	 * Move to the beginning of the list.
	 * 
	 * @method moveToBeginning
	 */
	moveToBeginning: function()
	{
		this._next   = this._list._head;
		this._at_end = !this._next;
	},

	/**
	 * Move to the end of the list.
	 * 
	 * @method moveToEnd
	 */
	moveToEnd: function()
	{
		this._next   = this._list._tail;
		this._at_end = true;
	},

	/**
	 * @method next
	 * @return {Mixed} next value in the list or undefined if at the end
	 */
	next: function()
	{
		if (this._at_end)
		{
			return;
		}

		var result = this._next;
		if (this._next && this._next._next)
		{
			this._next = this._next._next;
		}
		else
		{
			this._at_end = true;
		}

		if (result)
		{
			return result.value;
		}
	},

	/**
	 * @method prev
	 * @return {Mixed} previous value in the list or undefined if at the beginning
	 */
	prev: function()
	{
		var result;
		if (this._at_end)
		{
			this._at_end = false;
			result       = this._next;
		}
		else if (this._next)
		{
			result = this._next._prev;
			if (result)
			{
				this._next = result;
			}
		}

		if (result)
		{
			return result.value;
		}
	},

	/**
	 * Insert the given value at the iteration position.  The inserted item
	 * will be returned by next().
	 * 
	 * @method insert
	 * @param value {Mixed} value to insert
	 * @return {LinkedListItem} inserted item
	 */
	insert: function(
		/* object */	value)
	{
		if (this._at_end || !this._next)
		{
			this._next = this._list.append(value);
		}
		else
		{
			this._next = this._list.insertBefore(value, this._next);
		}

		return this._next;
	},

	/**
	 * Remove the previous item from the list.
	 * 
	 * @method removePrev
	 * @return {LinkedListItem} removed item or undefined if at the end
	 */
	removePrev: function()
	{
		var result;
		if (this._at_end)
		{
			result = this._next;
			if (this._next)
			{
				this._next = this._next._prev;
			}
		}
		else if (this._next)
		{
			result = this._next._prev;
		}

		if (result)
		{
			this._list.remove(result);
			return result;
		}
	},

	/**
	 * Remove the next item from the list.
	 * 
	 * @method removeNext
	 * @return {LinkedListItem} removed item or undefined if at the end
	 */
	removeNext: function()
	{
		var result;
		if (this._next && !this._at_end)
		{
			result = this._next;
			if (this._next && this._next._next)
			{
				this._next = this._next._next;
			}
			else
			{
				this._next   = this._next ? this._next._prev : null;
				this._at_end = true;
			}
		}

		if (result)
		{
			this._list.remove(result);
			return result;
		}
	}
};
