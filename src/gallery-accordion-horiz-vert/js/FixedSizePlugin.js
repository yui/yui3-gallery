/**
 * @module gallery-accordion-horiz-vert
 */

/**********************************************************************
 * <p>Plugin for Y.Accordion that detects that the widget has a fixed size
 * in the relevant dimension (width or height) and adjusts the open
 * sections to fit.</p>
 * 
 * <p>If/when the widget is given a fixed size, all animations are turned
 * off.</p>
 * 
 * @class FixedSizeAccordion
 * @namespace Plugin
 * @constructor
 */
function FixedSizeAccordionPlugin()
{
	FixedSizeAccordionPlugin.superclass.constructor.apply(this, arguments);
}

FixedSizeAccordionPlugin.NAME = "FixedSizeAccordionPlugin";
FixedSizeAccordionPlugin.NS   = "fixedsize";

FixedSizeAccordionPlugin.ATTRS =
{
};

var animation_attrs =
[
	'animateRender',
	'animateInsertRemove',
	'animateOpenClose'
];

var total_size =
{
	width:  'totalWidth',
	height: 'totalHeight'
};

var overflow =
{
	width:  'overflowX',
	height: 'overflowY'
};

var surrounding =
{
	width:  'horizMarginBorderPadding',
	height: 'vertMarginBorderPadding'
};

function off(
	/* string */	name)
{
	this.set(name, false);
	this.modifyAttr(name, { readOnly: true });
}

function adjust()
{
	var host = this.get('host');
	if (!this.init_fixed_size)
	{
		Y.Array.each(animation_attrs, off, host);

		if (!host.get('rendered'))
		{
			this.afterHostEvent('render', adjust, this);
		}

		this.onHostEvent('insert', function()
		{
			Y.later(1, this, adjust);	// may be modified after insertion
		},
		this);

		this.onHostEvent('remove', adjust, this);
		this.onHostEvent('open', adjust, this);
		this.onHostEvent('close', adjust, this);

		this.init_fixed_size = true;
	}

	var dim   = host.slide_style_name;
	var total = host.get('boundingBox').parseDimensionStyle(dim);
	var count = host.getSectionCount();
	var open  = [];
	for (var i=0; i<count; i++)
	{
		total -= host.getTitle(i)[ total_size[dim] ]();
		if (host.isSectionOpen(i))
		{
			open.push(i);
		}
	}

	count     = open.length;
	var size  = Math.floor(total / count);
	var extra = total % count;
	for (i=0; i<count; i++)
	{
		var section = host.getSection(open[i]);
		var size1   = size - section[ surrounding[dim] ]();
		if (i === count-1)
		{
			size1 += extra;
		}

		section.setStyle(dim, size1+'px');
		section.setStyle(overflow[dim], 'auto');
	}
}

Y.extend(FixedSizeAccordionPlugin, Y.Plugin.Base,
{
	initializer: function(config)
	{
		var host = this.get('host');
		var dim  = host.slide_style_name;

		this.init_fixed_size = false;
		if (host.get(dim))
		{
			adjust.call(this);
		}

		this.afterHostEvent(dim+'Change', function()
		{
			Y.later(1, this, adjust);
		},
		this);
	}
});

Y.namespace("Plugin");
Y.Plugin.FixedSizeAccordion = FixedSizeAccordionPlugin;
