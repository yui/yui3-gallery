/**
 * @module gallery-algorithms
 */

if (Y.ArrayList)
{
	/**********************************************************************
	 * Useful algorithms that are not provided by browsers.  Available if
	 * Y.ArrayList (collection) is loaded.
	 * 
	 * @class ArrayList~extras
	 */

	Y.mix(Y.ArrayList,
	{
		/**
		 * <p>Swap two elements.</p>
		 * 
		 * @method swap
		 * @param i {int} first index
		 * @param j {int} second index
		 */
		swap: function(i,j)
		{
			Y.Array.swap(this._items, i,j);
		},

		/**
		 * <p>Set comparison function.</p>
		 * 
		 * @method setComparator
		 * @param compare {Function} the -1,0,+1 comparison function to use when sorting and searching
		 */
		setComparator: function(compare)
		{
			this._compare = compare;
		},

		/**
		 * <p>Quick sort the given list, using the function passed to setComparator().</p>
		 * 
		 * @method quickSort
		 */
		quickSort: function()
		{
			Y.Array.quickSort(this._items, this._compare);
		},

		/**
		 * <p>Binary search, using the function passed to setComparator().</p>
		 * 
		 * @method binarySearch
		 * @param target {Mixed} the object to search for
		 * @return {int} index of matched item or -1 if no match
		 */
		binarySearch: function(target)
		{
			Y.Array.binarySearch(this._items, target, this._compare);
		}
	});
}
