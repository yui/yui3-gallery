/**********************************************************************
 * <p>Rotate a complex number around the origin.</p>
 * 
 * @namespace MathFunction
 * @class Rotate
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathRotate(
	/* MathFunction */	f)
{
	MathRotate.superclass.constructor.call(this, "rotate", f);
}

Y.extend(MathRotate, MathFunctionWithArgs,
{
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.rotate(this.args[0].evaluate(var_list),
									this.args[1].evaluate(var_list));
	}
});

MathFunction.Rotate = MathRotate;
