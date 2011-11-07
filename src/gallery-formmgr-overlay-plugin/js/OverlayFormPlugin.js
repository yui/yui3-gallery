"use strict";

/**
 * A simple plugin for Y.Overlay which attaches a Y.FormManager to the
 * &lt;form&gt; inside the overlay.  Before the overlay is shown,
 * prepareForm() is called to insert the default values.  (If this returns
 * false, the overlay is not shown.)  After the overlay is shown, focus is
 * set to the first field.
 *
 * @module gallery-formmgr-overlay-plugin
 * @class Y.Plugin.OverlayForm
 */
function OverlayFormPlugin()
{
	OverlayFormPlugin.superclass.constructor.apply(this, arguments);
}

OverlayFormPlugin.NAME = "OverlayFormPlugin";
OverlayFormPlugin.NS   = "form";

OverlayFormPlugin.ATTRS =
{
	/**
	 * @config formmgr
	 * @type {Y.FormManager}
	 * @writeonce
	 */
	formmgr:
	{
		writeOnce: true
	}
};

Y.extend(OverlayFormPlugin, Y.Plugin.Base,
{
	initializer: function(config)
	{
		var f = this.get('host').get('contentBox').one('form');
		if (!f.get('name'))
		{
			f.set('name', Y.guid('form-overlay-'));
		}
		this.set('formmgr', new Y.FormManager(f.get('name')));

		this.onHostEvent('visibleChange', function(e)
		{
			if (e.newVal &&		// visible
				!this.get('formmgr').prepareForm())
			{
				e.halt();
			}
		});

		this.afterHostEvent('visibleChange', function(e)
		{
			if (e.newVal)	// visible
			{
				this.get('formmgr').initFocus();
			}
			else			// hidden
			{
				this.get('formmgr').clearForm();
			}
		});
	}
});

Y.namespace("Plugin");
Y.Plugin.OverlayForm = OverlayFormPlugin;
