YUI.add('gallery-notify-tests', function(Y) {

var suite = new Y.Test.Suite("Notify Tests");

suite.add(new Y.Test.Case({
    name: "Notify tests",

    "test basic notification": function () {
        var notify = new Y.Notify(),
            test = this;

        notify.render();

        notify.addMessage('Notify Rocks!');

        notify.after('removeChild', function (e) {
            test.resume(function(){
                Y.Assert.isTrue(true);
            });
        });

        test.wait();

        notify.destroy();
    },

    "test notification by instantiation": function () {
        var test = this,
            notify = new Y.Notify({
                timeout: 8000
            }),
            message = new Y.Notify.Message({
                message: 'test notification by instantiation',
                timeout: 1000,
                flag: 'alert'
            });

        notify.render();

        notify.after('removeChild', function () {
            if (notify.isEmpty()) {
                test.resume(function () {
                    Y.Assert.isTrue(true);
                });
            }
        });

        notify.add(new Y.Notify.Message({
            message: 'test notification by instantiation',
            timeout: 1000,
            flag: 'error'
        }));

        notify.add(message);

        test.wait(5000);

        notify.destroy();
    },

    "test multiple notifications ": function () {
        var notify = new Y.Notify({
                timeout: 2000
            }),
            test = this;

        notify.render();

        notify.addMessages([
            { message: 'Test One!', strings: { close: 'x' } },
            { message: 'Test Two!' }
        ]);

        notify.after('removeChild', function (e) {
            if (notify.isEmpty()) {
                test.resume(function(){
                    Y.Assert.isTrue(true);
                });
            }
        });

        test.wait();

        notify.destroy();
    },

    "test close all via method": function () {
        var test = this,
            notify = new Y.Notify({
                timeout: 10000,
                closable: false
            });

        notify.render();

        notify.addMessages([
            { message: "message 1" },
            { message: "message 2" }
        ]);

        notify.after('removeChild', function (e) {
            if (notify.isEmpty()) {
                test.resume(function () {
                    Y.Assert.isTrue(true);
                });
            }
        });

        Y.later(1000, this, function () {
            notify.closeAll();
        })

        test.wait(5000);

        notify.destroy();

    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['gallery-notify', 'test']});
