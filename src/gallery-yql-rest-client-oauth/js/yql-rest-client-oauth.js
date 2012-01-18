/**
 * This module is a REST client supporting OAuth signatures.
 * @module gallery-yql-rest-client-oauth
 */

(function (Y) {
    'use strict';
    
    var _do = Y.Do,
        _DoPrevent = _do.Prevent,
        _yqlRestClient = Y.YQLRESTClient,
    
        _buildAuthorizationHeader,
        _each = Y.each,
        _encode,
        _floor = Math.floor,
        _hmacSha1_b64 = Y.YQLCrypto.hmacSha1_b64,
        _map = Y.Array.map,
        _normalizeParameters,
        _now = Y.Lang.now,
        _random = Math.random,
        _randomString,
        _request = _yqlRestClient.request;
    
    _do.before(function (params, callbackFunction, yqlParams, yqlOpts) {
        params = params || {};
        
        var oAuth = params.oAuth,
            oAuthConsumer,
            oAuthParams = {},
            oAuthSignatureMethod,
            oAuthToken,
            
            buildSecret,
            setAuthorizationHeader;
        
        if (!oAuth) {
            return;
        }
        
        buildSecret = function () {
            return _encode(oAuthConsumer.secret) + '&' + _encode(oAuthToken.secret);
        };
        
        setAuthorizationHeader = function (oAuthSignature) {
            oAuthParams.oauth_signature = oAuthSignature;
            params.headers = params.headers || {};
            params.headers.Authorization = _buildAuthorizationHeader(oAuthParams);
        };
        
        oAuthConsumer = oAuth.consumer || {};
        oAuthParams.oauth_consumer_key = oAuthConsumer.key || '';
        oAuthSignatureMethod = oAuth.signatureMethod;
        oAuthParams.oauth_signature_method = oAuthSignatureMethod;
        oAuthToken = oAuth.token || {};
        oAuthParams.oauth_token = oAuthToken.key || '';
        
        if (oAuthToken.verifier) {
            oAuthParams.oauth_verifier = oAuthToken.verifier;
        }
        
        oAuthParams.oauth_version = '1.0';
        
        switch (oAuthSignatureMethod) {
            case 'HMAC-SHA1':
                oAuthParams.oauth_nonce = _randomString();
                oAuthParams.oauth_timestamp = _floor(_now() / 1000);
                _hmacSha1_b64([
                    _encode(params.method.toUpperCase()),
                    // url scheme and host must be lowercase.
                    // default port numbers must not be included.
                    _encode(params.url),
                    _encode(_normalizeParameters(params.content, oAuthParams, params.query))
                ].join('&'), buildSecret(), function (oAuthSignature) {
                    setAuthorizationHeader(oAuthSignature);
                    _request(params, callbackFunction, yqlParams, yqlOpts);
                }, null, {
                    proto: 'https'
                });
                return new _DoPrevent('asynchronous');
            case 'PLAINTEXT':
                setAuthorizationHeader(buildSecret());
                return;
            default:
                throw 'Unknown OAuth Signature Method';
        }
    }, _yqlRestClient, 'request');
    
    _buildAuthorizationHeader = function (oAuthParams) {
        var authorizationHeader = [];
        _each(oAuthParams, function (value, key) {
            authorizationHeader.push(_encode(key) + '="' + _encode(value));
        });
        return 'OAuth '+ authorizationHeader.join('",') + '"';
    };
    
    _encode = function (string) {
        if (!string) {
            return '';
        }
        
        return encodeURIComponent(string).replace(/(\!)|(\')|(\()|(\))|(\*)/g, function (character) {
            return '%' + character.charCodeAt(0).toString(16).toUpperCase();
        });
    };
    
    _normalizeParameters = function (content, oAuthParams, query) {
        var params = [];
        
        _each([
            content,
            oAuthParams,
            query
        ], function (paramObject) {
            _each(paramObject, function (value, key) {
                params.push([
                    _encode(key),
                    _encode(value)
                ]);
            });
        });
        
        params.sort(function (a, b) {
            if (a[0] < b[0]) {
                return -1;
            }
            if (a[0] > b[0]) {
                return 1;
            }
            if (a[1] < b[1]) {
                return -1;
            }
            if (a[1] > b[1]) {
                return 1;
            }
            return 0;
        });
        
        params = _map(params, function (param) {
            return param.join('=');
        });
        
        return params.join('&');
    };
    
    _randomString = function () {
        return _random().toString(32).substr(2);
    };
}(Y));