/**
     * @namespace Validator
     * This class is the text base input field and will be extended by all
     * Inputs who's values will be text based in anyway.  Examples include a number input,
     * select box or a text input.
     * @class TextBaseField
     * @extends BaseInputField
     */
    /**
     * @constructor
     * This will setup the text base field with the all the settings.  These settings
     * are contained in the config parameter
     * @param {Object} config Configuratino settings for the input.
     * @param {boolean} initialize Flag that says whether or not to call the initialize input function
     */
    function _TextBaseField(config,initialize){
        _TextBaseField.superclass.constructor.apply(this,arguments);
        // next the correct and incorrect indicators need to be setup.
        if (initialize){
            this.initializeInput();
        }
        this.get('textType');
    }
    _TextBaseField.ATTRS = {
        /**
         * This will state the maximum length of the string in the input.  This
         * value is 255 by default.
         * @property maxLength
         * @type Number
         */
        maxLength:{
            value:255,
            setter:function(val){
                if (val < 0){
                    return 255;
                }
                else{
                    return val;
                }
            }
        },
        /**
         * Formatter used for formatting the result typed into the text field.
         * This can be a function that takes the input text and returns it in a
         * desired format, or it could be an object that has a format function.
         * @property formatter
         * @type {Function|Object}
         */
        formatter:{
            value:null,
            setter:function(val){
                if (val === null || val === undefined){
                    return null;
                }
                if (YL.isFunction(val)){
                    return val;
                }
                else if (YL.isObject(val)){
                    if (val.format === null || val === undefined){
                        throw 'Formatter object must have a formatter function';
                    }
                    return val;
                }
                else{
                    throw 'Formatter must be an object or a function';
                }
            }
        },
        /**
         * Regular expression the input must match in order for the input to be correct.
         * If set to null, this is ignored in the isValid function.
         * @property regex
         * @type regex
         */
        regex:{
            value:null,
            setter:Y.BaseInputField.staticFunctions.standardRegexSetter
        },
        /**
         * This property is optional for those who wish to use the pre-canned regular expressions.
         * This can be set to any of the following types <br/>
         * <ul>
         *  <li>Email</li>
         *  <li>Phone</li>
         *  <li>CreditCard</li>
         *  <li>Zipcode</li>
         *  <li>Postalcode</li>
         * </ul>
         * @property textType
         * @type string
         */
        textType:{
            lazy:false,
            value:null,
            setter:function(val){
                if (val === null || val === undefined){
                    return null;
                }
                else if (val.toLowerCase() == 'email'){
                    this.set('regex',Y.BaseInputField.staticVariables.EMAILREGEX);
                }
                else if (val.toLowerCase() == 'phone'){
                    this.set('regex',/^([(]?[2-9]\d{2}[)]?)[ ]*-?[ ]*(\d{3})[ ]*-?[ ]*(\d{4})$/);
                }
                else if (val.toLowerCase() == 'creditcard'){
                    this.set('regex',/[0-9]{4} {0,1}[0-9]{4} {0,1}[0-9]{4} {0,1}[0-9]{4}/);
                }
                else if (val.toLowerCase() == 'zipcode'){
                    this.set('regex',/^(\d{5})([\s]*-[\s]*\d{4})?$/);
                }
                else if (val.toLowerCase() == 'postalcode'){
                    this.set('regex',/^[a-zA-Z]{1}[0-9]{1}[a-zA-Z]{1}[\s]*[0-9]{1}[a-zA-Z]{1}[0-9]{1}$/);
                }
                return val;
            }
        },
        /**
         * This is the main input DOM that the validator will check input on.
         * @property inputDOM
         * @type HTMLElement
         */
        inputDOM:{
            value:null,
            setter:Y.BaseInputField.staticFunctions.standardElSetter
        }
    };
    _TextBaseField.NAME = 'TextBaseField';
    Y.extend(_TextBaseField,Y.BaseInputField,{
        /**
         * This will setup the indicators for the input
         * @method initializeInput
         */
        initializeInput:function(){
            this.setupIndicators();
        },
        /**
         * This will reset the text field to ''
         * @method clear
         * @param {boolean} silent Set to true if you do not want the clear to invoke a form validator change event.
         */
        clear:function(silent){
            this.get('inputDOM').value = '';
            if (silent !== true){
                this._evtOnChange();
            }
        },
        /**
         * This will return the dom that represents the input.
         * @method getInputDOM
         * @return {HTMLElement} input dom for this field.
         */
        getInputDOM:function(){return this.get('inputDOM');},
        /**
         * This will disable the input.
         * @method disable
         */
        disable:function(){
            _TextBaseField.superclass.disable.call(this);
            this.get('inputDOM').disabled = true;
        },
        /**
         * This will enable the input.
         * @method enable
         */
        enable:function(){
            _TextBaseField.superclass.enable.call(this);
            this.get('inputDOM').disabled = false;
        },
        /**
         * Returns true only if the input is not empty, and it is not longer than the maximum length setting
         * @method isValid
         * @return {boolean} true if the input is not empty, and it is not longer than the maximum length setting
         */
        isValid:function(){
            if (!this.get('isOn')){
                return true; // is always valid if off
            }
            if (this.get('optional') && this.isEmpty()){
                return true;
            }
            var regex = this.get('regex'),
            value = this.get('inputDOM').value;
            if ((regex !== null && regex !== undefined) && (!regex.test(value))){
                return false; // return false if the value does not match the format of the set regular expression
            }
            return !this.isEmpty() && value.length <= this.get('maxLength');
        },
        /**
         * Returns the id of the input dom
         * @method getId
         * @return {string} id of the input dom.
         */
        getId:function(){
            return this.get('inputDOM').id;
        },
        /**
         * Returns true if the input dom has an empty string value.
         * @method isEmpty
         * @return {boolean} true if the input is not ''
         */
        isEmpty:function(){
            return (this.get('inputDOM').value === '');
        },
        /**
         * This will ensure the input is formatted as desired using the formatter, but only
         * if the input is valid.  If it does not match the regular expression, this will not call
         * the format method/object's format method.
         * @method checkFormat
         */
        checkFormat:function(){
            if (!this.isValid()){
                return; // input has to be valid first
            }
            if (!this.inputIsOn()){
                return; // if its off, who cares
            }
            var formatter = this.get('formatter'),inputDOM;
            if (formatter === null || formatter === undefined){
                return;
            }
            inputDOM = this.get('inputDOM');
            if (YL.isFunction(formatter)){
                inputDOM.value = formatter(inputDOM.value);
            }
            else{
                inputDOM.value = formatter.format(inputDOM.value);
            }
        },
        /**
         * This will ensure the proper css and/or dom is showing to indicate
         * that the input is valid or invalid.
         * @method checkIndicators
         * @return {boolean} True if input is valid
         */
        checkIndicators:function(){
            if (!this.inputIsOn()){
                this.showNoIndicators();
                return true;
            }
            else if (this.get('optional') && this.isEmpty()){
                this.showNoIndicators();
                return true;
            }
            else if (this.isValid()){
                this.showCorrectIndicator();
                this.checkFormat();
                return true;
            }
            else{
                this.showIncorrectIndicator();
                return false;
            }
        },
        /**
         * This will ensure that the incorrect indicator is hidden and the incorrect css is not used, and will
         * ensure that the correct indicator is showing, and the correct css is applied.
         * @method showCorrectIndicator
         */
        showCorrectIndicator:function(){
            var inputDom = this.get('inputDOM'),
            correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');

            this.checkFormat();
            Y.DOM.removeClass(inputDom,this.get('incorrectCss'));
            Y.DOM.addClass(inputDom,this.get('correctCss'));
            if (correctIndicator !== null && correctIndicator !== undefined){
                correctIndicator.style.display = '';
            }
            if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                incorrectIndicator.style.display = 'none';
            }
        },
        /**
         * This will ensure that the correct indicator is hidden and the correct css is not used, and will
         * ensure that the incorrect indicator is showing, and the correct css is applied.
         * @method showCorrectIndicator
         */
        showIncorrectIndicator:function(){
            var inputDom = this.get('inputDOM'),
            correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');
            Y.DOM.addClass(inputDom,this.get('incorrectCss'));
            Y.DOM.removeClass(inputDom,this.get('correctCss'));
            if (correctIndicator !== null && correctIndicator !== undefined){
                correctIndicator.style.display = 'none';
            }
            if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                incorrectIndicator.style.display = '';
            }
        },
        /**
         * This will ensure NO indicators are showing.
         * method @showNoIndicators
         */
        showNoIndicators:function(){
            var inputDom = this.get('inputDOM'),
            correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');
            Y.DOM.removeClass(inputDom,this.get('incorrectCss'));
            Y.DOM.removeClass(inputDom,this.get('correctCss'));
            if (correctIndicator !== null && correctIndicator !== undefined){
                correctIndicator.style.display = 'none';
            }
            if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                incorrectIndicator.style.display = 'none';
            }
        },
        /**
         * This function will insert the given el beside the inputDOM.
         * @method insertBeside
         * @param {HTMLElement} el DOM object to be insert beside the main input.
         */
        insertBeside:function(el) {
            if (Y.DOM.insertAfter) {
                Y.DOM.insertAfter(el,this.get('inputDOM'));
            }
            else {
                Y.DOM.addHTML(this.get('inputDOM'), el, 'after');
            }
            
        },
        /**
         * This will attach the keyup event to the input dom.
         * @method initializeEvents
         * @param {HTMLElement} target The Object that will be listening to the key up and blur events of the input DOM.
         */
        initializeEvents:function(target){
            var theTarget = target;
            if (theTarget === null || theTarget === undefined){
                theTarget = this;
            }
            Y.Event.attach('keyup',theTarget._evtOnChange,this.get('inputDOM'),theTarget,true);
            Y.Event.attach('blur',theTarget._evtOnChange,this.get('inputDOM'),theTarget,true);
        }
    });
    Y.TextBaseField = _TextBaseField;