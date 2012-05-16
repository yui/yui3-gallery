/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Inverse hyperbolic tangent.</p>
 * 
 * @namespace MathFunction
 * @class InverseHyperbolicTangent
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathInverseHyperbolicTangent(
	/* MathFunction */	f)
{
	MathInverseHyperbolicTangent.superclass.constructor.call(this, "arctanh", f);
}

Y.extend(MathInverseHyperbolicTangent, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.atanh(this.args[0].evaluate(var_list));
	}
});

MathFunction.InverseHyperbolicTangent = MathInverseHyperbolicTangent;
