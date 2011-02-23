// Create a new YUI instance and populate it with the required modules.
YUI().use("test", "node-event-simulate", "gallery-form", function (Y) {

var suite = new Y.Test.Suite("form-button");

suite.add(new Y.Test.Case({

    name: "FormButtonTest",

    setUp: function() {
        var boundingBox = Y.Node.create("<div></div>");
        var scaffolding = Y.one("#scaffolding");
        scaffolding.setContent(boundingBox);
        this.button = new Y.FormButton({boundingBox: boundingBox});
        this.button.render();
    },

    // The FormButton widget renders a button element in its content box.
    testRenderUI: function() {
        var contentBox = this.button.get("contentBox");
        Y.Assert.isNotNull(contentBox.one("button"));
    },

    // The 'onclick' attribute can be set to an event handler for the
    // click event.
    testClickHandler: function() {
        var events = [];
        this.button.set("onclick", {fn: function(e) {events.push(e);}});
        var contentBox = this.button.get("contentBox");
        contentBox.one("button").simulate("click");
        Y.Assert.areEqual(1, events.length);
    },

    // The 'onclick' handler can be configured with a scope.
    testClickHandlerWithScope: function() {
        var events = [];
        this.button.set("onclick", {fn: function(e) {this.push(e);},
                                    scope: events});
        var contentBox = this.button.get("contentBox");
        contentBox.one("button").simulate("click");
        Y.Assert.areEqual(1, events.length);
    },

    // The FormButton widget uses the label property to set the text of the
    // button element.
    testSyncUI: function() {
        this.button.set("label", "Press me");
        this.button.syncUI();
        var contentBox = this.button.get("contentBox");
        var buttonNode = contentBox.one("button");
        Y.Assert.areEqual("Press me", buttonNode.get("text"));
        Y.Assert.areEqual(this.button.get("id") + "-field", buttonNode.get("id"));
    }
}));

Y.Test.Runner.add(suite);
Y.Test.Runner.run();

});
