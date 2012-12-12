YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-scrollfix');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        setUp: function() {
        	var innerScroll = Y.one('.inner-scroll');
        	innerScroll.plug(Y.Plugin.NodeScrollFix);
        	this.innerScroll = innerScroll;
        },
        tearDown: function() {
        	this.innerScroll.unplug(Y.Plugin.NodeScrollFix);
        	this.innerScroll = null;
        },
        'test: plug namespace': function() {
        	Y.Assert.isNotUndefined(this.innerScroll.scrollfix,'Scrollfix namespace was not created');
        },
        'test: mouseenter attaches mousewheelListener': function() {
        	var innerScroll = this.innerScroll;

        	innerScroll.simulate('mouseover',{relatedTarget: document.body});
        	Y.Assert.isNotNull(innerScroll.scrollfix.mouseWheelListener,'mouseWheelListener did not attach');
        },
        'test: mouseleave detaches mousewheelListener': function() {
        	var innerScroll = this.innerScroll;

        	innerScroll.simulate('mouseover',{relatedTarget: document.body});
        	Y.Assert.isNotNull(innerScroll.scrollfix.mouseWheelListener,'mouseWheelListener did not attach');

        	innerScroll.simulate('mouseout',{relatedTarget: document.body});
        	Y.Assert.isNull(innerScroll.scrollfix.mouseWheelListener,'mouseWheelListener did not detach');
        },
        'test: destructor detaches mousewheelListener': function() {
        	var innerScroll = this.innerScroll;

        	innerScroll.simulate('mouseover',{relatedTarget: document.body});
        	Y.Assert.isNotNull(innerScroll.scrollfix.mouseWheelListener,'mouseWheelListener did not attach');
        	var mouseWheelListener = innerScroll.scrollfix.mouseWheelListener;

        	this.innerScroll.unplug(Y.Plugin.NodeScrollFix);
        	Y.Assert.isTrue(mouseWheelListener.sub.deleted,'mouseWheelListener did not detach');

        	Y.Assert.isUndefined(innerScroll.scrollfix,'unplug did not remove namespace');
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test', 'node', 'node-event-simulate', 'gallery-scrollfix' ] });
