/**********************************************************************
 * <p>Phase of a complex number.</p>
 * 
 * @namespace MathFunction
 * @class Phase
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathPhase(
	/* MathFunction */	f)
{
	MathPhase.superclass.constructor.call(this, "phase", f);
}

Y.extend(MathPhase, MathFunctionWithArgs,
{
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.phase(this.args[0].evaluate(var_list));
	}
});

MathFunction.Phase = MathPhase;
