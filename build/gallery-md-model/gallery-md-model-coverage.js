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
_yuitest_coverage["/build/gallery-md-model/gallery-md-model.js"].code=["YUI.add('gallery-md-model', function(Y) {","","/**","Record-based data model with APIs for getting, setting, validating, and","syncing attribute values, as well as events for being notified of model changes."," ","@module gallery-md-model","**/"," ","/**","Record-based data model with APIs for getting, setting, validating, and","syncing attribute values, as well as events for being notified of model changes."," ","In most cases, you'll want to create your own subclass of Y.GalleryModel and","customize it to meet your needs. In particular, the sync() and validate()","methods are meant to be overridden by custom implementations. You may also want","to override the parse() method to parse non-generic server responses."," ","@class Y.GalleryModel","@constructor","@param [cfg] {Object} Initial configuration attribute plus:","@param [cfg.values] {Object}  Sets initial values for the model.  ","	Model will be marked as new and not modified (as if just loaded).","@extends Base","**/","	\"use strict\";","	","	var Lang = Y.Lang,","		YArray = Y.Array,","		YObject = Y.Object,","		EVT_CHANGE = 'change',","		EVT_LOADED = 'loaded',","		EVT_ERROR = 'error',","		EVT_SAVED = 'saved',","		EVT_RESET = 'reset',","		IS_MODIFIED = 'isModified',","		IS_NEW = 'isNew',","		DOT = '.',","		CHANGE = 'Change',","		ADD = 'add',","		UNDO = 'undo',","		NULL_FN = function (){};","	","","	Y.GalleryModel = Y.Base.create(","		'gallery-md-model',","		Y.Base, ","		[],","		{","			/**","			 * Hash of values indexed by field name","			 * @property _values","			 * @type Object","			 * @private","			 */","			_values: null,","			/**","			 * Hash of values as loaded from the remote source, ","			 * presumed to be the current value there.","			 * @property _loadedValues","			 * @type Object","			 * @private","			 */","			_loadedValues: null,","			/**","			 * Array of field names that make up the primary key for this record","			 * @property _primaryKeys","			 * @type Array","			 * @private","			 */","			_primaryKeys: null,","			/*","			 * Y.Base lifecycle method","			 */","			initializer: function  (cfg) {","				this._values = {};","				this._loadedValues = {};","				/**","				 * Fired whenever a value or values are changed. ","				 * If changed via {{#crossLink \"Y.GalleryModel/setValues\"}}{{/crossLink}} the facade will not contain a __name__.  ","				 * Instead, __prevVals__ and __newVals__ (both plural) properties will contain ","				 * hashes with the names and values of the fields changed.","				 * After firing the event for a group of fields changed via {{#crossLink \"Y.GalleryModel/setValues\"}}{{/crossLink}},","				 * a new change event will be fired for each individual field changed.","				 * For individual field changes via {{#crossLink \"Y.GalleryModel/setValue\"}}{{/crossLink}}, the __name__, __prevVal__ and __newVal__","				 * will be provided.","				 * The event can be prevented on a per group change basis or per individual field change.","				 * Preventing the change on a particular field will not prevent the others from being changed.","				 * @event change","				 * @param ev {EventFacade} containing:","				 * @param [ev.name] {String} Name of the field changed","				 * @param [ev.newVal] {Any} New value of the field.","				 * @param [ev.prevVal] {Any} Previous value of the field.","				 * @param [ev.newVals] {Object} Hash with the new values for the listed fields.","				 * @param [ev.prevVals] {Object} Hash with the previous values for the listed fields.","				 * @param ev.src {String|null} Source of the change event, if any.","				 */","				this.publish(EVT_CHANGE, {","					defaultFn: this._defSetValue","				});","				/**","				 * Fired when new data has been received from the remote source.  ","				 * It will also be fired even on a {{#crossLink \"Y.GalleryModel/save\"}}{{/crossLink}} operation if the response contains values.","				 * The parsed values can be altered on the before (on) listener.","				 * @event loaded","				 * @param ev {EventFacade} containing:","				 * @param ev.response {Object} Response data as received from the remote source","				 * @param ev.parsed {Object} Data as returned from the parse method.","				 * @param ev.options {Object} Options as received by the {{#crossLink \"Y.GalleryModel/load\"}}{{/crossLink}} method.","				 * @param ev.callback {Function} Function to call at the end of the load process","				 * @param ev.src {String} the source of the load, usually `'load'`","				 */","				this.publish(EVT_LOADED, {","					defaultFn:this._defDataLoaded,","					preventedFn: this._stoppedDataLoaded,","					stoppedFn: this._stoppedDataLoaded","				});","				/**","				 * Fired when the data has been saved to the remote source","				 * The event cannot be prevented.  ","				 * The developer has full control of what is","				 * about to be saved and when it is saved so it would be pointless","				 * to try to prevent it at this stage.  This is in contrast to","				 * the {{#crossLink \"Y.GalleryModel/loaded\"}}{{/crossLink}} event where the developer has no control of what might","				 * come from the server and might wish to do something about it.","				 * If in reply to the save operation the server replies with data, ","				 * the __response__ and __parsed__ properties will be filled.","				 * @event saved","				 * @param ev {EventFacade} containing:","				 * @param [ev.response] {Object} Response data as received from the remote source, if any.","				 * @param [ev.parsed] {Object} Data as returned from the parse method, if any.","				 * @param ev.options {Object} Options as received by the {{#crossLink \"Y.GalleryModel/save\"}}{{/crossLink}} method.","				 * @param ev.callback {Function} Function to call at the end of the load process","				 * @param ev.src {String} the source of the save, usually `'save'`","				 */","				this.publish(EVT_SAVED, {","					preventable: false","				});","				cfg = cfg || {};","				if (Lang.isObject(cfg.values)) {","					this.setValues(cfg.values, 'init');","					this._set(IS_MODIFIED, false);","					this._set(IS_NEW, true);","					this._loadedValues = Y.clone(this._values);","				}","			},","			/**","			 * Destroys this model instance and removes it from its containing lists, if","			 * any.","","			 * If __options.remove__ is true then this method also delegates to the","			 * {{#crossLink \"Y.GalleryModel/sync\"}}{{/crossLink}} method to delete the model from the persistence layer.","","			 * @method destroy","			 * @param [options] {Object} Options passed on to the {{#crossLink \"Y.GalleryModel/sync\"}}{{/crossLink}} method, if required.","			 * @param [options.remove=false] {Boolean} if true, the data will also be erased from the server.","			 * @param [callback] {function} function to be called when the sync operation finishes.","			 *		@param callback.err {string|null} Error message, if any or null.","			 *		@param callback.response {Any} The server response as received by {{#crossLink \"Y.GalleryModel/sync\"}}{{/crossLink}}.","			 * @chainable","			 */","			destroy: function (options, callback) {","				if (Lang.isFunction(options)) {","					callback = options;","					options = {};","				} else if (!options) {","					options = {};","				}","				callback = callback || NULL_FN;","				var self = this,","					finish = function (err) {","						if (!err) {","							YArray.each(self.lists.concat(), function (list) {","								list.remove(self, options);","							});","","							Y.GalleryModel.superclass.destroy.call(self);","						}","","						callback.apply(self, arguments);","					};","","				if (options.remove) {","					this.sync('delete', options, finish);","				} else {","					finish();","				}","","				return this;","			},","			/**","			 * Returns the value of the field named","			 * @method getValue","			 * @param name {string}  Name of the field to return.","			 * @return {Any} the value of the field requested.  ","			 */ ","			getValue: function (name) {","				return this._values[name];","			},","			/**","			 * Returns a hash with all values using the field names as keys.","			 * @method getValues","			 * @return {Object} a hash with all the fields with the field names as keys.","			 */ ","			getValues: function() {","				return Y.clone(this._values);","			},","			/**","			 * Sets the value of the named field. ","			 * Fires the {{#crossLink \"Y.GalleryModel/change\"}}{{/crossLink}} event if the new value is different from the current one.","			 * Primary key fields cannot be changed unless still `undefined`.","			 * @method setValue","			 * @param name {string} Name of the field to be set","			 * @param value {Any} Value to be assigned to the field","			 * @param [src] {Any} Source of the change in the value.","			 * @chainable","			 */","			setValue: function (name, value, src) {","				var prevVal = this._values[name];","				if (prevVal !== value && (this._primaryKeys.indexOf(name) === -1 || Lang.isUndefined(prevVal))) {","					this.fire(EVT_CHANGE, {","						name:name,","						newVal:value,","						prevVal:prevVal,","						src: src","					});","				}","				return this;","			},","			/**","			 * Default function for the change event, sets the value and marks the model as modified.","			 * @method _defSetValue","			 * @param ev {EventFacade} (see {{#crossLink \"Y.GalleryModel/change\"}}{{/crossLink}} event)","			 * @private","			 */","			_defSetValue: function (ev) {","				var self = this;","				if (ev.name) {","					self._values[ev.name] = ev.newVal;","					self._set(IS_MODIFIED, true);","				} else {","					YObject.each(ev.newVals, function (value, name) {","						self.setValue(name, value, ev.src);","					});","				}","			},","			/**","			 * Sets a series of values.   ","			 * It simply loops over the hash of values provided calling {{#crossLink \"Y.GalleryModel/setValue\"}}{{/crossLink}} on each.","			 * Fires the {{#crossLink \"Y.GalleryModel/change\"}}{{/crossLink}} event.","			 * @method setValues","			 * @param values {Object} hash of values to change","			 * @param [src] {Any} Source of the changes","			 * @chainable","			 */","			setValues: function (values, src) {","				var self = this,","					prevVals = {};","					","				YObject.each(values, function (value, name) {","					prevVals[name] = self.getValue(name);","				});","				this.fire(EVT_CHANGE, {","					newVals:values,","					prevVals:prevVals,","					src: src","				});","				return self;","			},","			/**","			 * Returns a hash indexed by field name, of all the values in the model that have changed since the last time","			 * they were synchornized with the remote source.   Each entry has a __prevVal__ and __newVal__ entry.","			 * @method getChangedValues","			 * @return {Object} Hash of all entries changed since last synched.","			 * Each entry has a __newVal__ and __prevVal__ property contaning original and changed values.","			 */","			getChangedValues: function() {","				var changed = {}, ","					prev, ","					loaded = this._loadedValues;","","				YObject.each(this._values, function (value, name) {","					prev = loaded[name];","					if (prev !== value) {","						changed[name] = {prevVal:prev, newVal: value};","					}","				});","				return changed;","			},","			/**","			 * Returns a hash with the values of the primary key fields, indexed by their field names","			 * @method getPKValues","			 * @return {Object} Hash with the primary key values, indexed by their field names","			 */","			getPKValues: function () {","				var pkValues = {},","					self = this;","				YArray.each(self._primaryKeys, function (name) {","					pkValues[name] = self._values[name];","				});","				return pkValues;","			},","			/**","				Returns an HTML-escaped version of the value of the specified string","				attribute. The value is escaped using Y.Escape.html().","","				@method getAsHTML","				@param {String} name Attribute name or object property path.","				@return {String} HTML-escaped attribute value.","			**/","			getAsHTML: function (name) {","				var value = this.getValue(name);","				return Y.Escape.html(Lang.isValue(value) ? String(value) : '');","			},","","			/**","			 * Returns a URL-encoded version of the value of the specified field,","			 * or a full URL with `name=value` sets for all fields if no name is given.","			 * The names and values are encoded using the native `encodeURIComponent()`","			 * function.","","			 * @method getAsURL","			 * @param [name] {String}  Field name.","			 * @return {String} URL-encoded field value if name is given or URL encoded set of `name=value` pairs for all fields.","			 */","			getAsURL: function (name) {","				var value = this.getValue(name),","					url = [];","				if (name) {","					return encodeURIComponent(Lang.isValue(value) ? String(value) : '');","				} ","				YObject.each(value, function (value, name) {","					if (Lang.isValue(value)) {","						url.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));","					}","				});","				return url.join('&');","			},","","			/**","			 * Default function for the {{#crossLink \"Y.GalleryModel/loaded\"}}{{/crossLink}} event. ","			 * Does the actual setting of the values just loaded and calls the callback function.","			 * @method _defDataLoaded","			 * @param ev {EventFacade} see loaded event","			 * @private","			 */","			_defDataLoaded: function (ev) {","				var self = this;","				self.setValues(ev.parsed, ev.src);","				self._set(IS_MODIFIED, false);","				self._set(IS_NEW, false);","				self._loadedValues = Y.clone(self._values);","				ev.callback.call(self,null, ev.response);","			},","			/**","			 * Function called when the {{#crossLink \"Y.GalleryModel/loaded\"}}{{/crossLink}} event is prevented, stopped or halted","			 * so that the callback is called with a suitable error","			 * @method _stoppedDataLoaded","			 * @param ev {EventFacade}","			 * @private","			 */","			_stoppedDataLoaded: function (ev) {","				console.log('stopped', ev);","				ev.details[0].callback.call(this, 'Load event halted');","			},","			/**","				Loads this model from the server.","","				This method delegates to the {{#crossLink \"Y.GalleryModel/sync\"}}{{/crossLink}} method to perform the actual load","				operation, which is an asynchronous action. Specify a __callback__ function to","				be notified of success or failure.","","				A successful load operation will fire a {{#crossLink \"Y.GalleryModel/loaded\"}}{{/crossLink}} event, while an unsuccessful","				load operation will fire an {{#crossLink \"Y.GalleryModel/error\"}}{{/crossLink}} event with the `src` set to `\"load\"`.","","				@method load","				@param [options] {Object} Options to be passed to {{#crossLink \"Y.GalleryModel/sync\"}}{{/crossLink}}.","					Usually these will be or will include the keys used by the remote source ","					to locate the data to be loaded.","					They will be passed on unmodified to the {{#crossLink \"Y.GalleryModel/sync\"}}{{/crossLink}} method.","					It is up to {{#crossLink \"Y.GalleryModel/sync\"}}{{/crossLink}} to determine what they mean.","				@param [callback] {callback} <span class=\"flag deprecated\">deprecated</span> ","					Use `this.load(options).after('loaded', callback)` instead.","			","					Called when the sync operation finishes. Callback will receive:","					@param callback.err {string|null} Error message, if any or null.","					@param callback.response {Any} The server response as received by sync(),","				@chainable","			**/","			load: function (options, callback) {","				var self = this;","","				if (Lang.isFunction(options)) {","					callback = options;","					options = {};","				} else if (!options) {","					options = {};","				}","				callback = callback || NULL_FN;","","				self.sync('read', options, function (err, response) {","					var facade = {","							options : options,","							response: response,","							src: 'load',","							callback: callback","						};","","					if (err) {","						facade.error = err;","","						self.fire(EVT_ERROR, facade);","						callback.apply(self, arguments);","					} else {","						self._values = {};","","						facade.parsed = self.parse(response);","						self.fire(EVT_LOADED, facade);","					}","				});","","				return self;","			},","","			/**","				Called to parse the __response__ when a response is received from the server.","				This method receives a server __response__ and is expected to return a","				value hash.","","				The default implementation assumes that __response__ is either an attribute","				hash or a JSON string that can be parsed into an attribute hash. If","				__response__ is a JSON string and either Y.JSON or the native JSON object","				are available, it will be parsed automatically. If a parse error occurs, an","				error event will be fired and the model will not be updated.","","				You may override this method to implement custom parsing logic if necessary.","","				@method parse","				@param {Any} response Server response.","				@return {Object} Values hash.","			**/","			parse: function (response) {","				if (typeof response === 'string') {","					try {","						return Y.JSON.parse(response);","					} catch (ex) {","						this.fire(EVT_ERROR, {","							error : ex,","							response: response,","							src : 'parse'","						});","","						return null;","					}","				}","","				return response;","			},","","","","			/**","				Saves this model to the server.","","				This method delegates to the {{#crossLink \"Y.GalleryModel/sync\"}}{{/crossLink}} method to perform the actual save","				operation, which is an asynchronous action. Specify a __callback__ function to","				be notified of success or failure.","","				A successful save operation will fire a {{#crossLink \"Y.GalleryModel/saved\"}}{{/crossLink}} event, while an unsuccessful","				load operation will fire an {{#crossLink \"Y.GalleryModel/error\"}}{{/crossLink}} event with the 'src' property set to `\"save\"`.","","				If the save operation succeeds and the {{#crossLink \"Y.GalleryModel/parse\"}}{{/crossLink}} method returns non-empty values","				from the response received from the server a {{#crossLink \"Y.GalleryModel/loaded\"}}{{/crossLink}} event will also be fired to read those values.","","				@method save","				@param {Object} [options] Options to be passed to {{#crossLink \"Y.GalleryModel/sync\"}}{{/crossLink}}. ","					It's up to the custom sync implementation","					to determine what options it supports or requires, if any.","				@param {Function} [callback] Called when the sync operation finishes.","					@param callback.err {string|null} Error message, if any or null.","					@param callback.response {Any} The server response as received by {{#crossLink \"Y.GalleryModel/sync\"}}{{/crossLink}},","				@chainable","			**/","			save: function (options, callback) {","				var self = this;","","				if (Lang.isFunction(options)) {","					callback = options;","					options = {};","				} else if (!options) {","					options = {};","				}","				callback = callback || NULL_FN;","","				self._validate(self.getValues(), function (err) {","					if (err) {","						callback.call(self, err);","						return;","					}","","					self.sync(self.get(IS_NEW) ? 'create' : 'update', options, function (err, response) {","						var facade = {","								options : options,","								response: response,","								src: 'save'","							};","","						if (err) {","							facade.error = err;","","							self.fire(EVT_ERROR, facade);","						} else {","							facade.parsed = self.parse(response);","							facade.callback = callback;","							self._set(IS_MODIFIED, false);","							self._set(IS_NEW, false);","							self._loadedValues = Y.clone(self._values);","							self.fire(EVT_SAVED, facade);","							if (facade.parsed) {","								self.fire(EVT_LOADED, facade);","								return self; // the loaded event will take care of calling the callback","							}","						}","						callback.apply(self, arguments);","					});","				});","","				return self;","			},","			/**","			 * Restores the values when last loaded, saved or created.","			 * @method reset","			 * @chainable","			 */","			reset: function() {","				this._values = Y.clone(this._loadedValues);","				this.fire(EVT_RESET);","				return this;","			},","			/**","				Override this method to provide a custom persistence implementation for this","				model. The default just calls the callback without actually doing anything.","","				This method is called internally by {{#crossLink \"Y.GalleryModel/load\"}}{{/crossLink}}, ","				{{#crossLink \"Y.GalleryModel/save\"}}{{/crossLink}}, ","				and {{#crossLink \"Y.GalleryModel/destroy\"}}{{/crossLink}} (when `options.remove==true).","","				@method sync","				@param {String} action Sync action to perform. May be one of the following:","","					* create: Store a newly-created model for the first time.","					* read  : Load an existing model.","					* update: Update an existing model.","					* delete: Delete an existing model.","","				@param {Object} [options] Sync options. It's up to the custom sync","					implementation to determine what options it supports or requires, if any.","				@param {Function} [callback] Called when the sync operation finishes.","					@param {Error|null} callback.err If an error occurred, this parameter will","						contain the error. If the sync operation succeeded, __err__ will be","						falsy.","					@param {Any} [callback.response] The server's response. This value will","						be passed to the {{#crossLink \"Y.GalleryModel/parse\"}}{{/crossLink}} method, which is expected to parse it and","						return an attribute hash.","			**/","			sync: function (action, options, callback) {","				(callback || NULL_FN).call(this);","			},","			/**","				Override this method to provide custom validation logic for this model.","","				This method gives you a hook to validate a hash of all","				attributes before the model is saved. This method is called automatically","				before {{#crossLink \"Y.GalleryModel/save\"}}{{/crossLink}} takes any action. ","				If validation fails, the {{#crossLink \"Y.GalleryModel/save\"}}{{/crossLink}} call","				will be aborted.","","				In your validation method, call the provided callback function with no","				arguments to indicate success. To indicate failure, pass a single argument,","				which may contain an error message, an array of error messages, or any other","				value. This value will be passed along to the error event.","","				@example","","					model.validate = function (attrs, callback) {","						if (attrs.pie !== true) {","							// No pie?! Invalid!","							callback('Must provide pie.');","							return;","						}","","						// Success!","						callback();","					};","","				@method validate","				@param {Object} attrs Hash containing all model attributes to","				be validated.","				@param {Function} callback Validation callback. Call this function when your","				validation logic finishes. To trigger a validation failure, pass any","				value as the first argument to the callback (ideally a meaningful","				validation error of some kind).","","				@param {Any} [callback.err] Validation error. Don't provide this","				argument if validation succeeds. If validation fails, set this to an","				error message or some other meaningful value. It will be passed","				along to the resulting error event.","			**/","			validate: function (attrs, callback) {","				(callback || NULL_FN).call(this);","			},","			/**","				Calls the public, overridable validate() method and fires an error event","				if validation fails.","","				@method _validate","				@param {Object} attributes Attribute hash.","				@param {Function} callback Validation callback.","				@param {Any} [callback.err] Value on failure, non-value on success.","				@protected","			**/","			_validate: function (attributes, callback) {","				var self = this;","","				self.validate(attributes, function (err) {","					if (Lang.isValue(err)) {","						// Validation failed. Fire an error.","						self.fire(EVT_ERROR, {","							attributes: attributes,","							error : err,","							src : 'validate'","						});","","						callback.call(self, err);","						return;","					}","","					callback.call(self);","				});","","			},","			/**","			 * The default implementation calls {{#crossLink \"Y.GalleryModel/getValues\"}}{{/crossLink}}","			 * so that it returns a copy of the record.  ","			 * The developer may redefine this method to serialize this object","			 * in any way that might be needed.  ","			 * For example, it might be desirable to call ","			 * {{#crossLink \"Y.GalleryModel/getChangedValues\"}}{{/crossLink}}","			 * to return only changed fields, along with ","			 * {{#crossLink \"Y.GalleryModel/getPKValues\"}}{{/crossLink}} ","			 * to identify the record with the changes.","			 * @method toJSON","			 * @return {Object} Copy of this model field values.","			 */","			toJSON: function () {","				return this.getValues();","			},","			/**","			 * Getter for the {{#crossLink \"Y.GalleryModel/isModified\"}}{{/crossLink}} attribute.","			 * If the value contains a dot (`'.'`) the modified state of the field named as a sub-attribute will be returned.","			 * Otherwise, the modified status of the whole record will be returned.","			 * @method _isModifiedGetter","			 * @param value {Any} Value stored for the attribute. ","			 * @value name {String} Name of the attribute/sub-attribute being modified","			 * @return {Boolean} State of the record/field","			 * @protected","			 */","			_isModifiedGetter: function (value, name) {","				name = name.split(DOT);","				if (name.length > 1) {","					name = name[1];","					var ret = {};","					ret[name] = this._values[name] !== this._loadedValues[name];","					return ret;","				}","				return value;","			},","			/**","			 * Getter for the {{#crossLink \"Y.GalleryModel/isNew\"}}{{/crossLink}} attribute.","			 * If the value contains a dot (`'.'`) the 'new' state of the field named as a sub-attribute will be returned.","			 * Otherwise, the 'new' status of the whole record will be returned.","			 * @method _isNewGetter","			 * @param value {Any} Value stored for the attribute. ","			 * @value name {String} Name of the attribute/sub-attribute being modified","			 * @return {Boolean} State of the record/field","			 * @protected","			 */","			_isNewGetter: function (value, name) {","				name = name.split(DOT);","				if (name.length > 1) {","					name = name[1];","					var ret = {};","					ret[name] = !this._loadedValues.hasOwnProperty(name);","					return ret;","				}","				return value;","			},","			/**","			 * Setter for the {{#crossLink \"Y.GalleryModel/primaryKeys\"}}{{/crossLink}} attribute.","			 * If the value is already set, no further changes will be allowed.","			 * If the value is not an array, it will be converted to one.","			 * @method _primaryKeysSetter","			 * @param value {Any} Value stored for the attribute. ","			 * @return {Array} Primary keys","			 * @protected","			 */","			_primaryKeysSetter: function (value) {","				if (this._primaryKeys && this._primaryKeys.length) {","					return Y.Attribute.INVALID_VALUE;","				}","				value = new YArray(value);","				this._primaryKeys = value;","				return value;","			},","			/**","			 * Getter for the {{#crossLink \"Y.GalleryModel/primaryKeys\"}}{{/crossLink}} attribute.","			 * If the name contains a dot (`'.'`) it will return a boolean indicating ","			 * whether the field named as a sub-attribute is part of the primary key.","			 * Otherwise, it returns the array of primary key fields.","			 * @method  _primaryKeysGetter","			 * @param value {Array} Names of the primary key fields","			 * @param name {String} Name of the attribute/sub-attribute requested.","			 * @return {Array|Boolean} Array of the primary key field names or Boolean indicating if the asked for field is part of it.","			 * @private","			 */","			_primaryKeysGetter: function (value, name) {","				name = name.split(DOT);","				if (name.length > 1) {","					name = name[1];","					var ret = {};","					ret[name] = value.indexOf(name) !== -1;","					return ret;","				}","				return (value || []).concat();  // makes sure to return a copy, not the original.","			}","		},","		{","			ATTRS: {","				/**","				 * Indicates whether any of the fields has been changed since created or loaded.","				 * Field names can be given as sub-attributes to indicate if any particular field has beeen changed.","				 * `model.get('isModified.name')` returns `true` if the field `name` has been modified.","				 * <b>Note:</b> contrary to common practice in Attributes with sub-attributes, ","				 * requesting the state of the record does not","				 * return an object with the state of each individual field keyed by field name,","				 * but the state of the record as a whole, which is far more useful.","				 * @attribute isModified","				 * @type Boolean","				 * @readonly","				 * @default false","				 */","				isModified: {","					readOnly: true,","					value:false,","					validator:Lang.isBoolean,","					getter: '_isModifiedGetter'","				},","				/**","				 * Indicates that the model is new and has not been modified since creation.","				 * Field names can be given as sub-attributes to indicate if any particular field is new.","				 * `model.get('isNew.name')` returns `true` if the field `name` is new.","				 * <b>Note:</b> contrary to common practice in Attributes with sub-attributes, ","				 * requesting the state of the record does not","				 * return an object with the state of each individual field keyed by field name,","				 * but the state of the record as a whole, which is far more useful.","				 * @attribute isNew","				 * @type Boolean","				 * @readonly","				 * @default true","				 */","				isNew: {","					readOnly: true,","					value:true,","					validator:Lang.isBoolean,","					getter: '_isNewGetter'","				},","				/**","				 * List of fields making the primary key of this model. ","				 * Primary Key fields cannot be modified once initially loaded.","				 * It can be set as an array of field names or, if the key is made of a single field, a string with the name of that field.","				 * It will always be returned as an array.","				 * Field names can be given as a sub-attribute to ask whether a particular field is a primary key, thus:","				 * `model.get('primaryKeys.name')` returns `true` if the field `name` is a primary key.","				 * It can only be set once.","				 * @attribute primaryKeys","				 * @writeonce","				 * @type array","				 * @default []","				 */","				primaryKeys: {","					setter:'_primaryKeysSetter',","					getter:'_primaryKeysGetter',","					lazyAdd: false,","					value: []","				}","			}","","		}","	);","		","	/**","	 * An extension for Y.GalleryModel that provides a single level of undo for each field.","	 * It will never undo a field to `undefined` since it assumes an undefined field had not been set.","	 * @class Y.GalleryModelSimpleUndo","	 */","	Y.GalleryModelSimpleUndo = function () {};","	","	Y.GalleryModelSimpleUndo.prototype = {","		initializer: function () {","			this._lastChange = {};","			if (this._addPreserve) {","				this._addPreserve('_lastChange');","			}","			this.after(EVT_CHANGE, this._trackChange);","			this.on([EVT_LOADED, EVT_SAVED, EVT_RESET], this._resetUndo);	","		},","		/**","		 * Event listener for the after value change event, it tracks changes for each field.  ","		 * It retains only the last change for each field.","		 * @method _trackChange","		 * @param ev {EventFacade} As provided by the {{#crossLink \"Y.GalleryModel/change\"}}{{/crossLink}} event","		 * @private","		 */","		_trackChange: function (ev) {","			if (ev.name && ev.src !== UNDO) {","				this._lastChange[ev.name] = ev.prevVal;","			}","		},","		/**","		 * After load or save operations, it drops any changes it might have tracked.","		 * @method _resetUndo","		 * @private","		 */","		_resetUndo: function () {","			this._lastChange = {};","		},","		/**","		 * Reverts one level of change for a specific field or all fields","		 * @method undo","		 * @param [name] {String} If provided it will undo that particular field,","		 *	otherwise, it undoes the whole record.","		 * @chainable","		 */","		undo: function (name) {","			var self = this;","			if (name) {","				if (self._lastChange[name] !== undefined) {		","					self.setValue(name, self._lastChange[name], UNDO);","					delete self._lastChange[name];","				}","			} else {","				YObject.each(self._lastChange, function (value, name) {","					if (value !== undefined) {","						self.setValue(name, value, UNDO);","					}","				});","				self._lastChange = {};","			}","			return self;","		}","	};","	","	/**","	 * Provides multiple levels of undo in strict chronological order ","	 * whatever the field was at each stage.","	 * Changes done on multiple fields via setValues","	 * will also be undone in one step.","	 * @class Y.GalleryModelChronologicalUndo","	 */","	Y.GalleryModelChronologicalUndo = function () {};","	","	Y.GalleryModelChronologicalUndo.prototype = {","		initializer: function () {","			this._changes = [];","			if (this._addPreserve) {","				this._addPreserve('_changes');","			}","			this.after(EVT_CHANGE, this._trackChange);","			this.on([EVT_LOADED,EVT_SAVED,EVT_RESET], this._resetUndo);","		},","		/**","		 * Event listener for the after value change event, it tracks changes for each field.  ","		 * It keeps a stack of each change.  ","		 * @method _trackChange","		 * @param ev {EventFacade} As provided by the {{#crossLink \"Y.GalleryModel/change\"}}{{/crossLink}} event","		 * @private","		 */","		_trackChange: function (ev) {","			if (ev.src !== UNDO) {","				this._changes.push(ev.details);","			}","		},","		/**","		 * After load or save operations, it drops any changes it might have tracked.","		 * @method _resetUndo","		 * @private","		 */","		_resetUndo: function () {","			this._changes = [];","		},","		/**","		 * Reverts one level of field changes.","		 * @method undo","		 * @chainable","		 */","		undo: function () {","			var ev = this._changes.pop();","			if (ev) {","				if (ev.name) {","					this.setValue(ev.name, ev.prevVal, UNDO);","				} else {","					this.setValues(ev.prevVals, UNDO);","				}","			}","			if (this._changes.length === 0) {","				this._set(IS_MODIFIED, false);","			}","			return this;","		}","	};","	","	/**","	 * Allows GalleryModel to handle a set of records using the Flyweight pattern.","	 * It exposes one record at a time from a shelf of records.","	 * Exposed records can be selected by setting the {{#crossLink \"Y.GalleryModel/index\"}}{{/crossLink}} attribute.","	 * @class Y.GalleryModelMultiRecord","	 */","	","	var INDEX = 'index',","		MR = function () {};","	","	MR.prototype = {","		/**","		 * Added this property to have `ModelSync.REST getURL()` return the proper URL.","		 * @property _isYUIModelList","		 * @type Boolean","		 * @value true","		 * @private","		 */","		_isYUIModelList: true,","		initializer: function () {","			this._shelves = [];","			this._currentIndex = 0;","			this._addPreserve('_values','_loadedValues','_isNew','_isModified');","		},","		/**","		 * Index of the shelf for the record being exposed.","		 * Use {{#crossLink \"Y.GalleryModel/index\"}}{{/crossLink}} attribute to check/set the index value.","		 * @property _currentIndex","		 * @type integer","		 * @default 0","		 * @private","		 */","		_currentIndex: 0,","		/**","		 * Storage for the records when not exposed.","		 * @property _shelves","		 * @type Array","		 * @private","		 */","		_shelves: null,","		/**","		 * Saves the exposed record into the shelves at the position specified or given by {{#crossLink \"Y.GalleryModelMultiRecord/_currentIndex\"}}{{/crossLink}}","		 * @method _shelve","		 * @param [index=this._currentIndex] {Integer} Position to shelve it in","		 * @private","		 */","		_shelve: function(index) {","			if (index === undefined) {","				index = this._currentIndex;","			}","			var self = this,","				current = {};","			YArray.each(self._preserve, function (name) {","				current[name] = self[name];","			});","			self._shelves[index] = current;","			","		},","		/**","		 * Retrives and exposes the record from the shelf at the position specified or given by {{#crossLink \"Y.GalleryModelMultiRecord/_currentIndex\"}}{{/crossLink}}","		 * @method _fetch","		 * @param [index=this._currentIndex] {Integer} Position to fetch it from.","		 * @private","		 */","		_fetch: function (index) {","			if (index === undefined) {","				index = this._currentIndex;","			} else {","				this._currentIndex = index;","			}","			var self = this,","				current = self._shelves[index];","				","			if (Lang.isUndefined(current)) {","				this._initNew();","			} else {","				YArray.each(self._preserve, function (name) {","					self[name] = current[name];","				});","			}","			","		},","		/**","		 * Adds the names of properties that are to be preserved in the shelf when moving,","		 * and taken out of the shelf when fetching.","		 * @method _addPreserve","		 * @param name* {String} any number of names or array of names of properties to be preserved.","		 * @protected","		 */","		_addPreserve: function () {","			this._preserve = (this._preserve || []).concat(Array.prototype.slice.call(arguments));","		},","		","		/**","		 * Initializes an exposed record","		 * @method _initNew","		 * @private","		 */","		_initNew: function () {","			this._values = {};","			this._loadedValues = {};","			this._isNew = true;","			this._isModified = false;","		},","		/**","		 * Adds a new record at the index position given or at the end.","		 * The new record becomes the current.","		 * @method add","		 * @param values {Object} set of values to set","		 * @param [index] {Integer} position to add the values at or at the end if not provided.  ","		 * @chainable","		 */","		add: function(values, index) {","			if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {","				this._shelve();","			}","			index = index || this._shelves.length;","			this._shelves.splice(index, 0, {});","			this._currentIndex = index;","			this._initNew();","			this.setValues(values, ADD);","			return this;","		},","		/**","		 * Executes the given function for each record in the set.","		 * The function will run in the scope of the model so it can use ","		 * `this.{{#crossLink \"Y.GalleryModel/getValue\"}}{{/crossLink}}()`","		 * or any such method to access the values of the current record.","		 * Returning exactly `false` from the function spares shelving the record.","		 * If the callback function does not modify the record, ","		 * returning `false` will improve performance.","		 * @method each","		 * @param fn {function} function to execute, it will be provided with:","		 * @param fn.index {integer} index of the record exposed","		 * @chainable","		 */","		each: function(fn) {","			var self = this;","			self._shelve();","			YArray.each(self._shelves, function (shelf, index) {","				self._currentIndex = index;","				self._fetch(index);","				if (fn.call(self, index) !== false) {","					self._shelve(index);","				}","			});","			return self;","		},","		/**","		 * Executes the given function for each record in the set.","		 * The function will run in the scope of the model so it can use ","		 * `this.{{#crossLink \"Y.GalleryModel/getValue\"}}{{/crossLink}}`","		 * or any such method to access the values of the current record.","		 * It is faster than using {{#crossLink \"Y.GalleryModelMultiRecord/each\"}}{{/crossLink}} ","		 * and then checking the {{#crossLink \"Y.GalleryModel/isModified\"}}{{/crossLink}} attribute","		 * Returning exactly `false` from the function spares shelving the record.","		 * If the callback function does not modify the record, ","		 * returning `false` will improve performance.","		 * @method eachModified","		 * @param fn {function} function to execute, it will be provided with:","		 * @param fn.index {integer} index of the record exposed","		 * @chainable","		 */","		eachModified:function(fn) {","			var self = this;","			self._shelve();","			YArray.each(self._shelves,  function (shelf, index) {","				if (self._shelves[index][IS_MODIFIED]) {","					self._currentIndex = index;","					self._fetch(index);","					if (fn.call(self, index) !== false) {","						self._shelve(index);","					}","				}","			});","			return self;","		},","		/**","		 * Calls {{#crossLink \"Y.GalleryModel/save\"}}{{/crossLink}} on each record modified.","		 * This is not the best saving strategy for saving batches of records,","		 * but it is the easiest and safest.  Implementors are encouraged to ","		 * design their own.","		 * @method saveAllModified","		 * @chainable","		 */","		saveAllModified: function () {","			this.eachModified(this.save);","			return this;","		},","		/**","		 * This is a documentation entry only, this method does not define `load`. ","		 * This extension redefines the default action for the {{#crossLink \"Y.GalleryModel/loaded\"}}{{/crossLink}} event so ","		 * that if a load returns an array of records, they will be added to the shelves. ","		 * Existing records are kept, call {{#crossLink \"Y.GalleryModelMultiRecord/empty\"}}{{/crossLink}} if they should be discarded. ","		 * See method {{#crossLink \"Y.GalleryModel/load\"}}{{/crossLink}} of {{#crossLink \"Y.GalleryModel\"}}{{/crossLink}} for further info.","		 * @method load","		 */ ","		/**","		 * Default action for the loaded event, checks if the parsed response is an array","		 * and saves it into the shelves, otherwise it calls the default loader for single records.","		 * @method _defDataLoaded","		 * @param ev {EventFacade} facade produced by load.","		 * @private","		 */","		_defDataLoaded: function (ev) {","			var self = this,","				shelves = self._shelves;","			if (Lang.isArray(ev.parsed)) {","				if (shelves.length && (self.get(IS_MODIFIED) || !self.get(IS_NEW))) {","					self._shelve();","				}","				YArray.each(ev.parsed, function (values) {","					shelves.push({","						_values: values,","						_loadedValues: Y.clone(values),","						isNew: false,","						isModified:false","					});","				});","				self._fetch();","				if (self._sort) {","					self._sort();","				}","				ev.callback.call(self,null, ev.response);","			} else {","				Y.GalleryModel.prototype._defDataLoaded.apply(self, arguments);","			}","			","		},","		/**","		 * Returns the number of records stored, skipping over empty slots.","		 * @method size","		 * @return {Integer} number of records in the shelves","		 */","		size: function() {","			var count = 0;","			YArray.each(this._shelves, function () {","				count +=1;","			});","			return count;","		},","		/**","		 * Empties the shelves of any records as well as the exposed record","		 * @method empty","		 * @chainable","		 */","		empty: function () {","			this._shelves = [];","			this._currentIndex = 0;","			this.reset();","			return this;","		},","		/**","		 * Setter for the {{#crossLink \"Y.GalleryModelMultiRecord/index\"}}{{/crossLink}} attribute.","		 * Validates and copies the current index value into {{#crossLink \"Y.GalleryModel/_currentIndex\"}}{{/crossLink}}.","		 * It shelves the current record and fetches the requested one. ","		 * @method _indexSetter","		 * @param value {integer} new value for the index","		 * @return {integer|INVALID_VALUE} new value for the index or INVALID_VALUE if invalid.","		 * @private","		 */","		_indexSetter: function (value) {","			if (Lang.isNumber(value) && value >= 0 && value < this._shelves.length) {","				this._shelve(this._currentIndex);","				this._currentIndex = value = parseInt(value,10);","				this._fetch(value);","				return value;","			}","			return Y.Attribute.INVALID_VALUE;","		},","		/**","		 * Getter for the {{#crossLink \"Y.GalleryModelMultiRecord/index\"}}{{/crossLink}} attribute","		 * Returns the value from {{#crossLink \"Y.GalleryModelMultiRecord/_currentIndex\"}}{{/crossLink}}","		 * @method _indexGetter","		 * @return {integer} value of the index","		 * @private","		 */","		_indexGetter: function () {","			return this._currentIndex;","		},","		/**","		 * Getter for the {{#crossLink \"Y.GalleryModel/isNew\"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord","		 * so that it is read from the shelf and not from the actual attribute, ","		 * which is expensive to shelve","		 * @method _isNewGetter","		 * @param value {Boolean} value stored in the attribute, it is ignored.","		 * @param name {String} name of the attribute.  ","		 *		If it contains a dot, the original getter is called.","		 * @return {Boolean} state of the attribute","		 * @private","		 */","		_isNewGetter: function (value, name) {","			if (name.split(DOT).length > 1) {","				return Y.GalleryModel.prototype._isNewGetter.apply(this, arguments);","			}","			return this._isNew;","			","		},","		/**","		 * Setter for the {{#crossLink \"Y.GalleryModel/isNew\"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord","		 * so that it is written into the shelf and not into the actual attribute, ","		 * which is expensive to shelve","		 * @method _isNewSetter","		 * @param value {Boolean} value stored in the attribute.","		 * @return {Boolean} the same value as received.","		 * @private","		 */","		_isNewSetter: function (value) {","			return (this._isNew = value);","		},","		/**","		 * Getter for the {{#crossLink \"Y.GalleryModel/isModified\"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord","		 * so that it is read from the shelf and not from the actual attribute, ","		 * which is expensive to shelve","		 * @method _isModifiedGetter","		 * @param value {Boolean} value stored in the attribute, it is ignored.","		 * @param name {String} name of the attribute.  ","		 *		If it contains a dot, the original getter is called.","		 * @return {Boolean} state of the attribute","		 * @private","		 */","		_isModifiedGetter:  function (value, name) {","			if (name.split(DOT).length > 1) {","				return Y.GalleryModel.prototype._isModifiedGetter.apply(this, arguments);","			}","			return this._isModified;","			","		},","		/**","		 * Setter for the {{#crossLink \"Y.GalleryModel/isModified\"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord","		 * so that it is written into the shelf and not into the actual attribute, ","		 * which is expensive to shelve","		 * @method _isModifiedSetter","		 * @param value {Boolean} value stored in the attribute.","		 * @return {Boolean} the same value as received.","		 * @private","		 */","		_isModifiedSetter:  function (value) {","			return (this._isModified = value);","		}","			","		","	};","	","	MR.ATTRS = {","		/**","		 * Index of the record exposed.","		 * @attribute index","		 * @type Integer","		 * @default 0","		 */","		index: {","			value: 0,","			setter:'_indexSetter',","			getter:'_indexGetter'","		},","		/**","		 * Merges the new setter into the existing {{#crossLink \"Y.GalleryModel/isNew\"}}{{/crossLink}} attribute","		 * @attribute isNew","		 */","		isNew: {","			setter:'_isNewSetter'","		},","		/**","		 * Merges the new setter into the existing {{#crossLink \"Y.GalleryModel/isModified\"}}{{/crossLink}} attribute.","		 * @attribute isModified","		 */","		isModified: {","			setter: '_isModifiedSetter'","		}","	};","	","	Y.GalleryModelMultiRecord = MR;","	","	/**","	 * Extension to sort records stored in {{#crossLink \"Y.GalleryModel\"}}{{/crossLink}}, extended with {{#crossLink \"Y.GalleryModelMultiRecord\"}}{{/crossLink}}","	 * It is incompatible with {{#crossLink \"Y.GalleryModelPrimaryKeyIndex\"}}{{/crossLink}}","	 * @class Y.GalleryModelSortedMultiRecord","	 */","	var SFIELD = 'sortField',","		SDIR = 'sortDir',","		ASC = 'asc',","		DESC = 'desc',","		SMR = function () {};","	","	SMR.prototype = {","		/**","		 * Compare function used in sorting.","		 * @method _compare","		 * @param a {object} shelf to compare","		 * @param b {object} shelf to compare","		 * @return {integer} -1, 0 or 1 as required by Array.sort","		 * @private","		 */","		_compare: null,","		/**","		 * Initializer lifecycle method.  ","		 * Ensures proper defaults, sets the compare method and","		 * sets listeners for relevant events","		 * @method initializer","		 * @protected","		 */","		initializer: function () {","			if (this.get(SFIELD) === undefined) {","				this._set(SFIELD, this.get('primaryKeys')[0]);","			}","			this._setCompare();","			this.after([SFIELD + CHANGE, SDIR + CHANGE], this._sort);","			this.after(EVT_CHANGE, this._afterChange);","		},","		/**","		 * Sets the compare function to be used in sorting the records","		 * based on the {{#crossLink \"Y.GalleryModelSortedMultiRecord/sortField\"}}{{/crossLink}} ","		 * and {{#crossLink \"Y.GalleryModelSortedMultiRecord/sortDir\"}}{{/crossLink}} ","		 * attributes and stores it into this._compare","		 * @method _setCompare","		 * @private","		 */","		_setCompare: function () {","			var sortField = this.get(SFIELD),","				sortAsc = this.get(SDIR) === ASC?1:-1,","				compareValue = (Lang.isFunction(sortField)?","					sortField:","					function(values) {","						return values[sortField];","					}","				);","			this._compare = function(a, b) {","				var aValue = compareValue(a._values),","					bValue = compareValue(b._values);","","				return (aValue < bValue ? -1 : (aValue > bValue ? 1 : 0)) * sortAsc;","			};","		},","		/**","		 * Sorts the shelves whenever the ","		 * {{#crossLink \"Y.GalleryModelSortedMultiRecord/sortField\"}}{{/crossLink}} ","		 * or {{#crossLink \"Y.GalleryModelSortedMultiRecord/sortDir\"}}{{/crossLink}} ","		 * attributes change.","		 * @method _sort","		 * @private","		 */","		_sort: function() {","			this._setCompare();","			this._shelve();","			this._shelves.sort(this._compare);","			this._shelves.splice(this.size());","			this._fetch(0);","		},","		/**","		 * Listens to value changes and if the name of the field is that of the ","		 * {{#crossLink \"Y.GalleryModelSortedMultiRecord/sortField\"}}{{/crossLink}} attribute ","		 * or if {{#crossLink \"Y.GalleryModelSortedMultiRecord/sortField\"}}{{/crossLink}} ","		 * is a function, it will relocate the record to its proper sort order","		 * @method _afterChange","		 * @param ev {EventFacade} Event façade as produced by the {{#crossLink \"Y.GalleryModel/change\"}}{{/crossLink}}  event","		 * @private","		 */","		_afterChange: function (ev) {","			var fieldName = ev.name,","				sField = this.get(SFIELD),","				index,","				currentIndex = this._currentIndex,","				shelves = this._shelves,","				currentShelf;","","			if (fieldName && ev.src !== ADD && (Lang.isFunction(sField) || fieldName === sField)) {","				// The shelf has to be emptied otherwise _findIndex may match itself.","				currentShelf = shelves.splice(currentIndex,1)[0];","				index = this._findIndex(currentShelf._values);","				shelves.splice(index,0,currentShelf);","				this._currentIndex = index;","			}","		},","		/**","		 * Finds the correct index position of a record within the shelves","		 * according to the current ","		 * {{#crossLink \"Y.GalleryModelSortedMultiRecord/sortField\"}}{{/crossLink}} ","		 * or {{#crossLink \"Y.GalleryModelSortedMultiRecord/sortDir\"}}{{/crossLink}} ","		 * attributes","		 * @method _findIndex","		 * @param values {Object} values of the record to be located","		 * @return {Integer} location for the record","		 * @private","		 */","		_findIndex: function (values) {","			var shelves = this._shelves,","				low = 0, ","				high = shelves.length, ","				index = 0,","				cmp = this._compare,","				vals = {_values: values};","				","			while (low < high) {","				index = Math.floor((high + low) / 2);","				switch(cmp(vals, shelves[index])) {","					case 1:","						low = index + 1;","						break;","					case -1:","						high = index;","						break;","					default:","						low = high = index;","				}","				","			}","			return low;","			","		},","		/**","		 * Adds a new record at its proper position according to the sort configuration.","		 * It overrides  ","		 * {{#crossLink \"Y.GalleryModelMultiRecord\"}}{{/crossLink}}'s own","		 * {{#crossLink \"Y.GalleryModelMultiRecord/add\"}}{{/crossLink}} ","		 * method, ignoring the index position requested, if any.","		 * The new record becomes the current.","		 * @method add","		 * @param values {Object} set of values to set","		 * @chainable","		 */","		add: function(values) {","			var shelves = this._shelves,","				index = 0;","				","			index = this._findIndex(values);","			this._currentIndex = index;","			shelves.splice(index, 0, {});","			this._initNew();","			this.setValues(values, ADD);","			this._shelve(index);","			return this;","		},","		/**","		 * Locates a record by value.  The record will be located by the field","		 * given in the {{#crossLink \"Y.GalleryModelSortedMultiRecord/sortField\"}}{{/crossLink}}","		 *  attribute.   It will return the index of the","		 * record in the shelves or `null` if not found.","		 * By default it will expose that record.","		 * If {{#crossLink \"Y.GalleryModelSortedMultiRecord/sortField\"}}{{/crossLink}} ","		 * contains a function, it will return `null` and do nothing.","		 * Since sort fields need not be unique, find may return any of the records","		 * with the same value for that field.","		 * @method find","		 * @param value {Any} value to be found","		 * @param [move] {Boolean} exposes the record found, defaults to `true`","		 * @return {integer | null} index of the record found or `null` if not found.","		 * Be sure to differentiate a return of `0`, a valid index, from `null`, a failed search.","		 */","		find: function (value, move) {","			var sfield = this.get(SFIELD),","				index,","				values = {};","			if (Lang.isFunction(sfield)) {","				return null;","			}","			values[sfield] = value;","			index = this._findIndex(values);","			if (this._shelves[index]._values[sfield] !== value) {","				return null;","			}","			if (move || arguments.length < 2) {","				this.set(INDEX, index);","			}","			return index;","		}","	};","	SMR.ATTRS = {","		/**","		 * Name of the field to sort by or function to build the value used for comparisson.","		 * If a function, it will receive a reference to the record to be sorted;","		 * it should return the value to be used for comparisson.  Functions are","		 * used when sorting on multiple keys, which the function should return","		 * concatenated, or when any of the fields needs some pre-processing.","		 * @attribute sortField","		 * @type String | Function","		 * @default first primary key field","		 */","		sortField: {","			validator: function (value){","				return Lang.isString(value) || Lang.isFunction(value);","			}","		},","		/**","		 * Sort direction either `\"asc\"` for ascending or `\"desc\"` for descending","		 * @attribute sortDir","		 * @type String","		 * @default \"asc\"","		 */","		sortDir: {","			validator: function (value) {","				return value === DESC || value === ASC;","			},","			value: ASC","		}","	};","	Y.GalleryModelSortedMultiRecord = SMR;","	","	/**","	 * Extension to store the records in the GalleryModel using the field in the ","	 * {{#crossLink \"Y.GalleryModel/primaryKeys\"}}{{/crossLink}} attribute as its index.","	 * The primary key __must__ be a __single__ __unique__ __integer__ field.","	 * It should be used along {{#crossLink \"Y.GalleryModelMultiRecord\"}}{{/crossLink}}.","	 * It is incompatible with {{#crossLink \"Y.GalleryModelSortedMultiRecord\"}}{{/crossLink}}.","	 * @class Y.GalleryModelPrimaryKeyIndex","	 */","	var PKI = function () {};","	PKI.prototype = {","		/**","		 * Adds a new record at the index position given by its primary key.","		 * The new record becomes the current.","		 * @method add","		 * @param values {Object} set of values to set","		 * @chainable","		 */","		add: function(values) {","			if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {","				this._shelve();","			}","			this._currentIndex = values[this._primaryKeys[0]];","			this._initNew();","			this.setValues(values, ADD);","			return this;","		},","		/**","		 * Default action for the {{#crossLink \"Y.GalleryModel/loaded\"}}{{/crossLink}} event, ","		 * checks if the parsed response is an array","		 * and saves it into the shelves using the value of the primary key field for its index.","		 * The model will be left positioned at the item with the lowest key value.","		 * If the primary key field has not been declared, items will not be loaded.","		 * If the primary key field is not unique, the duplicate will overwrite the previous.","		 * @method _defDataLoaded","		 * @param ev {EventFacade} facade produced by the {{#crossLink \"Y.GalleryModel/loaded\"}}{{/crossLink}} event, ","		 * @private","		 */","		_defDataLoaded: function (ev) {","			var self = this,","				shelves = self._shelves,","				pk = self._primaryKeys[0];","				","			if (Lang.isUndefined(pk)) {","				return;","			}	","			if (self.get(IS_MODIFIED) || !self.get(IS_NEW)) {","				self._shelve();","			}","			YArray.each(new YArray(ev.parsed), function (values) {","				shelves[values[pk]] = {","					_values: values,","					_loadedValues: Y.clone(values),","					isNew: false,","					isModified:false","				};","			});","			YArray.some(shelves, function (shelf, index) {","				self._fetch(index);","				return true;","			});","			ev.callback.call(self,null, ev.response);","		","		},","		/**","		 * Sugar method added because items might not be contiguous so ","		 * adding one to the index does not always get you to the next item.","		 * If there is no next element, `null` will be returned and the","		 * collection will still point to the last item.","		 * @method next","		 * @return {integer} index of the next item or `null` if none found","		 */","		next: function () {","			if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {","				this._shelve();","			}","			var shelves = this._shelves,","				index = this._currentIndex + 1, ","				l = shelves.length;","			while (index < l && !shelves.hasOwnProperty(index)) {","				index +=1;","			}","			if (index === l) {","				return null;","			}","			this._fetch(index);","			return index;","		},","		/**","		 * Sugar method added because items might not be contiguous so ","		 * subtracting one to the index does not always get you to the previous item.","		 * If there is no next element, `null` will be returned and the","		 * collection will still point to the first item.","		 * @method previous","		 * @return {integer} index of the previous item or `null` if none found","		 */","		previous: function () {","			if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {","				this._shelve();","			}","			var shelves = this._shelves,","				index = this._currentIndex - 1;","			while (index >= 0 && !shelves.hasOwnProperty(index)) {","				index -=1;","			}","			if (index === -1) {","				return null;","			}","			this._fetch(index);","			return index;","		}","		","	};","	Y.GalleryModelPrimaryKeyIndex = PKI;","","","}, 'gallery-2012.08.29-20-10' ,{requires:['base'], skinnable:false});"];
_yuitest_coverage["/build/gallery-md-model/gallery-md-model.js"].lines = {"1":0,"26":0,"28":0,"45":0,"76":0,"77":0,"98":0,"113":0,"136":0,"139":0,"140":0,"141":0,"142":0,"143":0,"144":0,"163":0,"164":0,"165":0,"166":0,"167":0,"169":0,"170":0,"172":0,"173":0,"174":0,"177":0,"180":0,"183":0,"184":0,"186":0,"189":0,"198":0,"206":0,"219":0,"220":0,"221":0,"228":0,"237":0,"238":0,"239":0,"240":0,"242":0,"243":0,"257":0,"260":0,"261":0,"263":0,"268":0,"278":0,"282":0,"283":0,"284":0,"285":0,"288":0,"296":0,"298":0,"299":0,"301":0,"312":0,"313":0,"327":0,"329":0,"330":0,"332":0,"333":0,"334":0,"337":0,"348":0,"349":0,"350":0,"351":0,"352":0,"353":0,"363":0,"364":0,"391":0,"393":0,"394":0,"395":0,"396":0,"397":0,"399":0,"401":0,"402":0,"409":0,"410":0,"412":0,"413":0,"415":0,"417":0,"418":0,"422":0,"443":0,"444":0,"445":0,"447":0,"453":0,"457":0,"485":0,"487":0,"488":0,"489":0,"490":0,"491":0,"493":0,"495":0,"496":0,"497":0,"498":0,"501":0,"502":0,"508":0,"509":0,"511":0,"513":0,"514":0,"515":0,"516":0,"517":0,"518":0,"519":0,"520":0,"521":0,"524":0,"528":0,"536":0,"537":0,"538":0,"567":0,"610":0,"623":0,"625":0,"626":0,"628":0,"634":0,"635":0,"638":0,"656":0,"669":0,"670":0,"671":0,"672":0,"673":0,"674":0,"676":0,"689":0,"690":0,"691":0,"692":0,"693":0,"694":0,"696":0,"708":0,"709":0,"711":0,"712":0,"713":0,"727":0,"728":0,"729":0,"730":0,"731":0,"732":0,"734":0,"806":0,"808":0,"810":0,"811":0,"812":0,"814":0,"815":0,"825":0,"826":0,"835":0,"845":0,"846":0,"847":0,"848":0,"849":0,"852":0,"853":0,"854":0,"857":0,"859":0,"870":0,"872":0,"874":0,"875":0,"876":0,"878":0,"879":0,"889":0,"890":0,"899":0,"907":0,"908":0,"909":0,"910":0,"912":0,"915":0,"916":0,"918":0,"929":0,"932":0,"942":0,"943":0,"944":0,"969":0,"970":0,"972":0,"974":0,"975":0,"977":0,"987":0,"988":0,"990":0,"992":0,"995":0,"996":0,"998":0,"999":0,"1012":0,"1021":0,"1022":0,"1023":0,"1024":0,"1035":0,"1036":0,"1038":0,"1039":0,"1040":0,"1041":0,"1042":0,"1043":0,"1059":0,"1060":0,"1061":0,"1062":0,"1063":0,"1064":0,"1065":0,"1068":0,"1086":0,"1087":0,"1088":0,"1089":0,"1090":0,"1091":0,"1092":0,"1093":0,"1097":0,"1108":0,"1109":0,"1127":0,"1129":0,"1130":0,"1131":0,"1133":0,"1134":0,"1141":0,"1142":0,"1143":0,"1145":0,"1147":0,"1157":0,"1158":0,"1159":0,"1161":0,"1169":0,"1170":0,"1171":0,"1172":0,"1184":0,"1185":0,"1186":0,"1187":0,"1188":0,"1190":0,"1200":0,"1214":0,"1215":0,"1217":0,"1230":0,"1244":0,"1245":0,"1247":0,"1260":0,"1266":0,"1294":0,"1301":0,"1307":0,"1325":0,"1326":0,"1328":0,"1329":0,"1330":0,"1341":0,"1346":0,"1349":0,"1350":0,"1353":0,"1365":0,"1366":0,"1367":0,"1368":0,"1369":0,"1381":0,"1388":0,"1390":0,"1391":0,"1392":0,"1393":0,"1408":0,"1415":0,"1416":0,"1417":0,"1419":0,"1420":0,"1422":0,"1423":0,"1425":0,"1429":0,"1444":0,"1447":0,"1448":0,"1449":0,"1450":0,"1451":0,"1452":0,"1453":0,"1472":0,"1475":0,"1476":0,"1478":0,"1479":0,"1480":0,"1481":0,"1483":0,"1484":0,"1486":0,"1489":0,"1502":0,"1513":0,"1518":0,"1528":0,"1529":0,"1538":0,"1539":0,"1541":0,"1542":0,"1543":0,"1544":0,"1558":0,"1562":0,"1563":0,"1565":0,"1566":0,"1568":0,"1569":0,"1576":0,"1577":0,"1578":0,"1580":0,"1592":0,"1593":0,"1595":0,"1598":0,"1599":0,"1601":0,"1602":0,"1604":0,"1605":0,"1616":0,"1617":0,"1619":0,"1621":0,"1622":0,"1624":0,"1625":0,"1627":0,"1628":0,"1632":0};
_yuitest_coverage["/build/gallery-md-model/gallery-md-model.js"].functions = {"initializer:75":0,"(anonymous 2):173":0,"finish:171":0,"destroy:162":0,"getValue:197":0,"getValues:205":0,"setValue:218":0,"(anonymous 3):242":0,"_defSetValue:236":0,"(anonymous 4):260":0,"setValues:256":0,"(anonymous 5):282":0,"getChangedValues:277":0,"(anonymous 6):298":0,"getPKValues:295":0,"getAsHTML:311":0,"(anonymous 7):332":0,"getAsURL:326":0,"_defDataLoaded:347":0,"_stoppedDataLoaded:362":0,"(anonymous 8):401":0,"load:390":0,"parse:442":0,"(anonymous 10):501":0,"(anonymous 9):495":0,"save:484":0,"reset:535":0,"sync:566":0,"validate:609":0,"(anonymous 11):625":0,"_validate:622":0,"toJSON:655":0,"_isModifiedGetter:668":0,"_isNewGetter:688":0,"_primaryKeysSetter:707":0,"_primaryKeysGetter:726":0,"initializer:809":0,"_trackChange:824":0,"_resetUndo:834":0,"(anonymous 12):852":0,"undo:844":0,"initializer:873":0,"_trackChange:888":0,"_resetUndo:898":0,"undo:906":0,"initializer:941":0,"(anonymous 13):974":0,"_shelve:968":0,"(anonymous 14):998":0,"_fetch:986":0,"_addPreserve:1011":0,"_initNew:1020":0,"add:1034":0,"(anonymous 15):1061":0,"each:1058":0,"(anonymous 16):1088":0,"eachModified:1085":0,"saveAllModified:1107":0,"(anonymous 17):1133":0,"_defDataLoaded:1126":0,"(anonymous 18):1158":0,"size:1156":0,"empty:1168":0,"_indexSetter:1183":0,"_indexGetter:1199":0,"_isNewGetter:1213":0,"_isNewSetter:1229":0,"_isModifiedGetter:1243":0,"_isModifiedSetter:1259":0,"initializer:1324":0,"sortField:1345":0,"_compare:1349":0,"_setCompare:1340":0,"_sort:1364":0,"_afterChange:1380":0,"_findIndex:1407":0,"add:1443":0,"find:1471":0,"validator:1501":0,"validator:1512":0,"add:1537":0,"(anonymous 19):1568":0,"(anonymous 20):1576":0,"_defDataLoaded:1557":0,"next:1591":0,"previous:1615":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/gallery-md-model/gallery-md-model.js"].coveredLines = 382;
_yuitest_coverage["/build/gallery-md-model/gallery-md-model.js"].coveredFunctions = 87;
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
		UNDO = 'undo',
		NULL_FN = function (){};
	

	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 45);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "initializer", 75);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 76);
this._values = {};
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 77);
this._loadedValues = {};
				/**
				 * Fired whenever a value or values are changed. 
				 * If changed via {{#crossLink "Y.GalleryModel/setValues"}}{{/crossLink}} the facade will not contain a __name__.  
				 * Instead, __prevVals__ and __newVals__ (both plural) properties will contain 
				 * hashes with the names and values of the fields changed.
				 * After firing the event for a group of fields changed via {{#crossLink "Y.GalleryModel/setValues"}}{{/crossLink}},
				 * a new change event will be fired for each individual field changed.
				 * For individual field changes via {{#crossLink "Y.GalleryModel/setValue"}}{{/crossLink}}, the __name__, __prevVal__ and __newVal__
				 * will be provided.
				 * The event can be prevented on a per group change basis or per individual field change.
				 * Preventing the change on a particular field will not prevent the others from being changed.
				 * @event change
				 * @param ev {EventFacade} containing:
				 * @param [ev.name] {String} Name of the field changed
				 * @param [ev.newVal] {Any} New value of the field.
				 * @param [ev.prevVal] {Any} Previous value of the field.
				 * @param [ev.newVals] {Object} Hash with the new values for the listed fields.
				 * @param [ev.prevVals] {Object} Hash with the previous values for the listed fields.
				 * @param ev.src {String|null} Source of the change event, if any.
				 */
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 98);
this.publish(EVT_CHANGE, {
					defaultFn: this._defSetValue
				});
				/**
				 * Fired when new data has been received from the remote source.  
				 * It will also be fired even on a {{#crossLink "Y.GalleryModel/save"}}{{/crossLink}} operation if the response contains values.
				 * The parsed values can be altered on the before (on) listener.
				 * @event loaded
				 * @param ev {EventFacade} containing:
				 * @param ev.response {Object} Response data as received from the remote source
				 * @param ev.parsed {Object} Data as returned from the parse method.
				 * @param ev.options {Object} Options as received by the {{#crossLink "Y.GalleryModel/load"}}{{/crossLink}} method.
				 * @param ev.callback {Function} Function to call at the end of the load process
				 * @param ev.src {String} the source of the load, usually `'load'`
				 */
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 113);
this.publish(EVT_LOADED, {
					defaultFn:this._defDataLoaded,
					preventedFn: this._stoppedDataLoaded,
					stoppedFn: this._stoppedDataLoaded
				});
				/**
				 * Fired when the data has been saved to the remote source
				 * The event cannot be prevented.  
				 * The developer has full control of what is
				 * about to be saved and when it is saved so it would be pointless
				 * to try to prevent it at this stage.  This is in contrast to
				 * the {{#crossLink "Y.GalleryModel/loaded"}}{{/crossLink}} event where the developer has no control of what might
				 * come from the server and might wish to do something about it.
				 * If in reply to the save operation the server replies with data, 
				 * the __response__ and __parsed__ properties will be filled.
				 * @event saved
				 * @param ev {EventFacade} containing:
				 * @param [ev.response] {Object} Response data as received from the remote source, if any.
				 * @param [ev.parsed] {Object} Data as returned from the parse method, if any.
				 * @param ev.options {Object} Options as received by the {{#crossLink "Y.GalleryModel/save"}}{{/crossLink}} method.
				 * @param ev.callback {Function} Function to call at the end of the load process
				 * @param ev.src {String} the source of the save, usually `'save'`
				 */
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 136);
this.publish(EVT_SAVED, {
					preventable: false
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 139);
cfg = cfg || {};
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 140);
if (Lang.isObject(cfg.values)) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 141);
this.setValues(cfg.values, 'init');
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 142);
this._set(IS_MODIFIED, false);
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 143);
this._set(IS_NEW, true);
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 144);
this._loadedValues = Y.clone(this._values);
				}
			},
			/**
			 * Destroys this model instance and removes it from its containing lists, if
			 * any.

			 * If __options.remove__ is true then this method also delegates to the
			 * {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}} method to delete the model from the persistence layer.

			 * @method destroy
			 * @param [options] {Object} Options passed on to the {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}} method, if required.
			 * @param [options.remove=false] {Boolean} if true, the data will also be erased from the server.
			 * @param [callback] {function} function to be called when the sync operation finishes.
			 *		@param callback.err {string|null} Error message, if any or null.
			 *		@param callback.response {Any} The server response as received by {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}}.
			 * @chainable
			 */
			destroy: function (options, callback) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "destroy", 162);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 163);
if (Lang.isFunction(options)) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 164);
callback = options;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 165);
options = {};
				} else {_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 166);
if (!options) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 167);
options = {};
				}}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 169);
callback = callback || NULL_FN;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 170);
var self = this,
					finish = function (err) {
						_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "finish", 171);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 172);
if (!err) {
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 173);
YArray.each(self.lists.concat(), function (list) {
								_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 2)", 173);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 174);
list.remove(self, options);
							});

							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 177);
Y.GalleryModel.superclass.destroy.call(self);
						}

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 180);
callback.apply(self, arguments);
					};

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 183);
if (options.remove) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 184);
this.sync('delete', options, finish);
				} else {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 186);
finish();
				}

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 189);
return this;
			},
			/**
			 * Returns the value of the field named
			 * @method getValue
			 * @param name {string}  Name of the field to return.
			 * @return {Any} the value of the field requested.  
			 */ 
			getValue: function (name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getValue", 197);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 198);
return this._values[name];
			},
			/**
			 * Returns a hash with all values using the field names as keys.
			 * @method getValues
			 * @return {Object} a hash with all the fields with the field names as keys.
			 */ 
			getValues: function() {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getValues", 205);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 206);
return Y.clone(this._values);
			},
			/**
			 * Sets the value of the named field. 
			 * Fires the {{#crossLink "Y.GalleryModel/change"}}{{/crossLink}} event if the new value is different from the current one.
			 * Primary key fields cannot be changed unless still `undefined`.
			 * @method setValue
			 * @param name {string} Name of the field to be set
			 * @param value {Any} Value to be assigned to the field
			 * @param [src] {Any} Source of the change in the value.
			 * @chainable
			 */
			setValue: function (name, value, src) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "setValue", 218);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 219);
var prevVal = this._values[name];
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 220);
if (prevVal !== value && (this._primaryKeys.indexOf(name) === -1 || Lang.isUndefined(prevVal))) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 221);
this.fire(EVT_CHANGE, {
						name:name,
						newVal:value,
						prevVal:prevVal,
						src: src
					});
				}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 228);
return this;
			},
			/**
			 * Default function for the change event, sets the value and marks the model as modified.
			 * @method _defSetValue
			 * @param ev {EventFacade} (see {{#crossLink "Y.GalleryModel/change"}}{{/crossLink}} event)
			 * @private
			 */
			_defSetValue: function (ev) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_defSetValue", 236);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 237);
var self = this;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 238);
if (ev.name) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 239);
self._values[ev.name] = ev.newVal;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 240);
self._set(IS_MODIFIED, true);
				} else {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 242);
YObject.each(ev.newVals, function (value, name) {
						_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 3)", 242);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 243);
self.setValue(name, value, ev.src);
					});
				}
			},
			/**
			 * Sets a series of values.   
			 * It simply loops over the hash of values provided calling {{#crossLink "Y.GalleryModel/setValue"}}{{/crossLink}} on each.
			 * Fires the {{#crossLink "Y.GalleryModel/change"}}{{/crossLink}} event.
			 * @method setValues
			 * @param values {Object} hash of values to change
			 * @param [src] {Any} Source of the changes
			 * @chainable
			 */
			setValues: function (values, src) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "setValues", 256);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 257);
var self = this,
					prevVals = {};
					
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 260);
YObject.each(values, function (value, name) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 4)", 260);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 261);
prevVals[name] = self.getValue(name);
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 263);
this.fire(EVT_CHANGE, {
					newVals:values,
					prevVals:prevVals,
					src: src
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 268);
return self;
			},
			/**
			 * Returns a hash indexed by field name, of all the values in the model that have changed since the last time
			 * they were synchornized with the remote source.   Each entry has a __prevVal__ and __newVal__ entry.
			 * @method getChangedValues
			 * @return {Object} Hash of all entries changed since last synched.
			 * Each entry has a __newVal__ and __prevVal__ property contaning original and changed values.
			 */
			getChangedValues: function() {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getChangedValues", 277);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 278);
var changed = {}, 
					prev, 
					loaded = this._loadedValues;

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 282);
YObject.each(this._values, function (value, name) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 5)", 282);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 283);
prev = loaded[name];
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 284);
if (prev !== value) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 285);
changed[name] = {prevVal:prev, newVal: value};
					}
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 288);
return changed;
			},
			/**
			 * Returns a hash with the values of the primary key fields, indexed by their field names
			 * @method getPKValues
			 * @return {Object} Hash with the primary key values, indexed by their field names
			 */
			getPKValues: function () {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getPKValues", 295);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 296);
var pkValues = {},
					self = this;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 298);
YArray.each(self._primaryKeys, function (name) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 6)", 298);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 299);
pkValues[name] = self._values[name];
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 301);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getAsHTML", 311);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 312);
var value = this.getValue(name);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 313);
return Y.Escape.html(Lang.isValue(value) ? String(value) : '');
			},

			/**
			 * Returns a URL-encoded version of the value of the specified field,
			 * or a full URL with `name=value` sets for all fields if no name is given.
			 * The names and values are encoded using the native `encodeURIComponent()`
			 * function.

			 * @method getAsURL
			 * @param [name] {String}  Field name.
			 * @return {String} URL-encoded field value if name is given or URL encoded set of `name=value` pairs for all fields.
			 */
			getAsURL: function (name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "getAsURL", 326);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 327);
var value = this.getValue(name),
					url = [];
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 329);
if (name) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 330);
return encodeURIComponent(Lang.isValue(value) ? String(value) : '');
				} 
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 332);
YObject.each(value, function (value, name) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 7)", 332);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 333);
if (Lang.isValue(value)) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 334);
url.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
					}
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 337);
return url.join('&');
			},

			/**
			 * Default function for the {{#crossLink "Y.GalleryModel/loaded"}}{{/crossLink}} event. 
			 * Does the actual setting of the values just loaded and calls the callback function.
			 * @method _defDataLoaded
			 * @param ev {EventFacade} see loaded event
			 * @private
			 */
			_defDataLoaded: function (ev) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_defDataLoaded", 347);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 348);
var self = this;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 349);
self.setValues(ev.parsed, ev.src);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 350);
self._set(IS_MODIFIED, false);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 351);
self._set(IS_NEW, false);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 352);
self._loadedValues = Y.clone(self._values);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 353);
ev.callback.call(self,null, ev.response);
			},
			/**
			 * Function called when the {{#crossLink "Y.GalleryModel/loaded"}}{{/crossLink}} event is prevented, stopped or halted
			 * so that the callback is called with a suitable error
			 * @method _stoppedDataLoaded
			 * @param ev {EventFacade}
			 * @private
			 */
			_stoppedDataLoaded: function (ev) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_stoppedDataLoaded", 362);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 363);
console.log('stopped', ev);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 364);
ev.details[0].callback.call(this, 'Load event halted');
			},
			/**
				Loads this model from the server.

				This method delegates to the {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}} method to perform the actual load
				operation, which is an asynchronous action. Specify a __callback__ function to
				be notified of success or failure.

				A successful load operation will fire a {{#crossLink "Y.GalleryModel/loaded"}}{{/crossLink}} event, while an unsuccessful
				load operation will fire an {{#crossLink "Y.GalleryModel/error"}}{{/crossLink}} event with the `src` set to `"load"`.

				@method load
				@param [options] {Object} Options to be passed to {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}}.
					Usually these will be or will include the keys used by the remote source 
					to locate the data to be loaded.
					They will be passed on unmodified to the {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}} method.
					It is up to {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}} to determine what they mean.
				@param [callback] {callback} <span class="flag deprecated">deprecated</span> 
					Use `this.load(options).after('loaded', callback)` instead.
			
					Called when the sync operation finishes. Callback will receive:
					@param callback.err {string|null} Error message, if any or null.
					@param callback.response {Any} The server response as received by sync(),
				@chainable
			**/
			load: function (options, callback) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "load", 390);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 391);
var self = this;

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 393);
if (Lang.isFunction(options)) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 394);
callback = options;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 395);
options = {};
				} else {_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 396);
if (!options) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 397);
options = {};
				}}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 399);
callback = callback || NULL_FN;

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 401);
self.sync('read', options, function (err, response) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 8)", 401);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 402);
var facade = {
							options : options,
							response: response,
							src: 'load',
							callback: callback
						};

					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 409);
if (err) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 410);
facade.error = err;

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 412);
self.fire(EVT_ERROR, facade);
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 413);
callback.apply(self, arguments);
					} else {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 415);
self._values = {};

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 417);
facade.parsed = self.parse(response);
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 418);
self.fire(EVT_LOADED, facade);
					}
				});

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 422);
return self;
			},

			/**
				Called to parse the __response__ when a response is received from the server.
				This method receives a server __response__ and is expected to return a
				value hash.

				The default implementation assumes that __response__ is either an attribute
				hash or a JSON string that can be parsed into an attribute hash. If
				__response__ is a JSON string and either Y.JSON or the native JSON object
				are available, it will be parsed automatically. If a parse error occurs, an
				error event will be fired and the model will not be updated.

				You may override this method to implement custom parsing logic if necessary.

				@method parse
				@param {Any} response Server response.
				@return {Object} Values hash.
			**/
			parse: function (response) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "parse", 442);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 443);
if (typeof response === 'string') {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 444);
try {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 445);
return Y.JSON.parse(response);
					} catch (ex) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 447);
this.fire(EVT_ERROR, {
							error : ex,
							response: response,
							src : 'parse'
						});

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 453);
return null;
					}
				}

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 457);
return response;
			},



			/**
				Saves this model to the server.

				This method delegates to the {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}} method to perform the actual save
				operation, which is an asynchronous action. Specify a __callback__ function to
				be notified of success or failure.

				A successful save operation will fire a {{#crossLink "Y.GalleryModel/saved"}}{{/crossLink}} event, while an unsuccessful
				load operation will fire an {{#crossLink "Y.GalleryModel/error"}}{{/crossLink}} event with the 'src' property set to `"save"`.

				If the save operation succeeds and the {{#crossLink "Y.GalleryModel/parse"}}{{/crossLink}} method returns non-empty values
				from the response received from the server a {{#crossLink "Y.GalleryModel/loaded"}}{{/crossLink}} event will also be fired to read those values.

				@method save
				@param {Object} [options] Options to be passed to {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}}. 
					It's up to the custom sync implementation
					to determine what options it supports or requires, if any.
				@param {Function} [callback] Called when the sync operation finishes.
					@param callback.err {string|null} Error message, if any or null.
					@param callback.response {Any} The server response as received by {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}},
				@chainable
			**/
			save: function (options, callback) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "save", 484);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 485);
var self = this;

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 487);
if (Lang.isFunction(options)) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 488);
callback = options;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 489);
options = {};
				} else {_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 490);
if (!options) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 491);
options = {};
				}}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 493);
callback = callback || NULL_FN;

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 495);
self._validate(self.getValues(), function (err) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 9)", 495);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 496);
if (err) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 497);
callback.call(self, err);
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 498);
return;
					}

					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 501);
self.sync(self.get(IS_NEW) ? 'create' : 'update', options, function (err, response) {
						_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 10)", 501);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 502);
var facade = {
								options : options,
								response: response,
								src: 'save'
							};

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 508);
if (err) {
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 509);
facade.error = err;

							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 511);
self.fire(EVT_ERROR, facade);
						} else {
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 513);
facade.parsed = self.parse(response);
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 514);
facade.callback = callback;
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 515);
self._set(IS_MODIFIED, false);
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 516);
self._set(IS_NEW, false);
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 517);
self._loadedValues = Y.clone(self._values);
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 518);
self.fire(EVT_SAVED, facade);
							_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 519);
if (facade.parsed) {
								_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 520);
self.fire(EVT_LOADED, facade);
								_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 521);
return self; // the loaded event will take care of calling the callback
							}
						}
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 524);
callback.apply(self, arguments);
					});
				});

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 528);
return self;
			},
			/**
			 * Restores the values when last loaded, saved or created.
			 * @method reset
			 * @chainable
			 */
			reset: function() {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "reset", 535);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 536);
this._values = Y.clone(this._loadedValues);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 537);
this.fire(EVT_RESET);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 538);
return this;
			},
			/**
				Override this method to provide a custom persistence implementation for this
				model. The default just calls the callback without actually doing anything.

				This method is called internally by {{#crossLink "Y.GalleryModel/load"}}{{/crossLink}}, 
				{{#crossLink "Y.GalleryModel/save"}}{{/crossLink}}, 
				and {{#crossLink "Y.GalleryModel/destroy"}}{{/crossLink}} (when `options.remove==true).

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
						contain the error. If the sync operation succeeded, __err__ will be
						falsy.
					@param {Any} [callback.response] The server's response. This value will
						be passed to the {{#crossLink "Y.GalleryModel/parse"}}{{/crossLink}} method, which is expected to parse it and
						return an attribute hash.
			**/
			sync: function (action, options, callback) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "sync", 566);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 567);
(callback || NULL_FN).call(this);
			},
			/**
				Override this method to provide custom validation logic for this model.

				This method gives you a hook to validate a hash of all
				attributes before the model is saved. This method is called automatically
				before {{#crossLink "Y.GalleryModel/save"}}{{/crossLink}} takes any action. 
				If validation fails, the {{#crossLink "Y.GalleryModel/save"}}{{/crossLink}} call
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
				@param {Object} attrs Hash containing all model attributes to
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "validate", 609);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 610);
(callback || NULL_FN).call(this);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_validate", 622);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 623);
var self = this;

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 625);
self.validate(attributes, function (err) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 11)", 625);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 626);
if (Lang.isValue(err)) {
						// Validation failed. Fire an error.
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 628);
self.fire(EVT_ERROR, {
							attributes: attributes,
							error : err,
							src : 'validate'
						});

						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 634);
callback.call(self, err);
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 635);
return;
					}

					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 638);
callback.call(self);
				});

			},
			/**
			 * The default implementation calls {{#crossLink "Y.GalleryModel/getValues"}}{{/crossLink}}
			 * so that it returns a copy of the record.  
			 * The developer may redefine this method to serialize this object
			 * in any way that might be needed.  
			 * For example, it might be desirable to call 
			 * {{#crossLink "Y.GalleryModel/getChangedValues"}}{{/crossLink}}
			 * to return only changed fields, along with 
			 * {{#crossLink "Y.GalleryModel/getPKValues"}}{{/crossLink}} 
			 * to identify the record with the changes.
			 * @method toJSON
			 * @return {Object} Copy of this model field values.
			 */
			toJSON: function () {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "toJSON", 655);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 656);
return this.getValues();
			},
			/**
			 * Getter for the {{#crossLink "Y.GalleryModel/isModified"}}{{/crossLink}} attribute.
			 * If the value contains a dot (`'.'`) the modified state of the field named as a sub-attribute will be returned.
			 * Otherwise, the modified status of the whole record will be returned.
			 * @method _isModifiedGetter
			 * @param value {Any} Value stored for the attribute. 
			 * @value name {String} Name of the attribute/sub-attribute being modified
			 * @return {Boolean} State of the record/field
			 * @protected
			 */
			_isModifiedGetter: function (value, name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_isModifiedGetter", 668);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 669);
name = name.split(DOT);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 670);
if (name.length > 1) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 671);
name = name[1];
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 672);
var ret = {};
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 673);
ret[name] = this._values[name] !== this._loadedValues[name];
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 674);
return ret;
				}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 676);
return value;
			},
			/**
			 * Getter for the {{#crossLink "Y.GalleryModel/isNew"}}{{/crossLink}} attribute.
			 * If the value contains a dot (`'.'`) the 'new' state of the field named as a sub-attribute will be returned.
			 * Otherwise, the 'new' status of the whole record will be returned.
			 * @method _isNewGetter
			 * @param value {Any} Value stored for the attribute. 
			 * @value name {String} Name of the attribute/sub-attribute being modified
			 * @return {Boolean} State of the record/field
			 * @protected
			 */
			_isNewGetter: function (value, name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_isNewGetter", 688);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 689);
name = name.split(DOT);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 690);
if (name.length > 1) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 691);
name = name[1];
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 692);
var ret = {};
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 693);
ret[name] = !this._loadedValues.hasOwnProperty(name);
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 694);
return ret;
				}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 696);
return value;
			},
			/**
			 * Setter for the {{#crossLink "Y.GalleryModel/primaryKeys"}}{{/crossLink}} attribute.
			 * If the value is already set, no further changes will be allowed.
			 * If the value is not an array, it will be converted to one.
			 * @method _primaryKeysSetter
			 * @param value {Any} Value stored for the attribute. 
			 * @return {Array} Primary keys
			 * @protected
			 */
			_primaryKeysSetter: function (value) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_primaryKeysSetter", 707);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 708);
if (this._primaryKeys && this._primaryKeys.length) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 709);
return Y.Attribute.INVALID_VALUE;
				}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 711);
value = new YArray(value);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 712);
this._primaryKeys = value;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 713);
return value;
			},
			/**
			 * Getter for the {{#crossLink "Y.GalleryModel/primaryKeys"}}{{/crossLink}} attribute.
			 * If the name contains a dot (`'.'`) it will return a boolean indicating 
			 * whether the field named as a sub-attribute is part of the primary key.
			 * Otherwise, it returns the array of primary key fields.
			 * @method  _primaryKeysGetter
			 * @param value {Array} Names of the primary key fields
			 * @param name {String} Name of the attribute/sub-attribute requested.
			 * @return {Array|Boolean} Array of the primary key field names or Boolean indicating if the asked for field is part of it.
			 * @private
			 */
			_primaryKeysGetter: function (value, name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_primaryKeysGetter", 726);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 727);
name = name.split(DOT);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 728);
if (name.length > 1) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 729);
name = name[1];
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 730);
var ret = {};
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 731);
ret[name] = value.indexOf(name) !== -1;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 732);
return ret;
				}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 734);
return (value || []).concat();  // makes sure to return a copy, not the original.
			}
		},
		{
			ATTRS: {
				/**
				 * Indicates whether any of the fields has been changed since created or loaded.
				 * Field names can be given as sub-attributes to indicate if any particular field has beeen changed.
				 * `model.get('isModified.name')` returns `true` if the field `name` has been modified.
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
				 * `model.get('isNew.name')` returns `true` if the field `name` is new.
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
				 * `model.get('primaryKeys.name')` returns `true` if the field `name` is a primary key.
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
	 * It will never undo a field to `undefined` since it assumes an undefined field had not been set.
	 * @class Y.GalleryModelSimpleUndo
	 */
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 806);
Y.GalleryModelSimpleUndo = function () {};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 808);
Y.GalleryModelSimpleUndo.prototype = {
		initializer: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "initializer", 809);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 810);
this._lastChange = {};
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 811);
if (this._addPreserve) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 812);
this._addPreserve('_lastChange');
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 814);
this.after(EVT_CHANGE, this._trackChange);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 815);
this.on([EVT_LOADED, EVT_SAVED, EVT_RESET], this._resetUndo);	
		},
		/**
		 * Event listener for the after value change event, it tracks changes for each field.  
		 * It retains only the last change for each field.
		 * @method _trackChange
		 * @param ev {EventFacade} As provided by the {{#crossLink "Y.GalleryModel/change"}}{{/crossLink}} event
		 * @private
		 */
		_trackChange: function (ev) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_trackChange", 824);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 825);
if (ev.name && ev.src !== UNDO) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 826);
this._lastChange[ev.name] = ev.prevVal;
			}
		},
		/**
		 * After load or save operations, it drops any changes it might have tracked.
		 * @method _resetUndo
		 * @private
		 */
		_resetUndo: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_resetUndo", 834);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 835);
this._lastChange = {};
		},
		/**
		 * Reverts one level of change for a specific field or all fields
		 * @method undo
		 * @param [name] {String} If provided it will undo that particular field,
		 *	otherwise, it undoes the whole record.
		 * @chainable
		 */
		undo: function (name) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "undo", 844);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 845);
var self = this;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 846);
if (name) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 847);
if (self._lastChange[name] !== undefined) {		
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 848);
self.setValue(name, self._lastChange[name], UNDO);
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 849);
delete self._lastChange[name];
				}
			} else {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 852);
YObject.each(self._lastChange, function (value, name) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 12)", 852);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 853);
if (value !== undefined) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 854);
self.setValue(name, value, UNDO);
					}
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 857);
self._lastChange = {};
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 859);
return self;
		}
	};
	
	/**
	 * Provides multiple levels of undo in strict chronological order 
	 * whatever the field was at each stage.
	 * Changes done on multiple fields via setValues
	 * will also be undone in one step.
	 * @class Y.GalleryModelChronologicalUndo
	 */
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 870);
Y.GalleryModelChronologicalUndo = function () {};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 872);
Y.GalleryModelChronologicalUndo.prototype = {
		initializer: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "initializer", 873);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 874);
this._changes = [];
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 875);
if (this._addPreserve) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 876);
this._addPreserve('_changes');
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 878);
this.after(EVT_CHANGE, this._trackChange);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 879);
this.on([EVT_LOADED,EVT_SAVED,EVT_RESET], this._resetUndo);
		},
		/**
		 * Event listener for the after value change event, it tracks changes for each field.  
		 * It keeps a stack of each change.  
		 * @method _trackChange
		 * @param ev {EventFacade} As provided by the {{#crossLink "Y.GalleryModel/change"}}{{/crossLink}} event
		 * @private
		 */
		_trackChange: function (ev) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_trackChange", 888);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 889);
if (ev.src !== UNDO) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 890);
this._changes.push(ev.details);
			}
		},
		/**
		 * After load or save operations, it drops any changes it might have tracked.
		 * @method _resetUndo
		 * @private
		 */
		_resetUndo: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_resetUndo", 898);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 899);
this._changes = [];
		},
		/**
		 * Reverts one level of field changes.
		 * @method undo
		 * @chainable
		 */
		undo: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "undo", 906);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 907);
var ev = this._changes.pop();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 908);
if (ev) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 909);
if (ev.name) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 910);
this.setValue(ev.name, ev.prevVal, UNDO);
				} else {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 912);
this.setValues(ev.prevVals, UNDO);
				}
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 915);
if (this._changes.length === 0) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 916);
this._set(IS_MODIFIED, false);
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 918);
return this;
		}
	};
	
	/**
	 * Allows GalleryModel to handle a set of records using the Flyweight pattern.
	 * It exposes one record at a time from a shelf of records.
	 * Exposed records can be selected by setting the {{#crossLink "Y.GalleryModel/index"}}{{/crossLink}} attribute.
	 * @class Y.GalleryModelMultiRecord
	 */
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 929);
var INDEX = 'index',
		MR = function () {};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 932);
MR.prototype = {
		/**
		 * Added this property to have `ModelSync.REST getURL()` return the proper URL.
		 * @property _isYUIModelList
		 * @type Boolean
		 * @value true
		 * @private
		 */
		_isYUIModelList: true,
		initializer: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "initializer", 941);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 942);
this._shelves = [];
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 943);
this._currentIndex = 0;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 944);
this._addPreserve('_values','_loadedValues','_isNew','_isModified');
		},
		/**
		 * Index of the shelf for the record being exposed.
		 * Use {{#crossLink "Y.GalleryModel/index"}}{{/crossLink}} attribute to check/set the index value.
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
		 * Saves the exposed record into the shelves at the position specified or given by {{#crossLink "Y.GalleryModelMultiRecord/_currentIndex"}}{{/crossLink}}
		 * @method _shelve
		 * @param [index=this._currentIndex] {Integer} Position to shelve it in
		 * @private
		 */
		_shelve: function(index) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_shelve", 968);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 969);
if (index === undefined) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 970);
index = this._currentIndex;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 972);
var self = this,
				current = {};
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 974);
YArray.each(self._preserve, function (name) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 13)", 974);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 975);
current[name] = self[name];
			});
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 977);
self._shelves[index] = current;
			
		},
		/**
		 * Retrives and exposes the record from the shelf at the position specified or given by {{#crossLink "Y.GalleryModelMultiRecord/_currentIndex"}}{{/crossLink}}
		 * @method _fetch
		 * @param [index=this._currentIndex] {Integer} Position to fetch it from.
		 * @private
		 */
		_fetch: function (index) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_fetch", 986);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 987);
if (index === undefined) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 988);
index = this._currentIndex;
			} else {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 990);
this._currentIndex = index;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 992);
var self = this,
				current = self._shelves[index];
				
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 995);
if (Lang.isUndefined(current)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 996);
this._initNew();
			} else {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 998);
YArray.each(self._preserve, function (name) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 14)", 998);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 999);
self[name] = current[name];
				});
			}
			
		},
		/**
		 * Adds the names of properties that are to be preserved in the shelf when moving,
		 * and taken out of the shelf when fetching.
		 * @method _addPreserve
		 * @param name* {String} any number of names or array of names of properties to be preserved.
		 * @protected
		 */
		_addPreserve: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_addPreserve", 1011);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1012);
this._preserve = (this._preserve || []).concat(Array.prototype.slice.call(arguments));
		},
		
		/**
		 * Initializes an exposed record
		 * @method _initNew
		 * @private
		 */
		_initNew: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_initNew", 1020);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1021);
this._values = {};
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1022);
this._loadedValues = {};
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1023);
this._isNew = true;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1024);
this._isModified = false;
		},
		/**
		 * Adds a new record at the index position given or at the end.
		 * The new record becomes the current.
		 * @method add
		 * @param values {Object} set of values to set
		 * @param [index] {Integer} position to add the values at or at the end if not provided.  
		 * @chainable
		 */
		add: function(values, index) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "add", 1034);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1035);
if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1036);
this._shelve();
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1038);
index = index || this._shelves.length;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1039);
this._shelves.splice(index, 0, {});
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1040);
this._currentIndex = index;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1041);
this._initNew();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1042);
this.setValues(values, ADD);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1043);
return this;
		},
		/**
		 * Executes the given function for each record in the set.
		 * The function will run in the scope of the model so it can use 
		 * `this.{{#crossLink "Y.GalleryModel/getValue"}}{{/crossLink}}()`
		 * or any such method to access the values of the current record.
		 * Returning exactly `false` from the function spares shelving the record.
		 * If the callback function does not modify the record, 
		 * returning `false` will improve performance.
		 * @method each
		 * @param fn {function} function to execute, it will be provided with:
		 * @param fn.index {integer} index of the record exposed
		 * @chainable
		 */
		each: function(fn) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "each", 1058);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1059);
var self = this;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1060);
self._shelve();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1061);
YArray.each(self._shelves, function (shelf, index) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 15)", 1061);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1062);
self._currentIndex = index;
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1063);
self._fetch(index);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1064);
if (fn.call(self, index) !== false) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1065);
self._shelve(index);
				}
			});
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1068);
return self;
		},
		/**
		 * Executes the given function for each record in the set.
		 * The function will run in the scope of the model so it can use 
		 * `this.{{#crossLink "Y.GalleryModel/getValue"}}{{/crossLink}}`
		 * or any such method to access the values of the current record.
		 * It is faster than using {{#crossLink "Y.GalleryModelMultiRecord/each"}}{{/crossLink}} 
		 * and then checking the {{#crossLink "Y.GalleryModel/isModified"}}{{/crossLink}} attribute
		 * Returning exactly `false` from the function spares shelving the record.
		 * If the callback function does not modify the record, 
		 * returning `false` will improve performance.
		 * @method eachModified
		 * @param fn {function} function to execute, it will be provided with:
		 * @param fn.index {integer} index of the record exposed
		 * @chainable
		 */
		eachModified:function(fn) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "eachModified", 1085);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1086);
var self = this;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1087);
self._shelve();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1088);
YArray.each(self._shelves,  function (shelf, index) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 16)", 1088);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1089);
if (self._shelves[index][IS_MODIFIED]) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1090);
self._currentIndex = index;
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1091);
self._fetch(index);
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1092);
if (fn.call(self, index) !== false) {
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1093);
self._shelve(index);
					}
				}
			});
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1097);
return self;
		},
		/**
		 * Calls {{#crossLink "Y.GalleryModel/save"}}{{/crossLink}} on each record modified.
		 * This is not the best saving strategy for saving batches of records,
		 * but it is the easiest and safest.  Implementors are encouraged to 
		 * design their own.
		 * @method saveAllModified
		 * @chainable
		 */
		saveAllModified: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "saveAllModified", 1107);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1108);
this.eachModified(this.save);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1109);
return this;
		},
		/**
		 * This is a documentation entry only, this method does not define `load`. 
		 * This extension redefines the default action for the {{#crossLink "Y.GalleryModel/loaded"}}{{/crossLink}} event so 
		 * that if a load returns an array of records, they will be added to the shelves. 
		 * Existing records are kept, call {{#crossLink "Y.GalleryModelMultiRecord/empty"}}{{/crossLink}} if they should be discarded. 
		 * See method {{#crossLink "Y.GalleryModel/load"}}{{/crossLink}} of {{#crossLink "Y.GalleryModel"}}{{/crossLink}} for further info.
		 * @method load
		 */ 
		/**
		 * Default action for the loaded event, checks if the parsed response is an array
		 * and saves it into the shelves, otherwise it calls the default loader for single records.
		 * @method _defDataLoaded
		 * @param ev {EventFacade} facade produced by load.
		 * @private
		 */
		_defDataLoaded: function (ev) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_defDataLoaded", 1126);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1127);
var self = this,
				shelves = self._shelves;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1129);
if (Lang.isArray(ev.parsed)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1130);
if (shelves.length && (self.get(IS_MODIFIED) || !self.get(IS_NEW))) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1131);
self._shelve();
				}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1133);
YArray.each(ev.parsed, function (values) {
					_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 17)", 1133);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1134);
shelves.push({
						_values: values,
						_loadedValues: Y.clone(values),
						isNew: false,
						isModified:false
					});
				});
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1141);
self._fetch();
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1142);
if (self._sort) {
					_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1143);
self._sort();
				}
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1145);
ev.callback.call(self,null, ev.response);
			} else {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1147);
Y.GalleryModel.prototype._defDataLoaded.apply(self, arguments);
			}
			
		},
		/**
		 * Returns the number of records stored, skipping over empty slots.
		 * @method size
		 * @return {Integer} number of records in the shelves
		 */
		size: function() {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "size", 1156);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1157);
var count = 0;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1158);
YArray.each(this._shelves, function () {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 18)", 1158);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1159);
count +=1;
			});
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1161);
return count;
		},
		/**
		 * Empties the shelves of any records as well as the exposed record
		 * @method empty
		 * @chainable
		 */
		empty: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "empty", 1168);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1169);
this._shelves = [];
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1170);
this._currentIndex = 0;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1171);
this.reset();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1172);
return this;
		},
		/**
		 * Setter for the {{#crossLink "Y.GalleryModelMultiRecord/index"}}{{/crossLink}} attribute.
		 * Validates and copies the current index value into {{#crossLink "Y.GalleryModel/_currentIndex"}}{{/crossLink}}.
		 * It shelves the current record and fetches the requested one. 
		 * @method _indexSetter
		 * @param value {integer} new value for the index
		 * @return {integer|INVALID_VALUE} new value for the index or INVALID_VALUE if invalid.
		 * @private
		 */
		_indexSetter: function (value) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_indexSetter", 1183);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1184);
if (Lang.isNumber(value) && value >= 0 && value < this._shelves.length) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1185);
this._shelve(this._currentIndex);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1186);
this._currentIndex = value = parseInt(value,10);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1187);
this._fetch(value);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1188);
return value;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1190);
return Y.Attribute.INVALID_VALUE;
		},
		/**
		 * Getter for the {{#crossLink "Y.GalleryModelMultiRecord/index"}}{{/crossLink}} attribute
		 * Returns the value from {{#crossLink "Y.GalleryModelMultiRecord/_currentIndex"}}{{/crossLink}}
		 * @method _indexGetter
		 * @return {integer} value of the index
		 * @private
		 */
		_indexGetter: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_indexGetter", 1199);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1200);
return this._currentIndex;
		},
		/**
		 * Getter for the {{#crossLink "Y.GalleryModel/isNew"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord
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
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_isNewGetter", 1213);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1214);
if (name.split(DOT).length > 1) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1215);
return Y.GalleryModel.prototype._isNewGetter.apply(this, arguments);
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1217);
return this._isNew;
			
		},
		/**
		 * Setter for the {{#crossLink "Y.GalleryModel/isNew"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord
		 * so that it is written into the shelf and not into the actual attribute, 
		 * which is expensive to shelve
		 * @method _isNewSetter
		 * @param value {Boolean} value stored in the attribute.
		 * @return {Boolean} the same value as received.
		 * @private
		 */
		_isNewSetter: function (value) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_isNewSetter", 1229);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1230);
return (this._isNew = value);
		},
		/**
		 * Getter for the {{#crossLink "Y.GalleryModel/isModified"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord
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
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_isModifiedGetter", 1243);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1244);
if (name.split(DOT).length > 1) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1245);
return Y.GalleryModel.prototype._isModifiedGetter.apply(this, arguments);
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1247);
return this._isModified;
			
		},
		/**
		 * Setter for the {{#crossLink "Y.GalleryModel/isModified"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord
		 * so that it is written into the shelf and not into the actual attribute, 
		 * which is expensive to shelve
		 * @method _isModifiedSetter
		 * @param value {Boolean} value stored in the attribute.
		 * @return {Boolean} the same value as received.
		 * @private
		 */
		_isModifiedSetter:  function (value) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_isModifiedSetter", 1259);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1260);
return (this._isModified = value);
		}
			
		
	};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1266);
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
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1294);
Y.GalleryModelMultiRecord = MR;
	
	/**
	 * Extension to sort records stored in {{#crossLink "Y.GalleryModel"}}{{/crossLink}}, extended with {{#crossLink "Y.GalleryModelMultiRecord"}}{{/crossLink}}
	 * It is incompatible with {{#crossLink "Y.GalleryModelPrimaryKeyIndex"}}{{/crossLink}}
	 * @class Y.GalleryModelSortedMultiRecord
	 */
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1301);
var SFIELD = 'sortField',
		SDIR = 'sortDir',
		ASC = 'asc',
		DESC = 'desc',
		SMR = function () {};
	
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1307);
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
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "initializer", 1324);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1325);
if (this.get(SFIELD) === undefined) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1326);
this._set(SFIELD, this.get('primaryKeys')[0]);
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1328);
this._setCompare();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1329);
this.after([SFIELD + CHANGE, SDIR + CHANGE], this._sort);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1330);
this.after(EVT_CHANGE, this._afterChange);
		},
		/**
		 * Sets the compare function to be used in sorting the records
		 * based on the {{#crossLink "Y.GalleryModelSortedMultiRecord/sortField"}}{{/crossLink}} 
		 * and {{#crossLink "Y.GalleryModelSortedMultiRecord/sortDir"}}{{/crossLink}} 
		 * attributes and stores it into this._compare
		 * @method _setCompare
		 * @private
		 */
		_setCompare: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_setCompare", 1340);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1341);
var sortField = this.get(SFIELD),
				sortAsc = this.get(SDIR) === ASC?1:-1,
				compareValue = (Lang.isFunction(sortField)?
					sortField:
					function(values) {
						_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "sortField", 1345);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1346);
return values[sortField];
					}
				);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1349);
this._compare = function(a, b) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_compare", 1349);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1350);
var aValue = compareValue(a._values),
					bValue = compareValue(b._values);

				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1353);
return (aValue < bValue ? -1 : (aValue > bValue ? 1 : 0)) * sortAsc;
			};
		},
		/**
		 * Sorts the shelves whenever the 
		 * {{#crossLink "Y.GalleryModelSortedMultiRecord/sortField"}}{{/crossLink}} 
		 * or {{#crossLink "Y.GalleryModelSortedMultiRecord/sortDir"}}{{/crossLink}} 
		 * attributes change.
		 * @method _sort
		 * @private
		 */
		_sort: function() {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_sort", 1364);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1365);
this._setCompare();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1366);
this._shelve();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1367);
this._shelves.sort(this._compare);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1368);
this._shelves.splice(this.size());
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1369);
this._fetch(0);
		},
		/**
		 * Listens to value changes and if the name of the field is that of the 
		 * {{#crossLink "Y.GalleryModelSortedMultiRecord/sortField"}}{{/crossLink}} attribute 
		 * or if {{#crossLink "Y.GalleryModelSortedMultiRecord/sortField"}}{{/crossLink}} 
		 * is a function, it will relocate the record to its proper sort order
		 * @method _afterChange
		 * @param ev {EventFacade} Event façade as produced by the {{#crossLink "Y.GalleryModel/change"}}{{/crossLink}}  event
		 * @private
		 */
		_afterChange: function (ev) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_afterChange", 1380);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1381);
var fieldName = ev.name,
				sField = this.get(SFIELD),
				index,
				currentIndex = this._currentIndex,
				shelves = this._shelves,
				currentShelf;

			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1388);
if (fieldName && ev.src !== ADD && (Lang.isFunction(sField) || fieldName === sField)) {
				// The shelf has to be emptied otherwise _findIndex may match itself.
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1390);
currentShelf = shelves.splice(currentIndex,1)[0];
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1391);
index = this._findIndex(currentShelf._values);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1392);
shelves.splice(index,0,currentShelf);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1393);
this._currentIndex = index;
			}
		},
		/**
		 * Finds the correct index position of a record within the shelves
		 * according to the current 
		 * {{#crossLink "Y.GalleryModelSortedMultiRecord/sortField"}}{{/crossLink}} 
		 * or {{#crossLink "Y.GalleryModelSortedMultiRecord/sortDir"}}{{/crossLink}} 
		 * attributes
		 * @method _findIndex
		 * @param values {Object} values of the record to be located
		 * @return {Integer} location for the record
		 * @private
		 */
		_findIndex: function (values) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_findIndex", 1407);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1408);
var shelves = this._shelves,
				low = 0, 
				high = shelves.length, 
				index = 0,
				cmp = this._compare,
				vals = {_values: values};
				
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1415);
while (low < high) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1416);
index = Math.floor((high + low) / 2);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1417);
switch(cmp(vals, shelves[index])) {
					case 1:
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1419);
low = index + 1;
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1420);
break;
					case -1:
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1422);
high = index;
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1423);
break;
					default:
						_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1425);
low = high = index;
				}
				
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1429);
return low;
			
		},
		/**
		 * Adds a new record at its proper position according to the sort configuration.
		 * It overrides  
		 * {{#crossLink "Y.GalleryModelMultiRecord"}}{{/crossLink}}'s own
		 * {{#crossLink "Y.GalleryModelMultiRecord/add"}}{{/crossLink}} 
		 * method, ignoring the index position requested, if any.
		 * The new record becomes the current.
		 * @method add
		 * @param values {Object} set of values to set
		 * @chainable
		 */
		add: function(values) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "add", 1443);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1444);
var shelves = this._shelves,
				index = 0;
				
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1447);
index = this._findIndex(values);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1448);
this._currentIndex = index;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1449);
shelves.splice(index, 0, {});
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1450);
this._initNew();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1451);
this.setValues(values, ADD);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1452);
this._shelve(index);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1453);
return this;
		},
		/**
		 * Locates a record by value.  The record will be located by the field
		 * given in the {{#crossLink "Y.GalleryModelSortedMultiRecord/sortField"}}{{/crossLink}}
		 *  attribute.   It will return the index of the
		 * record in the shelves or `null` if not found.
		 * By default it will expose that record.
		 * If {{#crossLink "Y.GalleryModelSortedMultiRecord/sortField"}}{{/crossLink}} 
		 * contains a function, it will return `null` and do nothing.
		 * Since sort fields need not be unique, find may return any of the records
		 * with the same value for that field.
		 * @method find
		 * @param value {Any} value to be found
		 * @param [move] {Boolean} exposes the record found, defaults to `true`
		 * @return {integer | null} index of the record found or `null` if not found.
		 * Be sure to differentiate a return of `0`, a valid index, from `null`, a failed search.
		 */
		find: function (value, move) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "find", 1471);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1472);
var sfield = this.get(SFIELD),
				index,
				values = {};
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1475);
if (Lang.isFunction(sfield)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1476);
return null;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1478);
values[sfield] = value;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1479);
index = this._findIndex(values);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1480);
if (this._shelves[index]._values[sfield] !== value) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1481);
return null;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1483);
if (move || arguments.length < 2) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1484);
this.set(INDEX, index);
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1486);
return index;
		}
	};
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1489);
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
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "validator", 1501);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1502);
return Lang.isString(value) || Lang.isFunction(value);
			}
		},
		/**
		 * Sort direction either `"asc"` for ascending or `"desc"` for descending
		 * @attribute sortDir
		 * @type String
		 * @default "asc"
		 */
		sortDir: {
			validator: function (value) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "validator", 1512);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1513);
return value === DESC || value === ASC;
			},
			value: ASC
		}
	};
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1518);
Y.GalleryModelSortedMultiRecord = SMR;
	
	/**
	 * Extension to store the records in the GalleryModel using the field in the 
	 * {{#crossLink "Y.GalleryModel/primaryKeys"}}{{/crossLink}} attribute as its index.
	 * The primary key __must__ be a __single__ __unique__ __integer__ field.
	 * It should be used along {{#crossLink "Y.GalleryModelMultiRecord"}}{{/crossLink}}.
	 * It is incompatible with {{#crossLink "Y.GalleryModelSortedMultiRecord"}}{{/crossLink}}.
	 * @class Y.GalleryModelPrimaryKeyIndex
	 */
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1528);
var PKI = function () {};
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1529);
PKI.prototype = {
		/**
		 * Adds a new record at the index position given by its primary key.
		 * The new record becomes the current.
		 * @method add
		 * @param values {Object} set of values to set
		 * @chainable
		 */
		add: function(values) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "add", 1537);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1538);
if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1539);
this._shelve();
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1541);
this._currentIndex = values[this._primaryKeys[0]];
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1542);
this._initNew();
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1543);
this.setValues(values, ADD);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1544);
return this;
		},
		/**
		 * Default action for the {{#crossLink "Y.GalleryModel/loaded"}}{{/crossLink}} event, 
		 * checks if the parsed response is an array
		 * and saves it into the shelves using the value of the primary key field for its index.
		 * The model will be left positioned at the item with the lowest key value.
		 * If the primary key field has not been declared, items will not be loaded.
		 * If the primary key field is not unique, the duplicate will overwrite the previous.
		 * @method _defDataLoaded
		 * @param ev {EventFacade} facade produced by the {{#crossLink "Y.GalleryModel/loaded"}}{{/crossLink}} event, 
		 * @private
		 */
		_defDataLoaded: function (ev) {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "_defDataLoaded", 1557);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1558);
var self = this,
				shelves = self._shelves,
				pk = self._primaryKeys[0];
				
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1562);
if (Lang.isUndefined(pk)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1563);
return;
			}	
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1565);
if (self.get(IS_MODIFIED) || !self.get(IS_NEW)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1566);
self._shelve();
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1568);
YArray.each(new YArray(ev.parsed), function (values) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 19)", 1568);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1569);
shelves[values[pk]] = {
					_values: values,
					_loadedValues: Y.clone(values),
					isNew: false,
					isModified:false
				};
			});
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1576);
YArray.some(shelves, function (shelf, index) {
				_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "(anonymous 20)", 1576);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1577);
self._fetch(index);
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1578);
return true;
			});
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1580);
ev.callback.call(self,null, ev.response);
		
		},
		/**
		 * Sugar method added because items might not be contiguous so 
		 * adding one to the index does not always get you to the next item.
		 * If there is no next element, `null` will be returned and the
		 * collection will still point to the last item.
		 * @method next
		 * @return {integer} index of the next item or `null` if none found
		 */
		next: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "next", 1591);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1592);
if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1593);
this._shelve();
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1595);
var shelves = this._shelves,
				index = this._currentIndex + 1, 
				l = shelves.length;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1598);
while (index < l && !shelves.hasOwnProperty(index)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1599);
index +=1;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1601);
if (index === l) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1602);
return null;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1604);
this._fetch(index);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1605);
return index;
		},
		/**
		 * Sugar method added because items might not be contiguous so 
		 * subtracting one to the index does not always get you to the previous item.
		 * If there is no next element, `null` will be returned and the
		 * collection will still point to the first item.
		 * @method previous
		 * @return {integer} index of the previous item or `null` if none found
		 */
		previous: function () {
			_yuitest_coverfunc("/build/gallery-md-model/gallery-md-model.js", "previous", 1615);
_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1616);
if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1617);
this._shelve();
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1619);
var shelves = this._shelves,
				index = this._currentIndex - 1;
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1621);
while (index >= 0 && !shelves.hasOwnProperty(index)) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1622);
index -=1;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1624);
if (index === -1) {
				_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1625);
return null;
			}
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1627);
this._fetch(index);
			_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1628);
return index;
		}
		
	};
	_yuitest_coverline("/build/gallery-md-model/gallery-md-model.js", 1632);
Y.GalleryModelPrimaryKeyIndex = PKI;


}, 'gallery-2012.08.29-20-10' ,{requires:['base'], skinnable:false});
