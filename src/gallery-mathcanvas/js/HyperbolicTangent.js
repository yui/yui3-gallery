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
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.tanh(this.args[0].evaluate(var_list));
	}
});

MathFunction.HyperbolicTangent = MathHyperbolicTangent;
