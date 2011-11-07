// Create a new YUI instance and populate it with the required modules.
YUI().use("test", "node-event-simulate", "gallery-form", function (Y) {

var suite = new Y.Test.Suite("select-field");

suite.add(new Y.Test.Case({

    name: "SelectFieldTest",

    setUp: function() {
        var boundingBox = Y.Node.create("<div></div>");
        var scaffolding = Y.one("#scaffolding");
        scaffolding.setContent(boundingBox);
        this.select = new Y.SelectField({boundingBox: boundingBox});
    },

    // The SelectField widget renders a select with an option node
    // for each choice, plus the default blank one.
    testRender: function() {
        var contentBox = this.select.get("contentBox"),
            field,
            options;
        this.select.set("name", "some-field");
        this.select.set("size", "2");
        this.select.set("choices", [{label: "Foo", value: "foo"},
                                    {label: "Bar", value: "bar"}]);
        this.select.render();
        field = contentBox.one("select");
        Y.Assert.areEqual("some-field", field.get("name"));
        Y.Assert.areEqual("2", field.get("size"));
        options = contentBox.all("option");
        Y.Assert.areEqual("Choose one", options.item(0).get("text"));        
        Y.Assert.areEqual("", options.item(0).get("value"));        
        Y.Assert.isTrue(options.item(0).get("selected"));        
        Y.Assert.areEqual("Foo", options.item(1).get("text"));        
        Y.Assert.areEqual("foo", options.item(1).get("value"));        
        Y.Assert.areEqual("Bar", options.item(2).get("text"));        
        Y.Assert.areEqual("bar", options.item(2).get("value"));        
    },

    // The SelectField widget can render the default option only.
    testRenderWithDefaultOnly: function() {
        var contentBox = this.select.get("contentBox"),
            options;
        this.select.set("choices", []);
        this.select.render();
        options = contentBox.all("option");
        Y.Assert.areEqual("Choose one", options.item(0).get("text"));        
        Y.Assert.areEqual("", options.item(0).get("value"));        
    },

    // If the 'multi' attribute is set to true, the select element
    // will have the 'multiple' property set.
    testRenderWithMulti: function() {
        var contentBox = this.select.get("contentBox"),
            field;
        this.select.set("multi", true);
        this.select.set("choices", [{label: "Foo", value: "foo"},
                                    {label: "Bar", value: "bar"}]);
        this.select.render();
        field = contentBox.one("select");
        Y.Assert.isTrue(field.get("multiple"));
    },

    // When the 'choices' attribute changes, the widget is refreshed.
    testChangeChoices: function() {
        this.select.set("choices", [{label: "Foo", value: "foo"},
                                    {label: "Bar", value: "bar"}]);
        this.select.render();
        this.select.set("choices", [{label: "Egg", value: "egg"}]);
        var contentBox = this.select.get("contentBox");
        var options = contentBox.all("option");
        Y.Assert.areEqual(2, options.size());
        Y.Assert.areEqual("Choose one", options.item(0).get("text"));        
        Y.Assert.areEqual("", options.item(0).get("value"));        
        Y.Assert.areEqual("Egg", options.item(1).get("text"));        
        Y.Assert.areEqual("egg", options.item(1).get("value"));        
    }
}));

Y.Test.Runner.add(suite);
Y.Test.Runner.run();

});
