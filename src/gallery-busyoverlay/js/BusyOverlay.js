/**********************************************************************
 * A plugin for Y.Node or Y.Widget that creates an overlaying div.
 * Especially useful for a widget that is waiting for an AJAX response.
 * 
 * @module gallery-busyoverlay
 * @namespace Plugin
 * @class BusyOverlay
 * @extends Plugin.Base
 */
function BusyOverlayPlugin(config)
{
	BusyOverlayPlugin.superclass.constructor.apply(this, arguments);
}

BusyOverlayPlugin.NAME = "BusyOverlayPlugin";
BusyOverlayPlugin.NS   = "busy";

BusyOverlayPlugin.ATTRS =
{
	/**
	 * CSS class to apply to the overlay.
	 *
	 * @config css
	 * @type {String}
	 * @default "yui3-component-busy"
	 */
	css:
	{
		value:     'yui3-component-busy',
		validator: Y.Lang.isString
	}
};

function resizeOverlay()
{
	var r = this.getTargetNode().get('region');
	if (r &&
		(!this.target_region                    ||
		 r.top    !== this.target_region.top    ||
		 r.bottom !== this.target_region.bottom ||
		 r.left   !== this.target_region.left   ||
		 r.right  !== this.target_region.right))
	{
		this.target_region = r;

		this.o.setXY([r.left, r.top]);
		this.o.setStyle('width',  r.width  + 'px');
		this.o.setStyle('height', r.height + 'px');
	}
}

Y.extend(BusyOverlayPlugin, Y.Plugin.Base,
{
	initializer: function(config)
	{
		this.o = Y.Node.create('<div style="position:absolute;display:none;visibility:hidden;"></div>');
		this.o.set('className', this.get('css'));
		this.getTargetNode().get('parentNode').appendChild(this.o);

		this.on('cssChange', function(e)
		{
			this.o.set('className', e.newVal);
		});
	},

	destructor: function()
	{
		this.o.remove();
	},

	/**
	 * @return {Boolean} true if the overlay is visible
	 */
	isVisible: function()
	{
		return (this.o.getStyle('visibility') != 'hidden');
	},

	/**
	 * Show the overlay.
	 */
	show: function()
	{
		this.setVisible(true);
	},

	/**
	 * Hide the overlay.
	 */
	hide: function()
	{
		this.setVisible(false);
	},

	/**
	 * Toggle the visibility of the overlay.
	 */
	toggleVisible: function()
	{
		this.setVisible(!this.isVisible());
	},

	/**
	 * Set the visibility of the overlay.
	 * 
	 * @param visible {Boolean}
	 */
	setVisible: function(
		/* boolean */	visible)
	{
		this.target_region = null;

		this.o.setStyle('display', (visible ? '' : 'none'));
		resizeOverlay.call(this);
		this.o.setStyle('visibility', (visible ? '' : 'hidden'));

		if (visible)
		{
			if (!this.timer)
			{
				this.timer = Y.later(500, this, resizeOverlay, null, true);
			}

			this.getTargetNode().addClass('yui3-busyoverlay-browser-hacks');
		}
		else
		{
			if (this.timer)
			{
				this.timer.cancel();
				this.timer = null;
			}

			this.getTargetNode().removeClass('yui3-busyoverlay-browser-hacks');
		}
	},

	/**
	 * @return {Node} node to overlay
	 */
	getTargetNode: function()
	{
		var host = this.get('host');
		return (Y.Widget && host instanceof Y.Widget ? host.get('boundingBox') : host);
	}
});

Y.namespace("Plugin");
Y.Plugin.BusyOverlay = BusyOverlayPlugin;
