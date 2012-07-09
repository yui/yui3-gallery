/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Inverse trigonometric cosine.</p>
 * 
 * @namespace MathFunction
 * @class Arctangent2
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param y {MathFunction}
 * @param x {MathFunction}
 */

function MathArctangent2(
	/* MathFunction */	y,
	/* MathFunction */	x)
{
	MathArctangent2.superclass.constructor.call(this, "arctan2", y, x);
}

Y.extend(MathArctangent2, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Math.atan2(this.args[0].evaluate(var_list),
						  this.args[1].evaluate(var_list));
	}
});

MathFunction.Arctangent2 = MathArctangent2;
