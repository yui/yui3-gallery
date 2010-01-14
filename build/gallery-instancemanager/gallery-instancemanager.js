YUI.add('gallery-instancemanager', function(Y) {

/**********************************************************************
 * <p>Stores instances of JavaScript components.  Allows a constructor to
 * be passed in place of an instance.  This enables lazy construction on
 * demand.</p>
 * 
 * <p>One use is to create a global repository of JavaScript components
 * attached to DOM id's, e.g., YUI Buttons built on top of HTML
 * buttons.</p>
 * 
 * @module gallery-instancemanager
 * @class InstanceManager
 * @constructor
 */

function InstanceManager()
{
	this._map          = { };
	this._constructors = { };
}

InstanceManager.prototype =
{
	/**
	 * Retrieve an object.
	 * 
	 * @method get
	 * @param id {String} The id of the object to retrieve.
	 */
	get: function(
		/* string */	id)
	{
		if (this._map[ id ] === null && this._constructors[ id ])
		{
			var c = this._constructors[ id ];

			var s = 'new ' + (Y.Lang.isFunction(c.fn) ? 'c.fn' : c.fn) + '(';
			if (c.args && c.args.length)
			{
				for (var i=0; i<c.args.length; i++)
				{
					if (i > 0)
					{
						s += ',';
					}
					s += 'c.args[' + i + ']';
				}
			}
			s += ')';

			this._map[ id ] = eval(s);
		}

		return this._map[ id ] || false;
	},

	/**
	 * Store an object or ctor+args.
	 * 
	 * @method put
	 * @param id {String} The id of the object.
	 * @param objOrCtor {Object|Function|String} The object or the object's constructor.
	 * @param args {Array} The array of arguments to pass to the constructor.
	 * @return {boolean} false if the id has already been used
	 */
	put: function(
		/* string */	id,
		/* obj/fn */	objOrCtor,
		/* array */		args)
	{
		if (this._map[ id ])
		{
			return false;
		}
		else if (Y.Lang.isFunction(objOrCtor) ||
				 Y.Lang.isString(objOrCtor))
		{
			this._constructors[ id ] =
			{
				fn:   objOrCtor,
				args: Y.Lang.isArray(args) ? args : [args]
			};

			this._map[ id ] = null;
			return true;
		}
		else
		{
			this._map[ id ] = objOrCtor;
			return true;
		}
	},

	/**
	 * Remove an object.
	 * 
	 * @param id {String} The id of the object.
	 */
	remove: function(
		/* string */	id)
	{
		if (this._map[ id ])
		{
			delete this._map[ id ];
			return true;
		}
		else
		{
			return false;
		}
	},

	/**
	 * Remove all objects.
	 */
	clear: function()
	{
		this._map = {};
	},

	/**
	 * Call a function on every object.
	 * 
	 * @param behavior {Function|String|Object} The function to call or the name of the function or an object {fn:,scope:}
	 * @param arguments {Array} The arguments to pass to the function.
	 */
	applyToAll: function(
		/* string/fn/object */	behavior,
		/* array */				args)
	{
		var map        = this._map,
			isFunction = Y.Lang.isFunction(behavior),
			isObject   = Y.Lang.isObject(behavior);

		for (var name in map)
		{
			if (map.hasOwnProperty(name))
			{
				var item = map[ name ];
				if (isFunction || isObject)
				{
					// apply the function and pass the map item as an argument

					var fn    = isFunction ? behavior : behavior.fn,
						scope = isFunction ? window : behavior.scope;

					fn.apply(scope, [ { key:name, value:item } ].concat( args ) );
				}
				else if (item && Y.Lang.isFunction(item[ behavior ]))
				{
					// the string is the name of a method

					item[ behavior ].apply(item, args);
				}
			}
		}
	}
};

Y.InstanceManager = InstanceManager;


}, 'gallery-2009.12.08-22' );
