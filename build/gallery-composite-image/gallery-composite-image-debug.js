YUI.add('gallery-composite-image', function(Y) {

(function (Y) {
    'use strict';

    /**
     * @module gallery-composite-image
     */

    var _namespace = Y.namespace('Composite'),

        _getGetAtFunction,
        _getGetPixelIndexFunction,

        _class;

    /**
     * Image Class
     * @class Image
     * @constructor
     * @extends Base
     * @namespace Composite
     * @param {Object} config Configuration Object.
     */

    _class = function (config) {
        _class.superclass.constructor.call(this, config);
    };

    _class.ATTRS = {
        /**
         * Defines the color space for the image.
         *
         * An image can have as many channels as needed.  3 or 4 channels is
         * most common.  Usually the first channel is the red color component,
         * the second is green, the third is blue, and the fourth is alpha.
         *
         * There are various ways to represent the value of a channel.
         * Values can either be stored as integers or floating-point numbers.
         * Values may be constrained within a minimum and maximum value.
         *
         * Most commonly red, green, and blue channels are represented by
         * integers between 0 and 255.  In this case the values 0, 0, 0
         * represent black and the values 255, 255, 255 represent white.
         *
         * The alpha channel is commonly stored as a floating-point value from 0
         * to 1.  1 represents a completely visible pixel while 0 is completely
         * transparent.
         *
         * Values are not required to be constrained.  For example, sometimes it
         * is interesting or useful to store colors which have brightness beyond
         * white.
         *
         * This attribute should be set to an array of objects.  This array
         * represents the channels in order.  This array should have at least
         * one element.  This should not be a sparse array.  Each object must
         * have a mode property.  The mode property must be set to either 'f'
         * for floating-point values or 'i' for integer values.  Each object may
         * include the optional maximum and/or minimum properties.  Each object
         * may include the optional blackValue and/or whiteValue properties.  If
         * undefined, blackValue will default to 0 and whiteValue will default
         * to 255 when mode is set to 'i' or 1 otherwise.
         * 
         * @attribute channels
         * @default [
         *     {maximum: 255, minimum: 0, mode:'i'},
         *     {maximum: 255, minimum: 0, mode:'i'},
         *     {maximum: 255, minimum: 0, mode:'i'},
         *     {maximum: 1, minimum: 0, mode:'f'}
         * ]
         * @type Array
         * @writeOnce
         */
        channels: {
            value: [{
                maximum: 255,
                minimum: 0,
                mode: 'i'
            }, {
                maximum: 255,
                minimum: 0,
                mode: 'i'
            }, {
                maximum: 255,
                minimum: 0,
                mode: 'i'
            }, {
                maximum: 1,
                minimum: 0,
                mode: 'f'
            }],
            writeOnce: 'initOnly'
        },
        /**
         * Defines the pixel dimensions of the image.
         *
         * An image can have as many dimensions as needed.  2 dimensions is most
         * common.  Usually the first dimension is width and the second is
         * height.
         *
         * @attribute dimensions
         * @default [512, 512]
         * @type Array
         * @writeOnce
         */
        dimensions: {
            value: [
                512,
                512
            ],
            writeOnce: 'initOnly'
        },
        /**
         * Contains the number of pixels in the image.
         * @attribute pixelCount
         * @readOnly
         * @type Number
         */
        pixelCount: {
            readOnly: true
        }
    };

    _class.NAME = 'Composite-Image';

    Y.extend(_class, Y.Base, {
        /**
         * Clears the image.
         * This method is chainable.
         * @method clear
         * @chainable
         */
        clear: function () {
            var me = this,
                pixelData = [];
            
            pixelData.length = me._pixelData.length;
            
            me._pixelData = pixelData;

            return me;
        },
        /**
         * Returns a new identical image.
         * @method clone
         * @return {Object}
         */
        clone: function () {
            var me = this,
                other = new _class({
                    channels: me.get('channels'),
                    dimensions: me.get('dimensions')
                });

            other._pixelData = me._pixelData.slice();

            return other;
        },
        /**
         * Invokes a function for each pixel in the image.
         * This method is chainable.
         * @method eachPixel
         * @chainable
         * @param {Object} pixelParameters This object contains the following
         * members
         * <ul>
         *     <li>
         *         ctx - Object - Optional scope with which to call fn.
         *     </li>
         *     <li>
         *         fn - Function - This function is invoked once per pixel.
         *         This function will receive an object with the following
         *         parameters
         *         <ul>
         *             <li>
         *                 at - Array of image pixel coordinates.
         *             </li>
         *             <li>
         *                 chs - Array of image channel definitions.
         *             </li>
         *             <li>
         *                 dims - Array of image dimension lengths.
         *             </li>
         *             <li>
         *                 img - Reference to this image.
         *             </li>
         *             <li>
         *                 pch - Array of pixel channel indices.
         *             </li>
         *             <li>
         *                 pcnt - Number of pixels in this image.
         *             </li>
         *             <li>
         *                 pix - Integer index of this pixel.
         *             </li>
         *             <li>
         *                 pxl - Array of pixel channel values.
         *             </li>
         *         </ul>
         *         If this function returns true, eachPixel will stop and ignore
         *         the remaining pixels.
         *     </li>
         *     <li>
         *         pch - Array - Optional array of channel indexes.  If
         *         undefined, pixels will contain all channels in order.
         *     </li>
         * </ul>
         * @param {Function} callbackFunction This function is invoked after the
         * function has been invoked for each pixel in the image.  This function
         * will receive an object with the following members
         * <ul>
         *     <li>
         *         chs - Array of image channel definitions.
         *     </li>
         *     <li>
         *         dims - Array of image dimension lengths.
         *     </li>
         *     <li>
         *         img - Reference to this image.
         *     </li>
         *     <li>
         *         pcnt - Number of pixels in this image.
         *     </li>
         *     <li>
         *         pix - The last integer pixel index processed.  If eachPixel
         *         was not stopped early, this value should be equal to pcnt and
         *         not a valid pixel index.
         *     </li>
         * </ul>
         * @param {Object} contextObject Optional scope with which to call the
         * callback function.
         */
        eachPixel: function (pixelParameters, callbackFunction, contextObject) {
            var ctx = pixelParameters.ctx,
                fn = pixelParameters.fn,
                me = this,
                pixelChannels = pixelParameters.pch,
                pixelCount = me.get('pixelCount'),
            
                channels = Y.clone(me.get('channels')),
                dimensions = me.get('dimensions').slice(),
                getAt = _getGetAtFunction.apply(me, dimensions),

                thisPixel;

            thisPixel = function (pixelIndex) {
                if (pixelIndex >= pixelCount) {
                    callbackFunction.call(contextObject, {
                        chs: channels,
                        dims: dimensions,
                        img: this,
                        pcnt: pixelCount,
                        pix: pixelIndex
                    });
                    return;
                }

                Y.later(0, this, function () {
                    var at = getAt(pixelIndex),
                        me = this;

                    if (fn.call(ctx, {
                        at: at,
                        chs: channels,
                        dims: dimensions,
                        img: me,
                        pch: pixelChannels,
                        pcnt: pixelCount,
                        pix: pixelIndex,
                        pxl: me.getPixel(at, pixelChannels)
                    })) {
                        callbackFunction.call(contextObject, {
                            chs: channels,
                            dims: dimensions,
                            img: me,
                            pcnt: pixelCount,
                            pix: pixelIndex
                        });
                    } else {
                        thisPixel.call(me, pixelIndex + 1);
                    }
                });
            };

            thisPixel.call(me, 0);
            return me;
        },
        /**
         * Converts a pixel index to an at array.
         * @method getAt
         * @param {Number} pixelIndex
         * @return {Array}
         */
        getAt: function (pixelIndex) {
            return _getGetAtFunction.apply(this, this.get('dimensions'))(pixelIndex);
        },
        /**
         * Accessor method to get a pixel from the image.
         * @method getPixel
         * @param {Array} at Array containing pixel coordinates.  The length of
         * this array should match the number of dimensions of the image.
         * @param {Array} pixelChannels Optional array of channel indexes.  If
         * undefined, returned pixel will contain all channels in order.
         * @return {Array}
         */
        getPixel: function (at, pixelChannels) {
            var me = this,
                pixelData = me._pixelData,
                pixelDataIndex,

                channelsLength = me.get('channels.length');

            pixelDataIndex = _getGetPixelIndexFunction.apply(me, me.get('dimensions'))(at) * channelsLength;

            if (pixelChannels) {
                return (function (pixelData, pixelDataIndex) {
                    var i,
                        pixel = [],
                        pixelChannelsLength;

                    for (i = 0, pixelChannelsLength = pixelChannels.length; i < pixelChannelsLength; i += 1) {
                        pixel[i] = pixelData[pixelDataIndex + pixelChannels[i]];
                    }

                    return pixel;
                }(pixelData, pixelDataIndex));
            }

            return pixelData.slice(pixelDataIndex, pixelDataIndex + channelsLength);
        },
        /**
         * Converts an at array to a pixel index.
         * @method getPixelIndex
         * @param {Array} at
         * @return {Number}
         */
        getPixelIndex: function (at) {
            return _getGetPixelIndexFunction.apply(this, this.get('dimensions'))(at);
        },
        initializer: function () {
            var me = this,

                channels = me.get('channels'),
                dimensions = me.get('dimensions'),
                pixelCount = 1,
                pixelData = [];

            if (!channels.length) {
                throw 'Image must have at least one channel.';
            }

            if (!dimensions.length) {
                throw 'Image must have at least one dimension.';
            }

            Y.each(channels, function (channel) {
                channel.blackValue = channel.blackValue || 0;
                channel.whiteValue = channel.whiteValue || (channel.mode === 'i' ? 255 : 1);
            });

            Y.each(dimensions, function (dimension) {
                if (dimension <= 0) {
                    throw 'Dimension must have at least 1 pixel.';
                }

                pixelCount *= dimension;
            });

            me._set('pixelCount', pixelCount);

            pixelData.length = pixelCount * channels.length;
            
            this._pixelData = pixelData;
        },
        /**
         * Accessor method to set a pixel in the image.
         * This method is chainable.
         * @method setPixel
         * @chainable
         * @param {Array} at Array containing pixel coordinates.  The length of
         * this array should match the number of dimensions of the image.
         * @param {Array} pixel Array containing the pixel's channel values.
         * @param {Array} pixelChannels Optional array of channel indexes.  If
         * undefined, the given pixel is assumed to contain all channels in
         * order.
         */
        setPixel: function (at, pixel, pixelChannels) {
            var i,
                me = this,
                pixelChannelsLength,
                pixelData = me._pixelData,
                pixelDataIndex,

                channels = me.get('channels'),
                channelsLength = channels.length;

            pixelDataIndex = _getGetPixelIndexFunction.apply(me, me.get('dimensions'))(at) * channelsLength;

            if (pixelChannels) {
                for (i = 0, pixelChannelsLength = pixelChannels.length; i < pixelChannelsLength; i += 1) {
                    pixelData[pixelDataIndex + pixelChannels[i]] = _class.conformChannelValue(pixel[i], channels[pixelChannels[i]]);
                }
            } else {
                for (i = 0; i < channelsLength; i += 1) {
                    pixelData[pixelDataIndex + i] = _class.conformChannelValue(pixel[i], channels[i]);
                }
            }

            return this;
        }
    }, {
        /**
         * Conforms the given value to the channel's specifications.
         * @method conformChannelValue
         * @param {Number} value
         * @param {Object} channel
         * @return {Number}
         * @static
         */
        conformChannelValue: function (value, channel) {
            value = +value || 0;

            if (channel.maximum) {
                value = Math.min(value, channel.maximum);
            }

            if (channel.minimum) {
                value = Math.max(value, channel.minimum);
            }

            if (channel.mode === 'i') {
                value = Math.round(value);
            }

            return value;
        }
    });

    /**
     * Call this function with the length of each dimension followed by the
     * number of channels.  Returns a function which accepts a pixel index and
     * returns an at array.
     * @method _getGetAtFunction
     * @private
     * @return Function
     */
    _getGetAtFunction = Y.cached(function () {
        var dimensionLengths = arguments,
            floor = Math.floor,

            dimensionsLength = dimensionLengths.length;

        return Y.cached(function (pixelIndex) {
            var at = [
                    pixelIndex % dimensionLengths[0]
                ],
                i,
                j,
                product;

            for (i = 1; i < dimensionsLength; i += 1) {
                product = 1;

                for (j = 0; j < i; j += 1) {
                    product *= dimensionLengths[j];
                }

                at[i] = floor(pixelIndex / product) % i;
            }

            return at;
        });
    });

    /**
     * Call this function with the length of each dimension.
     * Returns a function which accepts dimension indices and returns a pixel
     * index.
     * @method _getGetPixelIndexFunction
     * @private
     * @return Function
     */
    _getGetPixelIndexFunction = Y.cached(function () {
        var dimensionLengths = arguments,

            dimensionsLength = dimensionLengths.length;

        return Y.cached(function () {
            var dimensionIndices = arguments,
                i,
                index = 0,
                j,
                offset;

            for (i = 0; i < dimensionsLength; i += 1) {
                offset = dimensionIndices[i];

                for (j = i - 1; j > 0; j -= 1) {
                    offset *= dimensionLengths[j];
                }

                index += offset;
            }

            return index;
        });
    });

    _namespace.Image = _class;
}(Y));


}, 'gallery-2012.06.20-20-07' ,{requires:['base'], skinnable:false});
