"use strict";

/**********************************************************************
 * <p>Only scrolls the browser if the object is not currently visible.</p>
 * 
 * <p>This requires that all scrollable elements have position:relative.
 * Otherwise, this algorithm will skip over them with unpredictable
 * results.</p>
 * 
 * @chainable
 */

Y.Node.prototype.scrollIntoView = function()
{
	var ancestor = Y.Node.getDOMNode(this.get('offsetParent'));
	if (!ancestor)
	{
		return this;
	}

	var r =
	{
		top:    this.get('offsetTop'),
		bottom: this.get('offsetTop') + this.get('offsetHeight'),
		left:   this.get('offsetLeft'),
		right:  this.get('offsetLeft') + this.get('offsetWidth')
	};

	r.move = function(
		/* int */	dx,
		/* int */	dy)
	{
		this.top    += dy;
		this.bottom += dy;
		this.left   += dx;
		this.right  += dx;
	};

	while (1)
	{
		while (1)
		{
			var hit_top = (ancestor.offsetParent === null);

			var a = Y.one(ancestor);
			if (ancestor.scrollWidth - a.horizMarginBorderPadding() > ancestor.clientWidth ||
				ancestor.scrollHeight - a.vertMarginBorderPadding() > ancestor.clientHeight)
			{
				break;
			}
			else if (hit_top)
			{
				return this;
			}

			r.move(ancestor.offsetLeft - ancestor.scrollLeft, ancestor.offsetTop - ancestor.scrollTop);
			ancestor = ancestor.offsetParent || ancestor.parentNode;
		}

		var scrollX = (hit_top ? document.documentElement.scrollLeft || document.body.scrollLeft : ancestor.scrollLeft);
		var scrollY = (hit_top ? document.documentElement.scrollTop || document.body.scrollTop : ancestor.scrollTop);

		var d =
		{
			top:    scrollY,
			bottom: scrollY + ancestor.clientHeight,
			left:   scrollX,
			right:  scrollX + ancestor.clientWidth
		};

		var dy = 0;
		if (a.getStyle('overflowY') == 'hidden')
		{
			// don't scroll
		}
		else if (r.top < d.top)
		{
			dy = r.top - d.top;
		}
		else if (r.bottom > d.bottom)
		{
			dy = r.bottom - d.bottom;
		}

		var dx = 0;
		if (a.getStyle('overflowX') == 'hidden')
		{
			// don't scroll
		}
		else if (r.left < d.left)
		{
			dx = r.left - d.left;
		}
		else if (r.right > d.right)
		{
			dx = r.right - d.right;
		}

		if (hit_top)
		{
			if (dx || dy)
			{
				window.scrollBy(dx, dy);
			}
			break;
		}
		else
		{
			ancestor.scrollLeft += dx;
			ancestor.scrollTop  += dy;

			r.move(ancestor.offsetLeft - ancestor.scrollLeft, ancestor.offsetTop - ancestor.scrollTop);

			ancestor = ancestor.offsetParent;
		}
	}

	return this;
};
