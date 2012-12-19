YUI.add( 'module-tests', function(Y){

    var suite = new Y.Test.Suite('gallery-datatable-selection'),
        Assert = Y.Test.Assert;

    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Selection : basic module setup and ATTRS',

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
                Assert.isNotUndefined(Y.DataTable.Selection);
            },

            'Check attribute existence and defaults' : function () {

                Assert.isNull(this.dt.get('highlighted'),"Default should be null");
                Assert.isNull(this.dt.get('selected'),"Default should be null");
                Assert.areSame('none',this.dt.get('highlightMode'),"Default should be 'none'");
                Assert.areSame('none',this.dt.get('selectionMode'),"Default should be 'null");
                Y.ArrayAssert.isEmpty(this.dt.get('selectedRows'),"Default should be empty Array");
                Y.ArrayAssert.isEmpty(this.dt.get('selectedCells'),"Default should be empty Array");
            },

            'Setting selectionMulti' : function () {

                Assert.isFalse( this.dt.get('selectionMulti') );
                this.dt.set('selectionMulti',true);
                Assert.isTrue( this.dt.get('selectionMulti') );
                this.dt.set('selectionMulti',987);
                Assert.isTrue( this.dt.get('selectionMulti'),'selectionMulti should remain true' );

            },

            'Setting selectionMode' : function () {

                Assert.areSame('none',this.dt.get('selectionMode'),"Default should be 'null");
                this.dt.set('selectionMode','row');
                Assert.areSame( "row", this.dt.get('selectionMode') );

                this.dt.set('selectionMode','cell');
                Assert.areSame( "cell", this.dt.get('selectionMode') );

                this.dt.set('selectionMode','foo');
                Assert.areSame( "cell", this.dt.get('selectionMode'), "Should remain at last setting, 'cell'" );

                this.dt.set('selectionMode', 1234);
                Assert.areSame( "cell", this.dt.get('selectionMode'), "Should remain at last setting, 'cell'" );

                this.dt.set('selectionMode', false);
                Assert.areSame( "cell", this.dt.get('selectionMode'), "Should remain at last setting, 'cell'" );

		        this.dt.disableSelection();

                Assert.isNull( this.dt.get('selected'), "selected should be null" );
                this.dt.clearAll();

		        this.dt.enableSelection();
                Assert.areSame( "cell", this.dt.get('selectionMode'), "Should remain at last setting, 'cell'" );

            },

            'Setting highlightMode' : function () {

                Assert.areSame('none',this.dt.get('highlightMode'),"Default should be 'null");
                this.dt.set('highlightMode','row');
                Assert.areSame( "row", this.dt.get('highlightMode') );

                this.dt.set('highlightMode','cell');
                Assert.areSame( "cell", this.dt.get('highlightMode') );

                this.dt.set('highlightMode','foo');
                Assert.areSame( "cell", this.dt.get('highlightMode'), "Should remain at last setting, 'cell'" );

                this.dt.set('highlightMode', 1234);
                Assert.areSame( "cell", this.dt.get('highlightMode'), "Should remain at last setting, 'cell'" );

                this.dt.set('highlightMode', true);
                Assert.areSame( "cell", this.dt.get('highlightMode'), "Should remain at last setting, 'cell'" );

            },

            'Default selected, selectedRows and selectedCells' : function () {

                Assert.areSame( "none", this.dt.get('selectionMode'), "Default should be null" );
                Assert.areSame('none',this.dt.get('highlightMode'),"Default should be 'null");

   		        this.dt.enableSelection();
                Assert.areSame( "none", this.dt.get('selectionMode'), "Default should be null" );
                Assert.areSame('none',this.dt.get('highlightMode'),"Default should be 'null");

                this.dt.set('selectionMode','cell');
                Assert.areSame( "cell", this.dt.get('selectionMode'), "Default should be null" );

                this.dt.set('highlightMode','row');
                Assert.areSame( "row", this.dt.get('highlightMode'), "Default should be null" );

                Assert.isNull( null, this.dt.get('selected'), "Default should be null" );
                Assert.isNull( null, this.dt.get('highlighted'), "Default should be null" );

            },

            'Check destructor' : function () {

   		        this.dt.enableSelection();
                this.dt.set('selectionMode','cell');
                this.dt.set('highlightMode','row');
                this.dt.set('selectionMulti',true);

                this.dt.destroy();

                Assert.isNull( null, this.dt.get('highlighted'), "Default should be null" );
                Assert.isNull( this.dt._subscrHighlight, "Default should be null" );
                Assert.isNull( this.dt._subscrSelect, "Default should be null" );
                Assert.isNull( this.dt._subscrSelectComp, "Default should be null" );

            }


    }));

    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Selection : single row and cell selections',
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
           this.dt = new Y.DataTable(config);
           this.dt.render("#testTableDiv");

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

        'Select row 1 and then row 3 ' : function () {

            var trows = this.dt.get('contentBox').one('.'+this.dt.getClassName('data')).all('tr');

        // select row index 0
            this.dt.set('selectionMode','row');
            trows.item(0).one('td').simulate('click');

            var selTr = this.dt.get('selected');
            Assert.areSame( trows.item(0).one('td'), selTr, 'selected TD should be first');

            var selrows = this.dt.get('selectedRows');
            Assert.areSame( 1, selrows.length,  'selectedRows should be array of one');
            Assert.areSame( this.dt.data.item(0), selrows[0].record,  'selectedRows record should be first');
            Assert.areSame( 0, selrows[0].recordIndex, 'selectedRows recordindex should be 0');
            Assert.areSame( trows.item(0), selrows[0].tr, 'selectedRows TR should be first');


        // select row index 2
            trows.item(2).all('td').item(3).simulate('click');

            selTr = this.dt.get('selected');
            Assert.areSame( trows.item(2).all('td').item(3), selTr, 'selected TD should be 4th');

            selrows = this.dt.get('selectedRows');
            Assert.areSame( 1, selrows.length,  'selectedRows should be array of one');
            Assert.areSame( this.dt.data.item(2), selrows[0].record,  'selectedRows record should be first');
            Assert.areSame( 2, selrows[0].recordIndex, 'selectedRows recordindex should be 0');
            Assert.areSame( trows.item(2), selrows[0].tr, 'selectedRows TR should be first');

            Assert.areSame( 6, this.dt.get('selectedCells').length, 'selectedCells should be 6');

        },

        'Highlight row 1 and then row 3 ' : function () {
            var trows, sel, tds;

            trows = this.dt.get('contentBox').one('.'+this.dt.getClassName('data')).all('tr');
            tds = trows.item(0).all('td');

        // select row index 0
            this.dt.set('highlightMode','row');
            tds.item(0).simulate('mouseover');

            sel = this.dt.get('highlighted');
            Assert.areSame( tds.item(0), sel, 'highlighted TD should be 1st');

        // select row index 2
            tds = trows.item(2).all('td');
            tds.item(4).simulate('mouseover');

            sel = this.dt.get('highlighted');
            Assert.areSame( tds.item(4), sel, 'highlighted TD should be 5th');

        }


    }));



    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Selection : multi row and cell selections',
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
                ],

                selectionMulti : true
            };

            this.config = config;
            this.dt = new Y.DataTable(config);
            this.dt.render("#testTableDiv");

        },

        /*
         * Cleans up everything that was created by setUp().
         */
        tearDown : function () {
            if( this.dt ) {
                this.dt.destroy();
                this.config = null;
            }
            delete this.dt;
        },


        'Select row 1 and row 3 simultaneously ' : function () {
            var trows, sel, tds, cobj = {};

            trows = this.dt.get('contentBox').one('.'+this.dt.getClassName('data')).all('tr');

            // select row index 0
            this.dt.set('selectionMode','row');
            trows.item(0).one('td').simulate('click');

            var selTr = this.dt.get('selected');
            Assert.areSame( trows.item(0).one('td'), selTr, 'selected TD should be first');

            var selrows = this.dt.get('selectedRows');
            Assert.areSame( 1, selrows.length,  'selectedRows should be array of one');
            Assert.areSame( 0, selrows[0].recordIndex, 'selectedRows recordindex should be 0');


            // now select row index 2, in multi mode ...

            var cprop = ( Y.UA.os.search('macintosh') === 0 ) ? 'metaKey' : 'ctrlKey';
            cobj[cprop] = true;
            trows.item(2).all('td').item(4).simulate('click',cobj);

            selTr = this.dt.get('selected');
            Assert.areSame( trows.item(2).all('td').item(4), selTr, 'selected TD should be 5th');

            selrows = this.dt.get('selectedRows');
            Assert.areSame( 2, selrows.length,  'selectedRows should be array of two');
            Assert.areSame( this.dt.data.item(0), selrows[0].record,  'selectedRows record should be first');
            Assert.areSame( this.dt.data.item(2), selrows[1].record,  'selectedRows record should be third');
            Assert.areSame( 0, selrows[0].recordIndex, 'selectedRows recordindex should be 0');
            Assert.areSame( 2, selrows[1].recordIndex, 'selectedRows recordindex should be 2');

            Assert.areSame( 2*trows.item(0).all('td').size(), this.dt.get('selectedCells').length, 'selectedCells should be 12');

        },

        'Select range from row 0 cell 1 to row 2 cell 5' : function () {
            var trows, sel, tds, cobj = {};

            trows = this.dt.get('contentBox').one('.'+this.dt.getClassName('data')).all('tr');

        // select row index 0
            this.dt.set('selectionMode','cell');
            trows.item(0).all('td').item(1).simulate('click');

            Assert.areSame( trows.item(0).all('td').item(1), this.dt.get('selected'), 'selected TD should be first');

            var selrows = this.dt.get('selectedRows');
            Assert.areSame( 1, selrows.length,  'selectedRows should be array of one');
            Assert.areSame( 0, selrows[0].recordIndex, 'selectedRows recordindex should be 0');


        // now select row index 2, in range mode ...
            cobj.shiftKey = true;
            trows.item(2).all('td').item(4).simulate('click',cobj);

            selTr = this.dt.get('selected');
            Assert.areSame( trows.item(2).all('td').item(4), selTr, 'selected TD should be 5th');

            selrows = this.dt.get('selectedRows');
            Assert.areSame( 3, selrows.length,  'selectedRows should be array of three');
            Assert.areSame( this.dt.data.item(0), selrows[0].record,  'selectedRows record 0 should be first');
            Assert.areSame( this.dt.data.item(2), selrows[2].record,  'selectedRows record 2 should be third');
            Assert.areSame( 0, selrows[0].recordIndex, 'selectedRows recordindex should be 0');
            Assert.areSame( 2, selrows[2].recordIndex, 'selectedRows recordindex should be 2');
            Assert.areSame( 12, this.dt.get('selectedCells').length, 'selectedCells should be 12');

        },

        'Select rows range from row 1 to row 2 cell 5' : function () {
            var trows, sel, tds, cobj = {};

            trows = this.dt.get('contentBox').one('.'+this.dt.getClassName('data')).all('tr');

            // select row index 1
            this.dt.set('selectionMode','row');
            trows.item(1).all('td').item(1).simulate('click');  // row #2

            Assert.areSame( trows.item(1).all('td').item(1), this.dt.get('selected'), 'selected TD should be first');

            var selrows = this.dt.get('selectedRows');
            Assert.areSame( 1, selrows.length,  'selectedRows should be array of one');
            Assert.areSame( 1, selrows[0].recordIndex, 'selectedRows recordindex should be 1');


            // now select row index 2, in range mode ...
            cobj.shiftKey = true;
            trows.item(2).all('td').item(4).simulate('click',cobj);      // row #3

            selTr = this.dt.get('selected');
            Assert.areSame( trows.item(2).all('td').item(4), selTr, 'selected TD should be 5th');

            selrows = this.dt.get('selectedRows');
            Assert.areSame( 2, selrows.length,  'selectedRows should be array of two');
            Assert.areSame( this.dt.data.item(1), selrows[0].record,  'selectedRows record 0 should be first');
            Assert.areSame( this.dt.data.item(2), selrows[1].record,  'selectedRows record 2 should be third');
            Assert.areSame( 1, selrows[0].recordIndex, 'selectedRows recordindex should be 1');
            Assert.areSame( 2, selrows[1].recordIndex, 'selectedRows recordindex should be 2');
            Assert.areSame( 12, this.dt.get('selectedCells').length, 'selectedCells should be 12');


        //
        //  select range of cells, check TR's and TD's
        //
            this.dt.clearAll();
            this.dt.set('selectionMode','cell');
            trows.item(1).all('td').item(1).simulate('click');    // row #2, cell #2

            Assert.areSame( trows.item(1).all('td').item(1), this.dt.get('selected'), 'selected TD should be first');

            var selrows = this.dt.get('selectedRows');
            Assert.areSame( 1, selrows.length,  'selectedRows should be array of one');
            Assert.areSame( 1, selrows[0].recordIndex, 'selectedRows recordindex should be 1');


            // now select row index 2, in range mode ...
            cobj.shiftKey = true;
            trows.item(2).all('td').item(4).simulate('click',cobj);  // row #3, cell #5

            selTr = this.dt.get('selected');
            Assert.areSame( trows.item(2).all('td').item(4), selTr, 'selected TD should be 5th');

            selrows = this.dt.get('selectedRows');
            Assert.areSame( 2, selrows.length,  'selectedRows should be array of two');
            Assert.areSame( this.dt.data.item(1), selrows[0].record,  'selectedRows record 0 should be first');
            Assert.areSame( this.dt.data.item(2), selrows[1].record,  'selectedRows record 2 should be third');
            Assert.areSame( 8, this.dt.get('selectedCells').length, 'selectedCells should be 8');


        //
        //  multi click last row
        //
            cobj.shiftKey = false;
            var cprop = ( Y.UA.os.search('macintosh') === 0 ) ? 'metaKey' : 'ctrlKey';
            cobj[cprop] = true;
            trows.item(3).all('td').item(4).simulate('click',cobj);

        },

        'Select rows by setting ATTR selectedRows' : function () {
            // select row index 1
            this.dt.set('selectionMode','row');
            this.dt.set('selectedRows',[0,1,3]);

            var selrows = this.dt.get('selectedRows');
            Assert.areSame( 3, selrows.length,  'selectedRows should be array of three');
            Assert.areSame( 0, selrows[0].recordIndex, 'selectedRows recordindex should be 0');
            Assert.areSame( 1, selrows[1].recordIndex, 'selectedRows recordindex should be 1');
            Assert.areSame( 3, selrows[2].recordIndex, 'selectedRows recordindex should be 3');

        },

        'Select cells by setting ATTR selectedCells' : function () {
            // select row index 1
            this.dt.set('selectionMode','row');
            this.dt.set('selectedCells',[
                {record:0, column:0},
                {record:0, column:'tint'},
                {record:2, column:4 }
            ]);

            var selrows = this.dt.get('selectedRows');
            Assert.areSame( 2, selrows.length,  'selectedRows should be array of two');

            var cells = this.dt.get('selectedCells');
            Assert.areSame( 3, cells.length, 'selectedCells should be array of 3')

        }

    }));


    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Selection : sorting and checking selections',
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
                ],
                sortable: true,
                selectionMulti : true
            };

            this.config = config;
            this.dt = new Y.DataTable(config);
            this.dt.render("#testTableDiv");

        },

        /*
         * Cleans up everything that was created by setUp().
         */
        tearDown : function () {
            if( this.dt ) {
                this.dt.destroy();
                this.config = null;
            }
            delete this.dt;
        },


        'Select row 1 and row 3 simultaneously ' : function () {
            var trows, ths, sel, tds, cobj = {};

            ths = this.dt.get('contentBox').one('.'+this.dt.getClassName('columns')).all('th');
            trows = this.dt.get('contentBox').one('.'+this.dt.getClassName('data')).all('tr');

            // select row index 0
            this.dt.set('selectionMode','cell');
            this.dt.set('selectionMulti',true);
            trows.item(0).all('td').item(0).simulate('click');  // cell content 100

            var cprop = ( Y.UA.os.search('macintosh') === 0 ) ? 'metaKey' : 'ctrlKey';
            cobj[cprop] = true;

            trows.item(2).all('td').item(2).simulate('click',cobj);  // cell content Name C

            var selrows = this.dt.get('selectedRows');
            Assert.areSame( 2, selrows.length,  'selectedRows should be array of two');

            var seltds = this.dt.get('selectedCells');
            Assert.areSame( 2, seltds.length,  'selectedCells should be array of two');
            Assert.areSame( 100, +seltds[0].td.getHTML(),  'selectedCells should be array of two');
            Assert.areSame( 'Name C', seltds[1].td.getHTML(),  'selectedCells should be array of two');

        // now sort by 'tdate' field
/*
            ths.item(3).simulate('click');
            selrows = this.dt.get('selectedRows');
            Assert.areSame( 2, selrows.length,  'selectedRows should be array of two');
            Assert.areSame( 2, selrows[0].recordIndex, 'selectedRows[0] recordindex should be 2');
            Assert.areSame( 1, selrows[1].recordIndex, 'selectedRows[0] recordindex should be 1');
*/


        }

   }));

// methods
//   clearAll, clearSelections, clearHighlighted

    Y.Test.Runner.add(suite);

});
