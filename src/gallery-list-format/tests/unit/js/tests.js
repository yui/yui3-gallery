YUI.add('module-tests', function(Y) {

    var listFormatTests = new Y.Test.Case({
        name: "List Format Tests",
        setUp: function() {
            Y.Intl.add(
                "gallery-list-format",
                "en",
                {
                    listPatternTwo: "{0} and {1}",
                    listPatternEnd: "{0}, and {1}"
                }
                );
        },

        testListFormat: function() {
            var input = [];

            var result = Y.Intl.ListFormatter.format(input);
            Y.Assert.areEqual("", result);

            input.push("US");
            result = Y.Intl.ListFormatter.format(input);
            Y.Assert.areEqual("US", result);

            input.push("UK");
            result = Y.Intl.ListFormatter.format(input);
            Y.Assert.areEqual("US and UK", result);

            input.push("Canada");
            result = Y.Intl.ListFormatter.format(input);
            Y.Assert.areEqual("US, UK, and Canada", result);
        }
    });

    Y.Test.Runner.add(listFormatTests);

},'', { requires: [ 'test', 'gallery-list-format' ] });
