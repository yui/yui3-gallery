/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Hyperbolic sine.</p>
 * 
 * @namespace MathFunction
 * @class HyperbolicSine
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathHyperbolicSine(
	/* MathFunction */	f)
{
	MathHyperbolicSine.superclass.constructor.call(this, "sinh", f);
}

Y.extend(MathHyperbolicSine, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.sinh(this.args[0].evaluate(var_list));
	}
});

MathFunction.HyperbolicSine = MathHyperbolicSine;
