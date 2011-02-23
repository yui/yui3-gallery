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
        this.select.set("choices", [{label: "Foo", value: "foo"},
                                    {label: "Bar", value: "bar"}]);
        this.select.render();
        field = contentBox.one("select");
        Y.Assert.areEqual("some-field", field.get("name"));
        options = contentBox.all("option");
        Y.Assert.areEqual("Choose one", options.item(0).get("text"));        
        Y.Assert.areEqual("", options.item(0).get("value"));        
        Y.Assert.isTrue(options.item(0).get("selected"));        
        Y.Assert.areEqual("Foo", options.item(1).get("text"));        
        Y.Assert.areEqual("foo", options.item(1).get("value"));        
        Y.Assert.areEqual("Bar", options.item(2).get("text"));        
        Y.Assert.areEqual("bar", options.item(2).get("value"));        
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
    }
}));

Y.Test.Runner.add(suite);
Y.Test.Runner.run();

});
