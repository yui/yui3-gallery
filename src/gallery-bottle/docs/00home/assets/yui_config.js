var debug = location.href.match(/(#|:)debug/),
    YUI_config = {
        gallery: 'gallery-2012.09.26-20-36',
        debug: debug,
        combine: debug ? false : true,
        filter: debug ? 'debug' : 'min',
        groups: {
            'bottle-modules': {
                base: jsURL,
                modules: {
                    'gallery-zui-rascroll': {
                        path: 'gallery-zui-rascroll.js'
                    },
                    'gallery-bt-device': {
                        path: 'gallery-bt-device/gallery-bt-device.js'
                    },
                    'gallery-bt-loader': {
                        path: 'gallery-bt-loader/gallery-bt-loader.js'
                    },
                    'gallery-bt-container': {
                        path: 'gallery-bt-container/gallery-bt-container.js'
                    },
                    'gallery-bt-page': {
                        path: 'gallery-bt-page/gallery-bt-page.js'
                    },
                    'gallery-bt-overlay': {
                        path: 'gallery-bt-overlay/gallery-bt-overlay.js'
                    },
                    'gallery-bt-shortcut': {
                        path: 'gallery-bt-shortcut/gallery-bt-shortcut.js'
                    },
                    'gallery-bt-pushpop': {
                        path: 'gallery-bt-pushpop/gallery-bt-pushpop.js'
                    },
                    'gallery-bt-syncscroll': {
                        path: 'gallery-bt-syncscroll/gallery-bt-syncscroll.js'
                    },
                    'gallery-bt-photogrid': {
                        path: 'gallery-bt-photogrid/gallery-bt-photogrid.js'
                    },
                    'gallery-bt-slidetab': {
                        path: 'gallery-bt-slidetab/gallery-bt-slidetab.js'
                    },
                    'gallery-bt-carousel': {
                        path: 'gallery-bt-carousel/gallery-bt-carousel.js'
                    },
                    'gallery-bt-css': {
                        path: 'gallery-bt-css/gallery-bt-css.css',
                        type: 'css'
                    },
                    'gallery-bottle': {
                        path: 'gallery-bottle/gallery-bottle.js'
                    }
                }
            }
        }
    };
