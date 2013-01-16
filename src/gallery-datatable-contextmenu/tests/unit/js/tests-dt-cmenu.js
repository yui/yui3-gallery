YUI.add('mod-tests-dtcmenu', function(Y) {

    var suite = new Y.Test.Suite('gallery-contextmenu-view'),
        Assert = Y.Test.Assert;

    // a blocking sleep function ... easier than Y.later or timeout crap
    function sleep(msecs){
        var tstart = new Date().getTime();
        while( new Date().getTime() < tstart + msecs );
        return;
    }

    function makeDT() {

        var myData =[
            {rid:1, rtext:"AAA", rnum:999.9 },
            {rid:2, rtext:"BBB", rnum:888.8 },
            {rid:3, rtext:"CCC", rnum:777.7 },
            {rid:4, rtext:"DDD", rnum:666.6 },
            {rid:5, rtext:"EEE", rnum:555.5 },
            {rid:6, rtext:"FFF", rnum:444.4 }
        ];
//
//  Create the DataTable
//
        var dt = new Y.DataTable({
            columns: [ 'rid', 'rtext', 'rnum' ],
            data:    myData,
            sortable: true,
            width:   '700px'
        });

       dt.plug(Y.Plugin.DataTableContextMenu,{
            tbodyMenu:{
                menuItems: [
                    {label:"Edit",          value:"e"},
                    {label:"Update",        value:"u"},
                    {label:"Insert Before", value:"i"},
                    {label:"Insert After",  value:"a"},
                    {label:"<hr/>",         value:null},
                    {label:"Delete Record", value:"d"},
                    {label:"Destroy Cmenu", value:"dc"}
                ]
            }
        });

        dt.render('#dtable');

        return dt;

    }


    suite.add(new Y.Test.Case({
        name: 'Initial setup and instance checks',

        setUp : function () {
            this.dt = makeDT();
            this.cmenu = this.dt.contextmenu;
        },

        tearDown : function () {
            if(this.dt) {
                this.dt.destroy();
            }
        },

        'should be a Plugin extension': function() {
            Assert.isFunction(Y.Plugin.DataTableContextMenu);
        },

        'should instantiate as a View': function() {
            Assert.isInstanceOf( Y.Plugin.DataTableContextMenu, this.cmenu, 'Not an instanceof Plugin');
            var tbodyMenu = this.cmenu.tbodyCMenu;
            Assert.isInstanceOf(Y.View, tbodyMenu, 'tbodyMenu Not an instanceof Y.View');
            Assert.isInstanceOf(Y.Overlay, tbodyMenu.get('overlay'), 'tbodyMenu Overlay is Not an instanceof Y.Overlay');
        },

        'should destroy and kill Overlay okay': function() {
            this.dt.destroy();
            var cm = this.dt.contextmenu;
            Assert.isUndefined(cm);
        }

    }));

    suite.add(new Y.Test.Case({
        name: 'DT context menu tbody',

        setUp : function () {
            this.dt = makeDT();
            this.cmenu = this.dt.contextmenu;
        },

        tearDown : function () {
            if(this.dt) {
                this.dt.destroy();
            }
        },

        'contextmenu on first row / cell rtext': function() {
            var tr0 = this.dt.getRow(0),
                tds = tr0.all('td'),
                cmtb = this.cmenu.tbodyCMenu,
                cmbd = cmtb.get('overlay').get('contentBox').one('.yui3-widget-bd'),
                cmdiv = cmbd.all('.yui3-contextmenu-menuitem');

            //
            //  Go to row 0, cell 1 ... show contextmenu, click first menuitem
            //
            tds.item(1).simulate('contextmenu');

            Assert.areSame( tds.item(1), cmtb.get('contextTarget'),'TD and contextTarget not same');

            cmdiv.item(0).simulate('click');
            var sm = cmtb.get('selectedMenu');
            Assert.areSame( cmdiv.item(0), sm.evt.currentTarget);
            Assert.areSame( 0, sm.menuIndex);

            //
            //  Same thing, this time hide the overlay on show ...
            //
            cmtb.on('contextMenuShow',function(o){
                this.hideOverlay();
            });

            tds.item(1).simulate('contextmenu');

        },

        'hide contextmenu on contextTarget' : function() {
            var tr0 = this.dt.getRow(0),
                tds = tr0.all('td'),
                cmtb = this.cmenu.tbodyCMenu;

            //
            //  Go to row 0, cell 1 ... show contextmenu, click first menuitem
            //
            tds.item(1).simulate('contextmenu');

            this.cmenu.hideCM('tbodyCMenu');
            Assert.isFalse(cmtb.get('overlay').get('visible'));

        }

    }));




    Y.Test.Runner.add(suite);

},'', { requires: [ 'test' ] });
