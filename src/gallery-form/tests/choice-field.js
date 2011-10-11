// Create a new YUI instance and populate it with the required modules.
YUI().use("test", "node-event-simulate", "gallery-form", function (Y) {

var suite = new Y.Test.Suite("choice-field");

suite.add(new Y.Test.Case({

    name: "ChoiceFieldTest",

    setUp: function() {
        var boundingBox = Y.Node.create("<div></div>");
        var scaffolding = Y.one("#scaffolding");
        scaffolding.setContent(boundingBox);
        this.choice = new Y.ChoiceField({boundingBox: boundingBox});
    },

    // The ChoiceField widget renders a radio input element for each choice.
    testRenderUI: function() {
        this.choice.set("name", "some-choice");
        this.choice.set("label", "Choose me");
        this.choice.set("choices", [{label: "Foo", value: "foo"},
                                    {label: "Bar", value: "bar"}]);
        this.choice.render();
        var contentBox = this.choice.get("contentBox");
        Y.Assert.areEqual("Choose me", contentBox.one("span").get("text"));
        var radios = contentBox.all("> div");
        Y.Assert.areEqual(2, radios.size());
        var label = radios.item(0).one("label");
        var input = radios.item(0).one("input");
        Y.Assert.areEqual("some-choice", input.get("name"));
        Y.Assert.areEqual("foo", input.get("value"));
        Y.Assert.areEqual("radio", input.get("type"));
    },

    // If the 'multi' attribute is true, the ChoiceField widget renders
    // checkbox input elements instead of radio ones.
    testRenderUIWithMultiple: function() {
        this.choice.set("multi", true);
        this.choice.set("choices", [{label: "Foo", value: "foo"},
                                    {label: "Bar", value: "bar"}]);
        this.choice.render();
        var contentBox = this.choice.get("contentBox");
        var checkboxes = contentBox.all("> div");
        Y.Assert.areEqual(2, checkboxes.size());
        var input = checkboxes.item(0).one("input");
        Y.Assert.areEqual("checkbox", input.get("type"));
    },

    // The 'value' attribute is kept in sync with the selected choice.
    testSyncValue: function() {
        this.choice.set("value", "bar");
        this.choice.set("choices", [{label: "Foo", value: "foo"},
                                    {label: "Bar", value: "bar"}]);
        this.choice.render();
        var contentBox = this.choice.get("contentBox");
        var inputs = contentBox.all("input");
        Y.Assert.isTrue(inputs.item(1).get("checked"));
        inputs.item(0).set("checked", true);
        inputs.item(0).simulate("change");
        Y.Assert.areEqual("foo", this.choice.get("value"));
    },

    // The ChoiceField.clear method unchecks all options.
    testClear: function() {
        this.choice.set("multi", true);
        this.choice.set("choices", [{label: "Foo", value: "foo"},
                                    {label: "Bar", value: "bar"}]);
        this.choice.render();
        var contentBox = this.choice.get("contentBox");
        var inputs = contentBox.all("input");
        inputs.set("checked", true);
        this.choice.clear();
        Y.ArrayAssert.itemsAreEqual([false, false], inputs.get("checked"));
    },

    // When the 'choices' attribute changes, the widget is refreshed.
    testChangeChoices: function() {
        this.choice.set("choices", [{label: "Foo", value: "foo"},
                                    {label: "Bar", value: "bar"}]);
        this.choice.render();
        this.choice.set("choices", [{label: "Egg", value: "egg"}]);
        var contentBox = this.choice.get("contentBox");
        var radios = contentBox.all("> div");
        Y.Assert.areEqual(1, radios.size());
        var label = radios.item(0).one("label");
        var input = radios.item(0).one("input");
        Y.Assert.areEqual("Egg", label.get("text"));
        Y.Assert.areEqual("egg", input.get("value"));
    }
}));


var CustomRadioField = function(config) {
    CustomRadioField.superclass.constructor.apply(this, arguments);
};

CustomRadioField.NAME = "radio-field";

Y.extend(CustomRadioField, Y.RadioField, {

    CONTENT_TEMPLATE: ["<div class='custom-choice'>",
                       "  <span class='field'></span>",
                       "  <span class='label'></span>",
                       "</div>"].join("")
});


var CustomChoiceField = function(config) {
    CustomChoiceField.superclass.constructor.apply(this, arguments);
};

CustomChoiceField.NAME = "custom-choice-field";

Y.extend(CustomChoiceField, Y.ChoiceField, {

    SINGLE_CHOICE: CustomRadioField,
    CONTENT_TEMPLATE: ["<div>",
                       "  <div>",
                       "    <div class='field'></div>",
                       "  </div>",
                       "</div>"].join("")
});


suite.add(new Y.Test.Case({

    name: "CustomChoiceFieldTest",

    setUp: function() {
        var boundingBox = Y.Node.create("<div></div>");
        var scaffolding = Y.one("#scaffolding");
        scaffolding.setContent(boundingBox);
        this.field = new CustomChoiceField({boundingBox: boundingBox,
                                            name: "some-field",
                                            choices: [{label: "Foo", value: "foo"},
                                                      {label: "Bar", value: "bar"}]});
        this.field.render();
    },

    // If a placeholder node is found for the field node, the choice widgets
    // are appended to it.
    testRenderUI: function() {
        var contentBox = this.field.get("contentBox"),
            parent = contentBox.one(".field"),
            choices = parent.get("children");
        Y.Assert.areEqual(2, choices.size());
        Y.Assert.isTrue(choices.item(0).one("div").hasClass("custom-choice"));
    }
}));

Y.Test.Runner.add(suite);
Y.Test.Runner.run();

});
