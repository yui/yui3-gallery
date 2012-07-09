/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Trigonometric tangent.</p>
 * 
 * @namespace MathFunction
 * @class Tangent
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathTangent(
	/* MathFunction */	f)
{
	MathTangent.superclass.constructor.call(this, "tan", f);
}

Y.extend(MathTangent, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.tan(this.args[0].evaluate(var_list));
	}
});

MathFunction.Tangent = MathTangent;
