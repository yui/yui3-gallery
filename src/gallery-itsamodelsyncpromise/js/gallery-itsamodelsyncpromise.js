'use strict';

/*jshint maxlen:170 */

/**
 *
 * This module extends Y.Model by introducing Promised sync-methods. It also transforms Y.Model's sync-events into true events with a defaultFunc which can be prevented.
 * This means the 'on'-events will be fired before syncing and the 'after'-events after syncing.
 *
 * @module gallery-itsamodelsyncpromise
 * @class Y.Model
 * @constructor
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var YModel = Y.Model,
    YObject = Y.Object,
    YArray = Y.Array,
    DESTROY = 'destroy',
    LOAD = 'load',
    SAVE = 'save',
    ERROR = 'error',
    DELETE = 'delete',
    READ = 'read',
    DESTROYED = DESTROY+'ed',
    PUBLISHED = '_published',
/**
 * Fired when an error occurs, such as when an attribute (or property) doesn't validate or when
 * the sync layer submit-function returns an error.
 * @event error
 * @param e {EventFacade} Event Facade including:
 * @param e.error {any} Error message.
 * @param e.src {String} Source of the error. May be one of the following (or any
 *                     custom error source defined by a Model subclass):
 *
 * `submit`: An error submitting the model from within a sync layer.
 *
 * `attributevalidation`: An error validating an attribute (or property). The attribute (or objectproperty)
 *                        that failed validation will be provided as the `attribute` property on the event facade.
 *
 * @param e.attribute {String} The attribute/property that failed validation.
 * @param e.validationerror {String} The errormessage in case of attribute-validation error.
**/

/**
 * Fired when model is destroyed. In case {remove: true} is udes, the after-event occurs after the synlayer is finished.
 * @event destroy
 * @param e {EventFacade} Event Facade including:
 * @param e.promise {Promise} The promise that is automaticly created during the event. You could examine this instead of listening to both the `after`- and `error`-event.
 * @param [e.options] {Object} The options=object that was passed to the sync-layer, if there was one.
 * @since 0.1
**/

/**
 * Fired when model needs to be read from the sync layer. The after-event occurs after the synlayer is finished.
 * @event load
 * @param e {EventFacade} Event Facade including:
 * @param e.promise {Promise} The promise that is automaticly created during the event. You could examine this instead of listening to both the `after`- and `error`-event.
 * @param [e.options] {Object} The options=object that was passed to the sync-layer, if there was one.
 * @param [e.response] {any} The sync layer's raw, unparsed response to the submit-request, if there was one.
 *                            This value is only available in the after-event.
 * @since 0.1
**/

/**
 * Fired when model needs to be saved through the sync layer. The after-event occurs after the synlayer is finished.
 * @event save
 * @param e {EventFacade} Event Facade including:
 * @param e.promise {Promise} The promise that is automaticly created during the event. You could examine this instead of listening to both the `after`- and `error`-event.
 * @param [e.options] {Object} The options=object that was passed to the sync-layer, if there was one.
 * @param [e.parsed] {Object} The parsed version of the sync layer's response to the save-request, if there was a response.
 *                            This value is only available in the after-event.
 * @param [e.response] {any} The sync layer's raw, unparsed response to the save-request, if there was one.
 *                            This value is only available in the after-event.
 * @since 0.1
**/

PARSED = function (response) {
    if (typeof response === 'string') {
        try {
            return Y.JSON.parse(response);
        } catch (ex) {
            this.fire(ERROR, {
                error   : ex,
                response: response,
                src     : 'parse'
            });
            return {};
        }
    }
    return response || {};
};

// -- Mixing extra Methods to Y.Model -----------------------------------

/**
  * Destroys this model instance and removes it from its containing lists, if any. The 'callback', if one is provided,
  * will be called after the model is destroyed.<br /><br />
  * If `options.remove` is `true`, then this method delegates to the `sync()` method to delete the model from the persistence layer, which is an
  * asynchronous action. In this case, the 'callback' (if provided) will be called after the sync layer indicates success or failure of the delete operation.
  * <br /><br />
  * To keep track of the proccess, it is preferable to use <b>destroyPromise()</b>.<br />
  * This method will fire an `error` event when syncing (using options.remove=true) should fail.
  * <br /><br />
  * <b>CAUTION</b> The sync-method with action 'destroy' <b>must call its callback-function</b> in order to work as espected!
  *
  * @method destroy
  * @param {Object} [options] Sync options. It's up to the custom sync implementation to determine what options it supports or requires, if any.
  *   @param {Boolean} [options.remove=false] If `true`, the model will be deleted via the sync layer in addition to the instance being destroyed.
  * @param {callback} [callback] Called after the model has been destroyed (and deleted via the sync layer if `options.remove` is `true`).
  *   @param {Error|null} callback.err If an error occurred, this parameter will contain the error. Otherwise 'err' will be null.
  *   @param {Any} callback.response The server's response. This value will be passed to the `parse()` method, which is expected to parse it and return an attribute hash.
  * @chainable
*/
YModel.prototype.destroy = function(options, callback) {
    var instance = this,
        promise;

    Y.log('destroy', 'info', 'ITSA-ModelSyncPromise');
    // by overwriting the default 'save'-method we manage to fire 'destroystart'-event.
/*jshint expr:true */
    (promise=instance.destroyPromise(options)) && callback && promise.then(
        function(response) {
            callback(null, response);
        },
        function(err) {
            callback(err);
        }
    );
/*jshint expr:false */
    return instance;
};

/**
 * Destroys this model instance and removes it from its containing lists, if any.
 * <br /><br />
 * If `options.remove` is `true`, then this method delegates to the `sync()`
 * method to delete the model from the persistence layer, which is an
 * asynchronous action.
 * <br /><br />
  * This method will fire an `error` event when syncing (using options.remove=true) should fail.
 * <br /><br />
 * <b>CAUTION</b> The sync-method with action 'destroy' <b>must call its callback-function</b> in order to work as espected!
 *
 * @method destroyPromise
 * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 * @return {Y.Promise} promised response --> resolve(response) OR reject(reason). (examine reason.message).
**/
YModel.prototype.destroyPromise = function (options) {
    return this._createPromise(DESTROY, options);
};

/**
  * Loads this model from the server.<br />
  * This method delegates to the `sync()` method to perform the actual load
  * operation, which is an asynchronous action. Specify a 'callback' function to
  * be notified of success or failure.
  * <br /><br />
  * An unsuccessful load operation will fire an `error` event with the `src` value "load".
  * <br /><br />
  * If the load operation succeeds and one or more of the loaded attributes
  * differ from this model's current attributes, a `change` event will be fired.
  * <br /><br />
  * To keep track of the proccess, it is preferable to use <b>loadPromise()</b>.<br />
  * This method will fire 2 events: 'loadstart' before syncing and 'load' or ERROR after syncing.
  * <br /><br />
  * <b>CAUTION</b> The sync-method with action 'load' <b>must call its callback-function</b> in order to work as espected!
  *
  * @method load
  * @param {Object} [options] Options to be passed to `sync()` and to `set()` when setting the loaded attributes.
  *                           It's up to the custom sync implementation to determine what options it supports or requires, if any.
  * @param {callback} [callback] Called when the sync operation finishes.
  *   @param {Error|null} callback.err If an error occurred, this parameter will contain the error. If the sync operation succeeded, 'err' will be null.
  *   @param {Any} callback.response The server's response. This value will be passed to the `parse()` method, which is expected to parse it and return an attribute hash.
  * @chainable
 */
YModel.prototype.load = function(options, callback) {
    var instance = this,
        promise;

    Y.log('load', 'info', 'ITSA-ModelSyncPromise');
    // by overwriting the default 'save'-method we manage to fire 'loadstart'-event.
/*jshint expr:true */
    (promise=instance.loadPromise(options)) && callback && promise.then(
        function(response) {
            callback(null, response);
        },
        function(err) {
            callback(err);
        }
    );
/*jshint expr:false */
    return instance;
};

/**
 * Loads this model from the server.
 * <br /><br />
 * This method delegates to the `sync()` method to perform the actual load
 * operation, which is an asynchronous action.
 * <br /><br />
 * An unsuccessful load operation will fire an `error` event with the `src` value "load".
 * <br /><br />
 * If the load operation succeeds and one or more of the loaded attributes
 * differ from this model's current attributes, a `change` event will be fired.
 * <br /><br />
 * <b>CAUTION</b> The sync-method with action 'load' <b>must call its callback-function</b> in order to work as espected!
 *
 * @method loadPromise
 * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 * @return {Y.Promise} promised response --> resolve(response) OR reject(reason) (examine reason.message).
**/
YModel.prototype.loadPromise = function (options) {
    Y.log('loadPromise', 'info', 'ITSA-ModelSyncPromise');
    return this._createPromise(LOAD, options);
};


 /**
   * Hack with the help of Luke Smith: https://gist.github.com/lsmith/6664382/d688740bb91f9ecfc3c89456a82f30d35c5095cb
   * Variant of publish(), but works with asynchronious defaultFn and preventedFn.
   *
   * Creates a new custom event of the specified type.  If a custom event
   * by that name already exists, it will not be re-created.  In either
   * case the custom event is returned.
   *
   * @method publishAsync
   *
   * @param type {String} the type, or name of the event
   * @param opts {object} optional config params.  Valid properties are:
   *
   *  <ul>
   *    <li>
   *   'broadcast': whether or not the YUI instance and YUI global are notified when the event is fired (false)
   *    </li>
   *    <li>
   *   'bubbles': whether or not this event bubbles (true)
   *              Events can only bubble if emitFacade is true.
   *    </li>
   *    <li>
   *   'context': the default execution context for the listeners (this)
   *    </li>
   *    <li>
   *   'defaultFn': the default function to execute when this event fires if preventDefault was not called
   *    </li>
   *    <li>
   *   'emitFacade': whether or not this event emits a facade (false)
   *    </li>
   *    <li>
   *   'prefix': the prefix for this targets events, e.g., 'menu' in 'menu:click'
   *    </li>
   *    <li>
   *   'fireOnce': if an event is configured to fire once, new subscribers after
   *   the fire will be notified immediately.
   *    </li>
   *    <li>
   *   'async': fireOnce event listeners will fire synchronously if the event has already
   *    fired unless async is true.
   *    </li>
   *    <li>
   *   'preventable': whether or not preventDefault() has an effect (true)
   *    </li>
   *    <li>
   *   'preventedFn': a function that is executed when preventDefault is called
   *    </li>
   *    <li>
   *   'queuable': whether or not this event can be queued during bubbling (false)
   *    </li>
   *    <li>
   *   'silent': if silent is true, debug messages are not provided for this event.
   *    </li>
   *    <li>
   *   'stoppedFn': a function that is executed when stopPropagation is called
   *    </li>
   *
   *    <li>
   *   'monitored': specifies whether or not this event should send notifications about
   *   when the event has been attached, detached, or published.
   *    </li>
   *    <li>
   *   'type': the event type (valid option if not provided as the first parameter to publish)
   *    </li>
   *  </ul>
   *
   *  @return {CustomEvent} the custom event
   *
  **/
YModel.prototype.publishAsync = function(type, opts) {
    var instance = this,
        asyncEvent = this.publish(type, opts);

    asyncEvent._firing = new Y.Promise(function (resolve) { resolve(); });

    asyncEvent.fire = function (data) {
        var args  = Y.Array(arguments, 0, true);

        asyncEvent._firing = asyncEvent._firing.then(function () {
            asyncEvent.details = args;
            // Execute on() subscribers
            var subs = asyncEvent._subscribers,
                args2 = [],
                e,
                i, len;

                args2.push.apply(args2, data);
                e = asyncEvent._createFacade(args2);

            if (subs) {
                for (i = 0, len = subs.length; i < len; ++i) {
                    // TODO: try/catch?
                    subs[i].fn.call(subs[i].context, e);
                }
            }
            // Doesn't support preventedFn
            // Resolve the _firing promise with either false if it was prevented, or with a promise for
            // the result of the defaultFn followed by the execution of the after subs.
            return e.prevented ?
                asyncEvent.preventedFn.call(instance, e).then(null, function (reason) {
                    Y.log("Error in preventedFn: " + (reason && (reason.message || reason)), ERROR);
                    return false;
                }) :
                asyncEvent.defaultFn.call(instance, e).then(function () {
                    // no need to handle 'response' it is merged into 'e' within the defaultfunction
                    // Execute after() subscribers
                    subs = asyncEvent._afters;
                    for (i = 0, len = subs.length; i < len; ++i) {
                        subs[i].fn.call(subs[i].context, e);
                    }
                // Catch errors/preventions and reset the promise state to fulfilled for
                // the next call to fire();
                }).then(null, function (reason) {
                    Y.log("Error in defaultFn or after subscriber: " + (reason && (reason.message || reason)), ERROR);
                    return false;
                });
        },
        function(reason) {
            var facade = {
                error   : reason,
                src     : 'Model.publishAsync()'
            };
            Y.log("Error in publishAsync: " + (reason && (reason.message || reason)), ERROR);
            instance._lazyFireErrorEvent(facade);
        });
    };

    asyncEvent._fire = function (args) {
        return asyncEvent.fire(args[0]);
    };
};

/**
 * Saves this model to the server.
 *
 * This method delegates to the `sync()` method to perform the actual save operation, which is an asynchronous action.
 * Specify a 'callback' function to be notified of success or failure, or better: use savePromise().
 * <br /><br />
 * An unsuccessful save operation will fire an `error` event with the `src` value "save".
 * <br /><br />
 * If the save operation succeeds and one or more of the attributes returned in the server's response differ from this model's current attributes,
 * a `change` event will be fired.
 * <br /><br />
 * If the operation succeeds, but you let the server return an <b>id=-1</b> then the model is assumed to be destroyed. This will lead to fireing the `destroy` event.
 * <br /><br />
 * To keep track of the process, it is preferable to use <b>savePromise()</b>.<br />
 * This method will fire 2 events: 'savestart' before syncing and 'save' or ERROR after syncing.
 * <br /><br />
 * <b>CAUTION</b> The sync-method with action 'save' <b>must call its callback-function</b> in order to work as espected!
 *
 * @method save
 * @param {Object} [options] Options to be passed to `sync()` and to `set()` when setting synced attributes.
 *                           It's up to the custom sync implementation to determine what options it supports or requires, if any.
 * @param {Function} [callback] Called when the sync operation finishes.
 *   @param {Error|null} callback.err If an error occurred or validation failed, this parameter will contain the error.
 *                                    If the sync operation succeeded, 'err' will be null.
 *   @param {Any} callback.response The server's response. This value will be passed to the `parse()` method,
 *                                  which is expected to parse it and return an attribute hash.
 * @chainable
*/
YModel.prototype.save = function(options, callback) {
    var instance = this,
        promise;

    Y.log('save', 'info', 'ITSA-ModelSyncPromise');
    // by overwriting the default 'save'-method we manage to fire 'savestart'-event.
/*jshint expr:true */
    (promise=instance.savePromise(options)) && callback && promise.then(
        function(response) {
            callback(null, response);
        },
        function(err) {
            callback(err);
        }
    );
/*jshint expr:false */
    return instance;
};

/**
 * Saves this model to the server.
 * <br /><br />
 * This method delegates to the `sync()` method to perform the actual save
 * operation, which is an asynchronous action.
 * <br /><br />
 * An unsuccessful save operation will fire an `error` event with the `src` value "save".
 * <br /><br />
 * If the save operation succeeds and one or more of the attributes returned in
 * the server's response differ from this model's current attributes, a
 * `change` event will be fired.
 * <br /><br />
 * If the operation succeeds, but you let the server return an <b>id=-1</b> then the model is assumed to be destroyed. This will lead to fireing the `destroy` event.
 * <br /><br />
 * <b>CAUTION</b> The sync-method with action 'save' <b>must call its callback-function</b> in order to work as espected!
 *
 * @method savePromise
 * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 * @return {Y.Promise} promised response --> resolve(response) OR reject(reason). (examine reason.message).
**/
YModel.prototype.savePromise = function (options) {
    Y.log('savePromise', 'info', 'ITSA-ModelSyncPromise');
    return this._createPromise(SAVE, options);
};

//===============================================================================================
/**
 * This method can be defined in descendend classes.<br />
 * If syncPromise is defined, then the syncPromise() definition will be used instead of sync() definition.<br />
 * In case an invalid 'action' is defined, the promise will be rejected.
 *
 * @method syncPromise
 * @param action {String} The sync-action to perform.
 * @param [options] {Object} Sync options. The custom synclayer should pass through all options-properties to the server.
 * @return {Y.Promise} returned response for each 'action' --> response --> resolve(dataobject) OR reject(reason).
 * The returned 'dataobject' might be an object or a string that can be turned into a json-object
*/
//===============================================================================================

/**
 * DefaultFn for the 'save'-event
 *
 * @method _createPromise
 * @param e {EventTarget}
 * @param e.promise {Y.Promise} promise passed by with the eventobject
 * @param e.promiseReject {Function} handle to the reject-method
 * @param e.promiseResolve {Function} handle to the resolve-method
 * @private
 * @since 0.3
*/
YModel.prototype._createPromise = function(type, options) {
    var instance = this,
        promise, promiseResolve, promiseReject, extraOptions;

    Y.log('_createPromise', 'info', 'ITSA-ModelSyncPromise');
    promise = new Y.Promise(function (resolve, reject) {
        promiseResolve = resolve;
        promiseReject = reject;
    });
    // we pass the promise, together with the resolve and reject handlers as an option to the event.
    // this way we can fullfill the promise in the defaultFn or prevDefaultFn.
    extraOptions = {
        promise: promise,
        promiseResolve: promiseResolve,
        promiseReject: promiseReject,
        response: '', // making available at the after listener
        parsed: {} // making available at the after listener
    };
/*jshint expr:true */
    (typeof options==='object') && YObject.each(
        options,
        function(value, key) {
            extraOptions[key] = value;
        }
    );
    // lazy publish the event
    instance[PUBLISHED+type] || (instance[PUBLISHED+type]=instance.publishAsync(type,
                                                                                {
                                                                                  defaultTargetOnly: true,
                                                                                  emitFacade: true,
                                                                                  defaultFn: instance['_defFn_'+type],
                                                                                  preventedFn: instance._prevDefFn
                                                                                }
                                                                               ));
/*jshint expr:false */
    instance.fire(type, extraOptions);
    return promise;
};

/**
 * DefaultFn for the 'save'-event
 *
 * @method _defFn_destroy
 * @param e {EventTarget}
 * @param e.promise {Y.Promise} promise passed by with the eventobject
 * @param e.promiseReject {Function} handle to the reject-method
 * @param e.promiseResolve {Function} handle to the resolve-method
 * @private
 * @since 0.3
*/
YModel.prototype._defFn_destroy = function(e) {
    var instance = this,
        promiseResolve = e.promiseResolve,
        promiseReject = e.promiseReject,
        options = e.options,
        remove = e.remove || e[DELETE],
        errFunc, successFunc, finish;

    Y.log('_defFn_destroy', 'info', 'ITSA-ModelSyncPromise');
    if (instance.get(DESTROYED)) {
        promiseReject(new Error('Model is already destroyed'));
    }
    else {
        finish = function() {
            // first the destruction through Base needs to be done
            instance._baseDestroy();
            YArray.each(instance.lists.concat(), function (list) {
                list.remove(instance, options);
            });
        };
        // next the typical Model-destroy-code:
        if (remove) {
            errFunc = function(err) {
                var facade = {
                    error   : err,
                    src     : 'Model.destroyPromise()',
                    options : options
                };
                instance._lazyFireErrorEvent(facade);
                promiseReject(new Error(err));
            };
            successFunc = function(response) {
                finish();
                promiseResolve(response);
            };
            if (instance.syncPromise) {
                // use the syncPromise-layer
                instance._syncTimeoutPromise(DELETE, options).then(
                    successFunc,
                    errFunc
                );
            }
            else {
                instance.sync(DELETE, options, function (err, response) {
                    if (err) {
                        errFunc(err);
                    }
                    else {
                        successFunc(response);
                    }
                });
            }
        } else {
            finish();
            promiseResolve();
        }
    }
    return e.promise;
};

/**
 * DefaultFn for the 'save'-event
 *
 * @method _defFn_load
 * @param e {EventTarget}
 * @param e.promise {Y.Promise} promise passed by with the eventobject
 * @param e.promiseReject {Function} handle to the reject-method
 * @param e.promiseResolve {Function} handle to the resolve-method
 * @private
 * @since 0.3
*/
YModel.prototype._defFn_load = function(e) {
    var instance = this,
        options = e.options,
        errFunc, successFunc,
        facade = {
            options : options
        };

    Y.log('_defFn_load', 'info', 'ITSA-ModelSyncPromise');
    errFunc = function(err) {
        facade.error = err;
        facade.src   = 'Model.loadPromise()';
        instance._lazyFireErrorEvent(facade);
        e.promiseReject(new Error(err));
    };
    successFunc = function(response) {
        var parsed;
        e.response = response;
        parsed = PARSED(response);
        if (parsed.responseText) {
            // XMLHttpRequest
            parsed = parsed.responseText;
        }
        e.parsed = parsed;
        instance.setAttrs(parsed, options);
        instance.changed = {};
        e.promiseResolve(response);
    };
    if (instance.syncPromise) {
        // use the syncPromise-layer
        instance._syncTimeoutPromise(READ, options).then(
            successFunc,
            errFunc
        );
    }
    else {
        instance.sync(READ, options, function (err, response) {
            if (err) {
                errFunc(err);
            }
            else {
                successFunc(response);
            }
        });
    }
    return e.promise;
};

/**
 * DefaultFn for the 'save'-event
 *
 * @method _defFn_save
 * @param e {EventTarget}
 * @param e.promise {Y.Promise} promise passed by with the eventobject
 * @param e.promiseReject {Function} handle to the reject-method
 * @param e.promiseResolve {Function} handle to the resolve-method
 * @private
 * @since 0.3
*/
YModel.prototype._defFn_save = function(e) {
    var instance = this,
        usedmethod = instance.isNew() ? 'create' : 'update',
        options = e.options,
        promiseReject = e.promiseReject,
        errFunc, successFunc,
        facade = {
            options : options,
            method: usedmethod
        };

    Y.log('_defFn_save', 'info', 'ITSA-ModelSyncPromise');
        instance._validate(instance.toJSON(), function (validateErr) {
            if (validateErr) {
                facade.error = validateErr;
                facade.src = 'Model.savePromise() - validate';
                instance._lazyFireErrorEvent(facade);
                promiseReject(new Error(validateErr));
            }
            else {
                errFunc = function(err) {
                    facade.error = err;
                    facade.src   = 'Model.savePromise()';
                    instance._lazyFireErrorEvent(facade);
                    promiseReject(new Error(err));
                };
                successFunc = function(response) {
                    var parsed;
                    e.response = response;
                    parsed = PARSED(response);
                    if (parsed.responseText) {
                        // XMLHttpRequest
                        parsed = parsed.responseText;
                    }
                    if (YObject.keys(parsed).length>0) {
                        e.parsed = parsed;
                        // if removed then fire destroy-event (not through synclayer), else update data
/*jshint expr:true */
                        (parsed.id===-1) ? instance.destroy() : instance.setAttrs(parsed, options);
/*jshint expr:false */
                    }
                    instance.changed = {};
                    e.promiseResolve(response);
                };
                if (instance.syncPromise) {
                    // use the syncPromise-layer
                    instance._syncTimeoutPromise(usedmethod, options).then(
                        successFunc,
                        errFunc
                    );
                }
                else {
                    instance.sync(usedmethod, options, function (err, response) {
                        if (err) {
                            errFunc(err);
                        }
                        else {
                            successFunc(response);
                        }
                    });
                }
            }
        });
    return e.promise;
};

/**
 * Prevented defaultFn as a Promise. Makes internal e.promise to be rejected.
 *
 * @method _prevDefFn
 * @param e {EventTarget}
 * @param e.promise {Y.Promise} promise passed by with the eventobject
 * @param e.promiseReject {Function} handle to the reject-method
 * @param e.promiseResolve {Function} handle to the resolve-method
 * @private
 * @since 0.3
*/
YModel.prototype._prevDefFn = function(e) {
    Y.log('_prevDefFn', 'info', 'ITSA-ModelSyncPromise');
    e.promiseReject(new Error('preventDefaulted'));
};

/**
* Fires the ERROR-event and -if not published yet- publish it broadcasted to Y.
* Because the error-event is broadcasted to Y, it can be catched by gallery-itsaerrorreporter.
*
* @method _lazyFireErrorEvent
 * @param {Object} [facade] eventfacade.
 * @private
**/
YModel.prototype._lazyFireErrorEvent = function(facade) {
    var instance = this;

    Y.log('_lazyFireErrorEvent', 'info', 'ITSA-ModelSyncPromise');
    // lazy publish
    if (!instance._errorEvent) {
        instance._errorEvent = instance.publish(ERROR, {
            broadcast: 1
        });
    }
    instance.fire(ERROR, facade);
};

/**
 * This method is used internally and returns syncPromise() that is called with 'action'.
 * If 'action' is not handled as a Promise -inside syncPromise- then this method will reject the promisi.
 *
 * @method _syncTimeoutPromise
 * @param action {String} The sync-action to perform.
 * @param [options] {Object} Sync options. The custom synclayer should pass through all options-properties to the server.
 * @return {Y.Promise} returned response for each 'action' --> response --> resolve(dataobject) OR reject(reason).
 * The returned 'dataobject' might be an object or a string that can be turned into a json-object
 * @private
 * @since 0.2
*/
YModel.prototype._syncTimeoutPromise = function(action, options) {
    var instance = this,
          syncpromise;

    Y.log('_syncTimeoutPromise', 'info', 'widget');
    syncpromise = instance.syncPromise(action, options);
    if (!(syncpromise instanceof Y.Promise)) {
        syncpromise = new Y.Promise(function (resolve, reject) {
            var errormessage = 'syncPromise is rejected --> '+action+' not defined as a Promise inside syncPromise()';
            Y.log('_syncTimeoutPromise: '+errormessage, 'warn', 'widget');
            reject(new Error(errormessage));
        });
    }
    return syncpromise;
};