YUI.add('module-tests', function (Y) {
    'use strict';

    var global = Y.config.global,
        suite = new Y.Test.Suite('gallery-composite-image'),
        
        arrayBufferExists = 'ArrayBuffer' in global,
        dataViewExists = 'DataView' in global,
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

            Y.Assert.isFunction(Y.Composite.Image._getDataView, 'Y.Composite.Image._getDataView should be a function.');
            Y.Assert.isFunction(Y.Composite.Image._getDataViewConstructor, 'Y.Composite.Image._getDataViewConstructor should be a function.');
            Y.Assert.isFunction(Y.Composite.Image._getGetPixelIndexMethod, 'Y.Composite.Image._getGetPixelIndexMethod should be a function.');
            Y.Assert.isFunction(Y.Composite.Image._getGetValueMethod, 'Y.Composite.Image._getGetValueMethod should be a function.');
            Y.Assert.isFunction(Y.Composite.Image._getSetValueMethod, 'Y.Composite.Image._getSetValueMethod should be a function.');
            Y.Assert.isFunction(Y.Composite.Image._getTypeName, 'Y.Composite.Image._getTypeName should be a function.');

            Y.Assert.isObject(Y.Composite.Image.dataTypes, 'Y.Composite.Image.dataTypes should be an object.');
            Y.Assert.isArray(Y.Composite.Image.defaultChannels, 'Y.Composite.Image.defaultChannels should be an array.');
            Y.Assert.isArray(Y.Composite.Image.defaultDimensions, 'Y.Composite.Image.defaultDimensions should be an array.');

            var image = new Y.Composite.Image();

            Y.Assert.isObject(image, 'image should be an object.');
            Y.Assert.isInstanceOf(Y.Composite.Image, image, 'image should be an instance of Y.Composite.Image.');

            Y.Assert.isFunction(image.clear, 'image.clear should be a function.');
            Y.Assert.isFunction(image.clone, 'image.clone should be a function.');
            Y.Assert.isFunction(image.eachPixelIndex, 'image.eachPixelIndex should be a function.');
            Y.Assert.isFunction(image.eachPixelLocation, 'image.eachPixelLocation should be a function.');
            Y.Assert.isFunction(image.getDataArray, 'image.getDataArray should be a function.');
            Y.Assert.isFunction(image.getPixelIndex, 'image.getPixelIndex should be a function.');
            Y.Assert.isFunction(image.getPixelValues, 'image.getPixelValues should be a function.');
            Y.Assert.isFunction(image.getValue, 'image.getValue should be a function.');
            Y.Assert.isFunction(image.setDataArray, 'image.setDataArray should be a function.');
            Y.Assert.isFunction(image.setPixelValues, 'image.setPixelValues should be a function.');
            Y.Assert.isFunction(image.setValue, 'image.setValue should be a function.');
            Y.Assert.isFunction(image.toJSON, 'image.toJSON should be a function.');
            Y.Assert.isFunction(image.toString, 'image.toString should be a function.');
            Y.Assert.isFunction(image.validate, 'image.validate should be a function.');

            Y.Assert.isFunction(image._getPixelIndex, 'image._getPixelIndex should be a function.');
            Y.Assert.isFunction(image._getValue, 'image._getValue should be a function.');
            Y.Assert.isFunction(image._init, 'image._init should be a function.');
            Y.Assert.isFunction(image._setValue, 'image._setValue should be a function.');

            Y.Assert.isArray(image.channels, 'image.channels should be an array.');
            Y.Assert.isArray(image.dimensions, 'image.dimensions should be an array.');
            //Y.Assert.areSame(262144, image.pixelCount, 'image.pixelCount should be 262144.');

            Y.Assert.isArray(image._channelOffsets, 'image._channelOffsets should be an array.');
            Y.Assert.isInstanceOf(ArrayBuffer, image._data, 'image._data should be an instance of ArrayBuffer.');
        },
        'test:002-_getDataViewConstructor': function () {
            Y.Assert.areSame(Float32Array, Y.Composite.Image._getDataViewConstructor('f32'), 'Y.Composite.Image._getDataViewConstructor(\'f32\') should be Float32Array.');
            Y.Assert.areSame(Float64Array, Y.Composite.Image._getDataViewConstructor('f64'), 'Y.Composite.Image._getDataViewConstructor(\'f64\') should be Float64Array.');
            Y.Assert.areSame(Int16Array, Y.Composite.Image._getDataViewConstructor('s16'), 'Y.Composite.Image._getDataViewConstructor(\'s16\') should be Int16Array.');
            Y.Assert.areSame(Int32Array, Y.Composite.Image._getDataViewConstructor('s32'), 'Y.Composite.Image._getDataViewConstructor(\'s32\') should be Int32Array.');
            Y.Assert.areSame(Int8Array, Y.Composite.Image._getDataViewConstructor('s8'), 'Y.Composite.Image._getDataViewConstructor(\'s8\') should be Int8Array.');
            Y.Assert.areSame(Uint16Array, Y.Composite.Image._getDataViewConstructor('u16'), 'Y.Composite.Image._getDataViewConstructor(\'u16\') should be Uint16Array.');
            Y.Assert.areSame(Uint32Array, Y.Composite.Image._getDataViewConstructor('u32'), 'Y.Composite.Image._getDataViewConstructor(\'u32\') should be Uint32Array.');
            Y.Assert.areSame(Uint8ClampedArray, Y.Composite.Image._getDataViewConstructor('u8'), 'Y.Composite.Image._getDataViewConstructor(\'u8\') should be Uint8ClampedArray.');
            Y.Assert.areSame(DataView, Y.Composite.Image._getDataViewConstructor(null), 'Y.Composite.Image._getDataViewConstructor(null) should be DataView.');
        },
        'test:003-_getDataView': function () {
            var arrayBuffer = new ArrayBuffer(144),
                f32ArrayBufferView = Y.Composite.Image._getDataView(arrayBuffer, 'f32'),
                f64ArrayBufferView = Y.Composite.Image._getDataView(arrayBuffer, 'f64'),
                s16ArrayBufferView = Y.Composite.Image._getDataView(arrayBuffer, 's16'),
                s32ArrayBufferView = Y.Composite.Image._getDataView(arrayBuffer, 's32'),
                s8ArrayBufferView = Y.Composite.Image._getDataView(arrayBuffer, 's8'),
                u16ArrayBufferView = Y.Composite.Image._getDataView(arrayBuffer, 'u16'),
                u32ArrayBufferView = Y.Composite.Image._getDataView(arrayBuffer, 'u32'),
                u8ArrayBufferView = Y.Composite.Image._getDataView(arrayBuffer, 'u8'),
                mixedArrayBufferView = Y.Composite.Image._getDataView(arrayBuffer, null);

            Y.Assert.isInstanceOf(Float32Array, f32ArrayBufferView, 'f32ArrayBufferView should be an instance of Float32Array.');
            Y.Assert.areSame(arrayBuffer, f32ArrayBufferView.buffer, 'f32ArrayBufferView.buffer should be the same as arrayBuffer.');

            Y.Assert.isInstanceOf(Float64Array, f64ArrayBufferView, 'f64ArrayBufferView should be an instance of Float64Array.');
            Y.Assert.areSame(arrayBuffer, f64ArrayBufferView.buffer, 'f64ArrayBufferView.buffer should be the same as arrayBuffer.');

            Y.Assert.isInstanceOf(Int16Array, s16ArrayBufferView, 's16ArrayBufferView should be an instance of Int16Array.');
            Y.Assert.areSame(arrayBuffer, s16ArrayBufferView.buffer, 's16ArrayBufferView.buffer should be the same as arrayBuffer.');

            Y.Assert.isInstanceOf(Int32Array, s32ArrayBufferView, 's32ArrayBufferView should be an instance of Int32Array.');
            Y.Assert.areSame(arrayBuffer, s32ArrayBufferView.buffer, 's32ArrayBufferView.buffer should be the same as arrayBuffer.');

            Y.Assert.isInstanceOf(Int8Array, s8ArrayBufferView, 's8ArrayBufferView should be an instance of Uint8Array.');
            Y.Assert.areSame(arrayBuffer, s8ArrayBufferView.buffer, 's8ArrayBufferView.buffer should be the same as arrayBuffer.');

            Y.Assert.isInstanceOf(Uint16Array, u16ArrayBufferView, 'u16ArrayBufferView should be an instance of Uint16Array.');
            Y.Assert.areSame(arrayBuffer, u16ArrayBufferView.buffer, 'u16ArrayBufferView.buffer should be the same as arrayBuffer.');

            Y.Assert.isInstanceOf(Uint32Array, u32ArrayBufferView, 'u32ArrayBufferView should be an instance of Uint32Array.');
            Y.Assert.areSame(arrayBuffer, u32ArrayBufferView.buffer, 'u32ArrayBufferView.buffer should be the same as arrayBuffer.');

            Y.Assert.isInstanceOf(Uint8ClampedArray, u8ArrayBufferView, 'u8ArrayBufferView should be an instance of Uint8ClampedArray.');
            Y.Assert.areSame(arrayBuffer, u8ArrayBufferView.buffer, 'u8ArrayBufferView.buffer should be the same as arrayBuffer.');

            Y.Assert.isInstanceOf(DataView, mixedArrayBufferView, 'mixedArrayBufferView should be an instance of DataView.');
            Y.Assert.areSame(arrayBuffer, mixedArrayBufferView.buffer, 'mixedArrayBufferView.buffer should be the same as arrayBuffer.');
        },
        'test:004-_getTypeName': function () {
            Y.Assert.areSame('Float32', Y.Composite.Image._getTypeName('f32'), 'Y.Composite.Image._getTypeName(\'f32\') should be \'Float32\'.');
            Y.Assert.areSame('Float64', Y.Composite.Image._getTypeName('f64'), 'Y.Composite.Image._getTypeName(\'f64\') should be \'Float64\'.');
            Y.Assert.areSame('Int16', Y.Composite.Image._getTypeName('s16'), 'Y.Composite.Image._getTypeName(\'s16\') should be \'Int16\'.');
            Y.Assert.areSame('Int32', Y.Composite.Image._getTypeName('s32'), 'Y.Composite.Image._getTypeName(\'s32\') should be \'Int32\'.');
            Y.Assert.areSame('Int8', Y.Composite.Image._getTypeName('s8'), 'Y.Composite.Image._getTypeName(\'s8\') should be \'Int8\'.');
            Y.Assert.areSame('Uint16', Y.Composite.Image._getTypeName('u16'), 'Y.Composite.Image._getTypeName(\'u16\') should be \'Uint16\'.');
            Y.Assert.areSame('Uint32', Y.Composite.Image._getTypeName('u32'), 'Y.Composite.Image._getTypeName(\'u32\') should be \'Uint32\'.');
            Y.Assert.areSame('Uint8', Y.Composite.Image._getTypeName('u8'), 'Y.Composite.Image._getTypeName(\'u8\') should be \'Uint8\'.');
        },
        'test:005-constructor-channels-f32': function () {
            var image = new Y.Composite.Image({
                channels: [
                    'f32'
                ]
            });

            Y.Assert.areSame(1, image.channels.length, 'image.channels.length should be 1.');
            Y.ArrayAssert.itemsAreSame([
                0
            ], image._channelOffsets, 'image._channelOffsets should be [0]');
            Y.Assert.areSame(1048576, image._data.byteLength, 'image._data.byteLength should be 1048576.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.f32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.f32.');
            Y.Assert.isInstanceOf(Float32Array, image._dataView, 'image._dataView should be an instance of Float32Array.');
            Y.Assert.areSame(1048576, image._dataView.byteLength, 'image._dataView.byteLength should be 1048576.');
            Y.Assert.areSame(262144, image._dataView.length, 'image._dataView.length should be 262144.');
            Y.Assert.areSame(4, image._pixelSize, 'image._pixelSize should be 4.');

            image = new Y.Composite.Image({
                channels: [
                    'f32',
                    'f32'
                ]
            });

            Y.Assert.areSame(2, image.channels.length, 'image.channels.length should be 2.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4]');
            Y.Assert.areSame(2097152, image._data.byteLength, 'image._data.byteLength should be 2097152.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.f32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.f32.');
            Y.Assert.isInstanceOf(Float32Array, image._dataView, 'image._dataView should be an instance of Float32Array.');
            Y.Assert.areSame(2097152, image._dataView.byteLength, 'image._dataView.byteLength should be 2097152.');
            Y.Assert.areSame(524288, image._dataView.length, 'image._dataView.length should be 524288.');
            Y.Assert.areSame(8, image._pixelSize, 'image._pixelSize should be 8.');

            image = new Y.Composite.Image({
                channels: [
                    'f32',
                    'f32',
                    'f32'
                ]
            });

            Y.Assert.areSame(3, image.channels.length, 'image.channels.length should be 3.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4,
                8
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4, 8]');
            Y.Assert.areSame(3145728, image._data.byteLength, 'image._data.byteLength should be 3145728.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.f32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.f32.');
            Y.Assert.isInstanceOf(Float32Array, image._dataView, 'image._dataView should be an instance of Float32Array.');
            Y.Assert.areSame(3145728, image._dataView.byteLength, 'image._dataView.byteLength should be 3145728.');
            Y.Assert.areSame(786432, image._dataView.length, 'image._dataView.length should be 786432.');
            Y.Assert.areSame(12, image._pixelSize, 'image._pixelSize should be 12.');

            image = new Y.Composite.Image({
                channels: [
                    'f32',
                    'f32',
                    'f32',
                    'f32'
                ]
            });

            Y.Assert.areSame(4, image.channels.length, 'image.channels.length should be 4.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4,
                8,
                12
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4, 8, 12]');
            Y.Assert.areSame(4194304, image._data.byteLength, 'image._data.byteLength should be 4194304.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.f32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.f32.');
            Y.Assert.isInstanceOf(Float32Array, image._dataView, 'image._dataView should be an instance of Float32Array.');
            Y.Assert.areSame(4194304, image._dataView.byteLength, 'image._dataView.byteLength should be 4194304.');
            Y.Assert.areSame(1048576, image._dataView.length, 'image._dataView.length should be 1048576.');
            Y.Assert.areSame(16, image._pixelSize, 'image._pixelSize should be 16.');

            image = new Y.Composite.Image({
                channels: [
                    'f32',
                    'f32',
                    'f32',
                    'f32',
                    'f32'
                ]
            });

            Y.Assert.areSame(5, image.channels.length, 'image.channels.length should be 5.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4,
                8,
                12,
                16
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4, 8, 12, 16]');
            Y.Assert.areSame(5242880, image._data.byteLength, 'image._data.byteLength should be 5242880.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.f32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.f32.');
            Y.Assert.isInstanceOf(Float32Array, image._dataView, 'image._dataView should be an instance of Float32Array.');
            Y.Assert.areSame(5242880, image._dataView.byteLength, 'image._dataView.byteLength should be 5242880.');
            Y.Assert.areSame(1310720, image._dataView.length, 'image._dataView.length should be 1310720.');
            Y.Assert.areSame(20, image._pixelSize, 'image._pixelSize should be 20.');

            image = new Y.Composite.Image({
                channels: [
                    'f32',
                    'f32',
                    'f32',
                    'f32',
                    'f32',
                    'f32'
                ]
            });

            Y.Assert.areSame(6, image.channels.length, 'image.channels.length should be 6.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4,
                8,
                12,
                16,
                20
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4, 8, 12, 16, 20]');
            Y.Assert.areSame(6291456, image._data.byteLength, 'image._data.byteLength should be 6291456.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.f32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.f32.');
            Y.Assert.isInstanceOf(Float32Array, image._dataView, 'image._dataView should be an instance of Float32Array.');
            Y.Assert.areSame(6291456, image._dataView.byteLength, 'image._dataView.byteLength should be 6291456.');
            Y.Assert.areSame(1572864, image._dataView.length, 'image._dataView.length should be 1572864.');
            Y.Assert.areSame(24, image._pixelSize, 'image._pixelSize should be 24.');

            image = new Y.Composite.Image({
                channels: [
                    'f32',
                    'f32',
                    'f32',
                    'f32',
                    'f32',
                    'f32',
                    'f32'
                ]
            });

            Y.Assert.areSame(7, image.channels.length, 'image.channels.length should be 7.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4,
                8,
                12,
                16,
                20,
                24
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4, 8, 12, 16, 20, 24]');
            Y.Assert.areSame(7340032, image._data.byteLength, 'image._data.byteLength should be 7340032.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.f32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.f32.');
            Y.Assert.isInstanceOf(Float32Array, image._dataView, 'image._dataView should be an instance of Float32Array.');
            Y.Assert.areSame(7340032, image._dataView.byteLength, 'image._dataView.byteLength should be 7340032.');
            Y.Assert.areSame(1835008, image._dataView.length, 'image._dataView.length should be 1835008.');
            Y.Assert.areSame(28, image._pixelSize, 'image._pixelSize should be 28.');
        },
        'test:006-constructor-channels-f64': function () {
            var image = new Y.Composite.Image({
                channels: [
                    'f64'
                ]
            });

            Y.Assert.areSame(1, image.channels.length, 'image.channels.length should be 1.');
            Y.ArrayAssert.itemsAreSame([
                0
            ], image._channelOffsets, 'image._channelOffsets should be [0]');
            Y.Assert.areSame(2097152, image._data.byteLength, 'image._data.byteLength should be 2097152.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.f64, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.f64.');
            Y.Assert.isInstanceOf(Float64Array, image._dataView, 'image._dataView should be an instance of Float64Array.');
            Y.Assert.areSame(2097152, image._dataView.byteLength, 'image._dataView.byteLength should be 2097152.');
            Y.Assert.areSame(262144, image._dataView.length, 'image._dataView.length should be 262144.');
            Y.Assert.areSame(8, image._pixelSize, 'image._pixelSize should be 8.');

            image = new Y.Composite.Image({
                channels: [
                    'f64',
                    'f64'
                ]
            });

            Y.Assert.areSame(2, image.channels.length, 'image.channels.length should be 2.');
            Y.ArrayAssert.itemsAreSame([
                0,
                8
            ], image._channelOffsets, 'image._channelOffsets should be [0, 8]');
            Y.Assert.areSame(4194304, image._data.byteLength, 'image._data.byteLength should be 4194304.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.f64, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.f64.');
            Y.Assert.isInstanceOf(Float64Array, image._dataView, 'image._dataView should be an instance of Float64Array.');
            Y.Assert.areSame(4194304, image._dataView.byteLength, 'image._dataView.byteLength should be 4194304.');
            Y.Assert.areSame(524288, image._dataView.length, 'image._dataView.length should be 524288.');
            Y.Assert.areSame(16, image._pixelSize, 'image._pixelSize should be 16.');

            image = new Y.Composite.Image({
                channels: [
                    'f64',
                    'f64',
                    'f64'
                ]
            });

            Y.Assert.areSame(3, image.channels.length, 'image.channels.length should be 3.');
            Y.ArrayAssert.itemsAreSame([
                0,
                8,
                16
            ], image._channelOffsets, 'image._channelOffsets should be [0, 8, 16]');
            Y.Assert.areSame(6291456, image._data.byteLength, 'image._data.byteLength should be 6291456.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.f64, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.f64.');
            Y.Assert.isInstanceOf(Float64Array, image._dataView, 'image._dataView should be an instance of Float64Array.');
            Y.Assert.areSame(6291456, image._dataView.byteLength, 'image._dataView.byteLength should be 6291456.');
            Y.Assert.areSame(786432, image._dataView.length, 'image._dataView.length should be 786432.');
            Y.Assert.areSame(24, image._pixelSize, 'image._pixelSize should be 24.');

            image = new Y.Composite.Image({
                channels: [
                    'f64',
                    'f64',
                    'f64',
                    'f64'
                ]
            });

            Y.Assert.areSame(4, image.channels.length, 'image.channels.length should be 4.');
            Y.ArrayAssert.itemsAreSame([
                0,
                8,
                16,
                24
            ], image._channelOffsets, 'image._channelOffsets should be [0, 8, 16, 24]');
            Y.Assert.areSame(8388608, image._data.byteLength, 'image._data.byteLength should be 8388608.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.f64, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.f64.');
            Y.Assert.isInstanceOf(Float64Array, image._dataView, 'image._dataView should be an instance of Float64Array.');
            Y.Assert.areSame(8388608, image._dataView.byteLength, 'image._dataView.byteLength should be 8388608.');
            Y.Assert.areSame(1048576, image._dataView.length, 'image._dataView.length should be 1048576.');
            Y.Assert.areSame(32, image._pixelSize, 'image._pixelSize should be 32.');

            image = new Y.Composite.Image({
                channels: [
                    'f64',
                    'f64',
                    'f64',
                    'f64',
                    'f64'
                ]
            });

            Y.Assert.areSame(5, image.channels.length, 'image.channels.length should be 5.');
            Y.ArrayAssert.itemsAreSame([
                0,
                8,
                16,
                24,
                32
            ], image._channelOffsets, 'image._channelOffsets should be [0, 8, 16, 24, 32]');
            Y.Assert.areSame(10485760, image._data.byteLength, 'image._data.byteLength should be 10485760.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.f64, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.f64.');
            Y.Assert.isInstanceOf(Float64Array, image._dataView, 'image._dataView should be an instance of Float64Array.');
            Y.Assert.areSame(10485760, image._dataView.byteLength, 'image._dataView.byteLength should be 10485760.');
            Y.Assert.areSame(1310720, image._dataView.length, 'image._dataView.length should be 1310720.');
            Y.Assert.areSame(40, image._pixelSize, 'image._pixelSize should be 40.');

            image = new Y.Composite.Image({
                channels: [
                    'f64',
                    'f64',
                    'f64',
                    'f64',
                    'f64',
                    'f64'
                ]
            });

            Y.Assert.areSame(6, image.channels.length, 'image.channels.length should be 6.');
            Y.ArrayAssert.itemsAreSame([
                0,
                8,
                16,
                24,
                32,
                40
            ], image._channelOffsets, 'image._channelOffsets should be [0, 8, 16, 24, 32, 40]');
            Y.Assert.areSame(12582912, image._data.byteLength, 'image._data.byteLength should be 12582912.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.f64, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.f64.');
            Y.Assert.isInstanceOf(Float64Array, image._dataView, 'image._dataView should be an instance of Float64Array.');
            Y.Assert.areSame(12582912, image._dataView.byteLength, 'image._dataView.byteLength should be 12582912.');
            Y.Assert.areSame(1572864, image._dataView.length, 'image._dataView.length should be 1572864.');
            Y.Assert.areSame(48, image._pixelSize, 'image._pixelSize should be 48.');

            image = new Y.Composite.Image({
                channels: [
                    'f64',
                    'f64',
                    'f64',
                    'f64',
                    'f64',
                    'f64',
                    'f64'
                ]
            });

            Y.Assert.areSame(7, image.channels.length, 'image.channels.length should be 7.');
            Y.ArrayAssert.itemsAreSame([
                0,
                8,
                16,
                24,
                32,
                40,
                48
            ], image._channelOffsets, 'image._channelOffsets should be [0, 8, 16, 24, 32, 40, 48]');
            Y.Assert.areSame(14680064, image._data.byteLength, 'image._data.byteLength should be 14680064.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.f64, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.f64.');
            Y.Assert.isInstanceOf(Float64Array, image._dataView, 'image._dataView should be an instance of Float64Array.');
            Y.Assert.areSame(14680064, image._dataView.byteLength, 'image._dataView.byteLength should be 14680064.');
            Y.Assert.areSame(1835008, image._dataView.length, 'image._dataView.length should be 1835008.');
            Y.Assert.areSame(56, image._pixelSize, 'image._pixelSize should be 56.');
        },
        'test:007-constructor-channels-s16': function () {
            var image = new Y.Composite.Image({
                channels: [
                    's16'
                ]
            });

            Y.Assert.areSame(1, image.channels.length, 'image.channels.length should be 1.');
            Y.ArrayAssert.itemsAreSame([
                0
            ], image._channelOffsets, 'image._channelOffsets should be [0]');
            Y.Assert.areSame(524288, image._data.byteLength, 'image._data.byteLength should be 524288.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s16, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s16.');
            Y.Assert.isInstanceOf(Int16Array, image._dataView, 'image._dataView should be an instance of Int16Array.');
            Y.Assert.areSame(524288, image._dataView.byteLength, 'image._dataView.byteLength should be 524288.');
            Y.Assert.areSame(262144, image._dataView.length, 'image._dataView.length should be 262144.');
            Y.Assert.areSame(2, image._pixelSize, 'image._pixelSize should be 2.');

            image = new Y.Composite.Image({
                channels: [
                    's16',
                    's16'
                ]
            });

            Y.Assert.areSame(2, image.channels.length, 'image.channels.length should be 2.');
            Y.ArrayAssert.itemsAreSame([
                0,
                2
            ], image._channelOffsets, 'image._channelOffsets should be [0, 2]');
            Y.Assert.areSame(1048576, image._data.byteLength, 'image._data.byteLength should be 1048576.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s16, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s16.');
            Y.Assert.isInstanceOf(Int16Array, image._dataView, 'image._dataView should be an instance of Int16Array.');
            Y.Assert.areSame(1048576, image._dataView.byteLength, 'image._dataView.byteLength should be 1048576.');
            Y.Assert.areSame(524288, image._dataView.length, 'image._dataView.length should be 524288.');
            Y.Assert.areSame(4, image._pixelSize, 'image._pixelSize should be 4.');

            image = new Y.Composite.Image({
                channels: [
                    's16',
                    's16',
                    's16'
                ]
            });

            Y.Assert.areSame(3, image.channels.length, 'image.channels.length should be 3.');
            Y.ArrayAssert.itemsAreSame([
                0,
                2,
                4
            ], image._channelOffsets, 'image._channelOffsets should be [0, 2, 4]');
            Y.Assert.areSame(1572864, image._data.byteLength, 'image._data.byteLength should be 1572864.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s16, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s16.');
            Y.Assert.isInstanceOf(Int16Array, image._dataView, 'image._dataView should be an instance of Int16Array.');
            Y.Assert.areSame(1572864, image._dataView.byteLength, 'image._dataView.byteLength should be 1572864.');
            Y.Assert.areSame(786432, image._dataView.length, 'image._dataView.length should be 786432.');
            Y.Assert.areSame(6, image._pixelSize, 'image._pixelSize should be 6.');

            image = new Y.Composite.Image({
                channels: [
                    's16',
                    's16',
                    's16',
                    's16'
                ]
            });

            Y.Assert.areSame(4, image.channels.length, 'image.channels.length should be 4.');
            Y.ArrayAssert.itemsAreSame([
                0,
                2,
                4,
                6
            ], image._channelOffsets, 'image._channelOffsets should be [0, 2, 4, 6]');
            Y.Assert.areSame(2097152, image._data.byteLength, 'image._data.byteLength should be 2097152.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s16, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s16.');
            Y.Assert.isInstanceOf(Int16Array, image._dataView, 'image._dataView should be an instance of Int16Array.');
            Y.Assert.areSame(2097152, image._dataView.byteLength, 'image._dataView.byteLength should be 2097152.');
            Y.Assert.areSame(1048576, image._dataView.length, 'image._dataView.length should be 1048576.');
            Y.Assert.areSame(8, image._pixelSize, 'image._pixelSize should be 8.');

            image = new Y.Composite.Image({
                channels: [
                    's16',
                    's16',
                    's16',
                    's16',
                    's16'
                ]
            });

            Y.Assert.areSame(5, image.channels.length, 'image.channels.length should be 5.');
            Y.ArrayAssert.itemsAreSame([
                0,
                2,
                4,
                6,
                8
            ], image._channelOffsets, 'image._channelOffsets should be [0, 2, 4, 6, 8]');
            Y.Assert.areSame(2621440, image._data.byteLength, 'image._data.byteLength should be 2621440.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s16, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s16.');
            Y.Assert.isInstanceOf(Int16Array, image._dataView, 'image._dataView should be an instance of Int16Array.');
            Y.Assert.areSame(2621440, image._dataView.byteLength, 'image._dataView.byteLength should be 2621440.');
            Y.Assert.areSame(1310720, image._dataView.length, 'image._dataView.length should be 1310720.');
            Y.Assert.areSame(10, image._pixelSize, 'image._pixelSize should be 10.');

            image = new Y.Composite.Image({
                channels: [
                    's16',
                    's16',
                    's16',
                    's16',
                    's16',
                    's16'
                ]
            });

            Y.Assert.areSame(6, image.channels.length, 'image.channels.length should be 6.');
            Y.ArrayAssert.itemsAreSame([
                0,
                2,
                4,
                6,
                8,
                10
            ], image._channelOffsets, 'image._channelOffsets should be [0, 2, 4, 6, 8, 10]');
            Y.Assert.areSame(3145728, image._data.byteLength, 'image._data.byteLength should be 3145728.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s16, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s16.');
            Y.Assert.isInstanceOf(Int16Array, image._dataView, 'image._dataView should be an instance of Int16Array.');
            Y.Assert.areSame(3145728, image._dataView.byteLength, 'image._dataView.byteLength should be 3145728.');
            Y.Assert.areSame(1572864, image._dataView.length, 'image._dataView.length should be 1572864.');
            Y.Assert.areSame(12, image._pixelSize, 'image._pixelSize should be 12.');

            image = new Y.Composite.Image({
                channels: [
                    's16',
                    's16',
                    's16',
                    's16',
                    's16',
                    's16',
                    's16'
                ]
            });

            Y.Assert.areSame(7, image.channels.length, 'image.channels.length should be 7.');
            Y.ArrayAssert.itemsAreSame([
                0,
                2,
                4,
                6,
                8,
                10,
                12
            ], image._channelOffsets, 'image._channelOffsets should be [0, 2, 4, 6, 8, 10, 12]');
            Y.Assert.areSame(3670016, image._data.byteLength, 'image._data.byteLength should be 3670016.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s16, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s16.');
            Y.Assert.isInstanceOf(Int16Array, image._dataView, 'image._dataView should be an instance of Int16Array.');
            Y.Assert.areSame(3670016, image._dataView.byteLength, 'image._dataView.byteLength should be 3670016.');
            Y.Assert.areSame(1835008, image._dataView.length, 'image._dataView.length should be 1835008.');
            Y.Assert.areSame(14, image._pixelSize, 'image._pixelSize should be 14.');
        },
        'test:008-constructor-channels-s32': function () {
            var image = new Y.Composite.Image({
                channels: [
                    's32'
                ]
            });

            Y.Assert.areSame(1, image.channels.length, 'image.channels.length should be 1.');
            Y.ArrayAssert.itemsAreSame([
                0
            ], image._channelOffsets, 'image._channelOffsets should be [0]');
            Y.Assert.areSame(1048576, image._data.byteLength, 'image._data.byteLength should be 1048576.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s32.');
            Y.Assert.isInstanceOf(Int32Array, image._dataView, 'image._dataView should be an instance of Int32Array.');
            Y.Assert.areSame(1048576, image._dataView.byteLength, 'image._dataView.byteLength should be 1048576.');
            Y.Assert.areSame(262144, image._dataView.length, 'image._dataView.length should be 262144.');
            Y.Assert.areSame(4, image._pixelSize, 'image._pixelSize should be 4.');

            image = new Y.Composite.Image({
                channels: [
                    's32',
                    's32'
                ]
            });

            Y.Assert.areSame(2, image.channels.length, 'image.channels.length should be 2.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4]');
            Y.Assert.areSame(2097152, image._data.byteLength, 'image._data.byteLength should be 2097152.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s32.');
            Y.Assert.isInstanceOf(Int32Array, image._dataView, 'image._dataView should be an instance of Int32Array.');
            Y.Assert.areSame(2097152, image._dataView.byteLength, 'image._dataView.byteLength should be 2097152.');
            Y.Assert.areSame(524288, image._dataView.length, 'image._dataView.length should be 524288.');
            Y.Assert.areSame(8, image._pixelSize, 'image._pixelSize should be 8.');

            image = new Y.Composite.Image({
                channels: [
                    's32',
                    's32',
                    's32'
                ]
            });

            Y.Assert.areSame(3, image.channels.length, 'image.channels.length should be 3.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4,
                8
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4, 8]');
            Y.Assert.areSame(3145728, image._data.byteLength, 'image._data.byteLength should be 3145728.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s32.');
            Y.Assert.isInstanceOf(Int32Array, image._dataView, 'image._dataView should be an instance of Int32Array.');
            Y.Assert.areSame(3145728, image._dataView.byteLength, 'image._dataView.byteLength should be 3145728.');
            Y.Assert.areSame(786432, image._dataView.length, 'image._dataView.length should be 786432.');
            Y.Assert.areSame(12, image._pixelSize, 'image._pixelSize should be 12.');

            image = new Y.Composite.Image({
                channels: [
                    's32',
                    's32',
                    's32',
                    's32'
                ]
            });

            Y.Assert.areSame(4, image.channels.length, 'image.channels.length should be 4.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4,
                8,
                12
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4, 8, 12]');
            Y.Assert.areSame(4194304, image._data.byteLength, 'image._data.byteLength should be 4194304.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s32.');
            Y.Assert.isInstanceOf(Int32Array, image._dataView, 'image._dataView should be an instance of Int32Array.');
            Y.Assert.areSame(4194304, image._dataView.byteLength, 'image._dataView.byteLength should be 4194304.');
            Y.Assert.areSame(1048576, image._dataView.length, 'image._dataView.length should be 1048576.');
            Y.Assert.areSame(16, image._pixelSize, 'image._pixelSize should be 16.');

            image = new Y.Composite.Image({
                channels: [
                    's32',
                    's32',
                    's32',
                    's32',
                    's32'
                ]
            });

            Y.Assert.areSame(5, image.channels.length, 'image.channels.length should be 5.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4,
                8,
                12,
                16
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4, 8, 12, 16]');
            Y.Assert.areSame(5242880, image._data.byteLength, 'image._data.byteLength should be 5242880.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s32.');
            Y.Assert.isInstanceOf(Int32Array, image._dataView, 'image._dataView should be an instance of Int32Array.');
            Y.Assert.areSame(5242880, image._dataView.byteLength, 'image._dataView.byteLength should be 5242880.');
            Y.Assert.areSame(1310720, image._dataView.length, 'image._dataView.length should be 1310720.');
            Y.Assert.areSame(20, image._pixelSize, 'image._pixelSize should be 20.');

            image = new Y.Composite.Image({
                channels: [
                    's32',
                    's32',
                    's32',
                    's32',
                    's32',
                    's32'
                ]
            });

            Y.Assert.areSame(6, image.channels.length, 'image.channels.length should be 6.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4,
                8,
                12,
                16,
                20
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4, 8, 12, 16, 20]');
            Y.Assert.areSame(6291456, image._data.byteLength, 'image._data.byteLength should be 6291456.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s32.');
            Y.Assert.isInstanceOf(Int32Array, image._dataView, 'image._dataView should be an instance of Int32Array.');
            Y.Assert.areSame(6291456, image._dataView.byteLength, 'image._dataView.byteLength should be 6291456.');
            Y.Assert.areSame(1572864, image._dataView.length, 'image._dataView.length should be 1572864.');
            Y.Assert.areSame(24, image._pixelSize, 'image._pixelSize should be 24.');

            image = new Y.Composite.Image({
                channels: [
                    's32',
                    's32',
                    's32',
                    's32',
                    's32',
                    's32',
                    's32'
                ]
            });

            Y.Assert.areSame(7, image.channels.length, 'image.channels.length should be 7.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4,
                8,
                12,
                16,
                20,
                24
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4, 8, 12, 16, 20, 24]');
            Y.Assert.areSame(7340032, image._data.byteLength, 'image._data.byteLength should be 7340032.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s32.');
            Y.Assert.isInstanceOf(Int32Array, image._dataView, 'image._dataView should be an instance of Int32Array.');
            Y.Assert.areSame(7340032, image._dataView.byteLength, 'image._dataView.byteLength should be 7340032.');
            Y.Assert.areSame(1835008, image._dataView.length, 'image._dataView.length should be 1835008.');
            Y.Assert.areSame(28, image._pixelSize, 'image._pixelSize should be 28.');
        },
        'test:009-constructor-channels-s8': function () {
            var image = new Y.Composite.Image({
                channels: [
                    's8'
                ]
            });

            Y.Assert.areSame(1, image.channels.length, 'image.channels.length should be 1.');
            Y.ArrayAssert.itemsAreSame([
                0
            ], image._channelOffsets, 'image._channelOffsets should be [0]');
            Y.Assert.areSame(262144, image._data.byteLength, 'image._data.byteLength should be 262144.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s8, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s8.');
            Y.Assert.isInstanceOf(Int8Array, image._dataView, 'image._dataView should be an instance of Int8Array.');
            Y.Assert.areSame(262144, image._dataView.byteLength, 'image._dataView.byteLength should be 262144.');
            Y.Assert.areSame(262144, image._dataView.length, 'image._dataView.length should be 262144.');
            Y.Assert.areSame(1, image._pixelSize, 'image._pixelSize should be 1.');

            image = new Y.Composite.Image({
                channels: [
                    's8',
                    's8'
                ]
            });

            Y.Assert.areSame(2, image.channels.length, 'image.channels.length should be 2.');
            Y.ArrayAssert.itemsAreSame([
                0,
                1
            ], image._channelOffsets, 'image._channelOffsets should be [0, 1]');
            Y.Assert.areSame(524288, image._data.byteLength, 'image._data.byteLength should be 524288.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s8, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s8.');
            Y.Assert.isInstanceOf(Int8Array, image._dataView, 'image._dataView should be an instance of Int8Array.');
            Y.Assert.areSame(524288, image._dataView.byteLength, 'image._dataView.byteLength should be 524288.');
            Y.Assert.areSame(524288, image._dataView.length, 'image._dataView.length should be 524288.');
            Y.Assert.areSame(2, image._pixelSize, 'image._pixelSize should be 2.');

            image = new Y.Composite.Image({
                channels: [
                    's8',
                    's8',
                    's8'
                ]
            });

            Y.Assert.areSame(3, image.channels.length, 'image.channels.length should be 3.');
            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2
            ], image._channelOffsets, 'image._channelOffsets should be [0, 1, 2]');
            Y.Assert.areSame(786432, image._data.byteLength, 'image._data.byteLength should be 786432.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s8, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s8.');
            Y.Assert.isInstanceOf(Int8Array, image._dataView, 'image._dataView should be an instance of Int8Array.');
            Y.Assert.areSame(786432, image._dataView.byteLength, 'image._dataView.byteLength should be 786432.');
            Y.Assert.areSame(786432, image._dataView.length, 'image._dataView.length should be 786432.');
            Y.Assert.areSame(3, image._pixelSize, 'image._pixelSize should be 3.');

            image = new Y.Composite.Image({
                channels: [
                    's8',
                    's8',
                    's8',
                    's8'
                ]
            });

            Y.Assert.areSame(4, image.channels.length, 'image.channels.length should be 4.');
            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2,
                3
            ], image._channelOffsets, 'image._channelOffsets should be [0, 1, 2, 3]');
            Y.Assert.areSame(1048576, image._data.byteLength, 'image._data.byteLength should be 1048576.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s8, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s8.');
            Y.Assert.isInstanceOf(Int8Array, image._dataView, 'image._dataView should be an instance of Int8Array.');
            Y.Assert.areSame(1048576, image._dataView.byteLength, 'image._dataView.byteLength should be 1048576.');
            Y.Assert.areSame(1048576, image._dataView.length, 'image._dataView.length should be 1048576.');
            Y.Assert.areSame(4, image._pixelSize, 'image._pixelSize should be 4.');

            image = new Y.Composite.Image({
                channels: [
                    's8',
                    's8',
                    's8',
                    's8',
                    's8'
                ]
            });

            Y.Assert.areSame(5, image.channels.length, 'image.channels.length should be 5.');
            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2,
                3,
                4
            ], image._channelOffsets, 'image._channelOffsets should be [0, 1, 2, 3, 4]');
            Y.Assert.areSame(1310720, image._data.byteLength, 'image._data.byteLength should be 1310720.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s8, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s8.');
            Y.Assert.isInstanceOf(Int8Array, image._dataView, 'image._dataView should be an instance of Int8Array.');
            Y.Assert.areSame(1310720, image._dataView.byteLength, 'image._dataView.byteLength should be 1310720.');
            Y.Assert.areSame(1310720, image._dataView.length, 'image._dataView.length should be 1310720.');
            Y.Assert.areSame(5, image._pixelSize, 'image._pixelSize should be 5.');

            image = new Y.Composite.Image({
                channels: [
                    's8',
                    's8',
                    's8',
                    's8',
                    's8',
                    's8'
                ]
            });

            Y.Assert.areSame(6, image.channels.length, 'image.channels.length should be 6.');
            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2,
                3,
                4,
                5
            ], image._channelOffsets, 'image._channelOffsets should be [0, 1, 2, 3, 4, 5]');
            Y.Assert.areSame(1572864, image._data.byteLength, 'image._data.byteLength should be 1572864.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s8, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s8.');
            Y.Assert.isInstanceOf(Int8Array, image._dataView, 'image._dataView should be an instance of Int8Array.');
            Y.Assert.areSame(1572864, image._dataView.byteLength, 'image._dataView.byteLength should be 1572864.');
            Y.Assert.areSame(1572864, image._dataView.length, 'image._dataView.length should be 1572864.');
            Y.Assert.areSame(6, image._pixelSize, 'image._pixelSize should be 6.');

            image = new Y.Composite.Image({
                channels: [
                    's8',
                    's8',
                    's8',
                    's8',
                    's8',
                    's8',
                    's8'
                ]
            });

            Y.Assert.areSame(7, image.channels.length, 'image.channels.length should be 7.');
            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2,
                3,
                4,
                5,
                6
            ], image._channelOffsets, 'image._channelOffsets should be [0, 1, 2, 3, 4, 5, 6]');
            Y.Assert.areSame(1835008, image._data.byteLength, 'image._data.byteLength should be 1835008.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.s8, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.s8.');
            Y.Assert.isInstanceOf(Int8Array, image._dataView, 'image._dataView should be an instance of Int8Array.');
            Y.Assert.areSame(1835008, image._dataView.byteLength, 'image._dataView.byteLength should be 1835008.');
            Y.Assert.areSame(1835008, image._dataView.length, 'image._dataView.length should be 1835008.');
            Y.Assert.areSame(7, image._pixelSize, 'image._pixelSize should be 7.');
        },
        'test:010-constructor-channels-u16': function () {
            var image = new Y.Composite.Image({
                channels: [
                    'u16'
                ]
            });

            Y.Assert.areSame(1, image.channels.length, 'image.channels.length should be 1.');
            Y.ArrayAssert.itemsAreSame([
                0
            ], image._channelOffsets, 'image._channelOffsets should be [0]');
            Y.Assert.areSame(524288, image._data.byteLength, 'image._data.byteLength should be 524288.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u16, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u16.');
            Y.Assert.isInstanceOf(Uint16Array, image._dataView, 'image._dataView should be an instance of Uint16Array.');
            Y.Assert.areSame(524288, image._dataView.byteLength, 'image._dataView.byteLength should be 524288.');
            Y.Assert.areSame(262144, image._dataView.length, 'image._dataView.length should be 262144.');
            Y.Assert.areSame(2, image._pixelSize, 'image._pixelSize should be 2.');

            image = new Y.Composite.Image({
                channels: [
                    'u16',
                    'u16'
                ]
            });

            Y.Assert.areSame(2, image.channels.length, 'image.channels.length should be 2.');
            Y.ArrayAssert.itemsAreSame([
                0,
                2
            ], image._channelOffsets, 'image._channelOffsets should be [0, 2]');
            Y.Assert.areSame(1048576, image._data.byteLength, 'image._data.byteLength should be 1048576.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u16, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u16.');
            Y.Assert.isInstanceOf(Uint16Array, image._dataView, 'image._dataView should be an instance of Uint16Array.');
            Y.Assert.areSame(1048576, image._dataView.byteLength, 'image._dataView.byteLength should be 1048576.');
            Y.Assert.areSame(524288, image._dataView.length, 'image._dataView.length should be 524288.');
            Y.Assert.areSame(4, image._pixelSize, 'image._pixelSize should be 4.');

            image = new Y.Composite.Image({
                channels: [
                    'u16',
                    'u16',
                    'u16'
                ]
            });

            Y.Assert.areSame(3, image.channels.length, 'image.channels.length should be 3.');
            Y.ArrayAssert.itemsAreSame([
                0,
                2,
                4
            ], image._channelOffsets, 'image._channelOffsets should be [0, 2, 4]');
            Y.Assert.areSame(1572864, image._data.byteLength, 'image._data.byteLength should be 1572864.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u16, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u16.');
            Y.Assert.isInstanceOf(Uint16Array, image._dataView, 'image._dataView should be an instance of Uint16Array.');
            Y.Assert.areSame(1572864, image._dataView.byteLength, 'image._dataView.byteLength should be 1572864.');
            Y.Assert.areSame(786432, image._dataView.length, 'image._dataView.length should be 786432.');
            Y.Assert.areSame(6, image._pixelSize, 'image._pixelSize should be 6.');

            image = new Y.Composite.Image({
                channels: [
                    'u16',
                    'u16',
                    'u16',
                    'u16'
                ]
            });

            Y.Assert.areSame(4, image.channels.length, 'image.channels.length should be 4.');
            Y.ArrayAssert.itemsAreSame([
                0,
                2,
                4,
                6
            ], image._channelOffsets, 'image._channelOffsets should be [0, 2, 4, 6]');
            Y.Assert.areSame(2097152, image._data.byteLength, 'image._data.byteLength should be 2097152.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u16, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u16.');
            Y.Assert.isInstanceOf(Uint16Array, image._dataView, 'image._dataView should be an instance of Uint16Array.');
            Y.Assert.areSame(2097152, image._dataView.byteLength, 'image._dataView.byteLength should be 2097152.');
            Y.Assert.areSame(1048576, image._dataView.length, 'image._dataView.length should be 1048576.');
            Y.Assert.areSame(8, image._pixelSize, 'image._pixelSize should be 8.');

            image = new Y.Composite.Image({
                channels: [
                    'u16',
                    'u16',
                    'u16',
                    'u16',
                    'u16'
                ]
            });

            Y.Assert.areSame(5, image.channels.length, 'image.channels.length should be 5.');
            Y.ArrayAssert.itemsAreSame([
                0,
                2,
                4,
                6,
                8
            ], image._channelOffsets, 'image._channelOffsets should be [0, 2, 4, 6, 8]');
            Y.Assert.areSame(2621440, image._data.byteLength, 'image._data.byteLength should be 2621440.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u16, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u16.');
            Y.Assert.isInstanceOf(Uint16Array, image._dataView, 'image._dataView should be an instance of Uint16Array.');
            Y.Assert.areSame(2621440, image._dataView.byteLength, 'image._dataView.byteLength should be 2621440.');
            Y.Assert.areSame(1310720, image._dataView.length, 'image._dataView.length should be 1310720.');
            Y.Assert.areSame(10, image._pixelSize, 'image._pixelSize should be 10.');

            image = new Y.Composite.Image({
                channels: [
                    'u16',
                    'u16',
                    'u16',
                    'u16',
                    'u16',
                    'u16'
                ]
            });

            Y.Assert.areSame(6, image.channels.length, 'image.channels.length should be 6.');
            Y.ArrayAssert.itemsAreSame([
                0,
                2,
                4,
                6,
                8,
                10
            ], image._channelOffsets, 'image._channelOffsets should be [0, 2, 4, 6, 8, 10]');
            Y.Assert.areSame(3145728, image._data.byteLength, 'image._data.byteLength should be 3145728.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u16, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u16.');
            Y.Assert.isInstanceOf(Uint16Array, image._dataView, 'image._dataView should be an instance of Uint16Array.');
            Y.Assert.areSame(3145728, image._dataView.byteLength, 'image._dataView.byteLength should be 3145728.');
            Y.Assert.areSame(1572864, image._dataView.length, 'image._dataView.length should be 1572864.');
            Y.Assert.areSame(12, image._pixelSize, 'image._pixelSize should be 12.');

            image = new Y.Composite.Image({
                channels: [
                    'u16',
                    'u16',
                    'u16',
                    'u16',
                    'u16',
                    'u16',
                    'u16'
                ]
            });

            Y.Assert.areSame(7, image.channels.length, 'image.channels.length should be 7.');
            Y.ArrayAssert.itemsAreSame([
                0,
                2,
                4,
                6,
                8,
                10,
                12
            ], image._channelOffsets, 'image._channelOffsets should be [0, 2, 4, 6, 8, 10, 12]');
            Y.Assert.areSame(3670016, image._data.byteLength, 'image._data.byteLength should be 3670016.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u16, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u16.');
            Y.Assert.isInstanceOf(Uint16Array, image._dataView, 'image._dataView should be an instance of Uint16Array.');
            Y.Assert.areSame(3670016, image._dataView.byteLength, 'image._dataView.byteLength should be 3670016.');
            Y.Assert.areSame(1835008, image._dataView.length, 'image._dataView.length should be 1835008.');
            Y.Assert.areSame(14, image._pixelSize, 'image._pixelSize should be 14.');
        },
        'test:011-constructor-channels-u32': function () {
            var image = new Y.Composite.Image({
                channels: [
                    'u32'
                ]
            });

            Y.Assert.areSame(1, image.channels.length, 'image.channels.length should be 1.');
            Y.ArrayAssert.itemsAreSame([
                0
            ], image._channelOffsets, 'image._channelOffsets should be [0]');
            Y.Assert.areSame(1048576, image._data.byteLength, 'image._data.byteLength should be 1048576.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u32.');
            Y.Assert.isInstanceOf(Uint32Array, image._dataView, 'image._dataView should be an instance of Uint32Array.');
            Y.Assert.areSame(1048576, image._dataView.byteLength, 'image._dataView.byteLength should be 1048576.');
            Y.Assert.areSame(262144, image._dataView.length, 'image._dataView.length should be 262144.');
            Y.Assert.areSame(4, image._pixelSize, 'image._pixelSize should be 4.');

            image = new Y.Composite.Image({
                channels: [
                    'u32',
                    'u32'
                ]
            });

            Y.Assert.areSame(2, image.channels.length, 'image.channels.length should be 2.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4]');
            Y.Assert.areSame(2097152, image._data.byteLength, 'image._data.byteLength should be 2097152.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u32.');
            Y.Assert.isInstanceOf(Uint32Array, image._dataView, 'image._dataView should be an instance of Uint32Array.');
            Y.Assert.areSame(2097152, image._dataView.byteLength, 'image._dataView.byteLength should be 2097152.');
            Y.Assert.areSame(524288, image._dataView.length, 'image._dataView.length should be 524288.');
            Y.Assert.areSame(8, image._pixelSize, 'image._pixelSize should be 8.');

            image = new Y.Composite.Image({
                channels: [
                    'u32',
                    'u32',
                    'u32'
                ]
            });

            Y.Assert.areSame(3, image.channels.length, 'image.channels.length should be 3.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4,
                8
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4, 8]');
            Y.Assert.areSame(3145728, image._data.byteLength, 'image._data.byteLength should be 3145728.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u32.');
            Y.Assert.isInstanceOf(Uint32Array, image._dataView, 'image._dataView should be an instance of Uint32Array.');
            Y.Assert.areSame(3145728, image._dataView.byteLength, 'image._dataView.byteLength should be 3145728.');
            Y.Assert.areSame(786432, image._dataView.length, 'image._dataView.length should be 786432.');
            Y.Assert.areSame(12, image._pixelSize, 'image._pixelSize should be 12.');

            image = new Y.Composite.Image({
                channels: [
                    'u32',
                    'u32',
                    'u32',
                    'u32'
                ]
            });

            Y.Assert.areSame(4, image.channels.length, 'image.channels.length should be 4.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4,
                8,
                12
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4, 8, 12]');
            Y.Assert.areSame(4194304, image._data.byteLength, 'image._data.byteLength should be 4194304.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u32.');
            Y.Assert.isInstanceOf(Uint32Array, image._dataView, 'image._dataView should be an instance of Uint32Array.');
            Y.Assert.areSame(4194304, image._dataView.byteLength, 'image._dataView.byteLength should be 4194304.');
            Y.Assert.areSame(1048576, image._dataView.length, 'image._dataView.length should be 1048576.');
            Y.Assert.areSame(16, image._pixelSize, 'image._pixelSize should be 16.');

            image = new Y.Composite.Image({
                channels: [
                    'u32',
                    'u32',
                    'u32',
                    'u32',
                    'u32'
                ]
            });

            Y.Assert.areSame(5, image.channels.length, 'image.channels.length should be 5.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4,
                8,
                12,
                16
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4, 8, 12, 16]');
            Y.Assert.areSame(5242880, image._data.byteLength, 'image._data.byteLength should be 5242880.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u32.');
            Y.Assert.isInstanceOf(Uint32Array, image._dataView, 'image._dataView should be an instance of Uint32Array.');
            Y.Assert.areSame(5242880, image._dataView.byteLength, 'image._dataView.byteLength should be 5242880.');
            Y.Assert.areSame(1310720, image._dataView.length, 'image._dataView.length should be 1310720.');
            Y.Assert.areSame(20, image._pixelSize, 'image._pixelSize should be 20.');

            image = new Y.Composite.Image({
                channels: [
                    'u32',
                    'u32',
                    'u32',
                    'u32',
                    'u32',
                    'u32'
                ]
            });

            Y.Assert.areSame(6, image.channels.length, 'image.channels.length should be 6.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4,
                8,
                12,
                16,
                20
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4, 8, 12, 16, 20]');
            Y.Assert.areSame(6291456, image._data.byteLength, 'image._data.byteLength should be 6291456.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u32.');
            Y.Assert.isInstanceOf(Uint32Array, image._dataView, 'image._dataView should be an instance of Uint32Array.');
            Y.Assert.areSame(6291456, image._dataView.byteLength, 'image._dataView.byteLength should be 6291456.');
            Y.Assert.areSame(1572864, image._dataView.length, 'image._dataView.length should be 1572864.');
            Y.Assert.areSame(24, image._pixelSize, 'image._pixelSize should be 24.');

            image = new Y.Composite.Image({
                channels: [
                    'u32',
                    'u32',
                    'u32',
                    'u32',
                    'u32',
                    'u32',
                    'u32'
                ]
            });

            Y.Assert.areSame(7, image.channels.length, 'image.channels.length should be 7.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4,
                8,
                12,
                16,
                20,
                24
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4, 8, 12, 16, 20, 24]');
            Y.Assert.areSame(7340032, image._data.byteLength, 'image._data.byteLength should be 7340032.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u32, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u32.');
            Y.Assert.isInstanceOf(Uint32Array, image._dataView, 'image._dataView should be an instance of Uint32Array.');
            Y.Assert.areSame(7340032, image._dataView.byteLength, 'image._dataView.byteLength should be 7340032.');
            Y.Assert.areSame(1835008, image._dataView.length, 'image._dataView.length should be 1835008.');
            Y.Assert.areSame(28, image._pixelSize, 'image._pixelSize should be 28.');
        },
        'test:012-constructor-channels-u8': function () {
            var image = new Y.Composite.Image({
                channels: [
                    'u8'
                ]
            });

            Y.Assert.areSame(1, image.channels.length, 'image.channels.length should be 1.');
            Y.ArrayAssert.itemsAreSame([
                0
            ], image._channelOffsets, 'image._channelOffsets should be [0]');
            Y.Assert.areSame(262144, image._data.byteLength, 'image._data.byteLength should be 262144.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u8, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u8.');
            Y.Assert.isInstanceOf(Uint8ClampedArray, image._dataView, 'image._dataView should be an instance of Uint8ClampedArray.');
            Y.Assert.areSame(262144, image._dataView.byteLength, 'image._dataView.byteLength should be 262144.');
            Y.Assert.areSame(262144, image._dataView.length, 'image._dataView.length should be 262144.');
            Y.Assert.areSame(1, image._pixelSize, 'image._pixelSize should be 1.');

            image = new Y.Composite.Image({
                channels: [
                    'u8',
                    'u8'
                ]
            });

            Y.Assert.areSame(2, image.channels.length, 'image.channels.length should be 2.');
            Y.ArrayAssert.itemsAreSame([
                0,
                1
            ], image._channelOffsets, 'image._channelOffsets should be [0, 1]');
            Y.Assert.areSame(524288, image._data.byteLength, 'image._data.byteLength should be 524288.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u8, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u8.');
            Y.Assert.isInstanceOf(Uint8ClampedArray, image._dataView, 'image._dataView should be an instance of Uint8ClampedArray.');
            Y.Assert.areSame(524288, image._dataView.byteLength, 'image._dataView.byteLength should be 524288.');
            Y.Assert.areSame(524288, image._dataView.length, 'image._dataView.length should be 524288.');
            Y.Assert.areSame(2, image._pixelSize, 'image._pixelSize should be 2.');

            image = new Y.Composite.Image({
                channels: [
                    'u8',
                    'u8',
                    'u8'
                ]
            });

            Y.Assert.areSame(3, image.channels.length, 'image.channels.length should be 3.');
            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2
            ], image._channelOffsets, 'image._channelOffsets should be [0, 1, 2]');
            Y.Assert.areSame(786432, image._data.byteLength, 'image._data.byteLength should be 786432.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u8, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u8.');
            Y.Assert.isInstanceOf(Uint8ClampedArray, image._dataView, 'image._dataView should be an instance of Uint8ClampedArray.');
            Y.Assert.areSame(786432, image._dataView.byteLength, 'image._dataView.byteLength should be 786432.');
            Y.Assert.areSame(786432, image._dataView.length, 'image._dataView.length should be 786432.');
            Y.Assert.areSame(3, image._pixelSize, 'image._pixelSize should be 3.');

            image = new Y.Composite.Image({
                channels: [
                    'u8',
                    'u8',
                    'u8',
                    'u8'
                ]
            });

            Y.Assert.areSame(4, image.channels.length, 'image.channels.length should be 4.');
            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2,
                3
            ], image._channelOffsets, 'image._channelOffsets should be [0, 1, 2, 3]');
            Y.Assert.areSame(1048576, image._data.byteLength, 'image._data.byteLength should be 1048576.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u8, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u8.');
            Y.Assert.isInstanceOf(Uint8ClampedArray, image._dataView, 'image._dataView should be an instance of Uint8ClampedArray.');
            Y.Assert.areSame(1048576, image._dataView.byteLength, 'image._dataView.byteLength should be 1048576.');
            Y.Assert.areSame(1048576, image._dataView.length, 'image._dataView.length should be 1048576.');
            Y.Assert.areSame(4, image._pixelSize, 'image._pixelSize should be 4.');

            image = new Y.Composite.Image({
                channels: [
                    'u8',
                    'u8',
                    'u8',
                    'u8',
                    'u8'
                ]
            });

            Y.Assert.areSame(5, image.channels.length, 'image.channels.length should be 5.');
            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2,
                3,
                4
            ], image._channelOffsets, 'image._channelOffsets should be [0, 1, 2, 3, 4]');
            Y.Assert.areSame(1310720, image._data.byteLength, 'image._data.byteLength should be 1310720.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u8, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u8.');
            Y.Assert.isInstanceOf(Uint8ClampedArray, image._dataView, 'image._dataView should be an instance of Uint8ClampedArray.');
            Y.Assert.areSame(1310720, image._dataView.byteLength, 'image._dataView.byteLength should be 1310720.');
            Y.Assert.areSame(1310720, image._dataView.length, 'image._dataView.length should be 1310720.');
            Y.Assert.areSame(5, image._pixelSize, 'image._pixelSize should be 5.');

            image = new Y.Composite.Image({
                channels: [
                    'u8',
                    'u8',
                    'u8',
                    'u8',
                    'u8',
                    'u8'
                ]
            });

            Y.Assert.areSame(6, image.channels.length, 'image.channels.length should be 6.');
            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2,
                3,
                4,
                5
            ], image._channelOffsets, 'image._channelOffsets should be [0, 1, 2, 3, 4, 5]');
            Y.Assert.areSame(1572864, image._data.byteLength, 'image._data.byteLength should be 1572864.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u8, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u8.');
            Y.Assert.isInstanceOf(Uint8ClampedArray, image._dataView, 'image._dataView should be an instance of Uint8ClampedArray.');
            Y.Assert.areSame(1572864, image._dataView.byteLength, 'image._dataView.byteLength should be 1572864.');
            Y.Assert.areSame(1572864, image._dataView.length, 'image._dataView.length should be 1572864.');
            Y.Assert.areSame(6, image._pixelSize, 'image._pixelSize should be 6.');

            image = new Y.Composite.Image({
                channels: [
                    'u8',
                    'u8',
                    'u8',
                    'u8',
                    'u8',
                    'u8',
                    'u8'
                ]
            });

            Y.Assert.areSame(7, image.channels.length, 'image.channels.length should be 7.');
            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2,
                3,
                4,
                5,
                6
            ], image._channelOffsets, 'image._channelOffsets should be [0, 1, 2, 3, 4, 5, 6]');
            Y.Assert.areSame(1835008, image._data.byteLength, 'image._data.byteLength should be 1835008.');
            Y.Assert.areSame(Y.Composite.Image.dataTypes.u8, image._dataType, 'image._dataType should be the same as Y.Composite.Image.dataTypes.u8.');
            Y.Assert.isInstanceOf(Uint8ClampedArray, image._dataView, 'image._dataView should be an instance of Uint8ClampedArray.');
            Y.Assert.areSame(1835008, image._dataView.byteLength, 'image._dataView.byteLength should be 1835008.');
            Y.Assert.areSame(1835008, image._dataView.length, 'image._dataView.length should be 1835008.');
            Y.Assert.areSame(7, image._pixelSize, 'image._pixelSize should be 7.');
        },
        'test:013-constructor-channels-mixed': function () {
            var image = new Y.Composite.Image({
                channels: [
                    'u8',
                    's8'
                ]
            });

            Y.Assert.areSame(2, image.channels.length, 'image.channels.length should be 2.');
            Y.ArrayAssert.itemsAreSame([
                0,
                1
            ], image._channelOffsets, 'image._channelOffsets should be [0, 1]');
            Y.Assert.areSame(524288, image._data.byteLength, 'image._data.byteLength should be 524288.');
            Y.Assert.isNull(image._dataType, 'image._dataType should be null.');
            Y.Assert.isInstanceOf(DataView, image._dataView, 'image._dataView should be an instance of DataView.');
            Y.Assert.areSame(2, image._pixelSize, 'image._pixelSize should be 2.');

            image = new Y.Composite.Image({
                channels: [
                    'u16',
                    'u8'
                ]
            });

            Y.Assert.areSame(2, image.channels.length, 'image.channels.length should be 2.');
            Y.ArrayAssert.itemsAreSame([
                0,
                2
            ], image._channelOffsets, 'image._channelOffsets should be [0, 2]');
            Y.Assert.areSame(786432, image._data.byteLength, 'image._data.byteLength should be 786432.');
            Y.Assert.isNull(image._dataType, 'image._dataType should be null.');
            Y.Assert.isInstanceOf(DataView, image._dataView, 'image._dataView should be an instance of DataView.');
            Y.Assert.areSame(3, image._pixelSize, 'image._pixelSize should be 3.');

            image = new Y.Composite.Image({
                channels: [
                    'u8',
                    's16',
                    's8'
                ]
            });

            Y.Assert.areSame(3, image.channels.length, 'image.channels.length should be 3.');
            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                3
            ], image._channelOffsets, 'image._channelOffsets should be [0, 1, 3]');
            Y.Assert.areSame(1048576, image._data.byteLength, 'image._data.byteLength should be 1048576.');
            Y.Assert.isNull(image._dataType, 'image._dataType should be null.');
            Y.Assert.isInstanceOf(DataView, image._dataView, 'image._dataView should be an instance of DataView.');
            Y.Assert.areSame(4, image._pixelSize, 'image._pixelSize should be 4.');

            image = new Y.Composite.Image({
                channels: [
                    'u8',
                    'f32'
                ]
            });

            Y.Assert.areSame(2, image.channels.length, 'image.channels.length should be 2.');
            Y.ArrayAssert.itemsAreSame([
                0,
                1
            ], image._channelOffsets, 'image._channelOffsets should be [0, 1]');
            Y.Assert.areSame(1310720, image._data.byteLength, 'image._data.byteLength should be 1310720.');
            Y.Assert.isNull(image._dataType, 'image._dataType should be null.');
            Y.Assert.isInstanceOf(DataView, image._dataView, 'image._dataView should be an instance of DataView.');
            Y.Assert.areSame(5, image._pixelSize, 'image._pixelSize should be 5.');

            image = new Y.Composite.Image({
                channels: [
                    's32',
                    's16'
                ]
            });

            Y.Assert.areSame(2, image.channels.length, 'image.channels.length should be 2.');
            Y.ArrayAssert.itemsAreSame([
                0,
                4
            ], image._channelOffsets, 'image._channelOffsets should be [0, 4]');
            Y.Assert.areSame(1572864, image._data.byteLength, 'image._data.byteLength should be 1572864.');
            Y.Assert.isNull(image._dataType, 'image._dataType should be null.');
            Y.Assert.isInstanceOf(DataView, image._dataView, 'image._dataView should be an instance of DataView.');
            Y.Assert.areSame(6, image._pixelSize, 'image._pixelSize should be 6.');

            image = new Y.Composite.Image({
                channels: [
                    's16',
                    'u32',
                    'u8'
                ]
            });

            Y.Assert.areSame(3, image.channels.length, 'image.channels.length should be 3.');
            Y.ArrayAssert.itemsAreSame([
                0,
                2,
                6
            ], image._channelOffsets, 'image._channelOffsets should be [0, 2, 6]');
            Y.Assert.areSame(1835008, image._data.byteLength, 'image._data.byteLength should be 1835008.');
            Y.Assert.isNull(image._dataType, 'image._dataType should be null.');
            Y.Assert.isInstanceOf(DataView, image._dataView, 'image._dataView should be an instance of DataView.');
            Y.Assert.areSame(7, image._pixelSize, 'image._pixelSize should be 7.');
        },
        'test:014-constructor-dimensions-1': function () {
            var image = new Y.Composite.Image({
                dimensions: [
                    1
                ]
            });

            Y.Assert.areSame(1, image.dimensions.length, 'image.dimensions.length should be 1.');
            Y.Assert.areSame(4, image._data.byteLength, 'image._data.byteLength should be 4.');
            Y.Assert.areSame(4, image._dataView.byteLength, 'image._dataView.byteLength should be 4.');
            Y.Assert.areSame(4, image._dataView.length, 'image._dataView.length should be 4.');

            image = new Y.Composite.Image({
                dimensions: [
                    987
                ]
            });

            Y.Assert.areSame(1, image.dimensions.length, 'image.dimensions.length should be 1.');
            Y.Assert.areSame(3948, image._data.byteLength, 'image._data.byteLength should be 3948.');
            Y.Assert.areSame(3948, image._dataView.byteLength, 'image._dataView.byteLength should be 3948.');
            Y.Assert.areSame(3948, image._dataView.length, 'image._dataView.length should be 3948.');

            image = new Y.Composite.Image({
                dimensions: [
                    2584
                ]
            });

            Y.Assert.areSame(1, image.dimensions.length, 'image.dimensions.length should be 1.');
            Y.Assert.areSame(10336, image._data.byteLength, 'image._data.byteLength should be 10336.');
            Y.Assert.areSame(10336, image._dataView.byteLength, 'image._dataView.byteLength should be 10336.');
            Y.Assert.areSame(10336, image._dataView.length, 'image._dataView.length should be 10336.');
        },
        'test:015-constructor-dimensions-2': function () {
            var image = new Y.Composite.Image({
                dimensions: [
                    1,
                    1
                ]
            });

            Y.Assert.areSame(2, image.dimensions.length, 'image.dimensions.length should be 2.');
            Y.Assert.areSame(4, image._data.byteLength, 'image._data.byteLength should be 4.');
            Y.Assert.areSame(4, image._dataView.byteLength, 'image._dataView.byteLength should be 4.');
            Y.Assert.areSame(4, image._dataView.length, 'image._dataView.length should be 4.');

            image = new Y.Composite.Image({
                dimensions: [
                    233,
                    1
                ]
            });

            Y.Assert.areSame(2, image.dimensions.length, 'image.dimensions.length should be 2.');
            Y.Assert.areSame(932, image._data.byteLength, 'image._data.byteLength should be 932.');
            Y.Assert.areSame(932, image._dataView.byteLength, 'image._dataView.byteLength should be 932.');
            Y.Assert.areSame(932, image._dataView.length, 'image._dataView.length should be 932.');

            image = new Y.Composite.Image({
                dimensions: [
                    610,
                    1
                ]
            });

            Y.Assert.areSame(2, image.dimensions.length, 'image.dimensions.length should be 2.');
            Y.Assert.areSame(2440, image._data.byteLength, 'image._data.byteLength should be 2440.');
            Y.Assert.areSame(2440, image._dataView.byteLength, 'image._dataView.byteLength should be 2440.');
            Y.Assert.areSame(2440, image._dataView.length, 'image._dataView.length should be 2440.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    233
                ]
            });

            Y.Assert.areSame(2, image.dimensions.length, 'image.dimensions.length should be 2.');
            Y.Assert.areSame(932, image._data.byteLength, 'image._data.byteLength should be 932.');
            Y.Assert.areSame(932, image._dataView.byteLength, 'image._dataView.byteLength should be 932.');
            Y.Assert.areSame(932, image._dataView.length, 'image._dataView.length should be 932.');

            image = new Y.Composite.Image({
                dimensions: [
                    233,
                    233
                ]
            });

            Y.Assert.areSame(2, image.dimensions.length, 'image.dimensions.length should be 2.');
            Y.Assert.areSame(217156, image._data.byteLength, 'image._data.byteLength should be 217156.');
            Y.Assert.areSame(217156, image._dataView.byteLength, 'image._dataView.byteLength should be 217156.');
            Y.Assert.areSame(217156, image._dataView.length, 'image._dataView.length should be 217156.');

            image = new Y.Composite.Image({
                dimensions: [
                    610,
                    233
                ]
            });

            Y.Assert.areSame(2, image.dimensions.length, 'image.dimensions.length should be 2.');
            Y.Assert.areSame(568520, image._data.byteLength, 'image._data.byteLength should be 568520.');
            Y.Assert.areSame(568520, image._dataView.byteLength, 'image._dataView.byteLength should be 568520.');
            Y.Assert.areSame(568520, image._dataView.length, 'image._dataView.length should be 568520.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    610
                ]
            });

            Y.Assert.areSame(2, image.dimensions.length, 'image.dimensions.length should be 2.');
            Y.Assert.areSame(2440, image._data.byteLength, 'image._data.byteLength should be 2440.');
            Y.Assert.areSame(2440, image._dataView.byteLength, 'image._dataView.byteLength should be 2440.');
            Y.Assert.areSame(2440, image._dataView.length, 'image._dataView.length should be 2440.');

            image = new Y.Composite.Image({
                dimensions: [
                    233,
                    610
                ]
            });

            Y.Assert.areSame(2, image.dimensions.length, 'image.dimensions.length should be 2.');
            Y.Assert.areSame(568520, image._data.byteLength, 'image._data.byteLength should be 568520.');
            Y.Assert.areSame(568520, image._dataView.byteLength, 'image._dataView.byteLength should be 568520.');
            Y.Assert.areSame(568520, image._dataView.length, 'image._dataView.length should be 568520.');

            image = new Y.Composite.Image({
                dimensions: [
                    610,
                    610
                ]
            });

            Y.Assert.areSame(2, image.dimensions.length, 'image.dimensions.length should be 2.');
            Y.Assert.areSame(1488400, image._data.byteLength, 'image._data.byteLength should be 1488400.');
            Y.Assert.areSame(1488400, image._dataView.byteLength, 'image._dataView.byteLength should be 1488400.');
            Y.Assert.areSame(1488400, image._dataView.length, 'image._dataView.length should be 1488400.');
        },
        'test:016-constructor-dimensions-3': function () {
            var image = new Y.Composite.Image({
                dimensions: [
                    1,
                    1,
                    1
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(4, image._data.byteLength, 'image._data.byteLength should be 4.');
            Y.Assert.areSame(4, image._dataView.byteLength, 'image._dataView.byteLength should be 4.');
            Y.Assert.areSame(4, image._dataView.length, 'image._dataView.length should be 4.');

            image = new Y.Composite.Image({
                dimensions: [
                    55,
                    1,
                    1
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(220, image._data.byteLength, 'image._data.byteLength should be 220.');
            Y.Assert.areSame(220, image._dataView.byteLength, 'image._dataView.byteLength should be 220.');
            Y.Assert.areSame(220, image._dataView.length, 'image._dataView.length should be 220.');

            image = new Y.Composite.Image({
                dimensions: [
                    144,
                    1,
                    1
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(576, image._data.byteLength, 'image._data.byteLength should be 576.');
            Y.Assert.areSame(576, image._dataView.byteLength, 'image._dataView.byteLength should be 576.');
            Y.Assert.areSame(576, image._dataView.length, 'image._dataView.length should be 576.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    55,
                    1
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(220, image._data.byteLength, 'image._data.byteLength should be 220.');
            Y.Assert.areSame(220, image._dataView.byteLength, 'image._dataView.byteLength should be 220.');
            Y.Assert.areSame(220, image._dataView.length, 'image._dataView.length should be 220.');

            image = new Y.Composite.Image({
                dimensions: [
                    55,
                    55,
                    1
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(12100, image._data.byteLength, 'image._data.byteLength should be 12100.');
            Y.Assert.areSame(12100, image._dataView.byteLength, 'image._dataView.byteLength should be 12100.');
            Y.Assert.areSame(12100, image._dataView.length, 'image._dataView.length should be 12100.');

            image = new Y.Composite.Image({
                dimensions: [
                    144,
                    55,
                    1
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(31680, image._data.byteLength, 'image._data.byteLength should be 31680.');
            Y.Assert.areSame(31680, image._dataView.byteLength, 'image._dataView.byteLength should be 31680.');
            Y.Assert.areSame(31680, image._dataView.length, 'image._dataView.length should be 31680.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    144,
                    1
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(576, image._data.byteLength, 'image._data.byteLength should be 576.');
            Y.Assert.areSame(576, image._dataView.byteLength, 'image._dataView.byteLength should be 576.');
            Y.Assert.areSame(576, image._dataView.length, 'image._dataView.length should be 576.');

            image = new Y.Composite.Image({
                dimensions: [
                    55,
                    144,
                    1
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(31680, image._data.byteLength, 'image._data.byteLength should be 31680.');
            Y.Assert.areSame(31680, image._dataView.byteLength, 'image._dataView.byteLength should be 31680.');
            Y.Assert.areSame(31680, image._dataView.length, 'image._dataView.length should be 31680.');

            image = new Y.Composite.Image({
                dimensions: [
                    144,
                    144,
                    1
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(82944, image._data.byteLength, 'image._data.byteLength should be 82944.');
            Y.Assert.areSame(82944, image._dataView.byteLength, 'image._dataView.byteLength should be 82944.');
            Y.Assert.areSame(82944, image._dataView.length, 'image._dataView.length should be 82944.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    1,
                    55
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(220, image._data.byteLength, 'image._data.byteLength should be 220.');
            Y.Assert.areSame(220, image._dataView.byteLength, 'image._dataView.byteLength should be 220.');
            Y.Assert.areSame(220, image._dataView.length, 'image._dataView.length should be 220.');

            image = new Y.Composite.Image({
                dimensions: [
                    55,
                    1,
                    55
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(12100, image._data.byteLength, 'image._data.byteLength should be 12100.');
            Y.Assert.areSame(12100, image._dataView.byteLength, 'image._dataView.byteLength should be 12100.');
            Y.Assert.areSame(12100, image._dataView.length, 'image._dataView.length should be 12100.');

            image = new Y.Composite.Image({
                dimensions: [
                    144,
                    1,
                    55
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(31680, image._data.byteLength, 'image._data.byteLength should be 31680.');
            Y.Assert.areSame(31680, image._dataView.byteLength, 'image._dataView.byteLength should be 31680.');
            Y.Assert.areSame(31680, image._dataView.length, 'image._dataView.length should be 31680.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    55,
                    55
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(12100, image._data.byteLength, 'image._data.byteLength should be 12100.');
            Y.Assert.areSame(12100, image._dataView.byteLength, 'image._dataView.byteLength should be 12100.');
            Y.Assert.areSame(12100, image._dataView.length, 'image._dataView.length should be 12100.');

            image = new Y.Composite.Image({
                dimensions: [
                    55,
                    55,
                    55
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(665500, image._data.byteLength, 'image._data.byteLength should be 665500.');
            Y.Assert.areSame(665500, image._dataView.byteLength, 'image._dataView.byteLength should be 665500.');
            Y.Assert.areSame(665500, image._dataView.length, 'image._dataView.length should be 665500.');

            image = new Y.Composite.Image({
                dimensions: [
                    144,
                    55,
                    55
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(1742400, image._data.byteLength, 'image._data.byteLength should be 1742400.');
            Y.Assert.areSame(1742400, image._dataView.byteLength, 'image._dataView.byteLength should be 1742400.');
            Y.Assert.areSame(1742400, image._dataView.length, 'image._dataView.length should be 1742400.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    144,
                    55
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(31680, image._data.byteLength, 'image._data.byteLength should be 31680.');
            Y.Assert.areSame(31680, image._dataView.byteLength, 'image._dataView.byteLength should be 31680.');
            Y.Assert.areSame(31680, image._dataView.length, 'image._dataView.length should be 31680.');

            image = new Y.Composite.Image({
                dimensions: [
                    55,
                    144,
                    55
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(1742400, image._data.byteLength, 'image._data.byteLength should be 1742400.');
            Y.Assert.areSame(1742400, image._dataView.byteLength, 'image._dataView.byteLength should be 1742400.');
            Y.Assert.areSame(1742400, image._dataView.length, 'image._dataView.length should be 1742400.');

            image = new Y.Composite.Image({
                dimensions: [
                    144,
                    144,
                    55
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(4561920, image._data.byteLength, 'image._data.byteLength should be 4561920.');
            Y.Assert.areSame(4561920, image._dataView.byteLength, 'image._dataView.byteLength should be 4561920.');
            Y.Assert.areSame(4561920, image._dataView.length, 'image._dataView.length should be 4561920.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    1,
                    144
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(576, image._data.byteLength, 'image._data.byteLength should be 576.');
            Y.Assert.areSame(576, image._dataView.byteLength, 'image._dataView.byteLength should be 576.');
            Y.Assert.areSame(576, image._dataView.length, 'image._dataView.length should be 576.');

            image = new Y.Composite.Image({
                dimensions: [
                    55,
                    1,
                    144
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(31680, image._data.byteLength, 'image._data.byteLength should be 31680.');
            Y.Assert.areSame(31680, image._dataView.byteLength, 'image._dataView.byteLength should be 31680.');
            Y.Assert.areSame(31680, image._dataView.length, 'image._dataView.length should be 31680.');

            image = new Y.Composite.Image({
                dimensions: [
                    144,
                    1,
                    144
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(82944, image._data.byteLength, 'image._data.byteLength should be 82944.');
            Y.Assert.areSame(82944, image._dataView.byteLength, 'image._dataView.byteLength should be 82944.');
            Y.Assert.areSame(82944, image._dataView.length, 'image._dataView.length should be 82944.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    55,
                    144
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(31680, image._data.byteLength, 'image._data.byteLength should be 31680.');
            Y.Assert.areSame(31680, image._dataView.byteLength, 'image._dataView.byteLength should be 31680.');
            Y.Assert.areSame(31680, image._dataView.length, 'image._dataView.length should be 31680.');

            image = new Y.Composite.Image({
                dimensions: [
                    55,
                    55,
                    144
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(1742400, image._data.byteLength, 'image._data.byteLength should be 1742400.');
            Y.Assert.areSame(1742400, image._dataView.byteLength, 'image._dataView.byteLength should be 1742400.');
            Y.Assert.areSame(1742400, image._dataView.length, 'image._dataView.length should be 1742400.');

            image = new Y.Composite.Image({
                dimensions: [
                    144,
                    55,
                    144
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(4561920, image._data.byteLength, 'image._data.byteLength should be 4561920.');
            Y.Assert.areSame(4561920, image._dataView.byteLength, 'image._dataView.byteLength should be 4561920.');
            Y.Assert.areSame(4561920, image._dataView.length, 'image._dataView.length should be 4561920.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    144,
                    144
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(82944, image._data.byteLength, 'image._data.byteLength should be 82944.');
            Y.Assert.areSame(82944, image._dataView.byteLength, 'image._dataView.byteLength should be 82944.');
            Y.Assert.areSame(82944, image._dataView.length, 'image._dataView.length should be 82944.');

            image = new Y.Composite.Image({
                dimensions: [
                    55,
                    144,
                    144
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(4561920, image._data.byteLength, 'image._data.byteLength should be 4561920.');
            Y.Assert.areSame(4561920, image._dataView.byteLength, 'image._dataView.byteLength should be 4561920.');
            Y.Assert.areSame(4561920, image._dataView.length, 'image._dataView.length should be 4561920.');

            image = new Y.Composite.Image({
                dimensions: [
                    144,
                    144,
                    144
                ]
            });

            Y.Assert.areSame(3, image.dimensions.length, 'image.dimensions.length should be 3.');
            Y.Assert.areSame(11943936, image._data.byteLength, 'image._data.byteLength should be 11943936.');
            Y.Assert.areSame(11943936, image._dataView.byteLength, 'image._dataView.byteLength should be 11943936.');
            Y.Assert.areSame(11943936, image._dataView.length, 'image._dataView.length should be 11943936.');
        },
        'test:017-constructor-dimensions-4': function () {
            var image = new Y.Composite.Image({
                dimensions: [
                    1,
                    1,
                    1,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(4, image._data.byteLength, 'image._data.byteLength should be 4.');
            Y.Assert.areSame(4, image._dataView.byteLength, 'image._dataView.byteLength should be 4.');
            Y.Assert.areSame(4, image._dataView.length, 'image._dataView.length should be 4.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    1,
                    1,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(52, image._data.byteLength, 'image._data.byteLength should be 52.');
            Y.Assert.areSame(52, image._dataView.byteLength, 'image._dataView.byteLength should be 52.');
            Y.Assert.areSame(52, image._dataView.length, 'image._dataView.length should be 52.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    1,
                    1,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(136, image._data.byteLength, 'image._data.byteLength should be 136.');
            Y.Assert.areSame(136, image._dataView.byteLength, 'image._dataView.byteLength should be 136.');
            Y.Assert.areSame(136, image._dataView.length, 'image._dataView.length should be 136.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    13,
                    1,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(52, image._data.byteLength, 'image._data.byteLength should be 52.');
            Y.Assert.areSame(52, image._dataView.byteLength, 'image._dataView.byteLength should be 52.');
            Y.Assert.areSame(52, image._dataView.length, 'image._dataView.length should be 52.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    13,
                    1,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(676, image._data.byteLength, 'image._data.byteLength should be 676.');
            Y.Assert.areSame(676, image._dataView.byteLength, 'image._dataView.byteLength should be 676.');
            Y.Assert.areSame(676, image._dataView.length, 'image._dataView.length should be 676.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    13,
                    1,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(1768, image._data.byteLength, 'image._data.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.byteLength, 'image._dataView.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.length, 'image._dataView.length should be 1768.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    34,
                    1,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(136, image._data.byteLength, 'image._data.byteLength should be 136.');
            Y.Assert.areSame(136, image._dataView.byteLength, 'image._dataView.byteLength should be 136.');
            Y.Assert.areSame(136, image._dataView.length, 'image._dataView.length should be 136.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    34,
                    1,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(1768, image._data.byteLength, 'image._data.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.byteLength, 'image._dataView.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.length, 'image._dataView.length should be 1768.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    34,
                    1,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(4624, image._data.byteLength, 'image._data.byteLength should be 4624.');
            Y.Assert.areSame(4624, image._dataView.byteLength, 'image._dataView.byteLength should be 4624.');
            Y.Assert.areSame(4624, image._dataView.length, 'image._dataView.length should be 4624.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    1,
                    13,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(52, image._data.byteLength, 'image._data.byteLength should be 52.');
            Y.Assert.areSame(52, image._dataView.byteLength, 'image._dataView.byteLength should be 52.');
            Y.Assert.areSame(52, image._dataView.length, 'image._dataView.length should be 52.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    1,
                    13,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(676, image._data.byteLength, 'image._data.byteLength should be 676.');
            Y.Assert.areSame(676, image._dataView.byteLength, 'image._dataView.byteLength should be 676.');
            Y.Assert.areSame(676, image._dataView.length, 'image._dataView.length should be 676.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    1,
                    13,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(1768, image._data.byteLength, 'image._data.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.byteLength, 'image._dataView.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.length, 'image._dataView.length should be 1768.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    13,
                    13,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(676, image._data.byteLength, 'image._data.byteLength should be 676.');
            Y.Assert.areSame(676, image._dataView.byteLength, 'image._dataView.byteLength should be 676.');
            Y.Assert.areSame(676, image._dataView.length, 'image._dataView.length should be 676.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    13,
                    13,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(8788, image._data.byteLength, 'image._data.byteLength should be 8788.');
            Y.Assert.areSame(8788, image._dataView.byteLength, 'image._dataView.byteLength should be 8788.');
            Y.Assert.areSame(8788, image._dataView.length, 'image._dataView.length should be 8788.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    13,
                    13,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(22984, image._data.byteLength, 'image._data.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.byteLength, 'image._dataView.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.length, 'image._dataView.length should be 22984.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    34,
                    13,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(1768, image._data.byteLength, 'image._data.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.byteLength, 'image._dataView.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.length, 'image._dataView.length should be 1768.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    34,
                    13,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(22984, image._data.byteLength, 'image._data.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.byteLength, 'image._dataView.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.length, 'image._dataView.length should be 22984.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    34,
                    13,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(60112, image._data.byteLength, 'image._data.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.byteLength, 'image._dataView.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.length, 'image._dataView.length should be 60112.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    1,
                    34,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(136, image._data.byteLength, 'image._data.byteLength should be 136.');
            Y.Assert.areSame(136, image._dataView.byteLength, 'image._dataView.byteLength should be 136.');
            Y.Assert.areSame(136, image._dataView.length, 'image._dataView.length should be 136.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    1,
                    34,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(1768, image._data.byteLength, 'image._data.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.byteLength, 'image._dataView.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.length, 'image._dataView.length should be 1768.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    1,
                    34,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(4624, image._data.byteLength, 'image._data.byteLength should be 4624.');
            Y.Assert.areSame(4624, image._dataView.byteLength, 'image._dataView.byteLength should be 4624.');
            Y.Assert.areSame(4624, image._dataView.length, 'image._dataView.length should be 4624.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    13,
                    34,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(1768, image._data.byteLength, 'image._data.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.byteLength, 'image._dataView.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.length, 'image._dataView.length should be 1768.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    13,
                    34,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(22984, image._data.byteLength, 'image._data.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.byteLength, 'image._dataView.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.length, 'image._dataView.length should be 22984.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    13,
                    34,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(60112, image._data.byteLength, 'image._data.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.byteLength, 'image._dataView.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.length, 'image._dataView.length should be 60112.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    34,
                    34,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(4624, image._data.byteLength, 'image._data.byteLength should be 4624.');
            Y.Assert.areSame(4624, image._dataView.byteLength, 'image._dataView.byteLength should be 4624.');
            Y.Assert.areSame(4624, image._dataView.length, 'image._dataView.length should be 4624.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    34,
                    34,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(60112, image._data.byteLength, 'image._data.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.byteLength, 'image._dataView.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.length, 'image._dataView.length should be 60112.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    34,
                    34,
                    1
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(157216, image._data.byteLength, 'image._data.byteLength should be 157216.');
            Y.Assert.areSame(157216, image._dataView.byteLength, 'image._dataView.byteLength should be 157216.');
            Y.Assert.areSame(157216, image._dataView.length, 'image._dataView.length should be 157216.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    1,
                    1,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(52, image._data.byteLength, 'image._data.byteLength should be 52.');
            Y.Assert.areSame(52, image._dataView.byteLength, 'image._dataView.byteLength should be 52.');
            Y.Assert.areSame(52, image._dataView.length, 'image._dataView.length should be 52.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    1,
                    1,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(676, image._data.byteLength, 'image._data.byteLength should be 676.');
            Y.Assert.areSame(676, image._dataView.byteLength, 'image._dataView.byteLength should be 676.');
            Y.Assert.areSame(676, image._dataView.length, 'image._dataView.length should be 676.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    1,
                    1,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(1768, image._data.byteLength, 'image._data.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.byteLength, 'image._dataView.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.length, 'image._dataView.length should be 1768.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    13,
                    1,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(676, image._data.byteLength, 'image._data.byteLength should be 676.');
            Y.Assert.areSame(676, image._dataView.byteLength, 'image._dataView.byteLength should be 676.');
            Y.Assert.areSame(676, image._dataView.length, 'image._dataView.length should be 676.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    13,
                    1,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(8788, image._data.byteLength, 'image._data.byteLength should be 8788.');
            Y.Assert.areSame(8788, image._dataView.byteLength, 'image._dataView.byteLength should be 8788.');
            Y.Assert.areSame(8788, image._dataView.length, 'image._dataView.length should be 8788.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    13,
                    1,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(22984, image._data.byteLength, 'image._data.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.byteLength, 'image._dataView.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.length, 'image._dataView.length should be 22984.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    34,
                    1,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(1768, image._data.byteLength, 'image._data.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.byteLength, 'image._dataView.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.length, 'image._dataView.length should be 1768.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    34,
                    1,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(22984, image._data.byteLength, 'image._data.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.byteLength, 'image._dataView.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.length, 'image._dataView.length should be 22984.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    34,
                    1,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(60112, image._data.byteLength, 'image._data.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.byteLength, 'image._dataView.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.length, 'image._dataView.length should be 60112.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    1,
                    13,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(676, image._data.byteLength, 'image._data.byteLength should be 676.');
            Y.Assert.areSame(676, image._dataView.byteLength, 'image._dataView.byteLength should be 676.');
            Y.Assert.areSame(676, image._dataView.length, 'image._dataView.length should be 676.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    1,
                    13,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(8788, image._data.byteLength, 'image._data.byteLength should be 8788.');
            Y.Assert.areSame(8788, image._dataView.byteLength, 'image._dataView.byteLength should be 8788.');
            Y.Assert.areSame(8788, image._dataView.length, 'image._dataView.length should be 8788.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    1,
                    13,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(22984, image._data.byteLength, 'image._data.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.byteLength, 'image._dataView.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.length, 'image._dataView.length should be 22984.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    13,
                    13,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(8788, image._data.byteLength, 'image._data.byteLength should be 8788.');
            Y.Assert.areSame(8788, image._dataView.byteLength, 'image._dataView.byteLength should be 8788.');
            Y.Assert.areSame(8788, image._dataView.length, 'image._dataView.length should be 8788.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    13,
                    13,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(114244, image._data.byteLength, 'image._data.byteLength should be 114244.');
            Y.Assert.areSame(114244, image._dataView.byteLength, 'image._dataView.byteLength should be 114244.');
            Y.Assert.areSame(114244, image._dataView.length, 'image._dataView.length should be 114244.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    13,
                    13,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(298792, image._data.byteLength, 'image._data.byteLength should be 298792.');
            Y.Assert.areSame(298792, image._dataView.byteLength, 'image._dataView.byteLength should be 298792.');
            Y.Assert.areSame(298792, image._dataView.length, 'image._dataView.length should be 298792.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    34,
                    13,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(22984, image._data.byteLength, 'image._data.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.byteLength, 'image._dataView.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.length, 'image._dataView.length should be 22984.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    34,
                    13,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(298792, image._data.byteLength, 'image._data.byteLength should be 298792.');
            Y.Assert.areSame(298792, image._dataView.byteLength, 'image._dataView.byteLength should be 298792.');
            Y.Assert.areSame(298792, image._dataView.length, 'image._dataView.length should be 298792.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    34,
                    13,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(781456, image._data.byteLength, 'image._data.byteLength should be 781456.');
            Y.Assert.areSame(781456, image._dataView.byteLength, 'image._dataView.byteLength should be 781456.');
            Y.Assert.areSame(781456, image._dataView.length, 'image._dataView.length should be 781456.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    1,
                    34,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(1768, image._data.byteLength, 'image._data.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.byteLength, 'image._dataView.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.length, 'image._dataView.length should be 1768.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    1,
                    34,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(22984, image._data.byteLength, 'image._data.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.byteLength, 'image._dataView.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.length, 'image._dataView.length should be 22984.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    1,
                    34,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(60112, image._data.byteLength, 'image._data.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.byteLength, 'image._dataView.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.length, 'image._dataView.length should be 60112.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    13,
                    34,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(22984, image._data.byteLength, 'image._data.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.byteLength, 'image._dataView.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.length, 'image._dataView.length should be 22984.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    13,
                    34,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(298792, image._data.byteLength, 'image._data.byteLength should be 298792.');
            Y.Assert.areSame(298792, image._dataView.byteLength, 'image._dataView.byteLength should be 298792.');
            Y.Assert.areSame(298792, image._dataView.length, 'image._dataView.length should be 298792.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    13,
                    34,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(781456, image._data.byteLength, 'image._data.byteLength should be 781456.');
            Y.Assert.areSame(781456, image._dataView.byteLength, 'image._dataView.byteLength should be 781456.');
            Y.Assert.areSame(781456, image._dataView.length, 'image._dataView.length should be 781456.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    34,
                    34,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(60112, image._data.byteLength, 'image._data.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.byteLength, 'image._dataView.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.length, 'image._dataView.length should be 60112.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    34,
                    34,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(781456, image._data.byteLength, 'image._data.byteLength should be 781456.');
            Y.Assert.areSame(781456, image._dataView.byteLength, 'image._dataView.byteLength should be 781456.');
            Y.Assert.areSame(781456, image._dataView.length, 'image._dataView.length should be 781456.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    34,
                    34,
                    13
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(2043808, image._data.byteLength, 'image._data.byteLength should be 2043808.');
            Y.Assert.areSame(2043808, image._dataView.byteLength, 'image._dataView.byteLength should be 2043808.');
            Y.Assert.areSame(2043808, image._dataView.length, 'image._dataView.length should be 2043808.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    1,
                    1,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(136, image._data.byteLength, 'image._data.byteLength should be 136.');
            Y.Assert.areSame(136, image._dataView.byteLength, 'image._dataView.byteLength should be 136.');
            Y.Assert.areSame(136, image._dataView.length, 'image._dataView.length should be 136.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    1,
                    1,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(1768, image._data.byteLength, 'image._data.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.byteLength, 'image._dataView.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.length, 'image._dataView.length should be 1768.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    1,
                    1,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(4624, image._data.byteLength, 'image._data.byteLength should be 4624.');
            Y.Assert.areSame(4624, image._dataView.byteLength, 'image._dataView.byteLength should be 4624.');
            Y.Assert.areSame(4624, image._dataView.length, 'image._dataView.length should be 4624.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    13,
                    1,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(1768, image._data.byteLength, 'image._data.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.byteLength, 'image._dataView.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.length, 'image._dataView.length should be 1768.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    13,
                    1,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(22984, image._data.byteLength, 'image._data.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.byteLength, 'image._dataView.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.length, 'image._dataView.length should be 22984.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    13,
                    1,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(60112, image._data.byteLength, 'image._data.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.byteLength, 'image._dataView.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.length, 'image._dataView.length should be 60112.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    34,
                    1,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(4624, image._data.byteLength, 'image._data.byteLength should be 4624.');
            Y.Assert.areSame(4624, image._dataView.byteLength, 'image._dataView.byteLength should be 4624.');
            Y.Assert.areSame(4624, image._dataView.length, 'image._dataView.length should be 4624.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    34,
                    1,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(60112, image._data.byteLength, 'image._data.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.byteLength, 'image._dataView.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.length, 'image._dataView.length should be 60112.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    34,
                    1,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(157216, image._data.byteLength, 'image._data.byteLength should be 157216.');
            Y.Assert.areSame(157216, image._dataView.byteLength, 'image._dataView.byteLength should be 157216.');
            Y.Assert.areSame(157216, image._dataView.length, 'image._dataView.length should be 157216.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    1,
                    13,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(1768, image._data.byteLength, 'image._data.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.byteLength, 'image._dataView.byteLength should be 1768.');
            Y.Assert.areSame(1768, image._dataView.length, 'image._dataView.length should be 1768.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    1,
                    13,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(22984, image._data.byteLength, 'image._data.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.byteLength, 'image._dataView.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.length, 'image._dataView.length should be 22984.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    1,
                    13,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(60112, image._data.byteLength, 'image._data.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.byteLength, 'image._dataView.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.length, 'image._dataView.length should be 60112.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    13,
                    13,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(22984, image._data.byteLength, 'image._data.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.byteLength, 'image._dataView.byteLength should be 22984.');
            Y.Assert.areSame(22984, image._dataView.length, 'image._dataView.length should be 22984.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    13,
                    13,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(298792, image._data.byteLength, 'image._data.byteLength should be 298792.');
            Y.Assert.areSame(298792, image._dataView.byteLength, 'image._dataView.byteLength should be 298792.');
            Y.Assert.areSame(298792, image._dataView.length, 'image._dataView.length should be 298792.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    13,
                    13,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(781456, image._data.byteLength, 'image._data.byteLength should be 781456.');
            Y.Assert.areSame(781456, image._dataView.byteLength, 'image._dataView.byteLength should be 781456.');
            Y.Assert.areSame(781456, image._dataView.length, 'image._dataView.length should be 781456.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    34,
                    13,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(60112, image._data.byteLength, 'image._data.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.byteLength, 'image._dataView.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.length, 'image._dataView.length should be 60112.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    34,
                    13,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(781456, image._data.byteLength, 'image._data.byteLength should be 781456.');
            Y.Assert.areSame(781456, image._dataView.byteLength, 'image._dataView.byteLength should be 781456.');
            Y.Assert.areSame(781456, image._dataView.length, 'image._dataView.length should be 781456.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    34,
                    13,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(2043808, image._data.byteLength, 'image._data.byteLength should be 2043808.');
            Y.Assert.areSame(2043808, image._dataView.byteLength, 'image._dataView.byteLength should be 2043808.');
            Y.Assert.areSame(2043808, image._dataView.length, 'image._dataView.length should be 2043808.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    1,
                    34,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(4624, image._data.byteLength, 'image._data.byteLength should be 4624.');
            Y.Assert.areSame(4624, image._dataView.byteLength, 'image._dataView.byteLength should be 4624.');
            Y.Assert.areSame(4624, image._dataView.length, 'image._dataView.length should be 4624.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    1,
                    34,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(60112, image._data.byteLength, 'image._data.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.byteLength, 'image._dataView.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.length, 'image._dataView.length should be 60112.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    1,
                    34,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(157216, image._data.byteLength, 'image._data.byteLength should be 157216.');
            Y.Assert.areSame(157216, image._dataView.byteLength, 'image._dataView.byteLength should be 157216.');
            Y.Assert.areSame(157216, image._dataView.length, 'image._dataView.length should be 157216.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    13,
                    34,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(60112, image._data.byteLength, 'image._data.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.byteLength, 'image._dataView.byteLength should be 60112.');
            Y.Assert.areSame(60112, image._dataView.length, 'image._dataView.length should be 60112.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    13,
                    34,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(781456, image._data.byteLength, 'image._data.byteLength should be 781456.');
            Y.Assert.areSame(781456, image._dataView.byteLength, 'image._dataView.byteLength should be 781456.');
            Y.Assert.areSame(781456, image._dataView.length, 'image._dataView.length should be 781456.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    13,
                    34,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(2043808, image._data.byteLength, 'image._data.byteLength should be 2043808.');
            Y.Assert.areSame(2043808, image._dataView.byteLength, 'image._dataView.byteLength should be 2043808.');
            Y.Assert.areSame(2043808, image._dataView.length, 'image._dataView.length should be 2043808.');

            image = new Y.Composite.Image({
                dimensions: [
                    1,
                    34,
                    34,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(157216, image._data.byteLength, 'image._data.byteLength should be 157216.');
            Y.Assert.areSame(157216, image._dataView.byteLength, 'image._dataView.byteLength should be 157216.');
            Y.Assert.areSame(157216, image._dataView.length, 'image._dataView.length should be 157216.');

            image = new Y.Composite.Image({
                dimensions: [
                    13,
                    34,
                    34,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(2043808, image._data.byteLength, 'image._data.byteLength should be 2043808.');
            Y.Assert.areSame(2043808, image._dataView.byteLength, 'image._dataView.byteLength should be 2043808.');
            Y.Assert.areSame(2043808, image._dataView.length, 'image._dataView.length should be 2043808.');

            image = new Y.Composite.Image({
                dimensions: [
                    34,
                    34,
                    34,
                    34
                ]
            });

            Y.Assert.areSame(4, image.dimensions.length, 'image.dimensions.length should be 4.');
            Y.Assert.areSame(5345344, image._data.byteLength, 'image._data.byteLength should be 5345344.');
            Y.Assert.areSame(5345344, image._dataView.byteLength, 'image._dataView.byteLength should be 5345344.');
            Y.Assert.areSame(5345344, image._dataView.length, 'image._dataView.length should be 5345344.');
        },
        'test:018-constructor-data': function () {
            var data = new ArrayBuffer(24),
                dataView = new Uint8ClampedArray(data),
                image,
                randomIndex0 = Math.floor(Math.random() * 6),
                randomIndex1 = Math.floor(Math.random() * 6 + 6),
                randomIndex2 = Math.floor(Math.random() * 6 + 12),
                randomIndex3 = Math.floor(Math.random() * 6 + 18);

            dataView[randomIndex0] = 100;
            dataView[randomIndex1] = 110;
            dataView[randomIndex2] = 120;
            dataView[randomIndex3] = 130;

            image = new Y.Composite.Image({
                data: data,
                dimensions: [
                    2,
                    3
                ]
            });

            Y.Assert.areSame(100, image._dataView[randomIndex0], 'image._dataView[randomIndex0] should be 100.');
            Y.Assert.areSame(110, image._dataView[randomIndex1], 'image._dataView[randomIndex1] should be 110.');
            Y.Assert.areSame(120, image._dataView[randomIndex2], 'image._dataView[randomIndex2] should be 120.');
            Y.Assert.areSame(130, image._dataView[randomIndex3], 'image._dataView[randomIndex3] should be 130.');

            data = [
                11,
                22,
                33,
                44,
                55,
                66,
                77,
                88,
                99,
                12,
                23,
                34,
                45,
                56,
                67,
                78,
                89,
                90,
                13,
                24,
                35,
                46,
                57,
                68
            ];

            image = new Y.Composite.Image({
                data: data,
                dimensions: [
                    2,
                    3
                ]
            });

            Y.ArrayAssert.itemsAreSame(data, image._dataView, 'The items of image._dataView should be the data as the items of data.');
        },
        'test:019-constructor-littleEndian': function () {
            var image = new Y.Composite.Image();

            Y.Assert.isFalse(image._littleEndian, 'image._littleEndian should be false.');

            image = new Y.Composite.Image({
                littleEndian: true
            });

            Y.Assert.isTrue(image._littleEndian, 'image._littleEndian should be true.');
        },
        'test:020-_getPixelIndex': function () {
            var image = new Y.Composite.Image({
                dimensions: [
                    2584
                ]
            });

            Y.Assert.areSame(987, image._getPixelIndex(987), 'image._getPixelIndex(987) should be 987.');
            Y.Assert.areSame(377, image._getPixelIndex(377), 'image._getPixelIndex(987) should be 377.');
            Y.Assert.areSame(144, image._getPixelIndex(144), 'image._getPixelIndex(987) should be 144.');

            image = new Y.Composite.Image({
                dimensions: [
                    610,
                    610
                ]
            });

            Y.Assert.areSame(88073, image._getPixelIndex(233, 144), 'image._getPixelIndex(233, 144) should be 88073.');
            Y.Assert.areSame(33639, image._getPixelIndex(89, 55), 'image._getPixelIndex(89, 55) should be 33639.');
            Y.Assert.areSame(12844, image._getPixelIndex(34, 21), 'image._getPixelIndex(34, 21) should be 12844.');

            Y.Assert.areSame(20761, image._getPixelIndex(21, 34), 'image._getPixelIndex(21, 34) should be 20761.');
            Y.Assert.areSame(54345, image._getPixelIndex(55, 89), 'image._getPixelIndex(55, 89) should be 54345.');
            Y.Assert.areSame(142274, image._getPixelIndex(144, 233), 'image._getPixelIndex(144, 233) should be 142274.');

            image = new Y.Composite.Image({
                dimensions: [
                    144,
                    144,
                    144
                ]
            });

            Y.Assert.areSame(440407, image._getPixelIndex(55, 34, 21), 'image._getPixelIndex(55, 34, 21) should be 440407.');
            Y.Assert.areSame(167781, image._getPixelIndex(21, 13, 8), 'image._getPixelIndex(21, 13, 8) should be 167781.');
            Y.Assert.areSame(62936, image._getPixelIndex(8, 5, 3), 'image._getPixelIndex(8, 5, 3) should be 62936.');

            Y.Assert.areSame(166611, image._getPixelIndex(3, 5, 8), 'image._getPixelIndex(3, 5, 8) should be 166611.');
            Y.Assert.areSame(437336, image._getPixelIndex(8, 13, 21), 'image._getPixelIndex(8, 13, 21) should be 437336.');
            Y.Assert.areSame(1145397, image._getPixelIndex(21, 34, 55), 'image._getPixelIndex(21, 34, 55) should be 1145397.');
        },
        'test:021-_getValue_setValue': function () {
            var image = new Y.Composite.Image({
                    channels: [
                        'f32',
                        'f32',
                        'f32'
                    ]
                }),
                pixelIndex0 = Math.floor(Math.random() * image.pixelCount),
                pixelIndex1 = Math.floor(Math.random() * image.pixelCount),
                pixelIndex2 = Math.floor(Math.random() * image.pixelCount),
                value0 = 1234.5,
                value1 = 9421.2998046875,
                value2 = 7890.10009765625;

            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 0, value0)._getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 1, value1)._getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 2, value2)._getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');

            image = new Y.Composite.Image({
                channels: [
                    'f64',
                    'f64',
                    'f64'
                ]
            });

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            value0 = Math.random();
            value1 = Math.random();
            value2 = Math.random();

            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 0, value0)._getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 1, value1)._getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 2, value2)._getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');

            image = new Y.Composite.Image({
                channels: [
                    's16',
                    's16',
                    's16'
                ]
            });

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            value0 = -34;
            value1 = -55;
            value2 = -89;

            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 0, value0)._getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 1, value1)._getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 2, value2)._getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');

            image = new Y.Composite.Image({
                channels: [
                    's32',
                    's32',
                    's32'
                ]
            });

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 0, value0)._getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 1, value1)._getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 2, value2)._getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');

            image = new Y.Composite.Image({
                channels: [
                    's8',
                    's8',
                    's8'
                ]
            });

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 0, value0)._getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 1, value1)._getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 2, value2)._getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');

            image = new Y.Composite.Image({
                channels: [
                    'u16',
                    'u16',
                    'u16'
                ]
            });

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            value0 = 34;
            value1 = 55;
            value2 = 89;

            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 0, value0)._getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 1, value1)._getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 2, value2)._getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');

            image = new Y.Composite.Image({
                channels: [
                    'u32',
                    'u32',
                    'u32'
                ]
            });

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 0, value0)._getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 1, value1)._getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 2, value2)._getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');

            image = new Y.Composite.Image({
                channels: [
                    'u8',
                    'u8',
                    'u8'
                ]
            });

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 0, value0)._getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 1, value1)._getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 2, value2)._getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');

            image = new Y.Composite.Image({
                channels: [
                    'u8',
                    'u16',
                    'u32',
                    's8',
                    's16',
                    's32',
                    'f32',
                    'f64'
                ],
                dimensions: [
                    21,
                    21,
                    21,
                    21
                ]
            });

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 0, value0)._getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 1, value0)._getValue(pixelIndex0, 1), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 2, value0)._getValue(pixelIndex0, 2), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 3, value0)._getValue(pixelIndex0, 3), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 4, value0)._getValue(pixelIndex0, 4), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 5, value0)._getValue(pixelIndex0, 5), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 6, value0)._getValue(pixelIndex0, 6), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 7, value0)._getValue(pixelIndex0, 7), 'The value set and returned should be the same as value0.');

            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 0, value1)._getValue(pixelIndex1, 0), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 1, value1)._getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 2, value1)._getValue(pixelIndex1, 2), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 3, value1)._getValue(pixelIndex1, 3), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 4, value1)._getValue(pixelIndex1, 4), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 5, value1)._getValue(pixelIndex1, 5), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 6, value1)._getValue(pixelIndex1, 6), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 7, value1)._getValue(pixelIndex1, 7), 'The value set and returned should be the same as value1.');

            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 0, value2)._getValue(pixelIndex2, 0), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 1, value2)._getValue(pixelIndex2, 1), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 2, value2)._getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 3, value2)._getValue(pixelIndex2, 3), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 4, value2)._getValue(pixelIndex2, 4), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 5, value2)._getValue(pixelIndex2, 5), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 6, value2)._getValue(pixelIndex2, 6), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 7, value2)._getValue(pixelIndex2, 7), 'The value set and returned should be the same as value2.');

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 0, value0)._getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 1, value0)._getValue(pixelIndex0, 1), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 2, value0)._getValue(pixelIndex0, 2), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 3, value0)._getValue(pixelIndex0, 3), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 4, value0)._getValue(pixelIndex0, 4), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 5, value0)._getValue(pixelIndex0, 5), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 6, value0)._getValue(pixelIndex0, 6), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 7, value0)._getValue(pixelIndex0, 7), 'The value set and returned should be the same as value0.');

            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 0, value1)._getValue(pixelIndex1, 0), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 1, value1)._getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 2, value1)._getValue(pixelIndex1, 2), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 3, value1)._getValue(pixelIndex1, 3), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 4, value1)._getValue(pixelIndex1, 4), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 5, value1)._getValue(pixelIndex1, 5), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 6, value1)._getValue(pixelIndex1, 6), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 7, value1)._getValue(pixelIndex1, 7), 'The value set and returned should be the same as value1.');

            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 0, value2)._getValue(pixelIndex2, 0), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 1, value2)._getValue(pixelIndex2, 1), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 2, value2)._getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 3, value2)._getValue(pixelIndex2, 3), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 4, value2)._getValue(pixelIndex2, 4), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 5, value2)._getValue(pixelIndex2, 5), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 6, value2)._getValue(pixelIndex2, 6), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 7, value2)._getValue(pixelIndex2, 7), 'The value set and returned should be the same as value2.');

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 0, value0)._getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 1, value0)._getValue(pixelIndex0, 1), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 2, value0)._getValue(pixelIndex0, 2), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 3, value0)._getValue(pixelIndex0, 3), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 4, value0)._getValue(pixelIndex0, 4), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 5, value0)._getValue(pixelIndex0, 5), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 6, value0)._getValue(pixelIndex0, 6), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image._setValue(pixelIndex0, 7, value0)._getValue(pixelIndex0, 7), 'The value set and returned should be the same as value0.');

            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 0, value1)._getValue(pixelIndex1, 0), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 1, value1)._getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 2, value1)._getValue(pixelIndex1, 2), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 3, value1)._getValue(pixelIndex1, 3), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 4, value1)._getValue(pixelIndex1, 4), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 5, value1)._getValue(pixelIndex1, 5), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 6, value1)._getValue(pixelIndex1, 6), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image._setValue(pixelIndex1, 7, value1)._getValue(pixelIndex1, 7), 'The value set and returned should be the same as value1.');

            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 0, value2)._getValue(pixelIndex2, 0), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 1, value2)._getValue(pixelIndex2, 1), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 2, value2)._getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 3, value2)._getValue(pixelIndex2, 3), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 4, value2)._getValue(pixelIndex2, 4), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 5, value2)._getValue(pixelIndex2, 5), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 6, value2)._getValue(pixelIndex2, 6), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image._setValue(pixelIndex2, 7, value2)._getValue(pixelIndex2, 7), 'The value set and returned should be the same as value2.');
        },
        'test:022-clear': function () {
            var data = new ArrayBuffer(400000),
                dataView = new Uint8ClampedArray(data),
                i,
                image;

            for (i = 0; i < 400000; i += 1) {
                dataView[i] = Math.floor(Math.random() * 255) + 1;
            }

            image = new Y.Composite.Image({
                data: data,
                dimensions: [
                    10,
                    10,
                    10,
                    10,
                    10
                ]
            });

            for (i = 0; i < 400000; i += 1) {
                Y.Assert.areNotSame(0, image._dataView[i], 'image should not contain any 0 values.');
            }

            image.clear();

            for (i = 0; i < 400000; i += 1) {
                Y.Assert.areSame(0, image._dataView[i], 'image should only contain 0 values.');
            }
        },
        'test:023-clone': function () {
            var data = new ArrayBuffer(400000),
                dataView = new Uint8ClampedArray(data),
                i,
                image0,
                image1;

            for (i = 0; i < 400000; i += 1) {
                dataView[i] = Math.floor(Math.random() * 256);
            }

            image0 = new Y.Composite.Image({
                channels: [
                    'u8',
                    's16',
                    'u8'
                ],
                data: data,
                dimensions: [
                    10,
                    10,
                    10,
                    10,
                    10
                ],
                littleEndian: true
            });
            image1 = image0.clone();

            Y.Assert.isObject(image1, 'image1 should be an object.');
            Y.Assert.isInstanceOf(Y.Composite.Image, image1, 'image1 should be an instance of Y.Composite.Image.');
            Y.Assert.areNotSame(image0, image1, 'image1 should not be the same as image0.');

            Y.ArrayAssert.itemsAreSame(image0.channels, image1.channels, 'image1.channels should be the same as image0.channels.');
            Y.ArrayAssert.itemsAreSame(image0.dimensions, image1.dimensions, 'image1.dimensions should be the same as image0.dimensions.');
            Y.Assert.areSame(image0.pixelCount, image1.pixelCount, 'image1.pixelCount should be the same as image0.pixelCount.');
            Y.ArrayAssert.itemsAreSame(image0._channelOffsets, image1._channelOffsets, 'image1._channelOffets should be the same as image0._channelOffsets.');
            Y.ArrayAssert.itemsAreSame(new Uint8ClampedArray(image0._data), new Uint8ClampedArray(image1._data), 'image1._data should be the same as image0._data.');
            Y.Assert.areSame(image0._dataType, image1._dataType, 'image1._dataType should be the same as image0._dataType.');
            Y.Assert.areSame(image0._littleEndian, image1._littleEndian, 'image1._littleEndian should be the same as image0._littleEndian.');
            Y.Assert.areSame(image0._pixelSize, image1._pixelSize, 'image1._pixelSize should be the same as image0._pixelSize.');
        },
        'test:024-eachPixelIndex': function () {
            var image = new Y.Composite.Image({
                    dimensions: [
                        10
                    ]
                }),
                pixelIndices = [];

            image.eachPixelIndex(function (pixelIndex, thisImage) {
                Y.Assert.areSame(image, thisImage, 'thisImage should be the same as image.');
                pixelIndices.push(pixelIndex);
            });

            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9
            ], pixelIndices, 'pixelIndices should be [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]');

            image = new Y.Composite.Image({
                dimensions: [
                    5,
                    5
                ]
            });
            pixelIndices = [];

            image.eachPixelIndex(function (pixelIndex, thisImage) {
                Y.Assert.areSame(image, thisImage, 'thisImage should be the same as image.');
                pixelIndices.push(pixelIndex);
            });

            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24
            ], pixelIndices, 'pixelIndices should be [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]');

            image = new Y.Composite.Image({
                dimensions: [
                    3,
                    3,
                    3
                ]
            });
            pixelIndices = [];

            image.eachPixelIndex(function (pixelIndex, thisImage) {
                Y.Assert.areSame(image, thisImage, 'thisImage should be the same as image.');
                pixelIndices.push(pixelIndex);
            });

            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26
            ], pixelIndices, 'pixelIndices should be [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]');
        },
        'test:025-eachPixelLocation': function () {
            var image = new Y.Composite.Image({
                    dimensions: [
                        10
                    ]
                }),
                pixelIndices = [],
                pixelLocations = [];

            image.eachPixelLocation(function (pixelLocation, pixelIndex, thisImage) {
                Y.Assert.areSame(image, thisImage, 'thisImage should be the same as image.');
                pixelIndices.push(pixelIndex);
                pixelLocations = pixelLocations.concat(pixelLocation);
            });

            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9
            ], pixelIndices, 'pixelIndices should be [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]');
            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9
            ], pixelLocations, 'pixelLocations should be [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]');

            image = new Y.Composite.Image({
                dimensions: [
                    5,
                    5
                ]
            });
            pixelIndices = [];
            pixelLocations = [];

            image.eachPixelLocation(function (pixelLocation, pixelIndex, thisImage) {
                Y.Assert.areSame(image, thisImage, 'thisImage should be the same as image.');
                pixelIndices.push(pixelIndex);
                pixelLocations = pixelLocations.concat(pixelLocation);
            });

            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24
            ], pixelIndices, 'pixelIndices should be [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]');
            Y.ArrayAssert.itemsAreSame([
                0,
                0,
                1,
                0,
                2,
                0,
                3,
                0,
                4,
                0,
                0,
                1,
                1,
                1,
                2,
                1,
                3,
                1,
                4,
                1,
                0,
                2,
                1,
                2,
                2,
                2,
                3,
                2,
                4,
                2,
                0,
                3,
                1,
                3,
                2,
                3,
                3,
                3,
                4,
                3,
                0,
                4,
                1,
                4,
                2,
                4,
                3,
                4,
                4,
                4
            ], pixelLocations, 'pixelLocations should be [0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 0, 1, 1, 1, 2, 1, 3, 1, 4, 1, 0, 2, 1, 2, 2, 2, 3, 2, 4, 2, 0, 3, 1, 3, 2, 3, 3, 3, 4, 3, 0, 4, 1, 4, 2, 4, 3, 4, 4, 4]');

            image = new Y.Composite.Image({
                dimensions: [
                    3,
                    3,
                    3
                ]
            });
            pixelIndices = [];
            pixelLocations = [];

            image.eachPixelLocation(function (pixelLocation, pixelIndex, thisImage) {
                Y.Assert.areSame(image, thisImage, 'thisImage should be the same as image.');
                pixelIndices.push(pixelIndex);
                pixelLocations = pixelLocations.concat(pixelLocation);
            });

            Y.ArrayAssert.itemsAreSame([
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26
            ], pixelIndices, 'pixelIndices should be [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]');
            Y.ArrayAssert.itemsAreSame([
                0,
                0,
                0,
                1,
                0,
                0,
                2,
                0,
                0,
                0,
                1,
                0,
                1,
                1,
                0,
                2,
                1,
                0,
                0,
                2,
                0,
                1,
                2,
                0,
                2,
                2,
                0,
                0,
                0,
                1,
                1,
                0,
                1,
                2,
                0,
                1,
                0,
                1,
                1,
                1,
                1,
                1,
                2,
                1,
                1,
                0,
                2,
                1,
                1,
                2,
                1,
                2,
                2,
                1,
                0,
                0,
                2,
                1,
                0,
                2,
                2,
                0,
                2,
                0,
                1,
                2,
                1,
                1,
                2,
                2,
                1,
                2,
                0,
                2,
                2,
                1,
                2,
                2,
                2,
                2,
                2
            ], pixelLocations, 'pixelLocations should be [0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1, 0, 1, 1, 0, 2, 1, 0, 0, 2, 0, 1, 2, 0, 2, 2, 0, 0, 0, 1, 1, 0, 1, 2, 0, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 0, 2, 1, 1, 2, 1, 2, 2, 1, 0, 0, 2, 1, 0, 2, 2, 0, 2, 0, 1, 2, 1, 1, 2, 2, 1, 2, 0, 2, 2, 1, 2, 2, 2, 2, 2]');
        },
        'test:026-getValueSetValue': function () {
            var dimension00,
                dimension01,
                dimension02,
                dimension03,
                dimension10,
                dimension11,
                dimension12,
                dimension13,
                dimension20,
                dimension21,
                dimension22,
                dimension23,
                image = new Y.Composite.Image({
                    channels: [
                        'f32',
                        'f32',
                        'f32'
                    ]
                }),
                pixelIndex0 = Math.floor(Math.random() * image.pixelCount),
                pixelIndex1 = Math.floor(Math.random() * image.pixelCount),
                pixelIndex2 = Math.floor(Math.random() * image.pixelCount),
                value0 = 1234.5,
                value1 = 9421.2998046875,
                value2 = 7890.10009765625;

            dimension00 = Math.floor(Math.random() * image.dimensions[0]);
            dimension01 = Math.floor(Math.random() * image.dimensions[1]);
            dimension10 = Math.floor(Math.random() * image.dimensions[0]);
            dimension11 = Math.floor(Math.random() * image.dimensions[1]);
            dimension20 = Math.floor(Math.random() * image.dimensions[0]);
            dimension21 = Math.floor(Math.random() * image.dimensions[1]);

            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 0, value0).getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01
            ], 0, value0).getValue([
                dimension00,
                dimension01
            ], 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 1, value1).getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11
            ], 1, value1).getValue([
                dimension10,
                dimension11
            ], 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 2, value2).getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21
            ], 2, value2).getValue([
                dimension20,
                dimension21
            ], 2), 'The value set and returned should be the same as value2.');

            image = new Y.Composite.Image({
                channels: [
                    'f64',
                    'f64',
                    'f64'
                ]
            });

            dimension00 = Math.floor(Math.random() * image.dimensions[0]);
            dimension01 = Math.floor(Math.random() * image.dimensions[1]);
            dimension10 = Math.floor(Math.random() * image.dimensions[0]);
            dimension11 = Math.floor(Math.random() * image.dimensions[1]);
            dimension20 = Math.floor(Math.random() * image.dimensions[0]);
            dimension21 = Math.floor(Math.random() * image.dimensions[1]);

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            value0 = Math.random();
            value1 = Math.random();
            value2 = Math.random();

            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 0, value0).getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01
            ], 0, value0).getValue([
                dimension00,
                dimension01
            ], 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 1, value1).getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11
            ], 1, value1).getValue([
                dimension10,
                dimension11
            ], 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 2, value2).getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21
            ], 2, value2).getValue([
                dimension20,
                dimension21
            ], 2), 'The value set and returned should be the same as value2.');

            image = new Y.Composite.Image({
                channels: [
                    's16',
                    's16',
                    's16'
                ]
            });

            dimension00 = Math.floor(Math.random() * image.dimensions[0]);
            dimension01 = Math.floor(Math.random() * image.dimensions[1]);
            dimension10 = Math.floor(Math.random() * image.dimensions[0]);
            dimension11 = Math.floor(Math.random() * image.dimensions[1]);
            dimension20 = Math.floor(Math.random() * image.dimensions[0]);
            dimension21 = Math.floor(Math.random() * image.dimensions[1]);

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            value0 = -34;
            value1 = -55;
            value2 = -89;

            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 0, value0).getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01
            ], 0, value0).getValue([
                dimension00,
                dimension01
            ], 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 1, value1).getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11
            ], 1, value1).getValue([
                dimension10,
                dimension11
            ], 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 2, value2).getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21
            ], 2, value2).getValue([
                dimension20,
                dimension21
            ], 2), 'The value set and returned should be the same as value2.');

            image = new Y.Composite.Image({
                channels: [
                    's32',
                    's32',
                    's32'
                ]
            });

            dimension00 = Math.floor(Math.random() * image.dimensions[0]);
            dimension01 = Math.floor(Math.random() * image.dimensions[1]);
            dimension10 = Math.floor(Math.random() * image.dimensions[0]);
            dimension11 = Math.floor(Math.random() * image.dimensions[1]);
            dimension20 = Math.floor(Math.random() * image.dimensions[0]);
            dimension21 = Math.floor(Math.random() * image.dimensions[1]);

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 0, value0).getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01
            ], 0, value0).getValue([
                dimension00,
                dimension01
            ], 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 1, value1).getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11
            ], 1, value1).getValue([
                dimension10,
                dimension11
            ], 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 2, value2).getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21
            ], 2, value2).getValue([
                dimension20,
                dimension21
            ], 2), 'The value set and returned should be the same as value2.');

            image = new Y.Composite.Image({
                channels: [
                    's8',
                    's8',
                    's8'
                ]
            });

            dimension00 = Math.floor(Math.random() * image.dimensions[0]);
            dimension01 = Math.floor(Math.random() * image.dimensions[1]);
            dimension10 = Math.floor(Math.random() * image.dimensions[0]);
            dimension11 = Math.floor(Math.random() * image.dimensions[1]);
            dimension20 = Math.floor(Math.random() * image.dimensions[0]);
            dimension21 = Math.floor(Math.random() * image.dimensions[1]);

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 0, value0).getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01
            ], 0, value0).getValue([
                dimension00,
                dimension01
            ], 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 1, value1).getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11
            ], 1, value1).getValue([
                dimension10,
                dimension11
            ], 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 2, value2).getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21
            ], 2, value2).getValue([
                dimension20,
                dimension21
            ], 2), 'The value set and returned should be the same as value2.');

            image = new Y.Composite.Image({
                channels: [
                    'u16',
                    'u16',
                    'u16'
                ]
            });

            dimension00 = Math.floor(Math.random() * image.dimensions[0]);
            dimension01 = Math.floor(Math.random() * image.dimensions[1]);
            dimension10 = Math.floor(Math.random() * image.dimensions[0]);
            dimension11 = Math.floor(Math.random() * image.dimensions[1]);
            dimension20 = Math.floor(Math.random() * image.dimensions[0]);
            dimension21 = Math.floor(Math.random() * image.dimensions[1]);

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            value0 = 34;
            value1 = 55;
            value2 = 89;

            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 0, value0).getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01
            ], 0, value0).getValue([
                dimension00,
                dimension01
            ], 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 1, value1).getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11
            ], 1, value1).getValue([
                dimension10,
                dimension11
            ], 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 2, value2).getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21
            ], 2, value2).getValue([
                dimension20,
                dimension21
            ], 2), 'The value set and returned should be the same as value2.');

            image = new Y.Composite.Image({
                channels: [
                    'u32',
                    'u32',
                    'u32'
                ]
            });

            dimension00 = Math.floor(Math.random() * image.dimensions[0]);
            dimension01 = Math.floor(Math.random() * image.dimensions[1]);
            dimension10 = Math.floor(Math.random() * image.dimensions[0]);
            dimension11 = Math.floor(Math.random() * image.dimensions[1]);
            dimension20 = Math.floor(Math.random() * image.dimensions[0]);
            dimension21 = Math.floor(Math.random() * image.dimensions[1]);

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 0, value0).getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01
            ], 0, value0).getValue([
                dimension00,
                dimension01
            ], 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 1, value1).getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11
            ], 1, value1).getValue([
                dimension10,
                dimension11
            ], 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 2, value2).getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21
            ], 2, value2).getValue([
                dimension20,
                dimension21
            ], 2), 'The value set and returned should be the same as value2.');

            image = new Y.Composite.Image({
                channels: [
                    'u8',
                    'u8',
                    'u8'
                ]
            });

            dimension00 = Math.floor(Math.random() * image.dimensions[0]);
            dimension01 = Math.floor(Math.random() * image.dimensions[1]);
            dimension10 = Math.floor(Math.random() * image.dimensions[0]);
            dimension11 = Math.floor(Math.random() * image.dimensions[1]);
            dimension20 = Math.floor(Math.random() * image.dimensions[0]);
            dimension21 = Math.floor(Math.random() * image.dimensions[1]);

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 0, value0).getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01
            ], 0, value0).getValue([
                dimension00,
                dimension01
            ], 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 1, value1).getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11
            ], 1, value1).getValue([
                dimension10,
                dimension11
            ], 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 2, value2).getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21
            ], 2, value2).getValue([
                dimension20,
                dimension21
            ], 2), 'The value set and returned should be the same as value2.');

            image = new Y.Composite.Image({
                channels: [
                    'u8',
                    'u16',
                    'u32',
                    's8',
                    's16',
                    's32',
                    'f32',
                    'f64'
                ],
                dimensions: [
                    21,
                    21,
                    21,
                    21
                ]
            });

            dimension00 = Math.floor(Math.random() * image.dimensions[0]);
            dimension01 = Math.floor(Math.random() * image.dimensions[1]);
            dimension02 = Math.floor(Math.random() * image.dimensions[2]);
            dimension03 = Math.floor(Math.random() * image.dimensions[3]);
            dimension10 = Math.floor(Math.random() * image.dimensions[0]);
            dimension11 = Math.floor(Math.random() * image.dimensions[1]);
            dimension12 = Math.floor(Math.random() * image.dimensions[2]);
            dimension13 = Math.floor(Math.random() * image.dimensions[3]);
            dimension20 = Math.floor(Math.random() * image.dimensions[0]);
            dimension21 = Math.floor(Math.random() * image.dimensions[1]);
            dimension22 = Math.floor(Math.random() * image.dimensions[2]);
            dimension23 = Math.floor(Math.random() * image.dimensions[3]);

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 0, value0).getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 1, value0).getValue(pixelIndex0, 1), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 2, value0).getValue(pixelIndex0, 2), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 3, value0).getValue(pixelIndex0, 3), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 4, value0).getValue(pixelIndex0, 4), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 5, value0).getValue(pixelIndex0, 5), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 6, value0).getValue(pixelIndex0, 6), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 7, value0).getValue(pixelIndex0, 7), 'The value set and returned should be the same as value0.');

            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 0, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 1, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 1), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 2, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 2), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 3, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 3), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 4, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 4), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 5, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 5), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 6, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 6), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 7, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 7), 'The value set and returned should be the same as value0.');

            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 0, value1).getValue(pixelIndex1, 0), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 1, value1).getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 2, value1).getValue(pixelIndex1, 2), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 3, value1).getValue(pixelIndex1, 3), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 4, value1).getValue(pixelIndex1, 4), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 5, value1).getValue(pixelIndex1, 5), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 6, value1).getValue(pixelIndex1, 6), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 7, value1).getValue(pixelIndex1, 7), 'The value set and returned should be the same as value1.');

            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 0, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 0), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 1, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 2, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 2), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 3, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 3), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 4, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 4), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 5, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 5), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 6, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 6), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 7, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 7), 'The value set and returned should be the same as value1.');

            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 0, value2).getValue(pixelIndex2, 0), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 1, value2).getValue(pixelIndex2, 1), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 2, value2).getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 3, value2).getValue(pixelIndex2, 3), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 4, value2).getValue(pixelIndex2, 4), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 5, value2).getValue(pixelIndex2, 5), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 6, value2).getValue(pixelIndex2, 6), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 7, value2).getValue(pixelIndex2, 7), 'The value set and returned should be the same as value2.');

            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 0, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 0), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 1, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 1), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 2, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 3, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 3), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 4, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 4), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 5, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 5), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 6, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 6), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 7, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 7), 'The value set and returned should be the same as value2.');

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 0, value0).getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 1, value0).getValue(pixelIndex0, 1), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 2, value0).getValue(pixelIndex0, 2), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 3, value0).getValue(pixelIndex0, 3), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 4, value0).getValue(pixelIndex0, 4), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 5, value0).getValue(pixelIndex0, 5), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 6, value0).getValue(pixelIndex0, 6), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 7, value0).getValue(pixelIndex0, 7), 'The value set and returned should be the same as value0.');

            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 0, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 1, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 1), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 2, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 2), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 3, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 3), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 4, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 4), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 5, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 5), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 6, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 6), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 7, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 7), 'The value set and returned should be the same as value0.');

            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 0, value1).getValue(pixelIndex1, 0), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 1, value1).getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 2, value1).getValue(pixelIndex1, 2), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 3, value1).getValue(pixelIndex1, 3), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 4, value1).getValue(pixelIndex1, 4), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 5, value1).getValue(pixelIndex1, 5), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 6, value1).getValue(pixelIndex1, 6), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 7, value1).getValue(pixelIndex1, 7), 'The value set and returned should be the same as value1.');

            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 0, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 0), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 1, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 2, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 2), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 3, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 3), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 4, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 4), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 5, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 5), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 6, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 6), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 7, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 7), 'The value set and returned should be the same as value1.');

            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 0, value2).getValue(pixelIndex2, 0), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 1, value2).getValue(pixelIndex2, 1), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 2, value2).getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 3, value2).getValue(pixelIndex2, 3), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 4, value2).getValue(pixelIndex2, 4), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 5, value2).getValue(pixelIndex2, 5), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 6, value2).getValue(pixelIndex2, 6), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 7, value2).getValue(pixelIndex2, 7), 'The value set and returned should be the same as value2.');

            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 0, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 0), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 1, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 1), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 2, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 3, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 3), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 4, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 4), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 5, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 5), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 6, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 6), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 7, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 7), 'The value set and returned should be the same as value2.');

            pixelIndex0 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex1 = Math.floor(Math.random() * image.pixelCount);
            pixelIndex2 = Math.floor(Math.random() * image.pixelCount);

            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 0, value0).getValue(pixelIndex0, 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 1, value0).getValue(pixelIndex0, 1), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 2, value0).getValue(pixelIndex0, 2), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 3, value0).getValue(pixelIndex0, 3), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 4, value0).getValue(pixelIndex0, 4), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 5, value0).getValue(pixelIndex0, 5), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 6, value0).getValue(pixelIndex0, 6), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue(pixelIndex0, 7, value0).getValue(pixelIndex0, 7), 'The value set and returned should be the same as value0.');

            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 0, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 0), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 1, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 1), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 2, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 2), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 3, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 3), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 4, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 4), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 5, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 5), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 6, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 6), 'The value set and returned should be the same as value0.');
            Y.Assert.areSame(value0, image.setValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 7, value0).getValue([
                dimension00,
                dimension01,
                dimension02,
                dimension03
            ], 7), 'The value set and returned should be the same as value0.');

            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 0, value1).getValue(pixelIndex1, 0), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 1, value1).getValue(pixelIndex1, 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 2, value1).getValue(pixelIndex1, 2), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 3, value1).getValue(pixelIndex1, 3), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 4, value1).getValue(pixelIndex1, 4), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 5, value1).getValue(pixelIndex1, 5), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 6, value1).getValue(pixelIndex1, 6), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue(pixelIndex1, 7, value1).getValue(pixelIndex1, 7), 'The value set and returned should be the same as value1.');

            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 0, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 0), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 1, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 1), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 2, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 2), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 3, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 3), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 4, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 4), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 5, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 5), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 6, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 6), 'The value set and returned should be the same as value1.');
            Y.Assert.areSame(value1, image.setValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 7, value1).getValue([
                dimension10,
                dimension11,
                dimension12,
                dimension13
            ], 7), 'The value set and returned should be the same as value1.');

            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 0, value2).getValue(pixelIndex2, 0), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 1, value2).getValue(pixelIndex2, 1), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 2, value2).getValue(pixelIndex2, 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 3, value2).getValue(pixelIndex2, 3), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 4, value2).getValue(pixelIndex2, 4), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 5, value2).getValue(pixelIndex2, 5), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 6, value2).getValue(pixelIndex2, 6), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue(pixelIndex2, 7, value2).getValue(pixelIndex2, 7), 'The value set and returned should be the same as value2.');

            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 0, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 0), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 1, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 1), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 2, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 2), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 3, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 3), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 4, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 4), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 5, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 5), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 6, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 6), 'The value set and returned should be the same as value2.');
            Y.Assert.areSame(value2, image.setValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 7, value2).getValue([
                dimension20,
                dimension21,
                dimension22,
                dimension23
            ], 7), 'The value set and returned should be the same as value2.');
        },
        'test:027-getDataArray': function () {
            var data = [],
                i,
                image;

            for (i = 0; i < 300; i += 1) {
                data[i] = Math.floor(Math.random() * 128);
            }

            image = new Y.Composite.Image({
                channels: [
                    'f32',
                    'f32',
                    'f32'
                ],
                data: data,
                dimensions: [
                    10,
                    10
                ]
            });

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');

            image = new Y.Composite.Image({
                channels: [
                    'f64',
                    'f64',
                    'f64'
                ],
                data: data,
                dimensions: [
                    10,
                    10
                ]
            });

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');

            image = new Y.Composite.Image({
                channels: [
                    's16',
                    's16',
                    's16'
                ],
                data: data,
                dimensions: [
                    10,
                    10
                ]
            });

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');

            image = new Y.Composite.Image({
                channels: [
                    's32',
                    's32',
                    's32'
                ],
                data: data,
                dimensions: [
                    10,
                    10
                ]
            });

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');

            image = new Y.Composite.Image({
                channels: [
                    's8',
                    's8',
                    's8'
                ],
                data: data,
                dimensions: [
                    10,
                    10
                ]
            });

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');

            image = new Y.Composite.Image({
                channels: [
                    'u16',
                    'u16',
                    'u16'
                ],
                data: data,
                dimensions: [
                    10,
                    10
                ]
            });

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');

            image = new Y.Composite.Image({
                channels: [
                    'u32',
                    'u32',
                    'u32'
                ],
                data: data,
                dimensions: [
                    10,
                    10
                ]
            });

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');

            image = new Y.Composite.Image({
                channels: [
                    'u8',
                    'u8',
                    'u8'
                ],
                data: data,
                dimensions: [
                    10,
                    10
                ]
            });

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');

            image = new Y.Composite.Image({
                channels: [
                    'f64',
                    'u32',
                    's8'
                ],
                data: data,
                dimensions: [
                    10,
                    10
                ]
            });

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');
        },
        'test:028-getPixelIndex': function () {
            var image = new Y.Composite.Image({
                dimensions: [
                    2584
                ]
            });

            Y.Assert.areSame(987, image.getPixelIndex(987), 'image.getPixelIndex(987) should be 987.');
            Y.Assert.areSame(987, image.getPixelIndex([
                987
            ]), 'image.getPixelIndex([987]) should be 987.');
            Y.Assert.areSame(377, image.getPixelIndex(377), 'image.getPixelIndex(987) should be 377.');
            Y.Assert.areSame(377, image.getPixelIndex([
                377
            ]), 'image.getPixelIndex([987]) should be 377.');
            Y.Assert.areSame(144, image.getPixelIndex(144), 'image.getPixelIndex(987) should be 144.');
            Y.Assert.areSame(144, image.getPixelIndex([
                144
            ]), 'image.getPixelIndex([987]) should be 144.');

            image = new Y.Composite.Image({
                dimensions: [
                    610,
                    610
                ]
            });

            Y.Assert.areSame(88073, image.getPixelIndex(233, 144), 'image.getPixelIndex(233, 144) should be 88073.');
            Y.Assert.areSame(88073, image.getPixelIndex([
                233,
                144
            ]), 'image.getPixelIndex([233, 144]) should be 88073.');
            Y.Assert.areSame(33639, image.getPixelIndex(89, 55), 'image.getPixelIndex(89, 55) should be 33639.');
            Y.Assert.areSame(33639, image.getPixelIndex([
                89,
                55
            ]), 'image.getPixelIndex([89, 55]) should be 33639.');
            Y.Assert.areSame(12844, image.getPixelIndex(34, 21), 'image.getPixelIndex(34, 21) should be 12844.');
            Y.Assert.areSame(12844, image.getPixelIndex([
                34,
                21
            ]), 'image.getPixelIndex([34, 21]) should be 12844.');

            Y.Assert.areSame(20761, image.getPixelIndex(21, 34), 'image.getPixelIndex(21, 34) should be 20761.');
            Y.Assert.areSame(20761, image.getPixelIndex([
                21,
                34
            ]), 'image.getPixelIndex([21, 34]) should be 20761.');
            Y.Assert.areSame(54345, image.getPixelIndex(55, 89), 'image.getPixelIndex(55, 89) should be 54345.');
            Y.Assert.areSame(54345, image.getPixelIndex([
                55,
                89
            ]), 'image.getPixelIndex([55, 89]) should be 54345.');
            Y.Assert.areSame(142274, image.getPixelIndex(144, 233), 'image.getPixelIndex(144, 233) should be 142274.');
            Y.Assert.areSame(142274, image.getPixelIndex([
                144,
                233
            ]), 'image.getPixelIndex([144, 233]) should be 142274.');

            image = new Y.Composite.Image({
                dimensions: [
                    144,
                    144,
                    144
                ]
            });

            Y.Assert.areSame(440407, image.getPixelIndex(55, 34, 21), 'image.getPixelIndex(55, 34, 21) should be 440407.');
            Y.Assert.areSame(440407, image.getPixelIndex([
                55,
                34,
                21
            ]), 'image.getPixelIndex([55, 34, 21]) should be 440407.');
            Y.Assert.areSame(167781, image.getPixelIndex(21, 13, 8), 'image.getPixelIndex(21, 13, 8) should be 167781.');
            Y.Assert.areSame(167781, image.getPixelIndex([
                21,
                13,
                8
            ]), 'image.getPixelIndex([21, 13, 8]) should be 167781.');
            Y.Assert.areSame(62936, image.getPixelIndex(8, 5, 3), 'image.getPixelIndex(8, 5, 3) should be 62936.');
            Y.Assert.areSame(62936, image.getPixelIndex([
                8,
                5,
                3
            ]), 'image.getPixelIndex([8, 5, 3]) should be 62936.');

            Y.Assert.areSame(166611, image.getPixelIndex(3, 5, 8), 'image.getPixelIndex(3, 5, 8) should be 166611.');
            Y.Assert.areSame(166611, image.getPixelIndex([
                3,
                5,
                8
            ]), 'image.getPixelIndex([3, 5, 8]) should be 166611.');
            Y.Assert.areSame(437336, image.getPixelIndex(8, 13, 21), 'image.getPixelIndex(8, 13, 21) should be 437336.');
            Y.Assert.areSame(437336, image.getPixelIndex([
                8,
                13,
                21
            ]), 'image.getPixelIndex([8, 13, 21]) should be 437336.');
            Y.Assert.areSame(1145397, image.getPixelIndex(21, 34, 55), 'image.getPixelIndex(21, 34, 55) should be 1145397.');
            Y.Assert.areSame(1145397, image.getPixelIndex([
                21,
                34,
                55
            ]), 'image.getPixelIndex([21, 34, 55]) should be 1145397.');
        },
        'test:029-getPixelValues': function () {
            var image = new Y.Composite.Image(),
                pixelValues,
                value0 = Math.floor(Math.random() * 256),
                value1 = Math.floor(Math.random() * 256),
                value2 = Math.floor(Math.random() * 256),
                value3 = Math.floor(Math.random() * 256);

            image._setValue(5230, 0, value0)._setValue(5230, 1, value1)._setValue(5230, 2, value2)._setValue(5230, 3, value3);

            pixelValues = image.getPixelValues(5230);

            Y.ArrayAssert.itemsAreSame([
                value0,
                value1,
                value2,
                value3
            ], pixelValues, 'pixelValues should match expected values.');

            pixelValues = image.getPixelValues([
                110,
                10
            ]);

            Y.ArrayAssert.itemsAreSame([
                value0,
                value1,
                value2,
                value3
            ], pixelValues, 'pixelValues should match expected values.');

            pixelValues = image.getPixelValues(5230, [
                0,
                1,
                2
            ]);

            Y.ArrayAssert.itemsAreSame([
                value0,
                value1,
                value2
            ], pixelValues, 'pixelValues should match expected values.');

            pixelValues = image.getPixelValues([
                110,
                10
            ], [
                3,
                1,
                0,
                1,
                3,
                3
            ]);

            Y.ArrayAssert.itemsAreSame([
                value3,
                value1,
                value0,
                value1,
                value3,
                value3
            ], pixelValues, 'pixelValues should match expected values.');

            image = new Y.Composite.Image({
                channels: [
                    'f64',
                    'f32',
                    's16',
                    'u8'
                ]
            });

            image._setValue(5230, 0, value0)._setValue(5230, 1, value1)._setValue(5230, 2, value2)._setValue(5230, 3, value3);

            pixelValues = image.getPixelValues(5230);

            Y.ArrayAssert.itemsAreSame([
                value0,
                value1,
                value2,
                value3
            ], pixelValues, 'pixelValues should match expected values.');

            pixelValues = image.getPixelValues([
                110,
                10
            ]);

            Y.ArrayAssert.itemsAreSame([
                value0,
                value1,
                value2,
                value3
            ], pixelValues, 'pixelValues should match expected values.');

            pixelValues = image.getPixelValues(5230, [
                0,
                1,
                2
            ]);

            Y.ArrayAssert.itemsAreSame([
                value0,
                value1,
                value2
            ], pixelValues, 'pixelValues should match expected values.');

            pixelValues = image.getPixelValues([
                110,
                10
            ], [
                3,
                1,
                0,
                1,
                3,
                3
            ]);

            Y.ArrayAssert.itemsAreSame([
                value3,
                value1,
                value0,
                value1,
                value3,
                value3
            ], pixelValues, 'pixelValues should match expected values.');
        },
        'test:030-setDataArray': function () {
            var data = [],
                i,
                image;

            for (i = 0; i < 300; i += 1) {
                data[i] = Math.floor(Math.random() * 128);
            }

            image = new Y.Composite.Image({
                channels: [
                    'f32',
                    'f32',
                    'f32'
                ],
                dimensions: [
                    10,
                    10
                ]
            }).setDataArray(data);

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');

            image = new Y.Composite.Image({
                channels: [
                    'f64',
                    'f64',
                    'f64'
                ],
                dimensions: [
                    10,
                    10
                ]
            }).setDataArray(data);

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');

            image = new Y.Composite.Image({
                channels: [
                    's16',
                    's16',
                    's16'
                ],
                dimensions: [
                    10,
                    10
                ]
            }).setDataArray(data);

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');

            image = new Y.Composite.Image({
                channels: [
                    's32',
                    's32',
                    's32'
                ],
                dimensions: [
                    10,
                    10
                ]
            }).setDataArray(data);

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');

            image = new Y.Composite.Image({
                channels: [
                    's8',
                    's8',
                    's8'
                ],
                dimensions: [
                    10,
                    10
                ]
            }).setDataArray(data);

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');

            image = new Y.Composite.Image({
                channels: [
                    'u16',
                    'u16',
                    'u16'
                ],
                dimensions: [
                    10,
                    10
                ]
            }).setDataArray(data);

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');

            image = new Y.Composite.Image({
                channels: [
                    'u32',
                    'u32',
                    'u32'
                ],
                dimensions: [
                    10,
                    10
                ]
            }).setDataArray(data);

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');

            image = new Y.Composite.Image({
                channels: [
                    'u8',
                    'u8',
                    'u8'
                ],
                dimensions: [
                    10,
                    10
                ]
            }).setDataArray(data);

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');

            image = new Y.Composite.Image({
                channels: [
                    'f64',
                    'u32',
                    's8'
                ],
                dimensions: [
                    10,
                    10
                ]
            }).setDataArray(data);

            Y.ArrayAssert.itemsAreSame(data, image.getDataArray(), 'image.getDataArray() should be the same as data.');
        },
        'test:031-setPixelValues': function () {
            var image = new Y.Composite.Image(),
                pixelValues,
                value0 = Math.floor(Math.random() * 256),
                value1 = Math.floor(Math.random() * 256),
                value2 = Math.floor(Math.random() * 256),
                value3 = Math.floor(Math.random() * 256);

            image.setPixelValues(5230, [
                value0,
                value1,
                value2,
                value3
            ]);

            pixelValues = image.getPixelValues(5230);

            Y.ArrayAssert.itemsAreSame([
                value0,
                value1,
                value2,
                value3
            ], pixelValues, 'pixelValues should match expected values.');

            image.clear().setPixelValues([
                110,
                10
            ], [
                value0,
                value1,
                value2,
                value3
            ]);

            pixelValues = image.getPixelValues(5230);

            Y.ArrayAssert.itemsAreSame([
                value0,
                value1,
                value2,
                value3
            ], pixelValues, 'pixelValues should match expected values.');

            image.clear().setPixelValues(5230, [
                value0,
                value1,
                value2,
                value3
            ], [
                0,
                1,
                2
            ]);

            pixelValues = image.getPixelValues(5230);

            Y.ArrayAssert.itemsAreSame([
                value0,
                value1,
                value2,
                0
            ], pixelValues, 'pixelValues should match expected values.');

            image.clear().setPixelValues([
                110,
                10
            ], [
                value0,
                value1,
                value2,
                value3,
                value2,
                value2
            ], [
                3,
                1,
                0,
                1,
                3,
                3
            ]);

            pixelValues = image.getPixelValues(5230);

            Y.ArrayAssert.itemsAreSame([
                value2,
                value3,
                0,
                value2
            ], pixelValues, 'pixelValues should match expected values.');

            image = new Y.Composite.Image({
                channels: [
                    'f64',
                    'f32',
                    's16',
                    'u8'
                ]
            });

            image.setPixelValues(5230, [
                value0,
                value1,
                value2,
                value3
            ]);

            pixelValues = image.getPixelValues(5230);

            Y.ArrayAssert.itemsAreSame([
                value0,
                value1,
                value2,
                value3
            ], pixelValues, 'pixelValues should match expected values.');

            image.clear().setPixelValues([
                110,
                10
            ], [
                value0,
                value1,
                value2,
                value3
            ]);

            pixelValues = image.getPixelValues(5230);

            Y.ArrayAssert.itemsAreSame([
                value0,
                value1,
                value2,
                value3
            ], pixelValues, 'pixelValues should match expected values.');

            image.clear().setPixelValues(5230, [
                value0,
                value1,
                value2,
                value3
            ], [
                0,
                1,
                2
            ]);

            pixelValues = image.getPixelValues(5230);

            Y.ArrayAssert.itemsAreSame([
                value0,
                value1,
                value2,
                0
            ], pixelValues, 'pixelValues should match expected values.');

            image.clear().setPixelValues([
                110,
                10
            ], [
                value0,
                value1,
                value2,
                value3,
                value2,
                value2
            ], [
                3,
                1,
                0,
                1,
                3,
                3
            ]);

            pixelValues = image.getPixelValues(5230);

            Y.ArrayAssert.itemsAreSame([
                value2,
                value3,
                0,
                value2
            ], pixelValues, 'pixelValues should match expected values.');
        },
        'test:032-toJSON': function () {
            var data = new ArrayBuffer(400000),
                dataView = new Uint8ClampedArray(data),
                i,
                image0,
                image1;

            for (i = 0; i < 400000; i += 1) {
                dataView[i] = Math.floor(Math.random() * 256);
            }

            image0 = new Y.Composite.Image({
                channels: [
                    'u8',
                    's16',
                    'u8'
                ],
                data: data,
                dimensions: [
                    10,
                    10,
                    10,
                    10,
                    10
                ]
            });
            image1 = new Y.Composite.Image(image0.toJSON());

            Y.Assert.isObject(image1, 'image1 should be an object.');
            Y.Assert.isInstanceOf(Y.Composite.Image, image1, 'image1 should be an instance of Y.Composite.Image.');
            Y.Assert.areNotSame(image0, image1, 'image1 should not be the same as image0.');

            Y.ArrayAssert.itemsAreSame(image0.channels, image1.channels, 'image1.channels should be the same as image0.channels.');
            Y.ArrayAssert.itemsAreSame(image0.dimensions, image1.dimensions, 'image1.dimensions should be the same as image0.dimensions.');
            Y.Assert.areSame(image0.pixelCount, image1.pixelCount, 'image1.pixelCount should be the same as image0.pixelCount.');
            Y.ArrayAssert.itemsAreSame(image0._channelOffsets, image1._channelOffsets, 'image1._channelOffets should be the same as image0._channelOffsets.');
            Y.ArrayAssert.itemsAreSame(new Uint8ClampedArray(image0._data), new Uint8ClampedArray(image1._data), 'image1._data should be the same as image0._data.');
            Y.Assert.areSame(image0._dataType, image1._dataType, 'image1._dataType should be the same as image0._dataType.');
            Y.Assert.areSame(image0._littleEndian, image1._littleEndian, 'image1._littleEndian should be the same as image0._littleEndian.');
            Y.Assert.areSame(image0._pixelSize, image1._pixelSize, 'image1._pixelSize should be the same as image0._pixelSize.');

            image0 = new Y.Composite.Image({
                channels: [
                    'u8',
                    's16',
                    'u8'
                ],
                data: data,
                dimensions: [
                    10,
                    10,
                    10,
                    10,
                    10
                ],
                littleEndian: true
            });
            image1 = new Y.Composite.Image(image0.toJSON());

            Y.Assert.isObject(image1, 'image1 should be an object.');
            Y.Assert.isInstanceOf(Y.Composite.Image, image1, 'image1 should be an instance of Y.Composite.Image.');
            Y.Assert.areNotSame(image0, image1, 'image1 should not be the same as image0.');

            Y.ArrayAssert.itemsAreSame(image0.channels, image1.channels, 'image1.channels should be the same as image0.channels.');
            Y.ArrayAssert.itemsAreSame(image0.dimensions, image1.dimensions, 'image1.dimensions should be the same as image0.dimensions.');
            Y.Assert.areSame(image0.pixelCount, image1.pixelCount, 'image1.pixelCount should be the same as image0.pixelCount.');
            Y.ArrayAssert.itemsAreSame(image0._channelOffsets, image1._channelOffsets, 'image1._channelOffets should be the same as image0._channelOffsets.');
            Y.ArrayAssert.itemsAreSame(new Uint8ClampedArray(image0._data), new Uint8ClampedArray(image1._data), 'image1._data should be the same as image0._data.');
            Y.Assert.areSame(image0._dataType, image1._dataType, 'image1._dataType should be the same as image0._dataType.');
            Y.Assert.areSame(image0._littleEndian, image1._littleEndian, 'image1._littleEndian should be the same as image0._littleEndian.');
            Y.Assert.areSame(image0._pixelSize, image1._pixelSize, 'image1._pixelSize should be the same as image0._pixelSize.');
        },
        'test:033-toString': function () {
            var image = new Y.Composite.Image();

            Y.Assert.areSame('image[512x512] u8,u8,u8,u8', image.toString(), 'image.toString() should be \'image[512x512]u8,u8,u8,u8\'');

            image = new Y.Composite.Image({
                channels: [
                    'f32',
                    'f64',
                    's16',
                    's32',
                    's8',
                    'u16',
                    'u32',
                    'u8'
                ],
                dimensions: [
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8
                ]
            });

            Y.Assert.areSame('image[2x3x4x5x6x7x8] f32,f64,s16,s32,s8,u16,u32,u8', image.toString(), 'image.toString() should be \'image[2x3x4x5x6x7x8] f32,f64,s16,s32,s8,u16,u32,u8\'');
        },
        'test:034-validate': function () {
            var image = new Y.Composite.Image();

            Y.Assert.isTrue(image.validate(), 'image.validate() should be true.');
            Y.Assert.isTrue(image.validate(image._data), 'image.validate(image._data) should be true.');
            Y.Assert.isTrue(image.validate(new ArrayBuffer(image.pixelCount * image._pixelSize)), 'image.validate(new ArrayBuffer(image.pixelCount * image._pixelSize)) should be true.');
            Y.Assert.isFalse(image.validate(new ArrayBuffer(21)), 'image.validate(new ArrayBuffer(21)) should be false.');
            Y.Assert.isFalse(image.validate([0, 1, 2, 3, 4, 5]), 'image.validate([0, 1, 2, 3, 4, 5]) should be false.');
        },
        _should: {
            ignore: {
                'test:001-apiExists': !arrayBufferExists || !u8Exists,
                'test:002-_getDataViewConstructor': !(dataViewExists && f32Exists && f64Exists && s16Exists && s32Exists && s8Exists && u16Exists && u32Exists && u8Exists),
                'test:003-_getDataView': !(arrayBufferExists && dataViewExists && f32Exists && f64Exists && s16Exists && s32Exists && s8Exists && u16Exists && u32Exists && u8Exists),
                'test:004-_getTypeName': false,
                'test:005-constructor-channels-f32': !f32Exists,
                'test:006-constructor-channels-f64': !f64Exists,
                'test:007-constructor-channels-s16': !s16Exists,
                'test:008-constructor-channels-s32': !s32Exists,
                'test:009-constructor-channels-s8': !s8Exists,
                'test:010-constructor-channels-u16': !u16Exists,
                'test:011-constructor-channels-u32': !u32Exists,
                'test:012-constructor-channels-u8': !u8Exists,
                'test:013-constructor-channels-mixed': !dataViewExists,
                'test:014-constructor-dimensions-1': !u8Exists,
                'test:015-constructor-dimensions-2': !u8Exists,
                'test:016-constructor-dimensions-3': !u8Exists,
                'test:017-constructor-dimensions-4': !u8Exists,
                'test:018-constructor-data': !arrayBufferExists || !u8Exists,
                'test:019-constructor-littleEndian': !u8Exists,
                'test:020-_getPixelIndex': !u8Exists,
                'test:021-_getValue_setValue': !(f32Exists && f64Exists && s16Exists && s32Exists && s8Exists && u16Exists && u32Exists && u8Exists),
                'test:022-clear': !arrayBufferExists || !u8Exists,
                'test:023-clone': !arrayBufferExists || !u8Exists,
                'test:024-eachPixelIndex': !u8Exists,
                'test:025-eachPixelLocation': !u8Exists,
                'test:026-getValueSetValue': !(f32Exists && f64Exists && s16Exists && s32Exists && s8Exists && u16Exists && u32Exists && u8Exists),
                'test:027-getDataArray': !(f32Exists && f64Exists && s16Exists && s32Exists && s8Exists && u16Exists && u32Exists && u8Exists),
                'test:028-getPixelIndex': !u8Exists,
                'test:029-getPixelValues': !u8Exists,
                'test:030-setDataArray': !(f32Exists && f64Exists && s16Exists && s32Exists && s8Exists && u16Exists && u32Exists && u8Exists),
                'test:031-setPixelValues': !u8Exists,
                'test:032-toJSON': !arrayBufferExists || !u8Exists,
                'test:033-toString': !u8Exists,
                'test:034-validate': !arrayBufferExists || !u8Exists
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