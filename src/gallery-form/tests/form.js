// Create a new YUI instance and populate it with the required modules.
YUI().use("test", "node-event-simulate", "gallery-form", function (Y) {

var suite = new Y.Test.Suite("form");

suite.add(new Y.Test.Case({

    name: "FormTest",

    setUp: function() {
        var boundingBox = Y.Node.create("<div></div>");
        var scaffolding = Y.one("#scaffolding");
        scaffolding.setContent(boundingBox);
        this.form = new Y.Form({boundingBox: boundingBox});
        this.form.render(this.scaffolding);
    },
 
    // By default the content box is <form> node whose method is set to 'post'.
    testRender: function () {
        var contentBox = this.form.get("contentBox");
        Y.Assert.areEqual("form", contentBox.get("nodeName").toLowerCase());
        Y.Assert.areEqual("post", contentBox.getAttribute("method"));
    },

    // The default behavoir of the form DOM submit event is prevented.
    testSubmitEventHalt: function () {
        var fired = false;
        var submit = new Y.SubmitButton({name: "submit"});
	this.form.add(submit);
        var contentBox = this.form.get("contentBox");
        contentBox.on("submit", Y.bind(function(evt) {
            Y.Assert.areEqual(1, evt.stopped);
            fired = true;
        }, this));
        contentBox.one("input[name='submit']").simulate("click");
        Y.Assert.isTrue(fired);
    },

    // It's possible to toggle inline field validation by setting the
    // 'inlineValidation' attribute, which is false by default.
    testToggleInlineValidation: function() {
        var field = new Y.TextField({name: "foo", value: "bar"});
        this.form.add(field);
	Y.Assert.isFalse(this.form.get("inlineValidation"));
        Y.Assert.isFalse(field.get("validateInline"));
	this.form.set("inlineValidation", true);
        Y.Assert.isTrue(field.get("validateInline"));
	this.form.set("inlineValidation", false);
        Y.Assert.isFalse(field.get("validateInline"));
    },

    // The Form.reset method resets the fields to their initial values.
    testReset: function() {
        var contentBox = this.form.get("contentBox"),
            field = new Y.TextField({name: "foo", value: "bar"});

        this.form.add(field);
        field.set("value", "egg");
        this.form.reset();

        Y.Assert.areEqual("bar", contentBox.one("input").get("value"));
        Y.Assert.areEqual(null, field.get("error"));
    },

    // By default after a form is successfully submitted, it's reset.
    testResetAfterSubmit: function() {        
        var field = new Y.TextField({name: "foo", value: "bar"});
        this.form.add(field);
        field.set("value", "egg");
        this.form.set("io", function() {return {id: 0};});
        this.form.submit();
        Y.fire("io:success", 0, null);
        Y.Assert.areEqual("bar", field.get("value"));
    },

    // It's possible to prevent the form reset by setting the
    // 'resetAfterSubmit' attribute.
    testResetAfterSubmitDisable: function() {        
        var field = new Y.TextField({name: "foo", value: "bar"});
        this.form.add(field);
        field.set("value", "egg");
        this.form.set("resetAfterSubmit", false);
        this.form.set("io", function() {return {id: 0};});
        this.form.submit();
        Y.fire("io:success", 0, null);
        Y.Assert.areEqual("egg", field.get("value"));
    },

    // It's possible to set the action and method attributes for the form.
    testFormAttributes: function () {
        this.form.set("action", "foo");
        this.form.set("method", "get");
        this.form.syncUI();
        var contentBox = this.form.get("contentBox");
        Y.Assert.areEqual("foo", contentBox.getAttribute("action"));
        Y.Assert.areEqual("get", contentBox.getAttribute("method"));
    },

    // It's possible to initialize some of the property of a Form widget
    // using existing markup.
    testHtmlParser: function () {
        var box = Y.Node.create(["<div id='form'>",
                                 "  <form action='http://foo/'",
                                 "        method='get'>",
                                 "    <input type='text'",
                                 "           name='foo'",
                                 "           value='bar'",
                                 "    </input>",
                                 "  </form>",
                                 "</div>"].join(""));
        var scaffolding = Y.one("#scaffolding");
        scaffolding.setContent(box);
        var form = new Y.Form({boundingBox: box,
                               contentBox: box.one("form")});
        form.render();
        Y.Assert.areEqual("http://foo/", form.get("action"));
        Y.Assert.areEqual("get", form.get("method"));
        Y.Assert.areEqual(1, form.size());
        var field = form.item(0);
        Y.Assert.areEqual("text-field", field.name);
        Y.Assert.areEqual("foo", field.get("name"));
        Y.Assert.areEqual("bar", field.get("value"));
    },

    // Before submitting the form the fields are validated.
    testValidation: function() {        
        var field = new Y.TextField({name: "foo", required: true});
        this.form.set("io", function() {throw "Boom";});
        this.form.add(field);
        this.form.submit();
        Y.Assert.isNotNull(field.get("error"));
    },

    // It's possible to skip the validation.
    testSkipValidation: function() {        
        var submits = [];
        var field = new Y.TextField({name: "foo", required: true});
        this.form.set("skipValidationBeforeSubmit", true);
        this.form.set("io", function() {submits.push(true); return {id: 0};});
        this.form.add(field);
        this.form.submit();
        Y.Assert.isNotNull(field.get("error"));
        Y.Assert.areEqual(1, submits.length);
        Y.Assert.isFalse(field.get("error"));
    },

    // The method attribute can be set only to 'get' or 'post', and
    // values are converted to lower case.
    testMethodAttribute: function() {        
        this.form.set("method", "crap");
        Y.Assert.areEqual("post", this.form.get("method"));
        this.form.set("method", "GET");
        Y.Assert.areEqual("get", this.form.get("method"));
    },

    // The getField method gets a field by name or index
    testGetField: function() {        
        this.form.add({name: "foo", required: true});
        var field = this.form.getField("foo");
        Y.Assert.areEqual("foo", field.get("name"));
        Y.Assert.areEqual(field, this.form.getField(0));
    },

    // By default, added fields are of type TextFeild.
    testDefaultChildType: function() {        
        this.form.add({name: "foo", required: true});
        var field = this.form.item(0);
        Y.Assert.areEqual("text-field", field.name);
    }
 }));

Y.Test.Runner.add(suite);
Y.Test.Runner.run();

});
