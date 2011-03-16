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
	 * @return {number} sum of all the arguments (either passed separately or as an array)
	 */
	add: function()
	{
		var s = 0;
		Y.Array.each(arguments, function(v)
		{
			if (Y.Lang.isArray(v))
			{
				v = Math.add.apply(this, v);
			}

			s += v;
		});

		return s;
	},

	/**
	 * @return {number} sum of the reciprocals of all the arguments (either passed separately or as an array)
	 */
	addReciprocals: function()
	{
		var s = 0;
		Y.Array.each(arguments, function(v)
		{
			if (Y.Lang.isArray(v))
			{
				s += Math.addReciprocals.apply(this, v);
			}
			else
			{
				s += 1/v;
			}
		});

		return s;
	},

	/**
	 * @return {number} net value of N resistors in parallel (either passed separately or as an array)
	 */
	parallel: function()
	{
		return 1/Math.addReciprocals.apply(this, arguments);
	},

	/**
	 * @return {number} product of all the arguments (either passed separately or as an array)
	 */
	multiply: function()
	{
		var p = 1;
		Y.Array.each(arguments, function(v)
		{
			if (Y.Lang.isArray(v))
			{
				v = Math.multiply.apply(this, v);
			}

			p *= v;
		});

		return p;
	},

	/**
	 * @param a {number} angle in degrees
	 * @return {number} angle in radians
	 */
	degreesToRadians: function(a)
	{
		return a * Math.PI / 180;
	},

	/**
	 * @param a {number} angle in radians
	 * @return {number} angle in degrees
	 */
	radiansToDegrees: function(a)
	{
		return a * 180 / Math.PI;
	},

	/**
	 * @param v {number}
	 * @return {number} inverse hyperbolic cosine
	 */
	acosh: function(v)
	{
		return Math.log(v + Math.sqrt(v*v-1));
	},

	/**
	 * @param v {number}
	 * @return {number} inverse hyperbolic sine
	 */
	asinh: function(v)
	{
		return Math.log(v + Math.sqrt(v*v+1));
	},

	/**
	 * @param v {number}
	 * @return {number} inverse hyperbolic tangent
	 */
	atanh: function(v)
	{
		return Math.log((1+v)/(1-v))/2;
	},

	/**
	 * @param v {number}
	 * @return {number} hyperbolic cosine
	 */
	cosh: function(v)
	{
		var e = Math.exp(v);
		return (e + 1/e)/2;
	},

	/**
	 * @param v {number}
	 * @return {number} hyperbolic sine
	 */
	sinh: function(v)
	{
		var e = Math.exp(v);
		return (e - 1/e)/2;
	},

	/**
	 * @param v {number}
	 * @return {number} hyperbolic sine
	 */
	tanh: function(v)
	{
		var e = Math.exp(2*v);
		return (e - 1)/(e + 1);
	}
});


}, 'gallery-2011.03.16-21-24' );
