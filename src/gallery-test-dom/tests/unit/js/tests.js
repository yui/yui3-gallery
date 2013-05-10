YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-test-dom');

    suite.add(new Y.Test.Case({
        name: 'Visibility Tests',

        setUp: function () {
            this.displayNoneNode = Y.Node.create("<div style='display:none;'>This content is hidden</div>");
            this.clippedNode = Y.Node.create("<div class='visuallyhidden'>This content is hidden</div>");
            this.absPosOffNode = Y.Node.create("<div class='absPosOffscreen'>This content is hidden</div>");
            this.absPosOnNode = Y.Node.create("<div class='absPosOnscreen'>This content is visible</div>");
            this.visibleNode = Y.Node.create("<div>This content is visible</div>");
            this.visibleScrollOffNode = Y.Node.create("<div class='scrolledOff'>This content is visible</div>");

            // attach nodes to page
            var body = Y.one('body');
            body.appendChild(this.displayNoneNode);
            body.appendChild(this.clippedNode);
            body.appendChild(this.absPosOffNode);
            body.appendChild(this.absPosOnNode);
            body.appendChild(this.visibleNode);
            body.appendChild(this.visibleScrollOffNode);
        },

        tearDown: function () {
            this.displayNoneNode.remove();
            this.clippedNode.remove();
            this.absPosOffNode.remove();
            this.absPosOnNode.remove();
            this.visibleNode.remove();
            this.visibleScrollOffNode.remove();
        },

        'isHidden should pass if node is hidden': function() {
            Y.Assert.isHidden(this.displayNoneNode);
            Y.Assert.isHidden(this.clippedNode);
            Y.Assert.isHidden(this.absPosOffNode);
        },

        'isHidden should fail if node is visible': function() {
            var visibleNode = this.visibleNode;
            var absPosOnNode = this.absPosOnNode;
            var visibleScrollOffNode = this.visibleScrollOffNode;

            Y.Assert.throwsError(YUITest.ComparisonFailure, function(){
                Y.Assert.isHidden(absPosOnNode);
            });

            Y.Assert.throwsError(YUITest.ComparisonFailure, function(){
                Y.Assert.isHidden(visibleNode);
            });

        },

        'isNotHidden should pass if node is visible': function() {
            Y.Assert.isNotHidden(this.absPosOnNode);
            Y.Assert.isNotHidden(this.visibleNode);
        },

        'isNotHidden should fail if node is hidden': function() {
            var displayNoneNode = this.displayNoneNode;
            var clippedNode = this.clippedNode;
            var absPosOffNode = this.absPosOffNode;

            Y.Assert.throwsError(YUITest.ComparisonFailure, function(){
                Y.Assert.isNotHidden(displayNoneNode);
            });

            Y.Assert.throwsError(YUITest.ComparisonFailure, function(){
                Y.Assert.isNotHidden(clippedNode);
            });

            Y.Assert.throwsError(YUITest.ComparisonFailure, function(){
                Y.Assert.isNotHidden(absPosOffNode);
            });
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Class Name Tests',
        setUp: function () {
            this.classNode = Y.Node.create("<div class='testClass'></div>");
            // attach nodes to page
            var body = Y.one('body');
            body.appendChild(this.classNode);
        },
        tearDown: function () {
            delete this.classNode;
        },
        'hasClass should pass if node has class': function () {
            Y.Assert.hasClass(this.classNode, "testClass");
        },
        'hasClass should fail if node does not has class': function () {
            var classNode = this.classNode;
            Y.Assert.throwsError(YUITest.ComparisonFailure, function(){
                Y.Assert.hasClass(classNode, "testClassFail");
            });
        },
        'lacksClass should pass if node does not have class': function () {
            Y.Assert.lacksClass(this.classNode, "ronBurgundy");
        },
        'lacksClass should fail if node has class': function () {
            var classNode = this.classNode;
            Y.Assert.throwsError(YUITest.ComparisonFailure, function(){
                Y.Assert.lacksClass(classNode, "testClass");
            });
        }
    }));

    Y.Test.Runner.add(suite);

},'', { requires: [ 'test' ] });
