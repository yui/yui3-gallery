/**********************************************************************
 * <p>Inverse hyperbolic cosine.</p>
 * 
 * @namespace MathFunction
 * @class InverseHyperbolicCosine
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathInverseHyperbolicCosine(
	/* MathFunction */	f)
{
	MathInverseHyperbolicCosine.superclass.constructor.call(this, "arccosh", f);
}

Y.extend(MathInverseHyperbolicCosine, MathFunctionWithArgs,
{
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.acosh(this.args[0].evaluate(var_list));
	}
});

MathFunction.InverseHyperbolicCosine = MathInverseHyperbolicCosine;
