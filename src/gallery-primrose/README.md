Primrose
========

BDD speccing framework for YUI

# Writing a spec
```JavaScript
YUI.add('user-spec', function (Y) {

  Y.Primrose.describe('User', function () {

    var subject;

    P.beforeEach(function () {
      subject = new Y.User({ 
        firstname: 'Simon', 
        lastname: 'Højberg' 
      });
    });

    P.describe('name', function () {
      P.it('combines first and last names', function (expect) {
        expect( subject.get('name') ).toBe( 'Simon Højberg' );
      });
    });

  });

}, '0.0.1', { requires: ['user' /* module to test */, 'primrose'] });
```

# Running all specs
```JavaScript
YUI().use('user-spec', 'primrose', 'primrose-log-reporter', function (Y) {

  // Set a reporter
  Y.Primrose.addReporter(new Y.Primrose.LogReporter());

  // Run the specs
  Y.Primrose.run();

});
```

Thanks @cmeik for being awesome!
