/*global YUI */

YUI.add('gallery-nav-assist-tests', function (Y) {
    'use strict';

    var suite = new Y.Test.Suite('gallery-nav-assist'),

        A = Y.Assert,

        CLASS_DEFAULT_CHILD_HIGHLIGHT = 'default-child-highlight',
        CLASS_NAV_POINTER = 'nav-pointer', //pointer on child element highligted
        CLASS_DEFAULT_CONTAINER_HIGHLIGHT = 'default-container-highlight',
        KEYCODE_FOR_ARROW_RIGHT = 39,
        KEYCODE_FOR_ARROW_LEFT = 37,
        KEYCODE_FOR_ARROW_UP = 38,
        KEYCODE_FOR_ARROW_DOWN = 40,
        KEYCODE_FOR_DISABLE = 68, // 'd'
        KEYCODE_FOR_ENABLE = 69, // 'd'
        KEYCODE_FOR_ESC = 27,
        HORIZONTALLY = true,

        nav = null;

    // direct functions to simulate keystrokes, easy for writing tests
    function disableNavigation() {
        Y.one('body').simulate('keydown', { keyCode: KEYCODE_FOR_DISABLE, shiftKey: true });
    }

    function enableNavigation() {
        Y.one('body').simulate('keydown', { keyCode: KEYCODE_FOR_ENABLE, shiftKey: true });
    }

    function moveToNextContainer() {
        Y.one('body').simulate('keydown', { keyCode: KEYCODE_FOR_ARROW_RIGHT, shiftKey: true });
    }

    function moveToPrevContainer() {
        Y.one('body').simulate('keydown', { keyCode: KEYCODE_FOR_ARROW_LEFT, shiftKey: true });
    }

    function pressEscape() {
        Y.one('body').simulate('keydown', { keyCode: KEYCODE_FOR_ESC });
    }

    function moveToNextChild(isHorizontal) {
        if (isHorizontal) {
            Y.one('body').simulate('keydown', { keyCode: KEYCODE_FOR_ARROW_RIGHT });
        } else {
            Y.one('body').simulate('keydown', { keyCode: KEYCODE_FOR_ARROW_DOWN });
        }
    }

    function moveToPrevChild(isHorizontal) {
        if (isHorizontal) {
            Y.one('body').simulate('keydown', { keyCode: KEYCODE_FOR_ARROW_LEFT });
        } else {
            Y.one('body').simulate('keydown', { keyCode: KEYCODE_FOR_ARROW_UP });
        }
    }

    suite.add(new Y.Test.Case({

        name: 'Automated Tests',

        tearDown: function () {
            if (nav) {
                nav.disableAllNavigation();
                nav.destroy();
                nav = null;
            }
        },

        'Y.NAVASSIST should be a function': function () {
            A.isFunction(Y.NAVASSIST);
        },

        'Check instantiation of nav assist with full fledged config': function () {
            nav = new Y.NAVASSIST({
                registry: [{
                    node: '#main',
                    pullToTop: true,
                    elemStyle: {
                        className: 'main-elem-custom-highlight'
                    },
                    containerStyle: {
                        className: 'main-container-custom-highlight'
                    }
                }, {
                    node: '#eastrail',
                    rank: 3
                }, {
                    node: '#links',
                    rank: 4
                }, {
                    node: '#sidebar',
                    rank: 1
                }, {
                    node: '#tabs',
                    isHorizontal: true
                }, {
                    node: '#crapNodeDoesntExist'
                }],
                debug: true,
                navPointer: true,
                styleContainer: true,
                ignore: ['#testinputbox']
            });

            A.isObject(nav);

            nav.deRegister({node: '#eastrail'});
            nav.deRegister({node: '#links'});
            nav.deRegister({node: '#sidebar'});
            nav.deRegister({node: '#tabs'});
            nav.deRegister({node: '#main'});
        },

        'register a new DOM node and check if its navigable': function () {

            nav = new Y.NAVASSIST({
                debug: true
            });

            nav.register({
                node: '#header'
            });

            nav.register({
                node: '#sidebar'
            });

            moveToNextContainer();
            moveToNextContainer();
            moveToPrevContainer();
            A.areEqual(Y.one('#header h2').hasClass('default-child-highlight'), true, 'header divs child has the highlight');
        },

        'disable all navigation via shift + d, and enable via shift + e': function () {

            nav = new Y.NAVASSIST({
                debug: true
            });

            nav.register({
                node: '#header'
            });

            moveToNextContainer();
            A.areEqual(Y.one('#header h2').hasClass(CLASS_DEFAULT_CHILD_HIGHLIGHT), true, 'header divs child has the highlight');

            disableNavigation();
            nav.splash('Disabling all navigation', [100, 100]);
            A.areEqual(Y.one(CLASS_DEFAULT_CHILD_HIGHLIGHT), null, 'nav disabled: No div has highlight anymore');

            nav.splash('Enabling all navigation', [100, 100]);
            enableNavigation();
            A.areEqual(Y.one('#header h2').hasClass(CLASS_DEFAULT_CHILD_HIGHLIGHT), true, 'header child has the highlight');
        },

        'check highlight and custom highlight on container and deregisteration of a node': function () {
            var customContainerClass = 'custom-container-highlight-class',
                customChildClass = 'custom-child-highlight-class';

            nav = new Y.NAVASSIST({
                debug: true,
                styleContainer: true
            });

            // default highlighting
            nav.register({
                node: '#header'
            });

            moveToNextContainer();
            A.areEqual(Y.one('#header').hasClass(CLASS_DEFAULT_CONTAINER_HIGHLIGHT), true, 'nav enabled: header div container has default highlight');
            A.areEqual(Y.one('#header h2').hasClass(CLASS_DEFAULT_CHILD_HIGHLIGHT), true, 'nav enabled: header divs child has default highlight');

            // de-register a node and check if its in the registry
            nav.deRegister({
                node: '#header'
            });

            moveToNextContainer();
            A.areEqual(nav.isNodeInRegistry('#header'), null, 'header node has been deregistered');

            // custom highlighting
            nav.register({
                node: '#header',
                containerStyle: {
                    className: customContainerClass
                },
                elemStyle: {
                    className: customChildClass
                }
            });

            moveToNextContainer();
            A.areEqual(Y.one('#header').hasClass(customContainerClass), true, 'nav enabled: header div container has custom highlight');
            A.areEqual(Y.one('#header h2').hasClass(customChildClass), true, 'nav enabled: header divs child has custom highlight');
        },

        'check arrow right keyboard press and its effect of navigation between child elements of a container which are horizontally aligned': function () {

            nav = new Y.NAVASSIST({
                debug: true
            });

            nav.register({
                node: '#navtabs',
                isHorizontal: true
            });

            moveToNextContainer();
            // simulate call to handler for keydown which is the same function called for arrow right
            moveToNextChild(HORIZONTALLY);
            // 1st child should lose focus
            A.areEqual(Y.one('#tab1').hasClass(CLASS_DEFAULT_CHILD_HIGHLIGHT), false, '1st child isnt selected');
            // 2nd child should get the focus
            A.areEqual(Y.one('#tab2').hasClass(CLASS_DEFAULT_CHILD_HIGHLIGHT), true, '2nd child is selected');
        },

        'Test to toggle nav pointer usage by config': function () {

            nav = new Y.NAVASSIST({
                debug: true,
                navPointer: true //by default its set to false
            });

            nav.register({
                node: '#navtabs',
                isHorizontal: true
            });

            moveToNextContainer();
            // simulate call to handler for keydown which is the same function called for arrow right
            moveToNextChild(HORIZONTALLY);
            // 2nd child have a nav pointer
            A.areEqual(Y.one('.tab2 span').hasClass(CLASS_NAV_POINTER), true, 'nav pointer for tab2');
        },

        'check multiple container navigation and ranking, check Escape key press': function () {

            nav = new Y.NAVASSIST({
                styleContainer: true,
                debug: true,
                registry: [{
                    node: '#eastrail',
                    rank: 2
                }, {
                    node: '#header',
                    rank: 1
                }, {
                    node: '#sidebar',
                    rank: 3
                }]
            });

            // navigate once to the container ranked 1
            moveToNextContainer();
            A.areEqual(Y.one('#header').hasClass(CLASS_DEFAULT_CONTAINER_HIGHLIGHT), true, 'rank1 is header is selected');

            // navigate twice so taht the 3rd container is reached and it shuould be sidebar since its ranked 3
            moveToNextContainer();
            moveToNextContainer();
            A.areEqual(Y.one('#sidebar').hasClass(CLASS_DEFAULT_CONTAINER_HIGHLIGHT), true, 'rank3 is sidebar is selected');

            pressEscape();
            A.areEqual(Y.one('#sidebar').hasClass(CLASS_DEFAULT_CONTAINER_HIGHLIGHT), false, 'sidebar lost focus');
        },

        'check ignore functionality, where nodes which are in ignore list arent selected': function () {

            nav = new Y.NAVASSIST({
                styleContainer: true,
                debug: true,
                registry: [{
                    node: '#tabs',
                    rank: 1
                }],
                ignore: ['#testnputbox']
            });

            // navigate once to the container ranked 1
            moveToNextContainer();
            moveToNextChild(); // goes to searchbox
            A.areEqual(Y.one('#testinputbox').hasClass(CLASS_DEFAULT_CONTAINER_HIGHLIGHT), false, 'input box shouldnt be selected');

            moveToNextChild();
            A.areEqual(Y.one('#beforebox').hasClass(CLASS_DEFAULT_CONTAINER_HIGHLIGHT), false, 'next child shouldnt get selected since testinputbox is on ignore list');
        },

        'check arrow up keyboard press and its effect of navigation between child elements of a container': function () {

            nav = new Y.NAVASSIST({
                debug: true
            });

            nav.register({
                node: '#eastrail'
            });

            moveToNextContainer();
            A.areEqual(Y.one('#elem1').hasClass(CLASS_DEFAULT_CHILD_HIGHLIGHT), true, '1st child is selected');

            moveToPrevChild();
            A.areEqual(Y.one('#elem1').hasClass(CLASS_DEFAULT_CHILD_HIGHLIGHT), false, '1st child isnt selected');
            A.areEqual(Y.one('#elem2').hasClass(CLASS_DEFAULT_CHILD_HIGHLIGHT), true, '2nd child is selected');
        }
    }));

    Y.Test.Runner.add(suite);

}, '0.0.1', {
    requires: [
        'test',
        'gallery-nav-assist',
        'node-event-simulate'
    ]
});
