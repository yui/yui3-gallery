/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Inverse trigonometric cosine.</p>
 * 
 * @namespace MathFunction
 * @class Arccosine
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathArccosine(
	/* MathFunction */	f)
{
	MathArccosine.superclass.constructor.call(this, "arccos", f);
}

Y.extend(MathArccosine, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Math.acos(this.args[0].evaluate(var_list));
	}
});

MathFunction.Arccosine = MathArccosine;
