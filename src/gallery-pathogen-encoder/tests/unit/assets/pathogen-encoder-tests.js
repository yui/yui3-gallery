YUI.add('pathogen-encoder-tests', function (Y) {
    var suite   = new Y.Test.Suite('Pathogen Encoder Tests'),
        Assert  = Y.Assert,

        NAMESPACE       = 'p/',
        GROUP_DELIM     = ';',
        SUB_GROUP_DELIM = '+',
        MODULE_DELIM    = ',',

        TYPES = ['js', 'css'],

        customComboBase;

    suite.add(new Y.Test.Case({
        name: 'Test Basic URL Formatting',

        setUp: function () {
            Y.config.customComboBase = 'http://combo.yuilibrary.com/';
            customComboBase = Y.config.customComboBase + NAMESPACE;
        },

        'test basic formatting for core only': function () {
            var loader = new Y.Loader({
                    combine: true,
                    ignoreRegistered: true,
                    require: ['datatable']
                }),
                resolved = loader.resolve(true),

                type,
                urls,
                groups,
                subgroups,
                modules,
                len,
                i;

            for (i = 0, len = TYPES.length; i < len; i += 1) {
                type = TYPES[i];
                urls = resolved[type];
                Assert.areEqual(1, urls.length, 'There should only be one ' + type + ' combo url');

                path   = urls[0].split(customComboBase).pop();
                groups = path.split(GROUP_DELIM);
                Assert.areEqual(1, groups.length, 'There should only be one group of ' + type + ' modules');

                subgroups = groups[0].split(SUB_GROUP_DELIM);
                Assert.areEqual(3, subgroups.length, 'There should only be three subgroups');
                Assert.areEqual('c', subgroups[0], 'Unexpected core identifier');
                Assert.isTrue(/^\d+\.\d+\.\d+/.test(subgroups[1]), 'Unexpected core version');

                modules = subgroups.pop().split(MODULE_DELIM);
                Assert.isTrue(modules.length > 0, 'Missing modules in the ' + type + ' combo url');
            }
        },

        'test basic formatting for gallery only': function () {
            var loader = new Y.Loader({
                    combine: true,
                    ignoreRegistered: true,
                    require: ['gallery-pathogen-encoder', 'gallery-bitly'],
                    modules: {
                        'gallery-pathogen-encoder': {
                            group: 'gallery'
                        },
                        'gallery-bitly': {
                            group: 'gallery'
                        }
                    }
                }),
                resolved = loader.resolve(true),

                urls,
                groups,
                subgroups,
                modules;

            urls = resolved.js;
            Assert.areEqual(1, urls.length, 'Unexpected number of urls');

            path   = urls[0].split(customComboBase).pop();
            groups = path.split(GROUP_DELIM);
            Assert.areEqual(1, groups.length, 'Unexpected number of groups');

            subgroups = groups[0].split(SUB_GROUP_DELIM);
            Assert.areEqual(3, subgroups.length, 'Unexpected number of subgroups');
            Assert.areEqual('g', subgroups[0], 'Unexpected gallery identifier');
            Assert.areEqual('2013.08.07-20-34', subgroups[1], 'Unexpected gallery version');

            modules = subgroups.pop().split(MODULE_DELIM);
            Assert.areEqual(2, modules.length, 'Unexpected number of modules');
        },

        'test basic formatting for root path groups': function () {
            var loader = new Y.Loader({
                    combine: true,
                    require: ['af-poll', 'af-dom', 'af-pageviz'],

                    groups: {
                        'ape-af': {
                            comboBase: 'http://l.yimg.com/zz/combo?',
                            root: 'os/mit/td/ape-af-0.0.38/',
                            combine: true
                        }
                    },

                    modules: {
                        'af-poll': {
                            group: 'ape-af',
                            requires: [
                                'af-pageviz'
                            ]
                        },
                        'af-dom': {
                            group: 'ape-af',
                            requires: [
                                'node-base',
                                'node-core'
                            ]
                        },
                        'af-pageviz': {
                            group: 'ape-af',
                            requires: [
                                'event-custom-base',
                                'event-custom-complex'
                            ]
                        }
                    }
                }),
                resolved = loader.resolve(true),

                urls,
                groups,
                subgroups,
                modules;

            urls = resolved.js;
            Assert.areEqual(1, urls.length, 'Unexpected number of urls');

            path   = urls[0].split(customComboBase).pop();
            groups = path.split(GROUP_DELIM);
            Assert.areEqual(1, groups.length, 'Unexpected number of groups');

            subgroups = groups[0].split(SUB_GROUP_DELIM);
            Assert.areEqual(3, subgroups.length, 'Unexpected number of subgroups');
            Assert.areEqual('s', subgroups[0], 'Unexpected group id');
            Assert.areEqual('os/mit/td/ape-af-0.0.38', subgroups[1], 'Unexpected root');

            modules = subgroups.pop().split(MODULE_DELIM);
            Assert.areEqual(3, modules.length, 'Unexpected number of modules');
        },

        'test basic formatting for fullpath groups': function () {
            var loader = new Y.Loader({
                    combine: true,
                    require: ['mod-a', 'mod-b', 'mod-c'],

                    groups: {
                        'awesome-group-name': {
                            comboBase: 'http://l.yimg.com/zz/combo?',
                            root: '/',
                            combine: true
                        }
                    },

                    modules: {
                        'mod-a': {
                            group: 'awesome-group-name',
                            path: 'path/to/file/mod-a-min.js'
                        },
                        'mod-b': {
                            group: 'awesome-group-name',
                            path: 'path/to/file/1234567.js'
                        },
                        'mod-c': {
                            group: 'awesome-group-name',
                            path: 'path/to/file/mod-c-debug.js'
                        }
                    }
                }),
                resolved = loader.resolve(true),

                urls,
                subgroups,
                groups;

            urls = resolved.js;
            Assert.areEqual(1, urls.length, 'Unexpected number of urls');

            path   = urls[0].split(customComboBase).pop();
            path   = path.replace(/\.js$/, '');
            groups = path.split(GROUP_DELIM);
            Assert.areEqual(3, groups.length, 'Unexpected number of groups');

            subgroups = groups.shift().split(SUB_GROUP_DELIM);
            Assert.areEqual(1, subgroups.length, 'Unexpected number of subgroups');
            Assert.areEqual('path/to/file/1234567', subgroups[0], 'Unexpected path');

            subgroups = groups.shift().split(SUB_GROUP_DELIM);
            Assert.areEqual(1, subgroups.length, 'Unexpected number of subgroups');
            Assert.areEqual('path/to/file/mod-a-min', subgroups[0], 'Unexpected path');

            subgroups = groups.shift().split(SUB_GROUP_DELIM);
            Assert.areEqual(1, subgroups.length, 'Unexpected number of subgroups');
            Assert.areEqual('path/to/file/mod-c-debug', subgroups[0], 'Unexpected path');
        },

        'test root configuration support for path groups': function () {
            var loader = new Y.Loader({
                    combine: true,
                    require: ['kamen'],

                    groups: {
                        'gaim': {
                            comboBase: 'http://yui.yahooapis.com/combo?',
                            root: 'budo/',
                            combine: true
                        }
                    },

                    modules: {
                        kamen: {
                            group: 'gaim',
                            path: 'why/not/grape.js'
                        }
                    }
                }),
                resolved = loader.resolve(true);

            Assert.areEqual('http://combo.yuilibrary.com/p/budo/why/not/grape.js', resolved.js[0], 'Unexpected combo url');
        }

    }));

    suite.add(new Y.Test.Case({
        name: 'Test Complex URL Formatting',

        setUp: function () {
            Y.config.customComboBase = 'http://combo.yuilibrary.com/';
            customComboBase = Y.config.customComboBase + NAMESPACE;
        },

        'test formatting for groups: core + gallery + shifter + fullpath': function () {
            var loader = new Y.Loader({
                    combine: true,
                    ignoreRegistered: true,

                    require: [
                        'yui-base',
                        'gallery-pathogen-encoder',
                        'af-poll',
                        'af-dom',
                        'af-pageviz',
                        'kamen',
                        'rider',
                        'wizard'
                    ],

                    groups: {
                        'ape-af': {
                            comboBase: 'http://l.yimg.com/zz/combo?',
                            root: 'os/mit/td/ape-af-0.0.38/',
                            combine: true
                        },
                        'shabadoobie-touch-henshin': {
                            comboBase: 'http://l.yimg.com/zz/combo?',
                            root: '/',
                            combine: true
                        }
                    },

                    modules: {
                        'gallery-pathogen-encoder': {
                            group: 'gallery'
                        },
                        'gallery-bitly': {
                            group: 'gallery'
                        },
                        'af-poll': {
                            group: 'ape-af',
                            requires: [
                                'af-pageviz'
                            ]
                        },
                        'af-dom': {
                            group: 'ape-af',
                            requires: [
                                'node-base',
                                'node-core'
                            ]
                        },
                        'af-pageviz': {
                            group: 'ape-af',
                            requires: [
                                'event-custom-base',
                                'event-custom-complex'
                            ]
                        },
                        kamen: {
                            group: 'shabadoobie-touch-henshin',
                            path: 'a/b/c.js'
                        },
                        rider: {
                            group: 'shabadoobie-touch-henshin',
                            path: 'aa/bb/cc.js'
                        },
                        wizard: {
                            group: 'shabadoobie-touch-henshin',
                            path: 'aaa/bbb/ccc.js'
                        }
                    }
                }),
                resolved = loader.resolve(true),

                urls,
                groups,
                subgroups,
                modules;

            urls = resolved.js;
            Assert.areEqual(1, urls.length, 'Unexpected number of urls');

            path   = urls[0].split(customComboBase).pop();
            groups = path.split(GROUP_DELIM);
            Assert.areEqual(6, groups.length, 'Unexpected number of groups');

            subgroups = groups[0].split(SUB_GROUP_DELIM);
            Assert.areEqual(1, subgroups.length, 'Unexpected number of subgroups');
            Assert.areEqual('a/b/c', subgroups[0], 'Unexpected module group');

            subgroups = groups[1].split(SUB_GROUP_DELIM);
            Assert.areEqual(1, subgroups.length, 'Unexpected number of subgroups');
            Assert.areEqual('aa/bb/cc', subgroups[0], 'Unexpected module group');

            subgroups = groups[2].split(SUB_GROUP_DELIM);
            Assert.areEqual(1, subgroups.length, 'Unexpected number of subgroups');
            Assert.areEqual('aaa/bbb/ccc', subgroups[0], 'Unexpected module group');

            subgroups = groups[3].split(SUB_GROUP_DELIM);
            Assert.areEqual(3, subgroups.length, 'Unexpected number of subgroups');
            Assert.areEqual('c', subgroups[0], 'Unexpected group id');
            Assert.isTrue(/^\d+\.\d+\.\d+/.test(subgroups[1]), 'Unexpected core version');

            modules = subgroups.pop().split(MODULE_DELIM);
            Assert.isTrue(modules.length > 0, 'Unexpected number of modules');

            subgroups = groups[4].split(SUB_GROUP_DELIM);
            Assert.areEqual(3, subgroups.length, 'Unexpected number of subgroups');
            Assert.areEqual('g', subgroups[0], 'Unexpected group id');
            Assert.areEqual('2013.08.07-20-34', subgroups[1], 'Unexpected gallery version');

            modules = subgroups.pop().split(MODULE_DELIM);
            Assert.isTrue(modules.length > 0, 'Unexpected number of modules');

            subgroups = groups[5].split(SUB_GROUP_DELIM);
            Assert.areEqual(3, subgroups.length, 'Unexpected number of subgroups');
            Assert.areEqual('s', subgroups[0], 'Unexpected group id');

            modules = subgroups.pop().split(MODULE_DELIM);
            Assert.isTrue(modules.length > 0, 'Unexpected number of modules');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Test Fallback Mode',

        setUp: function () {
            Y.config.customComboBase = 'http://combo.yuilibrary.com/';
        },

        'test fallback mode off by default': function () {
            var loader = new Y.Loader({
                    combine: true,
                    require: ['gallery-bitly'],
                    modules: {
                        'gallery-bitly': {
                            group: 'gallery'
                        }
                    }
                }),
                resolved;

            resolved = loader.resolve(true);
            Assert.isUndefined(loader.pathogenSeen, 'Pathogen should not keep track of seen modules');
            Assert.areEqual('http://combo.yuilibrary.com/p/g+2013.08.07-20-34+bitly.js', resolved.js[0], 'Unexpected combo url');

            resolved = loader.resolve(true);
            Assert.isUndefined(loader.pathogenSeen, 'Pathogen should not keep track of seen modules');
            Assert.areEqual('http://combo.yuilibrary.com/p/g+2013.08.07-20-34+bitly.js', resolved.js[0], 'hello');
        },

        'test fallback mode for gallery': function () {
            var loader,
                resolved;

            Y.config.customComboFallback = true;

            loader = new Y.Loader({
                combine: true,
                require: ['gallery-bitly'],
                modules: {
                    'gallery-bitly': {
                        group: 'gallery'
                    }
                }
            });
            Assert.isUndefined(loader.pathogenSeen, 'Pathogen should not keep track of seen modules yet');

            resolved = loader.resolve(true);
            Assert.isTrue(loader.pathogenSeen['gallery-bitly'], 'Pathogen should be keeping track of seen modules');
            Assert.areEqual('http://combo.yuilibrary.com/p/g+2013.08.07-20-34+bitly.js', resolved.js[0], 'Unexpected combo url');

            resolved = loader.resolve(true);
            Assert.areEqual(
                'http://yui.yahooapis.com/combo?gallery-2013.08.07-20-34/build/gallery-bitly/gallery-bitly-min.js',
                resolved.js[0],
                'Should have fallen back to default combo url'
            );
        },

        'test fallback mode for core': function () {
            var loader,
                resolved;

            Y.config.customComboFallback = true;

            loader = new Y.Loader({
                combine: true,
                ignoreRegistered: true,
                require: ['oop']
            });
            Assert.isUndefined(loader.pathogenSeen, 'Pathogen should not keep track of seen modules yet');

            resolved = loader.resolve(true);
            Assert.isTrue(loader.pathogenSeen.oop, 'Pathogen should have seen the oop module');
            Assert.isTrue(loader.pathogenSeen['yui-base'], 'Pathogen should have seen the yui-base module');
            Assert.areEqual('http://combo.yuilibrary.com/p/c+' + Y.version + '+oop,yui-base.js', resolved.js[0], 'Unexpected combo url');

            resolved = loader.resolve(true);
            Assert.areEqual(
                'http://yui.yahooapis.com/combo?' + Y.version + '/yui-base/yui-base-min.js&' + Y.version + '/oop/oop-min.js',
                resolved.js[0],
                'Should have fallen back to default combo url'
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Test fullpath compression feature',

        setUp: function () {
            Y.config.fullpathCompression = true;
            Y.config.customComboBase = 'http://combo.yuilibrary.com/';
        },

        'test fullpath compression off by default': function () {
            var modules = {},
                resolved,
                loader,
                paths;

            paths = [
                'eu/ai/tora.js',
                'eu/ai/maru.js',
                'eu/ai/yui.js'
            ];

            paths.forEach(function (path) {
                modules[path] = {
                    group: 'eu',
                    path: path
                };
            });

            Y.config.fullpathCompression = undefined;
            loader = new Y.Loader({
                combine: true,
                require: paths,
                groups: {
                    'eu': {
                        comboBase: 'http://l.yimg.com/zz/combo?',
                        root: '/',
                        combine: true
                    }
                },
                modules: modules
            });

            resolved = loader.resolve(true);
            Assert.areEqual(
                'http://combo.yuilibrary.com/p/eu/ai/maru;eu/ai/tora;eu/ai/yui.js',
                resolved.js[0],
                'Fullpath compression should be off by default'
            );

        },

        'test fullpath compression (simple)': function () {
            var modules = {},
                resolved,
                loader,
                paths;

            paths = [
                'eu/ai/tora.js',
                'eu/ai/maru.js',
                'eu/ai/yui.js'
            ];

            paths.forEach(function (path) {
                modules[path] = {
                    group: 'eu',
                    path: path
                };
            });

            loader = new Y.Loader({
                combine: true,
                require: paths,
                groups: {
                    'eu': {
                        comboBase: 'http://l.yimg.com/zz/combo?',
                        root: '/',
                        combine: true
                    }
                },
                modules: modules
            });

            resolved = loader.resolve(true);
            Assert.areEqual(
                'http://combo.yuilibrary.com/p/eu/ai+maru,tora,yui.js',
                resolved.js[0],
                'Fullpath compression did not work as expected'
            );
        },

        'test fullpath compression (complex)': function () {
            var paths = [
                'os/mit/media/p/content/interest-manager-min-1351823.js',
                'os/mit/media/m/content_social/content-social-base-min-1496800.js',
                'os/mit/media/m/content_social/content-share-buttons-int-min-1544525.js',
                'os/mit/media/p/content/ad-controller-min-1545585.js',
                'os/mit/media/m/content_photo/carousel-min-1458021.js',
                'os/mit/media/m/comments/content-comments-min-1546415.js',
                'os/mit/media/p/content/content-manager-min-1544454.js',
                'os/mit/media/p/content/content-discoverer-min-1446986.js',
                'os/mit/media/m/content_photo/content-ss-base-min-1545584.js',
                'os/mit/media/p/content/request-manager-min-1544454.js',
                'os/mit/media/p/content/perf-timeable-min-1191658.js',
                'os/mit/media/p/content/instrumentation-min-1214752.js',
                'os/mit/media/p/content/pane-manager-min-1544454.js',
                'os/mit/media/p/content/next-scroll-min-1304262.js',
                'os/mit/media/m/content_photo/content-ss-no-sv-min-1545584.js',
                'os/mit/media/p/content/precog-manager-min-1483059.js',
                'ss/strip_3.2.js',
                'os/mit/media/m/sports/super-hero-min-1490675.js',
                'os/mit/media/p/content/tag-manager-min-1294559.js',
                'os/mit/td/mjata-0.4.3/mjata-lazy-modellist/mjata-lazy-modellist-min.js',
                'os/mit/td/ape-location-0.0.5/af-locations/af-locations-min.js',
                'os/mit/td/ape-location-0.0.5/ape-location-templates-location-list/ape-location-templates-location-list-min.js',
                'os/mit/td/ape-location-0.0.5/ape-location-templates-location-panel/ape-location-templates-location-panel-min.js',
                'os/mit/td/ape-location-0.0.5/af-location-panel/af-location-panel-min.js',
                'os/mit/td/ape-af-0.0.95/af-pageviz/af-pageviz-min.js',
                'os/mit/td/ape-af-0.0.95/af-poll/af-poll-min.js',
                'os/mit/td/stencil-0.1.156/stencil-bquery/stencil-bquery-min.js',
                'os/mit/td/stencil-0.1.156/stencil-swiper/stencil-swiper-min.js',
                'os/mit/td/stencil-0.1.156/stencil-carousel/stencil-carousel-min.js',
                'os/mit/td/stencil-0.1.156/stencil-fx/stencil-fx-min.js',
                'os/mit/td/stencil-0.1.156/stencil-fx-collapse/stencil-fx-collapse-min.js',
                'kx/yucs/uh3s/uh/28/js/uh-min.js',
                'kx/yucs/uh3s/uh/27/js/menu_handler-min.js',
                'kx/yucs/uh3s/uh/8/js/gallery-jsonp-min.js',
                'kx/yucs/uh3s/uh/26/js/logo_debug-min.js',
                'kx/yucs/uh3s/uh/26/js/timestamp_library-min.js',
                'kx/yucs/uh3s/top_bar/js/5/top_bar-min.js',
                'kx/yucs/uh3s/search/js/16/search-min.js',
                'kx/yucs/uh3s/help/js/6/help_menu_v3-min.js',
                'kx/yucs/uh3/location/js/7/uh_locdrop-min.js'
            ],
            modules = {},
            resolved,
            loader,
            groups,
            urls;

            paths.forEach(function (path) {
                modules[path] = {
                    group: 'foo',
                    path: path
                };
            });

            loader = new Y.Loader({
                combine: true,
                require: paths,
                groups: {
                    'foo': {
                        comboBase: 'http://l.yimg.com/zz/combo?',
                        root: '/',
                        combine: true
                    }
                },
                modules: modules
            });

            resolved = loader.resolve(true);

            urls = resolved.js;
            Assert.areEqual(2, urls.length, 'Unexpected number of urls');

            path   = urls[0].split(customComboBase).pop();
            groups = path.split(GROUP_DELIM);
            Assert.areEqual(5, groups.length, 'Unexpected number of groups');

            path   = urls[1].split(customComboBase).pop();
            groups = path.split(GROUP_DELIM);
            Assert.areEqual(4, groups.length, 'Unexpected number of groups');
        },

        'test prefix tree compression efficiency (1)': function () {
            var modules = {},
                twoGroups,
                oneGroup,
                resolved,
                loader;

            // oneGroup is shorter here
            oneGroup  = 'http://combo.yuilibrary.com/p/foobar+a/maru,a/ryo,a/tora,b/maru,b/ryo.js';
            twoGroups = 'http://combo.yuilibrary.com/p/foobar/a+maru,ryo,tora;foobar/b+maru,ryo.js';

            paths = [
                'foobar/a/tora.js',
                'foobar/a/maru.js',
                'foobar/a/ryo.js',
                'foobar/b/maru.js',
                'foobar/b/ryo.js'
            ];

            paths.forEach(function (path) {
                modules[path] = {
                    group: 'foobar',
                    path: path
                };
            });

            loader = new Y.Loader({
                combine: true,
                require: paths,
                groups: {
                    'foobar': {
                        comboBase: 'http://l.yimg.com/zz/combo?',
                        root: '/',
                        combine: true
                    }
                },
                modules: modules
            });

            resolved = loader.resolve(true);
            Assert.areEqual(oneGroup, resolved.js[0]);
        },

        'test prefix tree compression efficiency (2)': function () {
            var modules = {},
                twoGroups,
                oneGroup,
                resolved,
                loader,
                paths;

            paths = [
                'foob/a/tora.js',
                'foob/a/maru.js',
                'foob/a/ryo.js',
                'foob/b/tora.js',
                'foob/b/maru.js'
            ];

            // twoGroups is shorter here
            oneGroup  = 'http://combo.yuilibrary.com/p/foob+a/maru,a/ryo,a/tora,b/maru,b/tora.js';
            twoGroups = 'http://combo.yuilibrary.com/p/foob/a+maru,ryo,tora;foob/b+maru,tora.js';

            paths.forEach(function (path) {
                modules[path] = {
                    group: 'foob',
                    path: path
                };
            });

            loader = new Y.Loader({
                combine: true,
                require: paths,
                groups: {
                    'foob': {
                        comboBase: 'http://l.yimg.com/zz/combo?',
                        root: '/',
                        combine: true
                    }
                },
                modules: modules
            });

            resolved = loader.resolve(true);
            Assert.areEqual(twoGroups, resolved.js[0]);
        },

        'test prefix tree compression efficiency (3)': function () {
            var modules = {},
                twoGroups,
                oneGroup,
                resolved,
                loader,
                paths;

            paths = [
                'foo/a/tora.js',
                'foo/a/maru.js',
                'foo/b/tora.js',
                'foo/b/maru.js'
            ];

            // same length so it should end early by using shortest possible root path
            oneGroup  = 'http://combo.yuilibrary.com/p/foo+a/maru,a/tora,b/maru,b/tora.js';
            twoGroups = 'http://combo.yuilibrary.com/p/foo/a+maru,tora;foo/b+maru,tora.js';

            paths.forEach(function (path) {
                modules[path] = {
                    group: 'foo',
                    path: path
                };
            });

            loader = new Y.Loader({
                combine: true,
                require: paths,
                groups: {
                    'foo': {
                        comboBase: 'http://l.yimg.com/zz/combo?',
                        root: '/',
                        combine: true
                    }
                },
                modules: modules
            });

            resolved = loader.resolve(true);
            Assert.areEqual(oneGroup, resolved.js[0]);
        }
    }));

    Y.Test.Runner.add(suite);
});
