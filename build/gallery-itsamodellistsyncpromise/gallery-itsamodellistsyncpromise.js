YUI.add('gallery-itsamodellistsyncpromise', function (Y, NAME) {

'use strict';

/**
 *
 * Extention ITSAModellistSyncPromise
 *
 *
 * Extends Y.ModelList with Promised sync-methods. The ModelList's synclayer can be made just as usual, defining these actions:
 * <br /><br />
 * 'create'
 * 'destroy'
 * 'read'
 * 'readappend'
 * 'save'
 * 'submit'
 * 'update'
 * <br /><br />
 * Instead of calling ModelList.load() you should use:
 * <br />
 * <b>ModelList.loadPromise(options)</b> --> to append the read-models --> options = {append: true};
 * <br /><br />
 * Also, there are 3 extra Promises, which -in this current version- <b>all depends</b> on the Model's synclayer, not ModelLists synclayer:
 * <br />
 * <b>ModelList.destroyPromise()</b><br />
 * <b>ModelList.savePromise()</b><br />
 * <b>ModelList.submitPromise()</b>
 *
 * @module gallery-itsamodelsyncpromise
 * @class ITSAModellistSyncPromise
 * @constructor
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

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
    var EVT_ERROR = 'error',

    /**
     * Fired after all changed models of the modellist is saved through the Model-sync layer.
     * @event save
     * @param e {EventFacade} Event Facade including:
     * @param [e.options] {Object} The options=object that was passed to the sync-layer, if there was one.
     * @param [e.parsed] {Object} The parsed version of the sync layer's response to the submit-request, if there was a response.
     * @param [e.response] {any} The sync layer's raw, unparsed response to the submit-request, if there was one.
     * @since 0.1
    **/
    EVT_SAVE = 'save',

   /**
     * Fired after models are submitted through the Model-sync layer.
     * @event submit
     * @param e {EventFacade} Event Facade including:
     * @param [e.options] {Object} The options=object that was passed to the sync-layer, if there was one.
     * @param [e.parsed] {Object} The parsed version of the sync layer's response to the submit-request, if there was a response.
     * @param [e.response] {any} The sync layer's raw, unparsed response to the submit-request, if there was one.
     * @since 0.1
    **/
    EVT_SUBMIT = 'submit',

   /**
     * Fired after models are appended to the ModelList by the ModelList-sync layer.
     * @event loadappend
     * @param e {EventFacade} Event Facade including:
     * @param [e.options] {Object} The options=object that was passed to the sync-layer, if there was one.
     * @param [e.response] {any} The sync layer's raw, unparsed response to the submit-request, if there was one.
     * @since 0.1
    **/
    EVT_LOADAPPEND = 'loadappend',

   /**
     * Fired after models are read from the ModelList-sync layer.
     * @event load
     * @param e {EventFacade} Event Facade including:
     * @param [e.options] {Object} The options=object that was passed to the sync-layer, if there was one.
     * @param [e.response] {any} The sync layer's raw, unparsed response to the submit-request, if there was one.
     * @since 0.1
    **/
    EVT_LOAD = 'load',

   /**
     * Fired after models are destroyed from the ModelList-sync layer.
     * @event destroy
     * @param e {EventFacade} Event Facade including:
     * @param [e.options] {Object} The options=object that was passed to the sync-layer, if there was one.
     * @param [e.response] {any} The sync layer's raw, unparsed response to the submit-request, if there was one.
     * @since 0.1
    **/
    EVT_DESTROY = 'destroy',

    PARSED = function(value) {
        var parsed;
        try {
            parsed = Y.JSON.parse(value);
        } catch (ex) {}
        return parsed;
    };

// -- Mixing extra Methods to Y.ModelList -----------------------------------

    function ITSAModellistSyncPromise() {}
    Y.mix(ITSAModellistSyncPromise.prototype, {

       /**
        * Destroys all models within this modellist.
        * <b>Caution:</b> The current version uses the Model's synclayer, NOT ModelList's synclayer.
        *
        * This method delegates to the Model's`sync()` method to perform the actual destroy
        * operation, which is an asynchronous action. Within the Y.Model-class, you <b>must</b> specify a _callback_ function to
         * make the promise work.
        *
        * A successful destroy operation will fire a `destroy` event, while an unsuccessful
        * save operation will fire an `error` event with the `src` value "destroy".
        *
        * @method destroyPromise
         * @param {Object} [options] Options to be passed to all Model's`sync()`. It's up to the custom sync
         *                 implementation to determine what options it supports or requires, if any.
         * @return {Y.Promise} promised response --> resolve(response, options) OR reject(reason).
        **/
        destroyPromise: function(options) {
            var instance = this,
                  destroylist = [];

            instance.each(
                function(model) {
                    destroylist.push(model.destroyPromise(options));
                }
            );
            return Y.batch.apply(Y, destroylist).then(
//            return Y.Promise.every(destroylist).then(
                function(data) {
                    var facade = {
                        options : options,
                        src : 'destroy'
                    };
                    // Lazy publish.
                    if (!instance._destroyEvent) {
                        instance._destroyEvent = instance.publish(EVT_DESTROY, {
                            preventable: false
                        });
                    }
                    instance.fire(EVT_DESTROY, facade);
                    return data;
                },
                function(err) {
                    var facade = {
                        options : options,
                        src : 'destroy',
                        error: err
                    };
                    instance.fire(EVT_ERROR, facade);
                    return err;
                }
            );
        },

        /**
         * Loads models from the server and adds them into the ModelList.
         *
         * This method delegates to the `sync()` method, by either using the 'read' or 'readappend' action, depending
         * on the value of parameter options.append.
         * This is an asynchronous action. You <b>must</b> specify a _callback_ function to
         * make the promise work.
         *
         * A successful load operation will fire a `load` event, while an unsuccessful
         * load operation will fire an `error` event with the `src` value "load".
         *
         * If the load operation succeeds and one or more of the loaded attributes
         * differ from this model's current attributes, a `change` event will be fired for every Model.
         *
         * @method loadPromise
         * @param {Object} [options] Options to be passed to `sync()`. The custom sync
         *                 implementation can determine what options it supports or requires, if any.
         * @param {Boolean} [options.append] Set true if you want to append items.
         * @return {Y.Promise} promised response --> resolve(response, options) OR reject(reason).
        **/
        loadPromise: function (options) {
            var instance = this,
                 optionsappend, append, eventname;

            options = options || {};
            optionsappend = options.append;
            append = ((typeof optionsappend === 'boolean') && optionsappend);
            eventname = append ? EVT_LOADAPPEND : EVT_LOAD;
            return new Y.Promise(function (resolve, reject) {
                instance.sync(append ? 'readappend' : 'read', options, function (err, response) {
                    var parsed,
                        facade = {
                            options : options,
                            response: response
                        };
                    if (err) {
                        facade.error = err;
                        facade.src   = append ? 'loadappend' : 'load';
                        instance.fire(EVT_ERROR, facade);
                        reject(new Error(err));
                    }
                    else {
                        // Lazy publish.
                        if (!instance['_'+eventname]) {
                            instance['_'+eventname] = instance.publish(eventname, {
                                preventable: false
                            });
                        }
                        parsed = facade.parsed = PARSED(response);
                        if (append) {
                            instance.add(parsed, options);
                        }
                        else {
                            instance.reset(parsed, options);
                        }
                        instance.fire(eventname, facade);
                        resolve(response, options);
                    }
                });
            });
        },

       /**
        * Saves all modified models within this modellist to the server.
        * <b>Caution:</b> within the current version the Model's synclayer is used, NOT ModelList's synclayer.
        * Therefore, you get multiple requests for all modified Models.
        *
        * This method delegates to the Model's`sync()` method to perform the actual save
        * operation, which is an asynchronous action. Within the Y.Model-class, you <b>must</b> specify a _callback_ function to
         * make the promise work.
        *
        * A successful save operation will fire a `save` event, while an unsuccessful
        * save operation will fire an `error` event with the `src` value "save".
        *
        * If the save operation succeeds and one or more of the attributes returned in
        * the server's response differ from this model's current attributes, a
        * `change` event will be fired.
        *
        * @method savePromise
         * @param {Object} [options] Options to be passed to all Model's`sync()`. It's up to the custom sync
         *                 implementation to determine what options it supports or requires, if any.
         * @return {Y.Promise} promised response --> resolve(response, options) OR reject(reason).
        **/
        savePromise: function(options) {
            var instance = this,
                  savelist = [];

            instance.each(
                function(model) {
                    if (model.isModified()) {
                        savelist.push(model.savePromise(options));
                    }
                }
            );
            return Y.batch.apply(Y, savelist).then(
//            return Y.Promise.every(savelist).then(
                function(data) {
                    var facade = {
                        options : options,
                        src : 'save'
                    };
                    // Lazy publish.
                    if (!instance._saveEvent) {
                        instance._saveEvent = instance.publish(EVT_SAVE, {
                            preventable: false
                        });
                    }
                    instance.fire(EVT_SAVE, facade);
                    return data;
                },
                function(err) {
                    var facade = {
                        options : options,
                        src : 'save',
                        error: err
                    };
                    instance.fire(EVT_ERROR, facade);
                    return err;
                }
            );
        },

       /**
        * Submits all models within this modellist to the server.
        * <b>Caution:</b> within the current version the Model's synclayer is used, NOT ModelList's synclayer.
        * Therefore, you get multiple requests for all Models.
        *
        * This method delegates to the Model's`sync()` method to perform the actual submit
        * operation, which is an asynchronous action. Within the Y.Model-class, you <b>must</b> specify a _callback_ function to
         * make the promise work.
        *
        * A successful save operation will fire a `submit` event, while an unsuccessful
        * save operation will fire an `error` event with the `src` value "submit".
        *
        * @method submitPromise
         * @param {Object} [options] Options to be passed to all Model's`sync()`. It's up to the custom sync
         *                 implementation to determine what options it supports or requires, if any.
         * @return {Y.Promise} promised response --> resolve(response, options) OR reject(reason).
        **/
        submitPromise: function(options) {
            var instance = this,
                  submitlist = [];

            instance.each(
                function(model) {
                    submitlist.push(model.submitPromise(options));
                }
            );
            return Y.batch.apply(Y, submitlist).then(
//            return Y.Promise.every(submitlist).then(
                function(data) {
                    var facade = {
                        options : options,
                        src : 'submit'
                    };
                    // Lazy publish.
                    if (!instance._submitEvent) {
                        instance._submitEvent = instance.publish(EVT_SUBMIT, {
                            preventable: false
                        });
                    }
                    instance.fire(EVT_SUBMIT, facade);
                    return data;
                },
                function(err) {
                    var facade = {
                        options : options,
                        src : 'submit',
                        error: err
                    };
                    instance.fire(EVT_ERROR, facade);
                    return err;
                }
            );
        }

    }, true);

    Y.ITSAModellistSyncPromise = ITSAModellistSyncPromise;

    Y.Base.mix(Y.ModelList, [ITSAModellistSyncPromise]);

}, 'gallery-2013.05.29-23-38', {
    "requires": [
        "yui-base",
        "base-base",
        "base-build",
        "node-base",
        "json-parse",
        "promise",
        "model",
        "model-list",
        "gallery-itsamodelsyncpromise"
    ]
});
