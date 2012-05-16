/**
 * @module gallery-mathcanvas
 */

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
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.acosh(this.args[0].evaluate(var_list));
	}
});

MathFunction.InverseHyperbolicCosine = MathInverseHyperbolicCosine;
