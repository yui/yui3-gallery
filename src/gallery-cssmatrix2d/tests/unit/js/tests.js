YUI.add('module-tests', function (Y) {
    'use strict';

    var matrixStringA = 'matrix(75.494772, 23.153692, -14.6913742, -20.620151, -98.468445, -51.235547)',
        matrixStringB = 'matrix(-43.425083, 44.8555788, 48.791271, -87.6294, -11.1900331, -19.602279)',
        suite = new Y.Test.Suite('gallery-cssmatrix2d');

    Y.Assert.areNear = function (a, b, message) {
        Y.Assert.isTrue(Math.abs(a - b) < 0.0001, message);
    };

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'test:001-apiExists': function () {
            Y.Assert.isFunction(Y.CSSMatrix2d, 'Y.CSSMatrix2d should be a function.');

            var matrix = new Y.CSSMatrix2d();

            Y.Assert.isObject(matrix, 'matrix should be an object.');
            Y.Assert.isInstanceOf(Y.CSSMatrix2d, matrix, 'matrix should be an instance of Y.CSSMatrix2d.');

            Y.Assert.isNumber(matrix.a, 'matrix.a should be a number.');
            Y.Assert.isNumber(matrix.b, 'matrix.b should be a number.');
            Y.Assert.isNumber(matrix.c, 'matrix.c should be a number.');
            Y.Assert.isNumber(matrix.d, 'matrix.d should be a number.');
            Y.Assert.isNumber(matrix.e, 'matrix.e should be a number.');
            Y.Assert.isNumber(matrix.f, 'matrix.f should be a number.');
            Y.Assert.isFunction(matrix.inverse, 'matrix.inverse should be a function.');
            Y.Assert.isFunction(matrix.multiply, 'matrix.multiply should be a function.');
            Y.Assert.isFunction(matrix.rotate, 'matrix.rotate should be a function.');
            Y.Assert.isFunction(matrix.rotateRad, 'matrix.rotateRad should be a function.');
            Y.Assert.isFunction(matrix.scale, 'matrix.scale should be a function.');
            Y.Assert.isFunction(matrix.setMatrixValue, 'matrix.setMatrixValue should be a function.');
            Y.Assert.isFunction(matrix.skewX, 'matrix.skewX should be a function.');
            Y.Assert.isFunction(matrix.skewXRad, 'matrix.skewXRad should be a function.');
            Y.Assert.isFunction(matrix.skewY, 'matrix.skewY should be a function.');
            Y.Assert.isFunction(matrix.skewYRad, 'matrix.skewYRad should be a function.');
            Y.Assert.isFunction(matrix.toString, 'matrix.toString should be a function.');
            Y.Assert.isFunction(matrix.translate, 'matrix.translate should be a function.');
        },
        'test:002-defaultValues': function () {
            var matrix = new Y.CSSMatrix2d();

            Y.Assert.areSame(1, matrix.a, 'matrix.a should be 1.');
            Y.Assert.areSame(0, matrix.b, 'matrix.b should be 0.');
            Y.Assert.areSame(0, matrix.c, 'matrix.c should be 0.');
            Y.Assert.areSame(1, matrix.d, 'matrix.d should be 1.');
            Y.Assert.areSame(0, matrix.e, 'matrix.e should be 0.');
            Y.Assert.areSame(0, matrix.f, 'matrix.f should be 0.');
        },
        'test:003-toStringWithDefaults': function () {
            var matrix = new Y.CSSMatrix2d();

            Y.Assert.areSame('matrix(1, 0, 0, 1, 0, 0)', matrix.toString(), 'matrix.toString() should be \'matrix(1, 0, 0, 1, 0, 0)\'.');
        },
        'test:004-setMatrixValue': function () {
            var matrix = new Y.CSSMatrix2d().setMatrixValue(matrixStringA);

            Y.Assert.areSame(75.494772, matrix.a, 'matrix.a should be 75.494772.');
            Y.Assert.areSame(23.153692, matrix.b, 'matrix.b should be 23.153692.');
            Y.Assert.areSame(-14.6913742, matrix.c, 'matrix.c should be -14.6913742.');
            Y.Assert.areSame(-20.620151, matrix.d, 'matrix.d should be -20.620151.');
            Y.Assert.areSame(-98.468445, matrix.e, 'matrix.e should be -98.468445.');
            Y.Assert.areSame(-51.235547, matrix.f, 'matrix.f should be -51.235547.');

            matrix.setMatrixValue(matrixStringB);

            Y.Assert.areSame(-43.425083, matrix.a, 'matrix.a should be -43.425083.');
            Y.Assert.areSame(44.8555788, matrix.b, 'matrix.b should be 44.8555788.');
            Y.Assert.areSame(48.791271, matrix.c, 'matrix.c should be 48.791271.');
            Y.Assert.areSame(-87.6294, matrix.d, 'matrix.d should be -87.6294.');
            Y.Assert.areSame(-11.1900331, matrix.e, 'matrix.e should be -11.1900331.');
            Y.Assert.areSame(-19.602279, matrix.f, 'matrix.f should be -19.602279.');

            matrix.setMatrixValue('some invalid string');

            Y.Assert.areSame(-43.425083, matrix.a, 'matrix.a should be -43.425083.');
            Y.Assert.areSame(44.8555788, matrix.b, 'matrix.b should be 44.8555788.');
            Y.Assert.areSame(48.791271, matrix.c, 'matrix.c should be 48.791271.');
            Y.Assert.areSame(-87.6294, matrix.d, 'matrix.d should be -87.6294.');
            Y.Assert.areSame(-11.1900331, matrix.e, 'matrix.e should be -11.1900331.');
            Y.Assert.areSame(-19.602279, matrix.f, 'matrix.f should be -19.602279.');
        },
        'test:005-toString': function () {
            Y.Assert.areSame(matrixStringA, new Y.CSSMatrix2d().setMatrixValue(matrixStringA).toString(), 'matrix.toString() should be the same as the string passed to matrix.setMatrixValue.');
            Y.Assert.areSame(matrixStringB, new Y.CSSMatrix2d().setMatrixValue(matrixStringB).toString(), 'matrix.toString() should be the same as the string passed to matrix.setMatrixValue.');
        },
        'test:006-inverse': function () {
            var matrix = new Y.CSSMatrix2d().setMatrixValue(matrixStringA).inverse();

            Y.Assert.areSame(0.0169496382701715, matrix.a, 'matrix.a should be 0.0169496382701715.');
            Y.Assert.areSame(0.019032193509104938, matrix.b, 'matrix.b should be 0.019032193509104938.');
            Y.Assert.areSame(-0.012076219925922473, matrix.c, 'matrix.c should be -0.012076219925922473.');
            Y.Assert.areSame(-0.062056241813606104, matrix.d, 'matrix.d should be -0.062056241813606104.');
            Y.Assert.areSame(1.0502727901793403, matrix.e, 'matrix.e should be 1.0502727901793403.');
            Y.Assert.areSame(-1.305414994303724, matrix.f, 'matrix.f should be -1.305414994303724.');

            matrix = matrix.setMatrixValue(matrixStringB).inverse();

            Y.Assert.areSame(-0.05420084918375052, matrix.a, 'matrix.a should be -0.05420084918375052.');
            Y.Assert.areSame(-0.027744232661511287, matrix.b, 'matrix.b should be -0.027744232661511287.');
            Y.Assert.areSame(-0.030178551045134398, matrix.c, 'matrix.c should be -0.030178551045134398.');
            Y.Assert.areSame(-0.026859437294730403, matrix.d, 'matrix.d should be -0.026859437294730403.');
            Y.Assert.areSame(-1.1980776738167425, matrix.e, 'matrix.e should be -1.1980776738167425.');
            Y.Assert.areSame(-0.836965065450723, matrix.f, 'matrix.f should be -0.836965065450723.');
        },
        'test:007-inverseFailure': function () {
            var failure = false;

            try {
                new Y.CSSMatrix2d().setMatrixValue('matrix(10, 5, 10, 5, 10, 5)').inverse();
            } catch (exception) {
                Y.Assert.isInstanceOf(Error, exception, 'exception should be an instance of Error.');
                failure = true;
            }

            Y.Assert.isTrue(failure, 'matrix.inverse() should throw when the matrix is not inversable.');
        },
        'test:008-multiply': function () {
            var matrix = new Y.CSSMatrix2d().setMatrixValue(matrixStringA).multiply(new Y.CSSMatrix2d().setMatrixValue(matrixStringB));

            Y.Assert.areSame(-3937.356833274463, matrix.a, 'matrix.a should be -3937.356833274463.');
            Y.Assert.areSame(-1930.3798049048348, matrix.b, 'matrix.b should be -1930.3798049048348.');
            Y.Assert.areSame(4970.882186056692, matrix.c, 'matrix.c should be 4970.882186056692.');
            Y.Assert.areSame(2936.629521061932, matrix.d, 'matrix.d should be 2936.629521061932.');
            Y.Assert.areSame(-655.2730265951515, matrix.e, 'matrix.e should be -655.2730265951515.');
            Y.Assert.areSame(93.87582605692376, matrix.f, 'matrix.f should be 93.87582605692376.');

            matrix = matrix.setMatrixValue(matrixStringB).multiply(new Y.CSSMatrix2d().setMatrixValue(matrixStringA));

            Y.Assert.areSame(-2148.668679143544, matrix.a, 'matrix.a should be -2148.668679143544.');
            Y.Assert.areSame(1357.4175566892338, matrix.b, 'matrix.b should be 1357.4175566892338.');
            Y.Assert.areSame(-368.10923148286247, matrix.c, 'matrix.c should be -368.10923148286247.');
            Y.Assert.areSame(1147.941366931013, matrix.d, 'matrix.d should be 1147.941366931013.');
            Y.Assert.areSame(1764.9629053956985, matrix.e, 'matrix.e should be 1764.9629053956985.');
            Y.Assert.areSame(53.27886927083337, matrix.f, 'matrix.f should be 53.27886927083337.');
        },
        'test:009-rotate': function () {
            var matrix = new Y.CSSMatrix2d().setMatrixValue(matrixStringA).rotate(40);

            Y.Assert.areNear(48.388917, matrix.a, 'matrix.a should be near 48.388917.');
            Y.Assert.areNear(4.48238, matrix.b, 'matrix.b should be near 4.48238.');
            Y.Assert.areNear(-59.78135, matrix.c, 'matrix.c should be near -59.78135.');
            Y.Assert.areNear(-30.678858, matrix.d, 'matrix.d should be near -30.678858.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).rotate(40);

            Y.Assert.areNear(-1.903119, matrix.a, 'matrix.a should be near -1.903119.');
            Y.Assert.areNear(-21.965726, matrix.b, 'matrix.b should be near -21.965726.');
            Y.Assert.areNear(65.289387, matrix.c, 'matrix.c should be near 65.289387.');
            Y.Assert.areNear(-95.960625, matrix.d, 'matrix.d should be near -95.960625.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');

            matrix = matrix.setMatrixValue(matrixStringA).rotate(320);

            Y.Assert.areNear(67.275784, matrix.a, 'matrix.a should be near 67.275784.');
            Y.Assert.areNear(30.991135, matrix.b, 'matrix.b should be near 30.991135.');
            Y.Assert.areNear(37.272858, matrix.c, 'matrix.c should be near 37.272858.');
            Y.Assert.areNear(-0.913046, matrix.d, 'matrix.d should be near -0.913046.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).rotate(320);

            Y.Assert.areNear(-64.627968, matrix.a, 'matrix.a should be near -64.627968.');
            Y.Assert.areNear(90.688459, matrix.b, 'matrix.b should be near 90.688459.');
            Y.Assert.areNear(9.463177, matrix.c, 'matrix.c should be near 9.463177.');
            Y.Assert.areNear(-38.295405, matrix.d, 'matrix.d should be near -38.295405.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');

            matrix = matrix.setMatrixValue(matrixStringA).rotate(-40);

            Y.Assert.areNear(67.275784, matrix.a, 'matrix.a should be near 67.275784.');
            Y.Assert.areNear(30.991135, matrix.b, 'matrix.b should be near 30.991135.');
            Y.Assert.areNear(37.272858, matrix.c, 'matrix.c should be near 37.272858.');
            Y.Assert.areNear(-0.913046, matrix.d, 'matrix.d should be near -0.913046.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).rotate(-40);

            Y.Assert.areNear(-64.627968, matrix.a, 'matrix.a should be near -64.627968.');
            Y.Assert.areNear(90.688459, matrix.b, 'matrix.b should be near 90.688459.');
            Y.Assert.areNear(9.463177, matrix.c, 'matrix.c should be near 9.463177.');
            Y.Assert.areNear(-38.295405, matrix.d, 'matrix.d should be near -38.295405.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');

            matrix = matrix.setMatrixValue(matrixStringA).rotate(-320);

            Y.Assert.areNear(48.388917, matrix.a, 'matrix.a should be near 48.388917.');
            Y.Assert.areNear(4.48238, matrix.b, 'matrix.b should be near 4.48238.');
            Y.Assert.areNear(-59.78135, matrix.c, 'matrix.c should be near -59.78135.');
            Y.Assert.areNear(-30.678858, matrix.d, 'matrix.d should be near -30.678858.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).rotate(-320);

            Y.Assert.areNear(-1.903119, matrix.a, 'matrix.a should be near -1.903119.');
            Y.Assert.areNear(-21.965726, matrix.b, 'matrix.b should be near -21.965726.');
            Y.Assert.areNear(65.289387, matrix.c, 'matrix.c should be near 65.289387.');
            Y.Assert.areNear(-95.960625, matrix.d, 'matrix.d should be near -95.960625.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');
        },
        'test:010-scale': function () {
            var matrix = new Y.CSSMatrix2d().setMatrixValue(matrixStringA).scale(5);

            Y.Assert.areNear(377.47386, matrix.a, 'matrix.a should be near 377.47386.');
            Y.Assert.areNear(115.76846, matrix.b, 'matrix.b should be near 115.76846.');
            Y.Assert.areNear(-73.456871, matrix.c, 'matrix.c should be near -73.456871.');
            Y.Assert.areNear(-103.100755, matrix.d, 'matrix.d should be near -103.100755.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).scale(5);

            Y.Assert.areNear(-217.125415, matrix.a, 'matrix.a should be near -217.125415.');
            Y.Assert.areNear(224.277894, matrix.b, 'matrix.b should be near 224.277894.');
            Y.Assert.areNear(243.956355, matrix.c, 'matrix.c should be near 243.956355.');
            Y.Assert.areNear(-438.147, matrix.d, 'matrix.d should be near -438.147.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');

            matrix = matrix.setMatrixValue(matrixStringA).scale(.2);

            Y.Assert.areNear(15.098954, matrix.a, 'matrix.a should be near 15.098954.');
            Y.Assert.areNear(4.630738, matrix.b, 'matrix.b should be near 4.630738.');
            Y.Assert.areNear(-2.938275, matrix.c, 'matrix.c should be near -2.938275.');
            Y.Assert.areNear(-4.12403, matrix.d, 'matrix.d should be near -4.12403.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).scale(.2);

            Y.Assert.areNear(-8.685017, matrix.a, 'matrix.a should be near -8.685017.');
            Y.Assert.areNear(8.971116, matrix.b, 'matrix.b should be near 8.971116.');
            Y.Assert.areNear(9.758254, matrix.c, 'matrix.c should be near 9.758254.');
            Y.Assert.areNear(-17.52588, matrix.d, 'matrix.d should be near -17.52588.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');

            matrix = matrix.setMatrixValue(matrixStringA).scale(-5);

            Y.Assert.areNear(-377.47386, matrix.a, 'matrix.a should be near -377.47386.');
            Y.Assert.areNear(-115.76846, matrix.b, 'matrix.b should be near -115.76846.');
            Y.Assert.areNear(73.456871, matrix.c, 'matrix.c should be near 73.456871.');
            Y.Assert.areNear(103.100755, matrix.d, 'matrix.d should be near 103.100755.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).scale(-5);

            Y.Assert.areNear(217.125415, matrix.a, 'matrix.a should be near 217.125415.');
            Y.Assert.areNear(-224.277894, matrix.b, 'matrix.b should be near -224.277894.');
            Y.Assert.areNear(-243.956355, matrix.c, 'matrix.c should be near -243.956355.');
            Y.Assert.areNear(438.147, matrix.d, 'matrix.d should be near 438.147.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');

            matrix = matrix.setMatrixValue(matrixStringA).scale(-.2);

            Y.Assert.areNear(-15.098954, matrix.a, 'matrix.a should be near -15.098954.');
            Y.Assert.areNear(-4.630738, matrix.b, 'matrix.b should be near -4.630738.');
            Y.Assert.areNear(2.938275, matrix.c, 'matrix.c should be near 2.938275.');
            Y.Assert.areNear(4.12403, matrix.d, 'matrix.d should be near 4.12403.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).scale(-.2);

            Y.Assert.areNear(8.685017, matrix.a, 'matrix.a should be near 8.685017.');
            Y.Assert.areNear(-8.971116, matrix.b, 'matrix.b should be near -8.971116.');
            Y.Assert.areNear(-9.758254, matrix.c, 'matrix.c should be near -9.758254.');
            Y.Assert.areNear(17.52588, matrix.d, 'matrix.d should be near 17.52588.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');

            matrix = matrix.setMatrixValue(matrixStringA).scale(5, .2);

            Y.Assert.areNear(377.47386, matrix.a, 'matrix.a should be near 377.47386.');
            Y.Assert.areNear(115.76846, matrix.b, 'matrix.b should be near 115.76846.');
            Y.Assert.areNear(-2.938275, matrix.c, 'matrix.c should be near -2.938275.');
            Y.Assert.areNear(-4.12403, matrix.d, 'matrix.d should be near -4.12403.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).scale(5, .2);

            Y.Assert.areNear(-217.125415, matrix.a, 'matrix.a should be near -217.125415.');
            Y.Assert.areNear(224.277894, matrix.b, 'matrix.b should be near 224.277894.');
            Y.Assert.areNear(9.758254, matrix.c, 'matrix.c should be near 9.758254.');
            Y.Assert.areNear(-17.52588, matrix.d, 'matrix.d should be near -17.52588.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');

            matrix = matrix.setMatrixValue(matrixStringA).scale(.2, 5);

            Y.Assert.areNear(15.098954, matrix.a, 'matrix.a should be near 15.098954.');
            Y.Assert.areNear(4.630738, matrix.b, 'matrix.b should be near 4.630738.');
            Y.Assert.areNear(-73.456871, matrix.c, 'matrix.c should be near -73.456871.');
            Y.Assert.areNear(-103.100755, matrix.d, 'matrix.d should be near -103.100755.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).scale(.2, 5);

            Y.Assert.areNear(-8.685017, matrix.a, 'matrix.a should be near -8.685017.');
            Y.Assert.areNear(8.971116, matrix.b, 'matrix.b should be near 8.971116.');
            Y.Assert.areNear(243.956355, matrix.c, 'matrix.c should be near 243.956355.');
            Y.Assert.areNear(-438.147, matrix.d, 'matrix.d should be near -438.147.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');

            matrix = matrix.setMatrixValue(matrixStringA).scale(-5, -.2);

            Y.Assert.areNear(-377.47386, matrix.a, 'matrix.a should be near -377.47386.');
            Y.Assert.areNear(-115.76846, matrix.b, 'matrix.b should be near -115.76846.');
            Y.Assert.areNear(2.938275, matrix.c, 'matrix.c should be near 2.938275.');
            Y.Assert.areNear(4.12403, matrix.d, 'matrix.d should be near 4.12403.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).scale(-5, -.2);

            Y.Assert.areNear(217.125415, matrix.a, 'matrix.a should be near 217.125415.');
            Y.Assert.areNear(-224.277894, matrix.b, 'matrix.b should be near -224.277894.');
            Y.Assert.areNear(-9.758254, matrix.c, 'matrix.c should be near -9.758254.');
            Y.Assert.areNear(17.52588, matrix.d, 'matrix.d should be near 17.52588.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');

            matrix = matrix.setMatrixValue(matrixStringA).scale(-.2, -5);

            Y.Assert.areNear(-15.098954, matrix.a, 'matrix.a should be near -15.098954.');
            Y.Assert.areNear(-4.630738, matrix.b, 'matrix.b should be near -4.630738.');
            Y.Assert.areNear(73.456871, matrix.c, 'matrix.c should be near 73.456871.');
            Y.Assert.areNear(103.100755, matrix.d, 'matrix.d should be near 103.100755.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).scale(-.2, -5);

            Y.Assert.areNear(8.685017, matrix.a, 'matrix.a should be near 8.685017.');
            Y.Assert.areNear(-8.971116, matrix.b, 'matrix.b should be near -8.971116.');
            Y.Assert.areNear(-243.956355, matrix.c, 'matrix.c should be near -243.956355.');
            Y.Assert.areNear(438.147, matrix.d, 'matrix.d should be near 438.147.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');
        },
        'test:011-skewX': function () {
            var matrix = new Y.CSSMatrix2d().setMatrixValue(matrixStringA).skewX(40);

            Y.Assert.areNear(75.494772, matrix.a, 'matrix.a should be near 75.494772.');
            Y.Assert.areNear(23.153692, matrix.b, 'matrix.b should be near 23.153692.');
            Y.Assert.areNear(48.656261, matrix.c, 'matrix.c should be near 48.656261.');
            Y.Assert.areNear(-1.191897, matrix.d, 'matrix.d should be near -1.191897.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).skewX(40);

            Y.Assert.areNear(-43.425083, matrix.a, 'matrix.a should be near -43.425083.');
            Y.Assert.areNear(44.855579, matrix.b, 'matrix.b should be near 44.855579.');
            Y.Assert.areNear(12.3533, matrix.c, 'matrix.c should be near 12.3533.');
            Y.Assert.areNear(-49.9911, matrix.d, 'matrix.d should be near -49.9911.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');

            matrix = matrix.setMatrixValue(matrixStringA).skewX(320);

            Y.Assert.areNear(75.494772, matrix.a, 'matrix.a should be near 75.494772.');
            Y.Assert.areNear(23.153692, matrix.b, 'matrix.b should be near 23.153692.');
            Y.Assert.areNear(-78.03901, matrix.c, 'matrix.c should be near -78.03901.');
            Y.Assert.areNear(-40.048405, matrix.d, 'matrix.d should be near -40.048405.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).skewX(320);

            Y.Assert.areNear(-43.425083, matrix.a, 'matrix.a should be near -43.425083.');
            Y.Assert.areNear(44.855579, matrix.b, 'matrix.b should be near 44.855579.');
            Y.Assert.areNear(85.229242, matrix.c, 'matrix.c should be near 85.229242.');
            Y.Assert.areNear(-125.2677, matrix.d, 'matrix.d should be near -125.2677.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');

            matrix = matrix.setMatrixValue(matrixStringA).skewX(-40);

            Y.Assert.areNear(75.494772, matrix.a, 'matrix.a should be near 75.494772.');
            Y.Assert.areNear(23.153692, matrix.b, 'matrix.b should be near 23.153692.');
            Y.Assert.areNear(-78.03901, matrix.c, 'matrix.c should be near -78.03901.');
            Y.Assert.areNear(-40.048405, matrix.d, 'matrix.d should be near -40.048405.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).skewX(-40);

            Y.Assert.areNear(-43.425083, matrix.a, 'matrix.a should be near -43.425083.');
            Y.Assert.areNear(44.855579, matrix.b, 'matrix.b should be near 44.855579.');
            Y.Assert.areNear(85.229242, matrix.c, 'matrix.c should be near 85.229242.');
            Y.Assert.areNear(-125.2677, matrix.d, 'matrix.d should be near -125.2677.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');

            matrix = matrix.setMatrixValue(matrixStringA).skewX(-320);

            Y.Assert.areNear(75.494772, matrix.a, 'matrix.a should be near 75.494772.');
            Y.Assert.areNear(23.153692, matrix.b, 'matrix.b should be near 23.153692.');
            Y.Assert.areNear(48.656261, matrix.c, 'matrix.c should be near 48.656261.');
            Y.Assert.areNear(-1.191897, matrix.d, 'matrix.d should be near -1.191897.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).skewX(-320);

            Y.Assert.areNear(-43.425083, matrix.a, 'matrix.a should be near -43.425083.');
            Y.Assert.areNear(44.855579, matrix.b, 'matrix.b should be near 44.855579.');
            Y.Assert.areNear(12.3533, matrix.c, 'matrix.c should be near 12.3533.');
            Y.Assert.areNear(-49.9911, matrix.d, 'matrix.d should be near -49.9911.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');
        },
        'test:012-skewY': function () {
            var matrix = new Y.CSSMatrix2d().setMatrixValue(matrixStringA).skewY(40);

            Y.Assert.areNear(63.167245, matrix.a, 'matrix.a should be near 63.167245.');
            Y.Assert.areNear(5.851331, matrix.b, 'matrix.b should be near 5.851331.');
            Y.Assert.areNear(-14.691374, matrix.c, 'matrix.c should be near -14.691374.');
            Y.Assert.areNear(-20.620151, matrix.d, 'matrix.d should be near -20.620151.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).skewY(40);

            Y.Assert.areNear(-2.484345, matrix.a, 'matrix.a should be near -2.484345.');
            Y.Assert.areNear(-28.674218, matrix.b, 'matrix.b should be near -28.674218.');
            Y.Assert.areNear(48.791271, matrix.c, 'matrix.c should be near 48.791271.');
            Y.Assert.areNear(-87.6294, matrix.d, 'matrix.d should be near -87.6294.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');

            matrix = matrix.setMatrixValue(matrixStringA).skewY(320);

            Y.Assert.areNear(87.822299, matrix.a, 'matrix.a should be near 87.822299.');
            Y.Assert.areNear(40.456053, matrix.b, 'matrix.b should be near 40.456053.');
            Y.Assert.areNear(-14.691374, matrix.c, 'matrix.c should be near -14.691374.');
            Y.Assert.areNear(-20.620151, matrix.d, 'matrix.d should be near -20.620151.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).skewY(320);

            Y.Assert.areNear(-84.365821, matrix.a, 'matrix.a should be near -84.365821.');
            Y.Assert.areNear(118.385376, matrix.b, 'matrix.b should be near 118.385376.');
            Y.Assert.areNear(48.791271, matrix.c, 'matrix.c should be near 48.791271.');
            Y.Assert.areNear(-87.6294, matrix.d, 'matrix.d should be near -87.6294.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');

            matrix = matrix.setMatrixValue(matrixStringA).skewY(-40);

            Y.Assert.areNear(87.822299, matrix.a, 'matrix.a should be near 87.822299.');
            Y.Assert.areNear(40.456053, matrix.b, 'matrix.b should be near 40.456053.');
            Y.Assert.areNear(-14.691374, matrix.c, 'matrix.c should be near -14.691374.');
            Y.Assert.areNear(-20.620151, matrix.d, 'matrix.d should be near -20.620151.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).skewY(-40);

            Y.Assert.areNear(-84.365821, matrix.a, 'matrix.a should be near -84.365821.');
            Y.Assert.areNear(118.385376, matrix.b, 'matrix.b should be near 118.385376.');
            Y.Assert.areNear(48.791271, matrix.c, 'matrix.c should be near 48.791271.');
            Y.Assert.areNear(-87.6294, matrix.d, 'matrix.d should be near -87.6294.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');

            matrix = matrix.setMatrixValue(matrixStringA).skewY(-320);

            Y.Assert.areNear(63.167245, matrix.a, 'matrix.a should be near 63.167245.');
            Y.Assert.areNear(5.851331, matrix.b, 'matrix.b should be near 5.851331.');
            Y.Assert.areNear(-14.691374, matrix.c, 'matrix.c should be near -14.691374.');
            Y.Assert.areNear(-20.620151, matrix.d, 'matrix.d should be near -20.620151.');
            Y.Assert.areNear(-98.468445, matrix.e, 'matrix.e should be near -98.468445.');
            Y.Assert.areNear(-51.235547, matrix.f, 'matrix.f should be near -51.235547.');

            matrix = matrix.setMatrixValue(matrixStringB).skewY(-320);

            Y.Assert.areNear(-2.484345, matrix.a, 'matrix.a should be near -2.484345.');
            Y.Assert.areNear(-28.674218, matrix.b, 'matrix.b should be near -28.674218.');
            Y.Assert.areNear(48.791271, matrix.c, 'matrix.c should be near 48.791271.');
            Y.Assert.areNear(-87.6294, matrix.d, 'matrix.d should be near -87.6294.');
            Y.Assert.areNear(-11.190033, matrix.e, 'matrix.e should be near -11.190033.');
            Y.Assert.areNear(-19.602279, matrix.f, 'matrix.f should be near -19.602279.');
        },
        'test:013-translate': function () {
            var matrix = new Y.CSSMatrix2d().setMatrixValue(matrixStringA).translate(123.456, -789.012);

            Y.Assert.areNear(75.494772, matrix.a, 'matrix.a should be near 75.494772.');
            Y.Assert.areNear(23.153692, matrix.b, 'matrix.b should be near 23.153692.');
            Y.Assert.areNear(-14.691374, matrix.c, 'matrix.c should be near -14.691374.');
            Y.Assert.areNear(-20.620151, matrix.d, 'matrix.d should be near -20.620151.');
            Y.Assert.areNear(20813.484667, matrix.e, 'matrix.e should be near 20813.484667.');
            Y.Assert.areNear(19076.773233, matrix.f, 'matrix.f should be near 19076.773233.');

            matrix = matrix.setMatrixValue(matrixStringB).translate(123.456, -789.012);

            Y.Assert.areNear(-43.425083, matrix.a, 'matrix.a should be near -43.425083.');
            Y.Assert.areNear(44.855579, matrix.b, 'matrix.b should be near 44.855579.');
            Y.Assert.areNear(48.791271, matrix.c, 'matrix.c should be near 48.791271.');
            Y.Assert.areNear(-87.6294, matrix.d, 'matrix.d should be near -87.6294.');
            Y.Assert.areNear(-43869.175394, matrix.e, 'matrix.e should be near -43869.175394.');
            Y.Assert.areNear(74658.73621, matrix.f, 'matrix.f should be near 74658.73621.');
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: [
        'gallery-cssmatrix2d',
        'test'
    ]
});