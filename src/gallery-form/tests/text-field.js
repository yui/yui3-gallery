// Create a new YUI instance and populate it with the required modules.
YUI().use("test", "node-event-simulate", "gallery-form", function (Y) {

var suite = new Y.Test.Suite("text-field");

suite.add(new Y.Test.Case({

    name: "TextFieldTest",

    setUp: function() {
        var boundingBox = Y.Node.create("<div></div>");
        var scaffolding = Y.one("#scaffolding");
        scaffolding.setContent(boundingBox);
        this.field = new Y.TextField({boundingBox: boundingBox});
        this.field.render();
    },

    // The TextField widget renders an input element of type text.
    testRenderUI: function() {
        var contentBox = this.field.get("contentBox");
        Y.Assert.isNotNull(contentBox.one("input[type='text']"));
    }
}));

Y.Test.Runner.add(suite);
Y.Test.Runner.run();

});
