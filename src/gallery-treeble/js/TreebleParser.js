/**
 * @module gallery-treeble
 */

/**
 * <p>Converts data to a DataSource.  Data can be an object containing both
 * <code>dataType</code> and <code>liveData</code>, or it can be <q>free
 * form</q>, e.g., an array of records or an XHR URL.</p>
 *
 * @class Parsers
 */

/**
 * @method treebledatasource
 * @static
 * @param oData {mixed} Data to convert.
 * @return {DataSource} The new data source.
 */
Y.namespace("Parsers").treebledatasource = function(oData)
{
	if (!oData)
	{
		return null;
	}

	var type = oData.dataType;
	if (type)
	{
		// use it
	}
	else if (Y.Lang.isString(oData))
	{
		type = 'IO';
	}
	else if (Y.Lang.isFunction(oData))
	{
		type = 'Function';
	}
	else
	{
		type = 'Local';
	}

	var src            = oData.dataType ? oData.liveData : oData;
	var treeble_config = this.get('host').treeble_config;
	if (type == 'Local')
	{
		treeble_config = Y.clone(treeble_config, true);
		delete treeble_config.startIndexExpr;
		delete treeble_config.totalRecordsExpr;
	}
	else if (type == 'Function')
	{
		src = Y.Lang.isString(src) ? window[ src ] : src;
	}

	var ds            = new Y.DataSource[ type ]({ source: src });
	ds.treeble_config = treeble_config;

	if (ds.treeble_config.schemaPluginConfig)
	{
		ds.plug(Y.clone(ds.treeble_config.schemaPluginConfig, true));
	}

	if (ds.treeble_config.cachePluginConfig)
	{
		ds.plug(Y.clone(ds.treeble_config.cachePluginConfig, true));
	}

	return ds;
};
