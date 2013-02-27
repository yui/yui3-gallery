'use strict';

/**
 * @module gallery-itsacalendarmarkeddates
 * @class ITSACalendarModelList
 * @since 3.8.1
 *
 * <i>Copyright (c) 2013 Its Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
**/

var Lang                = Y.Lang,
    YArray              = Y.Array,
    YObject             = Y.Object,
    hasKey              = YObject.hasKey,
    YDate               = Y.DataType.Date,
    dateIsValid         = YDate.isValidDate,
    dateCopyObject      = function (oDate) {
                              return new Date(oDate.getTime());
                          },
    dateCopyValues      = function (aDate, bDate) {
                              bDate.setTime(aDate.getTime());
                          },
    dateAddMinutes      = function (oDate, numMinutes) {
                              oDate.setTime(oDate.getTime() + 60000*numMinutes);
                          },
    dateAddMonths       = function (oDate, numMonths) {
                              var newYear = oDate.getFullYear(),
                                  newMonth = oDate.getMonth() + numMonths;
                              newYear  = Math.floor(newYear + newMonth / 12);
                              newMonth = (newMonth % 12 + 12) % 12;
                              oDate.setFullYear(newYear);
                              oDate.setMonth(newMonth);
                          },
    dateAddDays         = function (oDate, numDays) {
                              oDate.setTime(oDate.getTime() + 86400000*numDays);
                          },
    dateEqualDays       = function(aDate, bDate) {
                              return ((aDate.getDate()===bDate.getDate()) && (aDate.getMonth()===bDate.getMonth())
                                      && (aDate.getFullYear()===bDate.getFullYear()));
                          },
    dayisGreater        = function(aDate, bDate) {
                              return (YDate.isGreater(aDate, bDate) && !dateEqualDays(aDate, bDate));
                          },
    dayisGreaterOrEqual = function(aDate, bDate) {
                              return (YDate.isGreater(aDate, bDate) || dateEqualDays(aDate, bDate));
                          };

function ITSACalendarModelList() {}

ITSACalendarModelList.ATTRS = {

    /**
     * The ModelList that is 'attached' to the Calendar, resulting in highlighted dates for each Model
     * that has a 'Date-match'. For more info how a 'Date-match' is achieved: see the attribute modelConfig.
     * @attribute modelList
     * @type {ModelList}
     * @default null
     * @since 3.8.1
     */
    modelList : {
        value: null,
        lazyAdd: false,
        validator: function(v){ return (v instanceof Y.ModelList) || v === null; },
        setter: '_setModelList'
    },

    /**
     * Definition of the Model's <b>date</b>, <b>enddate</b>, <b>count</b>, <b>intervalMinutes</b>,
     * <b>intervalHours</b>, <b>intervalDays</b> and <b>intervalMonths</b> attributes. These values are Strings and represent the attributenames
     * in the Models. The actual values (and its types) come form the Models itsself.
     *
     * For example: {date: 'startDate'}, which means that yourModel.get('startDate') should return a Date-object.
     * When not specified, the module tries to find a valid <b>modelConfig.date</b> which it can use,
     * by looking at the Models structure.
     *
     * @attribute modelConfig
     * @type {Object} with fields: <b>date</b>, <b>enddate</b>, <b>count</b>, <b>intervalMinutes</b>,
     * <b>intervalHours</b>, <b>intervalDays</b> and <b>intervalMonths</b>
     * @default null
     * @since 3.8.1
     */
    modelConfig: {
        value:      null,
        validator:  function(v){ return Lang.isObject(v) || v === null; },
        setter: '_setModelConfig'
    }

};

Y.mix(ITSACalendarModelList.prototype, {

    /**
     * Internal subscriber to Calendar.after('selectionChange') events
     *
     * @property _fireMarkEvent
     * @type EventHandle
     * @private
     * @since 3.8.1
     */
    _fireModelsEvent : null,

    /**
     * Internal subscriber to Calendar.after(['dateChange', 'markChange']) events
     *
     * @property _fireMarkEvent
     * @type EventHandle
     * @private
     * @since 3.8.1
     */
    _afterRenderEvent : null,

    /**
     * Internal subscriber to Calendar.after('render') events
     *
     * @property _syncModelListEvent
     * @type EventHandle
     * @private
     * @since 3.8.1
     */
    _syncModelListEvent : null,

    /**
     * Internal subscriber to modelList.after('*:change') events
     *
     * @property _syncModelListCheckEvent
     * @type EventHandle
     * @private
     * @since 3.8.1
     */
    _syncModelListCheckEvent : null,

    /**
     * Internal flag that tells whether the attribute modelConfig is initiated.
     *
     * @property _modelConfigInitiated
     * @type Boolean
     * @private
     * @since 3.8.1
     */
    _modelConfigInitiated : false,

    /**
     * Internal flag that tells whether the attribute modelList is initiated.
     *
     * @property _modelListInitiated
     * @type Boolean
     * @private
     * @since 3.8.1
     */
    _modelListInitiated : false,

    /**
     * Internal flag that is used to check whether modelConfig is updated by an internal set('modelList').
     *
     * @property _internalUpdate
     * @type Boolean
     * @private
     * @since 3.8.1
     */
    _internalUpdate : false,


    /**
     * Designated initializer
     * Initializes instance-level properties of ITSACalendarModelList.
     *
     * @method initializer
     * @protected
     * @since 3.8.1
     */
    initializer : function () {
        var instance = this;

        Y.log('initializer', 'info', 'Itsa-CalendarModelList');
        instance._fireModelsEvent = instance.after('selectionChange', instance._fireSelectedModels);
    },

    /**
     * Returns an Array with the Models that fall with the specified Date-range.
     * If aDate is an Array, then the search will be inside this Array.
     * If aDate is a Date-Object then the search will go between the range aDate-bDate
     * (bDate included, when bDate is not specified, only aDate is taken)
     *
     * @method getModels
     * @param {Date|Array} aDate the startDate, or an Array of Dates to search within
     * @param {Date} [bDate] The last Date to search within (in case of a range aDate-bDate)
     * Will only be taken if aDate is a Date-object
     * @return {Array} Array with all unique Models that fall within the searchargument
     * @since 3.8.1
     */
    getModels : function (aDate, bDate) {
        var instance = this,
            returnModels = [],
            year, month, day, searchDay, modelArrayDay, useFunction;

        Y.log('getModels', 'info', 'Itsa-CalendarModelList');
        if (Lang.isArray(aDate)) {
            returnModels = instance._getSelectedModelList({newSelection: aDate, validateDate: true});
        }
        else if (YDate.isValidDate(aDate)) {
            useFunction = function(model) {
                if (YArray.indexOf(returnModels, model) === -1) {
                    returnModels.push(model);
                }
            };
            if (!YDate.isValidDate(bDate) || dayisGreater(aDate, bDate)) {
                bDate = dateCopyObject(aDate);
            }
            searchDay = new Date(aDate.getTime());
            do {
                year = searchDay.getFullYear();
                month = searchDay.getMonth();
                day = searchDay.getDate();
                modelArrayDay = (instance._storedModelDates[year] && instance._storedModelDates[year][month]
                                && instance._storedModelDates[year][month][day]) || [];
                YArray.each(
                    modelArrayDay,
                    useFunction
                );
                dateAddDays(searchDay, 1);
            }
            while (!dayisGreater(searchDay, bDate));
        }
        return returnModels;
    },

    /**
     * Returns whether a Date has any Models
     *
     * @method dateHasModels
     * @param {Date} oDate Date to be checked
     * @return {Boolean}
     * @since 3.8.1
     */
    dateHasModels : function (oDate) {
        var instance = this,
            storedModelDates = instance._storedModelDates,
            year = oDate.getFullYear(),
            month = oDate.getMonth(),
            day = oDate.getDate(),
            modelArray = (storedModelDates[year] && storedModelDates[year][month] && storedModelDates[year][month][day]) || [],
            hasModels = (modelArray.length > 0);

        Y.log('dateHasModels check '+oDate+' result: '+hasModels, 'warn', 'Itsa-CalendarModelList');
        return hasModels;
    },

    /**
     * Returns an Array with the Models that fall in the specified <b>Date</b>.
     * <br />Sugar-method: the same as when calling the method getModels(oDate);
     *
     * @method getModelsInDate
     * @param {Date} oDate a Date-Object to search within.
     * @return {Array} Array with the Models within the specified Date
     * @since 3.8.1
     */
    getModelsInDate : function (oDate) {
        var instance = this;

        Y.log('getModelsInDate', 'info', 'Itsa-CalendarModelList');
        return instance.getModels(oDate);
    },

    /**
     * Returns an Array with the Models that fall with the <b>Week</b> specified by the Date-argument.
     *
     * @method getModelsInWeek
     * @param {Date} oDate a Date-Object that determines the <b>Week</b> to search within.
     * @return {Array} Array with the Models within the specified Week
     * @since 3.8.1
     */
    getModelsInWeek : function (oDate) {
        var instance = this,
            dayOfWeek = oDate.getDay(),
            aDate = dateCopyObject(oDate),
            bDate = dateCopyObject(oDate);

        Y.log('getModelsInWeek', 'info', 'Itsa-CalendarModelList');
        dateAddDays(aDate, -dayOfWeek);
        dateAddDays(bDate, 6-dayOfWeek);
        return instance.getModels(aDate, bDate);
    },

    /**
     * Returns an Array with the Models that fall with the <b>Month</b> specified by the Date-argument.
     *
     * @method getModelsInMonth
     * @param {Date} oDate a Date-Object that determines the <b>Month</b> to search within.
     * @return {Array} Array with the Models within the specified Month
     * @since 3.8.1
     */
    getModelsInMonth : function (oDate) {
        var instance = this,
            aDate = dateCopyObject(oDate),
            bDate = YDate.addMonths(oDate, 1);

        Y.log('getModelsInMonth', 'info', 'Itsa-CalendarModelList');
        aDate.setDate(1);
        bDate.setDate(1);
        dateAddDays(bDate, -1);
        return instance.getModels(aDate, bDate);
    },

    /**
     * Returns an Array with the Models that fall with the <b>Year</b>.
     *
     * @method getModelsInYear
     * @param {int} year The <b>Year</b> to search within.
     * @return {Array} Array with the Models within the specified Year
     * @since 3.8.1
     */
    getModelsInYear : function (year) {
        var instance = this,
            aDate = new Date(year, 0, 1),
            bDate = new Date(year, 11, 31);

        Y.log('getModelsInYear', 'info', 'Itsa-CalendarModelList');
        return instance.getModels(aDate, bDate);
    },

    /**
     * Cleans up events
     *
     * @method destructor
     * @protected
     * @since 3.8.1
     */
    destructor: function () {
        var instance = this;

        Y.log('destructor', 'info', 'Itsa-CalendarModelList');
        instance._clearSyncSubscriptionModelList();
        if (instance._fireModelsEvent) {
            instance._fireModelsEvent.detach();
        }
        if (instance._afterRenderEvent) {
            instance._afterRenderEvent.detach();
        }
    },

    //--------------------------------------------------------------------------
    // Protected properties and methods
    //--------------------------------------------------------------------------

    /**
     * Clears subscriptions _syncModelListEvent and _syncModelListCheckEvent
     *
     * @method _clearSyncSubscriptionModelList
     * @private
     * @since 3.8.1
     */
    _clearSyncSubscriptionModelList : function () {
        var instance = this;

        Y.log('_clearSyncSubscriptionModelList', 'info', 'Itsa-CalendarModelList');
        if (instance._syncModelListEvent) {
            instance._syncModelListEvent.detach();
        }
        if (instance._syncModelListCheckEvent) {
            instance._syncModelListCheckEvent.detach();
        }
    },

    /**
     * Setter when changing attribute modelConfig.
     * Will sync the ModelList with the Calendar.
     *
     * @method _setModelConfig
     * @param {Object} val the new modelConfig
     * @private
     * @since 3.8.1
     */
    _setModelConfig : function (val) {
        var instance = this;

        Y.log('_setModelConfig', 'info', 'Itsa-CalendarModelList');
        // do not sync at startup:
        if (instance._modelConfigInitiated && !instance._internalUpdate) {
            Y.log('_setModelConfig will sync the modelList', 'info', 'Itsa-CalendarModelList');
            instance._syncModelList(null, null, val);
        }
        else {
            instance._modelConfigInitiated = true;
        }
    },

    /**
     * Setter when changing attribute modelList.
     * Will sync the ModelList with the Calendar.
     *
     * @method _setModelList
     * @param {ModelList} val the new modelList
     * @private
     * @since 3.8.1
     */
    _setModelList : function (val) {
        var instance = this,
            modelconfig = instance.get('modelConfig') || {},
            modeldateattr = modelconfig.date,
            firstModel, valid;

        Y.log('_setModelList', 'info', 'Itsa-CalendarModelList');
        // search datefield when not available
        if (!modeldateattr && val && val.size()>0) {
            Y.log('_setModelList not found attribute modelConfig.date --> will search for it in first Model', 'info', 'Itsa-CalendarModelList');
            firstModel = val.item(0);
            YObject.some(
                firstModel.getAttrs(),
                function(val, key) {
                    valid = Lang.isDate(val);
                    if (valid) {
                        modeldateattr = key;
                    }
                    return valid;
                }
            );
            if (valid) {
                Y.log('_setModelList found Date-field in modellist. Attribute modelConfig.Date is set to '+modeldateattr,
                      'warn', 'Itsa-CalendarModelList');
                instance._internalUpdate = true;
                modelconfig.date = modeldateattr;
                instance.set('modelConfig', modelconfig);
                instance._internalUpdate = false;
            }
            else {
                Y.log('_setModelList no valid Date-field found in modellist. Attribute modelDateAttr remains empty',
                      'warn', 'Itsa-CalendarModelList');
            }
        }
        instance._clearSyncSubscriptionModelList();
        if (val) {
            instance._syncModelListEvent = val.after(['add', 'remove', 'reset'], instance._syncModelList, instance);
            instance._syncModelListCheckEvent = val.after('*:change', instance._checkSyncModelList, instance);
        }
        // do not sync at startup:
        if (instance._modelListInitiated || val) {
            Y.log('_setModelList will sync the modelList', 'info', 'Itsa-CalendarModelList');
            instance._syncModelList(null, val);
        }
        else {
            instance._modelListInitiated = true;
        }
    },

    /**
     * Subscriber to this.modelList.after('*:change')
     * Might call _syncModelList, but only if the Models-attribute that is changed is one of these:
     * date, enddate, count, intervalMinutes, intervalHours, intervalDays or intervalMonths
     *
     * @method _checkSyncModelList
     * @param {EventTarget} e
     * @private
     * @since 3.8.1
     */
    _checkSyncModelList : function (e) {
        var instance = this,
            modelconfig = instance.get('modelConfig') || {},
            modelconfigDate = modelconfig.date || '',
            modelconfigEnddate = modelconfig.enddate || '',
            modelconfigCount = modelconfig.count || '',
            modelconfigIntervalMinutes = modelconfig.intervalMinutes || '',
            modelconfigIntervalHours = modelconfig.intervalHours || '',
            modelconfigIntervalDays = modelconfig.intervalDays || '',
            modelconfigIntervalMonths = modelconfig.intervalMonths || '';
        Y.log('_checkSyncModelList changed model-attribute === '+YObject.keys(e.changed), 'info', 'Itsa-CalendarModelList');
        if (e.changed[modelconfigDate] || e.changed[modelconfigEnddate] || e.changed[modelconfigCount] || e.changed[modelconfigIntervalMinutes]
            || e.changed[modelconfigIntervalHours] || e.changed[modelconfigIntervalDays] || e.changed[modelconfigIntervalMonths]) {
            Y.log('_checkSyncModelList continues: Date-attribute is changed', 'info', 'Itsa-CalendarModelList');
            if (instance.get('rendered')) {
                instance._doSyncModelList();
            }
            else {
                instance._afterRenderEvent = instance.after(
                    'render',
                    Y.bind(instance._doSyncModelList, instance)
                );
            }
        }
        else {
            Y.log('_checkSyncModelList does not continue: Date-attribute is not changed', 'info', 'Itsa-CalendarModelList');
        }
    },

    /**
     * Will call _doSyncModelList, but waits until the Calendar is rendered.
     *
     * @method _syncModelList
     * @param {EventTarget} e
     * @param {EventTarget} [attrmodellist] for internal use: when coming from _setModelList
     * it holds the new value for modelList
     * @param {EventTarget} [attrmodelconfig] for internal use: when coming from _setModelConfig
     * it holds the new value for modelConfig
     * @private
     * @since 3.8.1
     */
    _syncModelList : function (e, attrmodellist, attrmodelconfig) {
        var instance = this;
        Y.log('_syncModelList', 'info', 'Itsa-CalendarModelList');
        if (instance.get('rendered')) {
            instance._doSyncModelList(attrmodellist, attrmodelconfig);
        }
        else {
            instance._afterRenderEvent = instance.after(
                'render',
                Y.bind(instance._doSyncModelList, instance, attrmodellist, attrmodelconfig)
            );
        }
    },

    /**
     * Syncs the modelList with Calendar using the attributes defined in modelConfig.
     *
     * @method _doSyncModelList
     * @param {EventTarget} [attrmodellist] for internal use: when coming from _setModelList
     * it holds the new value for modelList
     * @param {EventTarget} [attrmodelconfig] for internal use: when coming from _setModelConfig
     * it holds the new value for modelConfig
     * @private
     * @since 3.8.1
     */
    _doSyncModelList : function (attrmodellist, attrmodelconfig) {
        var instance = this,
            modellist = attrmodellist || instance.get('modelList'),
            modelconfig = attrmodelconfig || instance.get('modelConfig') || {},
            attrDate = modelconfig.date,
            attrEnddate = modelconfig.enddate,
            attrCount = modelconfig.count,
            attrIntervalMinutes = modelconfig.intervalMinutes,
            attrIntervalHours = modelconfig.intervalHours,
            attrIntervalDays = modelconfig.intervalDays,
            attrIntervalMonths = modelconfig.intervalMonths,
            dates = [],
            modelfunc, pushDate, i, prevDate, prevCount;

        Y.log('_doSyncModelList', 'info', 'Itsa-CalendarModelList');
        instance.clearMarkedDates(modellist && attrDate);
        prevCount = YObject.size(instance._storedModelDates);
        instance._storedModelDates = {};
        if (modellist && attrDate) {
            // I choosed to split it up in 4 scenario's. This is a bit more code, but it makes runtime faster when
            // an easier configuration is used (probably most of the cases)
            if (!attrEnddate && !attrCount) {
                Y.log('_doSyncModelList will sync only the startdates without interval', 'info', 'Itsa-CalendarModelList');
                modelfunc = function(model) {
                    var modelDate = model.get(attrDate);
                    if (dateIsValid(modelDate)) {
                        dates.push(modelDate);
                        instance._storeModelDate(model, modelDate);
                    }
                };
            }
            else if (attrEnddate && !attrCount) {
                Y.log('_doSyncModelList will sync startdates and enddates without interval', 'info', 'Itsa-CalendarModelList');
                modelfunc = function(model) {
                    var modelDate = model.get(attrDate),
                        modelEndDate = model.get(attrEnddate) || modelDate;
                    if (dateIsValid(modelDate)) {
                        if (!dateIsValid(modelEndDate)) {
                            modelEndDate = modelDate;
                        }
                        pushDate = dateCopyObject(modelDate);
                        do {
                            dates.push(dateCopyObject(pushDate));
                            instance._storeModelDate(model, pushDate);
                            dateAddDays(pushDate, 1);
                        }
                        while (dayisGreaterOrEqual(modelEndDate, pushDate));
                    }
                };
            }
            else if (!attrEnddate && attrCount) {
                Y.log('_doSyncModelList will sync only the startdates with intervals', 'info', 'Itsa-CalendarModelList');
                modelfunc = function(model) {
                    var modelDate = model.get(attrDate),
                        modelCount = model.get(attrCount) || 1,
                        modelIntervalMinutes = (attrIntervalMinutes && model.get(attrIntervalMinutes)),
                        modelIntervalHours = (attrIntervalHours && model.get(attrIntervalHours)),
                        modelIntervalDays = (attrIntervalDays && model.get(attrIntervalDays)),
                        modelIntervalMonths = (attrIntervalMonths && model.get(attrIntervalMonths)),
                        stepMinutes;
                    if (dateIsValid(modelDate)) {
                        if (!Lang.isNumber(modelCount)) {
                            modelCount = 1;
                        }
                        if (!Lang.isNumber(modelIntervalMinutes)) {
                            modelIntervalMinutes = 0;
                        }
                        if (!Lang.isNumber(modelIntervalHours)) {
                            modelIntervalHours = 0;
                        }
                        if (!Lang.isNumber(modelIntervalDays)) {
                            modelIntervalDays = 0;
                        }
                        if (!Lang.isNumber(modelIntervalMonths)) {
                            modelIntervalMonths = 0;
                        }
                        stepMinutes = (1440*modelIntervalDays) + (60*modelIntervalHours) + modelIntervalMinutes;
                        if ((stepMinutes===0) && (modelIntervalMonths===0)) {
                            stepMinutes = 1440;
                        }
                        pushDate = dateCopyObject(modelDate);
                        prevDate = new Date(0);
                        for (i=0; i<modelCount; i++) {
                            if (!dateEqualDays(pushDate, prevDate)) {
                                dates.push(dateCopyObject(pushDate));
                                instance._storeModelDate(model, pushDate);
                            }
                            dateCopyValues(pushDate, prevDate);
                            if (stepMinutes>0) {
                                dateAddMinutes(pushDate, stepMinutes);
                            }
                            if (modelIntervalMonths>0) {
                                dateAddMonths(pushDate, modelIntervalMonths);
                            }
                        }
                    }
                };
            }
            else if (attrEnddate && attrCount) {
                Y.log('_doSyncModelList will sync startdates and enddates with intervals', 'info', 'Itsa-CalendarModelList');
                // Make pushDate a Date object, so we can copy Date-values to it
                pushDate = new Date(0);
                modelfunc = function(model) {
                    var modelDate = model.get(attrDate),
                        modelEndDate = model.get(attrEnddate) || modelDate,
                        modelCount = model.get(attrCount) || 1,
                        modelIntervalMinutes = (attrIntervalMinutes && model.get(attrIntervalMinutes)),
                        modelIntervalHours = (attrIntervalHours && model.get(attrIntervalHours)),
                        modelIntervalDays = (attrIntervalDays && model.get(attrIntervalDays)),
                        modelIntervalMonths = (attrIntervalMonths && model.get(attrIntervalMonths)),
                        stepMinutes, startPushDate, endPushDate;
                    if (dateIsValid(modelDate)) {
                        if (!dateIsValid(modelEndDate)) {
                            modelEndDate = modelDate;
                        }
                        if (!Lang.isNumber(modelCount)) {
                            modelCount = 1;
                        }
                        if (!Lang.isNumber(modelIntervalMinutes)) {
                            modelIntervalMinutes = 0;
                        }
                        if (!Lang.isNumber(modelIntervalHours)) {
                            modelIntervalHours = 0;
                        }
                        if (!Lang.isNumber(modelIntervalDays)) {
                            modelIntervalDays = 0;
                        }
                        if (!Lang.isNumber(modelIntervalMonths)) {
                            modelIntervalMonths = 0;
                        }
                        stepMinutes = (1440*modelIntervalDays) + (60*modelIntervalHours) + modelIntervalMinutes;
                        if ((stepMinutes===0) && (modelIntervalMonths===0)) {
                            stepMinutes = 1440;
                        }
                        startPushDate = dateCopyObject(modelDate);
                        endPushDate = dateCopyObject(modelEndDate);
                        prevDate = new Date(0);
                        for (i=0; i<modelCount; i++) {
                            dateCopyValues(startPushDate, pushDate);
                            do {
                                if (dayisGreater(pushDate, prevDate)) {
                                    dates.push(dateCopyObject(pushDate));
                                    instance._storeModelDate(model, pushDate);
                                }
                                dateAddDays(pushDate, 1);
                            }
                            while (dayisGreaterOrEqual(endPushDate, pushDate));
                            dateCopyValues(pushDate, prevDate);
                            // correct prevDate --> because pushDate has been added 1 day that has not been handled
                            dateAddDays(prevDate, -1);
                            if (stepMinutes>0) {
                                dateAddMinutes(startPushDate, stepMinutes);
                                dateAddMinutes(endPushDate, stepMinutes);
                            }
                            if (modelIntervalMonths>0) {
                                dateAddMonths(startPushDate, modelIntervalMonths);
                                dateAddMonths(endPushDate, modelIntervalMonths);
                            }
                        }
                    }
                };
            }
            modellist.each(modelfunc);
            Y.log('_doSyncModelList will mark '+dates.length+' dates', 'info', 'Itsa-CalendarModelList');
            instance.markDates(dates);
            instance._fireSelectedModels();
        }
        else {
            if (prevCount>0) {
                instance._fireSelectedModels();
            }
            Y.log('_doSyncModelList cannot mark any dates:' + (modellist ? '' : ' attribute modelList is undefined')
                  + (attrDate ? '' : ' attribute modelConfig.date is undefined'), 'warn', 'Itsa-CalendarModelList');
        }
    },

    /**
     * Stores the model in an internal object: _storedModelDates
     * _storedModelDates is used to retrieve the models when a date is selected. Every model could
     * mark multiple Dates in case they have an <i>interval</i> set and/or in case an <i>enddate</i> is available.
     *
     * @method _storeModelDate
     * @param {Y.Model} model The model to store
     * @param {Date} oDate The Date that the model should mark the Calendar
     * @private
     * @since 3.8.1
     */
    _storeModelDate : function(model, oDate) {
        var instance = this,
            year = oDate.getFullYear(),
            month = oDate.getMonth(),
            day = oDate.getDate();

        Y.log('_storeModelDate', 'info', 'Itsa-CalendarModelList');
        if (!hasKey(instance._storedModelDates, year)) {
            instance._storedModelDates[year] = {};
        }
        if (!hasKey(instance._storedModelDates[year], month)) {
            instance._storedModelDates[year][month] = {};
        }
        if (!hasKey(instance._storedModelDates[year][month], day)) {
            // define as an Array, NOT an object --> needs to be filled with Models
            instance._storedModelDates[year][month][day] = [];
        }
        instance._storedModelDates[year][month][day].push(model);
    },

    /**
     * A utility method that fires the selected Models on a selectionChange event or when syncing the modelList.
     *
     * @method _fireSelectedModels
     * @param {eventTarget} [e] The eventTarget after a selectionChange
     * @private
     * @since 3.8.1
     */
    _fireSelectedModels : function (e) {
        var instance = this;

        Y.log('_fireSelectedModels', 'info', 'Itsa-CalendarModelList');
        /**
         * Is fired when the user changes the dateselection. In case multiple Dates are selected and the same Model is
         * available in more than one Date: the Model is only once in the resultarray. Meaning: only unique Models are returned.
         * @event modelSelectionChange
         * @param {Array} newModelSelection contains [Models] with all modelList's Models who match the selected date(s)
         * @since 3.8.1
        **/
        instance.fire("modelSelectionChange", {newModelSelection: instance._getSelectedModelList(e)});
    },

    /**
     * Retrieves the unique Models that are available in the selectedDates.
     *
     * @method _getSelectedModelList
     * @param {eventTarget} [e] The eventTarget after a selectionChange. When not provided, the attribute 'selectedDates' is taken.
     * @private
     * @protected
     * @return {Array} Unique list of Models that are present in selectedDates
     * @since 3.8.1
     */
    _getSelectedModelList : function(e) {
        var instance = this,
            dateselection = (e && e.newSelection) || instance.get('selectedDates'),
            modelArray = [];

        Y.log('_getSelectedModelList', 'info', 'Itsa-CalendarModelList');
        YArray.each(
            dateselection,
            function(oDate) {
                // e.validateDate is undefined when comes from event --> in that case we always are sure
                // the array consist only Date-objects
                if ((e && !e.validateDate) || YDate.isValidDate(oDate)) {
                    var year = oDate.getFullYear(),
                        month = oDate.getMonth(),
                        day = oDate.getDate(),
                        modelArrayDay = (instance._storedModelDates[year] && instance._storedModelDates[year][month]
                                        && instance._storedModelDates[year][month][day]) || [];
                    YArray.each(
                        modelArrayDay,
                        function(model) {
                            if (YArray.indexOf(modelArray, model) === -1) {
                                modelArray.push(model);
                            }
                        }
                    );
                }
            }
        );
        return modelArray;
    }

}, true);

Y.Calendar.ITSACalendarModelList = ITSACalendarModelList;

Y.Base.mix(Y.Calendar, [ITSACalendarModelList]);