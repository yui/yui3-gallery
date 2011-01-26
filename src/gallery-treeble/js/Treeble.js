"use strict";

/**********************************************************************
 * @module gallery-treeble
 * @class Treeble
 */

/**
 * <p>Formatter for open/close twistdown.</p>
 *
 * @method Y.Treeble.twistdownFormatter
 * @param sendRequest {Function} Function that reloads DataTable
 * @static
 */
Y.namespace("Treeble").buildTwistdownFormatter = function(sendRequest)
{
	return function(o)
	{
		o.td.addClass('treeble-nub');

		var ds  = this.datasource.get('datasource');
		var key = ds.get('root').treeble_config.childNodesKey;

		if (o.data[key])
		{
			var path  = o.data._yui_node_path;
			var open  = ds.isOpen(path);
			var clazz = open ? 'row-open' : 'row-closed';

			o.td.addClass('row-toggle');
			o.td.replaceClass(/row-(open|closed)/, clazz);

			o.td.on('click', function()
			{
				ds.toggle(path, {}, sendRequest);
			});

			o.td.set('innerHTML', '<a class="treeble-collapse-nub" href="javascript:void(0);"></a>');
		}
		else
		{
			o.td.set('innerHTML', '');
		}

		return '';
	};
};

/**
 * <p>Default formatter for indented column.</p>
 *
 * @method Y.Treeble.treeValueFormatter
 * @static
 */
Y.namespace("Treeble").treeValueFormatter = function(o)
{
	var depth_class = 'treeble-depth-'+o.data._yui_node_depth;
	return '<span class="'+depth_class+'">'+o.value+'</span>';
};
