"use strict";
/**
 * Extensions to the Column class to support QuickEdit.
 *
 * @class Column
 */

/**
 * Stores information for QuickEdit mode:  changed, copyDown, formatter, validation, fn, msg, regex.
 *
 * @attribute quickEdit
 * @type Object or boolean
 */
Y.Column.ATTRS.quickEdit =
{
};

/**
 * Formatter to be used during QuickEdit mode for read-only data.
 *
 * @attribute qeFormatter
 * @type Function
 */
Y.Column.ATTRS.qeFormatter =
{
    validator: Y.Lang.isFunction
};
