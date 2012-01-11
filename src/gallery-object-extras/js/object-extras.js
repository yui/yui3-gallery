"use strict";

/**********************************************************************
 * <p>Augments Y.Object with the same higher-order functions that
 * array-extras adds to Y.Array.  Note that, unlike Y.Array, iteration
 * order in Y.Object is not guaranteed!</p>
 * 
 * @module gallery-object-extras
 */

/**
 * @class Object
 */

Y.mix(Y.Object,
{
	/**
	 * Executes the supplied function on each item in the object.
	 * Iteration stops if the supplied function does not return a truthy
	 * value.  The function receives the value, the key, and the object
	 * itself as parameters (in that order).
	 *
	 * By default, only properties owned by _obj_ are enumerated. To include
	 * prototype properties, set the _proto_ parameter to `true`.
	 *
	 * @param o {Object} the object to iterate
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @param proto {Boolean} include prototype properties
	 * @return {Boolean} `true` if every item in the array returns `true` from the supplied function, `false` otherwise
	 * @static
	 */
	every: function(o, f, c, proto)
	{
		for (var k in o)
		{
			if ((proto || o.hasOwnProperty(k)) && !f.call(c, o[k], k, o))
			{
				return false;
			}
		}

		return true;
	},

	/**
	 * Executes the supplied function on each item in the object.  Returns
	 * a new object containing the items for which the supplied function
	 * returned a truthy value.  The function receives the value, the key,
	 * and the object itself as parameters (in that order).
	 *
	 * By default, only properties owned by _obj_ are enumerated. To include
	 * prototype properties, set the _proto_ parameter to `true`.
	 *
	 * @param o {Object} the object to iterate
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @param proto {Boolean} include prototype properties
	 * @return {Object} object of items for which the supplied function returned a truthy value (empty if it never returned a truthy value)
	 * @static
	 */
	filter: function(o, f, c, proto)
	{
		var result = {};

		for (var k in o)
		{
			var v = o[k];
			if ((proto || o.hasOwnProperty(k)) && f.call(c, v, k, o))
			{
				result[k] = v;
			}
		}

		return result;
	},

	/**
	 * Executes the supplied function on each item in the object, searching
	 * for the first item that matches the supplied function.  The function
	 * receives the value, the key, and the object itself as parameters (in
	 * that order).
	 *
	 * By default, only properties owned by _obj_ are enumerated. To include
	 * prototype properties, set the _proto_ parameter to `true`.
	 *
	 * @param o {Object} the object to iterate
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @param proto {Boolean} include prototype properties
	 * @return {Mixed} the first item for which the supplied function returns `true`, or `null` if it never returns `true`
	 * @static
	 */
	find: function(o, f, c, proto)
	{
		for (var k in o)
		{
			var v = o[k];
			if ((proto || o.hasOwnProperty(k)) && f.call(c, v, k, o))
			{
				return v;
			}
		}

		return null;
	},

	/**
	 * Executes the supplied function on each item in the object, searching
	 * for the first item that matches the supplied function.
	 *
	 * By default, only properties owned by _obj_ are enumerated. To include
	 * prototype properties, set the _proto_ parameter to `true`.
	 *
	 * @param o {Object} the object to iterate
	 * @param v {Mixed} the value to search for
	 * @param proto {Boolean} include prototype properties
	 * @return {String} key of an item strictly equal to _v_, or null if not found
	 * @static
	 */
	keyOf: function(o, v, proto)
	{
		for (var k in o)
		{
			if ((proto || o.hasOwnProperty(k)) && o[k] === v)
			{
				return k;
			}
		}

		return null;
	},

	/**
	 * Executes a named method on each item in the object. Items that do
	 * not have a function by that name will be skipped.
	 *
	 * @param o {Object} the object to iterate
	 * @param f {String} the function to invoke
	 * @param args* {Any} any number of additional args are passed as parameters to the execution of the named method
	 * @return {Object} all return values, mapped according to the item key
	 * @static
	 */
	invoke: function(o, f)
	{
		var args = Y.Array(arguments, 2, true),
			result = {};

		for (var k in o)
		{
			var v = o[k];
			if (o.hasOwnProperty(k) && Y.Lang.isFunction(v[f]))
			{
				result[k] = v[f].apply(v, args);
			}
		}

		return result;
	},

	/**
	 * Executes the supplied function on each item in the object and
	 * returns a new object with the results.  The function receives the
	 * value, the key, and the object itself as parameters (in that order).
	 *
	 * By default, only properties owned by _obj_ are enumerated. To include
	 * prototype properties, set the _proto_ parameter to `true`.
	 *
	 * @param o {Object} the object to iterate
	 * @param f {String} the function to invoke
	 * @param c {Object} optional context object
	 * @param proto {Boolean} include prototype properties
	 * @return {Object} all return values, mapped according to the item key
	 * @static
	 */
	map: function(o, f, c, proto)
	{
		var result = {};

		for (var k in o)
		{
			if (proto || o.hasOwnProperty(k))
			{
				result[k] = f.call(c, o[k], k, o);
			}
		}

		return result;
	},

	/**
	 * Partitions an object into two new objects, one with the items for
	 * which the supplied function returns `true`, and one with the items
	 * for which the function returns `false`.  The function receives the
	 * value, the key, and the object itself as parameters (in that order).
	 *
	 * By default, only properties owned by _obj_ are enumerated. To include
	 * prototype properties, set the _proto_ parameter to `true`.
	 *
	 * @param o {Object} the object to iterate
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @param proto {Boolean} include prototype properties
	 * @return {Object} object with two properties: `matches` and `rejects`. Each is an object containing the items that were selected or rejected by the test function (or an empty object if none).
	 * @static
	 */
	partition: function(o, f, c, proto)
	{
		var result =
		{
			matches: {},
			rejects: {}
		};

		for (var k in o)
		{
			var v = o[k];
			if (proto || o.hasOwnProperty(k))
			{
				var set = f.call(c, v, k, o) ? result.matches : result.rejects;
				set[k]  = v;
			}
		}

		return result;
	},

	/**
	 * Executes the supplied function on each item in the object, folding
	 * the object into a single value.  The function receives the value
	 * returned by the previous iteration (or the initial value if this is
	 * the first iteration), the value being iterated, the key, and the
	 * object itself as parameters (in that order).
	 *
	 * By default, only properties owned by _obj_ are enumerated. To include
	 * prototype properties, set the _proto_ parameter to `true`.
	 *
	 * @param o {Object} the object to iterate
	 * @param init {Mixed} the initial value
	 * @param f {String} the function to invoke
	 * @param c {Object} optional context object
	 * @param proto {Boolean} include prototype properties
	 * @return {Mixed} final result from iteratively applying the given function to each item in the object
	 * @static
	 */
	reduce: function(o, init, f, c, proto)
	{
		var result = init;

		for (var k in o)
		{
			if (proto || o.hasOwnProperty(k))
			{
				result = f.call(c, result, o[k], k, o);
			}
		}

		return result;
	},

	/**
	 * Executes the supplied function on each item in the object.  Returns
	 * a new object containing the items for which the supplied function
	 * returned a falsey value.  The function receives the value, the key,
	 * and the object itself as parameters (in that order).
	 *
	 * By default, only properties owned by _obj_ are enumerated. To include
	 * prototype properties, set the _proto_ parameter to `true`.
	 *
	 * @param o {Object} the object to iterate
	 * @param f {Function} the function to execute on each item
	 * @param c {Object} optional context object
	 * @param proto {Boolean} include prototype properties
	 * @return {Object} object of items for which the supplied function returned a falsey value (empty if it never returned a falsey value)
	 * @static
	 */
	reject: function(o, f, c, proto)
	{
		return Y.Object.filter(o, function(v, k, o)
		{
			return !f.call(c, v, k, o);
		},
		c, proto);
	},

	/**
	 * Creates an object by pairing the corresponding elements of two arrays.
	 *
	 * @param a1 {Array} the keys which must be strings
	 * @param a2 {Array} the values
	 * @return {Object} object formed by pairing each element of the first array with an item in the second array having the corresponding index
	 * @static
	 */
	zip: function(a1, a2)
	{
		var result = {};

		Y.Array.each(a1, function(v, i)
		{
			result[ v.toString() ] = a2[i];
		});

		return result;
	}
});
