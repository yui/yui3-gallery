YUI.add('module-tests-cmenu', function(Y) {

    var suite = new Y.Test.Suite('gallery-contextmenu-view'),
        Assert = Y.Test.Assert;

    // a blocking sleep function ... easier than Y.later or timeout crap
    function sleep(msecs){
        var tstart = new Date().getTime();
        while( new Date().getTime() < tstart + msecs );
        return;
    }

    function makeCMenu() {

        var boxes = Y.all('.box-row li');

        var handleBoxClick = function(e) {
            // boxes is a NodeList
            boxes.setHTML('duck');
            boxes.setStyle('backgroundColor', '#F4E6B8');

            // e.currentTarget === .box-row li, just the one that was clicked
            e.currentTarget.setHTML('Goose !');
            e.currentTarget.setStyle('backgroundColor', '#C4DAED');
        };
        Y.one('.box-row').delegate('click', handleBoxClick, 'li');

    //  End of original Example code
    //-----------------------------------------------------------------------


        //
        // Define a contextmenu View to listen on the .box-row UL container, selector target as each "li"
        //
        var cmenu = new Y.ContextMenuView({

         // Set what Node should accept the right clicks, and the target on that node ...
            trigger: {
                node:   Y.one(".box-row"),
                target:  'li'
            },

         // Define the pop-up menu contents
            menuItems: [ "Change to 'Lemur'", "Delete box", "Ah, nevermind ..."  ]
        });

        return cmenu;

    }


    suite.add(new Y.Test.Case({
        name: 'Initial setup and instance checks',

        setUp : function () {
            this.cmenu = makeCMenu();
        },

        tearDown : function () {
            this.cmenu.destroy();
            delete this.cmenu;
        },

        'should be a View class': function() {
            Assert.isFunction(Y.ContextMenuView);
        },

        'should instantiate as a View': function() {
            Assert.isInstanceOf( Y.View, this.cmenu, 'Not an instanceof Y.View');
            Assert.isInstanceOf( Y.Overlay, this.cmenu.get('overlay'), 'Not an instanceof Y.Overlay');
        },

        'should destroy and kill Overlay okay': function() {
            this.cmenu.destroy();
            sleep(500);
            Assert.isNotNull( this.cmenu.get('overlay'));
        }

    }));

    suite.add(new Y.Test.Case({
        name: 'Context menu on NodeList',

        setUp : function () {
            this.cmenu = makeCMenu();
        },

        tearDown : function () {
            this.cmenu.destroy();
            delete this.cmenu;
        },

        'contextmenu on first LI item': function() {
            // .box-row / LI
            var lis = Y.one('.box-row').all('li'),
                li = lis.item(0),
                cmbd = this.cmenu.get('overlay').get('contentBox').one('.yui3-widget-bd'),
                cmdiv = cmbd.all('.yui3-contextmenu-menuitem');

            li.simulate('contextmenu');

            Assert.areSame( li, this.cmenu.get('contextTarget'));

            cmdiv.item(0).simulate('click');
            var sm = this.cmenu.get('selectedMenu');
            Assert.areSame( cmdiv.item(0), sm.evt.currentTarget);
            Assert.areSame( 0, sm.menuIndex);

        },

        'hide contextmenu on contextTarget' : function() {
            var lis = Y.one('.box-row').all('li'),
                li = lis.item(1);

            this.cmenu.on('contextMenuShow',function(o){
                this.hideOverlay();
            });

            li.simulate('contextmenu');

        }

    }));




    Y.Test.Runner.add(suite);

},'', { requires: [ 'test' ] });
