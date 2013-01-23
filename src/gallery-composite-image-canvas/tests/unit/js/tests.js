YUI.add('module-tests', function (Y) {
    'use strict';

    var global = Y.config.global,
        suite = new Y.Test.Suite('gallery-composite-image-canvas'),
        
        f32Exists = 'Float32Array' in global,
        f64Exists = 'Float64Array' in global,
        s16Exists = 'Int16Array' in global,
        s32Exists = 'Int32Array' in global,
        s8Exists = 'Int8Array' in global,
        u16Exists = 'Uint16Array' in global,
        u32Exists = 'Uint32Array' in global,
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

            Y.Assert.isUndefined(image.supportsCanvas, 'image.supportsCanvas should be undefined.');

            Y.use('gallery-composite-image-canvas', function () {
                test.resume(function () {
                    Y.Assert.isFunction(Y.Composite.Image.fromCanvas, 'Y.Composite.Image.fromCanvas should be a function.');

                    Y.Assert.isFunction(Y.Composite.Image._getContext, 'Y.Composite.Image._getContext should be a function.');
                    Y.Assert.isFunction(Y.Composite.Image._getConvertFromU8Method, 'Y.Composite.Image._getConvertFromU8Method should be a function.');
                    Y.Assert.isFunction(Y.Composite.Image._getConvertToU8Method, 'Y.Composite.Image._getConvertToU8Method should be a function.');
                    Y.Assert.isFunction(Y.Composite.Image._getFromImageDataMethod, 'Y.Composite.Image._getFromImageDataMethod should be a function.');
                    Y.Assert.isFunction(Y.Composite.Image._getImageData, 'Y.Composite.Image._getImageData should be a function.');
                    Y.Assert.isFunction(Y.Composite.Image._getToImageDataMethod, 'Y.Composite.Image._getToImageDataMethod should be a function.');

                    image = new Y.Composite.Image();

                    Y.Assert.isObject(image, 'image should be an object.');
                    Y.Assert.isInstanceOf(Y.Composite.Image, image, 'image should be an instance of Y.Composite.Image.');

                    Y.Assert.isFunction(image.fromCanvas, 'image.fromCanvas should be a function.');
                    Y.Assert.isFunction(image.toCanvas, 'image.toCanvas should be a function.');

                    Y.Assert.isFunction(image._convertFromU8, 'image._convertFromU8 should be a function.');
                    Y.Assert.isFunction(image._convertToU8, 'image._convertToU8 should be a function.');
                    Y.Assert.isFunction(image._fromImageData, 'image._fromImageData should be a function.');
                    Y.Assert.isFunction(image._toImageData, 'image._toImageData should be a function.');

                    Y.Assert.isTrue(image.supportsCanvas, 'image.supportsCanvas should be true.');
                });
            });

            test.wait(6765);
        },
        'test:002-supportsCanvasFalse': function () {
            var channelCount,
                channelIndex,
                channels,
                dimensionCount,
                dimensionIndex,
                dimensions;

            for (channelCount = 1; channelCount <= 5; channelCount += 1) {
                for (channelIndex = 0, channels = []; channelIndex < channelCount; channelIndex += 1) {
                    channels.push('u8');
                }

                for (dimensionCount = 1; dimensionCount <= 3; dimensionCount += 1) {
                    if (channelCount === 4 && dimensionCount === 2) {
                        continue;
                    }

                    for (dimensionIndex = 0, dimensions = []; dimensionIndex < dimensionCount; dimensionIndex += 1) {
                        dimensions.push(8);
                    }

                    Y.Assert.isFalse(new Y.Composite.Image({
                        channels: channels,
                        dimensions: dimensions
                    }).supportsCanvas, 'A ' + channelCount + '-channel, ' + dimensionCount + '-dimensional image should not support canvas.');
                }
            }
        },
        'test:003-supportsCanvasTrue': function () {
            Y.Assert.isTrue(new Y.Composite.Image({
                channels: [
                    'f32',
                    'f32',
                    'f32',
                    'f32'
                ],
                dimensions: [
                    8,
                    8
                ]
            }).supportsCanvas, 'f32 images should support canvas.');

            Y.Assert.isTrue(new Y.Composite.Image({
                channels: [
                    'f64',
                    'f64',
                    'f64',
                    'f64'
                ],
                dimensions: [
                    8,
                    8
                ]
            }).supportsCanvas, 'f64 images should support canvas.');

            Y.Assert.isTrue(new Y.Composite.Image({
                channels: [
                    's16',
                    's16',
                    's16',
                    's16'
                ],
                dimensions: [
                    8,
                    8
                ]
            }).supportsCanvas, 's16 images should support canvas.');

            Y.Assert.isTrue(new Y.Composite.Image({
                channels: [
                    's32',
                    's32',
                    's32',
                    's32'
                ],
                dimensions: [
                    8,
                    8
                ]
            }).supportsCanvas, 's32 images should support canvas.');

            Y.Assert.isTrue(new Y.Composite.Image({
                channels: [
                    's8',
                    's8',
                    's8',
                    's8'
                ],
                dimensions: [
                    8,
                    8
                ]
            }).supportsCanvas, 's8 images should support canvas.');

            Y.Assert.isTrue(new Y.Composite.Image({
                channels: [
                    'u16',
                    'u16',
                    'u16',
                    'u16'
                ],
                dimensions: [
                    8,
                    8
                ]
            }).supportsCanvas, 'u16 images should support canvas.');

            Y.Assert.isTrue(new Y.Composite.Image({
                channels: [
                    'u32',
                    'u32',
                    'u32',
                    'u32'
                ],
                dimensions: [
                    8,
                    8
                ]
            }).supportsCanvas, 'u32 images should support canvas.');

            Y.Assert.isTrue(new Y.Composite.Image({
                channels: [
                    'u8',
                    'u8',
                    'u8',
                    'u8'
                ],
                dimensions: [
                    8,
                    8
                ]
            }).supportsCanvas, 'u8 images should support canvas.');

            Y.Assert.isTrue(new Y.Composite.Image({
                channels: [
                    'f32',
                    'u8',
                    'f64',
                    's16'
                ],
                dimensions: [
                    8,
                    8
                ]
            }).supportsCanvas, 'Mixed type images should support canvas.');
        },
        'test:004-_getContext': function () {
            var context = Y.Composite.Image._getContext(Y.Node.create('<canvas height="5" width="5"></canvas>'));

            Y.Assert.isObject(context, 'context should be an object.');
            Y.Assert.isInstanceOf(CanvasRenderingContext2D, context, 'context should be an instance of CanvasRenderingContext2D.');
        },
        'test:005-_getImageData': function () {
            var imageData = Y.Composite.Image._getImageData(Y.Composite.Image._getContext(Y.Node.create('<canvas height="5" width="5"></canvas>')));

            Y.Assert.isObject(imageData, 'context should be an object.');
            Y.Assert.isInstanceOf(ImageData, imageData, 'context should be an instance of ImageData.');
        },
        'test:006-fromCanvas-static': function () {
            var canvasNode = Y.Node.create('<canvas height="8" width="5"></canvas>'),
                context = Y.Composite.Image._getContext(canvasNode),
                image;

            context.fillStyle = 'rgb(55,89,144)';
            context.fillRect(0, 0, 5, 8);

            image = Y.Composite.Image.fromCanvas(canvasNode);

            Y.Assert.isObject(image, 'image should be an object.');
            Y.Assert.isInstanceOf(Y.Composite.Image, image, 'image should be an instance of Y.Composite.Image.');

            Y.ArrayAssert.itemsAreSame([
                5,
                8
            ], image.dimensions, 'image.dimensions should be [5, 8].');
            Y.Assert.isTrue(image.supportsCanvas, 'image should support canvas.');
            Y.Assert.areSame('u8', image._dataType, 'image._dataType should be \'u8\'.');

            image.eachPixelIndex(function (pixelIndex) {
                Y.ArrayAssert.itemsAreSame([
                    55,
                    89,
                    144,
                    255
                ], image.getPixelValues(pixelIndex), 'Pixel values should match expected values.');
            });

            Y.Assert.isNull(Y.Composite.Image.fromCanvas('#selectorToNodeThatDoesNotExist'), 'Y.Composite.Image.fromCanvas should return null if there is no canvas.');
        },
        'test:007-fromCanvas': function () {
            var canvasNode = Y.Node.create('<canvas height="8" width="5"></canvas>'),
                context = Y.Composite.Image._getContext(canvasNode);

            context.fillStyle = 'rgb(55,89,144)';
            context.fillRect(0, 0, 5, 8);

            new Y.Composite.Image({
                channels: [
                    'f32',
                    'f32',
                    'f32',
                    'f32'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).fromCanvas(canvasNode).eachPixelIndex(function (pixelIndex, image) {
                Y.ArrayAssert.itemsAreSame([
                    0.21568627655506134,
                    0.3490196168422699,
                    0.5647059082984924,
                    1
                ], image.getPixelValues(pixelIndex), 'Pixel values should match expected values.');
            });

            new Y.Composite.Image({
                channels: [
                    'f64',
                    'f64',
                    'f64',
                    'f64'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).fromCanvas(canvasNode).eachPixelIndex(function (pixelIndex, image) {
                Y.ArrayAssert.itemsAreSame([
                    0.21568627450980393,
                    0.34901960784313724,
                    0.5647058823529412,
                    1
                ], image.getPixelValues(pixelIndex), 'Pixel values should match expected values.');
            });

            new Y.Composite.Image({
                channels: [
                    's16',
                    's16',
                    's16',
                    's16'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).fromCanvas(canvasNode).eachPixelIndex(function (pixelIndex, image) {
                Y.ArrayAssert.itemsAreSame([
                    55,
                    89,
                    144,
                    255
                ], image.getPixelValues(pixelIndex), 'Pixel values should match expected values.');
            });

            new Y.Composite.Image({
                channels: [
                    's32',
                    's32',
                    's32',
                    's32'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).fromCanvas(canvasNode).eachPixelIndex(function (pixelIndex, image) {
                Y.ArrayAssert.itemsAreSame([
                    55,
                    89,
                    144,
                    255
                ], image.getPixelValues(pixelIndex), 'Pixel values should match expected values.');
            });

            new Y.Composite.Image({
                channels: [
                    's8',
                    's8',
                    's8',
                    's8'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).fromCanvas(canvasNode).eachPixelIndex(function (pixelIndex, image) {
                Y.ArrayAssert.itemsAreSame([
                    27,
                    44,
                    72,
                    127
                ], image.getPixelValues(pixelIndex), 'Pixel values should match expected values.');
            });

            new Y.Composite.Image({
                channels: [
                    'u16',
                    'u16',
                    'u16',
                    'u16'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).fromCanvas(canvasNode).eachPixelIndex(function (pixelIndex, image) {
                Y.ArrayAssert.itemsAreSame([
                    55,
                    89,
                    144,
                    255
                ], image.getPixelValues(pixelIndex), 'Pixel values should match expected values.');
            });

            new Y.Composite.Image({
                channels: [
                    'u32',
                    'u32',
                    'u32',
                    'u32'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).fromCanvas(canvasNode).eachPixelIndex(function (pixelIndex, image) {
                Y.ArrayAssert.itemsAreSame([
                    55,
                    89,
                    144,
                    255
                ], image.getPixelValues(pixelIndex), 'Pixel values should match expected values.');
            });

            new Y.Composite.Image({
                channels: [
                    'u8',
                    'u8',
                    'u8',
                    'u8'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).fromCanvas(canvasNode).eachPixelIndex(function (pixelIndex, image) {
                Y.ArrayAssert.itemsAreSame([
                    55,
                    89,
                    144,
                    255
                ], image.getPixelValues(pixelIndex), 'Pixel values should match expected values.');
            });

            new Y.Composite.Image({
                channels: [
                    'u16',
                    'f64',
                    's16',
                    'u32'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).fromCanvas(canvasNode).eachPixelIndex(function (pixelIndex, image) {
                Y.ArrayAssert.itemsAreSame([
                    55,
                    0.34901960784313724,
                    144,
                    255
                ], image.getPixelValues(pixelIndex), 'Pixel values should match expected values.');
            });
            
            new Y.Composite.Image({
                channels: [
                    'u8',
                    'u8',
                    'u8',
                    'u8'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).fromCanvas('#selectorToNodeThatDoesNotExist').eachPixelIndex(function (pixelIndex, image) {
                Y.ArrayAssert.itemsAreSame([
                    0,
                    0,
                    0,
                    0
                ], image.getPixelValues(pixelIndex), 'Pixel values should match expected values.');
            });
        },
        'test:008-toCanvas': function () {
            var canvasNode,
                data = [
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255,
                    55,
                    89,
                    144,
                    255
                ],
                image;

            image = new Y.Composite.Image({
                channels: [
                    'f32',
                    'f32',
                    'f32',
                    'f32'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).eachPixelIndex(function (pixelIndex, image) {
                image.setPixelValues(pixelIndex, [
                    0.21568627655506134,
                    0.3490196168422699,
                    0.5647059082984924,
                    1
                ]);
            });
            
            canvasNode = image.toCanvas();

            Y.Assert.isObject(canvasNode, 'canvasNode should be an object.');
            Y.Assert.isInstanceOf(Y.Node, canvasNode, 'canvasNode should be an instance of Y.Node.');
            Y.ArrayAssert.itemsAreSame(data, canvasNode.getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
            Y.ArrayAssert.itemsAreSame(data, image.toCanvas(Y.Node.create('<canvas height="8" width="5"></canvas>')).getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
            
            image = new Y.Composite.Image({
                channels: [
                    'f64',
                    'f64',
                    'f64',
                    'f64'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).eachPixelIndex(function (pixelIndex, image) {
                image.setPixelValues(pixelIndex, [
                    0.21568627450980393,
                    0.34901960784313724,
                    0.5647058823529412,
                    1
                ]);
            });
            
            canvasNode = image.toCanvas();

            Y.Assert.isObject(canvasNode, 'canvasNode should be an object.');
            Y.Assert.isInstanceOf(Y.Node, canvasNode, 'canvasNode should be an instance of Y.Node.');
            Y.ArrayAssert.itemsAreSame(data, canvasNode.getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
            Y.ArrayAssert.itemsAreSame(data, image.toCanvas(Y.Node.create('<canvas height="8" width="5"></canvas>')).getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
            
            image = new Y.Composite.Image({
                channels: [
                    's16',
                    's16',
                    's16',
                    's16'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).eachPixelIndex(function (pixelIndex, image) {
                image.setPixelValues(pixelIndex, [
                    55,
                    89,
                    144,
                    255
                ]);
            });
            
            canvasNode = image.toCanvas();

            Y.Assert.isObject(canvasNode, 'canvasNode should be an object.');
            Y.Assert.isInstanceOf(Y.Node, canvasNode, 'canvasNode should be an instance of Y.Node.');
            Y.ArrayAssert.itemsAreSame(data, canvasNode.getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
            Y.ArrayAssert.itemsAreSame(data, image.toCanvas(Y.Node.create('<canvas height="8" width="5"></canvas>')).getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
            
            image = new Y.Composite.Image({
                channels: [
                    's32',
                    's32',
                    's32',
                    's32'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).eachPixelIndex(function (pixelIndex, image) {
                image.setPixelValues(pixelIndex, [
                    55,
                    89,
                    144,
                    255
                ]);
            });
            
            canvasNode = image.toCanvas();

            Y.Assert.isObject(canvasNode, 'canvasNode should be an object.');
            Y.Assert.isInstanceOf(Y.Node, canvasNode, 'canvasNode should be an instance of Y.Node.');
            Y.ArrayAssert.itemsAreSame(data, canvasNode.getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
            Y.ArrayAssert.itemsAreSame(data, image.toCanvas(Y.Node.create('<canvas height="8" width="5"></canvas>')).getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
            
            image = new Y.Composite.Image({
                channels: [
                    's8',
                    's8',
                    's8',
                    's8'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).eachPixelIndex(function (pixelIndex, image) {
                image.setPixelValues(pixelIndex, [
                    27,
                    44,
                    72,
                    127
                ]);
            });
            
            canvasNode = image.toCanvas();

            Y.Assert.isObject(canvasNode, 'canvasNode should be an object.');
            Y.Assert.isInstanceOf(Y.Node, canvasNode, 'canvasNode should be an instance of Y.Node.');
            (function (data) {
                Y.ArrayAssert.itemsAreSame(data, canvasNode.getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
                Y.ArrayAssert.itemsAreSame(data, image.toCanvas(Y.Node.create('<canvas height="8" width="5"></canvas>')).getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
            }(Y.Array.map(data, function (value) {
                return value === 55 ? 54 : value === 89 ? 88 : value === 144 ? 145 : value;
            })));
            
            image = new Y.Composite.Image({
                channels: [
                    'u16',
                    'u16',
                    'u16',
                    'u16'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).eachPixelIndex(function (pixelIndex, image) {
                image.setPixelValues(pixelIndex, [
                    55,
                    89,
                    144,
                    255
                ]);
            });
            
            canvasNode = image.toCanvas();

            Y.Assert.isObject(canvasNode, 'canvasNode should be an object.');
            Y.Assert.isInstanceOf(Y.Node, canvasNode, 'canvasNode should be an instance of Y.Node.');
            Y.ArrayAssert.itemsAreSame(data, canvasNode.getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
            Y.ArrayAssert.itemsAreSame(data, image.toCanvas(Y.Node.create('<canvas height="8" width="5"></canvas>')).getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
            
            image = new Y.Composite.Image({
                channels: [
                    'u32',
                    'u32',
                    'u32',
                    'u32'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).eachPixelIndex(function (pixelIndex, image) {
                image.setPixelValues(pixelIndex, [
                    55,
                    89,
                    144,
                    255
                ]);
            });
            
            canvasNode = image.toCanvas();

            Y.Assert.isObject(canvasNode, 'canvasNode should be an object.');
            Y.Assert.isInstanceOf(Y.Node, canvasNode, 'canvasNode should be an instance of Y.Node.');
            Y.ArrayAssert.itemsAreSame(data, canvasNode.getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
            Y.ArrayAssert.itemsAreSame(data, image.toCanvas(Y.Node.create('<canvas height="8" width="5"></canvas>')).getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
            
            image = new Y.Composite.Image({
                channels: [
                    'u8',
                    'u8',
                    'u8',
                    'u8'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).eachPixelIndex(function (pixelIndex, image) {
                image.setPixelValues(pixelIndex, [
                    55,
                    89,
                    144,
                    255
                ]);
            });
            
            canvasNode = image.toCanvas();

            Y.Assert.isObject(canvasNode, 'canvasNode should be an object.');
            Y.Assert.isInstanceOf(Y.Node, canvasNode, 'canvasNode should be an instance of Y.Node.');
            Y.ArrayAssert.itemsAreSame(data, canvasNode.getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
            Y.ArrayAssert.itemsAreSame(data, image.toCanvas(Y.Node.create('<canvas height="8" width="5"></canvas>')).getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
            
            image = new Y.Composite.Image({
                channels: [
                    'f32',
                    'u16',
                    's32',
                    'f64'
                ],
                dimensions: [
                    5,
                    8
                ]
            }).eachPixelIndex(function (pixelIndex, image) {
                image.setPixelValues(pixelIndex, [
                    0.21568627655506134,
                    89,
                    144,
                    1
                ]);
            });
            
            canvasNode = image.toCanvas();

            Y.Assert.isObject(canvasNode, 'canvasNode should be an object.');
            Y.Assert.isInstanceOf(Y.Node, canvasNode, 'canvasNode should be an instance of Y.Node.');
            Y.ArrayAssert.itemsAreSame(data, canvasNode.getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
            Y.ArrayAssert.itemsAreSame(data, image.toCanvas(Y.Node.create('<canvas height="8" width="5"></canvas>')).getDOMNode().getContext('2d').getImageData(0, 0, 5, 8).data, 'Canvas data should match data.');
        },
        _should: {
            ignore: {
                'test:001-apiExists': !u8Exists,
                'test:002-supportsCanvasFalse': !u8Exists,
                'test:003-supportsCanvasTrue': !(f32Exists && f64Exists && s16Exists && s32Exists && s8Exists && u16Exists && u32Exists && u8Exists),
                'test:004-_getContext': !u8Exists,
                'test:005-_getImageData': !u8Exists,
                'test:006-fromCanvas-static': !u8Exists,
                'test:007-fromCanvas': !(f32Exists && f64Exists && s16Exists && s32Exists && s8Exists && u16Exists && u32Exists && u8Exists),
                'test:008-toCanvas': !(f32Exists && f64Exists && s16Exists && s32Exists && s8Exists && u16Exists && u32Exists && u8Exists)
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