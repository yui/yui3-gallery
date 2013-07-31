YUI.add('scrollview-touch-test', function(Y)
{
    window.YY = Y;
    var unitTestSuite = new Y.Test.Suite("Unit Tests"),
        setUp = function () {

        },
        tearDown = function () {
            //Y.one('#container').empty(true);
        };

        renderNewScrollview = function (scrollViewAxis, size) {

            var config = {},
                guid = Y.guid(),
                html,
                scrollview,
                widgetClass,
                sv_class;

            config.srcNode = '#' + guid;
            config.axis = scrollViewAxis;
            if (scrollViewAxis == 'X')
            {
                config.width = size;
                sv_class = 'horizontal';
            }
            else if (scrollViewAxis == 'Y')
            {
                config.height = size;
                sv_class = 'vertical';
            }

            html = "<div><div id='" + guid + "' class='sb " + sv_class + "'><ul><li>a</li><li>b</li><li>c</li><li>d</li><li id='e'>e</li><li>f</li><li>g</li><li>h</li><li>i</li><li>j</li><li>k</li></ul></div></div>",
            Y.one('#container').append(html);

            scrollview = new Y.ScrollViewTouch(config);

            return scrollview;
        };

    var node = Y.one('#container');

    unitTestSuite.add(new Y.Test.Case({
        name: "Rendering",

        setUp: setUp,
        tearDown: tearDown,

        "should have specified width, and height unchanged, after rendering on X axis": function()
        {
            var width = 300,
                x = 'X',
                scrollview = renderNewScrollview(x, width);

            if (!scrollview.isNative)
            {
                Y.Assert.areEqual(width, parseInt(scrollview.get('width'), 10));
            }
            else
            {
                Y.Assert.areEqual(width, parseInt(scrollview.scrollbox.getStyle('width').replace("px",""), 10));
            }
        },

        "should have specified height, and width unchanged, after rendering on Y axis": function()
        {
            var height = 100,
                y = 'Y',
                scrollview = renderNewScrollview(y, height);

            if (!scrollview.isNative)
            {
                Y.Assert.areEqual(height, parseInt(scrollview.get('height'), 10));
            }
            else
            {
                Y.Assert.areEqual(height, parseInt(scrollview.scrollbox.getStyle('height').replace("px",""), 10));
            }
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Handling gestures",

        setUp: setUp,
        tearDown: tearDown,

        "touchmove should move scroll position, for X axis": function()
        {
            var width = 300,
                scrollLeft = 740;
                axis = 'X',
                scrollview = renderNewScrollview(axis, width);

            if (!scrollview.isNative)
            {
                scrollview.scrollTo(740,0);
                Y.Assert.areEqual(scrollLeft, scrollview.get('scrollX'));
            }
            else
            {
                Y.one('#e').scrollIntoView(true);
                Y.Assert.areEqual(scrollLeft, Y.one('.sb')._node.scrollLeft);
            }

            // simulate a 50px gesturemove on node
            /*node.one('.horizontal').simulateGesture("move", {
                path: {xdist:-50},
                axis: 'x'
            }, function() {
                if (!scrollview.isNative)
                {
                    Y.Assert.areEqual(scrollLeft, scrollview.get('scrollX'));
                }
                else
                {
                    Y.Assert.areEqual(scrollLeft, node._node.scrollLeft);
                }
            });*/
        },

        "touchmove should move scroll position, for Y axis": function()
        {
             var height = 100,
                scrollTop = 136,
                axis = 'Y',
                scrollview = renderNewScrollview(axis, height);

             var test = this;

            if (!scrollview.isNative)
            {
                scrollview.scrollTo(0,136);
                Y.Assert.areEqual(scrollTop, scrollview.get('scrollY'));
            }
            else
            {
                Y.one('#e').scrollIntoView(true);
                Y.Assert.areEqual(scrollTop, Y.one('.sb')._node.scrollTop);
            }
            // simulate a 50px gesture on node
            /*node.one('.vertical').simulateGesture("move", {
                path: { ydist:-50 },
                axis: 'y'
            }, function() {
                test.resume(function(){
                    if (!scrollview.isNative)
                    {
                        Y.Assert.areEqual(scrollTop, scrollview.get('scrollY'));
                    }
                    else
                    {
                        Y.Assert.areEqual(scrollTop, node._node.scrollTop);
                    }
                });
            });
            this.wait(5000);*/
        },
    }));
    
    Y.Test.Runner.add(unitTestSuite);

}, '@VERSION@' ,{requires:['node', 'scrollview-base', 'gallery-scrollview-touch', 'event-touch', 'node-event-simulate', 'test']});
