/**********************************************************************
 * @class Array
 */

Y.mix(Y.Array,
{
	/**
	 * Converts the array of objects into a map of the same objects, keyed
	 * off a particular attribute.
	 *
	 * @param a {Array} the array to iterate
	 * @param k {String} the attribute to key off
	 * @return {Object} map of the objects
	 * @static
	 */
	toObject: function(a, k)
	{
		var result = {};

		Y.Array.each(a, function(v)
		{
			result[ v[k] ] = v;
		});

		return result;
	}
});
