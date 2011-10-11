// Create a new YUI instance and populate it with the required modules.
YUI().use("test", "node-event-simulate", "gallery-form", function (Y) {

var suite = new Y.Test.Suite("radio-field");

suite.add(new Y.Test.Case({

    name: "RadioFieldTest",

    setUp: function() {
        var boundingBox = Y.Node.create("<div></div>");
        var scaffolding = Y.one("#scaffolding");
        scaffolding.setContent(boundingBox);
        this.field = new Y.RadioField({boundingBox: boundingBox});
        this.field.render();
    },

    // The RadioField widget renders an input element of type radio.
    testRenderUI: function() {
        var contentBox = this.field.get("contentBox");
        Y.Assert.isNotNull(contentBox.one("input[type='radio']"));
    }
}));

Y.Test.Runner.add(suite);
Y.Test.Runner.run();

});
