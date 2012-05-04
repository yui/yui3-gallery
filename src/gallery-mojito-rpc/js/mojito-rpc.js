"use strict";

/**********************************************************************
 * <p>RPC wrapper for Mojit proxy.  This allows you to use either
 * Y.RPC.JSON or Y.RPC.Mojito interchangeably.  The method in the Mojit
 * proxy receives the parameters as an array in <code>body.params</code>.
 * You can pass this to the model as follows:
 * <code>model.getItems.apply(model,
 * ac.params.getFromBody().params)</code></p>
 *
 * @module gallery-mojito-rpc
 * @namespace RPC
 * @class Mojito
 * @constructor
 * @param config {Object}
 *	<dl>
 *	<dt>url</dt>
 *	<dd>the mojit proxy (parameter named to match Y.jsonrpc)</dd>
 *	<dt>methods</dt>
 *	<dd>(optional) array of method names, so you don't have to use <code>exec</code></dd>
 *	</dl>
 */

function MojitoRPC(config)
{
	this._mojit_proxy = config.url;

	if (Y.Lang.isArray(config.methods))
	{
		Y.each(config.methods, Y.bind(MojitoRPC.addMethod, null, this));
	}
}

/**
 * Adds the named method to the given rpc object.
 * 
 * @param rpc {RPC.Mojito} rpc object
 * @param name {String} name of method
 * @param force {Boolean} pass true to override existing method
 */
MojitoRPC.addMethod = function(rpc, name, force)
{
	if (rpc[name] && !force)
	{
		return;
	}

	rpc[name] = function()
	{
		var args = Y.Array(arguments, 0, true),
			last = args[args.length - 1],
			callback;

		if (Y.Lang.isFunction(last) ||
			(last && last.on && (last.on.success || last.on.failure)))
		{
			callback = args.pop();
		}

		return this.exec(name, args, callback);
	};
};

MojitoRPC.prototype =
{
	/**
	 * Executes the named method via the mojitProxy and invokes the callback
	 * when the result is received.
	 *
	 * @param method {Function} the name of the function to execute via the mojitProxy
	 * @param params {Array} array of arguments for the method
	 * @param callback {Function|Object} (optional) function to call on success or object specifying {context,on:{success,failure}}
	 */
	exec: function(method, params, callback)
	{
		var p = { params: { body: { params: params } } };

		if (Y.Lang.isFunction(callback))
		{
			callback = { on: { success: callback } };
		}

		this._mojit_proxy.invoke(method, p, function(error, response)
		{
			var result =
			{
				id:     null,
				error:  null,
				result: response
			};

			if (error && callback.on.failure)
			{
				result.error =
				{
					code:    -32000,
					message: error.message
				};
				callback.on.failure.call(callback.context, result);
			}
			else if (!error && callback)
			{
				callback.on.success.call(callback.context, result);
			}
		});
	}
};

var RPC    = Y.namespace('RPC');
RPC.Mojito = MojitoRPC;

RPC.mojito = function(proxy, method, params, callback, config)
{
	if (proxy && method)
	{
		return new MojitoRPC(Y.mix({ url: proxy }, config))
			.exec(method, params, callback);
	}
};
