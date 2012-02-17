// Create a new YUI instance and populate it with the required modules.
YUI().use("test", "node-event-simulate", "gallery-form", function (Y) {

var suite = new Y.Test.Suite("file-field");

suite.add(new Y.Test.Case({

    name: "FileFieldTest",

    setUp: function() {
        var boundingBox = Y.Node.create("<div></div>");
        var scaffolding = Y.one("#scaffolding");
        scaffolding.setContent(boundingBox);
        this.field = new Y.FileField({boundingBox: boundingBox});
        this.field.render();
    },

    // The FileField widget renders an input element of type file.
    testRenderUI: function() {
        var contentBox = this.field.get("contentBox");
        Y.Assert.isNotNull(contentBox.one("input[type='file']"));
    }
}));

Y.Test.Runner.add(suite);
Y.Test.Runner.run();

});
