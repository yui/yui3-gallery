/**********************************************************************
 * Treeble displays a tree of data in a table.
 *
 * @module gallery-treeble
 */

/**
 * Extension to DataTable for displaying tree data.
 *
 * @namespace
 * @class Treeble
 * @extends DataTable
 * @constructor
 * @param config {Object}
 */
function Treeble()
{
	Treeble.superclass.constructor.apply(this, arguments);
}

Treeble.NAME = "datatable";		// same styling

/**
 * <p>Formatter for open/close twistdown.</p>
 *
 * @method twistdownFormatter
 * @param sendRequest {Function} Function that reloads DataTable
 * @static
 */
Treeble.buildTwistdownFormatter = function(sendRequest)
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

			o.cell.set('innerHTML', '<a class="treeble-expand-nub" href="javascript:void(0);"></a>');
		}

		return true;	// keep the Y.Node instances
	};
};

/**
 * <p>Default formatter for indented column.</p>
 *
 * @method treeValueFormatter
 * @static
 */
Treeble.treeValueFormatter = function(o)
{
	var depth_class = 'treeble-depth-'+o.data._yui_node_depth;
	return '<span class="'+depth_class+'">'+o.value+'</span>';
};

Y.extend(Treeble, Y.DataTable,
{
	plug: function(plugin, config)
	{
		if (plugin === Y.Plugin.DataTableDataSource)
		{
			var recordType = this.get('recordType');
			recordType.ATTRS[ config.datasource.get('root').treeble_config.childNodesKey ] = {};
			recordType.ATTRS._yui_node_path  = {};
			recordType.ATTRS._yui_node_depth = {};
		}

		Treeble.superclass.plug.apply(this, arguments);
	}
});

Y.Treeble = Treeble;
