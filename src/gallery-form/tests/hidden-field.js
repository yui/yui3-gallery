// Create a new YUI instance and populate it with the required modules.
YUI().use("test", "node-event-simulate", "gallery-form", function (Y) {

var suite = new Y.Test.Suite("hidden-field");

suite.add(new Y.Test.Case({

    name: "HiddenFieldTest",

    setUp: function() {
        var boundingBox = Y.Node.create("<div></div>");
        var scaffolding = Y.one("#scaffolding");
        scaffolding.setContent(boundingBox);
        this.hidden = new Y.HiddenField({boundingBox: boundingBox});
        this.hidden.render();
    },

    // The HiddenField widget renders a hidden input element.
    testRenderUI: function() {
        var contentBox = this.hidden.get("contentBox");
        Y.Assert.isNotNull(contentBox.one("input[type='hidden']"));
    }
}));

Y.Test.Runner.add(suite);
Y.Test.Runner.run();

});
