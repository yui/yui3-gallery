/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This class is what all INput fields used in the form validator will inherit from.  This provides
     * the basic general attributes and functions required by all input fields.
     * @class BaseInputField
     * @extends Base
     */
    /**
     * @constructor This will store all the attributes given as parameters
     */
    function _BaseInputField(){
        _BaseInputField.superclass.constructor.apply(this,arguments);
        this.publish(_BaseInputField.CE_ONCHANGE);
        this.checkPrompt();
    }
    Y.augment(_BaseInputField, Y.EventTarget);
    _BaseInputField.staticVariables = {
        MAX_INTEGER:2147483647,
        INTEGERREGEX:/(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/,
        DOUBLEREGEX:/(^-?\d\d*\.\d+$)|(^-?\d\d*$)|(^-?\.\d\d*$)/,
        EMAILREGEX:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    };

    _BaseInputField.staticFunctions = {
        /**
         * This is the setter used for setting regular expression properties.  IF the value is a string,
         * it will parse the regular expression and return it.  If it is a regex, it will simply return the
         * value passed in.
         * @method standardRegexSetter
         * @param {String|Regex} val
         * @static
         */
        standardRegexSetter:function(val){
            if (YL.isString(val)){
                var valToUse = val;
                if (valToUse.indexOf('/') === 0){
                    valToUse = valToUse.substring(1);
                }
                if (valToUse.charAt(valToUse.length - 1) == '/'){
                    valToUse = valToUse.substring(0,valToUse.length - 1);
                }
                return new RegExp(valToUse);
            }
            else{
                return val;
            }
        },
        /**
         * Static function for setting an dom element as an attribute.  This will
         * allow that attribute to support an id or the element itself.
         * @method standardElSetter
         * @static
         * @param {HTMLElement|String} el Id or el that is to be set for the property in question.
         */
        standardElSetter:function(el){
            if (el === null || el === undefined){
                return null;
            }
            var rtVl = el;
            if (YL.isString(el)){
                rtVl = Y.DOM.byId(el);
            }
            if (rtVl === null || rtVl === undefined){
                return el;
            }
            else{
                return rtVl;
            }
        },
        /**
         * Static function that will set a boolean value for a property
         * @method BOOLEANSETTER
         * @static
         * @param {boolean|string} val value of yes/no/true/false
         */
        BOOLEANSETTER:function(val){
            if (YL.isBoolean(val)){
                return val;
            }
            else if (YL.isString(val)){
                return val.toLowerCase() == 'true';
            }
            else{
                return val !== null && val !== undefined;
            }
        }
    };
    _BaseInputField.ATTRS = {
        /**
         * This will be set to true if the Incorrect indicator is to be created
         * upon instantiation of the input field.
         * @property createIncorrectIndicator
         * @type boolean
         */
        createIncorrectIndicator:{
            value:false
        },
        /**
         * This will be set to true if the correct indicator is to be created
         * upon instantiation of the input field.
         * @property createCorrectIndicator
         * @type boolean
         */
        createCorrectIndicator:{
            value:false
        },
        /**
         * This is the DOM element type for the indicator.  The default for
         * this will be span.
         * @property indicatorType
         * @type string
         */
        indicatorType:{
            value:null
        },
        /**
         * This is the css that is to be applied to the indicator.  Default
         * will be correctIndicator
         * @property correctIndicatorCss
         * @type string
         */
        correctIndicatorCss:{
            value:null
        },
        /**
         * This is the css that is to be applied to the indicator.  Default
         * will be incorrectIndicator
         * @property incorrectIndicatorCss
         * @type string
         */
        incorrectIndicatorCss:{
            value:null
        },
        /**
         * If set, this will be shown to indicate that the input is correct
         * @property correctIndicator
         * @type HTMLElement
         */
        correctIndicator:{
            value:null,
            setter:_BaseInputField.staticFunctions.standardElSetter
        },
        /**
         * This will be the text that will be used inside the DOM of the incorrect indicator.
         * If none is provided, none will be used
         * @property incorrectIndicatorText
         * @type string
         */
        incorrectIndicatorText:{
            value:null
        },
        /**
         * This will be the text that will be used inside the DOM of the correct indicator.
         * If none is provided, none will be used
         * @property correctIndicatorText
         * @type string
         */
        correctIndicatorText:{
            value:null
        },
        /**
         * If set, this will be shown to indicate that the input is incorrect
         * @property incorrectIndicator
         * @type HTMLElement
         */
        incorrectIndicator:{
            value:null,
            setter:_BaseInputField.staticFunctions.standardElSetter
        },
        /**
         * If set, this will be applied to the the input to signify that it is correct
         * @property correctCss
         * @type string
         */
        correctCss:{
            value:null
        },
        /**
         * If set, this will be applied to the the input to signify that it is incorrect
         * @property incorrectCss
         * @type string
         */
        incorrectCss:{
            value:null
        },
        /**
         * This is set to true when the input is considered disabled.  False otherwise
         * @property disabled
         * @type boolean
         */
        disabled:{
            value:false
        },
        /**
         * If false, this will signal that the input is considered off, and is not factored
         * into the validation.
         * @property isOn
         * @type boolean
         */
        isOn:{
            value:true
        },
        /**
         * If set, this will show that the input is considered optional, and if not filled
         * in, won't cause the form to be invalid.
         * @property optional
         * @type boolean
         */
        optional:{
            value:false
        },
        /**
         * This must provide a function and an html element.  A scope may be optionally provided. <br />
         * &#123;fn: function(el, field) {}, scope: this, el: 'validation-prompt'&#124;
         * @property validationPrompt
         * @type HTMLElement
         */
        validationPrompt: {
            value: null,
            setter: function(val) {
                if (!YL.isObject(val)) {
                    return null;
                }
                else if (!val.el) {
                    return null;
                }
                else if (!val.fn) {
                    val.fn = function(el, field) {
                        if (!field.isValid() && !field.isEmpty()) {
                            el.style.display = '';
                        }
                        else {
                            el.style.display = 'none';
                        }
                    }
                }
                val.el = _BaseInputField.staticFunctions.standardElSetter(val.el);
                val.el.style.display = 'none'; // start off as hidden.
                return val;
            }
        }
    };
    _BaseInputField.NAME = 'BaseInputField';
    /**
     * This is the even that is invoked when the input field is considered changed
     * @event onchange
     */
    _BaseInputField.CE_ONCHANGE = 'inputfield:onchanged';
    Y.extend(_BaseInputField,Y.Base,{
        /**
         * To be overridden by subclasses.  This will typically initialize all inidicators
         * and any other initialization that is required
         * @method initializeInput
         * @param {Validator.Form} validator Validator to which the Base Input gets default values from.
         */
        initializeInput:function(validator){},
        /**
         * This will return the dom that represents the input.  This will be overriden
         * by all subclasses
         * @method getInputDOM
         * @return {HTMLElement} input dom for this field.
         */
        getInputDOM:function(){return null;},
        /**
         * Returns true if the given input is turned on.
         * @method inputIsOn
         * @return {boolean} true if the input is on.
         */
        inputIsOn:function(){
            return this.get('isOn');
        },
        /**
         * This will clear the input of all value.  This is typically overriden
         * by the subclasses
         * @param {boolean} silent Set to true if the change event is NOT to be fired afterwards, as a result the form
         * would not be updated to reflect any changes.
         */
        clear:function(silent) {},
        isGroup:function(){return false;},
        /**
         * This will set the disabled attribute to false.
         * @method enable
         */
        enable:function(){
            this.set('disabled',false);
        },
        /**
         * This will set the disabled attribute to true.
         * @method disable
         */
        disable:function(){
            this.set('disabled',true);
        },
        /**
         * This will syncronize all attributes found inline in the EL.
         * Inline attributes will override JSON defined attributes.
         * @method synchronize
         * @param {HTMLElement} el Element that will have inline attributes pertaining to the input.
         */
        synchronize:function(el){
            var attributes = this.getAttrs(false),value,key;
            for (key in attributes){
                if (true){ // get rid of warning in YUI builder.
                    value = el.getAttribute('formvalidator:' + key);
                    if (value !== null && value !== undefined){
                        this.set(key,value);
                    }
                }
            }
        },
        /**
         * Returns true if the input for the field is valid.  This must
         * be overridden by the subclasses.
         * @method isValid
         * @return {boolean} returns true if the input for the field is valid.
         */
        isValid:function(){
            throw 'Plesae override the isValid function';
        },
        /**
         * This will turn the input off.  After this it will not be considered
         * in determining if the form is valid.
         * @method turnOff
         */
        turnOff:function() {
            this.set('isOn',false);
            this._evtOnChange();
        },
        /**
         * This will turn the input on.  After this it WILL be considered
         * in determining if the form is valid.
         * @method turnOn
         */
        turnOn:function() {
            this.set('isOn',true);
            this._evtOnChange();
        },
        /**
         * This will ensure the proper css and/or dom is showing to indicate
         * that the input is valid or invalid.
         * @method checkIndicators
         */
        checkIndicators: function () {},
        /**
         * This will ensure the validation prompt function gets called and the
         * proper validation tip gets displayed.
         * @method checkPrompt
         */
        checkPrompt: function () {
            var prompt = this.get('validationPrompt'), scope, fn;
            if (!prompt) {
                return;
            }
            // if the input is not on, then hide the validation prompt
            if (!this.inputIsOn()) {
                prompt.el.style.display = 'none';
                return;
            }
            scope = prompt.scope || {};
            fn = prompt.fn || function() {};
            fn.call(scope, prompt.el, this);
        },
        /**
         * This will be overriden by subclasses, but this will hide the incorrect
         * indicator and show the correct indicator if there is one.  It will also
         * apply the correct css to the input if there is correct css defined.
         * @method showCorrectIndicator
         */
        showCorrectIndicator:function(){},
        /**
         * This will be overriden by subclasses, but this will hide the correct
         * indicator and show the incorrect indicator if there is one.  It will also
         * apply the incorrect css to the input if there is incorrect css defined.
         * @method showCorrectIndicator
         */
        showIncorrectIndicator:function(){},
        /**
         * This will be overriden by subclasses, but this will hide all indicators
         * and remove all indicator css from the input.
         */
        showNoIndicators:function(){},
        /**
         * This function will setup the input field based on the attributes
         * given in the constructor and attributes that may be inline in the DOM.
         * @method setup
         */
        setupIndicators:function(){
            var correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');
            if (this.get('createCorrectIndicator')){
                this.set('correctIndicator',this.setupDomItem(correctIndicator,this.get('correctIndicatorText'),this.get('correctIndicatorCss')));
            }
            if (this.get('createIncorrectIndicator')){
                this.set('incorrectIndicator',this.setupDomItem(incorrectIndicator,this.get('incorrectIndicatorText'),this.get('incorrectIndicatorCss')));
            }
        },
        /**
         * If the given EL is a string, it will create a dom object and have it inserted
         * beside the input.  It will then ensure that all the defaults are set on the dom.
         * @method setupDomItem.
         * @param {HTMLElement} el Element that will be used as an indicator.
         * @param {String} html Html that will go inside the el
         * @param {String} className className that is to be applied to the el.
         */
        setupDomItem:function(el,html,className){
            var theDom = el;
            // create the dom element, and then insert it beside the input dom.
            if ((theDom === null || theDom === undefined) || YL.isString(theDom)){
                theDom = document.createElement(this.get('indicatorType'));
                if (el !== null && el !== undefined){
                    theDom.id = el;
                }
                this.insertBeside(theDom);
                theDom.innerHTML = html;
            }
            if ((theDom.className === '' || theDom.className === null || theDom.className === undefined) && (className !== null && className !== undefined)){
                theDom.className = className;
            }
            return theDom;
        },
        /**
         * The input can optionally override this function so they can
         * retrieve their particular input from the form validator.  If they do
         * not override this, then everyting will still work, they just won't be
         * able to retreive it by name from the form validator.
         * @method getId
         * @return {number} the id of the input field
         */
        getId:function() {return null;},
        /**
         * Returns true if the input for the field is considered empty
         * @method isEmpty
         * @return {boolean} True if the input field is considered empty.
         */
        isEmpty:function(){
            throw 'Plesae override the isEmpty function';
        },
        /**
         * This will initialize the events that will notify this input if it was changed
         * If target is null, then the target will be the Input Field.
         * @method initializeEvents
         */
        initializeEvents:function(target){},
        /**
         * This will get called when the input is changed, which will in turn fire the inputChangedEvent.
         * If the input is in a group, the group's event will get fired, not the field's
         * @method _evtOnChange
         */
        _evtOnChange:function(e){
            this.checkPrompt();
            this.checkIndicators();
            this.fire(_BaseInputField.CE_ONCHANGE);
        },
        /**
         * This function will insert the given el beside the main input.  This must be overriden
         * in the subclasses.  To implement this, simply find the parent of the current input
         * starting from the body tag or the form tag and work your way down until you find it.
         * @method insertBeside
         * @param {HTMLElement} el DOM object to be insert beside the main input.
         */
        insertBeside:function(el) {},
        /**
         * Initializer, called before the class is instantiated
         * @method initializer
         */
        initializer:function() {},
        /**
         * destructor, called after the class is destroyed
         * @method destructor
         */
        destructor:function(){}
    });
    Y.BaseInputField = _BaseInputField;