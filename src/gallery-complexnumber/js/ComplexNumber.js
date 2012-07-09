"use strict";

/**
 * @module gallery-complexnumber
 */

/**********************************************************************
 * Class for representing a complex number.
 * 
 * @class ComplexNumber
 * @constructor
 * @param real=0 {number} the real component
 * @param imag=0 {number} the imaginary component
 */
function ComplexNumber(real, imag)
{
	this.r = real || 0;
	this.i = imag || 0;
}

/**
 * Construct a ComplexNumber from polar coordinates.
 * 
 * @method fromPolar
 * @static
 * @param magnitude {number}
 * @param phase {number}
 * @return ComplexNumber
 */
ComplexNumber.fromPolar = function(magnitude, phase)
{
	return new ComplexNumber(
		magnitude * Math.cos(phase),
		magnitude * Math.sin(phase));
};

ComplexNumber.prototype =
{
	/**
	 * @method real
	 * @return {number} real component
	 */
	real: function()
	{
		return this.r;
	},

	/**
	 * @method imag
	 * @return {number} imaginary component
	 */
	imag: function()
	{
		return this.i;
	},

	/**
	 * @method magnitude
	 * @return {number} length of the vector in the complex plane
	 */
	magnitude: function()
	{
		return Math.sqrt(this.r*this.r + this.i*this.i);
	},

	/**
	 * @method phase
	 * @return {number} angle of the vector (in radians) in the complex plane relative to the positive real axis
	 */
	phase: function()
	{
		return Math.atan2(this.i, this.r);
	},

	/**
	 * Equivalent of += operator.
	 * 
	 * @method add
	 * @param v {number}
	 * @chainable
	 */
	add: function(v)
	{
		failIfConstant(this);

		if (ComplexMath.isComplexNumber(v))
		{
			this.r += v.r;
			this.i += v.i;
		}
		else
		{
			this.r += v;
		}

		return this;
	},

	/**
	 * Equivalent of -= operator.
	 * 
	 * @method subtract
	 * @param v {number}
	 * @chainable
	 */
	subtract: function(v)
	{
		failIfConstant(this);

		if (ComplexMath.isComplexNumber(v))
		{
			this.r -= v.r;
			this.i -= v.i;
		}
		else
		{
			this.r -= v;
		}

		return this;
	},

	/**
	 * Equivalent of *= operator.
	 * 
	 * @method multiply
	 * @param v {number}
	 * @chainable
	 */
	multiply: function(v)
	{
		failIfConstant(this);

		if (ComplexMath.isComplexNumber(v))
		{
			var r = this.r*v.r - this.i*v.i;
			var i = this.r*v.i + this.i*v.r;

			this.r = r;
			this.i = i;
		}
		else
		{
			this.r *= v;
			this.i *= v;
		}

		return this;
	},

	/**
	 * Equivalent of /= operator.
	 * 
	 * @method divide
	 * @chainable
	 * @param v {number}
	 */
	divide: function(v)
	{
		failIfConstant(this);

		if (ComplexMath.isComplexNumber(v))
		{
			var x  = ComplexMath.divide(this, v);
			this.r = x.r;
			this.i = x.i;
		}
		else
		{
			this.r /= v;
			this.i /= v;
		}

		return this;
	},

	/**
	 * Equivalent of unary minus operator.
	 * 
	 * @method negate
	 * @chainable
	 */
	negate: function()
	{
		failIfConstant(this);

		this.r = - this.r;
		this.i = - this.i;

		return this;
	},

	/**
	 * Negates the imaginary part.
	 * 
	 * @method conjugate
	 * @chainable
	 */
	conjugate: function()
	{
		failIfConstant(this);

		this.i = - this.i;

		return this;
	},

	/**
	 * Rotates the number around the origin by the specified angle in radians.
	 * 
	 * @method rotate
	 * @chainable
	 * @param angle {number}
	 */
	rotate: function(
		/* float */	angle)
	{
		failIfConstant(this);

		this.multiply(ComplexNumber.fromPolar(1, angle));

		return this;
	},

	toString: function()
	{
		function i(v)
		{
			return  v ===  1 ?  'i' :
					v === -1 ? '-i' :
					v + 'i';
		}

		if (this.i === 0)
		{
			return this.r.toString();
		}
		else if (this.r === 0)
		{
			return i(this.i);
		}
		else
		{
			return this.r + (this.i > 0 ? '+' : '') + i(this.i);
		}
	}
};

Y.ComplexNumber = ComplexNumber;
