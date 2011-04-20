YUI.add('gallery-audio', function(Y) {

'use strict';

var _playable = {};

(function (modernizr) {
    if (modernizr) {
        if (modernizr.audio) {
            _playable.m4a = modernizr.audio.m4a;
            _playable.mp3 = modernizr.audio.mp3;
            _playable.ogg = modernizr.audio.ogg;
            _playable.wav = modernizr.audio.wav;
        }
        return;
    }

    var audioElement = Y.config.doc.createElement('audio');

    if (!audioElement.canPlayType) {
        return;
    }

    _playable.m4a = audioElement.canPlayType('audio/x-m4a;') || audioElement.canPlayType('audio/aac;');
    _playable.mp3 = audioElement.canPlayType('audio/mpeg;');
    _playable.ogg = audioElement.canPlayType('audio/ogg; codecs="vorbis"');
    _playable.wav = audioElement.canPlayType('audio/wav; codecs="1"');
}(Y.Modernizr || Y.config.win.Modernizr));

Y.Audio = {
    create: function (config) {
        config = config || {};

        var format,
            formats = config.format || [
                'ogg',
                'mp3',
                'm4a',
                'wav'
            ],
            i,
            length,
            playable,
            source = config.baseUrl || '',
            testFormat;

        if (Y.Lang.isArray(formats)) {
            for (i = 0, length = formats.length; i < length; i += 1) {
                testFormat = formats[i];
                playable = _playable[testFormat];

                if (!playable) {
                    continue;
                }

                if (playable === 'probably') {
                    format = testFormat;
                    break;
                }

                if (!format) {
                    format = testFormat;
                }
            }

            if (format) {
                source += '.' + format;
            }
        } else if (Y.Lang.isObject(formats)) {
            for (testFormat in formats) {
                if (formats.hasOwnProperty(testFormat)) {
                    playable = _playable[testFormat];

                    if (!playable) {
                        continue;
                    }

                    if (playable === 'probably') {
                        format = testFormat;
                        break;
                    }

                    if (!format) {
                        format = testFormat;
                    }
                }
            }

            if (format) {
                source += formats[format];
            }
        } else {
            return null;
        }

        if (!format) {
            return null;
        }

        return Y.Node.create('<audio ' + (config.autoplay ? 'autoplay="true" ' : '') + (config.controls ? 'controls="true"' : '') + (config.loop ? 'loop="true"' : '') + ' preload="' + (config.preload ? config.preload : 'auto') + '" src="' + source + '" />');
    }
};


}, 'gallery-2011.04.06-19-44' ,{requires:['node'], optional:['gallery-modernizr']});
