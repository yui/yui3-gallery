/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>i (square root of -1)</p>
 * 
 * @namespace MathFunction
 * @class I
 * @extends MathFunction
 * @constructor
 */

function MathI()
{
	MathI.superclass.constructor.call(this);
}

Y.extend(MathI, MathFunction,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function()
	{
		return Y.ComplexMath.I;
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return 'i';
	}
});

MathFunction.I = MathI;
