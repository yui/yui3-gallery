/* ============================================================================
 * Copyright (c) Vincent Hardy 2009. All rights reserved
 * ===========================================================================*/

YUI({
    gallery: 'gallery-20010.10.12-22',
    modules: {
        'gallery-svg': {
            fullpath: '../../../build/gallery-svg/gallery-svg.js',
            requires: ["gallery-svg"],
            optional: [],
            supersedes: []
        }

    }
}).use('node', 'event', 'dom', 'anim', 'gallery-svg', function (Y) {
    var Animate = Y.Animate, Easing = Y.Easing, firstAnim;

    // =================================================================
    // Shape animations
    // =================================================================
    var shapeAnimationTests = [
        // <rect> : x / y / width / height
        {
            node: '#rect-shape',
            from: {
                x: Y.one('#rect-shape').get('x'),
                y: Y.one('#rect-shape').get('y'),
                width: Y.one('#rect-shape').get('width'),
                height: Y.one('#rect-shape').get('height'),
                rx: Y.one('#rect-shape').get('rx'),
                ry: Y.one('#rect-shape').get('ry')
            },
            to: {
                x:-15,
                y:-15,
                width:30,
                height:30,
                rx: 12,
                ry: 12
            },
            duration: 0.25
        },

        // <circle>: cx / cy / r
        {
            node: '#circle-shape',
            from: {
                cx: Y.one('#circle-shape').get('cx'),
                cy: Y.one('#circle-shape').get('cy'),
                r: Y.one('#circle-shape').get('r')
            },
            to: {
                cx:-30,
                cy:5,
                r: 10
            },
            duration: 0.25
        },


        // <line>: x1 / x2 / y1 / y2
        {
            node: '#line-shape',
            from: {
                x1: Y.one('#line-shape').get('x1'),
                y1: Y.one('#line-shape').get('y1'),
                x2: Y.one('#line-shape').get('x2'),
                y2: Y.one('#line-shape').get('y2')
            },
            to: {
                x1: 20,
                y1: 0,
                x2: -20,
                y2: 0
            },
            duration: 0.25
        },

        // <ellipse>: cx / cy / rx / ry
        {
            node: '#ellipse-shape',
            from: {
                cx: Y.one('#ellipse-shape').get('cx'),
                cy:Y.one('#ellipse-shape').get('cy'),
                rx: Y.one('#ellipse-shape').get('rx'),
                ry:Y.one('#ellipse-shape').get('ry')
            },
            to: {
                cx:-30,
                cy:5,
                rx: 25,
                ry:3
            },
            duration: 0.25
        },
        
        // <text>: x / y
        {
            node: '#text-line',
            from: {
                x: Y.one('#text-line').get('x'),
                y: Y.one('#text-line').get('y')
            },
            to: {
                x: 20,
                y: -20
            }
        },

        // <tspan>: x / y / dx / dy (no rotate, not implemented in FF)
        {
            node: '#b-span',
            from: {
                dx: Y.one('#text-line').get('dx'),
                dy: Y.one('#text-line').get('dy')
            },
            to: {
                dx: 20,
                dy: -20
            }
        }
    ];

    Y.each(shapeAnimationTests, function (config) {
        var anim = new Animate(config);
        anim.beginOn(Y.one(config.node + '-target'), 'click');
        anim.onEnd(function () {
            anim.set('reverse', !anim.get('reverse'));
        });
    });

    // =================================================================
    // Shape animations
    // =================================================================
    var animateTransformTests = [{
            node: '#translate',
            from: {transform: {tx: 0, ty: 0}},
            to: {transform: {tx: 200, ty: 0}},
            transformTemplate: "translate(#tx, #ty)",
            easing: Easing.elasticOut,
            duration: 1
        },{
            node: '#rotation',
            from: {transform: {r: 0}},
            to: {transform: {r: 360}},
            transformTemplate: "rotate(#r)",
            easing: Easing.elasticBoth,
            duration: 1
        }, {
            node: '#scale',
            from: {transform: {sx: 1, sy: 1}},
            to: {transform: {sx: 3, sy: 3}},
            transformTemplate: "scale(#sx, #sy)",
            easing: Easing.bounceOut,
            duration: 1
        }, {
            node: '#all',
            from: {transform: {tx: 0, ty: 0, r: 0, sx: 1, sy: 1}},
            to: {transform: {tx: 200, ty: 100, r: 360, sx: 5, sy: 5}},
            transformTemplate: "translate(#tx, #ty) rotate(#r) scale(#sx,#sy)",
            duration: 1
        }, {
            node: '#custom',
            from: {transform: {tx:0, ty: 0, sx: 1, sy:1}},
            to: {transform: {tx: 200, ty: 100, sx: 7, sy: 7}},
            transformTemplate: "translate(#tx, 0) scale(#sx,#sy)", /* ty will be ignored */
            duration: 1
        }
    ];

    Y.each(animateTransformTests, function (config) {
        var anim = new Animate(config);
        anim.beginOn(Y.one(config.node + '-target'), 'click');
        anim.onEnd(function () {
            anim.set('reverse', !anim.get('reverse'));
        });
    });



    // =================================================================
    // Path animations
    // =================================================================
    var animatePathTests = [{
            node:'#M',
            from: {d: Y.one('#M').getAttribute('d')},
            to: {d: "M -30 -30 L 20 20 -20 20 Z"},
            duration: 2
        },
        {
            node:'#Q',
            from: {d: Y.one('#Q').getAttribute('d')},
            to: {d: "M 0 -20 Q 20 0  0 20 -30 0 0 -20   Z"},
            duration: 3
        },
        {
            node:'#C',
            from: {d: Y.one('#C').getAttribute('d')},
            to: {d: "M 20 -20 C -30 -20  -30 20 20 20   Z"},
            duration: 3
        },
        {
            node:'#HV',
            from: {d: Y.one('#HV').getAttribute('d')},
            to: {d: "M -25 -25 H 40 V 10 Z"},
            duration: 0.5
        },
        {
            node:'#T',
            from: {d: Y.one('#T').getAttribute('d')},
            to: {d: "M -20 -20 Q 20 -30 30 0 T -10 30 Z"},
            duration: 0.5
        },
        {
            node:'#S',
            from: {d: Y.one('#S').getAttribute('d')},
            to: {d: "M -20 -20 Q 20 -20 20 0 S 10 30 -30 10 Z"},
            duration: 0.5
        },
        {
            node:'#A',
            from: {d: Y.one('#A').getAttribute('d')},
            to: {d: "M -20 20 H 20 A 40 40 0 0 0 " +
                    (-20 + 40 * Math.cos(45 * Math.PI / 180)) + " " +
                    (20 - 40 * Math.sin(45 * Math.PI / 180)) + " z"},
            duration: 0.5
        },
        {
            node: '#morph',
            from: {
                fill: Y.one('#morph').getStyle('fill'),
                d: Y.one('#morph').getAttribute('d')
            },
            to: {fill: 'crimson', d: "M29.766,1.48l1.078,1.099c-0.039,0.041,7.595,7.773,7.561,7.816c-0.043,0.05-9.454,9.396-9.497,9.452" +
		"c-0.021,0.03,5.514,5.619,5.492,5.652c-0.018,0.021,3.775,3.859,3.759,3.881c-0.035,0.052-8.76,8.788-8.794,8.84" +
		"c-0.035,0.061-9.442-9.25-9.481-9.189c-0.004,0.011-2.973,2.99-2.981,3.008c-0.018,0.039-6.43,6.468-6.46,6.481" +
		"c-0.013,0.003-2.593-2.556-2.61-2.556c-0.021,0-3.111-3.062-3.128-3.071c-0.013-0.005-3.098-3.082-3.107-3.099" +
		"c-0.013-0.014,1.614-1.663,1.605-1.685c2.766-2.849,2.766-2.849,2.761-2.889c0-0.004,0.208-0.219,0.208-0.224" +
		"c-0.009-0.047,2.348-2.441,2.348-2.452c0-0.026,2.381-2.413,2.407-2.433c0.03-0.02-2.502-2.572-2.472-2.572" +
		"c0.009,0-0.613-0.623-0.608-0.616c0.004,0.004-1.178-1.166-1.169-1.148c0.004,0.013-1.355-1.324-1.351-1.308" +
		"c0.013,0.043-2.123-2.073-2.115-2.073c0.004,0-1.462-1.476-1.445-1.499c0.018-0.022,3.604-3.616,3.634-3.664" +
		"c0.034-0.054,5.264-5.308,5.294-5.354c0.017-0.025,2.572,2.497,2.584,2.474c0.052-0.084,6.568,6.341,6.599,6.302" +
		"c0-0.002,0.293,0.287,0.293,0.285c0.029-0.035,3.21-3.218,3.232-3.234c0.022-0.018,2.551-2.535,2.585-2.546" +
		"C26.016,5.15,29.718,1.484,29.766,1.48z"},
            duration: 0.15
        }
    ];

    Y.each(animatePathTests, function (config) {
        var anim = new Animate(config);
        anim.beginOn(Y.one(config.node + '-target'), 'click');
        anim.onEnd(function () {
            anim.set('reverse', !anim.get('reverse'));
        });
    });

    // =================================================================
    // Filter animations
    // =================================================================
    var filterAnimationsTests = [{
            node:'#blur',
            from: {stdDeviation: [0.00001, 0.000001]},
            to: {stdDeviation: [15  , 0.000001]},
            duration: 0.5
    }];

    Y.each(filterAnimationsTests, function (config) {
        var anim = new Animate(config);
        anim.beginOn(Y.one(config.node + "-target"), 'click');
        anim.onEnd(function () {
            if (anim.get('reverse') !== true) {
                anim.set('reverse', true);
                anim.run();
            } else {
                anim.set('reverse', false);
            }
        });
    });

    // =================================================================
    // Stroke animations
    // =================================================================
    var strokeAnimations = [{
            node:'#stroke-opacity',
            from: {'stroke-opacity': 1},
            to: {'stroke-opacity': 0.2},
            duration: 0.25
    }, {
            node:'#stroke',
            from: {stroke: 'black'},
            to: {'stroke': 'crimson'},
            duration: 0.25
    },{
            node:'#stroke-width',
            from: {'stroke-width': 1},
            to: {'stroke-width': 4},
            duration: 0.25
    },{
            node:'#stroke-dashoffset',
            from: {'stroke-dashoffset': 90},
            to: {'stroke-dashoffset': 0},
            duration: 0.5
    }];

    Y.each(strokeAnimations, function (config) {
        var anim = new Animate(config);
        anim.beginOn(Y.one(config.node + '-target'), 'click');
        anim.onEnd(function () {
            anim.set('reverse', !anim.get('reverse'));
        });
    });


    // =================================================================
    // Time offsets
    // =================================================================
    // Test onBegin / onEnd with or without offsets
    var target = Y.one("#onBegin-onEnd"),
        trace = Y.one("#onBegin-onEndTrace");

    function doTrace(msg) {
        return function () {
           trace.set("textContent", msg);
        };
    }
    
    var animation = new Animate({
                            node: "#onBegin-onEnd",
                            from: {transform: {r: 0}, opacity: 0},
                            to: {transform: {r: 360}, opacity: 1},
                            transformTemplate: "rotate(#r)",
                            duration: 3
                        });
    animation.beginOn(Y.one('#onBegin-onEnd-target'), "click");
    animation.onBegin(doTrace("onBegin"));
    animation.onBegin(doTrace("onBegin 1s"), 1);
    animation.onBegin(doTrace("onBegin 2s"), 2);
    animation.onEnd(doTrace("onEnd"));
    animation.onEnd(doTrace("onEnd 1s"), 1);
    animation.onEnd(doTrace("onEnd 2s"), 2);
    animation.onEnd(doTrace("onEnd 3s"), 3);

    target = Y.one("#beginOn-endOn");
    animation = new Animate({
                        node: "#beginOn-endOn",
                        from: {transform: {r: 0}},
                        to: {transform: {r: 360}},
                        transformTemplate: "rotate(#r)",
                        duration: 5
                    });
    var animation2 = new Animate({
                        node: "#beginOn-endOn-2",
                        from: {transform: {r: 0}},
                        to: {transform: {r: 360}},
                        transformTemplate: "rotate(#r)",
                        duration: 5
                    });
    var animation3 = new Animate({
                        node: "#beginOn-endOn-3",
                        from: {transform: {r: 0}},
                        to: {transform: {r: 360}},
                        transformTemplate: "rotate(#r)",
                        duration: 5
                    });

    // Test DOM event animation triggers, with and without offsets
    animation.beginOn(Y.one("#beginOn"), "click");
    animation.beginOn(Y.one("#beginOnOffset"), "click", 1);
    animation.endOn(Y.one("#endOn"), "click");
    animation.endOn(Y.one("#endOnOffset"), "click", 1);

    // Test Animation event triggers, with and without offsets
    animation2.beginOn(animation, "begin");
    animation2.endOn(animation, "end");
    animation3.beginOn(animation2, "begin", 1);
    animation3.endOn(animation2, "end", 1);

    var chained = Y.all('#chained circle'),
        animations = [],
        previousAnim;

    chained.each(function (circle) {
        var anim = new Y.Animate({
            node: circle,
            from: {'fill': 'white', 'fill-opacity': 1},
            to: {'fill': 'gray', 'fill-opacity': 0.2},
            duration: 0.25
        });
        var anim2 = new Y.Animate({
            node: circle,
            from: {r: 5},
            to: {r: 10},
            duration: 0.25
        });
        anim.onBegin(function () {anim2.set('reverse', false); anim2.run();});
        anim.onEnd(function () {anim2.set('reverse', true); anim2.run();});
        
        if (previousAnim !== undefined) {
            // start 'anim' with a 0.5s offset from the previous anim start.
            previousAnim.onBegin(anim, 0.05);
        } else {
            firstAnim = anim;
        }
        previousAnim = anim;
        animations.push(anim);
        animations.push(anim2);
    });

    chained.on('click', function () {
        Y.each(animations, function (anim) {
            anim.stop();
            anim.set('reverse', false);
            anim.applyStartFrame();
        } );
        firstAnim.run(0.15);
    });


    // =================================================================
    // Paint animations
    // =================================================================
    var renderingAnimations = [{
            node:'#fill-opacity',
            from: {'fill-opacity': 1},
            to: {'fill-opacity': 0.2},
            duration: 0.25
    }, {
            node:'#stop-opacity',
            from: {'stop-opacity': 1},
            to: {'stop-opacity': 0.5},
            duration: 0.25
    },{
            node:'#stop-color',
            from: {'stop-color': '#B1BFC7'},
            to: {'stop-color': 'gold'},
            duration: 0.25
    },{
            node:'#stop-offset',
            from: {offset: 0},
            to: {offset: 0.5},
            duration: 0.25
    },{
            node: "#calloutBg",
            from: {cx: 1, cy: 1, r: 1},
            to: {cx: 0, cy: 0, r: 0.5},
            duration: 1
    }];

    Y.each(renderingAnimations, function (config) {
        var anim = new Animate(config);
        anim.beginOn(Y.one(config.node + "-target"), 'click');
        anim.onEnd(function () {
            anim.set('reverse', !anim.get('reverse'));
        });
    });
});