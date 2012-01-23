/**********************************************************************
 * <p>Trigonometric sine.</p>
 * 
 * @namespace MathFunction
 * @class Sine
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathSine(
	/* MathFunction */	f)
{
	MathSine.superclass.constructor.call(this, "sin", f);
}

Y.extend(MathSine, MathFunctionWithArgs,
{
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.sin(this.args[0].evaluate(var_list));
	}
});

MathFunction.Sine = MathSine;
