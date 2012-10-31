YUI.add('bottle-testlib', function (Y) {
    var A = Y.Assert,
        L = Y.Lang,

    bottleTest = {
        instanceOf: function (O, C, E) {
            A.isTrue(Y.instanceOf(O, C), E);
        },

        areSame: function (O, P, E) {
            var I;

            if (!P) {
                A.fail('expect an object, but now it is undefined, null or 0');
            }

            for (I in O) {
                if (L.isObject(O[I])) {
                    bottleTest.areSame(O[I], P[I], (E ? E : '') + '.' + I);
                } else {
                    A.areSame(O[I], P[I], (E ? E : '') + '.' + I + '=' + P[I] + ', should be ' + O[I]);
                }
            }

            for (I in P) {
                A.isTrue((O[I] !== undefined), (E ? E : '') + '.' + I + '=' + P[I] + ', should not exist.');
            }
        },

        isTag: function (T, O) {
            A.areSame(T.toLowerCase(), O.get('tagName').toString().toLowerCase());
        },

        isPxZero: function (N, M) {
            if (N === '0px' || N === '0pt' || N === '0' || (N <= 0.5 && N >= -0.5)) {
                return;
            }
            A.fail((M ? M + ': ' : '') + '0px or 0pt or 0 or -0.5 ~ 0.5 expected!');
        },

        writeOnce: function (O, a, W, E) {
            var old = O.get(a);

            O.set(a, W);
            A.areSame(old, O.get(a), E);
        },

        run: function () {
            var hash = location.href.match(/#(.+)/),
            args = hash ? hash[1].split(/:/) : [];

            if (args.length > 1) {
                console.log('Start to run the test!');
                Y.Test.Runner.run();
            }
        }
    };

    Y.bottleTest = bottleTest;

}, '0.0.1', {requires:['test', 'gallery-bottle']});
