/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This will represent a checkbox field in the form validator.  Checkbox
     * field can be put into a group based field or left on its' own.
     *
     * @class CheckboxField
     * @extends BaseInputField
     */
    /**
     * @constructor
     * This will initialize the element with the given configuration.  Most of this will
     * be passed to the BaseInputField.
     * @param {Object} config Configuration for the checkbox field.  Probably just the validWhenChecked property
     */
    function _CheckboxField(config){
        _CheckboxField.superclass.constructor.apply(this,arguments);
    }
    _CheckboxField.ATTRS = {
        /**
         * The dom that represents the checkbox
         * @property inputDOM
         * @type HTMLElement
         */
        inputDOM:{
            value:null,
            setter:Y.BaseInputField.staticFunctions.standardElSetter
        },
        /**
         * If set to true, this checkbox will be considered valid if checked
         * @property validWhenChecked
         * @type boolean
         */
        validWhenChecked:{
            value:true
        }
    };
    _CheckboxField.NAME = 'CheckboxField';
    Y.extend(_CheckboxField,Y.BaseInputField,{
        /**
         * Sets up the indicators
         * @method initializeInput
         */
        initializeInput:function(){
            this.setupIndicators();
            //this.initializeEvents();
        },
        /**
         * This will return the dom that represents the input.
         * @method getInputDOM
         * @return {HTMLElement} input dom for this field.
         */
        getInputDOM:function(){return this.get('inputDOM');},
        /**
         * This will set the checkbox back to unchecked if checked is valid, and checked, if unchecked is valid.
         * @method clear
         */
        clear:function(silent){
            this.get('inputDOM').checked = !this.get('validWhenChecked');
            if (silent !== true){
                this._evtOnChange();
            }
        },
        /**
         * This disables the checkbox
         * @method disable
         */
        disable:function(){
            _CheckboxField.superclass.disable.call(this);
            this.get('inputDOM').disabled = true;
        },
        /**
         * This enables the checkbox
         * @method enable
         */
        enable:function(){
            _CheckboxField.superclass.enable.call(this);
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
            var validWhenChecked = this.get('validWhenChecked'),
            checked = this.get('inputDOM').checked;
            return (validWhenChecked && checked) || (!validWhenChecked && !checked);
        },
        /**
         * Returns the id of the group based field.
         * @method getId
         * @return {String} id of the checkbox dom.
         */
        getId:function(){
            return this.get('inputDOM').id;
        },
        /**
         * Returns the true if the checkbox input is invalid.
         * @method isEmpty
         * @return {boolean} true if the checkbox is not valid.
         */
        isEmpty:function(){
            return !this.isValid();
        },
        /**
         * This will ensure no indicators are showing, or css applied to the input that
         * would signify correctness or incorrectness.
         * @method showNoIndicators
         */
        showNoIndicators:function(){
            var dom = this.get('inputDOM'),
            correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');

            Y.DOM.removeClass(dom,this.get('incorrectCss'));
            Y.DOM.removeClass(dom,this.get('correctCss'));
            if (correctIndicator !== null && correctIndicator !== undefined){
                correctIndicator.style.display = 'none';
            }
            if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                incorrectIndicator.style.display = 'none';
            }
        },
        /**
         * This will ensure the proper css and/or dom is showing to indicate
         * that the input is valid or invalid.
         * @method checkIndicators
         * @return {boolean} True if input is valid
         */
        checkIndicators:function(){
            var dom = this.get('inputDOM'),
            correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');
            if (!this.get('isOn')){
                this.showNoIndicators();
                return this.isValid();
            }
            else if (this.isValid()){
                if (dom !== null && dom !== undefined){
                    Y.DOM.removeClass(dom,this.get('incorrectCss'));
                    Y.DOM.addClass(dom,this.get('correctCss'));
                }
                if (correctIndicator !== null && correctIndicator !== undefined){
                    correctIndicator.style.display = '';
                }
                if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                    incorrectIndicator.style.display = 'none';
                }
                return true;
            }
            else{
                if (dom !== null && dom !== undefined){
                    Y.DOM.addClass(dom,this.get('incorrectCss'));
                    Y.DOM.removeClass(dom,this.get('correctCss'));
                }
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
         * Inidicators are usually applicable to checkboxes, so creating them dynamically doesn't
         * make much sense, this method does nothing.
         * @method insertBeside
         * @param {HTMLElement} el DOM object to be insert beside the main input.
         */
        insertBeside:function(el) {
        },
        /**
         * This will initialize the checkbox so the form status is updated when the checkbox is clicked.
         * @method initializeEvents
         * @param {HTMLElement} target The object that will be listening to the events of the click event of the input DOM
         */
        initializeEvents:function(target){
            var theTarget = target;
            if (theTarget === null || theTarget === undefined){
                theTarget = this;
            }
            Y.Event.attach('click',theTarget._evtOnChange,this.get('inputDOM'),theTarget,true);
        }
    });
    Y.CheckboxField = _CheckboxField;