YUI({
    logInclude: { TestRunner: true },
    filter : "DEBUG"
}).use('test', 'event', 'json', 'gallery-clipboard', 'console',
function(Y) {
    
    var MOVIE_PATH = "../../../build/gallery-clipboard/assets/",
        suite      = new Y.Test.Suite('Clip-Board-Plugin');
    
    
    Y.on("clipboard:error", function(e) {
        Y.log("Some Error : "+e.error);
    });
    
    suite.add(new Y.Test.Case({

        name: 'clip-board-plugin',
        setUp: function() {
            var template = "<div class='button' style='width:200px;height:200px;border:1px solid;'></div>",
                container = Y.one("#container");
            container.appendChild(Y.Node.create(template));
            this.config = {
                container : container
            };
        },
        tearDown: function() {
            var n = Y.one("div.button");
            
            n.clipboard._destructor();
            n.destroy();
            
            this.config.container.set("innerHTML", "");
            
            this.config = null;
            
            Y.one("#movie").set("innerHTML", '');
        },
        _should: {
            ignore: {
                /*testConstructor : true,
                testInterface : true,
                testMovieLoad : true,
                testSetAttributeCopy : true,
                testFlashSetEvents : true,
                testFlashRemoveEvents : true*/
            }
        },
        testConstructor : function() {
            var node = Y.one("div.button"),
                _this = this;
            node.plug(Y.comms.ui.ClipBoard, {
                page : Y.one("#movie"),
                moviepath : MOVIE_PATH
            }).on("clipboard:load", function() {
                _this.resume(function() {
                    Y.Assert.isInstanceOf(Y.comms.ui.ClipBoard, node.clipboard);
                });
            })
            _this.wait();
        },
        testInterface : function() {
            var node = Y.one("div.button"),
                intf = ["setEvent", "removeEvent", "focus", "copy", "hide", "show", "getHostDimensions"],
                _this = this;
            node.plug(Y.comms.ui.ClipBoard, {
                page : Y.one("#movie"),
                moviepath : MOVIE_PATH
            }).on("clipboard:load", function() {
                _this.resume(function() {
                    for(var i=0;i<intf.length; i++) {
                        Y.Assert.isFunction(node.clipboard[intf[i]]);
                    }
                });
            });
            _this.wait();
        },
        testMovieLoad : function() {
            var node = Y.one("div.button"),
                _this = this;
            node.plug(Y.comms.ui.ClipBoard, {
                page      : Y.one("#movie"),
                moviepath : MOVIE_PATH,
                domain    : "*.corp.yahoo.com",
                id        : "abcd"
            }).on("clipboard:load", function(e){
                _this.resume(function() {
                    var url = '';
                    Y.Assert.areEqual(e.domain, "*.corp.yahoo.com",
                                        "The Flash load must respond with same domain");
                    Y.Assert.areEqual(node.get("id"), node.clipboard.get("id"));
                    Y.Assert.areEqual(e.id, "clipboard");
                    Y.ArrayAssert.itemsAreEqual(node.clipboard.getHostDimensions(), e.dimensions,
                                        "Dimensions should be the same");
                    Y.Assert.isTrue(Y.Lang.isString(e.loadUrl));
                });
            });
            _this.wait();
        },

        testSetAttributeCopy : function() {
            var mockMovie = Y.Mock(),
                _this     = this,
                str       = "This is a sample",
                tmp;
            Y.Mock.expect(mockMovie, {
                method: "copy",
                args: [str, "abcd"]
            });
            var node = Y.one("div.button");
            node.plug(Y.comms.ui.ClipBoard, {
                page : Y.one("#movie"),
                moviepath : MOVIE_PATH,
                id : "abcd"
            });
            node.clipboard._movie = {
                focus : function() {}
            };
            tmp = node.clipboard._movie._node;
            node.clipboard._movie._node = mockMovie;
            node.setAttribute("copy", str);
            Y.Mock.verify(mockMovie);
            Y.Assert.areEqual(node.getAttribute("copy"), str);
            Y.Assert.areEqual(node.clipboard.get("id"), node.get("id"), "Ids are expected to be equal");
            node.clipboard._movie._node = tmp;
        },
        testFlashSetEvents : function() {
            var mockMovie = Y.Mock(),
                _this     = this,
                tmp;
            Y.Mock.expect(mockMovie, {
                method: "setupEvents",
                args: [Y.Mock.Value.Object]
            });
            var node = Y.one("div.button");
            node.plug(Y.comms.ui.ClipBoard, {
                page : Y.one("#movie"),
                moviepath : MOVIE_PATH
            }).on("clipboard:load", function(ev) {
                _this.resume(function() {
                    node.clipboard._movie = {
                        focus : function() {}
                    };
                    tmp = node.clipboard._movie._node;
                    node.clipboard._movie._node = mockMovie;
                    node.clipboard.setEvent("test", function(){}, true);
                    Y.Mock.verify(mockMovie);
                    node.clipboard._movie._node = tmp;
                });
            });
            _this.wait();
        },
        testFlashRemoveEvents : function() {
            var mockMovie = Y.Mock(),
                _this     = this,
                tmp;
            Y.Mock.expect(mockMovie, {
                method: "removeEvents",
                args: [Y.Mock.Value.Array]
            });
            var node = Y.one("div.button");
            node.plug(Y.comms.ui.ClipBoard, {
                page : Y.one("#movie"),
                moviepath : MOVIE_PATH
            }).on("clipboard:load", function(ev) {
                _this.resume(function() {
                    tmp = node.clipboard._movie._node;
                    node.clipboard.setEvent("mouseOut", function(){}, true);
                    node.clipboard._movie._node = mockMovie;
                    node.clipboard.removeEvent("mouseOut");
                    Y.Mock.verify(mockMovie);
                    node.clipboard._movie._node = tmp;
                });
            });
            _this.wait();
        }
    }));
    Y.Test.Runner.add(suite);
    //run all tests
    var yconsole = new Y.Console({
        newestOnTop: false
    });
    yconsole.render('#log');
    Y.Test.Runner.run();
});