YUI.add("gallery-node-autogrow-tests", function (Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite("gallery-node-autogrow");

    suite.add(new Y.Test.Case({
        name: "attributes",
        setUp: function () {
            Y.one("#container").setContent('<textarea id="testTextarea">ddsfsdafadsfsadfasdfsadfasdfsadfsadfasdfsadfasdfasfdasfafdsfsdafadsfsadfasdfsadfasdfsadfsadfasdfsadfasdfasfdasfafdsfsdafadsfsadfasdfsadfasdfsadfsadfasdfsadfasdfasfdasfafdsfsdafadsfsadfasdfsadfasdfsadfsadfasdfsadfasdfasfdasfafdsfsdafadsfsadfasdfsadfasdfsadfsadfasdfsadfasdfasfdasfafsfsdafadsfsadfasdfsadfasdfsadfsadfasdfsadfasdfasfdasfaf</textarea>');
            Y.one("#testTextarea").plug(Y.Plugin.NodeAutoGrow, {width: 400});
            this.node = Y.one("#testTextarea");
        },
        tearDown: function () {
             Y.one("#testTextarea").unplug(Y.AutoGrow);
             Y.one("#container").empty(true);
        },
        "Required HTML structure": function () {
            var node = this.node;
            Assert.isObject(node.ancestor(".yui3-autogrow"));
            Assert.areEqual(node.previous().get("nodeName").toLowerCase(), "pre");
            Assert.isObject(node.previous().one("span"));
            Assert.isObject(node.previous().one("br"));
        },
        "Initial value": function () {
            var node = this.node;
            Assert.areEqual(node.get("value"), node.previous().one("span").getHTML());
        },
        "Initial height": function () {
            var node = this.node;
            Assert.areEqual(node.get("offsetHeight"), node.previous().get("offsetHeight"));
        }
    }));

    Y.Test.Runner.add(suite);

}, "@VERSION", {
    "requires": [
        "gallery-node-autogrow",
        "test"
    ]
});
