/**
 * Provides UndoableAction class
 *
 * @module gallery-undo
 */

(function(){


/**
 * Create a UndoableAction
 *
 * @class UndoableAction
 * @extends Base
 * @param config {Object} Configuration object
 * @constructor
 */
function UndoableAction( config ){
    UndoableAction.superclass.constructor.apply( this, arguments );
}

var Lang = Y.Lang,
    UAName = "UndoableAction",
    LABEL = "label",
    BEFOREUNDO = "beforeUndo",
    UNDOFINISHED = "undoFinished",
    BEFOREREDO = "beforeRedo",
    REDOFINISHED = "redoFinished";

Y.mix( UndoableAction, {
    /**
     * The identity of UndoableAction.
     *
     * @property UndoableAction.NAME
     * @type String
     * @static
     */
    NAME : UAName,

    /**
     * Static property used to define the default attribute configuration of UndoableAction.
     *
     * @property UndoableAction.ATTRS
     * @type Object
     * @protected
     * @static
     */
    ATTRS : {
        /**
         * The label of action
         *
         * @attribute label
         * @type String
         * @default ""
         */
        label: {
            value: "",
            validator: Lang.isString
        },

        
        /**
         * Boolean, indicates if action must be processed asynchronously.
         * If true, <code>undo</code> method must fire <code>undoFinished</code> event.
         * Respectively, <code>redo</code> method must fire <code>redoFinished</code> event
         *
         * @attribute asyncProcessing
         * @type Boolean
         * @default false
         */
        asyncProcessing : {
            value: false,
            validator: Lang.isBoolean
        }
    }
});


Y.extend( UndoableAction, Y.Base, {
    
    /**
     * Container for child actions of this action
     *
     * @property _childActions
     * @protected
     * @type Array
     */
    _childActions : [],

    /**
     * Publishes events
     *
     * @method initializer
     * @protected
     */
    initializer : function( cfg ) {
        this._initEvents();
    },

    /**
     * Destructor lifecycle implementation for UndoableAction class.
     *
     * @method destructor
     * @protected
     */
    destructor : function() {
    },

    
    /**
     * Publishes UndoableAction's events
     *
     * @method _initEvents
     * @protected
     */
    _initEvents : function(){
        
        /**
         * Signals the beginning of action undo.
         * 
         * @event beforeUndo
         * @param event {Event.Facade} An Event Facade object
         */
        this.publish( BEFOREUNDO );
        
        /**
         * Signals the end of action undo.
         * 
         * @event undoFinished
         * @param event {Event.Facade} An Event Facade object
         */
        this.publish( UNDOFINISHED );
        
        /**
         * Signals the beginning of action redo.
         * 
         * @event beforeRedo
         * @param event {Event.Facade} An Event Facade object
         */
        this.publish( BEFOREREDO );
        
        /**
         * Signals the end of action redo.
         * 
         * @event redoFinished
         * @param event {Event.Facade} An Event Facade object
         */
        this.publish( REDOFINISHED );
    },

    
    /**
     * The default implemetation undoes all child actions in reverse order.
     *
     * @method undo
     */
    undo : function(){
        var childActions, action, i;

        this.fire( BEFOREUNDO );
        
        childActions = this._childActions;

        for( i = childActions.length - 1; i > 0; i-- ){
            action = childActions[i];
            action.undo();
        }

        this.fire( UNDOFINISHED );
    },
    
    
    /**
     * The default implemetation redoes all child actions.
     *
     * @method redo
     */
    redo : function(){
        var childActions, action, i, length;

        this.fire( BEFOREREDO );

        childActions = this._childActions;
        length = childActions.length;
        
        for( i = 0; i < length; i++ ){
            action = childActions[i];
            action.redo();
        }

        this.fire( REDOFINISHED );
    },
        
    
    /**
     * Depending on the application, an UndoableAction may merge with another action. If merge was successfull, merge must return true; otherwise returns false.
     * The default implemetation returns false.
     *
     * @method merge
     * @param {Y.UndoableAction} newAction The action to merge with
     * @return {Boolean} false
     */
    merge : function( newAction ){
        return false;
    },

    
    /**
     * UndoManager invokes <code>cancel</code> method of action before removing it from the list.<br>
     * The default implemetation does nothing.
     *
     * @method cancel
     */
    cancel : function(){
    },
    
    
    /**
     * Overrides <code>toString()</code> method.<br>
     * The default implementation returns the value of <code>label</code> property.
     * 
     */
    toString : function(){
        return this.get( LABEL );
    }
});

Y.UndoableAction = UndoableAction;

}());
