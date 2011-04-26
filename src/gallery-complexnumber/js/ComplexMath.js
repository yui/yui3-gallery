/**********************************************************************
 * <p>This collection of functions provides the complex number equivalent
 * of the built-in JavaScript Math namespace, along with the basic
 * arithmetic operations (since JavaScript does not support operator
 * overloading).</p>
 * 
 * @module gallery-complexnumber
 * @class Y.ComplexMath
 */

function failIfConstant(v)
{
	if (v === ComplexMath.ZERO || v === ComplexMath.I)
	{
		throw Error('You cannot modify ZERO or I');
	}
}

var ComplexMath =
{
	/**
	 * Zero.
	 */
	ZERO: new ComplexNumber(),

	/**
	 * Square root of -1.
	 */
	I: new ComplexNumber(0,1),

	/**
	 * @return {boolean} true if the argument is a ComplexNumber
	 */
	isComplexNumber: function(v)
	{
		return ((v instanceof ComplexNumber) ||
				(v.hasOwnProperty("r") && v.hasOwnProperty("i")));
	},

	/**
	 * @return {number} sum of all the arguments (either passed separately or as an array)
	 */
	add: function()
	{
		var s = new ComplexNumber();
		Y.Array.each(arguments, function(v)
		{
			if (Y.Lang.isArray(v))
			{
				v = ComplexMath.add.apply(this, v);
			}

			s.add(v);
		});

		return s;
	},

	/**
	 * @return {number} sum of the reciprocals of all the arguments (either passed separately or as an array)
	 */
	addReciprocals: function()
	{
		var s = new ComplexNumber();
		Y.Array.each(arguments, function(v)
		{
			if (Y.Lang.isArray(v))
			{
				s.add(ComplexMath.addReciprocals.apply(this, v));
			}
			else
			{
				s.add(ComplexMath.divide(1,v));
			}
		});

		return s;
	},

	/**
	 * @return {number} net value of N impedances in parallel (either passed separately or as an array)
	 */
	parallel: function()
	{
		return ComplexMath.divide(1, ComplexMath.addReciprocals.apply(this, arguments));
	},

	/**
	 * @param v1 {number}
	 * @param v2 {number}
	 * @return {number} v1-v2
	 */
	subtract: function(v1, v2)
	{
		var c1 = ComplexMath.isComplexNumber(v1),
			c2 = ComplexMath.isComplexNumber(v2);
		if (c1 && c2)
		{
			return new ComplexNumber(v1.r-v2.r, v1.i-v2.i);
		}
		else if (c1)
		{
			return new ComplexNumber(v1.r-v2, v1.i);
		}
		else if (c2)
		{
			return new ComplexNumber(v1-v2.r, -v2.i);
		}
		else
		{
			return new ComplexNumber(v1-v2, 0);
		}
	},

	/**
	 * @return {number} product of all the arguments (either passed separately or as an array)
	 */
	multiply: function()
	{
		var s = new ComplexNumber(1, 0);
		Y.Array.each(arguments, function(v)
		{
			if (Y.Lang.isArray(v))
			{
				v = ComplexMath.multiply.apply(this, v);
			}

			s.multiply(v);
		});

		return s;
	},

	/**
	 * @param v1 {number}
	 * @param v2 {number}
	 * @return {number} v1/v2
	 */
	divide: function(v1, v2)
	{
		var c1 = ComplexMath.isComplexNumber(v1),
			c2 = ComplexMath.isComplexNumber(v2);
		if (c1 && c2)
		{
			var d = v2.r*v2.r + v2.i*v2.i;
			return new ComplexNumber(
				(v1.r*v2.r + v1.i*v2.i)/d,
				(v1.i*v2.r - v1.r*v2.i)/d);
		}
		else if (c1)
		{
			return new ComplexNumber(v1.r/v2, v1.i/v2);
		}
		else if (c2)
		{
			var d = v2.r*v2.r + v2.i*v2.i;
			return new ComplexNumber((v1*v2.r)/d, (-v1*v2.i)/d);
		}
		else
		{
			return new ComplexNumber(v1/v2, 0);
		}
	},

	/**
	 * @param v {number}
	 * @return {number} negative of the argument
	 */
	negative: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			return new ComplexNumber(-v.r, -v.i);
		}
		else
		{
			return new ComplexNumber(-v, 0);
		}
	},

	/**
	 * @param v {number}
	 * @return {number} absolute value (magnitude) of the argument
	 */
	abs: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			return new ComplexNumber(Math.sqrt(v.r*v.r + v.i*v.i), 0);
		}
		else
		{
			return new ComplexNumber(Math.abs(v), 0);
		}
	},

	/**
	 * @param v {number}
	 * @return {number} inverse hyperbolic cosine of the argument
	 */
	acosh: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			return ComplexMath.log(
				ComplexMath.add(v,
					ComplexMath.multiply(
						ComplexMath.sqrt(new ComplexNumber(v.r+1, v.i)),
						ComplexMath.sqrt(new ComplexNumber(v.r-1, v.i)))));
		}
		else
		{
			return new ComplexNumber(Math.acosh(v), 0);
		}
	},

	/**
	 * @param v {number}
	 * @return {number} inverse hyperbolic sine of the argument
	 */
	asinh: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			var v1 = ComplexMath.multiply(v,v);
			return ComplexMath.log(
				ComplexMath.add(v,
					ComplexMath.sqrt(new ComplexNumber(v1.r+1, v1.i))));
		}
		else
		{
			return new ComplexNumber(Math.asinh(v), 0);
		}
	},

	/**
	 * @param v {number}
	 * @return {number} inverse hyperbolic tangent of the argument
	 */
	atanh: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			var v1 = ComplexMath.subtract(
				ComplexMath.log(new ComplexNumber(1+v.r,  v.i)),
				ComplexMath.log(new ComplexNumber(1-v.r, -v.i)));
			return new ComplexNumber(v1.r/2, v1.i/2);
		}
		else
		{
			return new ComplexNumber(Math.atanh(v), 0);
		}
	},

	/**
	 * @param v {number}
	 * @return {number} cosine of the argument
	 */
	cos: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			return new ComplexNumber(
				 Math.cos(v.r)*Math.cosh(v.i),
				-Math.sin(v.r)*Math.sinh(v.i));
		}
		else
		{
			return new ComplexNumber(Math.cos(v), 0);
		}
	},

	/**
	 * @param v {number}
	 * @return {number} hyperbolic cosine of the argument
	 */
	cosh: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			var v1 = ComplexMath.add(
				ComplexMath.exp(v),
				ComplexMath.exp(new ComplexNumber(-v.r, -v.i)));
			return new ComplexNumber(v1.r/2, v1.i/2);
		}
		else
		{
			return new ComplexNumber(Math.cosh(v), 0);
		}
	},

	/**
	 * @param v {number}
	 * @return {number} e raised to the argument
	 */
	exp: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			var v1 = new ComplexNumber(Math.cos(v.i), Math.sin(v.i));
			v1.multiply(Math.exp(v.r));
			return v1;
		}
		else
		{
			return new ComplexNumber(Math.exp(v), 0);
		}
	},

	/**
	 * @param v {number}
	 * @return {number} natural logarithm of the argument
	 */
	log: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			return new ComplexNumber(Math.log(v.magnitude()), v.phase());
		}
		else
		{
			return new ComplexNumber(Math.log(v), 0);
		}
	},

	/**
	 * @param v {number} value
	 * @param e {number} exponent
	 * @return {number} value raised to the exponent
	 */
	pow: function(v, e)
	{
		return ComplexMath.exp(ComplexMath.multiply(ComplexMath.log(v), e));
	},

	/**
	 * @param v {number}
	 * @return {number} sine of the argument
	 */
	sin: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			return new ComplexNumber(
				Math.sin(v.r)*Math.cosh(v.i),
				Math.cos(v.r)*Math.sinh(v.i));
		}
		else
		{
			return new ComplexNumber(Math.sin(v), 0);
		}
	},

	/**
	 * @param v {number}
	 * @return {number} hyperbolic sine of the argument
	 */
	sinh: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			var v1 = ComplexMath.subtract(
				ComplexMath.exp(v),
				ComplexMath.exp(new ComplexNumber(-v.r, -v.i)));
			return new ComplexNumber(v1.r/2, v1.i/2);
		}
		else
		{
			return new ComplexNumber(Math.sinh(v), 0);
		}
	},

	/**
	 * @param v {number}
	 * @return {number} square root of the argument
	 */
	sqrt: function(v)
	{
		var c = ComplexMath.isComplexNumber(v);
		return ComplexNumber.fromPolar(
			Math.sqrt(c ? v.magnitude() : Math.abs(v)),
			(c ? v.phase() : v < 0 ? Math.PI : 0) / 2);
	},

	/**
	 * @param v {number}
	 * @return {number} tangent of the argument
	 */
	tan: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			return ComplexMath.divide(ComplexMath.sin(v), ComplexMath.cos(v));
		}
		else
		{
			return new ComplexNumber(Math.tan(v), 0);
		}
	},

	/**
	 * @param v {number}
	 * @return {number} hyperbolic tangent of the argument
	 */
	tanh: function(v)
	{
		if (ComplexMath.isComplexNumber(v))
		{
			var e = ComplexMath.exp(new ComplexNumber(2*v.r, 2*v.i));
			return ComplexMath.divide(
				new ComplexNumber(e.r-1, e.i),
				new ComplexNumber(e.r+1, e.i));
		}
		else
		{
			return new ComplexNumber(Math.tanh(v), 0);
		}
	}
};

Y.ComplexMath = ComplexMath;
