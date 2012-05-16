/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Natural logarithm.</p>
 * 
 * @namespace MathFunction
 * @class NaturalLog
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathNaturalLog(
	/* MathFunction */	f)
{
	MathNaturalLog.superclass.constructor.call(this, "ln", f);
}

Y.extend(MathNaturalLog, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.log(this.args[0].evaluate(var_list));
	}
});

MathFunction.NaturalLog = MathNaturalLog;
