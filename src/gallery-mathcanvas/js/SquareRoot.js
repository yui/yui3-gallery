/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Square root.</p>
 * 
 * @namespace MathFunction
 * @class SquareRoot
 * @extends MathFunction.FunctionWithArgs
 * @constructor
 * @param f {MathFunction}
 */

function MathSquareRoot(
	/* MathFunction */	f)
{
	MathSquareRoot.superclass.constructor.call(this, "sqrt", f);
}

Y.extend(MathSquareRoot, MathFunctionWithArgs,
{
	/**
	 * @method evaluate
	 * @param var_list {Object} map of variable names to values or MathFunctions
	 * @return the value of the function
	 */
	evaluate: function(
		/* map */	var_list)
	{
		return Y.ComplexMath.sqrt(this.args[0].evaluate(var_list));
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
		var arg_index = this.args[0].prepareToRender(context, top_left, font_size, rect_list);
		var arg_info  = rect_list.get(arg_index);
		var arg_h     = RectList.height(arg_info.rect);

		var leading  = 1+Math.round(2.0*arg_h/(4.0*Math.sqrt(3.0)));
		var trailing = 3;
		var extra    = 4;

		rect_list.shift(arg_index, leading, extra);		// make space for square root sign

		var r =
		{
			top:    top_left.y,
			left:   top_left.x,
			bottom: arg_info.rect.bottom,
			right:  arg_info.rect.right + trailing
		};

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
		this._drawSquareRoot(context, info.rect);
		this.args[0].render(context, rect_list);
	},

	/**
	 * @method _drawSquareRoot
	 * @private
	 * @param context {Context2d}
	 * @param rect {Object}
	 */
	_drawSquareRoot: function(
		/* Context2d */		context,
		/* rect */			rect)
	{
		var h = RectList.height(rect);
		var x = rect.left;
		var y = rect.top + Math.round(3.0*h/4.0);
		var w = Math.round((h-3)/(4.0*Math.sqrt(3.0)));

		context.beginPath();
		context.moveTo(x,y);
		x += w;
		y  = rect.bottom - 1;
		context.lineTo(x,y);
		x += w;
		y  = rect.top+2;
		context.lineTo(x,y);
		x  = rect.right-1;
		context.lineTo(x,y);
		context.line(0, Math.round(h/8.0));
		context.stroke();
	}
});

MathFunction.SquareRoot = MathSquareRoot;
