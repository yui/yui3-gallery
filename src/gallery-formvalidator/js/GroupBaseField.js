/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This class is the text base input field and will be extended by all
     * Inputs who's values will be text based in anyway.  Examples include a number input,
     * select box or a text input.
     * @class GroupBaseField
     * @extends BaseInputField
     */
    /**
     * @constructor
     * This will initialize the group with the given configuration json object.
     * @param {Object} config JSON configuration object containing the properties of the GroupBaseField
     */
    function _GroupBaseField(config){
        _GroupBaseField.superclass.constructor.apply(this,arguments);
    }
    _GroupBaseField.ATTRS = {
        /**
         * This is the dom that contains the group's child elements.  This is optional
         * as the group's child inputs do not have to be contained in a dom element
         * @property groupDOM
         * @type HTMLElement
         */
        groupDOM:{
            value:null,
            setter:Y.BaseInputField.staticFunctions.standardElSetter
        },
        /**
         * This will contain the raw json of the input fields that will belong
         * to the group input.
         * @property membersJSON
         * @type Object[]
         */
        membersJSON:{
            value:[]
        },
        /**
         * When the member inputs are process and instantiated they are placed
         * in this collection where they are persisted.
         * @property members
         * @type BaseInputField[]
         */
        members:{
            value:[],
            setter:function(val){
                if (YL.isArray(val)){
                    return val;
                }
                else{
                    throw 'The members property of a group must be an array';
                }
            }
        },
        /**
         * Minimum number of inputs that need to be properly filled in for this to be valid.
         * 0 to state that none have to be filled in. If not set, this is property is not used.
         * @property minValid
         * @type {number}
         */
        minValid:{
            value:null,
            setter:function(val){
                if (val === null || val === undefined){
                    return null;
                }
                var theVal = val,max;
                if (!YL.isNumber(theVal)){
                    theVal = parseInt(theVal,10);
                }
                if (theVal < 1){
                    throw 'The minimum must be greater than 1';
                }

                max = this.get('maxValid');
                if ((max !== null && max !== undefined) && (theVal > max)){
                    throw 'Minimum must be less than or equal to maximum';
                }
                else{
                    return theVal;
                }
            }
        },
        /**
         * Maximum nuymber of fields that can be filled in.  Anymore (valid or not) and the group is invalid.
         * If not set, this is property is not used.
         * @property maxValid
         * @type number
         */
        maxValid:{
            value:null,
            setter:function(val){
                if (val === null || val === undefined){
                    return null;
                }
                if (val < 1){
                    throw 'The maximum must be greater than 1';
                }
                var min = this.get('minValid');
                if ((min !== null && min !== undefined) && (val < min)){
                    throw 'Maximum must be greater than or equal to minimum';
                }
                else{
                    return val;
                }
            }
        },
        /**
         * Property that can be optional set for the custom input for looking up the object
         * @property id
         * @type string
         */
        id:{
            value:null
        }
    };
    _GroupBaseField.NAME = 'GroupBaseField';
    Y.extend(_GroupBaseField,Y.BaseInputField,{
        /**
         * Indicator function to help the form validator deal with the regular inputs and group
         * inputs differently on some occasions.
         * @method isGroup
         * @return boolean True all the time, as this is infact a group
         */
        isGroup:function(){return true;},
        /**
         * This will return the dom that represents the input.
         * @method getInputDOM
         * @return {HTMLElement} input dom for this field.
         */
        getInputDOM:function(){return this.get('groupDOM');},
        /**
         * This will return any member input with the given id.
         * @method getInput
         * @param {string} id Id of an input
         * @return {BaseInputField} The field with the given id, null if no such field exists
         */
        getInput:function(id){
            var members = this.get('members'),rtVl,i;
            for (i = 0; i < members.length; ++i){
                if (members[i].getId() == id){
                    return members[i];
                }
                if (members[i].isGroup()){
                    rtVl = members[i].getInput(id);
                    if (rtVl !== null && rtVl !== undefined){
                        return rtVl;
                    }
                }
            }
            return null;
        },
        /**
         * This will call the clear method (in silent mode) on all member inputs.
         * If silent is true, it will then fire its own on change event.
         * @method clear
         * @param {boolean} silent True if this will call the on change event
         */
        clear:function(silent){
            var members = this.get('members'),i;
            for (i = 0; i < members.length; ++i){
                members[i].clear(true);
            }
            if (silent !== true){
                this._evtOnChange();
            }
        },
        /**
         * This will disable all the inputs in the group
         * @method disable
         */
        disable:function(){
            _GroupBaseField.superclass.disable.call(this);
            var members = this.get('members'),i;
            for (i = 0; i < members.length; ++i){
                members[i].disable();
            }
        },
        /**
         * This will enable all the inputs in the group
         * @method enable
         */
        enable:function(){
            _GroupBaseField.superclass.enable.call(this);
            var members = this.get('members'),i;
            for (i = 0; i < members.length; ++i){
                members[i].enable();
            }
        },
        /**
         * This will turn on all the members of the group, including the group as well
         * @method turnOn
         */
        turnOn:function(){
            _GroupBaseField.superclass.turnOn.call(this);
            var members = this.get('members'),i;
            for (i = 0; i < members.length; ++i){
                members[i].turnOn();
            }
            this.checkIndicators();
        },
        /**
         * This will turn off all the members of the group, including the group as well
         * @method turnOff
         */
        turnOff:function(){
            _GroupBaseField.superclass.turnOff.call(this);
            var members = this.get('members'),i;
            for (i = 0; i < members.length; ++i){
                members[i].turnOff();
            }
        },
        /**
         * This will take the members json and initialize the inputs.  Validator
         * is required for setting up the field based on settings given to the
         * main form validator.
         * @method initializeInput
         * @param {Validator} validator The validator this input gets it's default values from.
         */
        initializeInput:function(validator){
            var membersJSON = this.get('membersJSON'),
            members = this.get('members'),newField,i;
            for (i = 0 ; i < membersJSON.length; ++i){
                 newField = new membersJSON[i].type(membersJSON[i].atts,false);
                 validator.setupInput(newField);
                 members[members.length] = newField;
            }
            this.setupIndicators();
            this.checkIndicators();
        },
        /**
         * This will add the given field to the group as an input.
         * @method addInput
         * @param {BaseInputField} newField The new field to be added to the group.
         */
        addInput:function(newField){
            var members = this.get('members');
            members[members.length] = newField;
        },
        /**
         * Returns true only if the input is not empty, and it is not longer than the maximum length setting
         * @method isValid
         * @return {boolean} true if the input is not empty, and it is not longer than the maximum length setting
         */
        isValid:function(){
            if (this.get('optional') && this.isEmpty()){
                return true;
            }
            var members = this.get('members'),
            numValid = 0,
            groupOn = this.get('isOn'),rtVl = true,empty,valid,minValid,maxValid,i;
            for (i = 0; i < members.length; ++i){
                empty = members[i].isEmpty();
                valid = members[i].isValid();

                if (!empty && valid){
                    numValid++;
                }
                else if (!empty){
                    return !groupOn; // if not empty, and not valid then the whole group is invalid (only if the group is on
                }
            }
            if (groupOn){
                minValid = this.get('minValid');
                maxValid = this.get('maxValid');
                if (minValid !== null && minValid !== undefined){
                    rtVl = minValid <= numValid;
                }
                if (maxValid !== null && maxValid !== undefined){
                    rtVl = (maxValid >= numValid) && rtVl;
                }
            }
            return rtVl;
        },
        /**
         * Returns the id of the group based field.
         * @method getId
         * @return {string} id of the group base field if the id property was set, null otherwise.
         */
        getId:function(){
            var id = this.get('id'),groupDOM;
            if (id !== null && id !== undefined){
                return id;
            }
            groupDOM = this.get('groupDOM');
            if (groupDOM !== null && groupDOM !== undefined){
                return groupDOM.id;
            }
            else{
                return null;
            }
        },
        /**
         * Returns true all the members of the group are empty
         * @method isEmpty
         * @return {boolean} true if all members of the group are empty
         */
        isEmpty:function(){
            var members = this.get('members'),i;
            for (i = 0; i < members.length; ++i){
                if (!members[i].isEmpty()){
                    return false;
                }
            }
            return true;
        },
        /**
         * This will show the correct indicator, and apply the correct css to the input
         * if they are set for the group.  It will also ensure the incorrect indicator
         * is not showing, and incorrect css is not applied.
         * @method showCorrectIndicator
         */
        showCorrectIndicator:function(){
            var groupDom = this.get('groupDOM'),
            correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');
            if (groupDom !== null && groupDom !== undefined){
                Y.DOM.removeClass(groupDom,this.get('incorrectCss'));
                Y.DOM.addClass(groupDom,this.get('correctCss'));
            }
            if (correctIndicator !== null && correctIndicator !== undefined){
                correctIndicator.style.display = '';
            }
            if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                incorrectIndicator.style.display = 'none';
            }
        },
        /**
         * This will show the incorrect indicator, and apply the incorrect css to the input
         * if they are set for the group.  It will also ensure the correct indicator
         * is not showing, and correct css is not applied.
         * @method showIncorrectIndicator
         */
        showIncorrectIndicator:function(){
            var groupDom = this.get('groupDOM'),
            correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');
            if (groupDom !== null && groupDom !== undefined){
                Y.DOM.addClass(groupDom,this.get('incorrectCss'));
                Y.DOM.removeClass(groupDom,this.get('correctCss'));
            }
            if (correctIndicator !== null && correctIndicator !== undefined){
                correctIndicator.style.display = 'none';
            }
            if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                incorrectIndicator.style.display = '';
            }
        },
        /**
         * This will ensure all indicators are not showing, and no indicator css
         * is applied to the input
         * @method showNoIndicators
         */
        showNoIndicators:function(){
            var groupDom = this.get('groupDOM'),
            correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');
            if (groupDom !== null && groupDom !== undefined){
                Y.DOM.removeClass(groupDom,this.get('incorrectCss'));
                Y.DOM.removeClass(groupDom,this.get('correctCss'));
            }
            if (correctIndicator !== null && correctIndicator !== undefined){
                correctIndicator.style.display = 'none';
            }
            if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                incorrectIndicator.style.display = 'none';
            }
        },
        /**
         * This will ensure the proper css and/or dom is showing to indicate
         * that the input is valid or invalid.  This will also ensure that the
         * right indicators are showing on the children of the group.  Any change
         * in a member of the group will cause this method in the group to be executed.
         * @method checkIndicators
         * @return {boolean} True if input is valid
         */
        checkIndicators:function(){
            var members = this.get('members'),
            numValid = 0,
            oneInvalid = false,
            groupOn = this.get('isOn'),
            empty,i,valid,rtVl = true,minValid,maxValid;
            for (i = 0; i < members.length; ++i){
                empty = members[i].isEmpty();
                valid = members[i].isValid();
                if (!groupOn){
                    members[i].showNoIndicators();
                }
                else if (this.get('optional') && this.isEmpty()){
                    members[i].showNoIndicators();
                }
                else if (!empty && valid){
                    numValid++;
                    members[i].showCorrectIndicator();
                }
                else if (!empty){
                    members[i].showIncorrectIndicator();
                    oneInvalid = true;
                }
                else{
                    members[i].showNoIndicators();
                }
            }
            // if one was not empty and invalid, then return false;
            if (!oneInvalid){
                minValid = this.get('minValid');
                maxValid = this.get('maxValid');
                if (minValid !== null && minValid !== undefined){
                    rtVl = minValid <= numValid;
                }
                if (maxValid !== null && maxValid !== undefined){
                    rtVl = (maxValid >= numValid) && rtVl;
                }
            }
            else{
                rtVl = false;
            }
            if (!groupOn){
                this.showNoIndicators();
                return true;
            }
            else if (this.get('optional') && this.isEmpty()){
                this.showNoIndicators();
                return true;
            }
            else if (rtVl){
                this.showCorrectIndicator();
                return true;
            }
            else{
                this.showIncorrectIndicator();
                return false;
            }
        },
        /**
         * Indicators are not created dynamically for groups at the moment.
         * @method insertBeside
         * @param {HTMLElement} el DOM object to be insert beside the main input.
         */
        insertBeside:function(el) {
        },
        /**
         * This will go through each member and initialize their event.
         * @method initializeEvents
         * @param {Object} target The target that will be listening to the events of the members.
         */
        initializeEvents:function(target){
            var theTarget = target,members = this.get('members'),i;
            if (theTarget === null || theTarget === undefined){
                theTarget = this;
            }
            for (i = 0; i < members.length; ++i){
                members[i].initializeEvents(theTarget); // the members will use the parent target as their event catcher
                // this will cause the events to bubble up in the group.
            }
            //this.checkIndicators();
        }
    });
    Y.GroupBaseField = _GroupBaseField;