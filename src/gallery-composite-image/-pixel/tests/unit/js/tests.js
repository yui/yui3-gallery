YUI.add('module-tests', function (Y) {
    'use strict';

    var global = Y.config.global,
        suite = new Y.Test.Suite('gallery-composite-image-pixel'),

        u8Exists = 'Uint8ClampedArray' in global;

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'test:001-apiExists': function () {
            Y.Assert.isObject(Y.Composite, 'Y.Composite should be an object.');
            Y.Assert.isFunction(Y.Composite.Image, 'Y.Composite.Image should be a function.');

            var image = new Y.Composite.Image(),
                test = this;

            Y.Assert.isObject(image, 'image should be an object.');
            Y.Assert.isInstanceOf(Y.Composite.Image, image, 'image should be an instance of Y.Composite.Image.');

            Y.Assert.isUndefined(image.getPixel, 'image.getPixel should be undefined.');

            Y.use('gallery-composite-image-pixel', function () {
                test.resume(function () {
                    Y.Assert.isFunction(Y.Composite.Image.Pixel, 'Y.Composite.Image.Pixel should be a function.');

                    Y.Assert.isFunction(Y.Composite.Image.Pixel._getChannelGetter, 'Y.Composite.Image.Pixel._getChannelGetter should be a function.');
                    Y.Assert.isFunction(Y.Composite.Image.Pixel._getChannelSetter, 'Y.Composite.Image.Pixel._getChannelSetter should be a function.');

                    Y.Assert.isFunction(image.getPixel, 'image.getPixel should be a function.');

                    Y.Assert.isFunction(image._getPixel, 'image._getPixel should be a function.');
                    Y.Assert.isUndefined(image._pixelCache, 'image._pixelCache should be undefined.');

                    var pixel = new Y.Composite.Image.Pixel(image, 0);

                    Y.Assert.isObject(pixel, 'pixel should be an object.');
                    Y.Assert.isInstanceOf(Y.Composite.Image.Pixel, pixel, 'pixel should be an instance of Y.Composite.Image.Pixel.');

                    Y.Assert.areSame(image, pixel.image, 'pixel.image should be the same as image.');
                    Y.Assert.areSame(image.channels.length, pixel.length, 'pixel.length should be the same as image.channels.length.');
                    Y.Assert.areSame(0, pixel.pixelIndex, 'pixel.pixelIndex should be 0.');

                    Y.Assert.areSame(0, pixel[0], 'pixel[0] should be 0.');
                    Y.Assert.areSame(0, pixel[1], 'pixel[1] should be 0.');
                    Y.Assert.areSame(0, pixel[2], 'pixel[2] should be 0.');
                    Y.Assert.areSame(0, pixel[3], 'pixel[3] should be 0.');

                    pixel[0] = 55;
                    pixel[1] = 89;
                    pixel[2] = 144;
                    pixel[3] = 233;

                    Y.Assert.areSame(55, image.getValue(0, 0), 'image.getValue(0, 0) should be 55.');
                    Y.Assert.areSame(89, image.getValue(0, 1), 'image.getValue(0, 1) should be 89.');
                    Y.Assert.areSame(144, image.getValue(0, 2), 'image.getValue(0, 2) should be 144.');
                    Y.Assert.areSame(233, image.getValue(0, 3), 'image.getValue(0, 3) should be 233.');
                });
            });

            test.wait(6765);
        },
        'test:002-getPixel': function () {
            var image = new Y.Composite.Image({
                    channels: [
                        'f64',
                        'u8',
                        'u8',
                        'u8',
                        'u8',
                        'u8',
                        'u8',
                        'u8',
                        'u8'
                    ],
                    dimensions: [
                        3
                    ]
                }),
                pixel = image.getPixel(1);

            Y.Assert.isObject(pixel, 'pixel should be an object.');
            Y.Assert.isInstanceOf(Y.Composite.Image.Pixel, pixel, 'pixel should be an instance of Y.Composite.Image.Pixel.');

            Y.Assert.areSame(image, pixel.image, 'pixel.image should be the same as image.');
            Y.Assert.areSame(image.channels.length, pixel.length, 'pixel.length should be the same as image.channels.length.');
            Y.Assert.areSame(1, pixel.pixelIndex, 'pixel.pixelIndex should be 1.');

            Y.Assert.areSame(0, pixel[0], 'pixel[0] should be 0.');
            Y.Assert.areSame(0, pixel[1], 'pixel[1] should be 0.');
            Y.Assert.areSame(0, pixel[2], 'pixel[2] should be 0.');
            Y.Assert.areSame(0, pixel[3], 'pixel[3] should be 0.');
            Y.Assert.areSame(0, pixel[4], 'pixel[4] should be 0.');
            Y.Assert.areSame(0, pixel[5], 'pixel[5] should be 0.');
            Y.Assert.areSame(0, pixel[6], 'pixel[6] should be 0.');
            Y.Assert.areSame(0, pixel[7], 'pixel[7] should be 0.');
            Y.Assert.areSame(0, pixel[8], 'pixel[8] should be 0.');

            pixel[0] = -1234.567;
            pixel[1] = 233;
            pixel[2] = 144;
            pixel[3] = 89;
            pixel[4] = 55;
            pixel[5] = 34;
            pixel[6] = 21;
            pixel[7] = 13;
            pixel[8] = 8;

            Y.Assert.areSame(-1234.567, image.getValue(1, 0), 'image.getValue(0, 0) should be -1234.567.');
            Y.Assert.areSame(233, image.getValue(1, 1), 'image.getValue(0, 1) should be 233.');
            Y.Assert.areSame(144, image.getValue(1, 2), 'image.getValue(0, 2) should be 144.');
            Y.Assert.areSame(89, image.getValue(1, 3), 'image.getValue(0, 3) should be 89.');
            Y.Assert.areSame(55, image.getValue(1, 4), 'image.getValue(0, 1) should be 55.');
            Y.Assert.areSame(34, image.getValue(1, 5), 'image.getValue(0, 2) should be 34.');
            Y.Assert.areSame(21, image.getValue(1, 6), 'image.getValue(0, 3) should be 21.');
            Y.Assert.areSame(13, image.getValue(1, 7), 'image.getValue(0, 1) should be 13.');
            Y.Assert.areSame(8, image.getValue(1, 8), 'image.getValue(0, 2) should be 8.');

            Y.Assert.areSame(pixel, image.getPixel([
                1
            ]), 'Repeated calls to getPixel should return the same object.');
        },
        'test:003-toJSON': function () {
            var image = new Y.Composite.Image({
                    channels: [
                        'f64',
                        'u8',
                        'u8',
                        'u8',
                        'u8',
                        'u8',
                        'u8',
                        'u8',
                        'u8'
                    ],
                    dimensions: [
                        3
                    ]
                }),
                pixel = image.getPixel(1);

            pixel[0] = -1234.567;
            pixel[1] = 233;
            pixel[2] = 144;
            pixel[3] = 89;
            pixel[4] = 55;
            pixel[5] = 34;
            pixel[6] = 21;
            pixel[7] = 13;
            pixel[8] = 8;

            Y.ArrayAssert.itemsAreSame([
                -1234.567,
                233,
                144,
                89,
                55,
                34,
                21,
                13,
                8
            ], pixel.toJSON(), 'pixel.toJSON() should return an array of expected values.');
        },
        'test:004-toString': function () {
            var image = new Y.Composite.Image({
                    channels: [
                        'f64',
                        'u8',
                        'u8',
                        'u8',
                        'u8',
                        'u8',
                        'u8',
                        'u8',
                        'u8'
                    ],
                    dimensions: [
                        3
                    ]
                }),
                pixel = image.getPixel(1);

            pixel[0] = -1234.567;
            pixel[1] = 233;
            pixel[2] = 144;
            pixel[3] = 89;
            pixel[4] = 55;
            pixel[5] = 34;
            pixel[6] = 21;
            pixel[7] = 13;
            pixel[8] = 8;

            Y.Assert.areSame('pixel[' + [
                -1234.567,
                233,
                144,
                89,
                55,
                34,
                21,
                13,
                8
            ].toString() + ']', pixel.toString(), 'pixel.toString() should return the expected string.');
        },
        _should: {
            ignore: {
                'test:001-apiExists': !u8Exists,
                'test:002-getPixel': !u8Exists,
                'test:003-toJSON': !u8Exists,
                'test:004-toString': !u8Exists
            }
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: [
        'gallery-composite-image',
        'test'
    ]
});