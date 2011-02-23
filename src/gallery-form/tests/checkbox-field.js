// Create a new YUI instance and populate it with the required modules.
YUI().use("test", "node-event-simulate", "gallery-form", function (Y) {

var suite = new Y.Test.Suite("checkbox-field");

suite.add(new Y.Test.Case({

    name: "CheckboxFieldTest",

    setUp: function() {
        var boundingBox = Y.Node.create("<div></div>");
        var scaffolding = Y.one("#scaffolding");
        scaffolding.setContent(boundingBox);
        this.checkbox = new Y.CheckboxField({boundingBox: boundingBox});
        this.checkbox.render();
    },

    // The CheckboxField widget renders a checkbox input element.
    testRenderUI: function() {
        var contentBox = this.checkbox.get("contentBox");
        Y.Assert.isNotNull(contentBox.one("input[type='checkbox']"));
    },

    // The CheckboxField widget syncs its 'checked' attribute with the state
    // of the input checkbox element.
    testCheckedChange: function() {
        this.checkbox.set("checked", true);
        var contentBox = this.checkbox.get("contentBox");
        var input = contentBox.one("input[type='checkbox']");
        Y.Assert.isTrue(input.get("checked"));
        input.set("checked", false);
        input.simulate("change");
        Y.Assert.isFalse(this.checkbox.get("checked"));
    }
}));

Y.Test.Runner.add(suite);
Y.Test.Runner.run();

});
