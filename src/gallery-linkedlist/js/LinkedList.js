/**
 * @module gallery-linkedlist
 */

/**********************************************************************
 * <p>Doubly linked list for storing items.  Supports iteration via
 * LinkedListIterator (returned by this.iterator()) or Y.each().  Also
 * supports all the other operations defined in gallery-funcprog.</p>
 * 
 * <p>Direct indexing into the list is not supported, as a reminder that it
 * is an expensive operation.  Instead, use find() with a function that
 * checks the index.</p>
 * 
 * @main gallery-linkedlist
 * @class LinkedList
 * @constructor
 * @param [list] {Mixed} any scalar or iterable list
 */

function LinkedList(list)
{
	this._head = this._tail = null;

	if (arguments.length > 1)
	{
		list = Y.Array(arguments);
	}
	else if (!Y.Lang.isUndefined(list) && !(list instanceof LinkedList) && !Y.Array.test(list))
	{
		list = Y.Array(list);
	}

	if (!Y.Lang.isUndefined(list))
	{
		Y.each(list, function(value)
		{
			this.append(value);
		},
		this);
	}
}

function wrap(value)
{
	if (value instanceof LinkedListItem)
	{
		this.remove(value);
	}
	else
	{
		value = new LinkedListItem(value);
	}

	return value;
}

LinkedList.prototype =
{
	/**
	 * @method isEmpty
	 * @return {Boolean} true if the list is empty
	 */
	isEmpty: function()
	{
		return (!this._head && !this._tail);
	},

	/**
	 * Warning:  This requires traversing the list!  Use isEmpty() whenever
	 * possible.
	 *
	 * @method size
	 * @return {Number} the number of items in the list
	 */
	size: function()
	{
		var count = 0,
			item  = this._head;

		while (item)
		{
			count++;
			item = item._next;
		}

		return count;
	},

	/**
	 * @method iterator
	 * @return {LinkedListIterator}
	 */
	iterator: function()
	{
		return new LinkedListIterator(this);
	},

	/**
	 * Creates a new, empty LinkedList.
	 *
	 * @method newInstance
	 * @return {LinkedList}
	 */
	newInstance: function()
	{
		return new LinkedList();
	},

	/**
	 * @method head
	 * @return {LinkedListItem} the first item in the list, or null if the list is empty
	 */
	head: function()
	{
		return this._head;
	},

	/**
	 * @method tail
	 * @return {LinkedListItem} the last item in the list, or null if the list is empty
	 */
	tail: function()
	{
		return this._tail;
	},

	/**
	 * @method indexOf
	 * @param needle {Mixed} the item to search for
	 * @return {Number} first index of the needle, or -1 if not found
	 */
	indexOf: function(needle)
	{
		var iter = this.iterator(), i = 0;
		while (!iter.atEnd())
		{
			if (iter.next() === needle)
			{
				return i;
			}
			i++;
		}

		return -1;
	},

	/**
	 * @method lastIndexOf
	 * @param needle {Mixed} the item to search for
	 * @return {Number} last index of the needle, or -1 if not found
	 */
	lastIndexOf: function(needle)
	{
		var iter = this.iterator(), i = this.size();
		iter.moveToEnd();
		while (!iter.atBeginning())
		{
			i--;
			if (iter.prev() === needle)
			{
				return i;
			}
		}

		return -1;
	},

	/**
	 * Clear the list.
	 * 
	 * @method clear
	 */
	clear: function()
	{
		this._head = this._tail = null;
	},

	/**
	 * @method insertBefore
	 * @param value {Mixed} value to insert
	 * @param item {LinkedListItem} existing item
	 * @return {LinkedListItem} inserted item
	 */
	insertBefore: function(
		/* object */	value,
		/* item */		item)
	{
		value = wrap.call(this, value);

		value._prev = item._prev;
		value._next = item;

		if (item._prev)
		{
			item._prev._next = value;
		}
		else
		{
			this._head = value;
		}
		item._prev = value;

		return value;
	},

	/**
	 * @method insertAfter
	 * @param item {LinkedListItem} existing item
	 * @param value {Mixed} value to insert
	 * @return {LinkedListItem} inserted item
	 */
	insertAfter: function(
		/* item */		item,
		/* object */	value)
	{
		value = wrap.call(this, value);

		value._prev = item;
		value._next = item._next;

		if (item._next)
		{
			item._next._prev = value;
		}
		else
		{
			this._tail = value;
		}
		item._next = value;

		return value;
	},

	/**
	 * @method prepend
	 * @param value {Mixed} value to prepend
	 * @return {LinkedListItem} prepended item
	 */
	prepend: function(
		/* object */	value)
	{
		value = wrap.call(this, value);

		if (this.isEmpty())
		{
			this._head = this._tail = value;
		}
		else
		{
			this.insertBefore(value, this._head);
		}

		return value;
	},

	/**
	 * @method append
	 * @param value {Mixed} value to append
	 * @return {LinkedListItem} appended item
	 */
	append: function(
		/* object */	value)
	{
		value = wrap.call(this, value);

		if (this.isEmpty())
		{
			this._head = this._tail = value;
		}
		else
		{
			this.insertAfter(this._tail, value);
		}

		return value;
	},

	/**
	 * Remove the item from the list.
	 * 
	 * @method remove
	 */
	remove: function(
		/* item */	item)
	{
		if (item._prev)
		{
			item._prev._next = item._next;
		}
		else if (item === this._head)
		{
			this._head = item._next;
			if (item._next)
			{
				item._next._prev = null;
			}
		}

		if (item._next)
		{
			item._next._prev = item._prev;
		}
		else if (item === this._tail)
		{
			this._tail = item._prev;
			if (item._prev)
			{
				item._prev._next = null;
			}
		}

		item._prev = item._next = null;
	},

	/**
	 * Reverses the items in place.
	 * 
	 * @method reverse
	 */
	reverse: function()
	{
		var list = new LinkedList();
		var iter = this.iterator();
		while (!iter.atEnd())
		{
			var item = iter.removeNext();
			list.prepend(item);
		}

		this._head = list._head;
		this._tail = list._tail;
	},

	/**
	 * @method toArray
	 * @return {Array}
	 */
	toArray: function()
	{
		var result = [],
			item   = this._head;

		while (item)
		{
			result.push(item.value);
			item = item._next;
		}

		return result;
	}
};

Y.mix(LinkedList, Y.Iterable, false, null, 4);

	/**
	 * Executes the supplied function on each item in the list.  The
	 * function receives the value, the index, and the list itself as
	 * parameters (in that order).
	 *
	 * @method each
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 */

	/**
	 * Executes the supplied function on each item in the list.  Iteration
	 * stops if the supplied function does not return a truthy value.  The
	 * function receives the value, the index, and the list itself as
	 * parameters (in that order).
	 *
	 * @method every
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Boolean} true if every item in the array returns true from the supplied function, false otherwise
	 */

	/**
	 * Executes the supplied function on each item in the list.  Returns a
	 * new list containing the items for which the supplied function
	 * returned a truthy value.  The function receives the value, the
	 * index, and the object itself as parameters (in that order).
	 *
	 * @method filter
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Object} list of items for which the supplied function returned a truthy value (empty if it never returned a truthy value)
	 */

	/**
	 * Executes the supplied function on each item in the list, searching
	 * for the first item that matches the supplied function.  The function
	 * receives the value, the index, and the object itself as parameters
	 * (in that order).
	 *
	 * @method find
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Mixed} the first item for which the supplied function returns true, or null if it never returns true
	 */

	/**
	 * Executes the supplied function on each item in the list and returns
	 * a new list with the results.  The function receives the value, the
	 * index, and the object itself as parameters (in that order).
	 *
	 * @method map
	 * @param f {String} the function to invoke
	 * @param c {Object} optional context object
	 * @return {Object} list of all return values
	 */

	/**
	 * Partitions an list into two new list, one with the items for which
	 * the supplied function returns true, and one with the items for which
	 * the function returns false.  The function receives the value, the
	 * index, and the object itself as parameters (in that order).
	 *
	 * @method partition
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Object} object with two properties: matches and rejects. Each is a list containing the items that were selected or rejected by the test function (or an empty object if none).
	 */

	/**
	 * Executes the supplied function on each item in the list, folding the
	 * list into a single value.  The function receives the value returned
	 * by the previous iteration (or the initial value if this is the first
	 * iteration), the value being iterated, the index, and the list itself
	 * as parameters (in that order).  The function must return the updated
	 * value.
	 *
	 * @method reduce
	 * @param init {Mixed} the initial value
	 * @param f {String} the function to invoke
	 * @param c {Object} optional context object
	 * @return {Mixed} final result from iteratively applying the given function to each item in the list
	 */

	/**
	 * Executes the supplied function on each item in the list.  Returns a
	 * new list containing the items for which the supplied function
	 * returned a falsey value.  The function receives the value, the
	 * index, and the object itself as parameters (in that order).
	 *
	 * @method reject
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Object} array or object of items for which the supplied function returned a falsey value (empty if it never returned a falsey value)
	 */

	/**
	 * Executes the supplied function on each item in the list.  Iteration
	 * stops if the supplied function returns a truthy value.  The function
	 * receives the value, the index, and the list itself as parameters
	 * (in that order).
	 *
	 * @method some
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Boolean} true if the function returns a truthy value on any of the items in the array, false otherwise
	 */

Y.LinkedList = LinkedList;
