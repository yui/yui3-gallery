/**
 * @class CheckboxField
 * @extends FormField
 * @param config {Object} Configuration object
 * @constructor
 * @description A checkbox field node
 */

Y.CheckboxField = Y.Base.create('checkbox-field', Y.FormField, [Y.WidgetChild], {
    _syncChecked : function () {
        this._fieldNode.set('checked', this.get('checked'));
    },

    initializer : function () {
        Y.CheckboxField.superclass.initializer.apply(this, arguments);
    },

    renderUI : function () {
        this._renderFieldNode();
        this._renderLabelNode();
    },

    syncUI : function () {
        Y.CheckboxField.superclass.syncUI.apply(this, arguments);
        this._syncChecked();
    },

    bindUI :function () {
        Y.CheckboxField.superclass.bindUI.apply(this, arguments);
        this.after('checkedChange', Y.bind(function(e) {
            if (e.src != 'ui') {
                this._fieldNode.set('checked', e.newVal);
            }
        }, this));

        this._fieldNode.after('change', Y.bind(function (e) {
            this.set('checked', e.currentTarget.get('checked'), {src : 'ui'});
        }, this));
    }
}, {
    ATTRS : {
        'checked' : {
            value : false,
            validator : Y.Lang.isBoolean
        }
    }
});
