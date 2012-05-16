/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Conjugate of a complex number.</p>
 * 
 * @namespace MathFunction
 * @class Conjugate
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathConjugate(
	/* MathFunction */	f)
{
	MathConjugate.superclass.constructor.call(this, "conjugate", f);
}

Y.extend(MathConjugate, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.conjugate(this.args[0].evaluate(var_list));
	},

	/**
	 * @method prepareToRender
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param top_left {point} x,y coordinates of the top left of the bounding box
	 * @param font_size {float} percentage of the base font size
	 * @param rect_list {RectList} layout information
	 * @return {int} index of this items info in rect_list
	 */
	prepareToRender: function(
		/* Context2d */		context,
		/* point */			top_left,
		/* percentage */	font_size,
		/* RectList */		rect_list)
	{
		var bar_height = context.getHorizontalBarHeight();

		var arg_top_left = Y.clone(top_left, true);
		arg_top_left.y  += bar_height;

		var arg_index = this.args[0].prepareToRender(context, arg_top_left, font_size, rect_list);
		var arg_info  = rect_list.get(arg_index);

		var r  = Y.clone(arg_info.rect, true);
		r.top -= bar_height;

		return rect_list.add(r, arg_info.midline, font_size, this);
	},

	/**
	 * @method render
	 * @param canvas {MathCanvas} the drawing canvas
	 * @param rect_list {RectList} layout information
	 */
	render: function(
		/* Context2d */	context,
		/* RectList */	rect_list)
	{
		var info = rect_list.find(this);
		context.drawHorizontalBar(info.rect);
		this.args[0].render(context, rect_list);
	}
});

MathFunction.Conjugate = MathConjugate;
