/* Copyright 2012 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 */

YUI({ useBrowserConsole: true }).add('gallery.morph.tests', function(Y) {
    var ns = Y.namespace('gallery.morph.tests');
    ns.suite = new Y.Test.Suite('Morph Tests');

    ns.suite.add(new Y.Test.Case({
        name: 'test-morphing',

        setUp: function () {
            var p1 = Y.Node.create('<div/>'),
                p2 = Y.Node.create('<div/>');

            p1.setHTML('<p>Panel One</p>');
            p1.set('id', 'panel-one');
            p2.setHTML('<p>Panel Two</p>');
            p2.set('id', 'panel-two');
            p2.addClass('hidden');

            this.cont = Y.one("#sample");
            this.cont.append(p1);
            this.cont.append(p2);
        },

        tearDown: function () {
            this.cont.empty();
        },

        _verify_initial_state: function () {
            Y.Assert.isFalse(
                Y.one('#panel-one').hasClass('hidden'),
                'The target panel should initially be visible');
            Y.Assert.isTrue(
                Y.one('#panel-two').hasClass('hidden'),
                'The source panel should initially be hidden');
        },

        _verify_post_morph_state: function (cfg, morph_fired) {
            Y.Assert.isTrue(
                Y.one(cfg.targetNode).hasClass('hidden'),
                'The target panel should now be hidden');
            Y.Assert.isFalse(
                Y.one(cfg.srcNode).hasClass('hidden'),
                'The source panel should now be visible');
            Y.Assert.isTrue(
                morph_fired,
                'The morphed event should have fired');
            Y.Assert.areEqual(
                'auto',
                Y.one(cfg.srcNode).getStyle('height'),
                'The morpher should set the height back to auto');
        },

        test_morphing: function() {
            var that = this,
                cfg = {
                    srcNode: '#panel-two',
                    targetNode: '#panel-one'
                },
                morpher = new Y.gallery.anim.morph.Morph(cfg),
                morph_fired = false;

            this._verify_initial_state();
            morpher.on('morphed', function() {
                morph_fired = true;
            });

            morpher.morph();

            that.wait(function() {
                this._verify_post_morph_state(cfg, morph_fired);

                // Fire this morph again, this time for the reverse.
                morpher.morph(true);
                this.wait(function() {
                    this._verify_initial_state();
                }, 2000);

            }, 2000);
        },

        test_nodes_vs_strings: function () {
            var that = this,
                cfg = {
                    srcNode: Y.one('#panel-two'),
                    targetNode: Y.one('#panel-one')
                },
                morpher = new Y.gallery.anim.morph.Morph(cfg),
                morph_fired = false;

            morpher.morph();

            that.wait(function() {
                this._verify_post_morph_state(cfg, true);
            }, 2000);
        },

        test_reverse_case: function () {
            var that = this,
                cfg = {
                    animate: false,
                    srcNode: '#panel-two',
                    targetNode: '#panel-one'
                },
                morpher = new Y.gallery.anim.morph.Morph(cfg),
                morph_fired = false;

            this._verify_initial_state();
            morpher.on('morphed', function() {
                morph_fired = true;
            });

            morpher.morph();

            that.wait(function() {
                this._verify_post_morph_state(cfg, morph_fired);

                // Fire this morph again, this time for the reverse.
                morpher.reverse();
                this.wait(function() {
                    this._verify_initial_state();
                }, 2000);

            }, 2000);

        }
    }));

}, '0.1', {
    'requires': ['node', 'node-event-simulate', 'test', 'gallery-anim-morph']
});
