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
	"use strict";
	
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
				this._values = {};
				this._loadedValues = {};
				/**
				 * Fired whenever a data value is changed.
				 * @event change
				 * @param {String} ev.name Name of the field changed
				 * @param {Any} ev.newVal New value of the field.
				 * @param {Any} ev.prevVal Previous value of the field.
				 * @param {String|null} ev.src Source of the change event, if any.
				 */
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
				this.publish(EVT_LOADED, {
					defaultFn:this._defDataLoaded
				});
				/**
				 * Fired when the data has been saved to the remote source
				 * The event cannot be prevented.
				 * @event saved
				 */
				this.publish(EVT_SAVED, {
					preventable: false
				});
				cfg = cfg || {};
				if (Lang.isObject(cfg.values)) {
					this.setValues(cfg.values, 'init');
					this._set(IS_MODIFIED, false);
					this._set(IS_NEW, true);
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
				if (typeof options === 'function') {
					callback = options;
					options = {};
				} else if (!options) {
					options = {};
				}
				var self = this,
					finish = function (err) {
						if (!err) {
							YArray.each(self.lists.concat(), function (list) {
								list.remove(self, options);
							});

							Y.GalleryModel.superclass.destroy.call(self);
						}

						callback && callback.apply(null, arguments);
					};

				if (callback || options) {
					this.sync('delete', options, finish);
				} else {
					finish();
				}

				return this;
			},
			/**
			 * Returns the value of the field named
			 * @method getValue
			 * @param name {string}  Name of the field to return.
			 * @return {Any} the value of the field requested.  
			 */ 
			getValue: function (name) {
				return this._values[name];
			},
			/**
			 * Returns a hash with all values using the field names as keys.
			 * @method getValues
			 * @return {Object} a hash with all the fields with the field names as keys.
			 */ 
			getValues: function() {
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
				var prevVal = this._values[name];
				if (prevVal !== value && (this._primaryKeys.indexOf(name) === -1 || Lang.isUndefined(prevVal))) {
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
				var self = this;
				if (ev.name) {
					self._values[ev.name] = ev.newVal;
					self._set(IS_MODIFIED, true);
				} else {
					YObject.each(ev.newVals, function (value, name) {
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
				var self = this,
					prevVals = {};
					
				YObject.each(values, function (value, name) {
					prevVals[name] = self.getValue(name);
				});
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
				var changed = {}, 
					prev, 
					loaded = this._loadedValues;

				YObject.each(this._values, function (value, name) {
					prev = loaded[name];
					if (prev !== value) {
						changed[name] = {prevVal:prev, newVal: value};
					}
				});
				return changed;
			},
			/**
			 * Returns a hash with the values of the primary key fields, indexed by their field names
			 * @method getPKValues
			 * @return {Object} Hash with the primary key values, indexed by their field names
			 */
			getPKValues: function () {
				var pkValues = {},
					self = this;
				YArray.each(self.get('primaryKeys'), function (name) {
					pkValues[name] = self._values[name];
				});
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
				var value = this.getValue(name);
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
				var value = this.getValue(name),
					url = [];
				if (name) {
					return encodeURIComponent(Lang.isValue(value) ? String(value) : '');
				} else {
					YObject.each(value, function (value, name) {
						if (Lang.isValue(value)) {
							url.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
						}
					});
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
				var self = this;
				self.setValues(ev.parsed, ev.src);
				self._set(IS_MODIFIED, false);
				self._set(IS_NEW, false);
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
				var self = this;

				if (typeof options === 'function') {
					callback = options;
					options = {};
				} else if (!options) {
					options = {};
				}

				self.sync('read', options, function (err, response) {
					var facade = {
							options : options,
							response: response,
							src: 'load'
						};

					if (err) {
						facade.error = err;

						self.fire(EVT_ERROR, facade);
					} else {
						self._values = {};

						facade.parsed = self.parse(response);
						self.fire(EVT_LOADED, facade);
					}

					callback && callback.apply(null, arguments);
				});

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
				if (typeof response === 'string') {
					try {
						return Y.JSON.parse(response);
					} catch (ex) {
						this.fire(EVT_ERROR, {
							error : ex,
							response: response,
							src : 'parse'
						});

						return null;
					}
				}

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
				var self = this;

				if (typeof options === 'function') {
					callback = options;
					options = {};
				} else if (!options) {
					options = {};
				}

				self._validate(self.getValues(), function (err) {
					if (err) {
						callback && callback.call(null, err);
						return;
					}

					self.sync(self.get(IS_NEW) ? 'create' : 'update', options, function (err, response) {
						var facade = {
								options : options,
								response: response,
								src: 'save'
							};

						if (err) {
							facade.error = err;

							self.fire(EVT_ERROR, facade);
						} else {
							facade.parsed = self.parse(response);

							self._set(IS_MODIFIED, false);
							self._set(IS_NEW, false);
							self._loadedValues = Y.clone(self._values);
							self.fire(EVT_SAVED, facade);
							if (facade.parsed) {
								self.fire(EVT_LOADED, facade);
							}
						}

						callback && callback.apply(null, arguments);
					});
				});

				return self;
			},
			/**
			 * Restores the values when last loaded, saved or created.
			 * @method reset
			 */
			reset: function() {
				this._values = Y.clone(this._loadedValues);
				this.fire(EVT_RESET);
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

				if (typeof callback === 'function') {
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
				var self = this;

				self.validate(attributes, function (err) {
					if (Lang.isValue(err)) {
						// Validation failed. Fire an error.
						self.fire(EVT_ERROR, {
							attributes: attributes,
							error : err,
							src : 'validate'
						});

						callback(err);
						return;
					}

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
				return this.getValue();
			},
			_isModifiedGetter: function (value, name) {
				name = name.split(DOT);
				if (name.length > 1) {
					name = name[1];
					var ret = {};
					ret[name] = this._values[name] !== this._loadedValues[name];
					return ret;
				} else {
					return value;
				}

			},
			_isNewGetter: function (value, name) {
				name = name.split(DOT);
				if (name.length > 1) {
					name = name[1];
					var ret = {};
					ret[name] = !this._loadedValues.hasOwnProperty(name);
					return ret;
				} else {
					return value;
				}
			},
			_primaryKeysSetter: function (value) {
				if (this._primaryKeys && this._primaryKeys.length) {
					return Y.Attribute.INVALID_VALUE;
				}
				value = new YArray(value);
				this._primaryKeys = value;
				return value;
			},
			_primaryKeysGetter: function (value, name) {
				name = name.split(DOT);
				if (name.length > 1) {
					name = name[1];
					var ret = {};
					ret[name] = value.indexOf(name) !== -1;
					return ret;
				} else {
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
	Y.GalleryModelSimpleUndo = function () {};
	
	Y.GalleryModelSimpleUndo.prototype = {
		initializer: function () {
			this._lastChange = {};
			this._preserve = (this._preserve || []).concat('_lastChange');
			this.after(EVT_CHANGE, this._trackChange);
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
			if (ev.name && ev.src !== 'undo') {
				this._lastChange[ev.name] = ev.prevVal;
			}
		},
		/**
		 * After load or save operations, it drops any changes it might have tracked.
		 * @method _resetUndo
		 * @private
		 */
		_resetUndo: function () {
			this._lastChange = {};
		},
		/**
		 * Reverts one level of change for a specific field or all fields
		 * @method undo
		 * @param [name] {String} If provided it will undo that particular field,
		 *	otherwise, it undoes the whole record.
		 */
		undo: function (name) {
			var self = this;
			if (name) {
				if (self._lastChange[name] !== undefined) {		
					self.setValue(name, self._lastChange[name], 'undo');
					delete self._lastChange[name];
				}
			} else {
				self.setValues(this._lastChange, 'undo');
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
	Y.GalleryModelChronologicalUndo = function () {};
	
	Y.GalleryModelChronologicalUndo.prototype = {
		initializer: function () {
			this._changes = [];
			this._preserve = (this._preserve || []).concat('_changes');
			this.after(EVT_CHANGE, this._trackChange);
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
			if (ev.src !== 'undo') {
				this._changes.push(ev.details);
			}
		},
		/**
		 * After load or save operations, it drops any changes it might have tracked.
		 * @method _resetUndo
		 * @private
		 */
		_resetUndo: function () {
			this._changes = [];
		},
		/**
		 * Reverts one level of field changes.
		 * @method undo
		 */
		undo: function () {
			var ev = this._changes.pop();
			if (ev) {
				if (ev.name) {
					this.setValue(ev.name, ev.prevVal, 'undo');
				} else {
					this.setValues(ev.prevVals, 'undo');
				}
			}
			if (this._changes.length === 0) {
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
	
	var INDEX = 'index',
		MR = function () {};
	
	MR.prototype = {
		initializer: function () {
			this._shelves = [];
			this._currentIndex = 0;
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
			if (index === undefined) {
				index = this._currentIndex;
			}
			var self = this,
				current = {
					_values: self._values,
					_loadedValues: self._loadedValues,
					isNew: self.get(IS_NEW),
					isModified: self.get(IS_MODIFIED)
				};
			YArray.each(self._preserve, function (name) {
				current[name] = self[name];
			});
			self._shelves[index] = current;
			
		},
		/**
		 * Retrives and exposes the record from the shelf at the position given by _currentIndex
		 * @method _fetch
		 * @private
		 */
		_fetch: function (index) {
			if (index === undefined) {
				index = this._currentIndex;
			}
			var self = this,
				current = self._shelves[index];
				
			self._values = current._values;
			self._loadedValues = current._loadedValues;
			self.__setStateVal(IS_NEW, current.isNew);
			self.__setStateVal(IS_MODIFIED, current.isModified);
			YArray.each(self._preserve, function (name) {
				self[name] = current[name];
			});
			
		},
		/**
		 * Initializes an exposed record
		 * @method _initNew
		 * @private
		 */
		_initNew: function () {
			this._values = {};
			this._loadedValues = {};
			this._set(IS_NEW, true);
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
			if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
				this._shelve();
			}
			if (arguments.length === 2) {
				this._shelves.splice(index, 1);
			} else {
				index = this._shelves.length;
			}
			this._currentIndex = index;
			this._initNew();
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
			var i, l, self = this;
			this._shelve();
			for (i = 0, l = this._shelves.length; i < l; i += 1) {
				this._currentIndex = i;
				this._fetch(i);
				if (fn.call(self, i) !== false) {
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
			var i, l, self = this;
			this._shelve();
			for (i = 0, l = this._shelves.length; i < l; i += 1) {
				if (this._shelves[i][IS_MODIFIED]) {
					this._currentIndex = i;
					this._fetch(i);
					if (fn.call(self, i) !== false) {
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
			var self = this;
			if (ev.src === 'load' && ev.Lang.isArray(ev.parsed)) {
				ev.halt();
				YArray.each(ev.parsed, function (values) {
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
			return this._shelves.length;
		},
		/**
		 * Empties the shelves of any records as well as the exposed record
		 * @method empty
		 */
		empty: function () {
			this._shelves = [];
			this._currentIndex = 0;
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
			if (Lang.isNumber(value) && value >= 0 && value < this._shelves.length) {
				this._shelve(this._currentIndex);
				this._currentIndex = value = parseInt(value,10);
				this._fetch(value);
				return value;
			} else {
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
			return this._currentIndex;
		}
		
	};
	
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
	
	Y.GalleryModelMultiRecord = MR;
	
	/**
	 * Extension to sort records stored in GalleryModel, extended with GalleryModelMultiRecord
	 * @class Y.GalleryModelSortedMultiRecord
	 */
	var SFIELD = 'sortField',
		SDIR = 'sortDir',
		ASC = 'asc',
		DESC = 'desc',
		SMR = function () {};
	
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
			if (this.get(SFIELD) === undefined) {
				this._set(SFIELD, this.get('primaryKeys')[0]);
			}
			this._setCompare();
			this.after([SFIELD + CHANGE, SDIR + CHANGE], this._sort);
			this.after('change', this._afterChange);
		},
		/**
		 * Sets the compare function to be used in sorting the records
		 * based on the sortField and sortDir and stores it into this._compare
		 * @method _setCompare
		 * @private
		 */
		_setCompare: function () {
			var sortField = this.get(SFIELD),
				sortAsc = this.get(SDIR) === ASC?1:-1,
				compareValue = (Lang.isFunction(sortField)?
					sortField:
					function(values) {
						return values[sortField];
					}
				);
			this._compare = function(a, b) {
				var aValue = compareValue(a._values),
					bValue = compareValue(b._values);

				return (aValue < bValue ? -1 : (aValue > bValue ? 1 : 0)) * sortAsc;
			};
		},
		/**
		 * Sorts the shelves whenever the sortField or sortDir is changes
		 * @method _sort
		 * @private
		 */
		_sort: function() {
			this._setCompare();
			this._shelve();
			this._shelves.sort(this._compare);
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
			var fieldName = ev.name,
				sField = this.get(SFIELD),
				index,
				currentIndex = this._currentIndex,
				shelves = this._shelves,
				currentShelf;

			if (fieldName && ev.src !== 'add' && (Lang.isFunction(sField) || fieldName === sField)) {
				// The shelf has to be emptied otherwise _findIndex may match itself.
				currentShelf = shelves.splice(currentIndex,1)[0];
				index = this._findIndex(currentShelf._values);
				shelves.splice(index,0,currentShelf);
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
			var shelves = this._shelves,
				low = 0, 
				high = shelves.length, 
				index = 0,
				cmp = this._compare,
				vals = {_values: values};
				
			while (low < high) {
				index = (high + low) >> 1;
				switch(cmp(vals, shelves[index])) {
					case 1:
						low = index + 1;
						break;
					case -1:
						high = index;
						break;
					default:
						low = high = index;
				}
				
			}
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
			var shelves = this._shelves,
				index = 0;
				
			index = this._findIndex(values);
			this._currentIndex = index;
			shelves.splice(index, 0, {});
			this._initNew();
			this.setValues(values, 'add');
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
			var sfield = this.get(SFIELD),
				index,
				values = {};
			if (Lang.isFunction(sfield)) {
				return null;
			}
			values[sfield] = value;
			index = this._findIndex(values);
			if (this._shelves[index]._values[sfield] !== value) {
				return null;
			}
			if (move || arguments.length < 2) {
				this.set(INDEX, index);
			}
			return index;
		}
	};
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
				return value === DESC || value === ASC;
			},
			value: ASC
		}
	};
	Y.GalleryModelSortedMultiRecord = SMR;




}, 'gallery-2012.03.23-18-00' ,{requires:['base'], skinnable:false});
