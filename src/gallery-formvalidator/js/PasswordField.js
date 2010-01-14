/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This field is for password input on a form.  This would be used for having users
     * select a password, and requiring a minimum strength to be required.
     * @class PasswordField
     * @extends TextBaseField
     */
    /**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This field is for password input on a form.  This would be used for having users
     * select a password, and requiring a minimum strength to be required.
     * @class PasswordField
     * @extends TextBaseField
     */
    /**
     * @constructor
     * This will initialize the password field using the given json configuration
     * @param {Object} config Configuration object
     */
    function _PasswordField(config){
        _PasswordField.superclass.constructor.apply(this,arguments);
    }
    _PasswordField.staticVariables = {
        // default strong password
        StrongPassword:/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$/,
        // default medium password
        MediumPassword:/^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$/,
        // default minimum password
        MinimumPassword:/(?=.{6,}).*/
    };
    _PasswordField.ATTRS = {
        /**
         * This is the required level of strength for the password field to be
         * considered valid.  In this field, 1=min, 2=med, 3=max.  You
         * can set this property by using min, med, or max, or 1,2 or 3.  The default
         * strength level is medium.
         * @property requiredLevel
         * @type {string|number}
         */
        requiredLevel:{
            value:2,
            setter:function(val){
                if (val === null || val === undefined){
                    return 'med'; // medium by default
                }
                if (YL.isNumber(val)){
                    return val;
                }
                else if (YL.isString(val)){
                    if (val != 'min' && val != 'med' && val != 'max'){
                        throw 'Invalid level requirement, please use min, med or max';
                    }
                    if (val == 'min'){
                        return 1;
                    }
                    else if (val == 'med'){
                        return 2;
                    }
                    else if (val == 'max'){
                        return 3;
                    }
                    else{
                        return 2;
                    }
                }
                throw 'Invalid level requirement, please use min, med or max';
            }
        },
        /**
         * The dom object that appears when the first level of strength has been met (min)
         * @property minIndicator
         * @type HTMLElement
         */
        minIndicator:{
            value:null,
            setter:Y.BaseInputField.staticFunctions.standardElSetter
        },
        /**
         * The dom object that appears when the second level of strength has been met (med)
         * @property medIndicator
         * @type HTMLElement
         */
        medIndicator:{
            value:null,
            setter:Y.BaseInputField.staticFunctions.standardElSetter
        },
        /**
         * The dom object that appears when the third level of strength has been met (max)
         * @property medIndicator
         * @type HTMLElement
         */
        maxIndicator:{
            value:null,
            setter:Y.BaseInputField.staticFunctions.standardElSetter
        },
        /**
         * This is the regular expression that determines if the minimum (first) level of
         * strength has been met.  The default is 8 alpha numeric characters.
         * @property min
         * @type regex
         */
        min:{
            value:_PasswordField.staticVariables.MinimumPassword,
            setter:Y.BaseInputField.staticFunctions.standardRegexSetter
        },
        /**
         * This is the regular expression that determines if the medium (second) level of
         * strength has been met.  The default is 8 alpha numeric characters with letters and symbols.
         * @property med
         * @type regex
         */
        med:{
            value:_PasswordField.staticVariables.MediumPassword,
            setter:Y.BaseInputField.staticFunctions.standardRegexSetter
        },
        /**
         * This is the regular expression that determines if the maximum (third) level of
         * strength has been met.
         * @property max
         * @type regex
         */
        max:{
            value:_PasswordField.staticVariables.StrongPassword,
            setter:Y.BaseInputField.staticFunctions.standardRegexSetter
        }
    };
    _PasswordField.NAME = 'PasswordField';
    Y.extend(_PasswordField,Y.TextBaseField,{
        /**
         * This will return true if the required level of strength has been
         * met by the current input.
         * @method isValid
         * @return {boolean} true if the required level of password strength has been met.
         */
        isValid:function(){
            if (!this.get('isOn')){
                return true;
            }
            else if (this.get('optional') && this.isEmpty()){
                return true;
            }
            var requiredLevel = this.get('requiredLevel'),
            matchedLevel = this.getMatchedLevel();
            return requiredLevel <= matchedLevel;
        },
        /**
         * This will return the level which the input matches
         * @method getMatchedLevel
         * @return {number} the level of password strength that has been reached, 0 if none have.
         */
        getMatchedLevel:function(){
            var value = this.get('inputDOM').value;
            if (this.get('max').test(value)){
                return 3;
            }
            else if (this.get('med').test(value)){
                return 2;
            }
            else if (this.get('min').test(value)){
                return 1;
            }
            else{
                return 0;
            }
        },
        /**
         * This will show the proper indicator based on the strength of the password
         * put in the password field.
         * @method showPasswordIndicator
         */
        showPasswordIndicator:function(){
            var maxIndicator = this.get('maxIndicator'),
            medIndicator = this.get('medIndicator'),
            minIndicator = this.get('minIndicator'),
            level = this.getMatchedLevel();
            if (maxIndicator !== null && maxIndicator !== undefined){
                maxIndicator.style.display = 'none';
            }
            if (medIndicator !== null && medIndicator !== undefined){
                medIndicator.style.display = 'none';
            }
            if (minIndicator !== null && minIndicator !== undefined){
                minIndicator.style.display = 'none';
            }
            if (!this.get('isOn')){
                return; // we don't show password indicator if the password field is off
            }
            else if (this.get('optional') && this.isEmpty()){
                return; // don't display the indicator if this field is optional'
            }

            if ((level == 3) && (maxIndicator !== null && maxIndicator !== undefined)){
                maxIndicator.style.display = '';
            }
            else if ((level == 2) && (medIndicator !== null && medIndicator !== undefined)){
                medIndicator.style.display = '';
            }
            else if ((level == 1) && (minIndicator !== null && minIndicator !== undefined)){
                minIndicator.style.display = '';
            }
        },
        /**
         * This will ensure the proper password indicator is shown, as well
         * as the proper indicators showing if the field is valid or invalid.
         * @method checkIndicators
         * @return {boolean} true if this password field is considered valid.
         */
        checkIndicators:function(){
            var rtVl = _PasswordField.superclass.checkIndicators.call(this);
            this.showPasswordIndicator();
            return rtVl;
        },
        /**
         * Calls the super class' showCorrectIndicator, then ensures the proper
         * password strength indicator is shown.
         * @method showCorrectIndicator
         */
        showCorrectIndicator:function(){
            _PasswordField.superclass.showCorrectIndicator.call(this);
            this.showPasswordIndicator();
        },
        /**
         * Calls the super class' showIncorrectIndicator, then ensures the proper
         * password strength indicator is shown.
         * @method showIncorrectIndicator
         */
        showIncorrectIndicator:function(){
            _PasswordField.superclass.showIncorrectIndicator.call(this);
            this.showPasswordIndicator();
        },
        /**
         * Calls the super class' showNoIndicators, then ensures the proper
         * password strength indicator is shown.
         * @method showNoIndicators
         */
        showNoIndicators:function(){
            _PasswordField.superclass.showNoIndicators.call(this);
            this.showPasswordIndicator();
        }
    });
    Y.PasswordField = _PasswordField;