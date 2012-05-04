YUI.add('gallery-sort-extras', function(Y) {

"use strict";

/**********************************************************************
 * <p>Utilities for sorting.</p>
 * 
 * @module gallery-sort-extras
 * @class Sort
 */

var isArray = Y.Lang.isArray;

var Sort = Y.namespace('Sort');

/**
 * Utility function for extracting the same value from both comparator
 * arguments.
 *
 * @param key {Array} path to element stored in both a and b
 * @param a {Object} first object to compare
 * @param b {Object} second object to compare
 * @return {Array} values extracted from a and b
 * @static
 */
Sort.drill = function(key, a,b)
{
	// optimize for speed, so don't use Y.each

	var count = key.length;
	for (var i=0; i<count; i++)
	{
		var k = key[i];
		a     = a[k];
		b     = b[k];
	}

	return [a,b];
};

/**
 * The default behavior for sorting strings.  Provided for cases where one
 * needs to compare object members.
 *
 * @param a {String} first string to compare
 * @param b {String} second string to compare
 * @return {Number} -1,0,+1 based on comparing the strings
 * @static
 */
Sort.compareAsString = function(a,b)
{
	return (a < b ? -1 : a > b ? +1 : 0);
};

/**
 * @param a {String} first string to compare
 * @param b {String} second string to compare
 * @return {Number} -1,0,+1 based on comparing the strings when ignoring case
 * @static
 */
Sort.compareAsStringNoCase = function(a,b)
{
	a = a.toLowerCase();
	b = b.toLowerCase();
	return (a < b ? -1 : a > b ? +1 : 0);	// duplicate Sort.compareAsString() for speed
};

/**
 * The default behavior for sorting numbers.  Provided for cases where one
 * needs to compare object members.
 *
 * @param a {Number} first number to compare
 * @param b {Number} second number to compare
 * @return {Number} -1,0,+1 based on comparing the values
 * @static
 */
Sort.compareAsNumber = function(a,b)
{
	return a - b;
};

/**
 * <p>Sort by an object member:
 * sort(Y.bind(Y.Sort.compareKey, null, Y.Sort.compareAs*, key_or_path))</p>
 * 
 * <p>Key can be an array, to drill deep inside the objects, e.g.,
 * ['foo','bar','baz'] translates to a.foo.bar.baz</p>
 *
 * @param f {Function} comparator
 * @param key {String|Array} object key or path to the value which should be compared
 * @return {Number} -1,0,+1 based on comparing the values
 * @static
 */
Sort.compareKey = function(f, key, a,b)
{
	if (isArray(key))
	{
		var v = Sort.drill(key, a,b);
		return f(v[0], v[1]);
	}
	else
	{
		return f(a[key], b[key]);
	}
};

/**
 * Flip the sort order:  sort(Y.Sort.flip(comparator));
 *
 * @param f {Function} original comparator which takes 2 arguments
 * @return {Function} new comparator that inverts the sort order
 * @static
 */
Sort.flip = function(f)
{
	return function(a,b)
	{
		return f(b,a);
	};
};


}, 'gallery-2012.04.26-15-49' ,{requires:['oop']});
