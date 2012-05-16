/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Logarithm.</p>
 * 
 * @namespace MathFunction
 * @class Logarithm
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param b {MathFunction} base
 * @param v {MathFunction} value
 */

function MathLogarithm(
	/* MathFunction */	b,
	/* MathFunction */	v)
{
	MathLogarithm.superclass.constructor.call(this, "log", b, v);
}

Y.extend(MathLogarithm, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.divide(
			Y.ComplexMath.log(this.args[1].evaluate(var_list)),
			Y.ComplexMath.log(this.args[0].evaluate(var_list)));
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
		var total_rect =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: top_left.y + context.getLineHeight(font_size),
			right:  top_left.x + context.getStringWidth(font_size, 'log')
		};

		var arg_top_left =
		{
			x: total_rect.right,
			y: total_rect.top
		};

		// get rectangle for base

		var b_font_size = context.getSuperSubFontSize(font_size);

		var b_arg_index = this.args[0].prepareToRender(context, arg_top_left, b_font_size, rect_list);
		var b_arg_info  = rect_list.get(b_arg_index);
		arg_top_left.x  = b_arg_info.rect.right;

		// get rectangle for value -- gives our midline

		var v_arg_index = this.args[1].prepareToRender(context, arg_top_left, font_size, rect_list);
		var v_arg_info  = rect_list.get(v_arg_index);
		total_rect      = RectList.cover(total_rect, v_arg_info.rect);

		// shift argument to make space for left parenthesis

		var paren_width = context.getParenthesisWidth(v_arg_info.rect);
		rect_list.shift(v_arg_index, paren_width, 0);

		// we need space for two parentheses

		total_rect.right += 2*paren_width;

		// shift the base down

		rect_list.shift(b_arg_index, 0, v_arg_info.midline - total_rect.top);
		total_rect = RectList.cover(total_rect, b_arg_info.rect);

		return rect_list.add(total_rect, v_arg_info.midline, font_size, this);
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
		context.drawString(info.rect.left, info.midline, info.font_size, 'log');

		this.args[0].render(context, rect_list);
		this.args[1].render(context, rect_list);

		var v_info = rect_list.find(this.args[1]);
		context.drawParentheses(v_info.rect);
	}
});

MathFunction.Logarithm = MathLogarithm;
