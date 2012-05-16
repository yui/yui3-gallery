/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Hyperbolic tangent.</p>
 * 
 * @namespace MathFunction
 * @class HyperbolicTangent
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathHyperbolicTangent(
	/* MathFunction */	f)
{
	MathHyperbolicTangent.superclass.constructor.call(this, "tanh", f);
}

Y.extend(MathHyperbolicTangent, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.tanh(this.args[0].evaluate(var_list));
	}
});

MathFunction.HyperbolicTangent = MathHyperbolicTangent;
