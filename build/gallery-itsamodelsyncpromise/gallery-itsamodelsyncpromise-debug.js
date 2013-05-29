YUI.add('gallery-itsamodelsyncpromise', function (Y, NAME) {

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
 * @extends Model
 * @class ITSAModelSyncPromise
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

    PARSED = function(value) {
        var parsed;
        try {
            parsed = Y.JSON.parse(value);
        } catch (ex) {}
        return parsed;
    };

    // -- Mixing extra Methods to Y.Model -----------------------------------

    function ITSAModelSyncPromise() {}
    Y.mix(ITSAModelSyncPromise.prototype, {
       /**
         * Submits this model to the server.
         *
         * This method delegates to the `sync()` method to perform the actual submit
         * operation, which is Y.Promise. Read the Promise.then() and look for resolve(response, options) OR reject(reason).
         *
         * A successful submit-operation will also fire a `submit` event, while an unsuccessful
         * submit operation will fire an `error` event with the `src` value "submit".
         *
         * <b>CAUTION</b> The sync-method MUST call its callback-function to make the promised resolved.
         *
         * @method submitPromise
         * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
         *                 implementation to determine what options it supports or requires, if any.
         * @return {Y.Promise} promised response --> resolve(response, options) OR reject(reason).
        **/
        submitPromise: function(options) {
            var instance = this;

            Y.log('submitPromise', 'info', 'Itsa-ModelSyncPromise');
            options = options || {};
            return new Y.Promise(function (resolve, reject) {
                instance.sync('submit', options, function (err, response) {
                    var facade = {
                            options : options,
                            response: response
                        };
                    if (err) {
                        facade.error = err;
                        facade.src   = 'submit';
                        instance.fire(EVT_ERROR, facade);
                        reject(new Error(err));
                    }
                    else {
                        // Lazy publish.
                        if (!instance._submitEvent) {
                            instance._submitEvent = instance.publish(EVT_SUBMIT, {
                                preventable: false
                            });
                        }
                        instance.fire(EVT_SUBMIT, facade);
                        resolve(response, options);
                    }
                });
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
         * @return {Y.Promise} promised response --> resolve(response, options) OR reject(reason).
        **/
        loadPromise: function (options) {
            var instance = this;

            Y.log('loadPromise', 'info', 'Itsa-ModelSyncPromise');
            options = options || {};
            return new Y.Promise(function (resolve, reject) {
                instance.sync('read', options, function (err, response) {
                    var parsed,
                        facade = {
                            options : options,
                            response: response
                        };
                    if (err) {
                        facade.error = err;
                        facade.src   = 'load';
                        instance.fire(EVT_ERROR, facade);
                        reject(new Error(err));
                    }
                    else {
                        // Lazy publish.
                        if (!instance._loadEvent) {
                            instance._loadEvent = instance.publish(EVT_LOAD, {
                                preventable: false
                            });
                        }
                        parsed = facade.parsed = PARSED(response);
                        instance.setAttrs(parsed, options);
                        instance.changed = {};
                        instance.fire(EVT_LOAD, facade);
                        resolve(response, options);
                    }
                });
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
         * @return {Y.Promise} promised response --> resolve(response, options) OR reject(reason).
        **/
        savePromise: function (options) {
            var instance = this;

            Y.log('savePromise', 'info', 'Itsa-ModelSyncPromise');
            options = options || {};
            return new Y.Promise(function (resolve, reject) {
                var facade = {
                        options : options,
                        src     :'save'
                    };
                instance._validate(instance.toJSON(), function (validateErr) {
                    if (validateErr) {
                        facade.error = validateErr;
                        instance.fire(EVT_ERROR, facade);
                        reject(new Error(validateErr));
                    }
                    else {
                        instance.sync(instance.isNew() ? 'create' : 'update', options, function (err, response) {
                            var parsed;
                            facade.response = response;
                            if (err) {
                                facade.error = err;
                                facade.src   = 'save';
                                instance.fire(EVT_ERROR, facade);
                                reject(new Error(err));
                            }
                            else {
                                // Lazy publish.
                                if (!instance._saveEvent) {
                                    instance._saveEvent = instance.publish(EVT_SAVE, {
                                        preventable: false
                                    });
                                }
                                parsed = facade.parsed = PARSED(response);
                                instance.setAttrs(parsed, options);
                                instance.changed = {};
                                instance.fire(EVT_SAVE, facade);
                                resolve(response, options);
                            }
                        });
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
         * @return {Y.Promise} promised response --> resolve(response, options) OR reject(reason).
        **/
        destroyPromise: function (options) {
            var instance = this;

            Y.log('destroyPromise', 'info', 'Itsa-ModelSyncPromise');
            options = options || {};
            return new Y.Promise(function (resolve, reject) {
                instance.onceAfter('destroy', function () {
                    function finish() {
                        YArray.each(instance.lists.concat(), function (list) {
                            list.remove(instance, options);
                        });
                    }
                    if (options.remove || options['delete']) {
                        instance.sync('delete', options, function (err) {
                            if (err) {
                                var facade = {
                                    error   : err,
                                    src     : 'destroy',
                                    options : options
                                };
                                instance.fire(EVT_ERROR, facade);
                                reject(new Error(err));
                            }
                            else {
                                finish();
                                resolve(options);
                            }
                        });
                    } else {
                        finish();
                        resolve(options);
                    }
                });
            }).then(
                function() {
                    // if succeeded, destroy the Model's instance
                    Y.Model.superclass.destroy.call(instance);
                }
            );
        }

    }, true);

    Y.ITSAModelSyncPromise = ITSAModelSyncPromise;

    Y.Base.mix(Y.Model, [ITSAModelSyncPromise]);

}, 'gallery-2013.05.29-23-38', {"requires": ["yui-base", "base-base", "base-build", "node-base", "json-parse", "promise", "model"]});
