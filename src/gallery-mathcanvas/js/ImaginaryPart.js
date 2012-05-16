/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Imaginary part of a complex number.</p>
 * 
 * @namespace MathFunction
 * @class ImaginaryPart
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathImaginaryPart(
	/* MathFunction */	f)
{
	MathImaginaryPart.superclass.constructor.call(this, "im", f);
}

Y.extend(MathImaginaryPart, MathFunctionWithArgs,
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
		return Y.ComplexMath.isComplexNumber(value) ? value.imag() : 0;
	}
});

MathFunction.ImaginaryPart = MathImaginaryPart;
