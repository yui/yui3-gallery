/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This input field is for text input of doubles or floats.
     * @class DoubleField
     * @extends TextBaseField
     */
    /**
     * @constructor
     * This will initialize the double field, and its' base fields properties.
     * @param {Object} config Configuration JSON.
     */
    function _DoubleField(config){
        _DoubleField.superclass.constructor.apply(this,arguments);
        this.set('regex',Y.BaseInputField.staticVariables.DOUBLEREGEX);
    }
    _DoubleField.ATTRS = {
        /**
         * This is set to true if the minimum allowed values boundary is inclusive
         * @property minInclusive
         * @type boolean
         */
        minInclusive:{
            value:true,
            setter:Y.BaseInputField.staticFunctions.BOOLEANSETTER
        },
        /**
         * This is set to true if the maximum allowed values boundary is inclusive
         * @property maxInclusive
         * @type boolean
         */
        maxInclusive:{
            value:true,
            setter:Y.BaseInputField.staticFunctions.BOOLEANSETTER
        },
        /**
         * This is the minimum allowed value in the double field.  Default value
         * is the minimum value for an integer
         * @property min
         * @type number
         */
        min:{
            value:0,
            setter:function(val){
                var rtVl = val;
                if (!YL.isNumber(rtVl)){
                    rtVl = parseFloat(rtVl);
                }
                if (!YL.isNumber(rtVl)){
                    throw 'Invalid value given for min: ' + val;
                }
                if (rtVl < (-1)*Y.BaseInputField.staticVariables.MAX_INTEGER){
                    return (-1)*Y.BaseInputField.staticVariables.MAX_INTEGER;
                }
                return rtVl;
            }
        },
        /**
         * This is the maximum allowed value in the double field. Default value
         * is the maximum value for an integer
         * @property max
         * @type number
         */
        max:{
            value:Y.BaseInputField.staticVariables.MAX_INTEGER,
            setter:function(val){
                var rtVl = val;
                if (!YL.isNumber(rtVl)){
                    rtVl = parseFloat(rtVl);
                }
                if (!YL.isNumber(rtVl)){
                    throw 'Invalid value given for max: ' + val;
                }
                if (rtVl > Y.BaseInputField.staticVariables.MAX_INTEGER){
                    return Y.BaseInputField.staticVariables.MAX_INTEGER;
                }
                return rtVl;
            }
        },
        /**
         * If set, this will restrict the number of decimal places allowed on the double.  This could
         * be done with regular expression, but this makes it a bit easier for everyone.
         * @property maxDecimalPlaces
         * @type number
         */
        maxDecimalPlaces:{
            value:-1,
            setter:function(val){
                var rtVl = val;
                if (!YL.isNumber(rtVl)){
                    rtVl = parseInt(rtVl,10);
                }
                if (!YL.isNumber(rtVl)){
                    throw 'Invalid value given for decimal places: ' + val;
                }
                else{
                    return val;
                }
            }
        }
    };
    _DoubleField.NAME = 'DoubleField';
    Y.extend(_DoubleField,Y.TextBaseField,{
        /**
         * This will return true if the input matches the double regular expression
         * and, if max decimals are set, the number of decimals places.
         * @method isValid
         * @return {boolean} true if the input is a valid double.
         */
        isValid:function(){
            if (!_DoubleField.superclass.isValid.call(this)){
                return false; // return false if it doesn't match the double regex
            }
            else if (this.get('optional') && this.isEmpty()){
                return true;
            }
            var value = this.get('inputDOM').value,numVal = 0,minInclusive,maxInclusive,min,max,decimals,
            maxDecimals = this.get('maxDecimalPlaces');
            if ((maxDecimals != -1) && (value.indexOf('.') != -1)){
                decimals = value.split('.')[1];
                if (decimals.length > maxDecimals) {
                    return false;
                }
            }
            try{numVal = parseFloat(value,10);}
            catch(e){return false;}

            if (numVal.toString() === null || numVal.toString() === undefined){
                return false;
            }
            if (numVal.toString().toLowerCase() == 'nan'){
                return false;
            }

            minInclusive = this.get('minInclusive');
            maxInclusive = this.get('maxInclusive');
            min = this.get('min');
            max = this.get('max');

            if (minInclusive && (min > numVal)){
                return false;
            }
            else if (!minInclusive && (min >= numVal)){
                return false;
            }
            else if (maxInclusive && (max < numVal)){
                return false;
            }
            else if (!maxInclusive && (max <= numVal)){
                return false;
            }
            else{
                return true;
            }
        }
    });
    Y.DoubleField = _DoubleField;