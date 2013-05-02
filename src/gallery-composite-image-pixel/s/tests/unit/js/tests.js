YUI.add('module-tests', function (Y) {
    'use strict';

    var global = Y.config.global,
        suite = new Y.Test.Suite('gallery-composite-image-pixels'),
        
        u8Exists = 'Uint8ClampedArray' in global;

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'test:001-apiExists': function () {
            Y.Assert.isObject(Y.Composite, 'Y.Composite should be an object.');
            Y.Assert.isFunction(Y.Composite.Image, 'Y.Composite.Image should be a function.');

            var image = new Y.Composite.Image({
                    dimensions: [
                        3,
                        3
                    ]
                }),
                test = this;

            Y.Assert.isObject(image, 'image should be an object.');
            Y.Assert.isInstanceOf(Y.Composite.Image, image, 'image should be an instance of Y.Composite.Image.');

            Y.Assert.isUndefined(image.pixels, 'image.pixels should be undefined.');

            Y.use('gallery-composite-image-pixels', function () {
                test.resume(function () {
                    Y.Assert.isFunction(Y.Composite.Image.Pixels, 'Y.Composite.Image.Pixels should be a function.');

                    Y.Assert.isFunction(Y.Composite.Image.Pixels._getPixelGetter, 'Y.Composite.Image.Pixels._getPixelGetter should be a function.');

                    Y.Assert.isFunction(image._getPixels, 'image._getPixels should be a function.');

                    var pixels = new Y.Composite.Image.Pixels(image);

                    Y.Assert.isObject(pixels, 'pixels should be an object.');
                    Y.Assert.isInstanceOf(Y.Composite.Image.Pixels, pixels, 'pixels should be an instance of Y.Composite.Image.Pixels.');

                    Y.Assert.areSame(image, pixels.image, 'pixels.image should be the same as image.');
                    Y.Assert.areSame(image.pixelCount, pixels.length, 'pixels.length should be the same as image.pixelCount.');

                    Y.Assert.areSame(0, pixels[1][0], 'pixel[1][0] should be 0.');
                    Y.Assert.areSame(0, pixels[1][1], 'pixel[1][1] should be 0.');
                    Y.Assert.areSame(0, pixels[1][2], 'pixel[1][2] should be 0.');
                    Y.Assert.areSame(0, pixels[1][3], 'pixel[1][3] should be 0.');
                    Y.Assert.areSame(0, pixels[[
                        2,
                        2
                    ]][0], 'pixel[[2, 2]][0] should be 0.');
                    Y.Assert.areSame(0, pixels[[
                        2,
                        2
                    ]][1], 'pixel[[2, 2]][1] should be 0.');
                    Y.Assert.areSame(0, pixels[[
                        2,
                        2
                    ]][2], 'pixel[[2, 2]][2] should be 0.');
                    Y.Assert.areSame(0, pixels[[
                        2,
                        2
                    ]][3], 'pixel[[2, 2]][3] should be 0.');

                    pixels[1][0] = 8;
                    pixels[1][1] = 13;
                    pixels[1][2] = 21;
                    pixels[1][3] = 34;
                    pixels[[
                        2,
                        2
                    ]][0] = 55;
                    pixels[[
                        2,
                        2
                    ]][1] = 89;
                    pixels[[
                        2,
                        2
                    ]][2] = 144;
                    pixels[[
                        2,
                        2
                    ]][3] = 233;

                    Y.Assert.areSame(8, image.getValue(1, 0), 'image.getValue(1, 0) should be 8.');
                    Y.Assert.areSame(13, image.getValue(1, 1), 'image.getValue(1, 1) should be 13.');
                    Y.Assert.areSame(21, image.getValue(1, 2), 'image.getValue(1, 2) should be 21.');
                    Y.Assert.areSame(34, image.getValue(1, 3), 'image.getValue(1, 3) should be 34.');
                    Y.Assert.areSame(55, image.getValue([
                        2,
                        2
                    ], 0), 'image.getValue([2, 2], 0) should be 55.');
                    Y.Assert.areSame(89, image.getValue([
                        2,
                        2
                    ], 1), 'image.getValue([2, 2], 1) should be 89.');
                    Y.Assert.areSame(144, image.getValue([
                        2,
                        2
                    ], 2), 'image.getValue([2, 2], 2) should be 144.');
                    Y.Assert.areSame(233, image.getValue([
                        2,
                        2
                    ], 3), 'image.getValue([2, 2], 3) should be 233.');
                });
            });

            test.wait(6765);
        },
        'test:002-pixels': function () {
            var image = new Y.Composite.Image({
                    dimensions: [
                        3,
                        3
                    ]
                }),
                pixels = image.pixels;

            Y.Assert.isObject(pixels, 'pixels should be an object.');
            Y.Assert.isInstanceOf(Y.Composite.Image.Pixels, pixels, 'pixels should be an instance of Y.Composite.Image.Pixels.');

            Y.Assert.areSame(image, pixels.image, 'pixels.image should be the same as image.');
            Y.Assert.areSame(image.pixelCount, pixels.length, 'pixels.length should be the same as image.pixelCount.');

            Y.Assert.areSame(0, pixels[1][0], 'pixel[1][0] should be 0.');
            Y.Assert.areSame(0, pixels[1][1], 'pixel[1][1] should be 0.');
            Y.Assert.areSame(0, pixels[1][2], 'pixel[1][2] should be 0.');
            Y.Assert.areSame(0, pixels[1][3], 'pixel[1][3] should be 0.');
            Y.Assert.areSame(0, pixels[[
                2,
                2
            ]][0], 'pixel[[2, 2]][0] should be 0.');
            Y.Assert.areSame(0, pixels[[
                2,
                2
            ]][1], 'pixel[[2, 2]][1] should be 0.');
            Y.Assert.areSame(0, pixels[[
                2,
                2
            ]][2], 'pixel[[2, 2]][2] should be 0.');
            Y.Assert.areSame(0, pixels[[
                2,
                2
            ]][3], 'pixel[[2, 2]][3] should be 0.');

            pixels[1][0] = 8;
            pixels[1][1] = 13;
            pixels[1][2] = 21;
            pixels[1][3] = 34;
            pixels[[
                2,
                2
            ]][0] = 55;
            pixels[[
                2,
                2
            ]][1] = 89;
            pixels[[
                2,
                2
            ]][2] = 144;
            pixels[[
                2,
                2
            ]][3] = 233;

            Y.Assert.areSame(8, image.getValue(1, 0), 'image.getValue(1, 0) should be 8.');
            Y.Assert.areSame(13, image.getValue(1, 1), 'image.getValue(1, 1) should be 13.');
            Y.Assert.areSame(21, image.getValue(1, 2), 'image.getValue(1, 2) should be 21.');
            Y.Assert.areSame(34, image.getValue(1, 3), 'image.getValue(1, 3) should be 34.');
            Y.Assert.areSame(55, image.getValue([
                2,
                2
            ], 0), 'image.getValue([2, 2], 0) should be 55.');
            Y.Assert.areSame(89, image.getValue([
                2,
                2
            ], 1), 'image.getValue([2, 2], 1) should be 89.');
            Y.Assert.areSame(144, image.getValue([
                2,
                2
            ], 2), 'image.getValue([2, 2], 2) should be 144.');
            Y.Assert.areSame(233, image.getValue([
                2,
                2
            ], 3), 'image.getValue([2, 2], 3) should be 233.');

            Y.Assert.areSame(pixels, image._pixels, 'image._pixels should be the same as pixels.');
        },
        'test:003-toJSON': function () {
            var image = new Y.Composite.Image({
                    dimensions: [
                        3,
                        3
                    ]
                }),
                pixels = image.pixels;

            pixels[1][0] = 8;
            pixels[1][1] = 13;
            pixels[1][2] = 21;
            pixels[1][3] = 34;
            pixels[[
                2,
                2
            ]][0] = 55;
            pixels[[
                2,
                2
            ]][1] = 89;
            pixels[[
                2,
                2
            ]][2] = 144;
            pixels[[
                2,
                2
            ]][3] = 233;

            Y.Assert.areSame('[[0,0,0,0],[8,13,21,34],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[55,89,144,233]]', Y.JSON.stringify(pixels.toJSON()), 'Y.JSON.stringify(pixels.toJSON()) should return the expected string.');
        },
        'test:004-toString': function () {
            var image = new Y.Composite.Image({
                    dimensions: [
                        3,
                        3
                    ]
                });

            Y.Assert.areSame('image-pixels[' + image.toString() + ']', image.pixels.toString(), 'image.pixels.toString() should return the expected string.');
        },
        _should: {
            ignore: {
                'test:001-apiExists': !u8Exists,
                'test:002-pixels': !u8Exists,
                'test:003-toJSON': !u8Exists,
                'test:004-toString': !u8Exists
            }
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: [
        'gallery-composite-image',
        'json-stringify',
        'test'
    ]
});