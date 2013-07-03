YUI.add('gallery-itsaerrorreporter', function (Y, NAME) {

'use strict';

/**
 * This module full automaticly reports error-events by poping up an error-dialog.
 *
 * By default it listens to window.onerror, broadcasted 'error'-events and error-loggings. All can be (un)set.
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
      JS_ERROR = 'javascript '+ERROR,
      BOOLEAN = 'boolean',
      UNDEFINED_ERROR = 'undefined error',
      errorReporterInstance;

function ITSAErrorReporter() {}

if (!Y.Global.ITSAErrorReporter) {

    Y.mix(ITSAErrorReporter.prototype, {

        /**
         * Handler for window.onerror.
         *
         * @method _handleWindowError
         * @param [activate] {boolean} to set or unset the reporter
         * @since 0.2
        */
        _handleWindowError : function(msg, url, line) {
            var instance = this;

            if (instance._reportWindowErrors) {
                  Y.alert(JS_ERROR, msg+'<br /><br />'+url+' (line '+line+')', {type: ERROR});
            }
        },

        /**
         * Sets or unsets the reporter for 'error'-events.
         *
         * @method reportErrorEvents
         * @param [activate] {boolean} to set or unset the reporter
         * @since 0.1
        */
        reportErrorEvents : function(activate) {
            var instance = this,
                  active = (typeof activate===BOOLEAN) ? activate : true;

            if (active && !instance._reportErrorEvents) {
                instance._reportErrorEvents = Y.after(
                    ['*:'+ERROR],
                    function(e) {
                        var err = e.err || e.error || e.msg || e.message || UNDEFINED_ERROR,
                              src = e.src || e.source;
                        // in case of err as an windows Error-object, we need to stransform the type to String:
                        err = err.toString();
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
        },

        /**
         * Sets or unsets the reporter for window.onerror.
         *
         * @method reportWindowErrors
         * @param [activate] {boolean} to set or unset the reporter
         * @since 0.2
        */
        reportWindowErrors : function(activate) {
            var active = (typeof activate===BOOLEAN) ? activate : true;

            this._reportWindowErrors = active;
        }

    });

    errorReporterInstance = Y.Global.ITSAErrorReporter = new ITSAErrorReporter();
    window.onerror = Y.bind(errorReporterInstance._handleWindowError, errorReporterInstance);
    errorReporterInstance.reportWindowErrors();
    errorReporterInstance.reportErrorEvents();
    errorReporterInstance.reportErrorLogs();

}

Y.ITSAErrorReporter = Y.Global.ITSAErrorReporter;

}, 'gallery-2013.07.03-22-52', {"requires": ["yui-base", "event-base", "event-custom-base", "gallery-itsadialog"]});
