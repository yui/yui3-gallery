function Button () {
    Button.superclass.constructor.apply(this,arguments);
}

Y.mix(Button, {
    NAME : 'button',
    
    HTML_PARSER : {
        
    },

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
        }
    },

    NODE_TEMPLATE : '<button></button>'
});

Y.extend(Button, Y.FormField, {
    _renderButtonNode : function () {
        var contentBox = this.get('contentBox'), bn;
        
        bn = Y.Node.create(Button.NODE_TEMPLATE);
        contentBox.appendChild(bn);
        this._fieldNode = bn;
    },

	_syncLabelNode: function () {},

	_syncFieldNode : function () {
		this._fieldNode.setAttrs({
            innerHTML : this.get('label'),
            id : this.get('id')
        });
        
        this.get('contentBox').addClass('first-child');
	},

	_setClickHandler : function () {
		if (!this._fieldNode) {
			return;
		}

		var oc = this.get('onclick');
		Y.Event.purgeElement(this._fieldNode, true, 'click');
		Y.on('click', Y.bind(oc.fn, oc.scope, true), this._fieldNode);
	},

	renderUI : function () {
		this._renderButtonNode();
	},

	bindUI : function () {
		this.after('onclickChange', Y.bind(this._setClickHandler, this, true));
		this._setClickHandler();
	}
});

Y.Button = Button;
