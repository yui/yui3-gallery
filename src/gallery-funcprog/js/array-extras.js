/**********************************************************************
 * @class Array
 */

Y.mix(Y.Array,
{
	/**
	 * Executes the supplied function on each item in the array, searching
	 * for the first item that matches the supplied function.  The function
	 * receives the value, the index, and the array itself as parameters
	 * (in that order).
	 *
	 * @param a {Array} the array to iterate
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Number} index of the first item for which the supplied function returns true, or -1 if it never returns true
	 * @static
	 */
	findIndexOf: function(a, f, c)
	{
		var index = -1;

		Y.Array.some(a, function(v, i)
		{
			if (f.call(c, v, i, a))
			{
				index = i;
				return true;
			}
		});

		return index;
	}
});
