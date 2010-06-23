YUI.add('gallery-base-componentmgr', function(Y) {

	/*!
	 * Base Component Manager
	 * 
	 * Oddnut Software
	 * Copyright (c) 2010 Eric Ferraiuolo - http://eric.ferraiuolo.name
	 * YUI BSD License - http://developer.yahoo.com/yui/license.html
	 */
	
	var ComponentMgr,
		
		REQUIRES = 'requires',
		INITIALIZER = 'initializer',
		INSTANCE = 'instance',
		
		E_INIT_COMPONENT = 'initComponent',
		E_INIT_COMPONENTS = 'initComponents',
		
		L = Y.Lang,
		isArray = L.isArray,
		isString = L.isString,
		isObject = L.isObject,
		isFunction = L.isFunction,
		noop = function(){};
		
	// *** Constructor *** //
	
	ComponentMgr = function () {
		
		this.initComponentMgr.apply(this, arguments);
	};
	
	// *** Static *** //
	
	// *** Prototype *** //
	
	ComponentMgr.prototype = {
		
		// *** Lifecycle Methods *** //
		
		initComponentMgr : function () {
			
			// Holds the goods
			this._components = new Y.State();
			
			// Add the components defined in the static COMPONENTS object
			Y.Object.each(this.constructor.COMPONENTS, function(config, name){
				this.addComponent(name, config);
			}, this);
			
			/**
			 * Fired when a component is going to be initialized.
			 * The <code>componentToInit</code> property is the String name of the component going to be intialized.
			 * Developers can listen to the 'on' moment to prevent the default action of initializing the component.
			 * Listening to the 'after' moment, a <code>component</code> property on the Event Object is the component instance.
			 * 
			 * @event initComponent
			 * @param event {Event} The event object for initComponent; has properties: componentToInit, component
			 */
			this.publish(E_INIT_COMPONENT, { defaultFn: this._defInitComponentFn });
			
			/**
			 * Fired right after init event to allow implementers to add components to be eagerly initialized.
			 * A <code>componentsToInit</code> array is passed to subscribers whom can push on components to be initialized,
			 * components can be referenced by string name or object reference.
			 * 
			 * @event initComponents
			 * @param event {Event} The event object for initComponents; has property: componentsToInit
			 */
			this.publish(E_INIT_COMPONENTS, {
				defaultFn	: this._defInitComponentsFn,
				fireOnce	: true
			});
			
			// Fire initComponents during Y.Base initialization
			if (this.get('initialized')) {
				this.fire(E_INIT_COMPONENTS, { componentsToInit: [] });
			} else {
				this.after('initializedChange', function(e){
					this.fire(E_INIT_COMPONENTS, { componentsToInit: [] });
				});
			}
		},
		
		// *** Public Methods *** //
		
		/**
		 * Adds a component to the Class.
		 * Components are added by giving an name and configuration.
		 * The Component Manager uses the requires and initializer function to create the component instance on demand.
		 * 
		 * @method addComponent
		 * @param name {String} name of the component to add
		 * @param config {Object} defining: {Array} requires, {function} initializer
		 * @return void
		 */
		addComponent : function (name, config) {
			
			if ( ! isString(name)) { return; }		// string name
			if ( ! isObject(config)) { return; }	// config object
			
			var components = this._components,
				requires = config.requires,
				initializer = config.initializer,
				instance = config.instance;
				
			initializer = isFunction(initializer) ? initializer :
						  isString(initializer) && isFunction(this[initializer]) ? this[initializer] : noop;
			
			components.add(name, REQUIRES, requires);
			components.add(name, INITIALIZER, initializer);
			components.add(name, INSTANCE, instance);
		},
				
		/**
		 * Retrieves component an instance by string name or reference.
		 * The components must have previously been initialized otherwise null is returned.
		 * 
		 * @method getComponent
		 * @param component	{String} component to get instance of
		 * @return instance	{Object|undefined} the component instance if previously initialized, otherwise undefined
		 */
		getComponent : function (component) {
			
			return this._components.get(component, INSTANCE);
		},
		
		/**
		 * Supplies the callback with component instance(s) that were requested by string name or reference,
		 * any non-initialized components will be initialized.
		 * Component instance(s) will be passed to the callback as arguments in the order requested.
		 * 
		 * @method useComponent
		 * @param component* {String} 1-n components to use and/or create instances of
		 * @param *callback {function} callback to pass component instances to
		 * @return void
		 */
		useComponent : function () {
			
			
			var args = Y.Array(arguments, 0, true),
				callback = isFunction(args[args.length-1]) ? args[args.length-1] : noop,	// last param or noop
				components = callback === noop ? args : args.slice(0, -1),					// if callback is noop then all params, otherwise all but last params
				instances = [],
				initialized;
			
			if (components.length < 1) {
				callback.call(this);
				return;
			}
			
			initialized = Y.Array.partition(components, function(c){
				var instance = this.getComponent(c);
				instances.push(instance);
				return instance;
			}, this);
			
			if (initialized.rejects.length > 0) {
				Y.use.apply(Y, this._getRequires(initialized.rejects).concat(Y.bind(function(Y){
					var instances = [];
					Y.Array.each(initialized.rejects, this._initComponent, this);
					Y.Array.each(components, function(c){
						instances.push(this.getComponent(c));
					}, this);
					callback.apply(this, instances);
				}, this)));
			} else {
				callback.apply(this, instances);
			}
		},
		
		// *** Private Methods *** //
		
		_getRequires : function (components) {
			
			components = isArray(components) ? components : [components];
			var requires = [];
			
			Y.Array.each(components, function(c){
				requires = requires.concat(this._components.get(c, REQUIRES) || []);
			}, this);
			
			return Y.Array.unique(requires);
		},
		
		_initComponent : function (c) {
			
			this.fire(E_INIT_COMPONENT, { componentToInit: c });
		},
		
		_defInitComponentFn : function (e) {
			
			var components = this._components,
				component = e.componentToInit,
				initializer = components.get(component, INITIALIZER),
				instance = components.get(component, INSTANCE);
			
			if ( ! instance && isFunction(initializer)) {
				instance = initializer.call(this);
				components.add(component, INSTANCE, instance);
			}
			
			e.component = instance;
		},
		
		_defInitComponentsFn : function (e) {
			
			var components = e.componentsToInit,
				requires = this._getRequires(components);
				
			Y.use.apply(Y, requires.concat(Y.bind(function(Y){
				Y.Array.each(components, this._initComponent, this);
			}, this)));
		}
		
	};
	
	Y.BaseComponentMgr = ComponentMgr;


}, 'gallery-2010.06.23-18-37' ,{requires:['collection']});
