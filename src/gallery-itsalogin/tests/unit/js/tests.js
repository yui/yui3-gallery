YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-itsalogin');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'test is empty': function() {
            Y.getLogin('Login', 'Please enter login', {
                imageButtons: true,
                showStayLoggedin: true,
                regain: 'usernameorpassword'
            }, null).then(
                function(result) {
                    Y.showMessage('Resolved:', 'succesfully logged in with username='+result.username+
                        ' | password='+result.password+' | stayloggedin: '+result.remember+
                        ' | button='+result.button);
                },
                function(reason) {
                    Y.showMessage('Rejected:', reason);
                }
            );
            this.wait(20000);
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test', 'gallery-itsalogin' ] });