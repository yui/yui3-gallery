Y.FormButton = Y.Base.create('button-field', Y.FormField, [Y.WidgetChild], {

    FIELD_TEMPLATE : '<button></button>',
    LABEL_TEMPLATE: '',

    _syncFieldNode : function () {
        this._fieldNode.setAttrs({
            innerHTML : this.get('label'),
            id : this.get('id') + Y.FormField.FIELD_ID_SUFFIX
        });
        
        this.get('contentBox').addClass('first-child');
    },

    _setClickHandler : function () {
        if (!this._fieldNode) {
            return;
        }

        Y.Event.purgeElement(this._fieldNode, true, 'click');
        Y.on('click', Y.bind(this._promptConfirm, this), this._fieldNode);
    },

    _promptConfirm: function(event) {
        event.preventDefault();
        var message = this.get("message"),
            onclick = this.get("onclick");

        if (message) {
            if (!this.get("confirm")(message)) {
                return;
            }
        }
        onclick.fn.apply(onclick.scope);
    },

    bindUI : function () {
        this.after('onclickChange', Y.bind(this._setClickHandler, this, true));
        this.after('disabledChange', this._syncDisabled, this);
        this._setClickHandler();
    }
}, {
    ATTRS : {
        onclick : {
            validator : function (val) {
                if (Y.Lang.isObject(val) === false) {
                    return false;
                }
                if (typeof val.fn == 'undefined' ||
                    Y.Lang.isFunction(val.fn) === false) {
                    return false;
                }
                return true;
            },
            value : {
                fn : function (e) {

                }
            },
            setter : function (val) {
                val.scope = val.scope || this;
                val.argument = val.argument || {};
                return val;
            }
        },

        /** 
         * @attribute message
         * @type String
         * @default null
         * @description Optional confirmation message to be passed to the
         *     confirm function.
         */
        message: {
            validator : Y.Lang.isString,
            value: null
        },

        /** 
         * @attribute confirm
         * @type Function
         * @default null
         * @description Optional confirmation function called when the button
         *     is clicked. It will be be passed the string set in the 'message'
         *     attribute. If it returns 'true' the the onclick handler will be
         *     called, otherwise it will be skipped.
         */
        confirm:  {
            validator : Y.Lang.isFunction,
            value: null
        }
    }
});
