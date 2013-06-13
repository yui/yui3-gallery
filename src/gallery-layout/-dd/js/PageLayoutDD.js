"use strict";

/**
 * Allows rearranging Page Layout modules via Drag-and-Drop.
 */

var Dom = YAHOO.util.Dom,
	SDom = YAHOO.SATG.Dom,
	Event = YAHOO.util.Event,
	CustomEvent = YAHOO.util.CustomEvent,
	Prof = YAHOO.tool.Profiler;

function createBombSight(
	/* string */	bomb_sight_class)
{
	if (the_bomb_sight)
	{
		Dom.setStyle(the_bomb_sight, 'display', 'block');
		return;
	}

	the_bomb_sight           = document.createElement('div');
	the_bomb_sight.className = bomb_sight_class;
	Dom.setStyle(the_bomb_sight, 'position', 'absolute');
	document.body.appendChild(the_bomb_sight);
}

function hideBombSight()
{
	if (the_bomb_sight)
	{
		Dom.setStyle(the_bomb_sight, 'display', 'none');
		Dom.setXY(this.getDragEl(), [-10000, -10000]);
	}
}

YAHOO.SATG.PageLayoutDDProxy = function(layout, module_id, nub_id, group, config)
{
	this.layout = layout;

	if (!config)
	{
		config = {};
	}

	config.isTarget    = false;
//	config.centerFrame = true;
//	config.resizeFrame = false;
	config.scroll      = false;
	config.useShim     = true;

	PageLayoutDDProxy.superclass.constructor.call(this, module_id, group, config);

	this.setHandleElId(nub_id);
};

var PageLayoutDDProxy = YAHOO.SATG.PageLayoutDDProxy,
	the_bomb_sight = null,	// create when needed
	the_bomb_sight_width = 6,
	the_bomb_sight_half_width = 3;

YAHOO.extend(PageLayoutDDProxy, YAHOO.util.DDProxy,
{
	clickValidator: function(e)
	{
		var target = Event.getTarget(e);
		var module = Dom.getAncestorByClassName(target, this.layout.module_class);
		var header = Dom.hasClass(target, this.layout.module_header_class);
		if (!header)
		{
			header = Dom.getAncestorByClassName(target, this.layout.module_header_class);
		}
		return (header && module && !Dom.hasClass(module, this.layout.module_no_drag_class));
	},

	startDrag: function()
	{
		this.drop_module = null;
	},
/*
	_resizeProxy: function()
	{
		var proxy = this.getDragEl();
		Dom.setStyle(proxy, 'width', '50px');	// DD only understands px
		Dom.setStyle(proxy, 'height', '50px');
	},
*/
	onDragOver: function(e, id)
	{
		this.drop_module = null;

		var target = Dom.get(id);
		if (!target)
		{
			return;
		}

		var horiz   = this.layout.horizontal;
		var modules = Dom.getElementsByClassName(this.layout.module_class, 'div', target);
		if (horiz)	// row-based
		{
			var eX     = Event.getPageX(e);
			var offset = Dom.getX(modules[0]);
		}
		else		// col-based
		{
			var eY     = Event.getPageY(e);
			var offset = Dom.getY(modules[0]);
		}

		var count = modules.length;
		for (var i=0; i<count; i++)
		{
			var module = modules[i];
			if (horiz)
			{
				var w = SDom.width(module);
				if (eX < offset + w)
				{
					this.drop_module = module;
					break;
				}
				offset += w;
			}
			else
			{
				var h = SDom.height(module);
				if (eY < offset + h)
				{
					this.drop_module = module;
					break;
				}
				offset += h;
			}
		}

		if (!this.drop_module)
		{
			return;
		}

		createBombSight(this.layout.bomb_sight_class);

		var xy = Dom.getXY(this.drop_module);
		var x  = xy[0];
		var y  = xy[1];
		var w = this.drop_module.offsetWidth;
		var h = this.drop_module.offsetHeight;

		if (horiz)
		{
			if (eX < x + w/2)
			{
				x -= SDom.parseStyle(this.drop_module, 'margin-left');
				this.drop_after = false;
			}
			else
			{
				x += w + SDom.parseStyle(this.drop_module, 'margin-right');
				this.drop_after = true;
			}
			Dom.setStyle(the_bomb_sight, 'top', y+'px');
			Dom.setStyle(the_bomb_sight, 'left', (x - the_bomb_sight_half_width)+'px');
			Dom.setStyle(the_bomb_sight, 'width', (the_bomb_sight_width - SDom.horizMarginBorderPadding(the_bomb_sight))+'px');
			Dom.setStyle(the_bomb_sight, 'height', (this.drop_module.offsetHeight - SDom.vertMarginBorderPadding(the_bomb_sight))+'px');
		}
		else
		{
			if (eY < y + h/2)
			{
				y -= SDom.parseStyle(this.drop_module, 'margin-top');
				this.drop_after = false;
			}
			else
			{
				y += h + SDom.parseStyle(this.drop_module, 'margin-bottom');
				this.drop_after = true;
			}
			Dom.setStyle(the_bomb_sight, 'top', (y - the_bomb_sight_half_width)+'px');
			Dom.setStyle(the_bomb_sight, 'left', x+'px');
			Dom.setStyle(the_bomb_sight, 'width', (this.drop_module.offsetWidth - SDom.horizMarginBorderPadding(the_bomb_sight))+'px');
			Dom.setStyle(the_bomb_sight, 'height', (the_bomb_sight_width - SDom.vertMarginBorderPadding(the_bomb_sight))+'px');
		}
	},

	onDragOut: function()
	{
		hideBombSight.call(this);
	},

	endDrag: function()
	{
		hideBombSight.call(this);

		var proxy = this.getDragEl();
		Dom.setXY(proxy, [-10000, -10000]);
	},

	onDragDrop: function(e, id)
	{
		if (this.drop_module)
		{
			if (this.drop_after && this.drop_module.nextSibling)
			{
				this.drop_module.parentNode.insertBefore(this.getEl(), this.drop_module.nextSibling);
			}
			else if (this.drop_after)
			{
				this.drop_module.parentNode.appendChild(this.getEl());
			}
			else
			{
				this.drop_module.parentNode.insertBefore(this.getEl(), this.drop_module);
			}
			this.layout._rescanBody();
		}
	}
});
