#!/usr/bin/env node

// Sanity checks for pathogen-encoded combo urls!

var args = process.argv.slice(2),

    comboBase = args[0],

    lib = {
        http:   require('http'),
        url:    require('url'),
        async:  require('async')
    },

    FILTER = {
        js:     ['', 'raw', 'min', 'debug'],
        css:    ['', 'raw', 'min']
    },

    FRAGMENTS = {
        js: {
            // Multiple versions of the same group type:
            'core+3.12.0-beta-1+yui;core+3.12.0+yui': [
                'http://yui.yahooapis.com/3.12.0-beta-1/build/yui/yui',
                'http://yui.yahooapis.com/3.12.0/build/yui/yui'
            ],
            'gallery+2013.09.04-21-56+pathogen-encoder;gallery+2013.08.07-20-34+bitly': [
                'http://yui.yahooapis.com/gallery-2013.09.04-21-56/build/gallery-pathogen-encoder/gallery-pathogen-encoder',
                'http://yui.yahooapis.com/gallery-2013.08.07-20-34/build/gallery-bitly/gallery-bitly'
            ],
            's+os/mit/td/ape-applet-0.0.61+af-applet-editview;s+os/mit/td/td-applet-weather-0.0.95+td-applet-weather-appletmodel': [
                'http://l.yimg.com/os/mit/td/ape-applet-0.0.61/af-applet-editview/af-applet-editview',
                'http://l.yimg.com/os/mit/td/td-applet-weather-0.0.95/td-applet-weather-appletmodel/td-applet-weather-appletmodel'
            ],

            // More than one module in each group:
            'core+3.12.0+yui,widget-base': [
                'http://yui.yahooapis.com/3.12.0/build/yui/yui',
                'http://yui.yahooapis.com/3.12.0/build/widget-base/widget-base'
            ],
            'gallery+2013.09.04-21-56+pathogen-encoder,bitly': [
                'http://yui.yahooapis.com/gallery-2013.09.04-21-56/build/gallery-pathogen-encoder/gallery-pathogen-encoder',
                'http://yui.yahooapis.com/gallery-2013.09.04-21-56/build/gallery-bitly/gallery-bitly'
            ],
            's+os/mit/td/ape-applet-0.0.61+af-applet-headerview,af-applet-editview': [
                'http://l.yimg.com/os/mit/td/ape-applet-0.0.61/af-applet-headerview/af-applet-headerview',
                'http://l.yimg.com/os/mit/td/ape-applet-0.0.61/af-applet-editview/af-applet-editview'
            ],
            'os/mit/td/ape-applet-0.0.61/af-applet-headerview/af-applet-headerview;os/mit/td/ape-applet-0.0.61/af-applet-editview/af-applet-editview': [
                'http://l.yimg.com/os/mit/td/ape-applet-0.0.61/af-applet-headerview',
                'http://l.yimg.com/os/mit/td/ape-applet-0.0.61/af-applet-editview'
            ],

            // Short groups
            'c+3.12.0+yui,widget-base;g+2013.09.04-21-56+pathogen-encoder,bitly;s+os/mit/td/ape-applet-0.0.61+af-applet-headerview,af-applet-editview;os/mit/td/ape-applet-0.0.61+af-applet-editview/af-applet-editview': [
                'http://yui.yahooapis.com/3.12.0/build/yui/yui',
                'http://yui.yahooapis.com/3.12.0/build/widget-base/widget-base',
                'http://yui.yahooapis.com/gallery-2013.09.04-21-56/build/gallery-pathogen-encoder/gallery-pathogen-encoder',
                'http://yui.yahooapis.com/gallery-2013.09.04-21-56/build/gallery-bitly/gallery-bitly',
                'http://l.yimg.com/os/mit/td/ape-applet-0.0.61/af-applet-headerview/af-applet-headerview',
                'http://l.yimg.com/os/mit/td/ape-applet-0.0.61/af-applet-editview/af-applet-editview'
            ],

            // All together now:
            'core+3.12.0+yui,widget-base;gallery+2013.09.04-21-56+pathogen-encoder,bitly;s+os/mit/td/ape-applet-0.0.61+af-applet-headerview,af-applet-editview;os/mit/td/ape-applet-0.0.61/af-applet-editview/af-applet-editview': [
                'http://yui.yahooapis.com/3.12.0/build/yui/yui',
                'http://yui.yahooapis.com/3.12.0/build/widget-base/widget-base',
                'http://yui.yahooapis.com/gallery-2013.09.04-21-56/build/gallery-pathogen-encoder/gallery-pathogen-encoder',
                'http://yui.yahooapis.com/gallery-2013.09.04-21-56/build/gallery-bitly/gallery-bitly',
                'http://l.yimg.com/os/mit/td/ape-applet-0.0.61/af-applet-headerview/af-applet-headerview',
                'http://l.yimg.com/os/mit/td/ape-applet-0.0.61/af-applet-editview/af-applet-editview'
            ],
            // lang
            'core+3.12.0+lang/autocomplete-list_en': [
                'http://yui.yahooapis.com/3.12.0/autocomplete-list/lang/autocomplete-list_en.js'
            ],
            // lang bundle bug where a language tag was required
            'core+3.12.0+lang/autocomplete-list': [
                'http://yui.yahooapis.com/3.12.0/autocomplete-list/lang/autocomplete-list.js'
            ]
        },
        css: {
            // Core css:
            'core+3.12.0+cssreset': [
                'http://yui.yahooapis.com/3.12.0/build/cssreset/cssreset-min'
            ],

            // Skin css:
            'core+3.12.0+skin-sam-datatable-base': [
                'http://yui.yahooapis.com/3.12.0/build/datatable-base/assets/skins/sam/datatable-base.css'
            ],
            'core+3.12.0+skin-night-datatable-base': [
                'http://yui.yahooapis.com/3.12.0/build/datatable-base/assets/skins/night/datatable-base.css'
            ],

            // App css:
            's+os/mit/td/stencil-0.1.111+stencil-theme-001': [
                'http://l.yimg.com/os/mit/td/stencil-0.1.111/stencil-theme-001/stencil-theme-001'
            ],
            's+os/mit/td/stencil-0.1.111+stencil-css': [
                'http://l.yimg.com/os/mit/td/stencil-0.1.111/stencil-css/stencil-css'
            ],

            // Path css
            'os/mit/td/stencil-0.1.111/stencil-css/stencil-css': [
                'http://l.yimg.com/os/mit/td/stencil-0.1.111/stencil-css/stencil-css'
            ],

            // Multiple versions of the same group type:
            'core+3.12.0+cssreset;core+3.12.0-beta-1+cssgrids': [
                'http://yui.yahooapis.com/3.12.0/build/cssreset/cssreset',
                'http://yui.yahooapis.com/3.12.0-beta-1/build/cssgrids/cssgrids'
            ],
            'core+3.12.0+skin-sam-datatable-base;core+3.12.0-beta-1+skin-night-datatable-base': [
                'http://yui.yahooapis.com/3.12.0/build/datatable-base/assets/skins/sam/datatable-base.css',
                'http://yui.yahooapis.com/3.12.0-beta-1/build/datatable-base/assets/skins/night/datatable-base.css'
            ],
            's+os/mit/td/stencil-0.1.111+stencil-theme-001;s+os/mit/td/stencil-0.1.112+stencil-css': [
                'http://l.yimg.com/os/mit/td/stencil-0.1.111/stencil-theme-001/stencil-theme-001',
                'http://l.yimg.com/os/mit/td/stencil-0.1.112/stencil-css/stencil-css'
            ],

            // More than one module in each group:
            'core+3.12.0+cssreset,cssgrids': [
                'http://yui.yahooapis.com/3.12.0/build/cssreset/cssreset',
                'http://yui.yahooapis.com/3.12.0/build/cssgrids/cssgrids'
            ],
            'core+3.12.0+skin-sam-datatable-base,skin-night-datatable-base': [
                'http://yui.yahooapis.com/3.12.0/build/datatable-base/assets/skins/sam/datatable-base.css',
                'http://yui.yahooapis.com/3.12.0/build/datatable-base/assets/skins/night/datatable-base.css'
            ],
            's+os/mit/td/stencil-0.1.111+stencil-theme-001,stencil-css': [
                'http://l.yimg.com/os/mit/td/stencil-0.1.111/stencil-theme-001/stencil-theme-001',
                'http://l.yimg.com/os/mit/td/stencil-0.1.111/stencil-css/stencil-css'
            ],
            'os/mit/td/stencil-0.1.111/stencil-theme-001/stencil-theme-001;os/mit/td/stencil-0.1.111/stencil-css/stencil-css': [
                'http://l.yimg.com/os/mit/td/stencil-0.1.111/stencil-theme-001/stencil-theme-001',
                'http://l.yimg.com/os/mit/td/stencil-0.1.111/stencil-css/stencil-css'
            ],

            // All together now:
            'core+3.12.0+cssreset,skin-sam-console,cssgrids;s+os/mit/td/stencil-0.1.111+stencil-theme-001;os/mit/td/stencil-0.1.111/stencil-css/stencil-css': [
                'http://yui.yahooapis.com/3.12.0/build/cssreset/cssreset',
                'http://yui.yahooapis.com/3.12.0/build/console/assets/skins/sam/console.css',
                'http://yui.yahooapis.com/3.12.0/build/cssgrids/cssgrids',
                'http://l.yimg.com/os/mit/td/stencil-0.1.111/stencil-theme-001/stencil-theme-001',
                'http://l.yimg.com/os/mit/td/stencil-0.1.111/stencil-css/stencil-css'
            ]
        }
    },

    jobs = [],

    successes = [],
    failures  = [];


['/cc/p', '/check/cc/p'].forEach(function (path) {
    ['js', 'css'].forEach(function (type) {
        var fragments   = FRAGMENTS[type],
            filters     = FILTER[type];

        filters.forEach(function (f) {
            // `filter` will be an empty string when we want to test the case
            // where it defaults to 'min'; otherwise, it will be '.raw',
            // '.debug', or '.min'.
            var filter  = f ? '.' + f : '',
                fragment;

            for (fragment in fragments) {
                if (fragments.hasOwnProperty(fragment)) {
                    jobs.push((function (path, fragment, filter) {
                        return function (callback) {
                            var base    = comboBase + path,
                                combo   = base + '/' + fragment + filter + '.' + type,
                                options = lib.url.parse(combo);

                            options.agent = false;

                            lib.http.get(options, function (res) {
                                if (res.statusCode === 200) {
                                    console.log('✔', combo);
                                    successes.push(combo);
                                    return callback();
                                } else {
                                    console.log('✘', combo);
                                    failures.push(combo);
                                    return callback('statusCode !== 200');
                                }
                            }).on('error', function (err) {
                                console.log('✘', combo);
                                failures.push(combo);
                                return callback(err);
                            });
                        };
                    }(path, fragment, filter)));
                }
            }
        });
    });
});

lib.async.series(jobs, function () {
    console.log('Done testing with ' + successes.length + ' successes and ' + failures.length + ' failures');
    if (failures.length) {
        console.log(JSON.stringify(failures, null, 4));
    }
});

var secureCombo = comboBase + '/cc/p/core+3.12.0+yui.js?secure=1';
lib.http.get(secureCombo)
    .on('response', function (res) {
        var buffer = [];

        if (!res.headers.expires || !res.headers['cache-control']) {
            console.log('✘', 'Cache headers are not set correctly');
            process.exit(1);
        }

        res.on('data', function (chunk) {
            buffer.push(chunk);
        });

        res.on('end', function () {
            var body = Buffer.concat(buffer).toString('utf8');
            if (body.indexOf('https://yui-s') === -1) {
                console.log('✘', 'Failed to include ssl assets');
                process.exit(1);
            } else {
                console.log('✔', 'Successfully included ssl assets');
            }

            console.log(body);
        });
    }).on('error', function (err) {
        console.log('✘', secureCombo);
        console.log('There was an error making the request: ' + err.message);
        process.exit(1);
    });
