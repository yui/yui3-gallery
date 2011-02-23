// Create a new YUI instance and populate it with the required modules.
YUI().use("test", "node-event-simulate", "gallery-form", function (Y) {

var suite = new Y.Test.Suite("textarea-field");

suite.add(new Y.Test.Case({

    name: "TextareaFieldTest",

    setUp: function() {
        var boundingBox = Y.Node.create("<div></div>");
        var scaffolding = Y.one("#scaffolding");
        scaffolding.setContent(boundingBox);
        this.field = new Y.TextareaField({boundingBox: boundingBox});
        this.field.render();
    },

    // The TextareaField widget renders a textarea element.
    testRenderUI: function() {
        var contentBox = this.field.get("contentBox");
        Y.Assert.isNotNull(contentBox.one("textarea"));
    }
}));

Y.Test.Runner.add(suite);
Y.Test.Runner.run();

});
