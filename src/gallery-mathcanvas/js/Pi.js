/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Pi</p>
 * 
 * @namespace MathFunction
 * @class Pi
 * @extends MathFunction
 * @constructor
 */

function MathPi()
{
	MathPi.superclass.constructor.call(this);
}

Y.extend(MathPi, MathFunction,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function()
	{
		return Math.PI;
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return '\u03c0';
	}
});

MathFunction.Pi = MathPi;
