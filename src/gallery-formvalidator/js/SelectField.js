/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This field is for SELET input.  This will ensure that a non-empty value is
     * selected in the field in order for it to be considered valid.
     * @class SelectField
     * @extends TextBaseField
     */
    /**
     * @constructor
     * This will initialize the field with the given configuration json.
     * @param {Object} config Configuration json object.
     */
    function _SelectField(config){
        _SelectField.superclass.constructor.apply(this,arguments);
    }
    _SelectField.ATTRS = {
        /**
         * This will be the value of the option that specifies no selected
         * value.  '' by default.
         * @property emptyValue
         * @type String
         */
        emptyValue:{
            value:'',
            setter:function(val){
                if (val === null || val === undefined){
                    return '';
                }
                else{
                    return val;
                }
            }
        }
    };
    _SelectField.NAME = 'SelectField';
    Y.extend(_SelectField,Y.TextBaseField,{
        /**
         * Returns true if the value in the select input matches the specified empty value
         * @return {boolean} true if the value in the select input matches the specified empty value
         */
        isEmpty:function(){
            var value = this.get('inputDOM').value;
            return value == this.get('emptyValue');
        },
        /**
         * This will set the select field back to its' empty value.
         * @method clear
         * @param {boolean} silent If true, this function will not invoke the on change event listener.
         */
        clear:function(silent){
            this.get('inputDOM').value = this.get('emptyValue');
            if (silent !== true){
                this._evtOnChange();
            }
        },
        /**
         * Returns true if the value selected in the dom doesn't match the value
         * set for the emptyValue property.
         * @return {boolean} false if the value in the select input matches the specified empty value
         */
        isValid:function(){
            if (!this.get('isOn')){
                return true; // is always valid if off
            }
            else if (this.get('optional') && this.isEmpty()){
                return true;
            }
            var value = this.get('inputDOM').value;
            return value != this.get('emptyValue');
        },
        /**
         * This will attach the onchange event to the select DOM
         * @method initializeEvents
         * @param {Object} target Object who will be listening for the select field's change event.
         */
        initializeEvents:function(target){
            var theTarget = target;
            if (theTarget === null || theTarget === undefined){
                theTarget = this;
            }
            Y.Event.attach('change',theTarget._evtOnChange,this.get('inputDOM'),theTarget,true);
        }
    });
    Y.SelectField = _SelectField;