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
	if (Y.version === '3.4.0') { (function () {
		// See: http://yuilibrary.com/projects/yui3/ticket/2531032
		var L = Y.Lang, DUMP = 'dump', SPACE = ' ', LBRACE = '{', RBRACE = '}',
			savedRegExp =  /(~-(\d+)-~)/g, lBraceRegExp = /\{LBRACE\}/g, rBraceRegExp = /\{RBRACE\}/g;
		
		Y.substitute = function(s, o, f, recurse) {
			var i, j, k, key, v, meta, saved = [], token, dump,
				lidx = s.length;

			for (;;) {
				i = s.lastIndexOf(LBRACE, lidx);
				if (i < 0) {
					break;
				}
				j = s.indexOf(RBRACE, i);
				if (i + 1 >= j) {
					break;
				}

				//Extract key and meta info
				token = s.substring(i + 1, j);
				key = token;
				meta = null;
				k = key.indexOf(SPACE);
				if (k > -1) {
					meta = key.substring(k + 1);
					key = key.substring(0, k);
				}

				// lookup the value
				v = o[key];

				// if a substitution function was provided, execute it
				if (f) {
					v = f(key, v, meta);
				}

				if (L.isObject(v)) {
					if (!Y.dump) {
						v = v.toString();
					} else {
						if (L.isArray(v)) {
							v = Y.dump(v, parseInt(meta, 10));
						} else {
							meta = meta || '';

							// look for the keyword 'dump', if found force obj dump
							dump = meta.indexOf(DUMP);
							if (dump > -1) {
								meta = meta.substring(4);
							}

							// use the toString if it is not the Object toString
							// and the 'dump' meta info was not found
							if (v.toString === Object.prototype.toString ||
								dump > -1) {
								v = Y.dump(v, parseInt(meta, 10));
							} else {
								v = v.toString();
							}
						}
					}
				} else if (L.isUndefined(v)) {
					// This {block} has no replace string. Save it for later.
					v = '~-' + saved.length + '-~';
					saved.push(token);

					// break;
				}

				s = s.substring(0, i) + v + s.substring(j + 1);

				if (!recurse) {
					lidx = i - 1;
				}

			}
			// restore saved {block}s and replace escaped braces

			return s
				.replace(savedRegExp, function (str, p1, p2) {
					return LBRACE + saved[parseInt(p2,10)] + RBRACE;
				})
				.replace(lBraceRegExp, LBRACE)
				.replace(rBraceRegExp, RBRACE)
			;

		};
	})();}	
	var WS = /\s+/,
		NODE = 'Node',
		DOT = '.',
		BBX = 'boundingBox',
		Lang = Y.Lang,
		DUPLICATE = ' for "{name}" defined in class {recentDef} also defined in class {prevDef}',
		parsingRegExp = /^(?:([ \t]+)|("[^"\\]*(?:\\.[^"\\]*)*")|(true)|(false)|(null)|([\-+]?[0-9]*(?:\.[0-9]+)?))/, 
		quotesRegExp = /\\"/g,
				
		/** 
		 * Creates CSS classNames from suffixes listed in <a href="#property__CLASS_NAMES"><code>_CLASS_NAMES</code></a>, 
		 * stores them in <a href="#property__classNames"><code>this._classNames</code></a>.
		 * Concatenates <a href="#property__ATTRS_2_UI"><code>_ATTRS_2_UI</code></a> into <code>_UI_ATTRS</code>.
		 * Sets listeners to render and destroy events to attach/detach UI events
		 * @constructor
		 */
		MakeNode = function () {
			var self = this;
			self._eventHandles = [];
			self._makeClassNames();
			self._concatUIAttrs();
			self._publishEvents();
			self.after('render', self._attachEvents, self);
			self.after('destroy', self._detachEvents, self);
		};
	MakeNode.prototype = {
		/** 
		 * An array of event handles returned when attaching listeners to events,
		 * meant to detach them all when destroying the instance.
		 * @property _eventHandles
		 * @type Array
		 * @private
		 */	
		_eventHandles:null,
		/**
		 * Contains a hash of CSS classNames generated from the entries in <a href="#property__CLASS_NAMES"><code>_CLASS_NAMES</code></a>
		 * indexed by those same values.
		 * It will also have the following entries added automatically: <ul>
		 * <li><code>boundingBox</code> The className for the boundingBox</li>
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
		 * and the extra, second argument passed on to _makeNode (or _substitute)
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
			's': function (arg, extras) {
				return this._substitute(this.get('strings')[arg], extras);
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
			var args = [],
				matcher = function (match, i) {
					if (match !== undefined && i) {
						switch (i) {
							case 1:
								break;
							case 2:
								args.push(match.substr(1, match.length - 2).replace(quotesRegExp,'"'));
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
				
				Y.some(parsingRegExp.exec(arg), matcher);
			}
			return args;
		},
		/**
		 * Enumerates all the values and keys of a given static properties for all classes in the hierarchy, 
		 * starting with the oldest ancestor (Base).
		 * @method _forAllXinClasses
		 * @param x {String} name of the static property to be enumerated
		 * @param fn {function} function to be called for each value.  
		 * The function will receive a reference to the class where it occurs, the value of the property 
		 * and the key or index.
		 * @private
		 */
		
		_forAllXinClasses: function(x, fn) {
			var self = this,
				cs = this._getClasses(),
				l = cs.length,
				i, c,
				caller = function (v, k) {
					fn.call(self, c, v, k);
				};
			for (i = l -1;i >= 0;i--) {
				c = cs[i];
				if (c[x]) {
					Y.each(c[x], caller);
				}
			}
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
		 * @param template {String} Template to process.  
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
						return fn.call(this, arg, extras);
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
		 * If the className key contains a hyphen followed by a lowercase letter, the hyphen will be dropped and the letter capitalized.
		 * Any other characters invalid for identifiers will be turned into underscores, 
		 * thus for the <code>no-label-1</code> className key a <code>_noLabel_1Node</code> property will be created.
		 * @method _locateNodes
		 * @param arg1,.... {String} (optional) If given, list of className keys of the nodes to be located.
		 *        If missing, all the classNames stored in <a href="#property__classNames"><code>this._classNames</code></a> will be located.
		 * @protected
		 */
		_locateNodes: function () {
			var bbx = this.get(BBX), 
				self = this,
				makeName = function (el, name) {
					if (el) {
						self['_' + name.replace(/\-([a-z])/g,function (str, p1, p2) {
							return p1.toUpperCase();
						}).replace(/\W/g,'_') + NODE] = el;
					}
				};
			if (arguments.length) {
				Y.each(arguments, function (name) {
					makeName(bbx.one(DOT + self._classNames[name]),name);
				});
			} else {
				Y.each(self._classNames, function(selector, name) {
					makeName(bbx.one(DOT + selector), name);
				});
			}
		},
		/**
		 * Looks for static properties called <a href="#property__CLASS_NAMES"><code>_CLASS_NAMES</code></a> in each of the classes of the inheritance chain
		 * and generates CSS classNames based on the <code>_cssPrefix</code> of each class and each of the suffixes listed in each them.
		 * The classNames generated will be stored in <a href="#property__classNames"><code>this._classNames</code></a> indexed by the suffix.
		 * It will also store the classNames of the boundingBox ( boundingBox )and the contentBox ( content ).  
		 * If the WidgetStdMod is used, it will also add the classNames for the three sections ( HEADER, BODY, FOOTER )
		 * @method _makeClassNames
		 * @private
		 */
		_makeClassNames: function () {
			var YCM = Y.ClassNameManager.getClassName,
				defined = {},
				cns = this._classNames = {};
				
			this._forAllXinClasses('_CLASS_NAMES', function(c, name) {
				if (defined[name]) {
					Y.log(Y.substitute('ClassName' + DUPLICATE, {name:name, recentDef: defined[name], prevDef: c.NAME}), 'warn', 'MakeNode');
				} else {
					cns[name] = YCM(c.NAME.toLowerCase(), name);
					defined[name] = c.NAME;
				}
			});
			
			cns.content = (cns[BBX] = YCM(this.constructor.NAME.toLowerCase())) + '-content';
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
			var self = this,
				bbx = self.get(BBX),
				selector,				
				eh = [],
				type, fn, args,
				toInitialCap = function (name) {
					return name.charAt(0).toUpperCase() + name.substr(1);
				},
				equivalents = {
					boundingBox:bbx, 
					document:bbx.get('ownerDocument'), 
					THIS:self,
					Y:Y
				};
			self._forAllXinClasses('_EVENTS', function (c, handlers, key) {
				selector = equivalents[key] || DOT + self._classNames[key];
				if (key === 'THIS') {key = 'This';}
				Y.each(Y.Array(handlers), function (handler) {
					fn = null;
					if (Lang.isString(handler)) {
						type = handler;
						args = null;
					} else if (Lang.isObject(handler)) {
						type = handler.type;
						fn = handler.fn;
						args = handler.args;
					} else {
						Y.log('Bad event handler for class: ' + c.NAME + ' key: ' + key,'error','MakeNode');
					}
					if (type) {
						fn = fn || '_after' + toInitialCap(key) + toInitialCap(type);
						if (!self[fn]) {
							Y.log('Listener method not found: ' + fn,'error','MakeNode');
						} else {
							fn = self[fn];
						}
						if (Lang.isString(selector)) {
							// All the classNames are processed here:
							if (type==='key') {
								eh.push(bbx.delegate(type, fn, args, selector, self));
							} else {
								eh.push(bbx.delegate(type, fn, selector, self, args));
							}
						} else {
							if (selector === self || selector === Y) {
								// the Y and THIS selectors here
								eh.push(selector.after(type, fn, self, args));
							} else {
								// The document and boundingBox here
								if (type==='key') {
									eh.push(Y.after(type, fn, selector, args, self));
								} else {
									eh.push(Y.after(type, fn, selector, self, args));
								}
							}
						}
					} else {
						Y.log('No type found in: ' + c.NAME + ', key: ' + key, 'error', 'MakeNode');
					}
				});
			});
			this._eventHandles = this._eventHandles.concat(eh);
		},
		
		/**
		 * Publishes the events listed in the _PUBLISH static property of each of the classes in the inheritance chain.
		 * If an event has been publishes, the properties set in the descendants will override those in the original publisher.
		 * @method _publishEvents
		 * @private
		 */
		_publishEvents: function () {
			this._forAllXinClasses('_PUBLISH', function (c, options, name) {
				var opts = {};
				Y.each(options || {}, function (value, opt) {
					opts[opt] = opt.substr(opt.length - 2) === 'Fn'?this[value]:value;
				},this);
				this.publish(name,opts);
			});
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
	 * This property is not defined in this file, it can be defined by the developer. <b>**</b><br/><br/>
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
	 * This property is not defined in this file, it can be defined by the developer. <b>**</b><br/><br/>
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
	 * This property is not defined in this file, it can be defined by the developer. <b>**</b><br/><br/>
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
	 * This property is not defined in this file, it can be defined by the developer. <b>**</b><br/><br/>
	 * Contains a hash of elements to attach event listeners to.  
	 * Each element is identified by the suffix of its generated className,
	 * as declared in the <a href="#property__CLASS_NAMES"><code>_CLASS_NAMES</code></a> property.  <br/>
	 * There are seveal virtual element identifiers,<ul>
	 * <li><code>"boundingBox"</code> identifies the boundingBox of the Widget</li>
	 * <li><code>"content"</code> its contextBox</li>
	 * <li><code>"document"</code> identifies the document where the component is in</li>
	 * <li><code>"THIS"</code> identifies this instance</li>
	 * <li><code>"Y"</code> identifies the YUI instance of the sandbox</li>
	 * </ul>
	 * If the Y.WidgetStdMod extension is used the <code>"HEADER"</code>, <code>"BODY"</code> 
	 * and <code>"FOOTER"</code> identifiers will also be available.<br/>
	 * Each entry contains a type of event to be listened to or an array of events.
	 * Each event can be described by its type (i.e.: <code>"key"</code>, <code>"mousedown"</code>, etc).
	 * MakeNode will associate this event with a method named <code>"_after"</code> followed by the element identifier with the first character capitalized 
	 * and the type of event with the first character capitalized (i.e.: <code>_afterBoundingBoxClick</code>, <code>_afterInputBlur</code>, <code>_afterThisValueChange</code>, etc.)
	 * Alternatively, the event listener can be described by an object literal containing properties <ul>
	 * <li><code>type</code> (mandatory) the type of event being listened to</li>
	 * <li><code>fn</code> the name of the method to handle the event.  
	 * Since _EVENTS is static, it has no access to <code>this</code> so the name of the method must be specified</li>
	 * <li><code>args</code> extra arguments to be passed to the listener, useful, 
	 * for example as a key descriptor for <code>key</code> events.
	 * <pre>_EVENTS: {
 &nbsp; &nbsp; boundingBox: [
 &nbsp; &nbsp;  &nbsp; &nbsp; {
 &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp; type: 'key',
 &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp; fn:'_onDirectionKey',   // calls this._onDirectionKey
 &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp; args:((!Y.UA.opera) ? "down:" : "press:") + "38, 40, 33, 34"
 &nbsp; &nbsp;  &nbsp; &nbsp; },
 &nbsp; &nbsp;  &nbsp; &nbsp; 'mousedown' &nbsp; &nbsp;  &nbsp; &nbsp; // calls this._afterBoundingBoxMousedown
 &nbsp; &nbsp; ],
 &nbsp; &nbsp; document: 'mouseup', &nbsp; &nbsp; // calls this._afterDocumentMouseup
 &nbsp; &nbsp; input: 'change' &nbsp; &nbsp;  &nbsp; &nbsp; // calls this._afterInputChange
},</pre>
	 * @property _EVENTS
	 * @type Object
	 * @static
	 * @protected
	 */
	 
	/**
	 * <b>**</b> This is a documentation entry only.
	 * This property is not defined in this file, it can be defined by the developer. <b>**</b><br/><br/>
	 * Contains a hash of events to be published.  
	 * Each element has the name of the event as its key
	 * and the configuration object as its value.  
	 * If the event has already been published, the configuration of the event will be modified by the
	 * configuration set in the new definition.
	 * When setting functions use the name of the function, not a function reference.
	 * @property _PUBLISH
	 * @type Object
	 * @static
	 * @protected
	 */
	 
	 Y.MakeNode = MakeNode;
		
