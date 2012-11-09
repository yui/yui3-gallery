YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-bitly'),
        Assert = Y.Test.Assert;

    suite.add(new Y.Test.Case({
        name: 'Gallery Bitly',
        'should be a class': function() {
            Assert.isFunction(Y.bitly);
        },
        'should create an object': function() {
            var b = new Y.bitly({
                username: 'test',
                key: 'this-is-the-key'
            });
            Assert.isObject(b);
            this.b = b;
        },
        'should build url': function() {
            var url = this.b._buildURL('expand', 'extra=ok');
            Assert.areEqual(url, 'http://api.bit.ly/expand?version=2.0.1&login=test&apiKey=this-is-the-key&extra=ok');
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test' ] });
