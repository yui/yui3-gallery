	/*!
	 * Base Component Manager
	 * 
	 * Oddnut Software
	 * Copyright (c) 2010 Eric Ferraiuolo - http://eric.ferraiuolo.name
	 * YUI BSD License - http://developer.yahoo.com/yui/license.html
	 */
	
	var ComponentMgr,
		
		COMPONENTS = 'components',
		
		E_INIT_COMPONENTS = 'initComponents',
		
		L = Y.Lang,
		isArray = L.isArray,
		isString = L.isString,
		isFunction = L.isFunction,
		noop = function(){};
		
	// *** Constructor *** //
	
	ComponentMgr = function (config) {
		
		Y.log('constructor callled', 'info', 'baseComponentMgr');
		
		/**
		 * Fired right after init event to allow implementers to add components to be eagerly initialized.
		 * a <code>components</code> array is passed to subscribers whom can push on components to be initialized,
		 * components can be referenced by string name or object reference.
		 * 
		 * @event initComponents
		 * @param event {Event} The event object for initComponents; has properties:
		 */
		this.publish(E_INIT_COMPONENTS, {
			defaultFn	: this._defInitComponentsFn,
			fireOnce	: true
		});
			
		this.after('init', function(e){
			Y.log('firing: ' + E_INIT_COMPONENTS, 'info', 'baseComponentMgr');
			this.fire(E_INIT_COMPONENTS, { components: [] });
		});
	};
	
	// *** Static *** //
	
	// *** Prototype *** //
	
	ComponentMgr.prototype = {
		
		// *** Instance Members *** //
		
		// *** Public Methods *** //
		
		/**
		 * Retrieves component instance(s) by component name or reference,
		 * any non-initialized components will be initalized.
		 * Component instance(s) will be passed to the callback as arguments.
		 * 
		 * @method getComponent
		 * @param component* {string|object} 1-n components to get/create instances of and return
		 * @param *callback {function} callback to pass component instances to
		 */
		getComponent : function () {
			
			Y.log('getComponent called', 'info', 'baseComponentMgr');
			
			var args = Y.Array(arguments, 0, true),
				components = args.slice(0, -1),
				callback = isFunction(args[args.length-1]) ? args[args.length-1] : noop,
				instances = [],
				initialized;
			
			if (components.length < 1) {
				Y.log('getComponent: no components, returning', 'info', 'baseComponentMgr');
				callback.call(this, null);
				return;
			}
			
			initialized = Y.Array.partition(components, function(c){
				var instance = this._getInstance(c);
				instances.push(instance);
				return instance;
			}, this);
			
			if (initialized.rejects.length > 0) {
				Y.log('getComponent: components require initialization', 'info', 'baseComponentMgr');
				Y.use.apply(Y, this._getRequires(initialized.rejects).concat(Y.bind(function(Y){
					Y.log('getComponent: required modules loaded', 'info', 'baseComponentMgr');
					var instances = [];
					Y.Array.each(initialized.rejects, this._initComponent, this);
					Y.Array.each(components, function(c){
						instances.push(this._getInstance(c));
					}, this);
					callback.apply(this, instances);
				}, this)));
			} else {
				callback.apply(this, instances);
			}
		},
		
		// *** Private Methods *** //
		
		_getComponent : function (c) {
			
			var components = this[COMPONENTS];
			return ( isString(c) && Y.Object.hasKey(components, c) ? components[c] : Y.Object.hasValue(c) ? c : null );
		},
		
		_getInstance : function (c) {
			
			return ( this._getComponent(c).instance || null );
		},
		
		_getRequires : function (components) {
			
			components = isArray(components) ? components : [components];
			var requires = [];
			
			Y.Array.each(components, function(c){
				c = this._getComponent(c) || {};
				requires = requires.concat(c.requires || []);
			}, this);
			
			return Y.Array.unique(requires);
		},
		
		_defInitComponentsFn : function (e) {
			
			var components = e.components,
				requires = this._getRequires(components);
				
			Y.use.apply(Y, requires.concat(Y.bind(function(Y){
				Y.Array.each(components, this._initComponent, this);
			}, this)));
		},
		
		_initComponent : function (c) {
			
			c = this._getComponent(c);
			if ( ! c) { return null; }
			
			if ( ! c.instance) {
				var initFn = isFunction(c.initializer) ? c.initializer :
						isString(c.initializer) && isFunction(this[c.initializer]) ? this[c.initializer] : noop;
				try { c.instance = initFn.call(this); } catch(e){}
			}
			
			return c.instance || null;
		}
		
	};
	
	Y.BaseComponentMgr = ComponentMgr;
