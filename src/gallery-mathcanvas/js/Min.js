/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Minimum.</p>
 * 
 * @namespace MathFunction
 * @class Min
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 */

function MathMin()
{
	MathMin.superclass.constructor.call(this, "min", new Y.Array(arguments));
}

Y.extend(MathMin, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Math.min.apply(null, this.evaluateArgs(var_list));
	}
});

MathFunction.Min = MathMin;
