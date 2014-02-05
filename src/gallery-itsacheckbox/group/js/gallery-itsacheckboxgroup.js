'use strict';

/*jshint maxlen:215 */

/**
 *
 * Extends Y.Model by adding methods through which they can create editable form-elements, which represent and are bound to the propery-value.
 * This model is for defining the UI-structure for all Model's properties and for firing model-events for
 * Y.ITSAFormModel does not rendering to the dom itself. That needs to be done by an Y.View-instance, like Y.ITSAViewModel.
 *
 * @module gallery-itsamessagecontroller
 * @extends Base
 * @class ITSAMessageController
 * @constructor
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var Lang = Y.Lang,
    YArray = Y.Array,
    YObject = Y.Object,
    CHECKED = 'checked',
    OPTIONS = 'options',
    CONTENTBOX = 'contentBox',
    CHANGE = 'Change',
    ITSA_WIDGET_PARENT = 'itsa-widget-parent';

function ITSACheckboxGroup() {
    ITSACheckboxGroup.superclass.constructor.apply(this, arguments);
}

ITSACheckboxGroup.NAME = 'itsacheckboxgroup';

ITSACheckboxGroup.CHECKBOX_TEMPLATE = '<div class="pure-control-group" data-focusable="true" data-type="itsacheckbox" data-modelattribute="true" data-formelement="true">'+
                                      '<label data-widgetlabel="true">{option}</label>{checkbox}</div>';

ITSACheckboxGroup.ATTRS = {

    /**
     * The config that is passed to all ITSACheckbox instances
     *
     * @attribute checkboxConfig
     * @type {Object}
     * @default null
     * @since 0.1
     */
    checkboxConfig: {
        value: null,
        validator: function(v){ return (v===null) || (typeof v==='object'); }
    },

    /**
     * The options that can be selected --> these are all the checkboxes that are created.<br>
     * To make them checked by default, the same values need to be set in the attribute 'checked'
     *
     * @attribute options
     * @type {Array} with String-fields which represent all checkboxes
     * @default []
     * @since 0.1
     */
    options: {
        value: [],
        validator: function(v){ return Lang.isArray(v); }
    },

    /**
     * Array with all the checked options. The Array is an Array of String-types which are present in 'options' and checked.
     *
     * @attribute checked
     * @type {Array}
     * @default []
     * @since 0.1
     */
    checked: {
        value: [],
        validator: function(v){ return Lang.isArray(v); }
    }

};


Y.ITSACheckboxGroup = Y.extend(ITSACheckboxGroup, Y.Widget);

/**
 * @method initializer
 * @protected
 * @since 0.1
*/
ITSACheckboxGroup.prototype.initializer = function() {
    Y.log('initializer', 'info', 'ITSACheckboxGroup');
    this._eventhandlers = [];
};

/**
 * @method renderUI
 * @since 0.1
*/
ITSACheckboxGroup.prototype.renderUI = function() {
    Y.log('renderUI', 'info', 'ITSACheckboxGroup');
    var instance = this,
        options = instance.get(OPTIONS),
        contentBox = instance.get(CONTENTBOX),
        checkboxConfig = instance.get('checkboxConfig') || {},
        checkboxNode, nodestring, checked, checkbox;

    checked = instance.get(CHECKED);
    // first set all array-values inside an object for quicker codehandling:
    instance._options = {};
    instance._checked = {};
    YArray.each(
        checked,
        function(onechecked) {
/*jshint expr:true */
            onechecked && (instance._checked[onechecked]=true);
/*jshint expr:false */
        }
    );
    YArray.each(
        options,
        function(option) {
            nodestring = Lang.sub(instance.constructor.CHECKBOX_TEMPLATE,
                                  {option: option, checkbox: '<div class="'+ITSA_WIDGET_PARENT+'"></div>'});
            checkboxNode = Y.Node.create(nodestring);
            contentBox.append(checkboxNode);
            checkboxConfig.boundingBox = checkboxNode.one('.'+ITSA_WIDGET_PARENT);
            checkboxConfig.checked = instance._checked[option] ? true : false;
            instance._options[option] = checkbox = new Y.ITSACheckbox(checkboxConfig);
            checkbox.render();
            checkbox.addTarget(instance);
        }
    );
};

/**
 * @method bindUI
 * @since 0.1
*/
ITSACheckboxGroup.prototype.bindUI = function() {
    var instance = this;
    instance._eventhandlers.push(
        instance.after(
            OPTIONS+CHANGE,
            Y.bind(instance._resetOptions, instance)
        )
    );
    instance._eventhandlers.push(
        instance.after(
            CHECKED+CHANGE,
            Y.bind(instance._resetChecked, instance)
        )
    );
    instance._eventhandlers.push(
        instance.after(
            '*:'+CHECKED+CHANGE,
            Y.bind(instance._setChecked, instance)
        )
    );
};

/**
 * Cleans up bindings
 * @method destructor
 * @protected
 * @since 0.1
*/
ITSACheckboxGroup.prototype.destructor = function() {
    Y.log('destructor', 'info', 'ITSACheckBox');
    var instance = this;

    instance._clearEventhandlers();
    instance._emptyContentBox();
};

//------------------------------------------------------------------------------
// --- private Methods ---------------------------------------------------------
//------------------------------------------------------------------------------

/**
 * Cleaning up all eventlisteners
 *
 * @method _clearEventhandlers
 * @private
 * @since 0.1
*/
ITSACheckboxGroup.prototype._clearEventhandlers = function() {
    Y.log('_clearEventhandlers', 'info', 'ITSACheckBox');
    YArray.each(
        this._eventhandlers,
        function(item){
            item.detach();
        }
    );
};

/**
 * @method _setChecked
 * @private
 * @since 0.1
*/
ITSACheckboxGroup.prototype._setChecked = function(e) {
    Y.log('_setChecked', 'info', 'ITSACheckboxGroup');
    var instance = this,
        typesplit = e.type.split(':'),
        checked = [];
    if ((typesplit[0]!==ITSACheckboxGroup.NAME) && !instance._fromReset) {
        YObject.each(
            instance._options,
            function(checkbox, option) {
    /*jshint expr:true */
                checkbox.get(CHECKED) && checked.push(option);
    /*jshint expr:false */
            }
        );
        instance._fromInternal = true;
        instance.set(CHECKED, checked);
    }
};

/**
 * @method _resetChecked
 * @private
 * @since 0.1
*/
ITSACheckboxGroup.prototype._resetChecked = function() {
    Y.log('_resetChecked', 'info', 'ITSACheckboxGroup');
    var instance = this,
        checked;
    if (instance._fromInternal) {
        instance._fromInternal = null;
    }
    else {
        checked = instance.get(CHECKED);
        instance._checked = {};
        YArray.each(
            checked,
            function(onechecked) {
    /*jshint expr:true */
                onechecked && (instance._checked[onechecked]=true);
    /*jshint expr:false */
            }
        );
        instance._fromReset = true;
        YObject.each(
            instance._options,
            function(checkbox, option) {
                var newchecked = instance._checked[option] ? true : false;
                checkbox.set(CHECKED, newchecked);
            }
        );
        Y.soon(function() {
            instance._fromReset = null;
        });
    }
};

/**
 * @method _resetOptions
 * @private
 * @since 0.1
*/
ITSACheckboxGroup.prototype._resetOptions = function() {
    Y.log('_resetOptions', 'info', 'ITSACheckboxGroup');
    var instance = this;
    YObject.each(
        instance._options,
        function(checkbox) {
            checkbox.destroy(true);
        }
    );
    instance._emptyContentBox();
    instance.renderUI();
};

/**
 * @method _emptyContentBox
 * @private
 * @protected
 * @since 0.1
*/
ITSACheckboxGroup.prototype._emptyContentBox = function() {
    Y.log('_emptyContentBox', 'info', 'ITSACheckboxGroup');
    var contentbox = this.get(CONTENTBOX);
    contentbox.get('childNodes').destroy(true);
    contentbox.empty(); // also call empty, for else the nodes are still in the DOM
};
