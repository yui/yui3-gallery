YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-datepicker');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'check instantiation': function() {
            Y.one("body").append("<input id=\"foo\"/>");
            var d = new Y.DatePicker({input: "#foo"});
            Y.assert(d, "instantiated a datepicker object");
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test' ] });
