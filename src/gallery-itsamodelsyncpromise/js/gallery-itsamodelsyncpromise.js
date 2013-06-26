'use strict';

/**
 *
 * Extention ITSAModelSyncPromise
 *
 *
 * Extends Y.Model with Promised sync-methods. The synclayer can be made just as usual. But instead of calling
 * Model.load and Model.save and Model.destroy, you can use:
 *
 * <b>Model.loadPromise</b>
 * <b>Model.savePromise</b>
 * <b>Model.submitPromise</b>
 * <b>Model.destroyPromise</b>
 *
 * <b>The sync-layer MUST call the callback-function of its related promise-method, otherwise the promises are not resolved.</b>
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

   var YArray = Y.Array,
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
    EVT_ERROR = 'error',
   /**
     * Fired after model is submitted from the sync layer.
     * @event submit
     * @param e {EventFacade} Event Facade including:
     * @param [e.options] {Object} The options=object that was passed to the sync-layer, if there was one.
     * @param [e.parsed] {Object} The parsed version of the sync layer's response to the submit-request, if there was a response.
     * @param [e.response] {any} The sync layer's raw, unparsed response to the submit-request, if there was one.
     * @since 0.1
    **/
    EVT_SUBMIT = 'submit',
   /**
     * Fired after model is read from the sync layer.
     * @event load
     * @param e {EventFacade} Event Facade including:
     * @param [e.options] {Object} The options=object that was passed to the sync-layer, if there was one.
     * @param [e.response] {any} The sync layer's raw, unparsed response to the submit-request, if there was one.
     * @since 0.1
    **/
    EVT_LOAD = 'load',
   /**
     * Fired after model is saved through the sync layer.
     * @event submit
     * @param e {EventFacade} Event Facade including:
     * @param [e.options] {Object} The options=object that was passed to the sync-layer, if there was one.
     * @param [e.parsed] {Object} The parsed version of the sync layer's response to the submit-request, if there was a response.
     * @param [e.response] {any} The sync layer's raw, unparsed response to the submit-request, if there was one.
     * @since 0.1
    **/
    EVT_SAVE = 'save',

    PARSED = function (response) {
        if (typeof response === 'string') {
            try {
                return Y.JSON.parse(response);
            } catch (ex) {
                this.fire(EVT_ERROR, {
                    error   : ex,
                    response: response,
                    src     : 'parse'
                });
                return null;
            }
        }
        return response;
    };

    // -- Mixing extra Methods to Y.Model -----------------------------------

    function ITSAModelSyncPromise() {}
    Y.mix(ITSAModelSyncPromise.prototype, {

       /**
         * This method can be defined in descendend classes.<br />
         * If syncPromise is defined, then the syncPromise() definition will be used instead of sync() definition.<br />
         * Always reject the promise in case an invalid 'action' is defined: end the method with this code:
         *   return new Y.Promise(function (resolve, reject) {<br />
         *       reject(new Error('The syncPromise()-method was is called with undefined action: '+action));
         *   });<br />
         *
         * @method syncPromise
         * @param action {String} The sync-action to perform.
         * @param [options] {Object} Sync options. The custom synclayer should pass through all options-properties to the server.
         * @return {Y.Promise} returned response for each 'action' --> response --> resolve(dataobject) OR reject(reason).
         * The returned 'dataobject' might be an object or a string that can be turned into a json-object
        */

       /**
         * Submits this model to the server.
         *
         * This method delegates to the `sync()` method to perform the actual submit
         * operation, which is Y.Promise. Read the Promise.then() and look for resolve(response) OR reject(reason).
         *
         * A successful submit-operation will also fire a `submit` event, while an unsuccessful
         * submit operation will fire an `error` event with the `src` value "submit".
         *
         * <b>CAUTION</b> The sync-method MUST call its callback-function to make the promised resolved.
         *
         * @method submitPromise
         * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
         *                 implementation to determine what options it supports or requires, if any.
         * @return {Y.Promise} promised response --> resolve(response) OR reject(reason).
        **/
        submitPromise: function(options) {
            var instance = this;

            Y.log('submitPromise', 'info', 'Itsa-ModelSyncPromise');
            options = options || {};
            return new Y.Promise(function (resolve, reject) {
                var errFunc, successFunc,
                      facade = {
                          options : options
                      };
                errFunc = function(err) {
                    facade.error = err;
                    facade.src   = 'Model.submitPromise()';
                    instance._lazyFireErrorEvent(facade);
                    reject(new Error(err));
                };
                successFunc = function(response) {
                    // Lazy publish.
                    if (!instance._submitEvent) {
                        instance._submitEvent = instance.publish(EVT_SUBMIT, {
                            preventable: false
                        });
                    }
                    facade.response = response;
                    instance.fire(EVT_SUBMIT, facade);
                    resolve(response);
                };
                if (instance.syncPromise) {
                    // use the syncPromise-layer
                    instance.syncPromise('submit', options).then(
                        successFunc,
                        errFunc
                    );
                }
                else {
                    // use the sync-layer
                    instance.sync('submit', options, function (err, response) {
                        if (err) {
                            errFunc(err);
                        }
                        else {
                            successFunc(response);
                        }
                    });
                }
            });
        },


        /**
         * Loads this model from the server.
         *
         * This method delegates to the `sync()` method to perform the actual load
         * operation, which is an asynchronous action. Specify a _callback_ function to
         * be notified of success or failure.
         *
         * A successful load operation will fire a `load` event, while an unsuccessful
         * load operation will fire an `error` event with the `src` value "load".
         *
         * If the load operation succeeds and one or more of the loaded attributes
         * differ from this model's current attributes, a `change` event will be fired.
         * @method loadPromise
         * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
         *                 implementation to determine what options it supports or requires, if any.
         * @return {Y.Promise} promised response --> resolve(response) OR reject(reason).
        **/
        loadPromise: function (options) {
            var instance = this;

            Y.log('loadPromise', 'info', 'Itsa-ModelSyncPromise');
            options = options || {};
            return new Y.Promise(function (resolve, reject) {
                var errFunc, successFunc,
                      facade = {
                          options : options
                      };
                errFunc = function(err) {
                    facade.error = err;
                    facade.src   = 'Model.loadPromise()';
                    instance._lazyFireErrorEvent(facade);
                    reject(new Error(err));
                };
                successFunc = function(response) {
                    var parsed;
                    // Lazy publish.
                    if (!instance._loadEvent) {
                        instance._loadEvent = instance.publish(EVT_LOAD, {
                            preventable: false
                        });
                    }
                    facade.response = response;
                    parsed = facade.parsed = PARSED(response);
                    instance.setAttrs(parsed, options);
                    instance.changed = {};
                    instance.fire(EVT_LOAD, facade);
                    resolve(response);
                };
                if (instance.syncPromise) {
                    // use the syncPromise-layer
                    instance.syncPromise('read', options).then(
                        successFunc,
                        errFunc
                    );
                }
                else {
                    instance.sync('read', options, function (err, response) {
                        if (err) {
                            errFunc(err);
                        }
                        else {
                            successFunc(response);
                        }
                    });
                }
            });
        },

       /**
        * Saves this model to the server.
        *
        * This method delegates to the `sync()` method to perform the actual save
        * operation, which is an asynchronous action. Specify a _callback_ function to
        * be notified of success or failure.
        *
        * A successful save operation will fire a `save` event, while an unsuccessful
        * save operation will fire an `error` event with the `src` value "save".
        *
        * If the save operation succeeds and one or more of the attributes returned in
        * the server's response differ from this model's current attributes, a
        * `change` event will be fired.
        *
        * @method savePromise
         * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
         *                 implementation to determine what options it supports or requires, if any.
         * @return {Y.Promise} promised response --> resolve(response) OR reject(reason).
        **/
        savePromise: function (options) {
            var instance = this;

            Y.log('savePromise', 'info', 'Itsa-ModelSyncPromise');
            options = options || {};
            return new Y.Promise(function (resolve, reject) {
                var errFunc, successFunc, usedmethod,
                      facade = {
                          options : options
                      };
                instance._validate(instance.toJSON(), function (validateErr) {
                    if (validateErr) {
                        facade.error = validateErr;
                        facade.src = 'Model.savePromise() - validate';
                        instance._lazyFireErrorEvent(facade);
                        reject(new Error(validateErr));
                    }
                    else {
                        errFunc = function(err) {
                            facade.error = err;
                            facade.src   = 'Model.savePromise()';
                            instance._lazyFireErrorEvent(facade);
                            reject(new Error(err));
                        };
                        successFunc = function(response) {
                            var parsed;
                            // Lazy publish.
                            if (!instance._saveEvent) {
                                instance._saveEvent = instance.publish(EVT_SAVE, {
                                    preventable: false
                                });
                            }
                            facade.response = response;
                            parsed = facade.parsed = PARSED(response);
                            instance.setAttrs(parsed, options);
                            instance.changed = {};
                            instance.fire(EVT_SAVE, facade);
                            resolve(response);
                        };
                        usedmethod = instance.isNew() ? 'create' : 'update';
                        if (instance.syncPromise) {
                            // use the syncPromise-layer
                            instance.syncPromise(usedmethod, options).then(
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
            });
        },

      /**
         * Destroys this model instance and removes it from its containing lists, if any.
         *
         * The _callback_, if one is provided, will be called after the model is
         * destroyed.
         *
         * If `options.remove` is `true`, then this method delegates to the `sync()`
         * method to delete the model from the persistence layer, which is an
         * asynchronous action. In this case, the _callback_ (if provided) will be
         * called after the sync layer indicates success or failure of the delete
         * operation.
         *
         * @method destroyPromise
         * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
         *                 implementation to determine what options it supports or requires, if any.
         * @return {Y.Promise} promised response --> resolve(response) OR reject(reason).
        **/
        destroyPromise: function (options) {
            var instance = this;

            Y.log('destroyPromise', 'info', 'Itsa-ModelSyncPromise');
            options = options || {};
            return new Y.Promise(function (resolve, reject) {
                instance.onceAfter('destroy', function () {
                    var errFunc, successFunc, finish;
                    finish = function() {
                        YArray.each(instance.lists.concat(), function (list) {
                            list.remove(instance, options);
                        });
                    };
                    if (options.remove || options['delete']) {
                        errFunc = function(err) {
                            var facade = {
                                error   : err,
                                src     : 'Model.destroyPromise()',
                                options : options
                            };
                            instance._lazyFireErrorEvent(facade);
                            reject(new Error(err));
                        };
                        successFunc = function(response) {
                            finish();
                            resolve(response);
                        };
                        if (instance.syncPromise) {
                            // use the syncPromise-layer
                            instance.syncPromise('delete', options).then(
                                successFunc,
                                errFunc
                            );
                        }
                        else {
                            instance.sync('delete', options, function (err, response) {
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
                        resolve();
                    }
                });
            }).then(
                function() {
                    // if succeeded, destroy the Model's instance
                    Y.Model.superclass.destroy.call(instance);
                }
            );
        },

       /**
        * Fires the 'error'-event and -if not published yet- publish it broadcasted to Y.
        * Because the error-event is broadcasted to Y, it can be catched by gallery-itsaerrorreporter.
        *
        * @method _lazyFireErrorEvent
         * @param {Object} [facade] eventfacade.
         * @private
        **/
        _lazyFireErrorEvent : function(facade) {
            var instance = this;

            Y.log('_lazyFireErrorEvent', 'info', 'Itsa-ModellistSyncPromise');
            // lazy publish
            if (!instance._errorEvent) {
                instance._errorEvent = instance.publish(EVT_ERROR, {
                    broadcast: 1
                });
            }
            instance.fire(EVT_ERROR, facade);
        }

    }, true);

    Y.ITSAModelSyncPromise = ITSAModelSyncPromise;

    Y.Base.mix(Y.Model, [ITSAModelSyncPromise]);