/**
 * @module gallery-funcprog
 */

/**
 * @class Array~funcprog-extras
 */

Y.mix(Y.Array,
{
	/**
	 * Executes the supplied function on each item in the array, searching
	 * for the first item that matches the supplied function.  The function
	 * receives the value, the index, and the array itself as parameters
	 * (in that order).
	 *
	 * @method findIndexOf
	 * @static
	 * @param a {Array} the array to iterate
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Number} index of the first item for which the supplied function returns true, or -1 if it never returns true
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
	},

	/**
	 * Executes the supplied function on each item in the array, starting
	 * from the end and folding the list into a single value.  The function
	 * receives the value returned by the previous iteration (or the
	 * initial value if this is the first iteration), the value being
	 * iterated, the index, and the list itself as parameters (in that
	 * order).  The function must return the updated value.
	 *
	 * @method reduceRight
	 * @static
	 * @param a {Array} the array to iterate
	 * @param init {Mixed} the initial value
	 * @param f {String} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Mixed} final result from iteratively applying the given function to each item in the array
	 */
	reduceRight: Y.Lang._isNative(Array.prototype.reduceRight) ?
		function(a, init, f, c)
		{
			return Array.prototype.reduceRight.call(a, function(init, item, i, a)
			{
				return f.call(c, init, item, i, a);
			},
			init);
		}
		:
		function(a, init, f, c)
		{
			var result = init;
			for (var i=a.length-1; i>=0; i--)
			{
				result = f.call(c, result, a[i], i, a);
			}

			return result;
		},

	/**
	 * Executes the supplied function on each item in the array and returns
	 * an object with the results.  The function receives the value, the
	 * key, and the object itself as parameters (in that order).  The
	 * function must return an array with two elements (key, value), which
	 * will be mixed into the result.
	 *
	 * @method mapToObject
	 * @static
	 * @param a {Mixed} the array to iterate
	 * @param f {String} the function to execute on each item
	 * @param c {Object} optional context object
	 * @return {Object} object of all return values, constructed via Y.mix
	 */
	mapToObject: function(a, f, c)
	{
		var result = {};

		for (var i=0; i<a.length; i++)
		{
			var r = f.call(c, a[i], i, a);
			result[ r[0] ] = r[1];
		}

		return result;
	}
});
