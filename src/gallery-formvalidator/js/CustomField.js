/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This is a catch all class for types of input that do not fit the existing input types.
     * @class CustomField
     * @extends BaseInputField
     */
    /**
     * @constructor
     * Takes the given configuration and initializes the input field's properties.
     */
    function _CustomField(config){
        _CustomField.superclass.constructor.apply(this,arguments);
    }
    _CustomField.ATTRS = {
        /**
         * This will be an object that can optionally implement all the
         * functions used by an input field.  This can also be a function, which
         * retrieves the object, or a string, which can be the name of an instance
         * object or function call to retreive it.
         * @property emptyValue
         * @type {Object}
         */
        validatorObject:{
            setter:function(val){
                if (val === null || val === undefined){
                    throw 'You must provide a validator object to the custom input';
                }
                var rtVl = null;
                if (YL.isString(val)){
                    rtVl = validatorGlobal[val];//eval(val);
                }
                else if (YL.isFunction(val)){
                    rtVl = val();
                }
                else if (YL.isObject(val)){
                    rtVl = val;
                }

                if (rtVl === null || rtVl === undefined){
                    throw 'Your validator object must be a object';
                }
                else{
                    return rtVl;
                }
            }
        },
        /**
         * Property that can be optional set for the custom input for looking up the object
         */
        id:{
            value:null
        }
    };
    _CustomField.NAME = 'CustomField';
    Y.extend(_CustomField,Y.BaseInputField,{
        /**
         * This will ensure the proper dom is showing to indicate
         * that the input is valid or invalid.
         * @method checkIndicators
         * @return {boolean} True if input is valid
         */
        checkIndicators:function(){
            var correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');
            if (this.isValid()){
                if (correctIndicator !== null && correctIndicator !== undefined){
                    correctIndicator.style.display = '';
                }
                if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                    incorrectIndicator.style.display = 'none';
                }
                return true;
            }
            else{
                if (correctIndicator !== null && correctIndicator !== undefined){
                    correctIndicator.style.display = 'none';
                }
                if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                    incorrectIndicator.style.display = '';
                }
                return false;
            }
        },
        /**
         * If the id is set, that value will be returned.  If not, then it will
         * see if the validator object
         * @method getId
         * @return {String} id The id that was set to the custom validator on initialization.
         */
        getId:function(){
            var rtVl = this.get('id');
            if (rtVl === null || rtVl === undefined){
                rtVl = this.executeFunction('getId',null);
            }
            return rtVl;
        },
        /**
         * This will execute the function with the specified name on the validator object
         * @method executeFunction
         * @private
         * @return {Object} value returned from the function call
         */
        executeFunction:function(name,defaultReturn){
            var obj = this.get('validatorObject');
            if (YL.isFunction(obj[name])){
                return obj[name]();
            }
            return defaultReturn;
        },
        /**
         * This will execute the function with the given name with the assumption it returns nothing
         * @method executeVoidFunction
         * @private
         */
        executeVoidFunction:function(name){
            var obj = this.get('validatorObject');
            if (YL.isFunction(obj[name])){
                obj[name]();
            }
        },
        /**
         * Calls the disable function on the custom validator object if it exists.
         * @method disable
         */
        disable:function(){
            _CustomField.superclass.disable.call(this);
            this.executeVoidFunction('disable');
        },
        /**
         * Calls the enable function on the custom validator object if it exists.
         * @method enable
         */
        enable:function(){
            _CustomField.superclass.enable.call(this);
            this.executeVoidFunction('enable');
        },
        /**
         * Calls the turnOff function on the custom validator object if it exists.
         * @method turnOff
         */
        turnOff:function(){
            _CustomField.superclass.turnOff.call(this);
            this.executeVoidFunction('turnOff');
        },
        /**
         * Calls the turnOn function on the custom validator object if it exists.
         * @method turnOn
         */
        turnOn:function(){
            _CustomField.superclass.turnOn.call(this);
            this.executeVoidFunction('turnOn');
        },
        /**
         * Calls the clear function on the custom validator object if it exists.
         * @method clear
         * @param {boolean} silent True if the clear action will not invoke an on change event.
         */
        clear:function(silent){
            var obj = this.get('validatorObject');
            if (YL.isFunction(obj.clear)){
                obj.clear(silent);
            }
            if (silent !== true){
                this._evtOnChange();
            }
        },
        /**
         * Executs the custom validator object's isEmpty function
         * @return {boolean} returns what the validator object's empty function returns.
         */
        isEmpty:function(){
            return this.executeFunction('isEmpty',false);
        },
        /**
         * Returns true if the value selected in the dom doesn't match the value
         * set for the emptyValue property.
         * @return {boolean} false if the value in the select input matches the specified empty value
         */
        isValid:function(){
            return this.executeFunction('isValid',false);
        },
        /**
         * This will call the insertBeside function on the validator Object if it exists.  It will
         * pass the dom object that is to be inserted.
         * @method insertBeside
         * @param {HTMLElement} el DOM object to be insert beside the main input.
         */
        insertBeside:function(el) {
            var obj = this.get('validatorObject');
            if (YL.isFunction(obj.insertBeside)){
                obj.insertBeside(el);
            }
        }
    });
    Y.CustomField = _CustomField;