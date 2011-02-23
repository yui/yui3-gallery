// Create a new YUI instance and populate it with the required modules.
YUI().use("test", "node-event-simulate", "gallery-form", function (Y) {

var suite = new Y.Test.Suite("reset-button");

suite.add(new Y.Test.Case({

    name: "ResetButtonTest",

    setUp: function() {
        var boundingBox = Y.Node.create("<div></div>");
        var scaffolding = Y.one("#scaffolding");
        scaffolding.setContent(boundingBox);
        this.reset = new Y.ResetButton({boundingBox: boundingBox});
        this.reset.render();
    },

    // The ResetButton widget renders an input element of type reset.
    testRenderUI: function() {
        var contentBox = this.reset.get("contentBox");
        Y.Assert.isNotNull(contentBox.one("input[type='reset']"));
        Y.Assert.isNull(contentBox.one("label"));
    }
}));

Y.Test.Runner.add(suite);
Y.Test.Runner.run();

});
