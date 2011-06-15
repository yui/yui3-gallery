// Create a new YUI instance and populate it with the required modules.
YUI().use("test", "node-event-simulate", "gallery-form", function (Y) {

var suite = new Y.Test.Suite("form-field");

suite.add(new Y.Test.Case({

    name: "FormFieldTest",

    setUp: function() {
        var boundingBox = Y.Node.create("<div></div>");
        var scaffolding = Y.one("#scaffolding");
        scaffolding.setContent(boundingBox);
        this.field = new Y.FormField({boundingBox: boundingBox});
        this.field.render();
    },

    // The FormField widget renders and input and label element in
    // its content box.
    testRenderUI: function() {
        var contentBox = this.field.get("contentBox");
        Y.Assert.isNotNull(contentBox.one("label"));
        Y.Assert.isNotNull(contentBox.one("input"));
    },

    // The values of the field element and of the FormField attribute
    // are kept in sync in case of UI change event or widget attribute
    // change.
    testChangeEvent: function() {
        var contentBox = this.field.get("contentBox");
        var input = contentBox.one("input");
        input.set("value", "foo");
        input.simulate("change");
        Y.Assert.areEqual("foo", this.field.get("value"));
        this.field.set("value", "bar");
        Y.Assert.areEqual("bar", input.get("value"));
    },

    // The values of the field element and of the FormField attribute
    // are kept in sync.
    testBlurEvent: function() {
        var contentBox = this.field.get("contentBox");
        var input = contentBox.one("input");
        input.set("value", "foo");
        input.simulate("blur");
        Y.Assert.areEqual("foo", this.field.get("value"));
    },

    // When the 'error' attribute changes, an error node is created
    // or removed appropriately.
    testShowError: function() {
        this.field.set("error", "Bad value");
        var contentBox = this.field.get("contentBox");
        var error = contentBox.one("label").previous();
        Y.Assert.areEqual("span", error.get("nodeName").toLowerCase());
        Y.Assert.isTrue(error.hasClass("error"));
        Y.Assert.areEqual("Bad value", error.get("text"));
        this.field.set("error", null);
        Y.Assert.isNull(contentBox.one("span.error"));
    },

    // If the 'validateInline' attribute is set, the field value is validated
    // as soon as it changes in the UI, otherwise the validation is deferred
    // to the submit phase.
    testValidateInline: function() {
        this.field.set("validator", "email");
        this.field.set("validateInline", true);
        var contentBox = this.field.get("contentBox");
        var input = contentBox.one("input");
        input.set("value", "foo");
        input.simulate("blur");
        Y.Assert.isNotNull(contentBox.one("span.error"));
        this.field.set("error", null);
        this.field.set("validateInline", false);
        input.set("value", "bar");
        input.simulate("blur");
        Y.Assert.isNull(contentBox.one("span.error"));
    },

    // If the 'validateInline' attribute is set, the field value is validated
    // as soon as it changes in the UI.
    testDisable: function() {
        this.field.disable();
        var contentBox = this.field.get("contentBox");
        var input = contentBox.one("input");
        Y.Assert.areEqual("disabled", input.getAttribute("disabled"));
    },

    // The FormField widget renders and input and label element in
    // it content box.
    testSyncUI: function() {
        this.field.set("name", "nice-field");
        this.field.set("label", "Nice field");
        this.field.set("value", "Nice value");
        this.field.syncUI();
        var contentBox = this.field.get("contentBox");
        var id = this.field.get("id");
        var label = contentBox.one("label");
        var input = contentBox.one("input");
        Y.Assert.areEqual("Nice field", label.get("text"));
        Y.Assert.areEqual(id + "-field", label.getAttribute("for"));
        Y.Assert.areEqual("nice-field", input.get("name"));
        Y.Assert.areEqual("Nice value", input.get("value"));
        Y.Assert.areEqual(id + "-field", input.get("id"));
    },

    // With the 'requiredLabel' attribute it's possible to specify some
    // custom text to be appended to the label caption for required fields.
    testRequiredLabel: function() {
        this.field.set("required", true);
        this.field.set("requiredLabel", "(Required)");
        this.field.set("label", "Nice field");
        this.field.syncUI();
        var contentBox = this.field.get("contentBox");
        var label = contentBox.one("label");
        var required = label.one("span.required");
        Y.Assert.areEqual("(Required)", required.get("text"));
        Y.Assert.isTrue(required.hasClass("required"));
    }
}));


var CustomFormField = function(config) {
    CustomFormField.superclass.constructor.apply(this, arguments);
};

CustomFormField.NAME = "custom-form-field";

Y.extend(CustomFormField, Y.FormField, {

    CONTENT_TEMPLATE: ["<div>",
                       "  <span class='label'></span>",
                       "  <div>",
                       "    <div>",
                       "      <span class='field'></span>",
                       "    </div>",
                       "    <div>",
                       "      <span class='error'></span>",
                       "    </div>",
                       "  </div>",
                       "  <span class='hint'></span>",
                       "</div>"].join(""),

    HINT_TEMPLATE: "<div></div>"
});


suite.add(new Y.Test.Case({

    name: "CustomFormFieldTest",

    setUp: function() {
        var boundingBox = Y.Node.create("<div></div>");
        var scaffolding = Y.one("#scaffolding");
        scaffolding.setContent(boundingBox);
        this.field = new CustomFormField({boundingBox: boundingBox,
                                          name: "some-field",
                                          label: "Some field",
                                          hint: "Very nice field",
                                          required: true,
                                          requiredLabel: "(Required)",
                                          value: "foo"});
        this.field.render();
    },

    // If placeholders nodes are found in the content box markup, they
    // are replaced with the relevant form field nodes.
    testRenderUI: function() {
        var contentBox = this.field.get("contentBox"),
            contentBoxChildren = contentBox.get("children"),
            label = contentBoxChildren.item(0),
            field = contentBoxChildren.item(1),
            hint = contentBoxChildren.item(2);
        Y.Assert.areEqual("label", label.get("nodeName").toLowerCase());
        Y.Assert.areEqual("Some field", label.one("span.caption").get("text"));
        Y.Assert.areEqual("(Required)", label.one("span.required").get("text"));
        Y.Assert.areEqual("div", field.get("nodeName").toLowerCase());
        Y.Assert.areEqual("foo", field.one("input.field").get("value"));
        Y.Assert.areEqual("div", hint.get("nodeName").toLowerCase());
        Y.Assert.areEqual("Very nice field", hint.get("text"));
        this.field.set("error", "Invalid");
        Y.Assert.areEqual("Invalid", field.one("span.error").get("text"));
    }
}));


Y.Test.Runner.add(suite);
Y.Test.Runner.run();

});
