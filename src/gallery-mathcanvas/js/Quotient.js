/**********************************************************************
 * <p>Quotient of values.</p>
 * 
 * @namespace MathFunction
 * @class Quotient
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param n {MathFunction} numerator
 * @param d {MathFunction} denominator
 */

function MathQuotient(
	/* MathFunction */	n,
	/* MathFunction */	d)
{
	MathQuotient.superclass.constructor.call(this, "/", n, d);
}

Y.extend(MathQuotient, MathFunctionWithArgs,
{
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.divide(this.args[0].evaluate(var_list),
									this.args[1].evaluate(var_list));
	},

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
			bottom: top_left.y,
			right:  top_left.x
		};

		var space_width = context.getStringWidth(font_size, ' ');

		var arg_top_left = Y.clone(top_left, true);
		arg_top_left.x += space_width;

		// get rectangle for numerator

		var n_arg_index = this.args[0].prepareToRender(context, arg_top_left, font_size, rect_list);
		var n_arg_info  = rect_list.get(n_arg_index);
		arg_top_left.y  = n_arg_info.rect.bottom;
		total_rect      = RectList.cover(total_rect, n_arg_info.rect);

		// create space for division line

		var bar_height    = context.getHorizontalBarHeight();
		var total_midline = arg_top_left.y + bar_height/2;
		arg_top_left.y   += bar_height;

		// get rectangle for denominator

		var d_arg_index = this.args[1].prepareToRender(context, arg_top_left, font_size, rect_list);
		var d_arg_info  = rect_list.get(d_arg_index);
		total_rect      = RectList.cover(total_rect, d_arg_info.rect);

		// align centers of numerator and denominator horizontally
		// (this is guaranteed to leave ourRect constant)

		var dx = (n_arg_info.rect.right - d_arg_info.rect.right)/2;
		if (dx > 0)
		{
			rect_list.shift(d_arg_index, dx, 0);
		}
		else if (dx < 0)
		{
			rect_list.shift(n_arg_index, -dx, 0);
		}

		// add one extra space at the right so division line is wider than arguments

		total_rect.right += space_width;

		return rect_list.add(total_rect, total_midline, font_size, this);
	},

	render: function(
		/* Context2d */	context,
		/* RectList */	rect_list)
	{
		var info = rect_list.find(this);

		var bar_height = context.getHorizontalBarHeight();
		var bar_rect =
		{
			top:    info.midline - bar_height/2,
			left:   info.rect.left,
			bottom: info.midline + bar_height/2,
			right:  info.rect.right
		};

		this.args[0].render(context, rect_list);
		context.drawHorizontalBar(bar_rect);
		this.args[1].render(context, rect_list);
	},

	toString: function()
	{
		return this._printArg(0) + '/' + this._printArg(1);
	}
});

MathFunction.Quotient = MathQuotient;
