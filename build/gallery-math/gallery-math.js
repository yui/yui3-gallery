YUI.add('gallery-math', function(Y) {

"use strict";

/**********************************************************************
 * <p>Augments built-in JavaScript Math namespace with additional
 * mathematical functions.</p>
 * 
 * @module gallery-math
 * @class Math
 */

Y.mix(Math,
{
	/**
	 * @return {Number} +1 if value > 0, -1 if value < 0, else zero
	 */
	sign: function(v)
	{
		return (v < 0 ? -1 : (v > 0 ? +1 : 0));
	},

	/**
	 * @return {Number} sum of all the arguments (either passed separately or as an array)
	 */
	add: function()
	{
		return Y.Array.reduce(Y.Array(arguments), 0, function(s, v)
		{
			if (Y.Lang.isArray(v))
			{
				v = Math.add.apply(this, v);
			}

			return s + v;
		});
	},

	/**
	 * @return {Number} sum of the reciprocals of all the arguments (either passed separately or as an array)
	 */
	addReciprocals: function()
	{
		return Y.Array.reduce(Y.Array(arguments), 0, function(s, v)
		{
			if (Y.Lang.isArray(v))
			{
				return s + Math.addReciprocals.apply(this, v);
			}
			else
			{
				return s + 1/v;
			}
		});
	},

	/**
	 * @return {Number} net value of N resistors in parallel (either passed separately or as an array)
	 */
	parallel: function()
	{
		return 1/Math.addReciprocals.apply(this, arguments);
	},

	/**
	 * @return {Number} product of all the arguments (either passed separately or as an array)
	 */
	multiply: function()
	{
		return Y.Array.reduce(Y.Array(arguments), 1, function(p, v)
		{
			if (Y.Lang.isArray(v))
			{
				v = Math.multiply.apply(this, v);
			}

			return p * v;
		});
	},

	/**
	 * @param a {Number} angle in degrees
	 * @return {Number} angle in radians
	 */
	degreesToRadians: function(a)
	{
		return a * Math.PI / 180;
	},

	/**
	 * @param a {Number} angle in radians
	 * @return {Number} angle in degrees
	 */
	radiansToDegrees: function(a)
	{
		return a * 180 / Math.PI;
	},

	/**
	 * @param v {Number}
	 * @return {Number} inverse hyperbolic cosine
	 */
	acosh: function(v)
	{
		return Math.log(v + Math.sqrt(v*v-1));
	},

	/**
	 * @param v {Number}
	 * @return {Number} inverse hyperbolic sine
	 */
	asinh: function(v)
	{
		return Math.log(v + Math.sqrt(v*v+1));
	},

	/**
	 * @param v {Number}
	 * @return {Number} inverse hyperbolic tangent
	 */
	atanh: function(v)
	{
		return Math.log((1+v)/(1-v))/2;
	},

	/**
	 * @param v {Number}
	 * @return {Number} hyperbolic cosine
	 */
	cosh: function(v)
	{
		var e = Math.exp(v);
		return (e + 1/e)/2;
	},

	/**
	 * @param v {Number}
	 * @return {Number} hyperbolic sine
	 */
	sinh: function(v)
	{
		var e = Math.exp(v);
		return (e - 1/e)/2;
	},

	/**
	 * @param v {Number}
	 * @return {Number} hyperbolic sine
	 */
	tanh: function(v)
	{
		var e = Math.exp(2*v);
		return (e - 1)/(e + 1);
	}
});


}, 'gallery-2012.04.10-14-57' ,{requires:['array-extras']});
