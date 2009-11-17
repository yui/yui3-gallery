/**
     * @namespace Validator
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * This is a button object that will represent a button that is controlled
     * by the form validator.  The buttons only function will be to enable and disable
     * depending on the validity of the data entered on the form.
     * @class Button
     */
    /**
     * @constructor
     * This will initialize the button with the given configuration
     * @param {Object} config Configuration for the button that will be applied to the properties of the button (Probably just a button el)
     */
    function _Button(config){
        _Button.superclass.constructor.apply(this,arguments);
    }
    _Button.ATTRS = {
        /**
         * This is the button that will be enable/disabled by the form validator
         * @property buttonEl
         * @type {HTMLElement}
         */
        buttonEl:{
            value:null,
            setter:function(el){
                var rtVl = el;
                if (YL.isString(el)){
                    rtVl = Y.DOM.byId(el);
                }
                if (rtVl === null || rtVl === undefined){
                    throw 'Invalid button: Button with id ' + el + ' does not exist';
                }
                return rtVl;
            }
        }
    };
    _Button.NAME = 'Button';
    Y.extend(_Button,Y.Base,{
        /**
         * This will enable the button
         * @method enable
         */
        enable:function(){
            this.get('buttonEl').disabled = false;
        },
        /**
         * This will disable the button
         * @method disable
         */
        disable:function(){
            this.get('buttonEl').disabled = true;
        }
    });
    Y.Button = _Button;