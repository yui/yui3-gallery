/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Inverse hyperbolic sine.</p>
 * 
 * @namespace MathFunction
 * @class InverseHyperbolicSine
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathInverseHyperbolicSine(
	/* MathFunction */	f)
{
	MathInverseHyperbolicSine.superclass.constructor.call(this, "arcsinh", f);
}

Y.extend(MathInverseHyperbolicSine, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.asinh(this.args[0].evaluate(var_list));
	}
});

MathFunction.InverseHyperbolicSine = MathInverseHyperbolicSine;
