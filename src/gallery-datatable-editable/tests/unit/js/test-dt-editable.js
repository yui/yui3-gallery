YUI.add('module-tests-dteditable', function(Y) {

    var suite = new Y.Test.Suite('gallery-datatable-editable'),
        Assert = Y.Test.Assert;

    // a blocking sleep function ... easier than Y.later or timeout crap
    function sleep(msecs){
        var tstart = new Date().getTime();
        while( new Date().getTime() < tstart + msecs );
        return;
    }


    function makeDT( colChoice, config_arg ) {
        config_arg = config_arg || {};

        var someData = [
            {sid:10, sname:'Sneakers', sopen:0, stype:0, stock:0, sprice:59.93, shipst:'s', sdate:new Date(2009,3,11) },
            {sid:11, sname:'Varnished Cane Toads', sopen:1,  stype:10, stock:2, shipst:'u', sprice:17.49, sdate:new Date(2009,4,12) },
            {sid:12, sname:'JuJu Beans', sopen:0,  stype:20, stock:1, sprice:1.29, shipst:'s', sdate:new Date(2009,5,13) },
            {sid:13, sname:'Tent Stakes', sopen:1,  stype:30, stock:1, sprice:7.99, shipst:'n', sdate:new Date(2010,6,14) },
            {sid:14, sname:'Peanut Butter', sopen:0,  stype:40, stock:0, sprice:3.29, shipst:'e', sdate:new Date(2011,7,15) },
            {sid:15, sname:'Garbage Bags', sopen:1, stype:50,  stock:2, sprice:17.95, shipst:'r', sdate:new Date(2012,8,18) }
        ];

        // enlarge the dataset
        Y.Array.each(someData,function(d,di){
            d.sdesc = 'Description for Item ' + d.sid + ' : ' + d.sname;
        });
     //   someData = someData.concat(someData,someData);

        //
        // Define some Arrays / Object Hashes to be used by formatters / editor options ...
        //
        var stypes = [
            {value:0,  text:'Standard'},
            {value:10, text:'Improved'},
            {value:20, text:'Deluxe'},
            {value:30, text:'Better'},
            {value:40, text:'Subpar'},
            {value:50, text:'Junk'}
        ];

        var shipTypes = { s:'Shipped', u:'Unknown', n:'Not Shipped', e:'Expedited', r:'Returned' };

        var stypesObj = {};
        Y.Array.each(stypes,function(r){
            stypesObj[r.value] = r.text;
        });

        var stock = { 0:'No ', 1:'Yes ', 2:'B/O ' };
        var sopen = { 0:'No', 1:'Yes'};

    //
    // We use pre-named editors on the "editor" property of the Columns,
    //   in some cases, editorConfig are added to provide stuff to pass to the editor Instance ...

       var colsNoediting = [
            { key:'sid',  editable:false },
            { key:'sopen' },
            { key:'sname' },
            { key:'sdesc' },
            { key:'stype' },
            { key:'stock' },
            { key:'sprice' },
            { key:'sdate' }
        ];

        var colsBasicEditing = [
            { key:'sid',    label:"sID", editable:false },
            { key:'sopen',  label:"Open?",
                  editor:"checkbox", editorConfig:{
                    checkboxHash:{ 'true':1, 'false':0 }
                  }
                },

                { key:'sname',  label:"Item Name"
                  //editor:"text", editorConfig:{ offsetXY: [5,5] }
                },

                { key:'sdesc',  label:"Description",  editor:"textarea" },

                { key:'stype',  label:"Condition",
              //    formatter:"custom", formatConfig:stypesObj,
                  editor:"select",
                  editorConfig:{
                      selectOptions:  stypesObj, //stypes,
                      templateEngine:Y.Handlebars
                  }
                },

                { key:'stock',  label:"In Stock?",
              //    formatter:"custom", formatConfig:stock,
                  editor:"radio",
                  editorConfig:{
                      radioOptions:stock,
                      overlayWidth: 260,
                      templateEngine:Y.Handlebars
                  }
                },

                { key:'sprice', label:"Retail Price"  },

                { key:'sdate',  label:"Trans Date"         }
            ];

        var colsEditing = [
                { key:'sid',    label:"sID", editable:false },

                { key:'sopen',  label:"Open?",
              //    formatter:"custom", formatConfig:sopen,
                  editor:"checkbox", editorConfig:{
                    checkboxHash:{ 'true':1, 'false':0 }
                  }
                },

                { key:'sname',  label:"Item Name"
                  //editor:"text", editorConfig:{ offsetXY: [5,5] }
                },

                { key:'sdesc',  label:"Description",  editor:"textarea" },

                { key:'stype',  label:"Condition",
              //    formatter:"custom", formatConfig:stypesObj,
                  editor:"select",
                  editorConfig:{
                      selectOptions:  stypesObj, //stypes,
                      templateEngine:Y.Handlebars
                  }
                },

                { key:'stock',  label:"In Stock?",
              //    formatter:"custom", formatConfig:stock,
                  editor:"radio",
                  editorConfig:{
                      radioOptions:stock,
                      overlayWidth: 260,
                      templateEngine:Y.Handlebars
                  }
                },

                { key:'sprice', label:"Retail Price"  },

                { key:'sdate',  label:"Trans Date"         }
            ];

        var cols = [ colsNoediting, colsBasicEditing, colsEditing ];

        var basic_config = {
            columns: cols[colChoice],
            data:    someData
        };

        var dt = new Y.DataTable(Y.merge(basic_config,config_arg)).render('#dtable');

        return dt;
    }


    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Editable : basic setup and instance',

        setUp : function () {
            // {sid: sname: sdesc: sopen:0, stype:0, stock:0, sprice:, shipst:'s', sdate: },
            this.dt = makeDT(0);
        },

        tearDown : function () {
            if(this.dt) {
                this.dt.destroy();
                delete this.dt;
            }
        },

        'should be a class': function() {
            Assert.isFunction(Y.DataTable.Editable);
        },

        'should instantiate as a DT instance': function() {
            Assert.isInstanceOf( Y.DataTable, this.dt, 'Not an instanceof Y.DataTable');
        },

        'listeners are set' : function(){
            //Assert.areSame( 3, this.m._subscr.length, "Didn't find 3 listeners" );
        },

        'check ATTR default values' : function(){
            Assert.isFalse( this.dt.get('editable'), "editable default not false" );
            Assert.isNull( this.dt.get('defaultEditor'), "default editor not null" );
            Assert.areSame( 'dblclick', this.dt.get('editOpenType'), "default editOpenType not 'dblclick'" );
        },

        'check ATTR editable setting' : function(){
            Assert.isFalse( this.dt.get('editable'), "editable not initially false" );

            this.dt.set('editable',true);
            Assert.isTrue( this.dt.get('editable'), "set editable to true" );

            this.dt.set('editable',null);
            Assert.isTrue( this.dt.get('editable'), "set editable to null" );

            this.dt.set('editable','none');
            Assert.isTrue( this.dt.get('editable'), "set editable to 'none'" );

            this.dt.set('editable',false);
            Assert.isFalse( this.dt.get('editable'), "set editable false" );

        },

        'check ATTR editOpenType setting' : function(){
            Assert.isFalse( this.dt.get('editable'), "editable not initially false" );
            Assert.areSame( 'dblclick', this.dt.get('editOpenType'), "default editOpenType not dblclick" );

            this.dt.set('editable',true);
            Assert.isTrue( this.dt.get('editable'), "set editable to true" );

            Assert.areSame('dblclick', this.dt.get('editOpenType'), "default editOpenType not dblclick" );

            this.dt.set('editOpenType',null);
            Assert.areSame( null, this.dt.get('editOpenType'), "set editOpenType failed on null" );

            this.dt.set('editOpenType',1);
            Assert.areSame( null, this.dt.get('editOpenType'), "set editOpenType failed on 1" );

            this.dt.set('editOpenType','click');
            Assert.areSame( 'click', this.dt.get('editOpenType'), "set editOpenType to click failed" );

        },

        'check ATTR defaultEditor setting' : function(){
            Assert.isFalse( this.dt.get('editable'), "editable not initially false" );
            Assert.areSame( null, this.dt.get('defaultEditor'), "default defaultEditor not none" );

            this.dt.set('editable',true);

            this.dt.set('defaultEditor',null);
            Assert.isNull( this.dt.get('defaultEditor'), "set defaultEditor not null" );

            this.dt.set('defaultEditor','inline');
            Assert.areSame( 'inline', this.dt.get('defaultEditor'), "set defaultEditor failed on inline" );

            var ce = this.dt.getCellEditors();
            Assert.areSame( 7, ce.length, "setup default editors count not 7" );

            var inl = this.dt._commonEditors.inline;
            Assert.areSame( 'inline', inl.get('name'), "common editor 0 should be inline");

        },

        'check destructor' : function(){
            this.dt.set('editable',true);
            Assert.isTrue( this.dt.get('editable'), "set editable to true" );

            this.dt.destroy();
            Assert.isFalse( this.dt.get('editable'), "editable not false" );

            Assert.areSame(0, Y.Object.size(this.dt._commonEditors), "_commonEditors not {}" );
            Assert.areSame(0, Y.Object.size(this.dt._columnEditors), "_columnEditors not {}" );
            Assert.isNull( this.dt._openEditor, "_openEditor not null" );
            Assert.isNull( this.dt._openTd, "_openTd not null" );

        }
        
    }));


    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Editable : check public methods ~ default as inline',

        setUp : function () {
            // {sid: sname: sdesc: sopen:0, stype:0, stock:0, sprice:, shipst:'s', sdate: },
            this.dt = makeDT(0,{
                defaultEditor:  'inline',
                editOpenType:   'click',
                editable:       true
            });

        },

        tearDown : function () {
            if(this.dt) {
                this.dt.destroy();
                delete this.dt;
            }
        },

        'check editor counts' : function(){
            var dt = this.dt;

            Assert.isTrue( dt.get('editable'), "set editable to true" );

            var ces = dt.getCellEditors();
            Assert.areSame(7, ces.length, 'there should be 7 cell editors');

            Assert.isNull( dt.getCellEditor('sid'),'column 0 (sid) editor should be null');
            Assert.areSame( 'inline', dt.getCellEditor('sopen').get('name'),'column 1 (sopen) editor name should be inline');

        },

        'check public methods - open/hide cell editors' : function(){
            var dt = this.dt,
                tr0 = dt.getRow(0);

            // on column 1, open an editor, then hide it
            tr0.all('td').item(1).simulate('click');
            Assert.isTrue(dt._openEditor.get('visible'),'cell editor col 1 should be visible');
            dt.hideCellEditor();
            Assert.isNull(dt._openEditor,'cell editor col 1 should be closed');
            Assert.isFalse(dt.getCellEditor('sopen').get('visible'),'cell editor col 1 should be closed');

            // open column 1 again, then click another cell ... col 1 should hide, col 6 should be visible
            tr0.all('td').item(1).simulate('click');
            Assert.isTrue(dt._openEditor.get('visible'),'cell editor col 1 should be visible');
            var ce = dt.getCellEditor('sopen');
            Assert.isTrue(ce.get('visible'),'cell editor col 1 should be visible');

            tr0.all('td').item(6).simulate('click');
            Assert.isTrue(dt._openEditor.get('visible'),'cell editor col 6 should be visible');
            Assert.areSame(59.93, dt._openEditor.get('value'),'cell editor col 6 value should be 59.93');

            // check hideallcelleditors
            dt.hideAllCellEditors();
            Assert.isFalse(dt.getCellEditor('sdesc').get('visible'),'cell editor col 3 should be closed');
            Assert.isNull(dt._openEditor,'open editor should be null');
            Assert.isFalse(dt.getCellEditor('sprice').get('visible'),'cell editor col 3 should be closed');

            // select row 3, column 4 ... stype value=30
            dt.set('editable',false);

            dt.set('editable',true);

            var tr3 = dt.getRow(3);
            var td4 = tr3.all('td').item(4);

            td4.simulate('click');
            Assert.areSame('30',td4.getHTML(),'row 3, col 4 should be "30"');
            Assert.areSame(td4.get('text'),dt._openCell.td.getHTML());

            // check getColumnXXX methods
            Assert.areSame('stype',dt.getColumnByTd(td4).key,'getColumnByTd should be sdesc');
            Assert.areSame(Y.Object.size(dt.get('columns')[4]),
                Y.Object.size(dt.getColumnByTd(td4)),'getColumnByTd should be same as columns def');
            Assert.areSame('stype',dt.getColumnNameByTd(td4),'getColumnByTd should be sdesc');


        },




        'check initial setup - inline row 0' : function(){
            var dt = this.dt,
                tr0 = this.dt.getRow(0);

            // column 0 of any row is uneditable, make sure ...
            tr0.all('td').item(0).simulate('click');
            Assert.isNull(dt._openEditor,'cell editor col 0 should be null');

            // column 1 of row 0 should open ...
            tr0.all('td').item(1).simulate('click');
            Assert.isNotNull(dt._openEditor,'cell editor col 1 should be open');
            Assert.isTrue(dt._openEditor.get('visible'),'cell editor col 1 should be visible');

            Assert.areSame(0,dt._openEditor.get('value'),'initial editor value of col 1 should be 0');

            // ESC should close
            dt._openEditor._inputNode.simulate('keydown',{keyCode:27});
            Assert.isNull(dt._openEditor,'cell editor col 1 should be closed');

        },

        'check ATTR editOpenType setting' : function(){
            var  tr0 = this.dt.getRow(0);

            Assert.isTrue( this.dt.get('editable'), "set editable to true" );


        },

        'check destructor' : function(){
            this.dt.set('editable',true);
            Assert.isTrue( this.dt.get('editable'), "set editable to true" );

            this.dt.destroy();
            Assert.isFalse( this.dt.get('editable'), "editable not false" );

            Assert.areSame(0, Y.Object.size(this.dt._commonEditors), "_commonEditors not {}" );
            Assert.areSame(0, Y.Object.size(this.dt._columnEditors), "_columnEditors not {}" );
            Assert.isNull( this.dt._openEditor, "_openEditor not null" );
            Assert.isNull( this.dt._openTd, "_openTd not null" );

        }

    }));


    Y.Test.Runner.add(suite);


},'', { requires: [ 'test' ] });
