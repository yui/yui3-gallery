/**
 * This module provides convenient client side access to YQL's crypto functions.
 * @module gallery-yql-crypto
 */

(function (Y) {
    'use strict';
    
    var _base64Decode = Y.Base64.decode,
        _execute,
        _getResult,
        _hash,
        _hmac,
        _bind = Y.bind,
        _toHex;
    
    _execute = function (code, callbackFunction, params, opts) {
        Y.YQL("SELECT * FROM execute WHERE code = '" + code.replace(/'/g, '\\\'') + "'", callbackFunction, params, opts);
    };
    
    _getResult = function (result) {
        result = result && result.query;
        result = result && result.results;
        return result && result.result;
    };
    
    _hash = function (hash, string, callbackFunction, params, opts) {
        _execute('response.object = y.crypto.encode' + hash + '("' + String(string || '').replace(/"/g, '\\"') + '");', function (result) {
            callbackFunction(_toHex(_base64Decode(_getResult(result))));
        }, params, opts);
    };
    
    _hmac = function (hash, string, secret, callbackFunction, params, opts) {
        _execute('response.object = y.crypto.encode' + hash + '("' + String(secret || '').replace(/"/g, '\\"') + '", "' + String(string || '').replace(/"/g, '\\"') + '");', function (result) {
            callbackFunction(_toHex(_base64Decode(_getResult(result))));
        }, params, opts);
    };
    
    _toHex = function (string) {
        var hex = '',
            i,
            length,
            value;

        for (i = 0, length = string.length; i < length; i += 1) {
            value = string.charCodeAt(i).toString(16);

            if (value.length < 2) {
                value = '0' + value;
            }

            hex += value;
        }
        
        return hex;
    };
    
    /**
     * @class YQLCrypto
     * @static
     */
    Y.YQLCrypto = {
        /**
         * This method wraps the YQL execute data table which executes inline Javascript on the YQL server.
         * YQL Server side Javascript documentation is here: http://developer.yahoo.com/yql/guide/yql-javascript-objects.html
         * @method execute
         * @param {String} code Javascript code to execute on the YQL server. 
         * @param {Function} callbackFunction Passes through to Y.YQL.
         * @param {Object} params (optional) Passes through to Y.YQL.
         * @param {Object} opts (optional) Passes through to Y.YQL.
         */
        execute: _execute,
        /**
         * Generates a sha1 hash-based message authentication code.
         * @method hmacSha1
         * @param {String} string The message to hash.
         * @param {String} secret The secret key.
         * @param {Function} callbackFunction  The result value is the only parameter.
         * @param {Object} params (optional) Passes through to Y.YQL.
         * @param {Object} opts (optional) Passes through to Y.YQL.
         */
        hmacSha1: _bind(_hmac, null, 'HmacSHA1'),
        /**
         * Generates a sha256 hash-based message authentication code.
         * @method hmacSha256
         * @param {String} string The message to hash.
         * @param {String} secret The secret key.
         * @param {Function} callbackFunction  The result value is the only parameter.
         * @param {Object} params (optional) Passes through to Y.YQL.
         * @param {Object} opts (optional) Passes through to Y.YQL.
         */
        hmacSha256: _bind(_hmac, null, 'HmacSHA256'),
        /**
         * Generates an md5 hash.
         * @method md5
         * @param {String} string The message to hash.
         * @param {Function} callbackFunction  The result value is the only parameter.
         * @param {Object} params (optional) Passes through to Y.YQL.
         * @param {Object} opts (optional) Passes through to Y.YQL.
         */
        md5: _bind(_hash, null, 'Md5'),
        /**
         * Generates a sha1 hash.
         * @method sha1
         * @param {String} string The message to hash.
         * @param {Function} callbackFunction  The result value is the only parameter.
         * @param {Object} params (optional) Passes through to Y.YQL.
         * @param {Object} opts (optional) Passes through to Y.YQL.
         */
        sha1: _bind(_hash, null, 'Sha'),
        /**
         * Generates a universally unique identifier.
         * @method uuid
         * @param {Function} callbackFunction  The result value is the only parameter.
         * @param {Object} params (optional) Passes through to Y.YQL.
         * @param {Object} opts (optional) Passes through to Y.YQL.
         */
        uuid: function (callbackFunction, params, opts) {
            _execute('response.object = y.crypto.uuid();', function (result) {
                callbackFunction(_getResult(result));
            }, params, opts);
        }
    };
}(Y));