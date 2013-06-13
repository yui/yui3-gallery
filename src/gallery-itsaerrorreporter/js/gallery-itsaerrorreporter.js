'use strict';

/**
 * This module full automaticly reports error-events by poping up an error-dialog.
 *
 * By default it listens to both error-events and error-loggings. Both can be (un)set.
 *
 *
 * @module gallery-itsaerrorreporter
 * @class Y.ITSAErrorReporter
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var ERROR = 'error',
      BOOLEAN = 'boolean',
      UNDEFINED_ERROR = 'undefined error',
      errorReporterInstance;

function ITSAErrorReporter() {}

if (!Y.Global.ITSAErrorReporter) {

    Y.mix(ITSAErrorReporter.prototype, {

        /**
         * Sets or unsets the reporter for 'error'-events.
         *
         * @method reportErrorEvents
         * @param [activate] {boolean} to set or unset the reporter
         * @since 0.1
        */
        reportErrorEvents : function(activate) {
            Y.log('reportErrorEvents '+activate, 'info', 'Itsa-ErrorReporter');
            var instance = this,
                  active = (typeof activate===BOOLEAN) ? activate : true;
            if (active && !instance._reportErrorEvents) {
                instance._reportErrorEvents = Y.after(
                    [ERROR, '*:'+ERROR],
                    function(e) {
                        var err = e.err || e.error || e.msg || e.message || UNDEFINED_ERROR,
                              src = e.src || e.source;
                        Y.alert(src, err, {type: ERROR});
                    }
                );
            }
            else if (!active && instance._reportErrorEvents) {
                instance._reportErrorEvents.detach();
                instance._reportErrorEvents = null;
            }
        },

        /**
         * Sets or unsets the reporter for 'error'-logs.
         *
         * @method reportErrorLogs
         * @param [activate] {boolean} to set or unset the reporter
         * @since 0.1
        */
        reportErrorLogs : function(activate) {
            Y.log('reportErrorLogs '+activate, 'info', 'Itsa-ErrorReporter');
            var instance = this,
                  active = (typeof activate===BOOLEAN) ? activate : true;
            if (active && !instance._reportErrorLogs) {
                instance._reportErrorLogs = Y.on(
                    'yui:log',
                    function(e) {
                        var err = e.msg,
                              cat = e.cat,
                              src = e.src;
                        if (cat===ERROR) {
                            Y.alert(src, err, {type: ERROR});
                        }
                    }
                );
            }
            else if (!active && instance._reportErrorLogs) {
                instance._reportErrorLogs.detach();
                instance._reportErrorLogs = null;
            }
        }

    });

    errorReporterInstance = Y.Global.ITSAErrorReporter = new ITSAErrorReporter();
    errorReporterInstance.reportErrorEvents();
    errorReporterInstance.reportErrorLogs();

}

Y.ITSAErrorReporter = Y.Global.ITSAErrorReporter;