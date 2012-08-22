if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/build/gallery-md-model/gallery-md-model.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/gallery-md-model/gallery-md-model.js",
    code: []
};
_yuitest_coverage["/build/gallery-md-model/gallery-md-model.js"].code=["YUI.add('gallery-md-model', function(Y) {","","/**","Record-based data model with APIs for getting, setting, validating, and","syncing attribute values, as well as events for being notified of model changes."," ","@module gallery-md-model","**/"," ","/**","Record-based data model with APIs for getting, setting, validating, and","syncing attribute values, as well as events for being notified of model changes."," ","In most cases, you'll want to create your own subclass of Y.GalleryModel and","customize it to meet your needs. In particular, the sync() and validate()","methods are meant to be overridden by custom implementations. You may also want","to override the parse() method to parse non-generic server responses."," ","@class Y.GalleryModel","@constructor","@param [cfg] {Object} Initial configuration attribute plus:","@param [cfg.values] {Object}  Sets initial values for the model.  ","	Model will be marked as new and not modified (as if just loaded).","@extends Base","**/","	\"use strict\";","	","	var Lang = Y.Lang,","		YArray = Y.Array,","		YObject = Y.Object,","		EVT_CHANGE = 'change',","		EVT_LOADED = 'loaded',","		EVT_ERROR = 'error',","		EVT_SAVED = 'saved',","		EVT_RESET = 'reset',","		IS_MODIFIED = 'isModified',","		IS_NEW = 'isNew',","		DOT = '.',","		CHANGE = 'Change',","		ADD = 'add',","		UNDO = 'undo';","	","","	Y.GalleryModel = Y.Base.create(","		'gallery-md-model',","		Y.Base, ","		[],","		{","			/**","			 * Hash of values indexed by field name","			 * @property _values","			 * @type Object","			 * @private","			 */","			_values: null,","			/**","			 * Hash of values as loaded from the remote source, ","			 * presumed to be the current value there.","			 * @property _loadedValues","			 * @type Object","			 * @private","			 */","			_loadedValues: null,","			/**","			 * Array of field names that make up the primary key for this record","			 * @property _primaryKeys","			 * @type Array","			 * @private","			 */","			_primaryKeys: null,","			/*","			 * Y.Base lifecycle method","			 */","			initializer: function  (cfg) {","				this._values = {};","				this._loadedValues = {};","				/**","				 * Fired whenever a data value is changed.","				 * @event change","				 * @param {String} ev.name Name of the field changed","				 * @param {Any} ev.newVal New value of the field.","				 * @param {Any} ev.prevVal Previous value of the field.","				 * @param {String|null} ev.src Source of the change event, if any.","				 */","				this.publish(EVT_CHANGE, {","					defaultFn: this._defSetValue","				});","				/**","				 * Fired when new data has been received from the remote source.  ","				 * It will be fired even on a save operation if the response contains values.","				 * The parsed values can be altered on the before (on) listener.","				 * @event loaded","				 * @param {Object} ev.response Response data as received from the remote source","				 * @param {Object} ev.parsed Data as returned from the parse method.","				 */","				this.publish(EVT_LOADED, {","					defaultFn:this._defDataLoaded","				});","				/**","				 * Fired when the data has been saved to the remote source","				 * The event cannot be prevented.","				 * @event saved","				 */","				this.publish(EVT_SAVED, {","					preventable: false","				});","				cfg = cfg || {};","				if (Lang.isObject(cfg.values)) {","					this.setValues(cfg.values, 'init');","					this._set(IS_MODIFIED, false);","					this._set(IS_NEW, true);","					this._loadedValues = Y.clone(this._values);","				}","			},","			/**","			 * Destroys this model instance and removes it from its containing lists, if","			 * any.","","			 * If there are any arguments then this method also delegates to the","			 * sync() method to delete the model from the persistence layer, which is an","			 * asynchronous action and thus requires at least a callback","			 * otherwise, it returns immediately.","","			 * @method destroy","			 * @param [options] {Object} Options passed on to the sync method, if required.","			 * @param [callback] {function} function to be called when the sync operation finishes.","			 *		@param callback.err {string|null} Error message, if any or null.","			 *		@param callback.response {Any} The server response as received by sync(),","			 * @chainable","			 */","			destroy: function (options, callback) {","				if (Lang.isFunction(options)) {","					callback = options;","					options = {};","				} else if (!options) {","					options = {};","				}","				var self = this,","					finish = function (err) {","						if (!err) {","							YArray.each(self.lists.concat(), function (list) {","								list.remove(self, options);","							});","","							Y.GalleryModel.superclass.destroy.call(self);","						}","","						if (Lang.isFunction(callback)) {","							callback.apply(null, arguments);","						}","					};","","				if (callback || options) {","					this.sync('delete', options, finish);","				} else {","					finish();","				}","","				return this;","			},","			/**","			 * Returns the value of the field named","			 * @method getValue","			 * @param name {string}  Name of the field to return.","			 * @return {Any} the value of the field requested.  ","			 */ ","			getValue: function (name) {","				return this._values[name];","			},","			/**","			 * Returns a hash with all values using the field names as keys.","			 * @method getValues","			 * @return {Object} a hash with all the fields with the field names as keys.","			 */ ","			getValues: function() {","				return Y.clone(this._values);","			},","			/**","			 * Sets the value of the named field. ","			 * Fires the change event if the value is different from the current one.","			 * Primary key fields cannot be changed unless still undefined.","			 * @method setValue","			 * @param name {string} Name of the field to be set","			 * @param value {Any} Value to be assigned to the field","			 * @param [src] {Any} Source of the change in the value.","			 */","			setValue: function (name, value, src) {","				var prevVal = this._values[name];","				if (prevVal !== value && (this._primaryKeys.indexOf(name) === -1 || Lang.isUndefined(prevVal))) {","					this.fire(EVT_CHANGE, {","						name:name,","						newVal:value,","						prevVal:prevVal,","						src: src","					});","				}","			},","			/**","			 * Default function for the change event, sets the value and marks the model as modified.","			 * @method _defSetValue","			 * @param ev {EventFacade} (see change event)","			 * @private","			 */","			_defSetValue: function (ev) {","				var self = this;","				if (ev.name) {","					self._values[ev.name] = ev.newVal;","					self._set(IS_MODIFIED, true);","				} else {","					YObject.each(ev.newVals, function (value, name) {","						self.setValue(name, value, ev.src);","					});","				}","			},","			/**","			 * Sets a series of values.   It simply loops over the hash of values provided calling setValue on each.","			 * @method setValues","			 * @param values {Object} hash of values to change","			 * @param [src] {Any} Source of the changes","			 */","			setValues: function (values, src) {","				var self = this,","					prevVals = {};","					","				YObject.each(values, function (value, name) {","					prevVals[name] = self.getValue(name);","				});","				this.fire(EVT_CHANGE, {","					newVals:values,","					prevVals:prevVals,","					src: src","				});","			},","			/**","			 * Returns a hash indexed by field name, of all the values in the model that have changed since the last time","			 * they were synchornized with the remote source.   Each entry has a prevVal and newVal entry.","			 * @method getChangedValues","			 * @return {Object} Has of all entries changed since last synched, each entry has a newVal and prevVal property contaning original and changed values.","			 */","			getChangedValues: function() {","				var changed = {}, ","					prev, ","					loaded = this._loadedValues;","","				YObject.each(this._values, function (value, name) {","					prev = loaded[name];","					if (prev !== value) {","						changed[name] = {prevVal:prev, newVal: value};","					}","				});","				return changed;","			},","			/**","			 * Returns a hash with the values of the primary key fields, indexed by their field names","			 * @method getPKValues","			 * @return {Object} Hash with the primary key values, indexed by their field names","			 */","			getPKValues: function () {","				var pkValues = {},","					self = this;","				YArray.each(self._primaryKeys, function (name) {","					pkValues[name] = self._values[name];","				});","				return pkValues;","			},","			/**","				Returns an HTML-escaped version of the value of the specified string","				attribute. The value is escaped using Y.Escape.html().","","				@method getAsHTML","				@param {String} name Attribute name or object property path.","				@return {String} HTML-escaped attribute value.","			**/","			getAsHTML: function (name) {","				var value = this.getValue(name);","				return Y.Escape.html(Lang.isValue(value) ? String(value) : '');","			},","","			/**","			 * Returns a URL-encoded version of the value of the specified field,","			 * or a full URL with name=value sets for all fields if no name is given.","			 * The names and values are encoded using the native encodeURIComponent()","			 * function.","","			 * @method getAsURL","			 * @param [name] {String}  Field name.","			 * @return {String} URL-encoded field value if name is given or URL encoded set of name=value pairs for all fields.","			 */","			getAsURL: function (name) {","				var value = this.getValue(name),","					url = [];","				if (name) {","					return encodeURIComponent(Lang.isValue(value) ? String(value) : '');","				} ","				YObject.each(value, function (value, name) {","					if (Lang.isValue(value)) {","						url.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));","					}","				});","				return url.join('&');","			},","","			/**","			 * Default function for the loaded event. Does the actual setting of the values just loaded.","			 * @method _defDataLoaded","			 * @param ev {EventFacade} see loaded event","			 * @private","			 */","			_defDataLoaded: function (ev) {","				var self = this;","				self.setValues(ev.parsed, ev.src);","				self._set(IS_MODIFIED, false);","				self._set(IS_NEW, false);","				self._loadedValues = Y.clone(self._values);","			},","			/**","				Loads this model from the server.","","				This method delegates to the sync() method to perform the actual load","				operation, which is an asynchronous action. Specify a _callback_ function to","				be notified of success or failure.","","				A successful load operation will fire a loaded event, while an unsuccessful","				load operation will fire an error event with the src value \"load\".","","				@method load","				@param [options] {Object} Options to be passed to sync().","					Usually these will be or will include the keys used by the remote source ","					to locate the data to be loaded.","					They will be passed on unmodified to the sync method.","					It is up to sync to determine what they mean.","				@param [callback] {callback}  Called when the sync operation finishes. Callback will receive:","					@param callback.err {string|null} Error message, if any or null.","					@param callback.response {Any} The server response as received by sync(),","				@chainable","			**/","			load: function (options, callback) {","				var self = this;","","				if (Lang.isFunction(options)) {","					callback = options;","					options = {};","				} else if (!options) {","					options = {};","				}","","				self.sync('read', options, function (err, response) {","					var facade = {","							options : options,","							response: response,","							src: 'load'","						};","","					if (err) {","						facade.error = err;","","						self.fire(EVT_ERROR, facade);","					} else {","						self._values = {};","","						facade.parsed = self.parse(response);","						self.fire(EVT_LOADED, facade);","					}","","					if (Lang.isFunction(callback)) {","						callback.apply(null, arguments);","					}","				});","","				return self;","			},","","			/**","				Called to parse the _response_ when a response is received from the server.","				This method receives a server _response_ and is expected to return a","				value hash.","","				The default implementation assumes that _response_ is either an attribute","				hash or a JSON string that can be parsed into an attribute hash. If","				_response_ is a JSON string and either Y.JSON or the native JSON object","				are available, it will be parsed automatically. If a parse error occurs, an","				error event will be fired and the model will not be updated.","","				You may override this method to implement custom parsing logic if necessary.","","				@method parse","				@param {Any} response Server response.","				@return {Object} Values hash.","			**/","			parse: function (response) {","				if (typeof response === 'string') {","					try {","						return Y.JSON.parse(response);","					} catch (ex) {","						this.fire(EVT_ERROR, {","							error : ex,","							response: response,","							src : 'parse'","						});","","						return null;","					}","				}","","				return response;","			},","","","","			/**","				Saves this model to the server.","","				This method delegates to the sync() method to perform the actual save","				operation, which is an asynchronous action. Specify a _callback_ function to","				be notified of success or failure.","","				A successful save operation will fire a saved event, while an unsuccessful","				load operation will fire an error event with the src value \"save\".","","				If the save operation succeeds and the parse method returns non-empty values","				within the response	a loaded event will also be fired to read those values.","","				@method save","				@param {Object} [options] Options to be passed to sync() and to set()","					when setting synced attributes. It's up to the custom sync implementation","					to determine what options it supports or requires, if any.","				@param {Function} [callback] Called when the sync operation finishes.","					@param callback.err {string|null} Error message, if any or null.","					@param callback.response {Any} The server response as received by sync(),","				@chainable","			**/","			save: function (options, callback) {","				var self = this;","","				if (Lang.isFunction(options)) {","					callback = options;","					options = {};","				} else if (!options) {","					options = {};","				}","","				self._validate(self.getValues(), function (err) {","					if (err) {","						if (Lang.isFunction(callback)) {","							callback.call(null, err);","						}","						return;","					}","","					self.sync(self.get(IS_NEW) ? 'create' : 'update', options, function (err, response) {","						var facade = {","								options : options,","								response: response,","								src: 'save'","							};","","						if (err) {","							facade.error = err;","","							self.fire(EVT_ERROR, facade);","						} else {","							facade.parsed = self.parse(response);","","							self._set(IS_MODIFIED, false);","							self._set(IS_NEW, false);","							self._loadedValues = Y.clone(self._values);","							self.fire(EVT_SAVED, facade);","							if (facade.parsed) {","								self.fire(EVT_LOADED, facade);","							}","						}","","						if (Lang.isFunction(callback)) {","							callback.apply(null, arguments);","						}","					});","				});","","				return self;","			},","			/**","			 * Restores the values when last loaded, saved or created.","			 * @method reset","			 */","			reset: function() {","				this._values = Y.clone(this._loadedValues);","				this.fire(EVT_RESET);","				return this;","			},","			/**","				Override this method to provide a custom persistence implementation for this","				model. The default just calls the callback without actually doing anything.","","				This method is called internally by load(), save(), and destroy().","","				@method sync","				@param {String} action Sync action to perform. May be one of the following:","","					* create: Store a newly-created model for the first time.","					* read  : Load an existing model.","					* update: Update an existing model.","					* delete: Delete an existing model.","","				@param {Object} [options] Sync options. It's up to the custom sync","					implementation to determine what options it supports or requires, if any.","				@param {Function} [callback] Called when the sync operation finishes.","					@param {Error|null} callback.err If an error occurred, this parameter will","						contain the error. If the sync operation succeeded, _err_ will be","						falsy.","					@param {Any} [callback.response] The server's response. This value will","						be passed to the parse() method, which is expected to parse it and","						return an attribute hash.","			**/","			sync: function (action, options, callback) {","","				if (Lang.isFunction(callback)) {","					callback();","				}","			},","			/**","				Override this method to provide custom validation logic for this model.","","				While attribute-specific validators can be used to validate individual","				attributes, this method gives you a hook to validate a hash of all","				attributes before the model is saved. This method is called automatically","				before save() takes any action. If validation fails, the save() call","				will be aborted.","","				In your validation method, call the provided callback function with no","				arguments to indicate success. To indicate failure, pass a single argument,","				which may contain an error message, an array of error messages, or any other","				value. This value will be passed along to the error event.","","				@example","","				model.validate = function (attrs, callback) {","				if (attrs.pie !== true) {","				// No pie?! Invalid!","				callback('Must provide pie.');","				return;","				}","","				// Success!","				callback();","				};","","				@method validate","				@param {Object} attrs Attribute hash containing all model attributes to","				be validated.","				@param {Function} callback Validation callback. Call this function when your","				validation logic finishes. To trigger a validation failure, pass any","				value as the first argument to the callback (ideally a meaningful","				validation error of some kind).","","				@param {Any} [callback.err] Validation error. Don't provide this","				argument if validation succeeds. If validation fails, set this to an","				error message or some other meaningful value. It will be passed","				along to the resulting error event.","			**/","			validate: function (attrs, callback) {","				if (Lang.isFunction(callback))  {","					callback();","				}","			},","			/**","				Calls the public, overridable validate() method and fires an error event","				if validation fails.","","				@method _validate","				@param {Object} attributes Attribute hash.","				@param {Function} callback Validation callback.","				@param {Any} [callback.err] Value on failure, non-value on success.","				@protected","			**/","			_validate: function (attributes, callback) {","				var self = this;","","				self.validate(attributes, function (err) {","					if (Lang.isValue(err)) {","						// Validation failed. Fire an error.","						self.fire(EVT_ERROR, {","							attributes: attributes,","							error : err,","							src : 'validate'","						});","","						callback(err);","						return;","					}","","					callback();","				});","","			},","			/**","				Returns a copy of this model's attributes that can be passed to","				Y.JSON.stringify() or used for other nefarious purposes.","","				The clientId attribute is not included in the returned object.","","				If you've specified a custom attribute name in the idAttribute property,","				the default id attribute will not be included in the returned object.","","				@method toJSON","				@return {Object} Copy of this model's attributes.","			**/","			toJSON: function () {","				return this.getValue();","			},","			_isModifiedGetter: function (value, name) {","				name = name.split(DOT);","				if (name.length > 1) {","					name = name[1];","					var ret = {};","					ret[name] = this._values[name] !== this._loadedValues[name];","					return ret;","				}","				return value;","			},","			_isNewGetter: function (value, name) {","				name = name.split(DOT);","				if (name.length > 1) {","					name = name[1];","					var ret = {};","					ret[name] = !this._loadedValues.hasOwnProperty(name);","					return ret;","				}","				return value;","			},","			_primaryKeysSetter: function (value) {","				if (this._primaryKeys && this._primaryKeys.length) {","					return Y.Attribute.INVALID_VALUE;","				}","				value = new YArray(value);","				this._primaryKeys = value;","				return value;","			},","			_primaryKeysGetter: function (value, name) {","				name = name.split(DOT);","				if (name.length > 1) {","					name = name[1];","					var ret = {};","					ret[name] = value.indexOf(name) !== -1;","					return ret;","				}","				return (value || []).concat();  // makes sure to return a copy, not the original.","			}","		},","		{","			ATTRS: {","				/**","				 * Indicates whether any of the fields has been changed since created or loaded.","				 * Field names can be given as sub-attributes to indicate if any particular field has beeen changed.","				 * model.get('isModified.name') returns true if the field _name_ has been modified.","				 * <b>Note:</b> contrary to common practice in Attributes with sub-attributes, ","				 * requesting the state of the record does not","				 * return an object with the state of each individual field keyed by field name,","				 * but the state of the record as a whole, which is far more useful.","				 * @attribute isModified","				 * @type Boolean","				 * @readonly","				 * @default false","				 */","				isModified: {","					readOnly: true,","					value:false,","					validator:Lang.isBoolean,","					getter: '_isModifiedGetter'","				},","				/**","				 * Indicates that the model is new and has not been modified since creation.","				 * Field names can be given as sub-attributes to indicate if any particular field is new.","				 * model.get('isNew.name') returns true if the field _name_ is new.","				 * <b>Note:</b> contrary to common practice in Attributes with sub-attributes, ","				 * requesting the state of the record does not","				 * return an object with the state of each individual field keyed by field name,","				 * but the state of the record as a whole, which is far more useful.","				 * @attribute isNew","				 * @type Boolean","				 * @readonly","				 * @default true","				 */","				isNew: {","					readOnly: true,","					value:true,","					validator:Lang.isBoolean,","					getter: '_isNewGetter'","				},","				/**","				 * List of fields making the primary key of this model. ","				 * Primary Key fields cannot be modified once initially loaded.","				 * It can be set as an array of field names or, if the key is made of a single field, a string with the name of that field.","				 * It will always be returned as an array.","				 * Field names can be given as a sub-attribute to ask whether a particular field is a primary key, thus:","				 * model.get('primaryKeys.name') returns true of the field name is a primary key.","				 * It can only be set once.","				 * @attribute primaryKeys","				 * @writeonce","				 * @type array","				 * @default []","				 */","				primaryKeys: {","					setter:'_primaryKeysSetter',","					getter:'_primaryKeysGetter',","					lazyAdd: false,","					value: []","				}","			}","","		}","	);","		","	/**","	 * An extension for Y.GalleryModel that provides a single level of undo for each field.","	 * @class Y.GalleryModelSimpleUndo","	 */","	Y.GalleryModelSimpleUndo = function () {};","	","	Y.GalleryModelSimpleUndo.prototype = {","		initializer: function () {","			this._lastChange = {};","			if (this._addPreserve) {","				this._addPreserve('_lastChange');","			}","			this.after(EVT_CHANGE, this._trackChange);","			this.after([EVT_LOADED,EVT_SAVED,EVT_RESET], this._resetUndo);	","		},","		/**","		 * Event listener for the after value change event, it tracks changes for each field.  ","		 * It retains only the last change for each field.","		 * @method _trackChange","		 * @param ev {EventFacade} As provided by the change event","		 * @private","		 */","		_trackChange: function (ev) {","			if (ev.name && ev.src !== UNDO) {","				this._lastChange[ev.name] = ev.prevVal;","			}","		},","		/**","		 * After load or save operations, it drops any changes it might have tracked.","		 * @method _resetUndo","		 * @private","		 */","		_resetUndo: function () {","			this._lastChange = {};","		},","		/**","		 * Reverts one level of change for a specific field or all fields","		 * @method undo","		 * @param [name] {String} If provided it will undo that particular field,","		 *	otherwise, it undoes the whole record.","		 */","		undo: function (name) {","			var self = this;","			if (name) {","				if (self._lastChange[name] !== undefined) {		","					self.setValue(name, self._lastChange[name], UNDO);","					delete self._lastChange[name];","				}","			} else {","				self.setValues(this._lastChange, UNDO);","				self._lastChange = {};","			}","		}","	};","	","	/**","	 * Provides multiple levels of undo in strict chronological order ","	 * whatever the field was at each stage.","	 * Changes done on multiple fields via setValues","	 * will also be undone in one step.","	 * @class Y.GalleryModelChronologicalUndo","	 */","	Y.GalleryModelChronologicalUndo = function () {};","	","	Y.GalleryModelChronologicalUndo.prototype = {","		initializer: function () {","			this._changes = [];","			if (this._addPreserve) {","				this._addPreserve('_changes');","			}","			this.after(EVT_CHANGE, this._trackChange);","			this.after([EVT_LOADED,EVT_SAVED,EVT_RESET], this._resetUndo);","		},","		/**","		 * Event listener for the after value change event, it tracks changes for each field.  ","		 * It keeps a stack of each change.  ","		 * @method _trackChange","		 * @param ev {EventFacade} As provided by the change event","		 * @private","		 */","		_trackChange: function (ev) {","			if (ev.src !== UNDO) {","				this._changes.push(ev.details);","			}","		},","		/**","		 * After load or save operations, it drops any changes it might have tracked.","		 * @method _resetUndo","		 * @private","		 */","		_resetUndo: function () {","			this._changes = [];","		},","		/**","		 * Reverts one level of field changes.","		 * @method undo","		 */","		undo: function () {","			var ev = this._changes.pop();","			if (ev) {","				if (ev.name) {","					this.setValue(ev.name, ev.prevVal, UNDO);","				} else {","					this.setValues(ev.prevVals, UNDO);","				}","			}","			if (this._changes.length === 0) {","				this._set(IS_MODIFIED, false);","			}","		}","	};","	","	/**","	 * Allows GalleryModel to handle a set of records using the Flyweight pattern.","	 * It exposes one record at a time from a shelf of records.","	 * Exposed records can be selected by setting the _index_ attribute.","	 * @class Y.GalleryModelMultiRecord","	 */","	","	var INDEX = 'index',","		MR = function () {};","	","	MR.prototype = {","		/**","		 * Added this property to have ModelSync.REST getURL() return the proper URL.","		 * @property _isYUIModelList","		 * @type Boolean","		 * @value true","		 * @private","		 */","		_isYUIModelList: true,","		initializer: function () {","			this._shelves = [];","			this._currentIndex = 0;","			this._addPreserve('_values','_loadedValues','_isNew','_isModified');","		},","		/**","		 * Index of the shelf for the record being exposed.","		 * Use index attribute to check/set the index value.","		 * @property _currentIndex","		 * @type integer","		 * @default 0","		 * @private","		 */","		_currentIndex: 0,","		/**","		 * Storage for the records when not exposed.","		 * @property _shelves","		 * @type Array","		 * @private","		 */","		_shelves: null,","		/**","		 * Saves the exposed record into the shelves at the position given by _currentIndex","		 * @method _shelve","		 * @private","		 */","		_shelve: function(index) {","			if (index === undefined) {","				index = this._currentIndex;","			}","			var self = this,","				current = {};","			YArray.each(self._preserve, function (name) {","				current[name] = self[name];","			});","			self._shelves[index] = current;","			","		},","		/**","		 * Retrives and exposes the record from the shelf at the position given by _currentIndex","		 * @method _fetch","		 * @private","		 */","		_fetch: function (index) {","			if (index === undefined) {","				index = this._currentIndex;","			} else {","				this._currentIndex = index;","			}","			var self = this,","				current = self._shelves[index];","				","			if (Lang.isUndefined(current)) {","				this._initNew();","			} else {","				YArray.each(self._preserve, function (name) {","					self[name] = current[name];","				});","			}","			","		},","		/**","		 * Adds the names of properties that are to be preserved in the shelf when moving,","		 * and taken out of the shelf when fetching.","		 * @method _addPreserve","		 * @param {String} any number of names or array of names of properties to be preserved.","		 * @protected","		 */","		_addPreserve: function () {","			this._preserve = (this._preserve || []).concat(Array.prototype.slice.call(arguments));","		},","		","		/**","		 * Initializes an exposed record","		 * @method _initNew","		 * @private","		 */","		_initNew: function () {","			this._values = {};","			this._loadedValues = {};","			this._isNew = true;","			this._isModified = false;","		},","		/**","		 * Adds a new record at the index position given or at the end.","		 * The new record becomes the current.","		 * @method add","		 * @param values {Object} set of values to set","		 * @param [index] {Integer} position to add the values at or at the end if not provided.  ","		 */","		add: function(values, index) {","			if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {","				this._shelve();","			}","			index = index || this._shelves.length;","			this._shelves.splice(index, 0, {});","			this._currentIndex = index;","			this._initNew();","			this.setValues(values, ADD);","		},","		/**","		 * Executes the given function for each record in the set.","		 * Returning exactly false from the function spares shelving the record.","		 * If the callback function does not modify the record, ","		 * returning false will improve performance.","		 * @method each","		 * @param fn {function} function to execute, it will be provided with:","		 * @param fn.index {integer} index of the record exposed","		 */","		each: function(fn) {","			var self = this;","			self._shelve();","			YArray.each(self._shelves, function (shelf, index) {","				self._currentIndex = index;","				self._fetch(index);","				if (fn.call(self, index) !== false) {","					self._shelve(index);","				}","			});","		},","		/**","		 * Executes the given function for each record in the set.","		 * It is faster than using each and then checking for isModified","		 * Returning exactly false from the function spares shelving the record.","		 * If the callback function does not modify the record, ","		 * returning false will improve performance.","		 * @method eachModified","		 * @param fn {function} function to execute, it will be provided with:","		 * @param fn.index {integer} index of the record exposed","		 */","		eachModified:function(fn) {","			var self = this;","			self._shelve();","			YArray.each(self._shelves,  function (shelf, index) {","				if (self._shelves[index][IS_MODIFIED]) {","					self._currentIndex = index;","					self._fetch(index);","					if (fn.call(self, index) !== false) {","						self._shelve(index);","					}","				}","			});","		},","		/**","		 * Calls _save_ on each record modified.","		 * This is not the best saving strategy for saving batches of records,","		 * but it is the easiest and safest.  Implementors are encouraged to ","		 * design their own.","		 * @method saveAllModified","		 */","		saveAllModified: function () {","			this.eachModified(this.save);","		},","		/**","		 * This is a documentation entry only, this method does not define load. ","		 * This extension redefines the default action for the loaded event so ","		 * that if a load returns an array of records, they will be added to the shelves. ","		 * Existing records are kept, call empty if they should be discarded. ","		 * See method load of Y.GalleryModel for further info.","		 */ ","		/**","		 * Default action for the loaded event, checks if the parsed response is an array","		 * and saves it into the shelves, otherwise t calls the default loader for single records.","		 * @method _defDataLoaded","		 * @param ev {EventFacade} facade produced by load.","		 * @private","		 */","		_defDataLoaded: function (ev) {","			var self = this,","				shelves = self._shelves;","			if (Lang.isArray(ev.parsed)) {","				if (shelves.length && (self.get(IS_MODIFIED) || !self.get(IS_NEW))) {","					self._shelve();","				}","				YArray.each(ev.parsed, function (values) {","					shelves.push({","						_values: values,","						_loadedValues: Y.clone(values),","						isNew: false,","						isModified:false","					});","				});","				self._fetch();","				if (self._sort) {","					self._sort();","				}","			} else {","				Y.GalleryModel.prototype._defDataLoaded.apply(self, arguments);","			}","			","		},","		/**","		 * Returns the number of records stored, skipping over empty slots.","		 * @method size","		 * @return {Integer} number of records in the shelves","		 */","		size: function() {","			var count = 0;","			YArray.each(this._shelves, function () {","				count +=1;","			});","			return count;","		},","		/**","		 * Empties the shelves of any records as well as the exposed record","		 * @method empty","		 */","		empty: function () {","			this._shelves = [];","			this._currentIndex = 0;","			this.reset();","		},","		/**","		 * Setter for the _index_ attribute.","		 * Validates and copies the current index value into _currentIndex.","		 * @method _indexSetter","		 * @param value {integer} new value for the index","		 * @return {integer|INVALID_VALUE} new value for the index or INVALID_VALUE if invalid.","		 * @private","		 */","		_indexSetter: function (value) {","			if (Lang.isNumber(value) && value >= 0 && value < this._shelves.length) {","				this._shelve(this._currentIndex);","				this._currentIndex = value = parseInt(value,10);","				this._fetch(value);","				return value;","			}","			return Y.Attribute.INVALID_VALUE;","		},","		/**","		 * Getter for the _index_ attribute","		 * Returns the value from _currentIndex","		 * @method _indexGetter","		 * @return {integer} value of the index","		 * @private","		 */","		_indexGetter: function () {","			return this._currentIndex;","		},","		/**","		 * Getter for the isNew attribute used only for GalleryModelMultiRecord","		 * so that it is read from the shelf and not from the actual attribute, ","		 * which is expensive to shelve","		 * @method _isNewGetter","		 * @param value {Boolean} value stored in the attribute, it is ignored.","		 * @param name {String} name of the attribute.  ","		 *		If it contains a dot, the original getter is called.","		 * @return {Boolean} state of the attribute","		 * @private","		 */","		_isNewGetter: function (value, name) {","			if (name.split(DOT).length > 1) {","				return Y.GalleryModel.prototype._isNewGetter.apply(this, arguments);","			}","			return this._isNew;","			","		},","		/**","		 * Setter for the isNew attribute used only for GalleryModelMultiRecord","		 * so that it is written into the shelf and not into the actual attribute, ","		 * which is expensive to shelve","		 * @method _isNewSetter","		 * @param value {Boolean} value stored in the attribute.","		 * @return {Boolean} the same value as received.","		 * @private","		 */","		_isNewSetter: function (value) {","			return (this._isNew = value);","		},","		/**","		 * Getter for the isModified attribute used only for GalleryModelMultiRecord","		 * so that it is read from the shelf and not from the actual attribute, ","		 * which is expensive to shelve","		 * @method _isModifiedGetter","		 * @param value {Boolean} value stored in the attribute, it is ignored.","		 * @param name {String} name of the attribute.  ","		 *		If it contains a dot, the original getter is called.","		 * @return {Boolean} state of the attribute","		 * @private","		 */","		_isModifiedGetter:  function (value, name) {","			if (name.split(DOT).length > 1) {","				return Y.GalleryModel.prototype._isModifiedGetter.apply(this, arguments);","			}","			return this._isModified;","			","		},","		/**","		 * Setter for the isModified attribute used only for GalleryModelMultiRecord","		 * so that it is written into the shelf and not into the actual attribute, ","		 * which is expensive to shelve","		 * @method _isModifiedSetter","		 * @param value {Boolean} value stored in the attribute.","		 * @return {Boolean} the same value as received.","		 * @private","		 */","		_isModifiedSetter:  function (value) {","			return (this._isModified = value);","		}","			","		","	};","	","	MR.ATTRS = {","		/**","		 * Index of the record exposed.","		 * @attribute index","		 * @type Integer","		 * @default 0","		 */","		index: {","			value: 0,","			setter:'_indexSetter',","			getter:'_indexGetter'","		},","		/**","		 * Merges the new setter into the existing {{#crossLink \"Y.GalleryModel/isNew\"}}{{/crossLink}} attribute","		 * @attribute isNew","		 */","		isNew: {","			setter:'_isNewSetter'","		},","		/**","		 * Merges the new setter into the existing {{#crossLink \"Y.GalleryModel/isModified\"}}{{/crossLink}} attribute.","		 * @attribute isModified","		 */","		isModified: {","			setter: '_isModifiedSetter'","		}","	};","	","	Y.GalleryModelMultiRecord = MR;","	","	/**","	 * Extension to sort records stored in GalleryModel, extended with GalleryModelMultiRecord","	 * It is incompatible with Y.GalleryModelPrimaryKeyIndex","	 * @class Y.GalleryModelSortedMultiRecord","	 */","	var SFIELD = 'sortField',","		SDIR = 'sortDir',","		ASC = 'asc',","		DESC = 'desc',","		SMR = function () {};","	","	SMR.prototype = {","		/**","		 * Compare function used in sorting.","		 * @method _compare","		 * @param a {object} shelf to compare","		 * @param b {object} shelf to compare","		 * @return {integer} -1, 0 or 1 as required by Array.sort","		 * @private","		 */","		_compare: null,","		/**","		 * Initializer lifecycle method.  ","		 * Ensures proper defaults, sets the compare method and","		 * sets listeners for relevant events","		 * @method initializer","		 * @protected","		 */","		initializer: function () {","			if (this.get(SFIELD) === undefined) {","				this._set(SFIELD, this.get('primaryKeys')[0]);","			}","			this._setCompare();","			this.after([SFIELD + CHANGE, SDIR + CHANGE], this._sort);","			this.after('change', this._afterChange);","		},","		/**","		 * Sets the compare function to be used in sorting the records","		 * based on the sortField and sortDir and stores it into this._compare","		 * @method _setCompare","		 * @private","		 */","		_setCompare: function () {","			var sortField = this.get(SFIELD),","				sortAsc = this.get(SDIR) === ASC?1:-1,","				compareValue = (Lang.isFunction(sortField)?","					sortField:","					function(values) {","						return values[sortField];","					}","				);","			this._compare = function(a, b) {","				var aValue = compareValue(a._values),","					bValue = compareValue(b._values);","","				return (aValue < bValue ? -1 : (aValue > bValue ? 1 : 0)) * sortAsc;","			};","		},","		/**","		 * Sorts the shelves whenever the sortField or sortDir is changes","		 * @method _sort","		 * @private","		 */","		_sort: function() {","			this._setCompare();","			this._shelve();","			this._shelves.sort(this._compare);","			this._shelves.splice(this.size());","			this._fetch(0);","		},","		/**","		 * Listens to value changes and if the name of the field is that of the sortField","		 * or if sortField is a function, it will relocate the record to its proper sort order","		 * @method _afterChange","		 * @param ev {EventFacade} Event façade as produced by the change event","		 * @private","		 */","		_afterChange: function (ev) {","			var fieldName = ev.name,","				sField = this.get(SFIELD),","				index,","				currentIndex = this._currentIndex,","				shelves = this._shelves,","				currentShelf;","","			if (fieldName && ev.src !== ADD && (Lang.isFunction(sField) || fieldName === sField)) {","				// The shelf has to be emptied otherwise _findIndex may match itself.","				currentShelf = shelves.splice(currentIndex,1)[0];","				index = this._findIndex(currentShelf._values);","				shelves.splice(index,0,currentShelf);","				this._currentIndex = index;","			}","		},","		/**","		 * Finds the correct index position of a record within the shelves","		 * according to the current sortField and sortDir","		 * @method _findIndex","		 * @param values {Object} values of the record to be located","		 * @return {Integer} location for the record","		 * @private","		 */","		_findIndex: function (values) {","			var shelves = this._shelves,","				low = 0, ","				high = shelves.length, ","				index = 0,","				cmp = this._compare,","				vals = {_values: values};","				","			while (low < high) {","				index = Math.floor((high + low) / 2);","				switch(cmp(vals, shelves[index])) {","					case 1:","						low = index + 1;","						break;","					case -1:","						high = index;","						break;","					default:","						low = high = index;","				}","				","			}","			return low;","			","		},","		/**","		 * Adds a new record at its proper position according to the sort configuration.","		 * It overrides GalleryModelMultiRecord's own add method, ignoring the index position requested, if any.","		 * The new record becomes the current.","		 * @method add","		 * @param values {Object} set of values to set","		 */","		add: function(values) {","			var shelves = this._shelves,","				index = 0;","				","			index = this._findIndex(values);","			this._currentIndex = index;","			shelves.splice(index, 0, {});","			this._initNew();","			this.setValues(values, ADD);","			this._shelve(index);","		},","		/**","		 * Locates a record by value.  The record will be located by the field","		 * given in the sortField attribute.   It will return the index of the","		 * record in the shelves or null if not found.","		 * By default it will expose that record.","		 * If sortField contains a function, it will return null and do nothing.","		 * Since sort fields need not be unique, find may return any of the records","		 * with the same value for that field.","		 * @method find","		 * @param value {Any} value to be found","		 * @param [move] {Boolean} exposes the record found, defaults to true","		 * @return {integer | null} index of the record found or null if not found.","		 * Be sure to differentiate a return of 0, a valid index, from null, a failed search.","		 */","		find: function (value, move) {","			var sfield = this.get(SFIELD),","				index,","				values = {};","			if (Lang.isFunction(sfield)) {","				return null;","			}","			values[sfield] = value;","			index = this._findIndex(values);","			if (this._shelves[index]._values[sfield] !== value) {","				return null;","			}","			if (move || arguments.length < 2) {","				this.set(INDEX, index);","			}","			return index;","		}","	};","	SMR.ATTRS = {","		/**","		 * Name of the field to sort by or function to build the value used for comparisson.","		 * If a function, it will receive a reference to the record to be sorted;","		 * it should return the value to be used for comparisson.  Functions are","		 * used when sorting on multiple keys, which the function should return","		 * concatenated, or when any of the fields needs some pre-processing.","		 * @attribute sortField","		 * @type String | Function","		 * @default first primary key field","		 */","		sortField: {","			validator: function (value){","				return Lang.isString(value) || Lang.isFunction(value);","			}","		},","		/**","		 * Sort direction either \"asc\" for ascending or \"desc\" for descending","		 * @attribute sortDir","		 * @type String","		 * @default \"asc\"","		 */","		sortDir: {","			validator: function (value) {","				return value === DESC || value === ASC;","			},","			value: ASC","		}","	};","	Y.GalleryModelSortedMultiRecord = SMR;","	","	/**","	 * Extension to store the records in the GalleryModel using the field in the primaryKeys as its index.","	 * The primary key must be a single unique integer field.","	 * It should be used along Y.GalleryModelMultiRecord.","	 * It is incompatible with Y.GalleryModelSortedMultiRecord.","	 * @class Y.GalleryModelPrimaryKeyIndex","	 */","	var PKI = function () {};","	PKI.prototype = {","		/**","		 * Adds a new record at the index position given by its primary key.","		 * The new record becomes the current.","		 * @method add","		 * @param values {Object} set of values to set","		 */","		add: function(values) {","			if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {","				this._shelve();","			}","			this._currentIndex = values[this._primaryKeys[0]];","			this._initNew();","			this.setValues(values, ADD);","		},","		/**","		 * Default action for the loaded event, checks if the parsed response is an array","		 * and saves it into the shelves using the value of the primary key field for its index.","		 * The model will be left positioned at the item with the lowest key value.","		 * If the primary key field has not been declared, items will not be loaded.","		 * If the primary key field is not unique, the duplicate will overwrite the previous.","		 * @method _defDataLoaded","		 * @param ev {EventFacade} facade produced by load.","		 * @private","		 */","		_defDataLoaded: function (ev) {","			var self = this,","				shelves = self._shelves,","				pk = self._primaryKeys[0];","				","			if (Lang.isUndefined(pk)) {","				return;","			}	","			if (self.get(IS_MODIFIED) || !self.get(IS_NEW)) {","				self._shelve();","			}","			YArray.each(new YArray(ev.parsed), function (values) {","				shelves[values[pk]] = {","					_values: values,","					_loadedValues: Y.clone(values),","					isNew: false,","					isModified:false","				};","			});","			YArray.some(shelves, function (shelf, index) {","				self._fetch(index);","				return true;","			});","			","		},","		/**","		 * Sugar method added because items might not be contiguous so ","		 * adding one to the index does not always get you to the next item.","		 * If there is no next element, null will be returned and the","		 * collection will still point to the last item.","		 * @method next","		 * @return {integer} index of the next item or null if none found","		 */","		next: function () {","			if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {","				this._shelve();","			}","			var shelves = this._shelves,","				index = this._currentIndex + 1, ","				l = shelves.length;","			while (index < l && !shelves.hasOwnProperty(index)) {","				index +=1;","			}","			if (index === l) {","				return null;","			}","			this._fetch(index);","			return index;","		},","		/**","		 * Sugar method added because items might not be contiguous so ","		 * subtracting one to the index does not always get you to the previous item.","		 * If there is no next element, null will be returned and the","		 * collection will still point to the first item.","		 * @method next","		 * @return {integer} index of the next item or null if none found","		 */","		previous: function () {","			if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {","				this._shelve();","			}","			var shelves = this._shelves,","				index = this._currentIndex - 1;","			while (index >= 0 && !shelves.hasOwnProperty(index)) {","				index -=1;","			}","			if (index === -1) {","				return null;","			}","			this._fetch(index);","			return index;","		}","		","	};","	Y.GalleryModelPrimaryKeyIndex = PKI;","","","","}, 'gallery-2012.08.22-20-00' ,{requires:['base'], skinnable:false});"];
_yuitest_coverage["/build/gallery-md-model/gallery-md-model.js"].lines = {"1":0,"26":0,"28":0,"44":0,"75":0,"76":0,"85":0,"96":0,"104":0,"107":0,"108":0,"109":0,"110":0,"111":0,"112":0,"132":0,"133":0,"134":0,"135":0,"136":0,"138":0,"140":0,"141":0,"142":0,"145":0,"148":0,"149":0,"153":0,"154":0,"156":0,"159":0,"168":0,"176":0,"188":0,"189":0,"190":0,"205":0,"206":0,"207":0,"208":0,"210":0,"211":0,"222":0,"225":0,"226":0,"228":0,"241":0,"245":0,"246":0,"247":0,"248":0,"251":0,"259":0,"261":0,"262":0,"264":0,"275":0,"276":0,"290":0,"292":0,"293":0,"295":0,"296":0,"297":0,"300":0,"310":0,"311":0,"312":0,"313":0,"314":0,"338":0,"340":0,"341":0,"342":0,"343":0,"344":0,"347":0,"348":0,"354":0,"355":0,"357":0,"359":0,"361":0,"362":0,"365":0,"366":0,"370":0,"391":0,"392":0,"393":0,"395":0,"401":0,"405":0,"433":0,"435":0,"436":0,"437":0,"438":0,"439":0,"442":0,"443":0,"444":0,"445":0,"447":0,"450":0,"451":0,"457":0,"458":0,"460":0,"462":0,"464":0,"465":0,"466":0,"467":0,"468":0,"469":0,"473":0,"474":0,"479":0,"486":0,"487":0,"488":0,"516":0,"517":0,"561":0,"562":0,"576":0,"578":0,"579":0,"581":0,"587":0,"588":0,"591":0,"608":0,"611":0,"612":0,"613":0,"614":0,"615":0,"616":0,"618":0,"621":0,"622":0,"623":0,"624":0,"625":0,"626":0,"628":0,"631":0,"632":0,"634":0,"635":0,"636":0,"639":0,"640":0,"641":0,"642":0,"643":0,"644":0,"646":0,"717":0,"719":0,"721":0,"722":0,"723":0,"725":0,"726":0,"736":0,"737":0,"746":0,"755":0,"756":0,"757":0,"758":0,"759":0,"762":0,"763":0,"775":0,"777":0,"779":0,"780":0,"781":0,"783":0,"784":0,"794":0,"795":0,"804":0,"811":0,"812":0,"813":0,"814":0,"816":0,"819":0,"820":0,"832":0,"835":0,"845":0,"846":0,"847":0,"871":0,"872":0,"874":0,"876":0,"877":0,"879":0,"888":0,"889":0,"891":0,"893":0,"896":0,"897":0,"899":0,"900":0,"913":0,"922":0,"923":0,"924":0,"925":0,"935":0,"936":0,"938":0,"939":0,"940":0,"941":0,"942":0,"954":0,"955":0,"956":0,"957":0,"958":0,"959":0,"960":0,"975":0,"976":0,"977":0,"978":0,"979":0,"980":0,"981":0,"982":0,"995":0,"1012":0,"1014":0,"1015":0,"1016":0,"1018":0,"1019":0,"1026":0,"1027":0,"1028":0,"1031":0,"1041":0,"1042":0,"1043":0,"1045":0,"1052":0,"1053":0,"1054":0,"1065":0,"1066":0,"1067":0,"1068":0,"1069":0,"1071":0,"1081":0,"1095":0,"1096":0,"1098":0,"1111":0,"1125":0,"1126":0,"1128":0,"1141":0,"1147":0,"1175":0,"1182":0,"1188":0,"1206":0,"1207":0,"1209":0,"1210":0,"1211":0,"1220":0,"1225":0,"1228":0,"1229":0,"1232":0,"1241":0,"1242":0,"1243":0,"1244":0,"1245":0,"1255":0,"1262":0,"1264":0,"1265":0,"1266":0,"1267":0,"1279":0,"1286":0,"1287":0,"1288":0,"1290":0,"1291":0,"1293":0,"1294":0,"1296":0,"1300":0,"1311":0,"1314":0,"1315":0,"1316":0,"1317":0,"1318":0,"1319":0,"1336":0,"1339":0,"1340":0,"1342":0,"1343":0,"1344":0,"1345":0,"1347":0,"1348":0,"1350":0,"1353":0,"1366":0,"1377":0,"1382":0,"1391":0,"1392":0,"1400":0,"1401":0,"1403":0,"1404":0,"1405":0,"1418":0,"1422":0,"1423":0,"1425":0,"1426":0,"1428":0,"1429":0,"1436":0,"1437":0,"1438":0,"1451":0,"1452":0,"1454":0,"1457":0,"1458":0,"1460":0,"1461":0,"1463":0,"1464":0,"1475":0,"1476":0,"1478":0,"1480":0,"1481":0,"1483":0,"1484":0,"1486":0,"1487":0,"1491":0};
_yuitest_coverage["/build/gallery-md-model/gallery-md-model.js"].functions = {"initializer:74":0,"(anonymous 2):141":0,"finish:139":0,"destroy:131":0,"getValue:167":0,"getValues:175":0,"setValue:187":0,"(anonymous 3):210":0,"_defSetValue:204":0,"(anonymous 4):225":0,"setValues:221":0,"(anonymous 5):245":0,"getChangedValues:240":0,"(anonymous 6):261":0,"getPKValues:258":0,"getAsHTML:274":0,"(anonymous 7):295":0,"getAsURL:289":0,"_defDataLoaded:309":0,"(anonymous 8):347":0,"load:337":0,"parse:390":0,"(anonymous 10):450":0,"(anonymous 9):442":0,"save:432":0,"reset:485":0,"sync:514":0,"validate:560":0,"(anonymous 11):578":0,"_validate:575":0,"toJSON:607":0,"_isModifiedGetter:610":0,"_isNewGetter:620":0,"_primaryKeysSetter:630":0,"_primaryKeysGetter:638":0,"initializer:720":0,"_trackChange:735":0,"_resetUndo:745":0,"undo:754":0,"initializer:778":0,"_trackChange:793":0,"_resetUndo:803":0,"undo:810":0,"initializer:844":0,"(anonymous 12):876":0,"_shelve:870":0,"(anonymous 13):899":0,"_fetch:887":0,"_addPreserve:912":0,"_initNew:921":0,"add:934":0,"(anonymous 14):956":0,"each:953":0,"(anonymous 15):977":0,"eachModified:974":0,"saveAllModified:994":0,"(anonymous 16):1018":0,"_defDataLoaded:1011":0,"(anonymous 17):1042":0,"size:1040":0,"empty:1051":0,"_indexSetter:1064":0,"_indexGetter:1080":0,"_isNewGetter:1094":0,"_isNewSetter:1110":0,"_isModifiedGetter:1124":0,"_isModifiedSetter:1140":0,"initializer:1205":0,"sortField:1224":0,"_compare:1228":0,"_setCompare:1219":0,"_sort:1240":0,"_afterChange:1254":0,"_findIndex:1278":0,"add:1310":0,"find:1335":0,"validator:1365":0,"validator:1376":0,"add:1399":0,"(anonymous 18):1428":0,"(anonymous 19):1436":0,"_defDataLoaded:1417":0,"next:1450":0,"previous:1474":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-md-model/gallery-md-model.js"].coveredLines = 365;
_yuitest_coverage["/build/gallery-md-model/gallery-md-model.js"].coveredFunctions = 85;
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1);
YUI.add('gallery-md-model', function(Y) {

/**
Record-based data model with APIs for getting, setting, validating, and
syncing attribute values, as well as events for being notified of model changes.
 
@module gallery-md-model
**/
 
/**
Record-based data model with APIs for getting, setting, validating, and
syncing attribute values, as well as events for being notified of model changes.
 
In most cases, you'll want to create your own subclass of Y.GalleryModel and
customize it to meet your needs. In particular, the sync() and validate()
methods are meant to be overridden by custom implementations. You may also want
to override the parse() method to parse non-generic server responses.
 
@class Y.GalleryModel
@constructor
@param [cfg] {Object} Initial configuration attribute plus:
@param [cfg.values] {Object}  Sets initial values for the model.  
	Model will be marked as new and not modified (as if just loaded).
@extends Base
**/
	_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 26);
"use strict";
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 28);
var Lang = Y.Lang,
		YArray = Y.Array,
		YObject = Y.Object,
		EVT_CHANGE = 'change',
		EVT_LOADED = 'loaded',
		EVT_ERROR = 'error',
		EVT_SAVED = 'saved',
		EVT_RESET = 'reset',
		IS_MODIFIED = 'isModified',
		IS_NEW = 'isNew',
		DOT = '.',
		CHANGE = 'Change',
		ADD = 'add',
		UNDO = 'undo';
	

	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 44);
Y.GalleryModel = Y.Base.create(
		'gallery-md-model',
		Y.Base, 
		[],
		{
			/**
			 * Hash of values indexed by field name
			 * @property _values
			 * @type Object
			 * @private
			 */
			_values: null,
			/**
			 * Hash of values as loaded from the remote source, 
			 * presumed to be the current value there.
			 * @property _loadedValues
			 * @type Object
			 * @private
			 */
			_loadedValues: null,
			/**
			 * Array of field names that make up the primary key for this record
			 * @property _primaryKeys
			 * @type Array
			 * @private
			 */
			_primaryKeys: null,
			/*
			 * Y.Base lifecycle method
			 */
			initializer: function  (cfg) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "initializer", 74);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 75);
this._values = {};
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 76);
this._loadedValues = {};
				/**
				 * Fired whenever a data value is changed.
				 * @event change
				 * @param {String} ev.name Name of the field changed
				 * @param {Any} ev.newVal New value of the field.
				 * @param {Any} ev.prevVal Previous value of the field.
				 * @param {String|null} ev.src Source of the change event, if any.
				 */
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 85);
this.publish(EVT_CHANGE, {
					defaultFn: this._defSetValue
				});
				/**
				 * Fired when new data has been received from the remote source.  
				 * It will be fired even on a save operation if the response contains values.
				 * The parsed values can be altered on the before (on) listener.
				 * @event loaded
				 * @param {Object} ev.response Response data as received from the remote source
				 * @param {Object} ev.parsed Data as returned from the parse method.
				 */
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 96);
this.publish(EVT_LOADED, {
					defaultFn:this._defDataLoaded
				});
				/**
				 * Fired when the data has been saved to the remote source
				 * The event cannot be prevented.
				 * @event saved
				 */
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 104);
this.publish(EVT_SAVED, {
					preventable: false
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 107);
cfg = cfg || {};
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 108);
if (Lang.isObject(cfg.values)) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 109);
this.setValues(cfg.values, 'init');
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 110);
this._set(IS_MODIFIED, false);
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 111);
this._set(IS_NEW, true);
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 112);
this._loadedValues = Y.clone(this._values);
				}
			},
			/**
			 * Destroys this model instance and removes it from its containing lists, if
			 * any.

			 * If there are any arguments then this method also delegates to the
			 * sync() method to delete the model from the persistence layer, which is an
			 * asynchronous action and thus requires at least a callback
			 * otherwise, it returns immediately.

			 * @method destroy
			 * @param [options] {Object} Options passed on to the sync method, if required.
			 * @param [callback] {function} function to be called when the sync operation finishes.
			 *		@param callback.err {string|null} Error message, if any or null.
			 *		@param callback.response {Any} The server response as received by sync(),
			 * @chainable
			 */
			destroy: function (options, callback) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "destroy", 131);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 132);
if (Lang.isFunction(options)) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 133);
callback = options;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 134);
options = {};
				} else {_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 135);
if (!options) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 136);
options = {};
				}}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 138);
var self = this,
					finish = function (err) {
						_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "finish", 139);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 140);
if (!err) {
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 141);
YArray.each(self.lists.concat(), function (list) {
								_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 2)", 141);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 142);
list.remove(self, options);
							});

							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 145);
Y.GalleryModel.superclass.destroy.call(self);
						}

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 148);
if (Lang.isFunction(callback)) {
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 149);
callback.apply(null, arguments);
						}
					};

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 153);
if (callback || options) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 154);
this.sync('delete', options, finish);
				} else {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 156);
finish();
				}

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 159);
return this;
			},
			/**
			 * Returns the value of the field named
			 * @method getValue
			 * @param name {string}  Name of the field to return.
			 * @return {Any} the value of the field requested.  
			 */ 
			getValue: function (name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getValue", 167);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 168);
return this._values[name];
			},
			/**
			 * Returns a hash with all values using the field names as keys.
			 * @method getValues
			 * @return {Object} a hash with all the fields with the field names as keys.
			 */ 
			getValues: function() {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getValues", 175);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 176);
return Y.clone(this._values);
			},
			/**
			 * Sets the value of the named field. 
			 * Fires the change event if the value is different from the current one.
			 * Primary key fields cannot be changed unless still undefined.
			 * @method setValue
			 * @param name {string} Name of the field to be set
			 * @param value {Any} Value to be assigned to the field
			 * @param [src] {Any} Source of the change in the value.
			 */
			setValue: function (name, value, src) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "setValue", 187);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 188);
var prevVal = this._values[name];
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 189);
if (prevVal !== value && (this._primaryKeys.indexOf(name) === -1 || Lang.isUndefined(prevVal))) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 190);
this.fire(EVT_CHANGE, {
						name:name,
						newVal:value,
						prevVal:prevVal,
						src: src
					});
				}
			},
			/**
			 * Default function for the change event, sets the value and marks the model as modified.
			 * @method _defSetValue
			 * @param ev {EventFacade} (see change event)
			 * @private
			 */
			_defSetValue: function (ev) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_defSetValue", 204);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 205);
var self = this;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 206);
if (ev.name) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 207);
self._values[ev.name] = ev.newVal;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 208);
self._set(IS_MODIFIED, true);
				} else {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 210);
YObject.each(ev.newVals, function (value, name) {
						_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 3)", 210);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 211);
self.setValue(name, value, ev.src);
					});
				}
			},
			/**
			 * Sets a series of values.   It simply loops over the hash of values provided calling setValue on each.
			 * @method setValues
			 * @param values {Object} hash of values to change
			 * @param [src] {Any} Source of the changes
			 */
			setValues: function (values, src) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "setValues", 221);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 222);
var self = this,
					prevVals = {};
					
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 225);
YObject.each(values, function (value, name) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 4)", 225);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 226);
prevVals[name] = self.getValue(name);
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 228);
this.fire(EVT_CHANGE, {
					newVals:values,
					prevVals:prevVals,
					src: src
				});
			},
			/**
			 * Returns a hash indexed by field name, of all the values in the model that have changed since the last time
			 * they were synchornized with the remote source.   Each entry has a prevVal and newVal entry.
			 * @method getChangedValues
			 * @return {Object} Has of all entries changed since last synched, each entry has a newVal and prevVal property contaning original and changed values.
			 */
			getChangedValues: function() {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getChangedValues", 240);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 241);
var changed = {}, 
					prev, 
					loaded = this._loadedValues;

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 245);
YObject.each(this._values, function (value, name) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 5)", 245);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 246);
prev = loaded[name];
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 247);
if (prev !== value) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 248);
changed[name] = {prevVal:prev, newVal: value};
					}
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 251);
return changed;
			},
			/**
			 * Returns a hash with the values of the primary key fields, indexed by their field names
			 * @method getPKValues
			 * @return {Object} Hash with the primary key values, indexed by their field names
			 */
			getPKValues: function () {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getPKValues", 258);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 259);
var pkValues = {},
					self = this;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 261);
YArray.each(self._primaryKeys, function (name) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 6)", 261);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 262);
pkValues[name] = self._values[name];
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 264);
return pkValues;
			},
			/**
				Returns an HTML-escaped version of the value of the specified string
				attribute. The value is escaped using Y.Escape.html().

				@method getAsHTML
				@param {String} name Attribute name or object property path.
				@return {String} HTML-escaped attribute value.
			**/
			getAsHTML: function (name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getAsHTML", 274);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 275);
var value = this.getValue(name);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 276);
return Y.Escape.html(Lang.isValue(value) ? String(value) : '');
			},

			/**
			 * Returns a URL-encoded version of the value of the specified field,
			 * or a full URL with name=value sets for all fields if no name is given.
			 * The names and values are encoded using the native encodeURIComponent()
			 * function.

			 * @method getAsURL
			 * @param [name] {String}  Field name.
			 * @return {String} URL-encoded field value if name is given or URL encoded set of name=value pairs for all fields.
			 */
			getAsURL: function (name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getAsURL", 289);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 290);
var value = this.getValue(name),
					url = [];
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 292);
if (name) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 293);
return encodeURIComponent(Lang.isValue(value) ? String(value) : '');
				} 
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 295);
YObject.each(value, function (value, name) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 7)", 295);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 296);
if (Lang.isValue(value)) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 297);
url.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
					}
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 300);
return url.join('&');
			},

			/**
			 * Default function for the loaded event. Does the actual setting of the values just loaded.
			 * @method _defDataLoaded
			 * @param ev {EventFacade} see loaded event
			 * @private
			 */
			_defDataLoaded: function (ev) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_defDataLoaded", 309);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 310);
var self = this;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 311);
self.setValues(ev.parsed, ev.src);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 312);
self._set(IS_MODIFIED, false);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 313);
self._set(IS_NEW, false);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 314);
self._loadedValues = Y.clone(self._values);
			},
			/**
				Loads this model from the server.

				This method delegates to the sync() method to perform the actual load
				operation, which is an asynchronous action. Specify a _callback_ function to
				be notified of success or failure.

				A successful load operation will fire a loaded event, while an unsuccessful
				load operation will fire an error event with the src value "load".

				@method load
				@param [options] {Object} Options to be passed to sync().
					Usually these will be or will include the keys used by the remote source 
					to locate the data to be loaded.
					They will be passed on unmodified to the sync method.
					It is up to sync to determine what they mean.
				@param [callback] {callback}  Called when the sync operation finishes. Callback will receive:
					@param callback.err {string|null} Error message, if any or null.
					@param callback.response {Any} The server response as received by sync(),
				@chainable
			**/
			load: function (options, callback) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "load", 337);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 338);
var self = this;

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 340);
if (Lang.isFunction(options)) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 341);
callback = options;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 342);
options = {};
				} else {_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 343);
if (!options) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 344);
options = {};
				}}

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 347);
self.sync('read', options, function (err, response) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 8)", 347);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 348);
var facade = {
							options : options,
							response: response,
							src: 'load'
						};

					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 354);
if (err) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 355);
facade.error = err;

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 357);
self.fire(EVT_ERROR, facade);
					} else {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 359);
self._values = {};

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 361);
facade.parsed = self.parse(response);
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 362);
self.fire(EVT_LOADED, facade);
					}

					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 365);
if (Lang.isFunction(callback)) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 366);
callback.apply(null, arguments);
					}
				});

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 370);
return self;
			},

			/**
				Called to parse the _response_ when a response is received from the server.
				This method receives a server _response_ and is expected to return a
				value hash.

				The default implementation assumes that _response_ is either an attribute
				hash or a JSON string that can be parsed into an attribute hash. If
				_response_ is a JSON string and either Y.JSON or the native JSON object
				are available, it will be parsed automatically. If a parse error occurs, an
				error event will be fired and the model will not be updated.

				You may override this method to implement custom parsing logic if necessary.

				@method parse
				@param {Any} response Server response.
				@return {Object} Values hash.
			**/
			parse: function (response) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "parse", 390);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 391);
if (typeof response === 'string') {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 392);
try {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 393);
return Y.JSON.parse(response);
					} catch (ex) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 395);
this.fire(EVT_ERROR, {
							error : ex,
							response: response,
							src : 'parse'
						});

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 401);
return null;
					}
				}

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 405);
return response;
			},



			/**
				Saves this model to the server.

				This method delegates to the sync() method to perform the actual save
				operation, which is an asynchronous action. Specify a _callback_ function to
				be notified of success or failure.

				A successful save operation will fire a saved event, while an unsuccessful
				load operation will fire an error event with the src value "save".

				If the save operation succeeds and the parse method returns non-empty values
				within the response	a loaded event will also be fired to read those values.

				@method save
				@param {Object} [options] Options to be passed to sync() and to set()
					when setting synced attributes. It's up to the custom sync implementation
					to determine what options it supports or requires, if any.
				@param {Function} [callback] Called when the sync operation finishes.
					@param callback.err {string|null} Error message, if any or null.
					@param callback.response {Any} The server response as received by sync(),
				@chainable
			**/
			save: function (options, callback) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "save", 432);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 433);
var self = this;

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 435);
if (Lang.isFunction(options)) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 436);
callback = options;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 437);
options = {};
				} else {_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 438);
if (!options) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 439);
options = {};
				}}

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 442);
self._validate(self.getValues(), function (err) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 9)", 442);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 443);
if (err) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 444);
if (Lang.isFunction(callback)) {
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 445);
callback.call(null, err);
						}
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 447);
return;
					}

					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 450);
self.sync(self.get(IS_NEW) ? 'create' : 'update', options, function (err, response) {
						_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 10)", 450);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 451);
var facade = {
								options : options,
								response: response,
								src: 'save'
							};

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 457);
if (err) {
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 458);
facade.error = err;

							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 460);
self.fire(EVT_ERROR, facade);
						} else {
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 462);
facade.parsed = self.parse(response);

							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 464);
self._set(IS_MODIFIED, false);
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 465);
self._set(IS_NEW, false);
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 466);
self._loadedValues = Y.clone(self._values);
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 467);
self.fire(EVT_SAVED, facade);
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 468);
if (facade.parsed) {
								_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 469);
self.fire(EVT_LOADED, facade);
							}
						}

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 473);
if (Lang.isFunction(callback)) {
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 474);
callback.apply(null, arguments);
						}
					});
				});

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 479);
return self;
			},
			/**
			 * Restores the values when last loaded, saved or created.
			 * @method reset
			 */
			reset: function() {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "reset", 485);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 486);
this._values = Y.clone(this._loadedValues);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 487);
this.fire(EVT_RESET);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 488);
return this;
			},
			/**
				Override this method to provide a custom persistence implementation for this
				model. The default just calls the callback without actually doing anything.

				This method is called internally by load(), save(), and destroy().

				@method sync
				@param {String} action Sync action to perform. May be one of the following:

					* create: Store a newly-created model for the first time.
					* read  : Load an existing model.
					* update: Update an existing model.
					* delete: Delete an existing model.

				@param {Object} [options] Sync options. It's up to the custom sync
					implementation to determine what options it supports or requires, if any.
				@param {Function} [callback] Called when the sync operation finishes.
					@param {Error|null} callback.err If an error occurred, this parameter will
						contain the error. If the sync operation succeeded, _err_ will be
						falsy.
					@param {Any} [callback.response] The server's response. This value will
						be passed to the parse() method, which is expected to parse it and
						return an attribute hash.
			**/
			sync: function (action, options, callback) {

				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "sync", 514);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 516);
if (Lang.isFunction(callback)) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 517);
callback();
				}
			},
			/**
				Override this method to provide custom validation logic for this model.

				While attribute-specific validators can be used to validate individual
				attributes, this method gives you a hook to validate a hash of all
				attributes before the model is saved. This method is called automatically
				before save() takes any action. If validation fails, the save() call
				will be aborted.

				In your validation method, call the provided callback function with no
				arguments to indicate success. To indicate failure, pass a single argument,
				which may contain an error message, an array of error messages, or any other
				value. This value will be passed along to the error event.

				@example

				model.validate = function (attrs, callback) {
				if (attrs.pie !== true) {
				// No pie?! Invalid!
				callback('Must provide pie.');
				return;
				}

				// Success!
				callback();
				};

				@method validate
				@param {Object} attrs Attribute hash containing all model attributes to
				be validated.
				@param {Function} callback Validation callback. Call this function when your
				validation logic finishes. To trigger a validation failure, pass any
				value as the first argument to the callback (ideally a meaningful
				validation error of some kind).

				@param {Any} [callback.err] Validation error. Don't provide this
				argument if validation succeeds. If validation fails, set this to an
				error message or some other meaningful value. It will be passed
				along to the resulting error event.
			**/
			validate: function (attrs, callback) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "validate", 560);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 561);
if (Lang.isFunction(callback))  {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 562);
callback();
				}
			},
			/**
				Calls the public, overridable validate() method and fires an error event
				if validation fails.

				@method _validate
				@param {Object} attributes Attribute hash.
				@param {Function} callback Validation callback.
				@param {Any} [callback.err] Value on failure, non-value on success.
				@protected
			**/
			_validate: function (attributes, callback) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_validate", 575);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 576);
var self = this;

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 578);
self.validate(attributes, function (err) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 11)", 578);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 579);
if (Lang.isValue(err)) {
						// Validation failed. Fire an error.
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 581);
self.fire(EVT_ERROR, {
							attributes: attributes,
							error : err,
							src : 'validate'
						});

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 587);
callback(err);
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 588);
return;
					}

					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 591);
callback();
				});

			},
			/**
				Returns a copy of this model's attributes that can be passed to
				Y.JSON.stringify() or used for other nefarious purposes.

				The clientId attribute is not included in the returned object.

				If you've specified a custom attribute name in the idAttribute property,
				the default id attribute will not be included in the returned object.

				@method toJSON
				@return {Object} Copy of this model's attributes.
			**/
			toJSON: function () {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "toJSON", 607);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 608);
return this.getValue();
			},
			_isModifiedGetter: function (value, name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_isModifiedGetter", 610);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 611);
name = name.split(DOT);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 612);
if (name.length > 1) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 613);
name = name[1];
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 614);
var ret = {};
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 615);
ret[name] = this._values[name] !== this._loadedValues[name];
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 616);
return ret;
				}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 618);
return value;
			},
			_isNewGetter: function (value, name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_isNewGetter", 620);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 621);
name = name.split(DOT);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 622);
if (name.length > 1) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 623);
name = name[1];
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 624);
var ret = {};
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 625);
ret[name] = !this._loadedValues.hasOwnProperty(name);
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 626);
return ret;
				}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 628);
return value;
			},
			_primaryKeysSetter: function (value) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_primaryKeysSetter", 630);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 631);
if (this._primaryKeys && this._primaryKeys.length) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 632);
return Y.Attribute.INVALID_VALUE;
				}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 634);
value = new YArray(value);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 635);
this._primaryKeys = value;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 636);
return value;
			},
			_primaryKeysGetter: function (value, name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_primaryKeysGetter", 638);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 639);
name = name.split(DOT);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 640);
if (name.length > 1) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 641);
name = name[1];
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 642);
var ret = {};
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 643);
ret[name] = value.indexOf(name) !== -1;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 644);
return ret;
				}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 646);
return (value || []).concat();  // makes sure to return a copy, not the original.
			}
		},
		{
			ATTRS: {
				/**
				 * Indicates whether any of the fields has been changed since created or loaded.
				 * Field names can be given as sub-attributes to indicate if any particular field has beeen changed.
				 * model.get('isModified.name') returns true if the field _name_ has been modified.
				 * <b>Note:</b> contrary to common practice in Attributes with sub-attributes, 
				 * requesting the state of the record does not
				 * return an object with the state of each individual field keyed by field name,
				 * but the state of the record as a whole, which is far more useful.
				 * @attribute isModified
				 * @type Boolean
				 * @readonly
				 * @default false
				 */
				isModified: {
					readOnly: true,
					value:false,
					validator:Lang.isBoolean,
					getter: '_isModifiedGetter'
				},
				/**
				 * Indicates that the model is new and has not been modified since creation.
				 * Field names can be given as sub-attributes to indicate if any particular field is new.
				 * model.get('isNew.name') returns true if the field _name_ is new.
				 * <b>Note:</b> contrary to common practice in Attributes with sub-attributes, 
				 * requesting the state of the record does not
				 * return an object with the state of each individual field keyed by field name,
				 * but the state of the record as a whole, which is far more useful.
				 * @attribute isNew
				 * @type Boolean
				 * @readonly
				 * @default true
				 */
				isNew: {
					readOnly: true,
					value:true,
					validator:Lang.isBoolean,
					getter: '_isNewGetter'
				},
				/**
				 * List of fields making the primary key of this model. 
				 * Primary Key fields cannot be modified once initially loaded.
				 * It can be set as an array of field names or, if the key is made of a single field, a string with the name of that field.
				 * It will always be returned as an array.
				 * Field names can be given as a sub-attribute to ask whether a particular field is a primary key, thus:
				 * model.get('primaryKeys.name') returns true of the field name is a primary key.
				 * It can only be set once.
				 * @attribute primaryKeys
				 * @writeonce
				 * @type array
				 * @default []
				 */
				primaryKeys: {
					setter:'_primaryKeysSetter',
					getter:'_primaryKeysGetter',
					lazyAdd: false,
					value: []
				}
			}

		}
	);
		
	/**
	 * An extension for Y.GalleryModel that provides a single level of undo for each field.
	 * @class Y.GalleryModelSimpleUndo
	 */
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 717);
Y.GalleryModelSimpleUndo = function () {};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 719);
Y.GalleryModelSimpleUndo.prototype = {
		initializer: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "initializer", 720);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 721);
this._lastChange = {};
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 722);
if (this._addPreserve) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 723);
this._addPreserve('_lastChange');
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 725);
this.after(EVT_CHANGE, this._trackChange);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 726);
this.after([EVT_LOADED,EVT_SAVED,EVT_RESET], this._resetUndo);	
		},
		/**
		 * Event listener for the after value change event, it tracks changes for each field.  
		 * It retains only the last change for each field.
		 * @method _trackChange
		 * @param ev {EventFacade} As provided by the change event
		 * @private
		 */
		_trackChange: function (ev) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_trackChange", 735);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 736);
if (ev.name && ev.src !== UNDO) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 737);
this._lastChange[ev.name] = ev.prevVal;
			}
		},
		/**
		 * After load or save operations, it drops any changes it might have tracked.
		 * @method _resetUndo
		 * @private
		 */
		_resetUndo: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_resetUndo", 745);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 746);
this._lastChange = {};
		},
		/**
		 * Reverts one level of change for a specific field or all fields
		 * @method undo
		 * @param [name] {String} If provided it will undo that particular field,
		 *	otherwise, it undoes the whole record.
		 */
		undo: function (name) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "undo", 754);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 755);
var self = this;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 756);
if (name) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 757);
if (self._lastChange[name] !== undefined) {		
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 758);
self.setValue(name, self._lastChange[name], UNDO);
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 759);
delete self._lastChange[name];
				}
			} else {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 762);
self.setValues(this._lastChange, UNDO);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 763);
self._lastChange = {};
			}
		}
	};
	
	/**
	 * Provides multiple levels of undo in strict chronological order 
	 * whatever the field was at each stage.
	 * Changes done on multiple fields via setValues
	 * will also be undone in one step.
	 * @class Y.GalleryModelChronologicalUndo
	 */
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 775);
Y.GalleryModelChronologicalUndo = function () {};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 777);
Y.GalleryModelChronologicalUndo.prototype = {
		initializer: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "initializer", 778);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 779);
this._changes = [];
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 780);
if (this._addPreserve) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 781);
this._addPreserve('_changes');
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 783);
this.after(EVT_CHANGE, this._trackChange);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 784);
this.after([EVT_LOADED,EVT_SAVED,EVT_RESET], this._resetUndo);
		},
		/**
		 * Event listener for the after value change event, it tracks changes for each field.  
		 * It keeps a stack of each change.  
		 * @method _trackChange
		 * @param ev {EventFacade} As provided by the change event
		 * @private
		 */
		_trackChange: function (ev) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_trackChange", 793);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 794);
if (ev.src !== UNDO) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 795);
this._changes.push(ev.details);
			}
		},
		/**
		 * After load or save operations, it drops any changes it might have tracked.
		 * @method _resetUndo
		 * @private
		 */
		_resetUndo: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_resetUndo", 803);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 804);
this._changes = [];
		},
		/**
		 * Reverts one level of field changes.
		 * @method undo
		 */
		undo: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "undo", 810);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 811);
var ev = this._changes.pop();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 812);
if (ev) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 813);
if (ev.name) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 814);
this.setValue(ev.name, ev.prevVal, UNDO);
				} else {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 816);
this.setValues(ev.prevVals, UNDO);
				}
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 819);
if (this._changes.length === 0) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 820);
this._set(IS_MODIFIED, false);
			}
		}
	};
	
	/**
	 * Allows GalleryModel to handle a set of records using the Flyweight pattern.
	 * It exposes one record at a time from a shelf of records.
	 * Exposed records can be selected by setting the _index_ attribute.
	 * @class Y.GalleryModelMultiRecord
	 */
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 832);
var INDEX = 'index',
		MR = function () {};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 835);
MR.prototype = {
		/**
		 * Added this property to have ModelSync.REST getURL() return the proper URL.
		 * @property _isYUIModelList
		 * @type Boolean
		 * @value true
		 * @private
		 */
		_isYUIModelList: true,
		initializer: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "initializer", 844);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 845);
this._shelves = [];
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 846);
this._currentIndex = 0;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 847);
this._addPreserve('_values','_loadedValues','_isNew','_isModified');
		},
		/**
		 * Index of the shelf for the record being exposed.
		 * Use index attribute to check/set the index value.
		 * @property _currentIndex
		 * @type integer
		 * @default 0
		 * @private
		 */
		_currentIndex: 0,
		/**
		 * Storage for the records when not exposed.
		 * @property _shelves
		 * @type Array
		 * @private
		 */
		_shelves: null,
		/**
		 * Saves the exposed record into the shelves at the position given by _currentIndex
		 * @method _shelve
		 * @private
		 */
		_shelve: function(index) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_shelve", 870);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 871);
if (index === undefined) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 872);
index = this._currentIndex;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 874);
var self = this,
				current = {};
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 876);
YArray.each(self._preserve, function (name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 12)", 876);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 877);
current[name] = self[name];
			});
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 879);
self._shelves[index] = current;
			
		},
		/**
		 * Retrives and exposes the record from the shelf at the position given by _currentIndex
		 * @method _fetch
		 * @private
		 */
		_fetch: function (index) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_fetch", 887);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 888);
if (index === undefined) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 889);
index = this._currentIndex;
			} else {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 891);
this._currentIndex = index;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 893);
var self = this,
				current = self._shelves[index];
				
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 896);
if (Lang.isUndefined(current)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 897);
this._initNew();
			} else {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 899);
YArray.each(self._preserve, function (name) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 13)", 899);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 900);
self[name] = current[name];
				});
			}
			
		},
		/**
		 * Adds the names of properties that are to be preserved in the shelf when moving,
		 * and taken out of the shelf when fetching.
		 * @method _addPreserve
		 * @param {String} any number of names or array of names of properties to be preserved.
		 * @protected
		 */
		_addPreserve: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_addPreserve", 912);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 913);
this._preserve = (this._preserve || []).concat(Array.prototype.slice.call(arguments));
		},
		
		/**
		 * Initializes an exposed record
		 * @method _initNew
		 * @private
		 */
		_initNew: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_initNew", 921);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 922);
this._values = {};
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 923);
this._loadedValues = {};
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 924);
this._isNew = true;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 925);
this._isModified = false;
		},
		/**
		 * Adds a new record at the index position given or at the end.
		 * The new record becomes the current.
		 * @method add
		 * @param values {Object} set of values to set
		 * @param [index] {Integer} position to add the values at or at the end if not provided.  
		 */
		add: function(values, index) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "add", 934);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 935);
if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 936);
this._shelve();
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 938);
index = index || this._shelves.length;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 939);
this._shelves.splice(index, 0, {});
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 940);
this._currentIndex = index;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 941);
this._initNew();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 942);
this.setValues(values, ADD);
		},
		/**
		 * Executes the given function for each record in the set.
		 * Returning exactly false from the function spares shelving the record.
		 * If the callback function does not modify the record, 
		 * returning false will improve performance.
		 * @method each
		 * @param fn {function} function to execute, it will be provided with:
		 * @param fn.index {integer} index of the record exposed
		 */
		each: function(fn) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "each", 953);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 954);
var self = this;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 955);
self._shelve();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 956);
YArray.each(self._shelves, function (shelf, index) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 14)", 956);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 957);
self._currentIndex = index;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 958);
self._fetch(index);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 959);
if (fn.call(self, index) !== false) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 960);
self._shelve(index);
				}
			});
		},
		/**
		 * Executes the given function for each record in the set.
		 * It is faster than using each and then checking for isModified
		 * Returning exactly false from the function spares shelving the record.
		 * If the callback function does not modify the record, 
		 * returning false will improve performance.
		 * @method eachModified
		 * @param fn {function} function to execute, it will be provided with:
		 * @param fn.index {integer} index of the record exposed
		 */
		eachModified:function(fn) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "eachModified", 974);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 975);
var self = this;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 976);
self._shelve();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 977);
YArray.each(self._shelves,  function (shelf, index) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 15)", 977);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 978);
if (self._shelves[index][IS_MODIFIED]) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 979);
self._currentIndex = index;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 980);
self._fetch(index);
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 981);
if (fn.call(self, index) !== false) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 982);
self._shelve(index);
					}
				}
			});
		},
		/**
		 * Calls _save_ on each record modified.
		 * This is not the best saving strategy for saving batches of records,
		 * but it is the easiest and safest.  Implementors are encouraged to 
		 * design their own.
		 * @method saveAllModified
		 */
		saveAllModified: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "saveAllModified", 994);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 995);
this.eachModified(this.save);
		},
		/**
		 * This is a documentation entry only, this method does not define load. 
		 * This extension redefines the default action for the loaded event so 
		 * that if a load returns an array of records, they will be added to the shelves. 
		 * Existing records are kept, call empty if they should be discarded. 
		 * See method load of Y.GalleryModel for further info.
		 */ 
		/**
		 * Default action for the loaded event, checks if the parsed response is an array
		 * and saves it into the shelves, otherwise t calls the default loader for single records.
		 * @method _defDataLoaded
		 * @param ev {EventFacade} facade produced by load.
		 * @private
		 */
		_defDataLoaded: function (ev) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_defDataLoaded", 1011);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1012);
var self = this,
				shelves = self._shelves;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1014);
if (Lang.isArray(ev.parsed)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1015);
if (shelves.length && (self.get(IS_MODIFIED) || !self.get(IS_NEW))) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1016);
self._shelve();
				}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1018);
YArray.each(ev.parsed, function (values) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 16)", 1018);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1019);
shelves.push({
						_values: values,
						_loadedValues: Y.clone(values),
						isNew: false,
						isModified:false
					});
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1026);
self._fetch();
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1027);
if (self._sort) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1028);
self._sort();
				}
			} else {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1031);
Y.GalleryModel.prototype._defDataLoaded.apply(self, arguments);
			}
			
		},
		/**
		 * Returns the number of records stored, skipping over empty slots.
		 * @method size
		 * @return {Integer} number of records in the shelves
		 */
		size: function() {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "size", 1040);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1041);
var count = 0;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1042);
YArray.each(this._shelves, function () {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 17)", 1042);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1043);
count +=1;
			});
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1045);
return count;
		},
		/**
		 * Empties the shelves of any records as well as the exposed record
		 * @method empty
		 */
		empty: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "empty", 1051);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1052);
this._shelves = [];
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1053);
this._currentIndex = 0;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1054);
this.reset();
		},
		/**
		 * Setter for the _index_ attribute.
		 * Validates and copies the current index value into _currentIndex.
		 * @method _indexSetter
		 * @param value {integer} new value for the index
		 * @return {integer|INVALID_VALUE} new value for the index or INVALID_VALUE if invalid.
		 * @private
		 */
		_indexSetter: function (value) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_indexSetter", 1064);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1065);
if (Lang.isNumber(value) && value >= 0 && value < this._shelves.length) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1066);
this._shelve(this._currentIndex);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1067);
this._currentIndex = value = parseInt(value,10);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1068);
this._fetch(value);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1069);
return value;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1071);
return Y.Attribute.INVALID_VALUE;
		},
		/**
		 * Getter for the _index_ attribute
		 * Returns the value from _currentIndex
		 * @method _indexGetter
		 * @return {integer} value of the index
		 * @private
		 */
		_indexGetter: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_indexGetter", 1080);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1081);
return this._currentIndex;
		},
		/**
		 * Getter for the isNew attribute used only for GalleryModelMultiRecord
		 * so that it is read from the shelf and not from the actual attribute, 
		 * which is expensive to shelve
		 * @method _isNewGetter
		 * @param value {Boolean} value stored in the attribute, it is ignored.
		 * @param name {String} name of the attribute.  
		 *		If it contains a dot, the original getter is called.
		 * @return {Boolean} state of the attribute
		 * @private
		 */
		_isNewGetter: function (value, name) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_isNewGetter", 1094);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1095);
if (name.split(DOT).length > 1) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1096);
return Y.GalleryModel.prototype._isNewGetter.apply(this, arguments);
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1098);
return this._isNew;
			
		},
		/**
		 * Setter for the isNew attribute used only for GalleryModelMultiRecord
		 * so that it is written into the shelf and not into the actual attribute, 
		 * which is expensive to shelve
		 * @method _isNewSetter
		 * @param value {Boolean} value stored in the attribute.
		 * @return {Boolean} the same value as received.
		 * @private
		 */
		_isNewSetter: function (value) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_isNewSetter", 1110);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1111);
return (this._isNew = value);
		},
		/**
		 * Getter for the isModified attribute used only for GalleryModelMultiRecord
		 * so that it is read from the shelf and not from the actual attribute, 
		 * which is expensive to shelve
		 * @method _isModifiedGetter
		 * @param value {Boolean} value stored in the attribute, it is ignored.
		 * @param name {String} name of the attribute.  
		 *		If it contains a dot, the original getter is called.
		 * @return {Boolean} state of the attribute
		 * @private
		 */
		_isModifiedGetter:  function (value, name) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_isModifiedGetter", 1124);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1125);
if (name.split(DOT).length > 1) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1126);
return Y.GalleryModel.prototype._isModifiedGetter.apply(this, arguments);
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1128);
return this._isModified;
			
		},
		/**
		 * Setter for the isModified attribute used only for GalleryModelMultiRecord
		 * so that it is written into the shelf and not into the actual attribute, 
		 * which is expensive to shelve
		 * @method _isModifiedSetter
		 * @param value {Boolean} value stored in the attribute.
		 * @return {Boolean} the same value as received.
		 * @private
		 */
		_isModifiedSetter:  function (value) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_isModifiedSetter", 1140);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1141);
return (this._isModified = value);
		}
			
		
	};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1147);
MR.ATTRS = {
		/**
		 * Index of the record exposed.
		 * @attribute index
		 * @type Integer
		 * @default 0
		 */
		index: {
			value: 0,
			setter:'_indexSetter',
			getter:'_indexGetter'
		},
		/**
		 * Merges the new setter into the existing {{#crossLink "Y.GalleryModel/isNew"}}{{/crossLink}} attribute
		 * @attribute isNew
		 */
		isNew: {
			setter:'_isNewSetter'
		},
		/**
		 * Merges the new setter into the existing {{#crossLink "Y.GalleryModel/isModified"}}{{/crossLink}} attribute.
		 * @attribute isModified
		 */
		isModified: {
			setter: '_isModifiedSetter'
		}
	};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1175);
Y.GalleryModelMultiRecord = MR;
	
	/**
	 * Extension to sort records stored in GalleryModel, extended with GalleryModelMultiRecord
	 * It is incompatible with Y.GalleryModelPrimaryKeyIndex
	 * @class Y.GalleryModelSortedMultiRecord
	 */
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1182);
var SFIELD = 'sortField',
		SDIR = 'sortDir',
		ASC = 'asc',
		DESC = 'desc',
		SMR = function () {};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1188);
SMR.prototype = {
		/**
		 * Compare function used in sorting.
		 * @method _compare
		 * @param a {object} shelf to compare
		 * @param b {object} shelf to compare
		 * @return {integer} -1, 0 or 1 as required by Array.sort
		 * @private
		 */
		_compare: null,
		/**
		 * Initializer lifecycle method.  
		 * Ensures proper defaults, sets the compare method and
		 * sets listeners for relevant events
		 * @method initializer
		 * @protected
		 */
		initializer: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "initializer", 1205);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1206);
if (this.get(SFIELD) === undefined) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1207);
this._set(SFIELD, this.get('primaryKeys')[0]);
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1209);
this._setCompare();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1210);
this.after([SFIELD + CHANGE, SDIR + CHANGE], this._sort);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1211);
this.after('change', this._afterChange);
		},
		/**
		 * Sets the compare function to be used in sorting the records
		 * based on the sortField and sortDir and stores it into this._compare
		 * @method _setCompare
		 * @private
		 */
		_setCompare: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_setCompare", 1219);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1220);
var sortField = this.get(SFIELD),
				sortAsc = this.get(SDIR) === ASC?1:-1,
				compareValue = (Lang.isFunction(sortField)?
					sortField:
					function(values) {
						_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "sortField", 1224);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1225);
return values[sortField];
					}
				);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1228);
this._compare = function(a, b) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_compare", 1228);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1229);
var aValue = compareValue(a._values),
					bValue = compareValue(b._values);

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1232);
return (aValue < bValue ? -1 : (aValue > bValue ? 1 : 0)) * sortAsc;
			};
		},
		/**
		 * Sorts the shelves whenever the sortField or sortDir is changes
		 * @method _sort
		 * @private
		 */
		_sort: function() {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_sort", 1240);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1241);
this._setCompare();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1242);
this._shelve();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1243);
this._shelves.sort(this._compare);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1244);
this._shelves.splice(this.size());
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1245);
this._fetch(0);
		},
		/**
		 * Listens to value changes and if the name of the field is that of the sortField
		 * or if sortField is a function, it will relocate the record to its proper sort order
		 * @method _afterChange
		 * @param ev {EventFacade} Event façade as produced by the change event
		 * @private
		 */
		_afterChange: function (ev) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_afterChange", 1254);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1255);
var fieldName = ev.name,
				sField = this.get(SFIELD),
				index,
				currentIndex = this._currentIndex,
				shelves = this._shelves,
				currentShelf;

			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1262);
if (fieldName && ev.src !== ADD && (Lang.isFunction(sField) || fieldName === sField)) {
				// The shelf has to be emptied otherwise _findIndex may match itself.
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1264);
currentShelf = shelves.splice(currentIndex,1)[0];
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1265);
index = this._findIndex(currentShelf._values);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1266);
shelves.splice(index,0,currentShelf);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1267);
this._currentIndex = index;
			}
		},
		/**
		 * Finds the correct index position of a record within the shelves
		 * according to the current sortField and sortDir
		 * @method _findIndex
		 * @param values {Object} values of the record to be located
		 * @return {Integer} location for the record
		 * @private
		 */
		_findIndex: function (values) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_findIndex", 1278);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1279);
var shelves = this._shelves,
				low = 0, 
				high = shelves.length, 
				index = 0,
				cmp = this._compare,
				vals = {_values: values};
				
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1286);
while (low < high) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1287);
index = Math.floor((high + low) / 2);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1288);
switch(cmp(vals, shelves[index])) {
					case 1:
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1290);
low = index + 1;
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1291);
break;
					case -1:
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1293);
high = index;
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1294);
break;
					default:
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1296);
low = high = index;
				}
				
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1300);
return low;
			
		},
		/**
		 * Adds a new record at its proper position according to the sort configuration.
		 * It overrides GalleryModelMultiRecord's own add method, ignoring the index position requested, if any.
		 * The new record becomes the current.
		 * @method add
		 * @param values {Object} set of values to set
		 */
		add: function(values) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "add", 1310);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1311);
var shelves = this._shelves,
				index = 0;
				
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1314);
index = this._findIndex(values);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1315);
this._currentIndex = index;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1316);
shelves.splice(index, 0, {});
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1317);
this._initNew();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1318);
this.setValues(values, ADD);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1319);
this._shelve(index);
		},
		/**
		 * Locates a record by value.  The record will be located by the field
		 * given in the sortField attribute.   It will return the index of the
		 * record in the shelves or null if not found.
		 * By default it will expose that record.
		 * If sortField contains a function, it will return null and do nothing.
		 * Since sort fields need not be unique, find may return any of the records
		 * with the same value for that field.
		 * @method find
		 * @param value {Any} value to be found
		 * @param [move] {Boolean} exposes the record found, defaults to true
		 * @return {integer | null} index of the record found or null if not found.
		 * Be sure to differentiate a return of 0, a valid index, from null, a failed search.
		 */
		find: function (value, move) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "find", 1335);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1336);
var sfield = this.get(SFIELD),
				index,
				values = {};
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1339);
if (Lang.isFunction(sfield)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1340);
return null;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1342);
values[sfield] = value;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1343);
index = this._findIndex(values);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1344);
if (this._shelves[index]._values[sfield] !== value) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1345);
return null;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1347);
if (move || arguments.length < 2) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1348);
this.set(INDEX, index);
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1350);
return index;
		}
	};
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1353);
SMR.ATTRS = {
		/**
		 * Name of the field to sort by or function to build the value used for comparisson.
		 * If a function, it will receive a reference to the record to be sorted;
		 * it should return the value to be used for comparisson.  Functions are
		 * used when sorting on multiple keys, which the function should return
		 * concatenated, or when any of the fields needs some pre-processing.
		 * @attribute sortField
		 * @type String | Function
		 * @default first primary key field
		 */
		sortField: {
			validator: function (value){
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "validator", 1365);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1366);
return Lang.isString(value) || Lang.isFunction(value);
			}
		},
		/**
		 * Sort direction either "asc" for ascending or "desc" for descending
		 * @attribute sortDir
		 * @type String
		 * @default "asc"
		 */
		sortDir: {
			validator: function (value) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "validator", 1376);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1377);
return value === DESC || value === ASC;
			},
			value: ASC
		}
	};
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1382);
Y.GalleryModelSortedMultiRecord = SMR;
	
	/**
	 * Extension to store the records in the GalleryModel using the field in the primaryKeys as its index.
	 * The primary key must be a single unique integer field.
	 * It should be used along Y.GalleryModelMultiRecord.
	 * It is incompatible with Y.GalleryModelSortedMultiRecord.
	 * @class Y.GalleryModelPrimaryKeyIndex
	 */
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1391);
var PKI = function () {};
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1392);
PKI.prototype = {
		/**
		 * Adds a new record at the index position given by its primary key.
		 * The new record becomes the current.
		 * @method add
		 * @param values {Object} set of values to set
		 */
		add: function(values) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "add", 1399);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1400);
if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1401);
this._shelve();
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1403);
this._currentIndex = values[this._primaryKeys[0]];
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1404);
this._initNew();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1405);
this.setValues(values, ADD);
		},
		/**
		 * Default action for the loaded event, checks if the parsed response is an array
		 * and saves it into the shelves using the value of the primary key field for its index.
		 * The model will be left positioned at the item with the lowest key value.
		 * If the primary key field has not been declared, items will not be loaded.
		 * If the primary key field is not unique, the duplicate will overwrite the previous.
		 * @method _defDataLoaded
		 * @param ev {EventFacade} facade produced by load.
		 * @private
		 */
		_defDataLoaded: function (ev) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_defDataLoaded", 1417);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1418);
var self = this,
				shelves = self._shelves,
				pk = self._primaryKeys[0];
				
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1422);
if (Lang.isUndefined(pk)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1423);
return;
			}	
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1425);
if (self.get(IS_MODIFIED) || !self.get(IS_NEW)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1426);
self._shelve();
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1428);
YArray.each(new YArray(ev.parsed), function (values) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 18)", 1428);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1429);
shelves[values[pk]] = {
					_values: values,
					_loadedValues: Y.clone(values),
					isNew: false,
					isModified:false
				};
			});
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1436);
YArray.some(shelves, function (shelf, index) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 19)", 1436);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1437);
self._fetch(index);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1438);
return true;
			});
			
		},
		/**
		 * Sugar method added because items might not be contiguous so 
		 * adding one to the index does not always get you to the next item.
		 * If there is no next element, null will be returned and the
		 * collection will still point to the last item.
		 * @method next
		 * @return {integer} index of the next item or null if none found
		 */
		next: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "next", 1450);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1451);
if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1452);
this._shelve();
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1454);
var shelves = this._shelves,
				index = this._currentIndex + 1, 
				l = shelves.length;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1457);
while (index < l && !shelves.hasOwnProperty(index)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1458);
index +=1;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1460);
if (index === l) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1461);
return null;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1463);
this._fetch(index);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1464);
return index;
		},
		/**
		 * Sugar method added because items might not be contiguous so 
		 * subtracting one to the index does not always get you to the previous item.
		 * If there is no next element, null will be returned and the
		 * collection will still point to the first item.
		 * @method next
		 * @return {integer} index of the next item or null if none found
		 */
		previous: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "previous", 1474);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1475);
if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1476);
this._shelve();
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1478);
var shelves = this._shelves,
				index = this._currentIndex - 1;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1480);
while (index >= 0 && !shelves.hasOwnProperty(index)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1481);
index -=1;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1483);
if (index === -1) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1484);
return null;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1486);
this._fetch(index);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1487);
return index;
		}
		
	};
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1491);
Y.GalleryModelPrimaryKeyIndex = PKI;



}, 'gallery-2012.08.22-20-00' ,{requires:['base'], skinnable:false});
