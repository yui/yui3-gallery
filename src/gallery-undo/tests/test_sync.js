
YUI({
    combine: false,
    debug: true,
    filter:"RAW"
}).use('gallery-undo', 'test', 'console', function(Y) {
    var that = this, testArray = [], total = 0, console, synActions = 20;

    function TestUndoableAction( config ){
        TestUndoableAction.superclass.constructor.apply( this, arguments );
    }

    Y.extend( TestUndoableAction, Y.UndoableAction, {
        undo : function(){
            testArray.splice( -1, 1 );
        },

        redo : function(){
            testArray.push( testArray.length );
        },

        toString : function(){
            return this.get( "label" );
        }
    });


    function UndoableActionMerge( config ){
        UndoableActionMerge.superclass.constructor.apply( this, arguments );
    }

    Y.mix( UndoableActionMerge, {
        ATTRS : {
            number: {
                value: 0,
                validator: Y.Lang.isNumber
            }
        }
    });

    Y.extend( UndoableActionMerge, Y.UndoableAction, {
        

        undo : function(){
            var number = this.get( "number" );
            total -= number;
        },

        redo : function(){
            var number = this.get( "number" );
            total += number;
        },

        merge : function( newAction ){
            var curNumber = this.get( "number" );
            var newNumber = newAction.get( "number" );

            this.set( "number", curNumber + newNumber );
        }
    });


    this.undoManager = new Y.UndoManager();

    this.undoManager.on( "actionAdded", Y.bind( function(attrs){
        var action = attrs.action;
        Y.Assert.isInstanceOf( Y.UndoableAction, action );
    }, this) );

    this.undoManager.on( "actionCanceled", Y.bind( function(attrs){
        var action = attrs.action;
        var index = attrs.index;

        Y.Assert.isInstanceOf( Y.UndoableAction, action );
        Y.Assert.isNumber( index );
    }, this) );

    this.undoManager.on( "actionMerged", Y.bind( function(attrs){
        var action = attrs.action;
        var mergedAction = attrs.mergedAction;

        Y.Assert.isInstanceOf( Y.UndoableAction, action );
        Y.Assert.isInstanceOf( Y.UndoableAction, mergedAction );
    }, this) );

    this.undoManager.on( "actionRedone", Y.bind( function(attrs){
        var action = attrs.action;
        var index = attrs.index;

        Y.Assert.isInstanceOf( Y.UndoableAction, action );
        Y.Assert.isNumber( index );
    }, this) );


    this.undoManager.on( "actionUndone", Y.bind( function(attrs){
        var action = attrs.action;
        var index = attrs.index;

        Y.Assert.isInstanceOf( Y.UndoableAction, action );
        Y.Assert.isNumber( index );
    }, this) );

    var testSynchronousActions = new Y.Test.Case({
        name: "Test synchronous action",

        testAddActions: function(){
            var undoableAction, canUndo, canRedo, i;

            for( i = 0; i < synActions; i++ ){
                undoableAction = new TestUndoableAction({
                  "label" : "Action: " + i
                });

                undoableAction.redo();
                that.undoManager.add( undoableAction );
            }

            canUndo = that.undoManager.canUndo();
            canRedo = that.undoManager.canRedo();

            Y.Assert.areEqual( true, canUndo, "Undoing must be allowed" );
            Y.Assert.areEqual( false, canRedo, "Redoing must be not allowed" );
            Y.Assert.areEqual( synActions, testArray.length, "There must be " + synActions + " actions in testArray" );
            Y.Assert.areEqual( synActions, that.undoManager.get( "undoIndex" ), "Undo index must be: " + synActions );
        },

        testUndoAction: function(){
            var undoIndex, i;

            for( i = synActions - 1; i > 0; i-- ){
                that.undoManager.undo();
                undoIndex = that.undoManager.get( "undoIndex" );
                Y.Assert.areEqual( i, undoIndex, "Undo index must be: " + i );
                Y.Assert.areEqual( true, that.undoManager.canUndo(), "Undoing must be allowed" );
                Y.Assert.areEqual( true, that.undoManager.canRedo(), "Redoing must be allowed" );
                Y.Assert.areEqual( i, testArray.length, "Test array must contain:" + i + " actions" );
            }

            that.undoManager.undo();
            undoIndex = that.undoManager.get( "undoIndex" );
            Y.Assert.areEqual( 0, undoIndex, "Undo index must be: " + 0 );
            Y.Assert.areEqual( false, that.undoManager.canUndo(), "Undoing must be not allowed" );
            Y.Assert.areEqual( true, that.undoManager.canRedo(), "Redoing must be allowed" );

            Y.Assert.areEqual( 0, testArray.length, "Test array must be empty" );
        },

        testRedoAction: function(){
            var undoIndex, i;

            for( i = 0; i < synActions - 1; i++ ){
                that.undoManager.redo();
                undoIndex = that.undoManager.get( "undoIndex" );
                Y.Assert.areEqual( i + 1, undoIndex, "Undo index must be: " + (i + 1) );
                Y.Assert.areEqual( true, that.undoManager.canUndo(), "Undoing must be allowed" );
                Y.Assert.areEqual( true, that.undoManager.canRedo(), "Redoing must be allowed" );
                Y.Assert.areEqual( i + 1, testArray.length, "Test array must contain:" + (i + 1) + " actions" );
            }

            that.undoManager.redo();
            undoIndex = that.undoManager.get( "undoIndex" );
            Y.Assert.areEqual( synActions, undoIndex, "Undo index must be: " + synActions );
            Y.Assert.areEqual( true, that.undoManager.canUndo(), "Undoing must be allowed" );
            Y.Assert.areEqual( false, that.undoManager.canRedo(), "Redoing must be not allowed" );
        },

        testMultipleUndo: function(){
            var undoIndex;

            that.undoManager.processTo( 0 );

            undoIndex = that.undoManager.get( "undoIndex" );
            Y.Assert.areEqual( 0, undoIndex, "Undo index must be: " + 0 );
            Y.Assert.areEqual( 0, testArray.length, "Test array must be ampty" );
        },

        testMultipleRedo: function(){
            var undoIndex;

            that.undoManager.processTo( synActions );

            undoIndex = that.undoManager.get( "undoIndex" );
            Y.Assert.areEqual( synActions, undoIndex, "Undo index must be: " + synActions );
            Y.Assert.areEqual( synActions, testArray.length, "Test array must contain " + synActions + "actions" );
        }
    });


    var testSynchronousActionsLimit = new Y.Test.Case({

        prepareLimitTest : function(){
            var undoableAction, i;

            that.undoManager.purgeAll();
            that.undoManager.set( "limit", 0 );

            for( i = 0; i < 5; i++ ){
                undoableAction = new TestUndoableAction({
                  "label" : "Action" + i
                });

                that.undoManager.add(undoableAction);
            }
        },

        testSetLimit: function(){
            var undoableAction, actions;

            actions = that.undoManager._actions;
            that.undoManager.set( "limit", synActions );

            undoableAction = new TestUndoableAction({
              "label" : "Action, added after limit"
            });

            that.undoManager.add( undoableAction );

            Y.Assert.areEqual( synActions, testArray.length, "There must be total: " + synActions );
            Y.Assert.areEqual( undoableAction, actions[ actions.length - 1 ], "The new added action must be the last one" );

            // set unlimited number of actions
            that.undoManager.set( "limit", 0 );
            Y.Assert.areEqual( 0, that.undoManager.get( "limit" ), "The number of actions must be unlimited now" );
        },

        testLimitTo1Action: function(){
            var actions = that.undoManager._actions, undoableAction;

            that.undoManager.purgeAll();
            that.undoManager.set( "limit", 1 );

            undoableAction = new TestUndoableAction({
              "label" : "Action0"
            });
            that.undoManager.add( undoableAction );

            Y.Assert.areEqual( 1, actions.length, "There must be 1 item" );
            Y.Assert.areEqual( "Action0", actions[0].get( "label" ), "Label must be Action0" );

            undoableAction = new TestUndoableAction({
              "label" : "Action1"
            });
            that.undoManager.add( undoableAction );

            Y.Assert.areEqual( 1, actions.length, "There must be 1 item" );
            Y.Assert.areEqual( "Action1", actions[0].get( "label" ), "Label must be Action1" );

            undoableAction = new TestUndoableAction({
              "label" : "Action2"
            });
            that.undoManager.add( undoableAction );

            Y.Assert.areEqual( 1, actions.length, "There must be 1 item" );
            Y.Assert.areEqual( "Action2", actions[0].get( "label" ), "Label must be Action2" );
        },

        testSetLimit0: function(){
            var actions = that.undoManager._actions;

            this.prepareLimitTest();
            that.undoManager.processTo(0);
            that.undoManager.set( "limit", 3 );

            Y.Assert.areEqual( 3, actions.length, "There must be 3 actions" );
            Y.Assert.areEqual( "Action0", actions[0].get( "label" ), "Label must be Action0" );
            Y.Assert.areEqual( "Action1", actions[1].get( "label" ), "Label must be Action1" );
            Y.Assert.areEqual( "Action2", actions[2].get( "label" ), "Label must be Action2" );
        },

        testSetLimit1: function(){
            var actions = that.undoManager._actions;

            this.prepareLimitTest();
            that.undoManager.processTo(1);
            that.undoManager.set( "limit", 3 );

            Y.Assert.areEqual( 3, actions.length, "There must be 3 actions" );
            Y.Assert.areEqual( "Action0", actions[0].get( "label" ), "Label must be Action0" );
            Y.Assert.areEqual( "Action1", actions[1].get( "label" ), "Label must be Action1" );
            Y.Assert.areEqual( "Action2", actions[2].get( "label" ), "Label must be Action2" );
        },

        testSetLimit2: function(){
            var actions = that.undoManager._actions;

            this.prepareLimitTest();
            that.undoManager.processTo( 2 );
            that.undoManager.set( "limit", 3 );

            Y.Assert.areEqual( 3, actions.length, "There must be 3 actions" );
            Y.Assert.areEqual( "Action0", actions[0].get( "label" ), "Label must be Action0" );
            Y.Assert.areEqual( "Action1", actions[1].get( "label" ), "Label must be Action1" );
            Y.Assert.areEqual( "Action2", actions[2].get( "label" ), "Label must be Action2" );
        },

        testSetLimit3: function(){
            var actions = that.undoManager._actions;

            this.prepareLimitTest();
            that.undoManager.processTo( 3 );
            that.undoManager.set( "limit", 3 );

            Y.Assert.areEqual( 3, actions.length, "There must be 3 actions" );
            Y.Assert.areEqual( "Action1", actions[0].get( "label" ), "Label must be Action1" );
            Y.Assert.areEqual( "Action2", actions[1].get( "label" ), "Label must be Action2" );
            Y.Assert.areEqual( "Action3", actions[2].get( "label" ), "Label must be Action3" );
        },

        testSetLimit4: function(){
            var actions = that.undoManager._actions;

            this.prepareLimitTest();
            that.undoManager.processTo( 4 );
            that.undoManager.set( "limit", 3 );

            Y.Assert.areEqual( 3, actions.length, "There must be 3 actions" );
            Y.Assert.areEqual( "Action2", actions[0].get( "label" ), "Label must be Action2" );
            Y.Assert.areEqual( "Action3", actions[1].get( "label" ), "Label must be Action3" );
            Y.Assert.areEqual( "Action4", actions[2].get( "label" ), "Label must be Action4" );
        },

        testSetLimit5: function(){
            var actions = that.undoManager._actions;

            this.prepareLimitTest();
            that.undoManager.processTo( 5 );
            that.undoManager.set( "limit", 3 );

            Y.Assert.areEqual( 3, actions.length, "There must be 3 actions" );
            Y.Assert.areEqual( "Action2", actions[0].get( "label" ), "Label must be Action2" );
            Y.Assert.areEqual( "Action3", actions[1].get( "label" ), "Label must be Action3" );
            Y.Assert.areEqual( "Action4", actions[2].get( "label" ), "Label must be Action4" );
        },

        testSetLimit6: function(){
            var actions = that.undoManager._actions;

            this.prepareLimitTest();
            that.undoManager.processTo(1);
            that.undoManager.set( "limit", 4 );

            Y.Assert.areEqual( 4, actions.length, "There must be 4 actions" );
            Y.Assert.areEqual( "Action0", actions[0].get( "label" ), "Label must be Action0" );
            Y.Assert.areEqual( "Action1", actions[1].get( "label" ), "Label must be Action1" );
            Y.Assert.areEqual( "Action2", actions[2].get( "label" ), "Label must be Action2" );
            Y.Assert.areEqual( "Action3", actions[3].get( "label" ), "Label must be Action3" );
        },

        testSetLimit7: function(){
            var actions = that.undoManager._actions;

            this.prepareLimitTest();
            that.undoManager.processTo(2);
            that.undoManager.set( "limit", 4 );

            Y.Assert.areEqual( 4, actions.length, "There must be 4 actions" );
            Y.Assert.areEqual( "Action0", actions[0].get( "label" ), "Label must be Action0" );
            Y.Assert.areEqual( "Action1", actions[1].get( "label" ), "Label must be Action1" );
            Y.Assert.areEqual( "Action2", actions[2].get( "label" ), "Label must be Action2" );
            Y.Assert.areEqual( "Action3", actions[3].get( "label" ), "Label must be Action3" );
        },

        testSetLimit8: function(){
            var actions = that.undoManager._actions;

            this.prepareLimitTest();
            that.undoManager.processTo(3);
            that.undoManager.set( "limit", 4 );

            Y.Assert.areEqual( 4, actions.length, "There must be 4 actions" );
            Y.Assert.areEqual( "Action1", actions[0].get( "label" ), "Label must be Action1" );
            Y.Assert.areEqual( "Action2", actions[1].get( "label" ), "Label must be Action2" );
            Y.Assert.areEqual( "Action3", actions[2].get( "label" ), "Label must be Action3" );
            Y.Assert.areEqual( "Action4", actions[3].get( "label" ), "Label must be Action4" );
        },

        testSetLimit9: function(){
            var actions = that.undoManager._actions;

            this.prepareLimitTest();
            that.undoManager.processTo(4);
            that.undoManager.set( "limit", 4 );

            Y.Assert.areEqual( 4, actions.length, "There must be 4 actions" );
            Y.Assert.areEqual( "Action1", actions[0].get( "label" ), "Label must be Action1" );
            Y.Assert.areEqual( "Action2", actions[1].get( "label" ), "Label must be Action2" );
            Y.Assert.areEqual( "Action3", actions[2].get( "label" ), "Label must be Action3" );
            Y.Assert.areEqual( "Action4", actions[3].get( "label" ), "Label must be Action4" );
        },

        testSetLimit10: function(){
            var actions = that.undoManager._actions;

            this.prepareLimitTest();
            that.undoManager.processTo(3);
            that.undoManager.set( "limit", 2 );

            Y.Assert.areEqual( 2, actions.length, "There must be 2 actions" );
            Y.Assert.areEqual( "Action2", actions[0].get( "label" ), "Label must be Action2" );
            Y.Assert.areEqual( "Action3", actions[1].get( "label" ), "Label must be Action3" );
        }
    });


    var testPurgeActions = new Y.Test.Case({
        testPurgeActions : function(){
            var i, undoableAction, maxActions = 10, targetIndex, actions;

            that.undoManager.purgeAll();
            that.undoManager.set( "limit", 0 );

            for( i = 0; i < maxActions; i++ ){
                undoableAction = new TestUndoableAction({
                  "label" : "Action" + i
                });

                that.undoManager.add(undoableAction);
            }

            maxActions = parseInt(maxActions/2, 10);
            targetIndex = parseInt( maxActions - 1, 10);

            that.undoManager.processTo(targetIndex);
            that.undoManager.purgeTo( maxActions );

            actions = that.undoManager._actions;
            Y.Assert.areEqual( maxActions, actions.length, "There must be ", maxActions, " actions" );
            Y.Assert.areEqual( targetIndex, that.undoManager.get( "undoIndex" ), "Undo index must be " + targetIndex );


            that.undoManager.purgeTo( maxActions ); // must do nothing
            Y.Assert.areEqual( maxActions, actions.length, "There must be ", maxActions, " actions" );
            Y.Assert.areEqual( targetIndex, that.undoManager.get( "undoIndex" ), "Undo index must be " + targetIndex );

            maxActions -= 1;
            that.undoManager.purgeTo( maxActions );
            Y.Assert.areEqual( maxActions, actions.length, "There must be ", maxActions, " actions" );
            Y.Assert.areEqual( targetIndex, that.undoManager.get( "undoIndex" ), "Undo index must be " + targetIndex );


            that.undoManager.undo();
            Y.Assert.areEqual( maxActions, actions.length, "There must be ", maxActions, " actions" );
            Y.Assert.areEqual( targetIndex - 1, that.undoManager.get( "undoIndex" ), "Undo index must be " + targetIndex - 1 );


            that.undoManager.redo();
            Y.Assert.areEqual( maxActions, actions.length, "There must be ", maxActions, " actions" );
            Y.Assert.areEqual( targetIndex, that.undoManager.get( "undoIndex" ), "Undo index must be " + targetIndex );
        }
    });


     var testMergeActions = new Y.Test.Case({
        name: "Test merging action",

        testMergeActions: function(){
            var number1 = 2, number2 = 3;

            var undoableAction = new UndoableActionMerge({
              number: number1
            });

            undoableAction.redo();
            that.undoManager.add( undoableAction );

            undoableAction = new UndoableActionMerge({
              number: number2
            });

            undoableAction.redo();
            that.undoManager.add( undoableAction );

            Y.Assert.areEqual( 5, total, "Total number must be " + (number1 + number2) );
        }
     });

    Y.Test.Runner.add(testSynchronousActions);
    Y.Test.Runner.add(testSynchronousActionsLimit);
    Y.Test.Runner.add(testPurgeActions);
    Y.Test.Runner.add(testMergeActions);

    console = new Y.Console({
        verbose : false,
        printTimeout: 0,
        newestOnTop : false,

        entryTemplate: '<pre class="{entry_class} {cat_class} {src_class}">'+
                '<span class="{entry_cat_class}">{label}</span>'+
                '<span class="{entry_content_class}">{message}</span>'+
        '</pre>'
    }).render();

    Y.Test.Runner.run();
});