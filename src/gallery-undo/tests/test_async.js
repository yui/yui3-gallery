
YUI({
    combine: false,
    debug: true,
    filter:"RAW"
}).use('gallery-undo', 'test', 'console', function(Y) {
    var that = this, testArray = [], console, asyncActions = 20;

    function TestAsyncUndoableAction( config ){
        TestAsyncUndoableAction.superclass.constructor.apply( this, arguments );
    }

    Y.extend( TestAsyncUndoableAction, Y.UndoableAction, {
        undo : function(){
            window.setTimeout( Y.bind(function(){
                testArray.splice( -1, 1 );
                this.fire( "undoFinished" );
            }, this), 100 );
        },

        redo : function(){
            window.setTimeout( Y.bind(function(){
                testArray.push( testArray.length );
                this.fire( "redoFinished" );
            }, this), 100 );
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
    

    var testAsynchronousActions = new Y.Test.Case({
        name: "Test asynchronous action",

        testAddActions: function(){
            var undoableAction, canUndo, canRedo, i;

            for( i = 0; i < asyncActions; i++ ){
                undoableAction = new TestAsyncUndoableAction({
                    asyncProcessing: true,
                    label : "Async action: " + i
                });

                testArray.push( testArray.length );
                that.undoManager.add( undoableAction );
            }

            canUndo = that.undoManager.canUndo();
            canRedo = that.undoManager.canRedo();

            Y.Assert.areEqual( true, canUndo, "Undoing must be allowed" );
            Y.Assert.areEqual( false, canRedo, "Redoing must be not allowed" );
            Y.Assert.areEqual( asyncActions, testArray.length, "There must be " + asyncActions + " actions in testArray" );
            Y.Assert.areEqual( asyncActions, that.undoManager.get( "undoIndex" ), "Undo index must be: " + asyncActions );
        },

        testUndoAction: function(){
            var undoIndex, i = asyncActions - 1;

            this._undoFinishedHandler = that.undoManager.subscribe( "undoFinished", Y.bind( function(){
                if( i > 0 ){
                    undoIndex = that.undoManager.get( "undoIndex" );
                    Y.Assert.areEqual( i, undoIndex, "Undo index must be: " + i );
                    Y.Assert.areEqual( true, that.undoManager.canUndo(), "Undoing must be allowed" );
                    Y.Assert.areEqual( true, that.undoManager.canRedo(), "Redoing must be allowed" );
                    Y.Assert.areEqual( i, testArray.length, "Test array must contain:" + i + " items" );
                    that.undoManager.undo();
                } else {
                    undoIndex = that.undoManager.get( "undoIndex" );
                    Y.Assert.areEqual( 0, undoIndex, "Undo index must be: " + 0 );
                    Y.Assert.areEqual( false, that.undoManager.canUndo(), "Undoing must be not allowed" );
                    Y.Assert.areEqual( true, that.undoManager.canRedo(), "Redoing must be allowed" );
                    Y.Assert.areEqual( 0, testArray.length, "Test array must be empty" );

                    this._undoFinishedHandler.detach();
                    this._undoFinishedHandler = null;
                    this.resume();
                }

                --i;
            }, this));

            that.undoManager.undo();
            this.wait( null, 0 );
        },

        testRedoAction: function(){
            var undoIndex, i = 0;

            this._redoFinishedHandler = that.undoManager.subscribe( "redoFinished", Y.bind( function(){
                if( i < asyncActions - 1 ){
                    undoIndex = that.undoManager.get( "undoIndex" );
                    Y.Assert.areEqual( i + 1, undoIndex, "Undo index must be: " + (i + 1) );
                    Y.Assert.areEqual( true, that.undoManager.canUndo(), "Undoing must be allowed" );
                    Y.Assert.areEqual( true, that.undoManager.canRedo(), "Redoing must be allowed" );
                    Y.Assert.areEqual( i + 1, testArray.length, "Test array must contain:" + (i + 1) + " items" );
                    that.undoManager.redo();
                } else {
                    undoIndex = that.undoManager.get( "undoIndex" );
                    Y.Assert.areEqual( asyncActions, undoIndex, "Undo index must be: " + asyncActions );
                    Y.Assert.areEqual( true, that.undoManager.canUndo(), "Undoing must be allowed" );
                    Y.Assert.areEqual( false, that.undoManager.canRedo(), "Redoing must be not allowed" );

                    this._redoFinishedHandler.detach();
                    this._redoFinishedHandler = null;
                    this.resume();
                }

                ++i;
            }, this ));

            that.undoManager.redo();
            this.wait( null, 0 );
        },

        testMultipleUndo: function(){
            var undoIndex;

            this._undoFinishedHandler = that.undoManager.subscribe( "undoFinished", Y.bind( function(){
                undoIndex = that.undoManager.get( "undoIndex" );
                Y.Assert.areEqual( 0, undoIndex, "Undo index must be: " + 0 );
                Y.Assert.areEqual( 0, testArray.length, "Test array must be ampty" );

                this._undoFinishedHandler.detach();
                this._undoFinishedHandler = null;
                this.resume();
            }, this ));

            that.undoManager.processTo( 0 );
            this.wait( null, 0 );
        },

        testMultipleRedo: function(){
            var undoIndex;

            this._redoFinishedHandler = that.undoManager.subscribe( "redoFinished", Y.bind( function(){
                undoIndex = that.undoManager.get( "undoIndex" );
                Y.Assert.areEqual( asyncActions, undoIndex, "Undo index must be: " + asyncActions );
                Y.Assert.areEqual( asyncActions, testArray.length, "Test array must contain " + asyncActions + "actions" );

                this._redoFinishedHandler.detach();
                this._redoFinishedHandler = null;
                this.resume();
            }, this ));

            that.undoManager.processTo( asyncActions );
            this.wait( null, 0 );
        }
    });


    var testAsynchronousActionsLimit = new Y.Test.Case({
        testSetLimit: function(){
            var undoableAction, actions;

            actions = that.undoManager._actions;
            that.undoManager.set( "limit", asyncActions );

            undoableAction = new TestAsyncUndoableAction({
                asyncProcessing : true,
                "label" : "Action, added after limit"
            });

            that.undoManager.add( undoableAction );

            Y.Assert.areEqual( asyncActions, testArray.length, "There must be total: " + asyncActions );
            Y.Assert.areEqual( undoableAction, actions[ actions.length - 1 ], "The new added action must be the last one" );

            // set unlimited number of actions
            that.undoManager.set( "limit", 0 );
            Y.Assert.areEqual( 0, that.undoManager.get( "limit" ), "The number of actions must be unlimited now" );
        }
    });


    Y.Test.Runner.add(testAsynchronousActions);
    Y.Test.Runner.add(testAsynchronousActionsLimit);


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