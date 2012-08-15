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
_yuitest_coverage["/build/gallery-md-model/gallery-md-model.js"].code=["YUI.add('gallery-md-model', function(Y) {","","/**","Record-based data model with APIs for getting, setting, validating, and","syncing attribute values, as well as events for being notified of model changes."," ","@module gallery-md-model","**/"," ","/**","Record-based data model with APIs for getting, setting, validating, and","syncing attribute values, as well as events for being notified of model changes."," ","In most cases, you'll want to create your own subclass of Y.GalleryModel and","customize it to meet your needs. In particular, the sync() and validate()","methods are meant to be overridden by custom implementations. You may also want","to override the parse() method to parse non-generic server responses."," ","@class Y.GalleryModel","@constructor","@param [cfg] {Object} Initial configuration attribute plus:","@param [cfg.values] {Object}  Sets initial values for the model.  ","	Model will be marked as new and not modified (as if just loaded).","@extends Base","**/","	\"use strict\";","	","	var Lang = Y.Lang,","		YArray = Y.Array,","		YObject = Y.Object,","		EVT_CHANGE = 'change',","		EVT_LOADED = 'loaded',","		EVT_ERROR = 'error',","		EVT_SAVED = 'saved',","		EVT_RESET = 'reset',","		IS_MODIFIED = 'isModified',","		IS_NEW = 'isNew',","		DOT = '.',","		CHANGE = 'Change';","	","","	Y.GalleryModel = Y.Base.create(","		'gallery-md-model',","		Y.Base, ","		[],","		{","			/**","			 * Hash of values indexed by field name","			 * @property _values","			 * @type Object","			 * @private","			 */","			_values: null,","			/**","			 * Hash of values as loaded from the remote source, ","			 * presumed to be the current value there.","			 * @property _loadedValues","			 * @type Object","			 * @private","			 */","			_loadedValues: null,","			/**","			 * Array of field names that make up the primary key for this record","			 * @property _primaryKeys","			 * @type Array","			 * @private","			 */","			_primaryKeys: null,","			/*","			 * Y.Base lifecycle method","			 */","			initializer: function  (cfg) {","				this._values = {};","				this._loadedValues = {};","				/**","				 * Fired whenever a data value is changed.","				 * @event change","				 * @param {String} ev.name Name of the field changed","				 * @param {Any} ev.newVal New value of the field.","				 * @param {Any} ev.prevVal Previous value of the field.","				 * @param {String|null} ev.src Source of the change event, if any.","				 */","				this.publish(EVT_CHANGE, {","					defaultFn: this._defSetValue","				});","				/**","				 * Fired when new data has been received from the remote source.  ","				 * It will be fired even on a save operation if the response contains values.","				 * The parsed values can be altered on the before (on) listener.","				 * @event loaded","				 * @param {Object} ev.response Response data as received from the remote source","				 * @param {Object} ev.parsed Data as returned from the parse method.","				 */","				this.publish(EVT_LOADED, {","					defaultFn:this._defDataLoaded","				});","				/**","				 * Fired when the data has been saved to the remote source","				 * The event cannot be prevented.","				 * @event saved","				 */","				this.publish(EVT_SAVED, {","					preventable: false","				});","				cfg = cfg || {};","				if (Lang.isObject(cfg.values)) {","					this.setValues(cfg.values, 'init');","					this._set(IS_MODIFIED, false);","					this._set(IS_NEW, true);","					this._loadedValues = Y.clone(this._values);","				}","			},","			/**","			 * Destroys this model instance and removes it from its containing lists, if","			 * any.","","			 * If there are any arguments then this method also delegates to the","			 * sync() method to delete the model from the persistence layer, which is an","			 * asynchronous action and thus requires at least a callback","			 * otherwise, it returns immediately.","","			 * @method destroy","			 * @param [options] {Object} Options passed on to the sync method, if required.","			 * @param [callback] {function} function to be called when the sync operation finishes.","			 *		@param callback.err {string|null} Error message, if any or null.","			 *		@param callback.response {Any} The server response as received by sync(),","			 * @chainable","			 */","			destroy: function (options, callback) {","				if (typeof options === 'function') {","					callback = options;","					options = {};","				} else if (!options) {","					options = {};","				}","				var self = this,","					finish = function (err) {","						if (!err) {","							YArray.each(self.lists.concat(), function (list) {","								list.remove(self, options);","							});","","							Y.GalleryModel.superclass.destroy.call(self);","						}","","						callback && callback.apply(null, arguments);","					};","","				if (callback || options) {","					this.sync('delete', options, finish);","				} else {","					finish();","				}","","				return this;","			},","			/**","			 * Returns the value of the field named","			 * @method getValue","			 * @param name {string}  Name of the field to return.","			 * @return {Any} the value of the field requested.  ","			 */ ","			getValue: function (name) {","				return this._values[name];","			},","			/**","			 * Returns a hash with all values using the field names as keys.","			 * @method getValues","			 * @return {Object} a hash with all the fields with the field names as keys.","			 */ ","			getValues: function() {","				return Y.clone(this._values);","			},","			/**","			 * Sets the value of the named field. ","			 * Fires the change event if the value is different from the current one.","			 * Primary key fields cannot be changed unless still undefined.","			 * @method setValue","			 * @param name {string} Name of the field to be set","			 * @param value {Any} Value to be assigned to the field","			 * @param [src] {Any} Source of the change in the value.","			 */","			setValue: function (name, value, src) {","				var prevVal = this._values[name];","				if (prevVal !== value && (this._primaryKeys.indexOf(name) === -1 || Lang.isUndefined(prevVal))) {","					this.fire(EVT_CHANGE, {","						name:name,","						newVal:value,","						prevVal:prevVal,","						src: src","					});","				}","			},","			/**","			 * Default function for the change event, sets the value and marks the model as modified.","			 * @method _defSetValue","			 * @param ev {EventFacade} (see change event)","			 * @private","			 */","			_defSetValue: function (ev) {","				var self = this;","				if (ev.name) {","					self._values[ev.name] = ev.newVal;","					self._set(IS_MODIFIED, true);","				} else {","					YObject.each(ev.newVals, function (value, name) {","						self.setValue(name, value, ev.src);","					});","				}","			},","			/**","			 * Sets a series of values.   It simply loops over the hash of values provided calling setValue on each.","			 * @method setValues","			 * @param values {Object} hash of values to change","			 * @param [src] {Any} Source of the changes","			 */","			setValues: function (values, src) {","				var self = this,","					prevVals = {};","					","				YObject.each(values, function (value, name) {","					prevVals[name] = self.getValue(name);","				});","				this.fire(EVT_CHANGE, {","					newVals:values,","					prevVals:prevVals,","					src: src","				});","			},","			/**","			 * Returns a hash indexed by field name, of all the values in the model that have changed since the last time","			 * they were synchornized with the remote source.   Each entry has a prevVal and newVal entry.","			 * @method getChangedValues","			 * @return {Object} Has of all entries changed since last synched, each entry has a newVal and prevVal property contaning original and changed values.","			 */","			getChangedValues: function() {","				var changed = {}, ","					prev, ","					loaded = this._loadedValues;","","				YObject.each(this._values, function (value, name) {","					prev = loaded[name];","					if (prev !== value) {","						changed[name] = {prevVal:prev, newVal: value};","					}","				});","				return changed;","			},","			/**","			 * Returns a hash with the values of the primary key fields, indexed by their field names","			 * @method getPKValues","			 * @return {Object} Hash with the primary key values, indexed by their field names","			 */","			getPKValues: function () {","				var pkValues = {},","					self = this;","				YArray.each(self.get('primaryKeys'), function (name) {","					pkValues[name] = self._values[name];","				});","				return pkValues;","			},","			/**","				Returns an HTML-escaped version of the value of the specified string","				attribute. The value is escaped using Y.Escape.html().","","				@method getAsHTML","				@param {String} name Attribute name or object property path.","				@return {String} HTML-escaped attribute value.","			**/","			getAsHTML: function (name) {","				var value = this.getValue(name);","				return Y.Escape.html(Lang.isValue(value) ? String(value) : '');","			},","","			/**","			 * Returns a URL-encoded version of the value of the specified field,","			 * or a full URL with name=value sets for all fields if no name is given.","			 * The names and values are encoded using the native encodeURIComponent()","			 * function.","","			 * @method getAsURL","			 * @param [name] {String}  Field name.","			 * @return {String} URL-encoded field value if name is given or URL encoded set of name=value pairs for all fields.","			 */","			getAsURL: function (name) {","				var value = this.getValue(name),","					url = [];","				if (name) {","					return encodeURIComponent(Lang.isValue(value) ? String(value) : '');","				} else {","					YObject.each(value, function (value, name) {","						if (Lang.isValue(value)) {","							url.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));","						}","					});","					return url.join('&');","				}","			},","","			/**","			 * Default function for the loaded event. Does the actual setting of the values just loaded.","			 * @method _defDataLoaded","			 * @param ev {EventFacade} see loaded event","			 * @private","			 */","			_defDataLoaded: function (ev) {","				var self = this;","				self.setValues(ev.parsed, ev.src);","				self._set(IS_MODIFIED, false);","				self._set(IS_NEW, false);","				self._loadedValues = Y.clone(self._values);","			},","			/**","				Loads this model from the server.","","				This method delegates to the sync() method to perform the actual load","				operation, which is an asynchronous action. Specify a _callback_ function to","				be notified of success or failure.","","				A successful load operation will fire a loaded event, while an unsuccessful","				load operation will fire an error event with the src value \"load\".","","				@method load","				@param options {Object} Options to be passed to sync().","					Usually these will be or will include the keys used by the remote source ","					to locate the data to be loaded.","					They will be passed on unmodified to the sync method.","					It is up to sync to determine what they mean.","				@param [callback] {callback}  Called when the sync operation finishes. Callback will receive:","					@param callback.err {string|null} Error message, if any or null.","					@param callback.response {Any} The server response as received by sync(),","				@chainable","			**/","			load: function (options, callback) {","				var self = this;","","				if (typeof options === 'function') {","					callback = options;","					options = {};","				} else if (!options) {","					options = {};","				}","","				self.sync('read', options, function (err, response) {","					var facade = {","							options : options,","							response: response,","							src: 'load'","						};","","					if (err) {","						facade.error = err;","","						self.fire(EVT_ERROR, facade);","					} else {","						self._values = {};","","						facade.parsed = self.parse(response);","						self.fire(EVT_LOADED, facade);","					}","","					callback && callback.apply(null, arguments);","				});","","				return self;","			},","","			/**","				Called to parse the _response_ when a response is received from the server.","				This method receives a server _response_ and is expected to return a","				value hash.","","				The default implementation assumes that _response_ is either an attribute","				hash or a JSON string that can be parsed into an attribute hash. If","				_response_ is a JSON string and either Y.JSON or the native JSON object","				are available, it will be parsed automatically. If a parse error occurs, an","				error event will be fired and the model will not be updated.","","				You may override this method to implement custom parsing logic if necessary.","","				@method parse","				@param {Any} response Server response.","				@return {Object} Values hash.","			**/","			parse: function (response) {","				if (typeof response === 'string') {","					try {","						return Y.JSON.parse(response);","					} catch (ex) {","						this.fire(EVT_ERROR, {","							error : ex,","							response: response,","							src : 'parse'","						});","","						return null;","					}","				}","","				return response;","			},","","","","			/**","				Saves this model to the server.","","				This method delegates to the sync() method to perform the actual save","				operation, which is an asynchronous action. Specify a _callback_ function to","				be notified of success or failure.","","				A successful save operation will fire a saved event, while an unsuccessful","				load operation will fire an error event with the src value \"save\".","","				If the save operation succeeds and the parse method returns non-empty values","				within the response	a loaded event will also be fired to read those values.","","				@method save","				@param {Object} [options] Options to be passed to sync() and to set()","					when setting synced attributes. It's up to the custom sync implementation","					to determine what options it supports or requires, if any.","				@param {Function} [callback] Called when the sync operation finishes.","					@param callback.err {string|null} Error message, if any or null.","					@param callback.response {Any} The server response as received by sync(),","				@chainable","			**/","			save: function (options, callback) {","				var self = this;","","				if (typeof options === 'function') {","					callback = options;","					options = {};","				} else if (!options) {","					options = {};","				}","","				self._validate(self.getValues(), function (err) {","					if (err) {","						callback && callback.call(null, err);","						return;","					}","","					self.sync(self.get(IS_NEW) ? 'create' : 'update', options, function (err, response) {","						var facade = {","								options : options,","								response: response,","								src: 'save'","							};","","						if (err) {","							facade.error = err;","","							self.fire(EVT_ERROR, facade);","						} else {","							facade.parsed = self.parse(response);","","							self._set(IS_MODIFIED, false);","							self._set(IS_NEW, false);","							self._loadedValues = Y.clone(self._values);","							self.fire(EVT_SAVED, facade);","							if (facade.parsed) {","								self.fire(EVT_LOADED, facade);","							}","						}","","						callback && callback.apply(null, arguments);","					});","				});","","				return self;","			},","			/**","			 * Restores the values when last loaded, saved or created.","			 * @method reset","			 */","			reset: function() {","				this._values = Y.clone(this._loadedValues);","				this.fire(EVT_RESET);","				return this;","			},","			/**","				Override this method to provide a custom persistence implementation for this","				model. The default just calls the callback without actually doing anything.","","				This method is called internally by load(), save(), and destroy().","","				@method sync","				@param {String} action Sync action to perform. May be one of the following:","","					* create: Store a newly-created model for the first time.","					* read  : Load an existing model.","					* update: Update an existing model.","					* delete: Delete an existing model.","","				@param {Object} [options] Sync options. It's up to the custom sync","					implementation to determine what options it supports or requires, if any.","				@param {Function} [callback] Called when the sync operation finishes.","					@param {Error|null} callback.err If an error occurred, this parameter will","						contain the error. If the sync operation succeeded, _err_ will be","						falsy.","					@param {Any} [callback.response] The server's response. This value will","						be passed to the parse() method, which is expected to parse it and","						return an attribute hash.","			**/","			sync: function (action, options, callback) {","","				if (typeof callback === 'function') {","					callback();","				}","			},","			/**","				Override this method to provide custom validation logic for this model.","","				While attribute-specific validators can be used to validate individual","				attributes, this method gives you a hook to validate a hash of all","				attributes before the model is saved. This method is called automatically","				before save() takes any action. If validation fails, the save() call","				will be aborted.","","				In your validation method, call the provided callback function with no","				arguments to indicate success. To indicate failure, pass a single argument,","				which may contain an error message, an array of error messages, or any other","				value. This value will be passed along to the error event.","","				@example","","				model.validate = function (attrs, callback) {","				if (attrs.pie !== true) {","				// No pie?! Invalid!","				callback('Must provide pie.');","				return;","				}","","				// Success!","				callback();","				};","","				@method validate","				@param {Object} attrs Attribute hash containing all model attributes to","				be validated.","				@param {Function} callback Validation callback. Call this function when your","				validation logic finishes. To trigger a validation failure, pass any","				value as the first argument to the callback (ideally a meaningful","				validation error of some kind).","","				@param {Any} [callback.err] Validation error. Don't provide this","				argument if validation succeeds. If validation fails, set this to an","				error message or some other meaningful value. It will be passed","				along to the resulting error event.","			**/","			validate: function (attrs, callback) {","				callback && callback();","			},","			/**","				Calls the public, overridable validate() method and fires an error event","				if validation fails.","","				@method _validate","				@param {Object} attributes Attribute hash.","				@param {Function} callback Validation callback.","				@param {Any} [callback.err] Value on failure, non-value on success.","				@protected","			**/","			_validate: function (attributes, callback) {","				var self = this;","","				self.validate(attributes, function (err) {","					if (Lang.isValue(err)) {","						// Validation failed. Fire an error.","						self.fire(EVT_ERROR, {","							attributes: attributes,","							error : err,","							src : 'validate'","						});","","						callback(err);","						return;","					}","","					callback();","				});","","			},","			/**","				Returns a copy of this model's attributes that can be passed to","				Y.JSON.stringify() or used for other nefarious purposes.","","				The clientId attribute is not included in the returned object.","","				If you've specified a custom attribute name in the idAttribute property,","				the default id attribute will not be included in the returned object.","","				@method toJSON","				@return {Object} Copy of this model's attributes.","			**/","			toJSON: function () {","				return this.getValue();","			},","			_isModifiedGetter: function (value, name) {","				name = name.split(DOT);","				if (name.length > 1) {","					name = name[1];","					var ret = {};","					ret[name] = this._values[name] !== this._loadedValues[name];","					return ret;","				} else {","					return value;","				}","","			},","			_isNewGetter: function (value, name) {","				name = name.split(DOT);","				if (name.length > 1) {","					name = name[1];","					var ret = {};","					ret[name] = !this._loadedValues.hasOwnProperty(name);","					return ret;","				} else {","					return value;","				}","			},","			_primaryKeysSetter: function (value) {","				if (this._primaryKeys && this._primaryKeys.length) {","					return Y.Attribute.INVALID_VALUE;","				}","				value = new YArray(value);","				this._primaryKeys = value;","				return value;","			},","			_primaryKeysGetter: function (value, name) {","				name = name.split(DOT);","				if (name.length > 1) {","					name = name[1];","					var ret = {};","					ret[name] = value.indexOf(name) !== -1;","					return ret;","				} else {","					return (value || []).concat();  // makes sure to return a copy, not the original.","				}","			}","		},","		{","			ATTRS: {","				/**","				 * Indicates whether any of the fields has been changed since created or loaded.","				 * Field names can be given as sub-attributes to indicate if any particular field has beeen changed.","				 * model.get('isModified.name') returns true if the field _name_ has been modified.","				 * <b>Note:</b> contrary to common practice in Attributes with sub-attributes, ","				 * requesting the state of the record does not","				 * return an object with the state of each individual field keyed by field name,","				 * but the state of the record as a whole, which is far more useful.","				 * @attribute isModified","				 * @type Boolean","				 * @readonly","				 * @default false","				 */","				isModified: {","					readOnly: true,","					value:false,","					validator:Lang.isBoolean,","					getter: '_isModifiedGetter'","				},","				/**","				 * Indicates that the model is new and has not been modified since creation.","				 * Field names can be given as sub-attributes to indicate if any particular field is new.","				 * model.get('isNew.name') returns true if the field _name_ is new.","				 * <b>Note:</b> contrary to common practice in Attributes with sub-attributes, ","				 * requesting the state of the record does not","				 * return an object with the state of each individual field keyed by field name,","				 * but the state of the record as a whole, which is far more useful.","				 * @attribute isNew","				 * @type Boolean","				 * @readonly","				 * @default true","				 */","				isNew: {","					readOnly: true,","					value:true,","					validator:Lang.isBoolean,","					getter: '_isNewGetter'","				},","				/**","				 * List of fields making the primary key of this model. ","				 * Primary Key fields cannot be modified once initially loaded.","				 * It can be set as an array of field names or, if the key is made of a single field, a string with the name of that field.","				 * It will always be returned as an array.","				 * Field names can be given as a sub-attribute to ask whether a particular field is a primary key, thus:","				 * model.get('primaryKeys.name') returns true of the field name is a primary key.","				 * It can only be set once.","				 * @attribute primaryKeys","				 * @writeonce","				 * @type array","				 * @default []","				 */","				primaryKeys: {","					setter:'_primaryKeysSetter',","					getter:'_primaryKeysGetter',","					lazyAdd: false,","					value: []","				}","			}","","		}","	);","		","	/**","	 * An extension for Y.GalleryModel that provides a single level of undo for each field.","	 * @class Y.GalleryModelSimpleUndo","	 */","	Y.GalleryModelSimpleUndo = function () {};","	","	Y.GalleryModelSimpleUndo.prototype = {","		initializer: function () {","			this._lastChange = {};","			this._preserve = (this._preserve || []).concat('_lastChange');","			this.after(EVT_CHANGE, this._trackChange);","			this.after([EVT_LOADED,EVT_SAVED,EVT_RESET], this._resetUndo);	","		},","		/**","		 * Event listener for the after value change event, it tracks changes for each field.  ","		 * It retains only the last change for each field.","		 * @method _trackChange","		 * @param ev {EventFacade} As provided by the change event","		 * @private","		 */","		_trackChange: function (ev) {","			if (ev.name && ev.src !== 'undo') {","				this._lastChange[ev.name] = ev.prevVal;","			}","		},","		/**","		 * After load or save operations, it drops any changes it might have tracked.","		 * @method _resetUndo","		 * @private","		 */","		_resetUndo: function () {","			this._lastChange = {};","		},","		/**","		 * Reverts one level of change for a specific field or all fields","		 * @method undo","		 * @param [name] {String} If provided it will undo that particular field,","		 *	otherwise, it undoes the whole record.","		 */","		undo: function (name) {","			var self = this;","			if (name) {","				if (self._lastChange[name] !== undefined) {		","					self.setValue(name, self._lastChange[name], 'undo');","					delete self._lastChange[name];","				}","			} else {","				self.setValues(this._lastChange, 'undo');","				self._lastChange = {};","			}","		}","	};","	","	/**","	 * Provides multiple levels of undo in strict chronological order ","	 * whatever the field was at each stage.","	 * Changes done on multiple fields via setValues","	 * will also be undone in one step.","	 * @class Y.GalleryModelChronologicalUndo","	 */","	Y.GalleryModelChronologicalUndo = function () {};","	","	Y.GalleryModelChronologicalUndo.prototype = {","		initializer: function () {","			this._changes = [];","			this._preserve = (this._preserve || []).concat('_changes');","			this.after(EVT_CHANGE, this._trackChange);","			this.after([EVT_LOADED,EVT_SAVED,EVT_RESET], this._resetUndo);","		},","		/**","		 * Event listener for the after value change event, it tracks changes for each field.  ","		 * It keeps a stack of each change.  ","		 * @method _trackChange","		 * @param ev {EventFacade} As provided by the change event","		 * @private","		 */","		_trackChange: function (ev) {","			if (ev.src !== 'undo') {","				this._changes.push(ev.details);","			}","		},","		/**","		 * After load or save operations, it drops any changes it might have tracked.","		 * @method _resetUndo","		 * @private","		 */","		_resetUndo: function () {","			this._changes = [];","		},","		/**","		 * Reverts one level of field changes.","		 * @method undo","		 */","		undo: function () {","			var ev = this._changes.pop();","			if (ev) {","				if (ev.name) {","					this.setValue(ev.name, ev.prevVal, 'undo');","				} else {","					this.setValues(ev.prevVals, 'undo');","				}","			}","			if (this._changes.length === 0) {","				this._set(IS_MODIFIED, false);","			}","		}","	};","	","	/**","	 * Allows GalleryModel to handle a set of records using the Flyweight pattern.","	 * It exposes one record at a time from a shelf of records.","	 * Exposed records can be selected by setting the _index_ attribute.","	 * @class Y.GalleryModelMultiRecord","	 */","	","	var INDEX = 'index',","		MR = function () {};","	","	MR.prototype = {","		initializer: function () {","			this._shelves = [];","			this._currentIndex = 0;","			this.on(EVT_LOADED, this._batchLoad);","		},","		/**","		 * Index of the shelf for the record being exposed.","		 * Use index attribute to check/set the index value.","		 * @property _currentIndex","		 * @type integer","		 * @default 0","		 * @private","		 */","		_currentIndex: 0,","		/**","		 * Storage for the records when not exposed.","		 * @property _shelves","		 * @type Array","		 * @private","		 */","		_shelves: null,","		/**","		 * Saves the exposed record into the shelves at the position given by _currentIndex","		 * @method _shelve","		 * @private","		 */","		_shelve: function(index) {","			if (index === undefined) {","				index = this._currentIndex;","			}","			var self = this,","				current = {","					_values: self._values,","					_loadedValues: self._loadedValues,","					isNew: self.get(IS_NEW),","					isModified: self.get(IS_MODIFIED)","				};","			YArray.each(self._preserve, function (name) {","				current[name] = self[name];","			});","			self._shelves[index] = current;","			","		},","		/**","		 * Retrives and exposes the record from the shelf at the position given by _currentIndex","		 * @method _fetch","		 * @private","		 */","		_fetch: function (index) {","			if (index === undefined) {","				index = this._currentIndex;","			}","			var self = this,","				current = self._shelves[index];","				","			self._values = current._values;","			self._loadedValues = current._loadedValues;","			self._setStateVal(IS_NEW, current.isNew);","			self._setStateVal(IS_MODIFIED, current.isModified);","			YArray.each(self._preserve, function (name) {","				self[name] = current[name];","			});","			","		},","		/**","		 * Initializes an exposed record","		 * @method _initNew","		 * @private","		 */","		_initNew: function () {","			this._values = {};","			this._loadedValues = {};","			this._set(IS_NEW, true);","			this._set(IS_MODIFIED, false);","		},","		/**","		 * Adds a new record at the index position given or at the end.","		 * The new record becomes the current.","		 * @method add","		 * @param values {Object} set of values to set","		 * @param [index] {Integer} position to add the values at or at the end if not provided.  ","		 */","		add: function(values, index) {","			if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {","				this._shelve();","			}","			if (arguments.length === 2) {","				this._shelves.splice(index, 1);","			} else {","				index = this._shelves.length;","			}","			this._currentIndex = index;","			this._initNew();","			this.setValues(values, 'add');","		},","		/**","		 * Executes the given function for each record in the set.","		 * Returning exactly false from the function spares shelving the record.","		 * If function does not modify the record, returning false will improve performance.","		 * @method each","		 * @param fn {function} function to execute, it will be provided with:","		 * @param fn.index {integer} index of the record exposed","		 */","		each: function(fn) {","			var i, l, self = this;","			this._shelve();","			for (i = 0, l = this._shelves.length; i < l; i += 1) {","				this._currentIndex = i;","				this._fetch(i);","				if (fn.call(self, i) !== false) {","					this._shelve(i);","				}","			}","		},","		/**","		 * Executes the given function for each record in the set.","		 * It is faster than using each and then checking for isModified","		 * Returning exactly false from the function spares shelving the record.","		 * If function does not modify the record, returning false will improve performance.","		 * @method eachModified","		 * @param fn {function} function to execute, it will be provided with:","		 * @param fn.index {integer} index of the record exposed","		 */","		eachModified:function(fn) {","			var i, l, self = this;","			this._shelve();","			for (i = 0, l = this._shelves.length; i < l; i += 1) {","				if (this._shelves[i][IS_MODIFIED]) {","					this._currentIndex = i;","					this._fetch(i);","					if (fn.call(self, i) !== false) {","						this._shelve(i);","					}","				}","			}","		},","		/**","		 * Calls _save_ on each record modified.","		 * This is not the best saving strategy for saving batches of records,","		 * but it is the easiest and safest.  Implementors are encouraged to ","		 * design their own.","		 * @method saveAllModified","		 */","		saveAllModified: function () {","			this.eachModified(this.save);","		},","		/**","		 * <em>This is a documentation entry only, this method does not define load.</em>","		 *    ","		 * This extension captures the _loaded_ event so that if a load ","		 * returns an array of records, they will be added to the shelves.","		 * Existing records are kept, call _empty_ if they should be discarded.","		 * See method load of Y.GalleryModel for further info.","		 * @method load","		 */","		/**","		 * Listener for the loaded event, checks if the parsed response is an array","		 * and saves it into the shelves.","		 * @method _batchLoad","		 * @param ev {EventFacade} facade produced by load.","		 * @private","		 */","		_batchLoad: function (ev) {","			var self = this;","			if (ev.src === 'load' && Y.Lang.isArray(ev.parsed)) {","				ev.halt();","				YArray.each(ev.parsed, function (values) {","					self.add(values);","				});","			}","		},","		/**","		 * Returns the number of records stored","		 * @method size","		 * @return {Integer} number of records in the shelves","		 */","		size: function() {","			return this._shelves.length;","		},","		/**","		 * Empties the shelves of any records as well as the exposed record","		 * @method empty","		 */","		empty: function () {","			this._shelves = [];","			this._currentIndex = 0;","			this.reset();","		},","		/**","		 * Setter for the _index_ attribute.","		 * Validates and copies the current index value into _currentIndex.","		 * @method _indexSetter","		 * @param value {integer} new value for the index","		 * @return {integer|INVALID_VALUE} new value for the index or INVALID_VALUE if invalid.","		 * @private","		 */","		_indexSetter: function (value) {","			if (Lang.isNumber(value) && value >= 0 && value < this._shelves.length) {","				this._shelve(this._currentIndex);","				this._currentIndex = value = parseInt(value,10);","				this._fetch(value);","				return value;","			} else {","				return Y.Attribute.INVALID_VALUE;","			}","		},","		/**","		 * Getter for the _index_ attribute","		 * Returns the value from _currentIndex","		 * @method _indexGetter","		 * @return {integer} value of the index","		 * @private","		 */","		_indexGetter: function (value) {","			return this._currentIndex;","		}","		","	};","	","	MR.ATTRS = {","		/**","		 * Index of the record exposed.","		 * @attribute index","		 * @type Integer","		 * @default 0","		 */","		index: {","			value: 0,","			setter:'_indexSetter',","			getter:'_indexGetter'","		}","	};","	","	Y.GalleryModelMultiRecord = MR;","	","	/**","	 * Extension to sort records stored in GalleryModel, extended with GalleryModelMultiRecord","	 * @class Y.GalleryModelSortedMultiRecord","	 */","	var SFIELD = 'sortField',","		SDIR = 'sortDir',","		ASC = 'asc',","		DESC = 'desc',","		SMR = function () {};","	","	SMR.prototype = {","		/**","		 * Compare function used in sorting.","		 * @method _compare","		 * @param a {object} shelf to compare","		 * @param b {object} shelf to compare","		 * @return {integer} -1, 0 or 1 as required by Array.sort","		 * @private","		 */","		_compare: null,","		/**","		 * Initializer lifecycle method.  ","		 * Ensures proper defaults, sets the compare method and","		 * sets listeners for relevant events","		 * @method initializer","		 * @protected","		 */","		initializer: function () {","			if (this.get(SFIELD) === undefined) {","				this._set(SFIELD, this.get('primaryKeys')[0]);","			}","			this._setCompare();","			this.after([SFIELD + CHANGE, SDIR + CHANGE], this._sort);","			this.after('change', this._afterChange);","		},","		/**","		 * Sets the compare function to be used in sorting the records","		 * based on the sortField and sortDir and stores it into this._compare","		 * @method _setCompare","		 * @private","		 */","		_setCompare: function () {","			var sortField = this.get(SFIELD),","				sortAsc = this.get(SDIR) === ASC?1:-1,","				compareValue = (Lang.isFunction(sortField)?","					sortField:","					function(values) {","						return values[sortField];","					}","				);","			this._compare = function(a, b) {","				var aValue = compareValue(a._values),","					bValue = compareValue(b._values);","","				return (aValue < bValue ? -1 : (aValue > bValue ? 1 : 0)) * sortAsc;","			};","		},","		/**","		 * Sorts the shelves whenever the sortField or sortDir is changes","		 * @method _sort","		 * @private","		 */","		_sort: function() {","			this._setCompare();","			this._shelve();","			this._shelves.sort(this._compare);","			this._fetch();","		},","		/**","		 * Listens to value changes and if the name of the field is that of the sortField","		 * or if sortField is a function, it will relocate the record to its proper sort order","		 * @method _afterChange","		 * @param ev {EventFacade} Event façade as produced by the change event","		 * @private","		 */","		_afterChange: function (ev) {","			var fieldName = ev.name,","				sField = this.get(SFIELD),","				index,","				currentIndex = this._currentIndex,","				shelves = this._shelves,","				currentShelf;","","			if (fieldName && ev.src !== 'add' && (Lang.isFunction(sField) || fieldName === sField)) {","				// The shelf has to be emptied otherwise _findIndex may match itself.","				currentShelf = shelves.splice(currentIndex,1)[0];","				index = this._findIndex(currentShelf._values);","				shelves.splice(index,0,currentShelf);","				this._currentIndex = index;","			}","		},","		/**","		 * Finds the correct index position of a record within the shelves","		 * according to the current sortField and sortDir","		 * @method _findIndex","		 * @param values {Object} values of the record to be located","		 * @return {Integer} location for the record","		 * @private","		 */","		_findIndex: function (values) {","			var shelves = this._shelves,","				low = 0, ","				high = shelves.length, ","				index = 0,","				cmp = this._compare,","				vals = {_values: values};","				","			while (low < high) {","				index = (high + low) >> 1;","				switch(cmp(vals, shelves[index])) {","					case 1:","						low = index + 1;","						break;","					case -1:","						high = index;","						break;","					default:","						low = high = index;","				}","				","			}","			return low;","			","		},","		/**","		 * Adds a new record at its proper position according to the sort configuration.","		 * It overrides GalleryModelMultiRecord's own add method, ignoring the index position requested, if any.","		 * The new record becomes the current.","		 * @method add","		 * @param values {Object} set of values to set","		 */","		add: function(values) {","			var shelves = this._shelves,","				index = 0;","				","			index = this._findIndex(values);","			this._currentIndex = index;","			shelves.splice(index, 0, {});","			this._initNew();","			this.setValues(values, 'add');","			this._shelve(index);","		},","		/**","		 * Locates a record by value.  The record will be located by the field","		 * given in the sortField attribute.   It will return the index of the","		 * record in the shelves or null if not found.","		 * By default it will expose that record.","		 * If sortField contains a function, it will return null and do nothing.","		 * Since sort fields need not be unique, find may return any of the records","		 * with the same value for that field.","		 * @method find","		 * @param value {Any} value to be found","		 * @param [move] {Boolean} exposes the record found, defaults to true","		 * @return {integer | null} index of the record found or null if not found.","		 * Be sure to differentiate a return of 0, a valid index, from null, a failed search.","		 */","		find: function (value, move) {","			var sfield = this.get(SFIELD),","				index,","				values = {};","			if (Lang.isFunction(sfield)) {","				return null;","			}","			values[sfield] = value;","			index = this._findIndex(values);","			if (this._shelves[index]._values[sfield] !== value) {","				return null;","			}","			if (move || arguments.length < 2) {","				this.set(INDEX, index);","			}","			return index;","		}","	};","	SMR.ATTRS = {","		/**","		 * Name of the field to sort by or function to build the value used for comparisson.","		 * If a function, it will receive a reference to the record to be sorted;","		 * it should return the value to be used for comparisson.  Functions are","		 * used when sorting on multiple keys, which the function should return","		 * concatenated, or when any of the fields needs some pre-processing.","		 * @attribute sortField","		 * @type String | Function","		 * @default first primary key field","		 */","		sortField: {","			validator: function (value){","				return Lang.isString(value) || Lang.isFunction(value);","			}","		},","		/**","		 * Sort direction either \"asc\" for ascending or \"desc\" for descending","		 * @attribute sortDir","		 * @type String","		 * @default \"asc\"","		 */","		sortDir: {","			validator: function (value) {","				return value === DESC || value === ASC;","			},","			value: ASC","		}","	};","	Y.GalleryModelSortedMultiRecord = SMR;","","","","","}, 'gallery-2012.08.15-20-00' ,{requires:['base'], skinnable:false});"];
_yuitest_coverage["/build/gallery-md-model/gallery-md-model.js"].lines = {"1":0,"26":0,"28":0,"42":0,"73":0,"74":0,"83":0,"94":0,"102":0,"105":0,"106":0,"107":0,"108":0,"109":0,"110":0,"130":0,"131":0,"132":0,"133":0,"134":0,"136":0,"138":0,"139":0,"140":0,"143":0,"146":0,"149":0,"150":0,"152":0,"155":0,"164":0,"172":0,"184":0,"185":0,"186":0,"201":0,"202":0,"203":0,"204":0,"206":0,"207":0,"218":0,"221":0,"222":0,"224":0,"237":0,"241":0,"242":0,"243":0,"244":0,"247":0,"255":0,"257":0,"258":0,"260":0,"271":0,"272":0,"286":0,"288":0,"289":0,"291":0,"292":0,"293":0,"296":0,"307":0,"308":0,"309":0,"310":0,"311":0,"335":0,"337":0,"338":0,"339":0,"340":0,"341":0,"344":0,"345":0,"351":0,"352":0,"354":0,"356":0,"358":0,"359":0,"362":0,"365":0,"386":0,"387":0,"388":0,"390":0,"396":0,"400":0,"428":0,"430":0,"431":0,"432":0,"433":0,"434":0,"437":0,"438":0,"439":0,"440":0,"443":0,"444":0,"450":0,"451":0,"453":0,"455":0,"457":0,"458":0,"459":0,"460":0,"461":0,"462":0,"466":0,"470":0,"477":0,"478":0,"479":0,"507":0,"508":0,"552":0,"565":0,"567":0,"568":0,"570":0,"576":0,"577":0,"580":0,"597":0,"600":0,"601":0,"602":0,"603":0,"604":0,"605":0,"607":0,"612":0,"613":0,"614":0,"615":0,"616":0,"617":0,"619":0,"623":0,"624":0,"626":0,"627":0,"628":0,"631":0,"632":0,"633":0,"634":0,"635":0,"636":0,"638":0,"710":0,"712":0,"714":0,"715":0,"716":0,"717":0,"727":0,"728":0,"737":0,"746":0,"747":0,"748":0,"749":0,"750":0,"753":0,"754":0,"766":0,"768":0,"770":0,"771":0,"772":0,"773":0,"783":0,"784":0,"793":0,"800":0,"801":0,"802":0,"803":0,"805":0,"808":0,"809":0,"821":0,"824":0,"826":0,"827":0,"828":0,"852":0,"853":0,"855":0,"862":0,"863":0,"865":0,"874":0,"875":0,"877":0,"880":0,"881":0,"882":0,"883":0,"884":0,"885":0,"895":0,"896":0,"897":0,"898":0,"908":0,"909":0,"911":0,"912":0,"914":0,"916":0,"917":0,"918":0,"929":0,"930":0,"931":0,"932":0,"933":0,"934":0,"935":0,"949":0,"950":0,"951":0,"952":0,"953":0,"954":0,"955":0,"956":0,"969":0,"988":0,"989":0,"990":0,"991":0,"992":0,"1002":0,"1009":0,"1010":0,"1011":0,"1022":0,"1023":0,"1024":0,"1025":0,"1026":0,"1028":0,"1039":0,"1044":0,"1058":0,"1064":0,"1070":0,"1088":0,"1089":0,"1091":0,"1092":0,"1093":0,"1102":0,"1107":0,"1110":0,"1111":0,"1114":0,"1123":0,"1124":0,"1125":0,"1126":0,"1136":0,"1143":0,"1145":0,"1146":0,"1147":0,"1148":0,"1160":0,"1167":0,"1168":0,"1169":0,"1171":0,"1172":0,"1174":0,"1175":0,"1177":0,"1181":0,"1192":0,"1195":0,"1196":0,"1197":0,"1198":0,"1199":0,"1200":0,"1217":0,"1220":0,"1221":0,"1223":0,"1224":0,"1225":0,"1226":0,"1228":0,"1229":0,"1231":0,"1234":0,"1247":0,"1258":0,"1263":0};
_yuitest_coverage["/build/gallery-md-model/gallery-md-model.js"].functions = {"initializer:72":0,"(anonymous 2):139":0,"finish:137":0,"destroy:129":0,"getValue:163":0,"getValues:171":0,"setValue:183":0,"(anonymous 3):206":0,"_defSetValue:200":0,"(anonymous 4):221":0,"setValues:217":0,"(anonymous 5):241":0,"getChangedValues:236":0,"(anonymous 6):257":0,"getPKValues:254":0,"getAsHTML:270":0,"(anonymous 7):291":0,"getAsURL:285":0,"_defDataLoaded:306":0,"(anonymous 8):344":0,"load:334":0,"parse:385":0,"(anonymous 10):443":0,"(anonymous 9):437":0,"save:427":0,"reset:476":0,"sync:505":0,"validate:551":0,"(anonymous 11):567":0,"_validate:564":0,"toJSON:596":0,"_isModifiedGetter:599":0,"_isNewGetter:611":0,"_primaryKeysSetter:622":0,"_primaryKeysGetter:630":0,"initializer:713":0,"_trackChange:726":0,"_resetUndo:736":0,"undo:745":0,"initializer:769":0,"_trackChange:782":0,"_resetUndo:792":0,"undo:799":0,"initializer:825":0,"(anonymous 12):862":0,"_shelve:851":0,"(anonymous 13):884":0,"_fetch:873":0,"_initNew:894":0,"add:907":0,"each:928":0,"eachModified:948":0,"saveAllModified:968":0,"(anonymous 14):991":0,"_batchLoad:987":0,"size:1001":0,"empty:1008":0,"_indexSetter:1021":0,"_indexGetter:1038":0,"initializer:1087":0,"sortField:1106":0,"_compare:1110":0,"_setCompare:1101":0,"_sort:1122":0,"_afterChange:1135":0,"_findIndex:1159":0,"add:1191":0,"find:1216":0,"validator:1246":0,"validator:1257":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-md-model/gallery-md-model.js"].coveredLines = 306;
_yuitest_coverage["/build/gallery-md-model/gallery-md-model.js"].coveredFunctions = 71;
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
		CHANGE = 'Change';
	

	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 42);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "initializer", 72);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 73);
this._values = {};
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 74);
this._loadedValues = {};
				/**
				 * Fired whenever a data value is changed.
				 * @event change
				 * @param {String} ev.name Name of the field changed
				 * @param {Any} ev.newVal New value of the field.
				 * @param {Any} ev.prevVal Previous value of the field.
				 * @param {String|null} ev.src Source of the change event, if any.
				 */
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 83);
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
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 94);
this.publish(EVT_LOADED, {
					defaultFn:this._defDataLoaded
				});
				/**
				 * Fired when the data has been saved to the remote source
				 * The event cannot be prevented.
				 * @event saved
				 */
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 102);
this.publish(EVT_SAVED, {
					preventable: false
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 105);
cfg = cfg || {};
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 106);
if (Lang.isObject(cfg.values)) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 107);
this.setValues(cfg.values, 'init');
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 108);
this._set(IS_MODIFIED, false);
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 109);
this._set(IS_NEW, true);
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 110);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "destroy", 129);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 130);
if (typeof options === 'function') {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 131);
callback = options;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 132);
options = {};
				} else {_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 133);
if (!options) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 134);
options = {};
				}}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 136);
var self = this,
					finish = function (err) {
						_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "finish", 137);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 138);
if (!err) {
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 139);
YArray.each(self.lists.concat(), function (list) {
								_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 2)", 139);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 140);
list.remove(self, options);
							});

							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 143);
Y.GalleryModel.superclass.destroy.call(self);
						}

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 146);
callback && callback.apply(null, arguments);
					};

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 149);
if (callback || options) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 150);
this.sync('delete', options, finish);
				} else {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 152);
finish();
				}

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 155);
return this;
			},
			/**
			 * Returns the value of the field named
			 * @method getValue
			 * @param name {string}  Name of the field to return.
			 * @return {Any} the value of the field requested.  
			 */ 
			getValue: function (name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getValue", 163);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 164);
return this._values[name];
			},
			/**
			 * Returns a hash with all values using the field names as keys.
			 * @method getValues
			 * @return {Object} a hash with all the fields with the field names as keys.
			 */ 
			getValues: function() {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getValues", 171);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 172);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "setValue", 183);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 184);
var prevVal = this._values[name];
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 185);
if (prevVal !== value && (this._primaryKeys.indexOf(name) === -1 || Lang.isUndefined(prevVal))) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 186);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_defSetValue", 200);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 201);
var self = this;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 202);
if (ev.name) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 203);
self._values[ev.name] = ev.newVal;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 204);
self._set(IS_MODIFIED, true);
				} else {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 206);
YObject.each(ev.newVals, function (value, name) {
						_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 3)", 206);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 207);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "setValues", 217);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 218);
var self = this,
					prevVals = {};
					
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 221);
YObject.each(values, function (value, name) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 4)", 221);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 222);
prevVals[name] = self.getValue(name);
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 224);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getChangedValues", 236);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 237);
var changed = {}, 
					prev, 
					loaded = this._loadedValues;

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 241);
YObject.each(this._values, function (value, name) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 5)", 241);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 242);
prev = loaded[name];
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 243);
if (prev !== value) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 244);
changed[name] = {prevVal:prev, newVal: value};
					}
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 247);
return changed;
			},
			/**
			 * Returns a hash with the values of the primary key fields, indexed by their field names
			 * @method getPKValues
			 * @return {Object} Hash with the primary key values, indexed by their field names
			 */
			getPKValues: function () {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getPKValues", 254);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 255);
var pkValues = {},
					self = this;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 257);
YArray.each(self.get('primaryKeys'), function (name) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 6)", 257);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 258);
pkValues[name] = self._values[name];
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 260);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getAsHTML", 270);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 271);
var value = this.getValue(name);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 272);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getAsURL", 285);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 286);
var value = this.getValue(name),
					url = [];
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 288);
if (name) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 289);
return encodeURIComponent(Lang.isValue(value) ? String(value) : '');
				} else {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 291);
YObject.each(value, function (value, name) {
						_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 7)", 291);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 292);
if (Lang.isValue(value)) {
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 293);
url.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
						}
					});
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 296);
return url.join('&');
				}
			},

			/**
			 * Default function for the loaded event. Does the actual setting of the values just loaded.
			 * @method _defDataLoaded
			 * @param ev {EventFacade} see loaded event
			 * @private
			 */
			_defDataLoaded: function (ev) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_defDataLoaded", 306);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 307);
var self = this;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 308);
self.setValues(ev.parsed, ev.src);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 309);
self._set(IS_MODIFIED, false);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 310);
self._set(IS_NEW, false);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 311);
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
				@param options {Object} Options to be passed to sync().
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "load", 334);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 335);
var self = this;

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 337);
if (typeof options === 'function') {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 338);
callback = options;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 339);
options = {};
				} else {_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 340);
if (!options) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 341);
options = {};
				}}

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 344);
self.sync('read', options, function (err, response) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 8)", 344);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 345);
var facade = {
							options : options,
							response: response,
							src: 'load'
						};

					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 351);
if (err) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 352);
facade.error = err;

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 354);
self.fire(EVT_ERROR, facade);
					} else {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 356);
self._values = {};

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 358);
facade.parsed = self.parse(response);
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 359);
self.fire(EVT_LOADED, facade);
					}

					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 362);
callback && callback.apply(null, arguments);
				});

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 365);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "parse", 385);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 386);
if (typeof response === 'string') {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 387);
try {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 388);
return Y.JSON.parse(response);
					} catch (ex) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 390);
this.fire(EVT_ERROR, {
							error : ex,
							response: response,
							src : 'parse'
						});

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 396);
return null;
					}
				}

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 400);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "save", 427);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 428);
var self = this;

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 430);
if (typeof options === 'function') {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 431);
callback = options;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 432);
options = {};
				} else {_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 433);
if (!options) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 434);
options = {};
				}}

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 437);
self._validate(self.getValues(), function (err) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 9)", 437);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 438);
if (err) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 439);
callback && callback.call(null, err);
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 440);
return;
					}

					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 443);
self.sync(self.get(IS_NEW) ? 'create' : 'update', options, function (err, response) {
						_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 10)", 443);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 444);
var facade = {
								options : options,
								response: response,
								src: 'save'
							};

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 450);
if (err) {
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 451);
facade.error = err;

							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 453);
self.fire(EVT_ERROR, facade);
						} else {
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 455);
facade.parsed = self.parse(response);

							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 457);
self._set(IS_MODIFIED, false);
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 458);
self._set(IS_NEW, false);
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 459);
self._loadedValues = Y.clone(self._values);
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 460);
self.fire(EVT_SAVED, facade);
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 461);
if (facade.parsed) {
								_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 462);
self.fire(EVT_LOADED, facade);
							}
						}

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 466);
callback && callback.apply(null, arguments);
					});
				});

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 470);
return self;
			},
			/**
			 * Restores the values when last loaded, saved or created.
			 * @method reset
			 */
			reset: function() {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "reset", 476);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 477);
this._values = Y.clone(this._loadedValues);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 478);
this.fire(EVT_RESET);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 479);
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

				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "sync", 505);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 507);
if (typeof callback === 'function') {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 508);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "validate", 551);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 552);
callback && callback();
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_validate", 564);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 565);
var self = this;

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 567);
self.validate(attributes, function (err) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 11)", 567);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 568);
if (Lang.isValue(err)) {
						// Validation failed. Fire an error.
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 570);
self.fire(EVT_ERROR, {
							attributes: attributes,
							error : err,
							src : 'validate'
						});

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 576);
callback(err);
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 577);
return;
					}

					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 580);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "toJSON", 596);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 597);
return this.getValue();
			},
			_isModifiedGetter: function (value, name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_isModifiedGetter", 599);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 600);
name = name.split(DOT);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 601);
if (name.length > 1) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 602);
name = name[1];
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 603);
var ret = {};
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 604);
ret[name] = this._values[name] !== this._loadedValues[name];
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 605);
return ret;
				} else {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 607);
return value;
				}

			},
			_isNewGetter: function (value, name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_isNewGetter", 611);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 612);
name = name.split(DOT);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 613);
if (name.length > 1) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 614);
name = name[1];
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 615);
var ret = {};
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 616);
ret[name] = !this._loadedValues.hasOwnProperty(name);
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 617);
return ret;
				} else {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 619);
return value;
				}
			},
			_primaryKeysSetter: function (value) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_primaryKeysSetter", 622);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 623);
if (this._primaryKeys && this._primaryKeys.length) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 624);
return Y.Attribute.INVALID_VALUE;
				}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 626);
value = new YArray(value);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 627);
this._primaryKeys = value;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 628);
return value;
			},
			_primaryKeysGetter: function (value, name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_primaryKeysGetter", 630);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 631);
name = name.split(DOT);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 632);
if (name.length > 1) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 633);
name = name[1];
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 634);
var ret = {};
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 635);
ret[name] = value.indexOf(name) !== -1;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 636);
return ret;
				} else {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 638);
return (value || []).concat();  // makes sure to return a copy, not the original.
				}
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
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 710);
Y.GalleryModelSimpleUndo = function () {};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 712);
Y.GalleryModelSimpleUndo.prototype = {
		initializer: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "initializer", 713);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 714);
this._lastChange = {};
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 715);
this._preserve = (this._preserve || []).concat('_lastChange');
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 716);
this.after(EVT_CHANGE, this._trackChange);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 717);
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
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_trackChange", 726);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 727);
if (ev.name && ev.src !== 'undo') {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 728);
this._lastChange[ev.name] = ev.prevVal;
			}
		},
		/**
		 * After load or save operations, it drops any changes it might have tracked.
		 * @method _resetUndo
		 * @private
		 */
		_resetUndo: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_resetUndo", 736);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 737);
this._lastChange = {};
		},
		/**
		 * Reverts one level of change for a specific field or all fields
		 * @method undo
		 * @param [name] {String} If provided it will undo that particular field,
		 *	otherwise, it undoes the whole record.
		 */
		undo: function (name) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "undo", 745);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 746);
var self = this;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 747);
if (name) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 748);
if (self._lastChange[name] !== undefined) {		
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 749);
self.setValue(name, self._lastChange[name], 'undo');
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 750);
delete self._lastChange[name];
				}
			} else {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 753);
self.setValues(this._lastChange, 'undo');
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 754);
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
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 766);
Y.GalleryModelChronologicalUndo = function () {};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 768);
Y.GalleryModelChronologicalUndo.prototype = {
		initializer: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "initializer", 769);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 770);
this._changes = [];
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 771);
this._preserve = (this._preserve || []).concat('_changes');
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 772);
this.after(EVT_CHANGE, this._trackChange);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 773);
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
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_trackChange", 782);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 783);
if (ev.src !== 'undo') {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 784);
this._changes.push(ev.details);
			}
		},
		/**
		 * After load or save operations, it drops any changes it might have tracked.
		 * @method _resetUndo
		 * @private
		 */
		_resetUndo: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_resetUndo", 792);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 793);
this._changes = [];
		},
		/**
		 * Reverts one level of field changes.
		 * @method undo
		 */
		undo: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "undo", 799);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 800);
var ev = this._changes.pop();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 801);
if (ev) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 802);
if (ev.name) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 803);
this.setValue(ev.name, ev.prevVal, 'undo');
				} else {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 805);
this.setValues(ev.prevVals, 'undo');
				}
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 808);
if (this._changes.length === 0) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 809);
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
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 821);
var INDEX = 'index',
		MR = function () {};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 824);
MR.prototype = {
		initializer: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "initializer", 825);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 826);
this._shelves = [];
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 827);
this._currentIndex = 0;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 828);
this.on(EVT_LOADED, this._batchLoad);
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
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_shelve", 851);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 852);
if (index === undefined) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 853);
index = this._currentIndex;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 855);
var self = this,
				current = {
					_values: self._values,
					_loadedValues: self._loadedValues,
					isNew: self.get(IS_NEW),
					isModified: self.get(IS_MODIFIED)
				};
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 862);
YArray.each(self._preserve, function (name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 12)", 862);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 863);
current[name] = self[name];
			});
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 865);
self._shelves[index] = current;
			
		},
		/**
		 * Retrives and exposes the record from the shelf at the position given by _currentIndex
		 * @method _fetch
		 * @private
		 */
		_fetch: function (index) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_fetch", 873);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 874);
if (index === undefined) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 875);
index = this._currentIndex;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 877);
var self = this,
				current = self._shelves[index];
				
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 880);
self._values = current._values;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 881);
self._loadedValues = current._loadedValues;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 882);
self._setStateVal(IS_NEW, current.isNew);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 883);
self._setStateVal(IS_MODIFIED, current.isModified);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 884);
YArray.each(self._preserve, function (name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 13)", 884);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 885);
self[name] = current[name];
			});
			
		},
		/**
		 * Initializes an exposed record
		 * @method _initNew
		 * @private
		 */
		_initNew: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_initNew", 894);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 895);
this._values = {};
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 896);
this._loadedValues = {};
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 897);
this._set(IS_NEW, true);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 898);
this._set(IS_MODIFIED, false);
		},
		/**
		 * Adds a new record at the index position given or at the end.
		 * The new record becomes the current.
		 * @method add
		 * @param values {Object} set of values to set
		 * @param [index] {Integer} position to add the values at or at the end if not provided.  
		 */
		add: function(values, index) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "add", 907);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 908);
if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 909);
this._shelve();
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 911);
if (arguments.length === 2) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 912);
this._shelves.splice(index, 1);
			} else {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 914);
index = this._shelves.length;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 916);
this._currentIndex = index;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 917);
this._initNew();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 918);
this.setValues(values, 'add');
		},
		/**
		 * Executes the given function for each record in the set.
		 * Returning exactly false from the function spares shelving the record.
		 * If function does not modify the record, returning false will improve performance.
		 * @method each
		 * @param fn {function} function to execute, it will be provided with:
		 * @param fn.index {integer} index of the record exposed
		 */
		each: function(fn) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "each", 928);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 929);
var i, l, self = this;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 930);
this._shelve();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 931);
for (i = 0, l = this._shelves.length; i < l; i += 1) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 932);
this._currentIndex = i;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 933);
this._fetch(i);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 934);
if (fn.call(self, i) !== false) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 935);
this._shelve(i);
				}
			}
		},
		/**
		 * Executes the given function for each record in the set.
		 * It is faster than using each and then checking for isModified
		 * Returning exactly false from the function spares shelving the record.
		 * If function does not modify the record, returning false will improve performance.
		 * @method eachModified
		 * @param fn {function} function to execute, it will be provided with:
		 * @param fn.index {integer} index of the record exposed
		 */
		eachModified:function(fn) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "eachModified", 948);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 949);
var i, l, self = this;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 950);
this._shelve();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 951);
for (i = 0, l = this._shelves.length; i < l; i += 1) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 952);
if (this._shelves[i][IS_MODIFIED]) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 953);
this._currentIndex = i;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 954);
this._fetch(i);
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 955);
if (fn.call(self, i) !== false) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 956);
this._shelve(i);
					}
				}
			}
		},
		/**
		 * Calls _save_ on each record modified.
		 * This is not the best saving strategy for saving batches of records,
		 * but it is the easiest and safest.  Implementors are encouraged to 
		 * design their own.
		 * @method saveAllModified
		 */
		saveAllModified: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "saveAllModified", 968);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 969);
this.eachModified(this.save);
		},
		/**
		 * <em>This is a documentation entry only, this method does not define load.</em>
		 *    
		 * This extension captures the _loaded_ event so that if a load 
		 * returns an array of records, they will be added to the shelves.
		 * Existing records are kept, call _empty_ if they should be discarded.
		 * See method load of Y.GalleryModel for further info.
		 * @method load
		 */
		/**
		 * Listener for the loaded event, checks if the parsed response is an array
		 * and saves it into the shelves.
		 * @method _batchLoad
		 * @param ev {EventFacade} facade produced by load.
		 * @private
		 */
		_batchLoad: function (ev) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_batchLoad", 987);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 988);
var self = this;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 989);
if (ev.src === 'load' && Y.Lang.isArray(ev.parsed)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 990);
ev.halt();
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 991);
YArray.each(ev.parsed, function (values) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 14)", 991);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 992);
self.add(values);
				});
			}
		},
		/**
		 * Returns the number of records stored
		 * @method size
		 * @return {Integer} number of records in the shelves
		 */
		size: function() {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "size", 1001);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1002);
return this._shelves.length;
		},
		/**
		 * Empties the shelves of any records as well as the exposed record
		 * @method empty
		 */
		empty: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "empty", 1008);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1009);
this._shelves = [];
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1010);
this._currentIndex = 0;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1011);
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
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_indexSetter", 1021);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1022);
if (Lang.isNumber(value) && value >= 0 && value < this._shelves.length) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1023);
this._shelve(this._currentIndex);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1024);
this._currentIndex = value = parseInt(value,10);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1025);
this._fetch(value);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1026);
return value;
			} else {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1028);
return Y.Attribute.INVALID_VALUE;
			}
		},
		/**
		 * Getter for the _index_ attribute
		 * Returns the value from _currentIndex
		 * @method _indexGetter
		 * @return {integer} value of the index
		 * @private
		 */
		_indexGetter: function (value) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_indexGetter", 1038);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1039);
return this._currentIndex;
		}
		
	};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1044);
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
		}
	};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1058);
Y.GalleryModelMultiRecord = MR;
	
	/**
	 * Extension to sort records stored in GalleryModel, extended with GalleryModelMultiRecord
	 * @class Y.GalleryModelSortedMultiRecord
	 */
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1064);
var SFIELD = 'sortField',
		SDIR = 'sortDir',
		ASC = 'asc',
		DESC = 'desc',
		SMR = function () {};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1070);
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
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "initializer", 1087);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1088);
if (this.get(SFIELD) === undefined) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1089);
this._set(SFIELD, this.get('primaryKeys')[0]);
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1091);
this._setCompare();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1092);
this.after([SFIELD + CHANGE, SDIR + CHANGE], this._sort);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1093);
this.after('change', this._afterChange);
		},
		/**
		 * Sets the compare function to be used in sorting the records
		 * based on the sortField and sortDir and stores it into this._compare
		 * @method _setCompare
		 * @private
		 */
		_setCompare: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_setCompare", 1101);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1102);
var sortField = this.get(SFIELD),
				sortAsc = this.get(SDIR) === ASC?1:-1,
				compareValue = (Lang.isFunction(sortField)?
					sortField:
					function(values) {
						_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "sortField", 1106);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1107);
return values[sortField];
					}
				);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1110);
this._compare = function(a, b) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_compare", 1110);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1111);
var aValue = compareValue(a._values),
					bValue = compareValue(b._values);

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1114);
return (aValue < bValue ? -1 : (aValue > bValue ? 1 : 0)) * sortAsc;
			};
		},
		/**
		 * Sorts the shelves whenever the sortField or sortDir is changes
		 * @method _sort
		 * @private
		 */
		_sort: function() {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_sort", 1122);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1123);
this._setCompare();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1124);
this._shelve();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1125);
this._shelves.sort(this._compare);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1126);
this._fetch();
		},
		/**
		 * Listens to value changes and if the name of the field is that of the sortField
		 * or if sortField is a function, it will relocate the record to its proper sort order
		 * @method _afterChange
		 * @param ev {EventFacade} Event façade as produced by the change event
		 * @private
		 */
		_afterChange: function (ev) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_afterChange", 1135);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1136);
var fieldName = ev.name,
				sField = this.get(SFIELD),
				index,
				currentIndex = this._currentIndex,
				shelves = this._shelves,
				currentShelf;

			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1143);
if (fieldName && ev.src !== 'add' && (Lang.isFunction(sField) || fieldName === sField)) {
				// The shelf has to be emptied otherwise _findIndex may match itself.
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1145);
currentShelf = shelves.splice(currentIndex,1)[0];
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1146);
index = this._findIndex(currentShelf._values);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1147);
shelves.splice(index,0,currentShelf);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1148);
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
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_findIndex", 1159);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1160);
var shelves = this._shelves,
				low = 0, 
				high = shelves.length, 
				index = 0,
				cmp = this._compare,
				vals = {_values: values};
				
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1167);
while (low < high) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1168);
index = (high + low) >> 1;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1169);
switch(cmp(vals, shelves[index])) {
					case 1:
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1171);
low = index + 1;
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1172);
break;
					case -1:
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1174);
high = index;
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1175);
break;
					default:
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1177);
low = high = index;
				}
				
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1181);
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
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "add", 1191);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1192);
var shelves = this._shelves,
				index = 0;
				
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1195);
index = this._findIndex(values);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1196);
this._currentIndex = index;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1197);
shelves.splice(index, 0, {});
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1198);
this._initNew();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1199);
this.setValues(values, 'add');
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1200);
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
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "find", 1216);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1217);
var sfield = this.get(SFIELD),
				index,
				values = {};
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1220);
if (Lang.isFunction(sfield)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1221);
return null;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1223);
values[sfield] = value;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1224);
index = this._findIndex(values);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1225);
if (this._shelves[index]._values[sfield] !== value) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1226);
return null;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1228);
if (move || arguments.length < 2) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1229);
this.set(INDEX, index);
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1231);
return index;
		}
	};
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1234);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "validator", 1246);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1247);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "validator", 1257);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1258);
return value === DESC || value === ASC;
			},
			value: ASC
		}
	};
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1263);
Y.GalleryModelSortedMultiRecord = SMR;




}, 'gallery-2012.08.15-20-00' ,{requires:['base'], skinnable:false});
