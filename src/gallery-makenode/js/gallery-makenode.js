/**
 * An extension for Widget to create markup from templates, 
 * create CSS classNames, locating elements,
 * assist in attaching events to UI elements and to reflect attribute changes into the UI.
 * All of its members are either protected or private.  
 * Developers using MakeNode should use only those marked protected.  
 * <b>Enable the Show Protected checkbox to see them</b>.
 * @module gallery-makenode
 * @class MakeNode
 */
	"use strict";
	
	var WS = /\s+/,
		NODE = 'Node',
		DOT = '.',
		BBX = 'boundingBox',
		Lang = Y.Lang,
		DUPLICATE = ' for "{name}" defined in class {recentDef} also defined in class {prevDef}',
		/** 
		 * Creates CSS classNames from suffixes listed in <a href="#property__CLASS_NAMES"><code>_CLASS_NAMES</code></a>, 
		 * stores them in <a href="#property__classNames"><code>this._classNames</code></a>.
		 * Concatenates <a href="#property__ATTRS_2_UI"><code>_ATTRS_2_UI</code></a> into <code>_UI_ATTRS</code>.
		 * Sets listeners to render and destroy events to attach/detach UI events
		 * @constructor
		 */
		MakeNode = function () {
			this._makeClassNames();
			this._concatUIAttrs();
			this._publishEvents();
			this.after('render', this._attachEvents, this);
			this.after('destroy', this._detachEvents, this);
		};
	MakeNode.prototype = {
		/**
		 * Contains a hash of CSS classNames generated from the entries in <a href="#property__CLASS_NAMES"><code>_CLASS_NAMES</code></a>
		 * indexed by those same values.
		 * It will also have the following entries added automatically: <ul>
		 * <li><code>.</code> The className for the boundingBox</li>
		 * <li><code>content</code> The className for the contentBox</li>
		 * <li><code>HEADER</code> The className for the header section of a StdMod if Y.WidgetStdMod has been loaded</li>
		 * <li><code>BODY</code> The className for the body section of a StdMod if Y.WidgetStdMod has been loaded</li>
		 * <li><code>FOOTER</code> The className for the footer section of a StdMod if Y.WidgetStdMod has been loaded</li>
		 * </ul>
		 * @property _classNames
		 * @type Object
		 * @protected
		 */
		 _classNames:null,
		/**
		 * Hash listing the template processing codes and the functions to handle each.
		 * The processing functions will receive a string with the arguments that follow the processing code,
		 * and should return the replacement value for the placeholder.
		 * @property _templateHandlers
		 * @type Object
		 * @private
		 */		 
		_templateHandlers: {
			'@': function (arg) {
				return this.get(arg);
			},
			'p': function (arg) {
				return this[arg];
			},
			'm': function (args) {
				var method = args.split(WS)[0];
				args = args.substr(method.length);
				args = this._parseMakeNodeArgs(args);
				return this[method].apply(this, args);
			},
			'c': function (arg) {
				return this._classNames[arg];
			},
			's': function (arg) {
				return this.get('strings')[arg];
			},
			'?': function(args) {
				args = this._parseMakeNodeArgs(args);
				return (!!args[0])?args[1]:args[2];
			},
			'1': function (args) {
				args = this._parseMakeNodeArgs(args);
				return parseInt(args[0],10) ===1?args[1]:args[2];
			}
		},
		/**
		 * Parses the arguments received by the processor of the <code>{m}</code> placeholder.  
		 * It recognizes numbers, <code>true</code>, <code>false</code>, <code>null</code> and double quoted strings, each separated by whitespace.
		 * It skips over anything else.
		 * @method _parseMakeNodeArgs
		 * @param arg {String} String to be parsed for arguments
		 * @return {Array} Array of arguments found, each converted to its proper data type
		 * @private
		 */
		_parseMakeNodeArgs: function (arg) {
			var regexp = /^(?:([ \t]+)|("[^"\\]*(?:\\.[^"\\]*)*")|(true)|(false)|(null)|([\-+]?[0-9]*(?:\.[0-9]+)?))/, 
				args = [],
				matcher = function (match, i) {
					if (match !== undefined && i) {
						switch (i) {
							case 1:
								break;
							case 2:
								args.push(match.substr(1, match.length - 2).replace('\\"','"'));
								break;
							case 3:
								args.push(true);
								break;
							case 4:
								args.push(false);
								break;
							case 5:
								args.push(null);
								break;
							case 6:
								if (match) {
									args.push(parseFloat(match));
								} else {
									// The last parenthesis of the RegExp succeeds on anything else since both the integer and decimal
									// parts of a number are optional, however, it captures nothing, just an empty string.
									// So, any string other than true, false, null or a properly quoted string will end up here.
									// I just consume it one character at a time to avoid looping forever on errors.
									arg = arg.substr(1);
								}
								break;
						}
						arg = arg.substr(match.length);
						return true;
					}
				};
			while (arg.length) {
				
				Y.some(regexp.exec(arg), matcher);
			}
			return args;
		},
		/**
		 * Processes the template given and returns a <code>Y.Node</code> instance.
		 * @method _makeNode
		 * @param template {String} (optional) Template to process.  
		 *        If missing, it will use the first static <a href="#property__TEMPLATE"><code>_TEMPLATE</code></a> property found in the inheritance chain.
		 * @param extras {Object} (optional) Hash of extra values to replace into the template, beyond MakeNode's processing codes.
		 * @return {Y.Node} Instance of <code>Y.Node</code> produced from the template
		 * @protected
		 */
		_makeNode: function(template, extras) {
			if (!template) {
				Y.some(this._getClasses(), function (c) {
					template = c._TEMPLATE;
					if (template) {
						return true;
					}
				});
			}
			return Y.Node.create(this._substitute(template, extras));
		},
		/**
		 * Processes the given template and returns a string
		 * @method _substitute
		 * @param template {String} (optional) Template to process.  
		 *        If missing, it will use the first static <a href="#property__TEMPLATE"><code>_TEMPLATE</code></a> property found in the inheritance chain.
		 * @param extras {Object} (optional) Hash of extra values to replace into the template, beyond MakeNode's processing codes.
		 * @return {String} Template with the placeholders replaced.
		 * @protected
		 */
		_substitute: function (template, extras) {
			var fn;
			return Y.substitute(template , extras || {}, Y.bind(function (key, suggested, arg) {
				if (arg) {
					fn = this._templateHandlers[key.toLowerCase()];
					if (fn) {
						return fn.call(this, arg);
					}
				}
				return suggested;
			}, this),true);
		},
		/**
		 * Locates the nodes with the CSS classNames listed in the <a href="#property__classNames"><code>this._classNames</code></a> property, 
		 * or those specifically requested in its arguments and stores references to them
		 * in properties named after each className key, prefixed with an underscore
		 * and followed by <code>"Node"</code>.
		 * @method _locateNodes
		 * @param arg1,.... {String} (optional) If given, list of className heys of the nodes to be located.
		 *        If missing, all the classNames stored in <a href="#property__classNames"><code>this._classNames</code></a> will be located.
		 * @protected
		 */
		_locateNodes: function () {
			var bbx = this.get(BBX), el;
			if (arguments.length) {
				Y.each(arguments, function( name) {
					el = bbx.one(DOT + this._classNames[name]);
					if (el) {
						this['_' +  name + NODE] = el;
					}
				}, this);
			} else {
				Y.each(this._classNames, function(selector, name) {
					el = bbx.one(DOT + selector);
					if (el) {
						this['_' +  name + NODE] = el;
					}
				}, this);
			}
		},
		/**
		 * Looks for static properties called <a href="#property__CLASS_NAMES"><code>_CLASS_NAMES</code></a> in each of the classes of the inheritance chain
		 * and generates CSS classNames based on the <code>_cssPrefix</code> of each class and each of the suffixes listed in each them.
		 * The classNames generated will be stored in <a href="#property__classNames"><code>this._classNames</code></a> indexed by the suffix.
		 * It will also store the classNames of the boundingBox ( . )and the contentBox ( content ).  
		 * If the WidgetStdMod is used, it will also add the classNames for the three sections ( HEADER, BODY, FOOTER )
		 * @method _makeClassNames
		 * @private
		 */
		_makeClassNames: function () {
			var YCM = Y.ClassNameManager.getClassName,
				defined = {},
				cns = this._classNames = {};
			Y.each(this._getClasses(), function (c) {
				if (c._CLASS_NAMES) {
					Y.each(c._CLASS_NAMES, function(name) {
						if (defined[name]) {
							Y.log(Y.substitute('ClassName' + DUPLICATE, {name:name, recentDef: defined[name], prevDef: c.NAME}), 'warn', 'MakeNode');
						} else {
							cns[name] = YCM(c.NAME.toLowerCase(), name);
							defined[name] = c.NAME;
						}
					});
				}
			});
			
			cns.content = (cns[DOT] = YCM(this.constructor.NAME.toLowerCase())) + '-content';
			if (this.getStdModNode) {
				cns.HEADER = 'yui3-widget-hd';
				cns.BODY = 'yui3-widget-bd';
				cns.FOOTER = 'yui3-widget-ft';
			}
		},
		/**
		 * Concatenates the entries of the <a href="#property__ATTRS_2_UI"><code>_ATTRS_2_UI</code></a> static property of each class in the inheritance chain
		 * into this instance _UI_ATTRS property for the benefit or Widget.  See Widget._UI_ATTRS
		 * @method _concatUIAttrs
		 * @private
		 */
		_concatUIAttrs: function () {
			var defined, u, U = {};
			Y.each(['BIND','SYNC'], function (which) {
				defined = {};
				Y.each(this._UI_ATTRS[which], function (name) {
					defined[name] = 'Widget';
				});
				Y.each(this._getClasses(), function (c) {
					u = c._ATTRS_2_UI;
					if (u) {
						Y.each(Y.Array(u[which]), function (name) {
							if (defined[name]) {
								Y.log(Y.substitute('UI ' + which + ' Attribute' + DUPLICATE, {name:name, recentDef: defined[name], prevDef: c.NAME}), 'warn', 'MakeNode');
							} else {
								defined[name] = c.NAME;
							}
						});
					}
				});
				U[which]= Y.Object.keys(defined);
			},this);
			this._UI_ATTRS = U;
		},
		/**
		 * Attaches the events listed in the <a href="#property__EVENTS"><code>_EVENTS</code></a> static property of each class in the inheritance chain.
		 * @method _attachEvents
		 * @private
		 */
		_attachEvents: function () {
			/*jslint confusion: true */
			var bbx = this.get(BBX),
				selector,
				self = this,
				eh = [];
				
			Y.each(this._getClasses(), function (c) {
				Y.each (c._EVENTS || {}, function (handlers, key) {
					selector = {
						DOT:bbx, 
						'..':bbx.get('ownerDocument'), 
						THIS:self,
						Y:Y
					}[key] || DOT + this._classNames[key];
					Y.each(handlers, function (handler, type) {
						if (Lang.isString(handler)) {
							handler = {fn:handler};
						} 
						if (Lang.isObject(handler) && handler.hasOwnProperty('fn')) {
							if (Lang.isString(selector)) {
								if (type==='key') {
									eh.push(bbx.delegate(type, self[handler.fn], handler.args, selector, self));
								} else {
									eh.push(bbx.delegate(type, self[handler.fn], selector, self, handler.args));
								}
							} else {
								if (selector === self || selector === Y) {
									eh.push(selector.after(type, self[handler.fn], self, handler.args));
								} else {
									if (type==='key') {
										eh.push(Y.after(type, self[handler.fn], selector, handler.args, self));
									} else {
										eh.push(Y.after(type, self[handler.fn], selector, self, handler.args));
									}
								}
							}
						}
							
					});
				}, this);
			}, this);
			this._eventHandles = eh;
		},
		
		/**
		 * Publishes the events listed in the _PUBLISH static property of each of the classes in the inheritance chain.
		 * If an event has been publishes, the properties set in the descendants will override those in the original publisher.
		 * @method _publishEvents
		 * @private
		 */
		_publishEvents: function () {
			var cs = this._getClasses(),
				l = cs.length,
				i,
				publisher = function (options, name) {
					var opts = {};
					Y.each(options || {}, function (value, opt) {
						opts[opt] =opt.substr(-2) === 'Fn'?this[value]:value;
					},this);
					this.publish(name,opts);
				};
			for (i = l -1;i >= 0;i--) {
				Y.each (cs[i]._PUBLISH || {}, publisher, this);
			}
		},
		/**
		 * Detaches all the events created by <a href="method__attachEvents"><code>_attachEvents</code></a>
		 * @method _detachEvents
		 * @private
		 */
		_detachEvents: function () {
			Y.each(this._eventHandles, function (handle) {
				handle.detach();
			});
		}

				
	};
	/**
	 * <b>**</b> This is a documentation entry only. 
	 * This property is not defined in this file, it should be defined by the developer. <b>**</b><br/><br/>
	 * Holds the default template to be used by <a href="#method__makeNode"><code>_makeNode</code></a> when none is explicitly provided.<br/>
	 * The string should contain HTML code with placeholders made of a set of curly braces
	 * enclosing an initial processing code and arguments.  
	 * Placeholders can be nested, any of the arguments in a placeholder can be another placeholder.<br/>
	 * The template may also contain regular placeholders as used by <code>Y.substitute</code>, 
	 * whose values will be extracted from the second argument to <a href="#method__makeNode"><code>_makeNode</code></a>.
	 * The processing codes are:
			 
		<ul>
			<li><code>{@ attributeName}</code> configuration attribute values</li>
			<li><code>{p propertyName}</code> instance property values</li>
			<li><code>{m methodName arg1 arg2 ....}</code> return value from instance method. 
			The <code>m</code> code should be followed by the
			method name and any number of arguments. The
			placeholder is replaced by the return value or the named method.</li>
			<li><code>{c classNameKey}</code> CSS className generated from the <a href="#property__CLASS_NAMES"><code>_CLASS_NAMES</code></a>
			static property </li>
			<li><code>{s key}</code> string from the <code>strings</code> attribute, using <code>key</code>	as the sub-attribute.</li>
			<li><code>{? arg1 arg2 arg3}</code> If arg1 evaluates to true it returns arg2 otherwise arg3. 
			Argument arg1 is usually a nested placeholder.</li>
			<li><code>{1 arg1 arg2 arg3}</code> If arg1 is 1 it returns arg2 otherwise arg3. Used to produce singular/plural text.
			Argument arg1 is usually a nested placeholder.</li>
			<li><code>{}</code> any other value will be	handled just like <code>Y.substitute</code> does. </li>
		</ul>
	 * For placeholders containing several arguments they must be separated by white spaces.  
	 * Strings must be enclosed in double quotes, no single quotes allowed.  
	 * The backslash is the escape character within strings.
	 * Numbers, null, true and false will be recognized and converted to their native values.
	 * Any argument can be a further placeholder, enclosed in its own set of curly braces.
	 * @property _TEMPLATE
	 * @type String
	 * @static
	 * @protected
	 */
	/**
	 * <b>**</b> This is a documentation entry only.
	 * This property is not defined in this file, it should be defined by the developer. <b>**</b><br/><br/>
	 * Holds an array of strings, each the suffix used to define a CSS className using the 
	 * _cssPrefix of each class.  The names listed here are used as the keys into
	 * <a href="#property__classNames"><code>this._classNames</code></a>, 
	 * as the argument to the <code>{c}</code> template placeholder 
	 * and as keys for the entries in the <a href="#property__EVENTS"><code>_EVENTS</code></a> property.  
	 * They are also used by <a href="#method__locateNodes"><code>_locateNodes</code></a> to create the private properties that hold
	 * references to the nodes created.
	 * @property _CLASS_NAMES
	 * @type [String]
	 * @static
	 * @protected
	 */

	/**
	 * <b>**</b> This is a documentation entry only.
	 * This property is not defined in this file, it should be defined by the developer. <b>**</b><br/><br/>
	 * Lists the attributes whose value should be reflected in the UI.  
	 * It contains an object with two properties, <code>BIND</code> and <code>SYNC</code>, each 
	 * containing the name of an attribute or an array of names of attributes.
	 * Those listed in <code>BIND</code> will have listeners attached to their change event
	 * so every such change is refreshed in the UI. 
	 * Those listed in <code>SYNC</code> will be refreshed when the UI is rendered.
	 * For each entry in either list there should be a method named using the <code>_uiSet</code> prefix, followed by
	 * the name of the attribute, with its first character in uppercase.
	 * This function will receive the value to be set and the source of the change.
	 * @property _ATTRS_2_UI
	 * @type Object
	 * @static
	 * @protected
	 */

	 
	/**
	 * <b>**</b> This is a documentation entry only.
	 * This property is not defined in this file, it should be defined by the developer. <b>**</b><br/><br/>
	 * Contains a hash of elements to attach event listeners to.  
	 * Each element is identified by the suffix of its generated className,
	 * as declared in the <a href="#property__CLASS_NAMES"><code>_CLASS_NAMES</code></a> property.  <br/>
	 * There are three further element identifiers,
	 * a <code>"."</code> identifies the boundingBox of the Widget, <code>"content"</code> its contextBox, and a <code>".."</code> identifies the document
	 * where the component is in.
	 * If the Y.WidgetStdMod extension is used the <code>"HEADER"</code>, <code>"BODY"</code> and <code>"FOOTER"</code> identifiers will also be available.<br/>
	 * Each entry is made of a further hash using the type of event to listen to (<code>"key"</code>, <code>"mousedown"</code>, etc)
	 * as the key to each handler.<br/>
	 * For each type of event, you can list either a string with the name of an instance method that will handle the event
	 * or an object with properties <code>fn</code> with a string with the name of the instance method and an <code>args</code> property with extra
	 * arguments for the listener, such as a key descriptor for <code>key</code> events
	 * @property _EVENTS
	 * @type Object
	 * @static
	 * @protected
	 */
	 
	/**
	 * <b>**</b> This is a documentation entry only.
	 * This property is not defined in this file, it should be defined by the developer. <b>**</b><br/><br/>
	 * Contains a hash of events to be published.  
	 * Each element has the name of the event as its key
	 * and the configuration object as its value.  
	 * If the event has already been published, the configuration of the event will be modified by the
	 * configuration set in the new definition.
	 * @property _PUBLISH
	 * @type Object
	 * @static
	 * @protected
	 */
	 
	 Y.MakeNode = MakeNode;
		
