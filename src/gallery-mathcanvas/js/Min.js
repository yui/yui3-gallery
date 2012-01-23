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
	evaluate: function(
		/* map */	var_list)
	{
		return Math.min.apply(null, this.evaluateArgs(var_list));
	}
});

MathFunction.Min = MathMin;
