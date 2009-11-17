/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This field is for matching two inputs on the form.  For instance, this would
     * be useful for having users re-enter passwords, or re-enter e-mail addresses.
     * @class MatchField
     * @extends TextBaseField
     */
    /**
     * @constructor
     * This will initialize the match field with the given JSON configuration
     * @param {Object} config Configuration JSON object.
     */
    function _MatchField(config){
        _MatchField.superclass.constructor.apply(this,arguments);
    }
    _MatchField.ATTRS = {
        /**
         * This is the dom that the match field will compare the input of its' own dom against.
         * @property matchDOM
         * @type HTMLElement
         */
        matchDOM:{
            value:null,
            setter:Y.BaseInputField.staticFunctions.standardElSetter
        },
        /**
         * If set to true, this will do a case sensitive match on the two input DOM's values
         * in order to determine if this field is valid.  True by default
         * @property caseSensitive
         * @type boolean
         */
        caseSensitive:{
            value:true,
            setter:Y.BaseInputField.staticFunctions.BOOLEANSETTER

        }
    };
    _MatchField.NAME = 'MatchField';
    Y.extend(_MatchField,Y.TextBaseField,{
        /**
         * This will return true if the match dom's value matches the input Dom's value.  The comparison
         * will be case sensitive depending on the case sensitive property.  The input is also NOT trimmed
         * so leading or tailing whitespace is included in the comparison.
         * @method isValid
         * @return {boolean} true if the match dom's value matches the input dom's value.
         */
        isValid:function(){
            if (!this.get('isOn')){
                return true;
            }
            else if (this.get('optional') && this.isEmpty()){
                return true;
            }
            var matchDom = this.get('matchDOM'),
            inputDom = this.get('inputDOM');
            if (this.isEmpty()){
                return false;
            }
            if (this.get('caseSensitive')){
                return matchDom.value == inputDom.value;
            }
            else{
                return matchDom.value.toLowerCase() == inputDom.value.toLowerCase();
            }
        }
    });
    Y.MatchField = _MatchField;