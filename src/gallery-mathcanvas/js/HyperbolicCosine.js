/**********************************************************************
 * <p>Hyperbolic cosine.</p>
 * 
 * @namespace MathFunction
 * @class HyperbolicCosine
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathHyperbolicCosine(
	/* MathFunction */	f)
{
	MathHyperbolicCosine.superclass.constructor.call(this, "cosh", f);
}

Y.extend(MathHyperbolicCosine, MathFunctionWithArgs,
{
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.cosh(this.args[0].evaluate(var_list));
	}
});

MathFunction.HyperbolicCosine = MathHyperbolicCosine;
