YUI.add('rangyinputs-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-rangyinputs'),
    Assert = Y.Assert,
    input = Y.one('#test');

    input.plug(Y.Plugin.RangyInputs);
    suite.add(new Y.Test.Case({

        name: 'Method Tests',

        setUp : function () {
            this.data = {
                string: 'yui rangy inputs plugin'
            };
            input.set('value', this.data.string);
        },

        tearDown: function () {
        },

        testGetSelection: function() {
            var plugin = input.rangy;

            Assert.isObject(plugin.getSelection());
        },


        testSetSelection: function() {
            var plugin = input.rangy,
            string = this.data.string,
            start = 0,
            end = 5;

            plugin.setSelection(start, end);

            Assert.areSame(start, plugin.getSelection().start);
            Assert.areSame(end, plugin.getSelection().end);
            Assert.areSame((end - start), plugin.getSelection().length);
            Assert.areSame(string.slice(start, end), plugin.getSelection().text);
        },

        testCollapseSelection: function() {
            var plugin = input.rangy,
            string = this.data.string,
            start = 5,
            end = string.length;

            plugin.setSelection(start, end).collapseSelection();

            Assert.areSame(end, plugin.getSelection().start);
            Assert.areSame(end, plugin.getSelection().end);
        },

        testDeleteText: function() {
            var plugin = input.rangy,
            string = this.data.string;

            plugin.deleteText(0, 4);
            Assert.areSame(string.slice(4), input.get('value'));
        },
        testDeleteSelectedText: function() {
            var plugin = input.rangy,
            string = this.data.string;

            plugin.setSelection(0,4);
            plugin.deleteSelectedText();
            Assert.areSame(string.slice(4), input.get('value'));
        },
        testExtractSelectedText: function() {
            var plugin = input.rangy,
            string = this.data.string;

            plugin.setSelection(0,4);
            Assert.areSame(string.slice(0,4), plugin.extractSelectedText());
        },
        testInsertText: function() {
            var plugin = input.rangy,
            string = this.data.string;

            plugin.insertText('foo', 4);
            Assert.areSame('yui foorangy inputs plugin', input.get('value'));
            Assert.areSame(string.length + 'foo'.length, plugin.getSelection().start);
        },
        testInsertTextCollapseToStart: function() {
            var plugin = input.rangy;

            plugin.insertText('foo', 4, 'collapsetostart');
            Assert.areSame('yui foorangy inputs plugin', input.get('value'));
            Assert.areSame(4, plugin.getSelection().start);
        },
        testInsertTextCollapseToEnd: function() {
            var plugin = input.rangy;

            plugin.insertText('foo', 4, 'collapsetoend');
            Assert.areSame('yui foorangy inputs plugin', input.get('value'));
            Assert.areSame(7, plugin.getSelection().start);
        },
        testInsertTextSelect: function() {
            var plugin = input.rangy;

            plugin.insertText('foo', 4, 'select');
            Assert.areSame('yui foorangy inputs plugin', input.get('value'));
            Assert.areSame(4, plugin.getSelection().start);
            Assert.areSame(7, plugin.getSelection().end);
            Assert.areSame('foo', plugin.getSelection().text);
        },
        testReplaceSelectedText: function() {
            var plugin = input.rangy,
            string = this.data.string;

            plugin.setSelection(0,3);
            plugin.replaceSelectedText('foo');

            Assert.areSame('foo' + string.slice(3), input.get('value'));
        },
        testSurroundSelectedText: function() {
            var plugin = input.rangy,
            string = this.data.string;

            plugin.setSelection(0,3);
            plugin.surroundSelectedText('[', ']');

            Assert.areSame('[' + string.slice(0,3) + ']' + string.slice(3), input.get('value'));
        }

    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test' ] });
