/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Maximum.</p>
 * 
 * @namespace MathFunction
 * @class Max
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 */

function MathMax()
{
	MathMax.superclass.constructor.call(this, "max", new Y.Array(arguments));
}

Y.extend(MathMax, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Math.max.apply(null, this.evaluateArgs(var_list));
	}
});

MathFunction.Max = MathMax;
