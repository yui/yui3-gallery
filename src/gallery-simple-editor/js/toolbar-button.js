
    /**
     * @description <p>Creates a basic custom Toolbar Button. Primarily used with the Rich Text Editor's Toolbar</p><p>Provides a toolbar button based on the button and menu widgets, &lt;select&gt; elements are used in place of menu's.</p>
     * @class ToolbarButton
     * @namespace YAHOO.widget
     * @requires yahoo, dom, element, event
     * @extends YAHOO.util.Element
     * 
     * 
     * @constructor
     * @param {String/HTMLElement} el The element to turn into a button.
     * @param {Object} attrs Object liternal containing configuration parameters.
    */

    var ToolbarButton = function() {
        Y.log('ToolbarButton Initalizing', 'info', 'ToolbarButton');
        ToolbarButton.superclass.constructor.apply(this, arguments);
    };

    ToolbarButton.NAME = 'ToolbarButton';

    ToolbarButton.ATTRS = {
        node: {
            setter: function(node) {
                var n = Y.get(node);
                if (!n) {
                    Y.error('Invalid Node Given: ' + node);
                } else {
                    n = n.item(0);
                }
                return n;
            }
        },
        id: {
        },
        /**
        * @attribute value
        * @description The value of the button
        * @type String
        */            
        value: {
        },
        /**
        * @attribute menu
        * @description The menu attribute, see YAHOO.widget.Button
        * @type Object
        */            
        menu: {
            value: false
        },
        /**
        * @attribute type
        * @description The type of button to create: push, menu, color, select, spin
        * @type String
        */            
        type: {
            value: 'push',
            writeOnce: true
        },
        /**
        * @attribute disabled
        * @description Set the button into a disabled state
        * @type String
        */            
        disabled: {
            value: false,
            setter: function(disabled) {
                if (disabled) {
                    this.get('node').addClass('yui-button-disabled');
                    this.get('node').addClass('yui-' + this.get('type') + '-button-disabled');
                } else {
                    this.get('node').removeClass('yui-button-disabled');
                    this.get('node').removeClass('yui-' + this.get('type') + '-button-disabled');
                }
                //console.log(this.get('node'), ': ', disabled);
                if (this.get('type') == 'select') {
                    this.get('node').set('disabled', disabled);
                }
            }
        },
        /**
        * @attribute label
        * @description The text label for the button
        * @type String
        */            
        label: {
            value: 'LABEL',
            setter: function(label) {
                if (this.get('type') == 'push') {
                    this.get('node').query('a').set('innerHTML', label);
                }
            }
        },
        /**
        * @attribute title
        * @description The title of the button
        * @type String
        */            
        title: {
            value: 'TITLE',
            setter: function(title) {
                this.get('node').set('title', title);
            }
        },

        /**
        * @config container
        * @description The container that the button is rendered to, handled by Toolbar
        * @type String
        */            
        container: {
            value: null,
            writeOnce: true,
            setter: function(node) {
                var n = Y.get(node);
                if (!n) {
                    Y.error('Invalid Node Given: ' + node);
                } else {
                    n = n.item(0);
                }
                return n;
            }
        }
    };

    Y.extend(ToolbarButton, Y.Base, {
        /**
        * @property buttonType
        * @private
        * @description Tells if the Button is a Rich Button or a Simple Button
        */
        buttonType: 'normal',
        /**
        * @method _handleMouseOver
        * @private
        * @description Adds classes to the button elements on mouseover (hover)
        */
        _handleMouseOver: function() {
            if (!this.get('disabled')) {
                this.get('node').addClass('yui-button-hover');
                this.get('node').addClass('yui-' + this.get('type') + '-button-hover');
            }
        },
        /**
        * @method _handleMouseOut
        * @private
        * @description Removes classes from the button elements on mouseout (hover)
        */
        _handleMouseOut: function() {
            this.get('node').removeClass('yui-button-hover');
            this.get('node').removeClass('yui-' + this.get('type') + '-button-hover');
        },
        /**
        * @method checkValue
        * @param {String} value The value of the option that we want to mark as selected
        * @description Select an option by value
        */
        checkValue: function(value) {
            if (this.get('type') == 'select') {
                var opt = this.get('node').get('options');
                opt.each(function(n, k) {
                    if (n.get('value') == value) {
                        this.get('node').set('selectedIndex', k);
                    }
                }, this);
            }
        },
        /** 
        * @method initializer
        * @description The ToolbarButton class's initialization method
        */        
        initializer: function() {
            var id, i, el, menu, opt, html;
            switch (this.get('type')) {
                case 'select':
                case 'menu':
                    el = Y.Node.create('<select></select>');
                    menu = this.get('menu');

                    for (i = 0; i < menu.length; i++) {
                        opt = Y.Node.create('<option value="' + ((menu[i].value) ? menu[i].value : menu[i].text) + '">' + menu[i].text + '</option>');
                        el.appendChild(opt);
                        if (menu[i].checked) {
                            opt.set('selected', true);
                        }
                    }
                    el.on('change', Y.bind(this._handleSelect, this));
                    id = Y.stamp(el);
                    el.set('id', id);
                    this.set('node', el);
                    break;
                default:
                    html = '<span unselectable="on" class="yui-button yui-' + this.get('type') + '-button"><span class="first-child"><a href="#" tabIndex="-1" title=""></a></span></span>';
                    this.set('node', Y.Node.create(html));
                    this.get('node').on('mouseover', Y.bind(this._handleMouseOver, this));
                    this.get('node').on('mouseout', Y.bind(this._handleMouseOut, this));
                    break;
            }
            id = Y.stamp(this.get('node'));
            this.set('id', id);
            this.get('node').set('id', id);
            this.set('title', this.get('title'));
            this.set('label', this.get('label'));
            this.set('disabled', this.get('disabled'));
            this.get('container').appendChild(this.get('node'));

            this.get('node').on('click', Y.bind(function(e) {
                e.halt();
            }, this));
        },
        /** 
        * @private
        * @method _handleSelect
        * @description The event fired when a change event gets fired on a select element
        * @param {Event} ev The change event.
        */        
        _handleSelect: function(e) {
            this.fire('change', {type: 'change', value: e.target.get('value'), target: this.get('node') });
        },
        /** 
        * @method getMenu
        * @description A stub function to mimic YAHOO.widget.Button's getMenu method
        */        
        getMenu: function() {
            return this.get('menu');
        },
        destructor: function() {
        },
        /**
        * @method toString
        * @description Returns a string representing the toolbar.
        * @return {String}
        */        
        toString: function() {
            return 'Toolbar.Button (' + this.get('node').get('id') + ')';
        }
        
    });

    Y.namespace('Toolbar');
    Y.Toolbar.Button = ToolbarButton;

