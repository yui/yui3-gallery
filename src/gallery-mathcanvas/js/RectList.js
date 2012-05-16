"use strict";

/**
 * @module gallery-mathcanvas
 */

/**********************************************************************
 * <p>Manages all the bounding rectangles for an expression.</p>
 * 
 * <p>Each item contains rect (top,left,bottom,right), midline,
 * font_size(%), func.</p>
 * 
 * @class RectList
 * @namespace MathCanvas
 * @constructor
 */

function RectList()
{
	this.list = [];
}

/**
 * @method width
 * @static
 * @param r {Rect} rectangle
 * @return width
 */
RectList.width = function(r)
{
	return r.right - r.left;
};

/**
 * @method height
 * @static
 * @param r {Rect} rectangle
 * @return height
 */
RectList.height = function(r)
{
	return r.bottom - r.top;
};

/**
 * @method xcenter
 * @static
 * @param r {Rect} rectangle
 * @return horizontal center
 */
RectList.xcenter = function(r)
{
	return Math.floor((r.left + r.right)/2);
};

/**
 * @method ycenter
 * @static
 * @param r {Rect} rectangle
 * @return vertical center
 */
RectList.ycenter = function(r)
{
	return Math.floor((r.top + r.bottom)/2);
};

/**
 * @method area
 * @static
 * @param r {Rect} rectangle
 * @return area
 */
RectList.area = function(r)
{
	return RectList.width(r) * RectList.height(r);
};

/**
 * @method containsPt
 * @static
 * @param r {Rect} rectangle
 * @param xy {point} point
 * @return true if rectangle contains point
 */
RectList.containsPt = function(r, xy)
{
	return (r.left <= xy[0] && xy[0] < r.right &&
			r.top  <= xy[1] && xy[1] < r.bottom);
};

/**
 * @method containsRect
 * @static
 * @param r1 {Rect}
 * @param r2 {Rect}
 * @return true if r1 contains r2
 */
RectList.containsRect = function(r1, r2)
{
	return (r1.left <= r2.left && r2.left <= r2.right && r2.right <= r1.right &&
			r1.top <= r2.top && r2.top <= r2.bottom && r2.bottom <= r1.bottom);
};

/**
 * @method cover
 * @static
 * @param r1 {Rect} rectangle
 * @param r2 {Rect} rectangle
 * @return rectangle convering both input arguments
 */
RectList.cover = function(r1, r2)
{
	var r =
	{
		top:    Math.min(r1.top, r2.top),
		left:   Math.min(r1.left, r2.left),
		bottom: Math.max(r1.bottom, r2.bottom),
		right:  Math.max(r1.right, r2.right)
	};
	return r;
};

RectList.prototype =
{
	/**
	 * @method add
	 * @param r {Rect}
	 * @param midline {int}
	 * @param font_size {int} percentage
	 * @param func {MathFunction}
	 * @return index of inserted item
	 */
	add: function(
		/* rect */			r,
		/* int */			midline,
		/* percentage */	font_size,
		/* MathFunction */	func)
	{
		this.list.push(
		{
			rect:      r,
			midline:   midline,
			font_size: font_size,
			func:      func
		});

		return this.list.length-1;
	},

	/**
	 * @method get
	 * @param index {int}
	 * @return item at index
	 */
	get: function(
		/* int */	index)
	{
		return this.list[ index ];
	},

	/**
	 * @method find
	 * @param f {MathFunction} search target
	 * @return data for specified MathFunction, or null if not found
	 */
	find: function(
		/* MathFunction */	f)
	{
		return Y.Array.find(this.list, function(r)
		{
			return (r.func === f);
		});
	},

	/**
	 * @method findIndex
	 * @param f {MathFunction} search target
	 * @return index of item for specified MathFunction, or -1 if not found
	 */
	findIndex: function(
		/* MathFunction */	f)
	{
		return Y.Array.indexOf(this.list, this.find(f));
	},

	/**
	 * Shift the specified rect and all rects inside it.
	 * 
	 * @method shift
	 * @param index {int}
	 * @param dx {int} horizontal shift
	 * @param dy {int} vertical shift
	 */
	shift: function(
		/* int */	index,
		/* int */	dx,
		/* int */	dy)
	{
		if (dx === 0 && dy === 0)
		{
			return;
		}

		var info = this.list[ index ];
		var orig = Y.clone(info.rect, true);
		info.rect.top    += dy;
		info.rect.left   += dx;
		info.rect.bottom += dy;
		info.rect.right  += dx;
		info.midline     += dy;

		Y.Array.each(this.list, function(info1)
		{
			if (orig.left <= info1.rect.left && info1.rect.right <= orig.right &&
				orig.top <= info1.rect.top && info1.rect.bottom <= orig.bottom)
			{
				info1.rect.top    += dy;
				info1.rect.left   += dx;
				info1.rect.bottom += dy;
				info1.rect.right  += dx;
				info1.midline     += dy;
			}
		});
	},

	/**
	 * Set the midline of the specified rectangle.
	 * 
	 * @method setMidline
	 * @param index {int}
	 * @param y {int} midline
	 */
	setMidline: function(
		/* int */	index,
		/* int */	y)
	{
		this.shift(index, 0, y - this.list[index].midline);
	},

	/**
	 * @method getBounds
	 * @return the bounding rect of all the rects in the list
	 */
	getBounds: function()
	{
		return this.list[ this.list.length-1 ].rect;
	},

	/**
	 * Returns the index of the smallest rectangle that contains both
	 * startPt and currPt.  Returns -1 if there is no such rectangle.  If
	 * startPt is inside the bounding rectangle and currPt is outside, we
	 * return the index of the bounding rectangle.
	 * 	
	 * @method getSelection
	 * @param start_pt {point} point where the drag started
	 * @param curr_pt {point} current cursor location
	 */
	getSelection: function(
		/* point */	start_pt,
		/* point */	curr_pt)
	{
		// Check if start_pt is in the bounding rect.

		var bounds = this.getBounds();
		if (!RectList.containsPt(bounds, start_pt))
		{
			return -1;
		}

		// The bounding rect is the last rect in the list.

		var minArea = 0;
		var result  = this.list.length-1;
		Y.Array.each(this.list, function(info, i)
		{
			var area = RectList.area(info.rect);
			if (RectList.containsPt(info.rect, start_pt) &&
				RectList.containsPt(info.rect, curr_pt) &&
				(minArea === 0 || area < minArea))
			{
				result  = i;
				minArea = area;
			}
		});

		return result;
	},

	/**
	 * Returns the index of the smallest rectangle enclosing the given one.
	 * 
	 * @method getParent
	 * @param index {int}
	 */
	getParent: function(
		/* int */	index)
	{
		var small_rect = this.list[index].rect;
		for (var i=index+1; i<this.list.length; i++)
			{
			var big_rect = this.list[i].rect;
			if (RectList.containsRect(big_rect, small_rect))
				{
				return i;
				}
			}

		// The last element is always the largest, and includes all others.

		return this.list.length-1;
	}
};
