YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-tipsy'),

        createTipsy = function (opts) {
            var tipsy = new Y.Tipsy(opts);
            return tipsy; 
        };

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',

        setUp : function () {
        },

        tearDown : function () {
            this.tipsy.destroy();
        },

        'test render standard tipsy': function() {
            
            this.tipsy = createTipsy({
                selector: "#someContent1"
            });

            this.tipsy.render();

            Y.Assert.areSame(true, (Y.one('.yui3-tipsy') instanceof Y.Node), 'Tipsy should be a Y.Node instance');

            Y.Assert.areSame(true, Y.one('.yui3-tipsy').hasClass('yui3-tipsy-fade'), 'Tipsy should be have the yui3-tipsy-fade class');

            Y.Assert.areSame(false, Y.one('.yui3-tipsy').hasClass('yui3-tipsy-in'), 'Tipsy should not have the yui3-tipsy-in class');
        },

        'test tipsy singleton': function () {
            this.tipsy = createTipsy({
                selector: "[rel='tipsy']"
            });

            this.tipsy.render();

            Y.Assert.areEqual(1, Y.all('.yui3-tipsy').size(), 'There should only be 1 Tipsy instance on the page');
        },

        'test showTooltip': function () {
            this.tipsy = createTipsy({
                selector: "#someContent1"
            });

            this.tipsy.render();
            this.tipsy.showTooltip(Y.one('#someContent1'));

            Y.Assert.areSame(true, Y.one('.yui3-tipsy').hasClass('yui3-tipsy-in'), 'Tipsy should have the yui3-tipsy-in class');
            Y.Assert.areSame(true, (Y.one('.yui3-tipsy .yui3-widget-pointer') instanceof Y.Node), 'Tipsy should have a pointer');
            Y.Assert.areSame(true, Y.one('.yui3-tipsy .yui3-widget-pointer').hasClass('yui3-widget-pointer-down'), 'Tipsy should have a downward pointer by default');

            Y.Assert.areSame("Lorem Ipsum Dolor Sit Amet?", Y.one('.yui3-tipsy-content').getContent(), 'Tipsy should have correct content');

            Y.Assert.areSame(true, this.tipsy.get('visible'), 'Tipsy should have {visible: true}');
        },

        'test hideTooltip': function () {
            this.tipsy = createTipsy({
                selector: "#someContent1"
            });

            this.tipsy.render();
            this.tipsy.showTooltip(Y.one('#someContent1'));

            Y.Assert.areSame(true, this.tipsy.get('visible'), 'Tipsy should have {visible: true}');

            this.tipsy.hideTooltip();

            Y.Assert.areSame(false, Y.one('.yui3-tipsy').hasClass('yui3-tipsy-in'), 'Tipsy should not have the yui3-tipsy-in class');

            Y.Assert.areSame(false, this.tipsy.get('visible'), 'Tipsy should have {visible: false}');

        },


        'test content': function () {
            this.tipsy = createTipsy({
                selector: "#someContent2",
                content: "Hello World!"
            });

            this.tipsy.render();
            this.tipsy.showTooltip(Y.one('#someContent2'));

            Y.Assert.areSame("Hello World!", Y.one('.yui3-tipsy-content').getContent(), 'Tipsy content should be the same');

        },

        'test data-placement': function () {
            this.tipsy = createTipsy({
                selector: "#bottombutton"
            });

            this.tipsy.render();
            this.tipsy.showTooltip(Y.one('#bottombutton'));

            Y.Assert.areSame(true, Y.one('.yui3-tipsy .yui3-widget-pointer').hasClass('yui3-widget-pointer-up'), 'Tipsy should have an up arrow');
        },

        'test placement attribute': function () {
            this.tipsy = createTipsy({
                selector: "#someContent3",
                placement: 'left'
            });

            this.tipsy.render();
            this.tipsy.showTooltip(Y.one('#someContent3'));

            Y.Assert.areSame(true, Y.one('.yui3-tipsy .yui3-widget-pointer').hasClass('yui3-widget-pointer-right'), 'Tipsy should have a right arrow');
        },


        /*  
            SIMULATED EVENTS TESTS 
            These tests are a bit more functional. 
        */

        'test delegate': function () {
            this.tipsy = createTipsy({
                selector: "[rel='tipsy']",
                delegate: '#demoButtons'
            });

            this.tipsy.render();

            Y.one('#demoButtons [rel="tipsy"]').simulate('mouseover');

            Y.Assert.areSame(true, Y.one('.yui3-tipsy').hasClass('yui3-tipsy-in'), 'Tipsy should  have the yui3-tipsy-in class');

            Y.Assert.areSame(true, this.tipsy.get('visible'), 'Tipsy should have {visible: true}');

            Y.one('#demoButtons [rel="tipsy"]').simulate('mouseout');

            Y.Assert.areSame(false, Y.one('.yui3-tipsy').hasClass('yui3-tipsy-in'), 'Tipsy should  not have the yui3-tipsy-in class');

            Y.Assert.areSame(false, this.tipsy.get('visible'), 'Tipsy should have {visible: false}');

            //but doesn't work if im not inside demoButtons
            Y.one('[rel="tipsy"]').simulate('mouseover');
            Y.Assert.areSame(false, Y.one('.yui3-tipsy').hasClass('yui3-tipsy-in'), 'Tipsy should not have the yui3-tipsy-in class');
            Y.Assert.areSame(false, this.tipsy.get('visible'), 'Tipsy should have {visible: false}');

        },

        'test custom show and hide': function () {
            this.tipsy = createTipsy({
                selector: "[rel='click-tipsy']",
                showOn: { selector: '#topbutton', events: 'click' },
                hideOn: { selector: '#someContent1', events: 'click' },
            });

            this.tipsy.render();

            Y.one('[rel="click-tipsy"]').simulate('mouseover');

            Y.Assert.areSame(false, Y.one('.yui3-tipsy').hasClass('yui3-tipsy-in'), 'Tipsy should not have the yui3-tipsy-in class');


            Y.one('[rel="click-tipsy"]').simulate('mouseout');

            Y.Assert.areSame(false, Y.one('.yui3-tipsy').hasClass('yui3-tipsy-in'), 'Tipsy should not have the yui3-tipsy-in class');

            Y.one('#topbutton').simulate('click');

            Y.Assert.areSame(true, Y.one('.yui3-tipsy').hasClass('yui3-tipsy-in'), 'Tipsy should have the yui3-tipsy-in class');
            Y.Assert.areSame(true, this.tipsy.get('visible'), 'Tipsy should have {visible: true}');


            Y.one('#someContent1').simulate('click');

            Y.Assert.areSame(false, Y.one('.yui3-tipsy').hasClass('yui3-tipsy-in'), 'Tipsy should not have the yui3-tipsy-in class');
            Y.Assert.areSame(false, this.tipsy.get('visible'), 'Tipsy should have {visible: false}');
        }

    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test', 'node', 'gallery-tipsy', 'node-event-simulate', 'event-outside'] });
