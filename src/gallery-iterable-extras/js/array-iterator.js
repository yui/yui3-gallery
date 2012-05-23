/**
 * @module gallery-iterable-extras
 */

/**********************************************************************
 * Iterator for an array.  Useful for any class that manages an array and
 * wants to mix in `Y.Iterable`.  Safe, but not stable, when the array is
 * modified during iteration.
 *
 * @class ArrayIterator
 * @method constructor
 * @param list {Array}
 */

function ArrayIterator(
	/* array */    list)
{
	this._list = list;
	this.moveToBeginning();
}

ArrayIterator.prototype =
{
	/**
	 * @method atBeginning
	 * @return {Boolean} true if at the beginning
	 */
	atBeginning: function()
	{
		return (this._next <= 0);
	},

	/**
	 * @method atEnd
	 * @return {Boolean} true if at the end
	 */
	atEnd: function()
	{
		return (this._next >= this._list.length);
	},

	/**
	 * Move to the beginning of the list.
	 * 
	 * @method moveToBeginning
	 */
	moveToBeginning: function()
	{
		this._next = 0;
	},

	/**
	 * Move to the end of the list.
	 * 
	 * @method moveToEnd
	 */
	moveToEnd: function()
	{
		this._next = this._list.length;
	},

	/**
	 * @method next
	 * @return {Mixed} next value in the list or undefined if at the end
	 */
	next: function()
	{
		if (this._next < this._list.length)
		{
			return this._list[ this._next++ ];
		}
	},

	/**
	 * @method prev
	 * @return {Mixed} previous value in the list or undefined if at the beginning
	 */
	prev: function()
	{
		if (this._next > 0)
		{
			return this._list[ --this._next ];
		}
	}
};

Y.ArrayIterator = ArrayIterator;
