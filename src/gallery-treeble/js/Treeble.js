/**********************************************************************
 * Treeble displays a tree of data in a table.
 *
 * @module gallery-treeble
 */

/**
 * Utility functions for displaying tree data in a table.
 *
 * @namespace
 * @class Treeble
 */

/**
 * <p>Formatter for open/close twistdown.</p>
 *
 * @method twistdownFormatter
 * @param sendRequest {Function} Function that reloads DataTable
 * @static
 */
Y.namespace("Treeble").buildTwistdownFormatter = function(sendRequest)
{
	return function(o)
	{
		var td = o.createCell();
		td.addClass('treeble-nub');

		var ds  = this.datasource.get('datasource');
		var key = ds.get('root').treeble_config.childNodesKey;

		if (o.data[key])
		{
			var path  = o.data._yui_node_path;
			var open  = ds.isOpen(path);
			var clazz = open ? 'row-open' : 'row-closed';

			td.addClass('row-toggle');
			td.replaceClass(/row-(open|closed)/, clazz);

			td.on('click', function()
			{
				ds.toggle(path, {}, sendRequest);
			});

			td.set('innerHTML', '<a class="treeble-collapse-nub" href="javascript:void(0);"></a>');
		}
		else
		{
			td.set('innerHTML', '');
		}

		return '';
	};
};

/**
 * <p>Default formatter for indented column.</p>
 *
 * @method treeValueFormatter
 * @static
 */
Y.namespace("Treeble").treeValueFormatter = function(o)
{
	var depth_class = 'treeble-depth-'+o.data._yui_node_depth;
	return '<span class="'+depth_class+'">'+o.value+'</span>';
};
