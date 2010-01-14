/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This input field is for text input of whole numbers.
     * @class IntegerField
     * @extends DoubleField
     */
    /**
     * @constructor
     * This will initialize the integer field, and its' base fields properties.  This
     * will also set the integer regular expression in the Base class.  This will
     * require all inputs to have an integer format.
     * @param {Object} config Configuration JSON.
     */
    function _IntegerField(config){
        _IntegerField.superclass.constructor.apply(this,arguments);
        this.set('regex',Y.BaseInputField.staticVariables.INTEGERREGEX);
    }
    _IntegerField.ATTRS = {};
    _IntegerField.NAME = 'IntegerField';
    Y.extend(_IntegerField,Y.DoubleField,{
        /**
         * This method returns true if the input in the input DOM's value matches
         * the format required for an integer.
         * @method isValid
         * @return {boolean} true if the field is a valid integer
         */
        isValid:function(){
            if (!_IntegerField.superclass.isValid.call(this)){
                return false; // return false if it doesn't match the double regex
            }
            else if (this.get('optional') && this.isEmpty()){
                return true;
            }

            var value = this.get('inputDOM').value,theVal = 0;
            if ( value.indexOf( '.' ) != -1 ){
                return false; // don't allow numbers with decimals
            }
            try{theVal = parseInt(value,10);}
            catch(e){return false;}

            if ( theVal.toString().toLowerCase() == 'nan' ){
                return false;
            }
            else{
                return true;
            }
        }
    });
    Y.IntegerField = _IntegerField;