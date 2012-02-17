// Create a new YUI instance and populate it with the required modules.
YUI().use("test", "node-event-simulate", "gallery-form", function (Y) {

var suite = new Y.Test.Suite("submit-button");

suite.add(new Y.Test.Case({

    name: "SubmitButtonTest",

    setUp: function() {
        var boundingBox = Y.Node.create("<div></div>");
        var scaffolding = Y.one("#scaffolding");
        scaffolding.setContent(boundingBox);
        this.submit = new Y.SubmitButton({boundingBox: boundingBox});
        this.submit.render();
    },

    // The SubmitButton widget renders an input element of type submit.
    testRenderUI: function() {
        var contentBox = this.submit.get("contentBox");
        Y.Assert.isNotNull(contentBox.one("input[type='submit']"));
        Y.Assert.isNull(contentBox.one("label"));
    }
}));

Y.Test.Runner.add(suite);
Y.Test.Runner.run();

});
