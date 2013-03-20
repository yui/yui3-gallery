YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-widget-pointer'),
    
        createOverlay = function (placement) {
            Y.CustomOverlay = Y.Base.create("customOverlay", Y.Widget, [Y.WidgetStdMod, Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.WidgetPositionConstrain, Y.WidgetPointer, Y.WidgetModality]);

            var overlay = new Y.CustomOverlay({
                // Specify a reference to a node which already exists 
                // on the page and contains header/body/footer content
                headerContent: "Header",
                bodyContent: "Body",
                // Also set some of the attributes inherited from
                // the base Widget class.
                visible:true,
                modal: false,
                placement: placement,
                centered: true,
                width: '50%',
                render: true
            });

            return overlay;
        };

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',

        setUp : function () {
        },

        tearDown : function () {
            this.overlay.destroy();
        },

        'test pointer left': function() {
            this.overlay = createOverlay('right'),
                pointer = Y.one('.yui3-widget-pointer');
            Y.Assert.areSame(true, (pointer instanceof Y.Node), 'pointer is expected to be a Y.Node');
            Y.Assert.areSame(true, pointer.hasClass('yui3-widget-pointer-left'), 'pointer is expected to point to the left');
        },
        'test pointer right': function() {
            this.overlay = createOverlay('left'),
                pointer = Y.one('.yui3-widget-pointer');
            Y.Assert.areSame(true, (pointer instanceof Y.Node), 'pointer is expected to be a Y.Node');
            Y.Assert.areSame(true, pointer.hasClass('yui3-widget-pointer-right'), 'pointer is expected to point to the right');
        },
        'test pointer up': function() {
            this.overlay = createOverlay('below'),
                pointer = Y.one('.yui3-widget-pointer');
            Y.Assert.areSame(true, (pointer instanceof Y.Node), 'pointer is expected to be a Y.Node');
            Y.Assert.areSame(true, pointer.hasClass('yui3-widget-pointer-up'), 'pointer is expected to point up');
        },
        'test pointer down': function() {
            this.overlay = createOverlay('above'),
                pointer = Y.one('.yui3-widget-pointer');
            Y.Assert.areSame(true, (pointer instanceof Y.Node), 'pointer is expected to be a Y.Node');
            Y.Assert.areSame(true, pointer.hasClass('yui3-widget-pointer-down'), 'pointer is expected to point down');
        },

        'test placementChange': function() {
            this.overlay = createOverlay('above'),
                pointer = Y.one('.yui3-widget-pointer');
            Y.Assert.areSame(true, (pointer instanceof Y.Node), 'pointer is expected to be a Y.Node');
            Y.Assert.areSame(true, pointer.hasClass('yui3-widget-pointer-down'), 'pointer is expected to point down');

            this.overlay.set('placement', 'below');
            Y.Assert.areSame(false, pointer.hasClass('yui3-widget-pointer-down'), 'pointer is not expected to point down');
            Y.Assert.areSame(true, pointer.hasClass('yui3-widget-pointer-up'), 'pointer is expected to point up');
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test', 'panel', 'gallery-widget-pointer' ] });
