/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Real part of a complex number.</p>
 * 
 * @namespace MathFunction
 * @class RealPart
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathRealPart(
	/* MathFunction */	f)
{
	MathRealPart.superclass.constructor.call(this, "re", f);
}

Y.extend(MathRealPart, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		var value = this.args[0].evaluate(var_list);
		return Y.ComplexMath.isComplexNumber(value) ? value.real() : value;
	}
});

MathFunction.RealPart = MathRealPart;
