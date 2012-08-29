var runTestLib = function (Y, O, N) {
    var testSuite = new Y.Test.Suite('ZUI attribute'),
        testObj = new Y.Base();

    testObj.addAttrs({
        attrA: {
           value: 0
        },
        attrB: {
           value: 3
        }
    });

    O._revertList = {attrA: true, attrF: true};

    testSuite.add(new Y.Test.Case({
        name: N,

        testMethods: function () {
            Y.Assert.isObject(O.toggle);
            Y.Assert.isObject(O.set_again);
            Y.Assert.isObject(O.revert);
        },

        testToggle: function () {
            O.toggle('attrA');
            O.toggle('attrB');
            O.toggle('attrC');
            O.toggle('attrD');
            O.toggle('attrE');
            O.toggle('attrF');

            // test not defined attribute
            O.toggle('attrG');

            Y.Assert.isTrue(O.get('attrA'));
            Y.Assert.isFalse(O.get('attrB'));
            Y.Assert.isFalse(O.get('attrC'));
            Y.Assert.isTrue(O.get('attrD'));
            Y.Assert.isTrue(O.get('attrE'));
            Y.Assert.isFalse(O.get('attrF'));
            Y.Assert.isTrue(O.get('attrG'));
        },

        testRevert: function () {
            Y.Assert.isFalse(O.get('attrF'));

            O.revert('attrF');
            Y.Assert.areSame('string', O.get('attrF'));

            // test revert when no any older value
            O.revert('attrF');
            Y.Assert.areSame('string', O.get('attrF'));

            O.set('attrF', 0);
            O.set('attrF', 1);
            O.set('attrF', 2);
            O.set('attrF', 3);
            O.set('attrF', 4);
            O.set('attrF', 5);

            Y.Assert.areSame(5, O.get('attrF'));

            O.revert('attrF');
            Y.Assert.areSame(4, O.get('attrF'));

            O.revert('attrF');
            Y.Assert.areSame(3, O.get('attrF'));

            O.revert('attrF');
            O.revert('attrF');
            Y.Assert.areSame(1, O.get('attrF'));

            O.revert('attrF');
            O.revert('attrF');
            Y.Assert.areSame('string', O.get('attrF'));
        },

        testNoRevert: function () {
            O.set('attrB', 9);

            O.revert('attrB');
            Y.Assert.areSame(9, O.get('attrB'));
        },

        testRevertAll: function () {
            O._doRevert = true;
            O.set('attrB', 12);
            Y.Assert.areSame(12, O.get('attrB'));

            O.set('attrB', 15);
            Y.Assert.areSame(15, O.get('attrB'));

            O.revert('attrB');
            Y.Assert.areSame(12, O.get('attrB'));
        },

        testSetAgain: function () {
            var setRun = 0;

            O.on('attrAChange', function () {
                setRun ++;
            });

            O.set('attrA', 1);

            Y.Assert.areSame(1, setRun);
            Y.Assert.areSame(1, O.get('attrA'));

            O.revert('attrA');

            Y.Assert.areSame(2, setRun);
            Y.Assert.areSame(true, O.get('attrA'));

            O.set('attrA', 'same value');

            Y.Assert.areSame(3, setRun);
            Y.Assert.areSame('same value', O.get('attrA'));

            O.set_again('attrA');

            Y.Assert.areSame(4, setRun);
            Y.Assert.areSame('same value', O.get('attrA'));
        },

        testSync: function () {
            O.sync('attrA', testObj);
            Y.Assert.areSame(0, O.get('attrA'));

            testObj.set('attrA', 2);
            Y.Assert.areSame(2, O.get('attrA'));

            O.unsync('attrA', testObj);
            testObj.set('attrA', 4);
            Y.Assert.areSame(2, O.get('attrA'));

            O.sync('attrA', testObj, 'attrB');
            Y.Assert.areSame(3, O.get('attrA'));

            testObj.set('attrB', 4);
            Y.Assert.areSame(4, O.get('attrA'));

            O.unsync('attrA', testObj, 'attrB');
            testObj.set('attrA', 5);
            Y.Assert.areSame(4, O.get('attrA'));
        }
    }));

    Y.Test.Runner.add(testSuite);
    Y.Test.Runner.run();
};
