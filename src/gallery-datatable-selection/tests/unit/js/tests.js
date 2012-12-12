YUI.add( 'module-tests', function(Y){

//=================  Display DT onscreen, so I know what I'm testing for !  =======================


    function DtSelectionTable(){
    var config = {
        columns : [ 'tid','title','tname', {key:'tdate', label:'A Date'}, 'tint', 'tflt'  ],

        data: [
            {tid:100, title:'title A', tname:'Name A', tdate:new Date(2012,7,21), tint: 12, tflt:9876.54321 },
            {tid:200, title:'title B', tname:'Name B', tdate:new Date(2012,7,25), tint: 34, tflt:9876.54321 },
            {tid:300, title:'title C', tname:'Name C', tdate:new Date(2012,7,16), tint: 56, tflt:9876.54321 },
            {tid:400, title:'title D', tname:'Name D', tdate:new Date(2012,7,1), tint: 78, tflt:9876.54321 }
        ],

        selectionMode: 'row',
        highlightMode: 'cell',
        selectionMulti: true

    };

    var dt = new Y.DataTable(config).render('#tableDiv');

    }


//=================  Setup TEST cases  =======================

    (new Y.Test.Console({
       verbose : true,
       newestOnTop : false,
       filters:{ pass: true }
    })).render('#logger');


    Y.Test.Runner.add(
        new Y.Test.Case({

            name : "DataTable selection module tests",

            //---------------------------------------------------------------------
            // setUp and tearDown methods - optional
            //---------------------------------------------------------------------

            /*
             * Sets up data that is needed by each test.
             */
            setUp : function () {

               var config = {
                    columns : [ 'tid','title','tname', {key:'tdate', label:'A Date'}, 'tint', 'tflt'  ],
                    data: [
                         {tid:100, title:'title A', tname:'Name A', tdate:new Date(2012,7,21), tint: 123456, tflt:9876.54321 },
                         {tid:200, title:'title B', tname:'Name B', tdate:new Date(2012,7,25), tint: 123456, tflt:9876.54321 },
                         {tid:333, title:'title C', tname:'Name C', tdate:new Date(2012,7,16), tint: 123456, tflt:9876.54321 },
                         {tid:401, title:'title D', tname:'Name D', tdate:new Date(2012,7,1), tint: 123456, tflt:9876.54321 }
                    ]
               };

               this.config = config;
               this.dt = new Y.DataTable(config).render("#testTableDiv");

            },

            /*
             * Cleans up everything that was created by setUp().
             */
            tearDown : function () {
                if( this.dt ) this.dt.destroy();
                delete this.dt;
            },

            //---------------------------------------------------------------------
            // Test methods - names must begin with "test"
            //---------------------------------------------------------------------

            'Test module existence ' : function () {
                Y.Assert.isNotUndefined(Y.DataTable.Selection);
            },

            'Check attribute existence and defaults' : function () {

                Y.Assert.isNull(this.dt.get('highlighted'),"Default should be null");
                Y.Assert.isNull(this.dt.get('selected'),"Default should be null");
                Y.Assert.areSame('none',this.dt.get('highlightMode'),"Default should be 'none'");
                Y.Assert.areSame('none',this.dt.get('selectionMode'),"Default should be 'null");
                Y.ArrayAssert.isEmpty(this.dt.get('selectedRows'),"Default should be empty Array");
            },

            'Setting selectionMulti' : function () {

                Y.Assert.isFalse( this.dt.get('selectionMulti') );
                this.dt.set('selectionMulti',true);
                Y.Assert.isTrue( this.dt.get('selectionMulti') );

            },

            'Setting selectionMode' : function () {

                Y.Assert.areSame('none',this.dt.get('selectionMode'),"Default should be 'null");
                this.dt.set('selectionMode','row');
                Y.Assert.areSame( "row", this.dt.get('selectionMode') );

                this.dt.set('selectionMode','cell');
                Y.Assert.areSame( "cell", this.dt.get('selectionMode') );

                this.dt.set('selectionMode','foo');
                Y.Assert.areSame( "cell", this.dt.get('selectionMode'), "Should remain at last setting, 'cell'" );

		this.dt.disableSelection();

                Y.Assert.isNull( this.dt.get('selected'), "selected should be null" );
                this.dt.clearAll();

            },

            'Setting highlightMode' : function () {

                Y.Assert.areSame('none',this.dt.get('highlightMode'),"Default should be 'null");
                this.dt.set('highlightMode','row');
                Y.Assert.areSame( "row", this.dt.get('highlightMode') );

                this.dt.set('highlightMode','cell');
                Y.Assert.areSame( "cell", this.dt.get('highlightMode') );

                this.dt.set('highlightMode','foo');
                Y.Assert.areSame( "cell", this.dt.get('highlightMode'), "Should remain at last setting, 'cell'" );
		
            },



            'Formatting of Float field ... adding new  custom formatString and using it' : function () {
            }

        })
    );


    //run the tests
    Y.Test.Runner.run();

});
