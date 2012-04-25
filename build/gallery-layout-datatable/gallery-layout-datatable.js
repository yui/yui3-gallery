YUI.add('gallery-layout-datatable', function(Y) {

"use strict";

/**********************************************************************
 * <p>Plugin for scrolling DataTable to make it fit inside a PageLayout
 * module.  After you plug it in, it automatically detects the PageLayout
 * module, so you don't have to do anything.</p>
 * 
 * @module gallery-layout-datatable
 * @namespace Plugin
 * @class PageLayoutDataTableModule
 * @extends Plugin.Base
 * @constructor
 * @param config {Object} configuration
 */

function PLDTModule(
	/* object */ config)
{
	PLDTModule.superclass.constructor.call(this, config);
}

PLDTModule.NAME = "PageLayoutDataTableModulePlugin";
PLDTModule.NS   = "layout";

PLDTModule.ATTRS =
{
	/**
	 * (Required) Instance of Y.PageLayout
	 * 
	 * @config layout
	 * @type {PageLayout}
	 * @writeonce
	 */
	layout:
	{
		value:     null,
		writeonce: true
	}
};

Y.extend(PLDTModule, Y.Plugin.Base,
{
	initializer: function(config)
	{
		this.afterHostMethod('render', function()
		{
			var table  = this.get('host'),
				layout = this.get('layout'),

				module_bd =
				table.get('boundingBox')
					 .ancestor('.' + Y.PageLayout.module_body_class);

			module_bd.generateID();

			layout.on('beforeResizeModule', function(e)
			{
				if (e.bd.get('id') == module_bd.get('id') && e.height == 'auto')
				{
					table.set('height', 'auto');
					table.set('scrollable', 'x');
				}
			});

			layout.on('afterResizeModule', function(e)
			{
				if (e.bd.get('id') == module_bd.get('id'))
				{
					table.set('height', e.height+'px');
					table.set('scrollable', true);
				}
			});
		});
	}
});

Y.namespace("Plugin");
Y.Plugin.PageLayoutDataTableModule = PLDTModule;


}, 'gallery-2012.04.10-14-57' ,{requires:['gallery-layout','datatable-scroll','plugin']});
