/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Trigonometric cosine.</p>
 * 
 * @namespace MathFunction
 * @class Cosine
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathCosine(
	/* MathFunction */	f)
{
	MathCosine.superclass.constructor.call(this, "cos", f);
}

Y.extend(MathCosine, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.cos(this.args[0].evaluate(var_list));
	}
});

MathFunction.Cosine = MathCosine;
