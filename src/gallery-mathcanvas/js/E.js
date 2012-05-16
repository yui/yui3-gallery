/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>e</p>
 * 
 * @namespace MathFunction
 * @class E
 * @extends MathFunction
 * @constructor
 */

function MathE()
{
	MathE.superclass.constructor.call(this);
}

Y.extend(MathE, MathFunction,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function()
	{
		return Math.E;
	},

	/**
	 * @method toString
	 * @return text representation of the function
	 */
	toString: function()
	{
		return 'e';
	}
});

MathFunction.E = MathE;
