/*global YUI:true*/
YUI().use('pushpop-testlib', function (Y) {
    'use strict';
    var suite = new Y.Test.Suite("pushpop attribute functional test suite"),
        container2 = Y.pushpopTest.Instance,
        page = Y.Bottle.Page.getCurrent(),
        B = Y.bottleTest,

        LONG_WAITING = 1000,
        SHORT_WAITING = 500;

    suite.add(new Y.Test.Case({
        "test invalid attributes" : function () {
            page.set('underlay', '10');
            page.set('ppTrans', 1);
            page.set('pushFrom', 1);
            Y.pushpopTest.isNotInvalid();
        },
        "test set": function () {
            page.set('underlay', 'with');
            page.set('ppTrans', {"duration": 1});
            page.push(container2);

            this.wait(function () {
                Y.pushpopTest.hasPush();
                Y.pushpopTest.testSet(0, 'right');

            }, SHORT_WAITING);
        },
        "test basic push": function () {
            page.set('ppTrans', {"duration":1});
            page.push(container2);

            this.wait(function () {
                Y.pushpopTest.hasPush();

                this.wait(function () {
                    Y.pushpopTest.underlayIsNone();
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test basic pop": function () {
            page.pop(container2);

            this.wait(function () {
                Y.pushpopTest.testXDirection(1, 'right');

                this.wait(function () {
                    Y.pushpopTest.hasPop();
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the basic after underlay of push": function () {
            page.set('underlay', 'after');
            page.set('ppTrans', {"duration":0.5});
            page.push(container2);

            this.wait(function () {
                Y.pushpopTest.hasPush();

                this.wait(function () {
                    Y.pushpopTest.testXDirection(0, 'right');
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the basic after underlay of pop": function () {
            page.pop(container2);

            this.wait(function () {
                Y.pushpopTest.testXDirection(1, 'right');

                this.wait(function () {
                    Y.pushpopTest.containerIsReset();
                    Y.pushpopTest.hasPop();
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the basic with underlay of push": function () {
            page.set('underlay', 'with');
            page.set('ppTrans', {"duration":1});
            page.push(container2);

            this.wait(function () {
                Y.pushpopTest.hasPush();

                this.wait(function () {
                    Y.pushpopTest.testXDirection(0, 'right');
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the basic with underlay of pop": function () {
            page.pop(container2);

            this.wait(function () {
                Y.pushpopTest.testXDirection(1, 'right');

                this.wait(function () {
                    Y.pushpopTest.containerIsReset();
                    Y.pushpopTest.hasPop();
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the left direction of with underlay of push": function () {
            page.set('pushFrom', 'left');
            page.push(container2);

            this.wait(function () {
                Y.pushpopTest.hasPush();

                this.wait(function () {
                    Y.pushpopTest.testXDirection(0, 'left');
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the left direction of with underlay of pop": function () {
            page.pop(container2);

            this.wait(function () {
                Y.pushpopTest.testXDirection(1, 'left');

                this.wait(function () {
                    Y.pushpopTest.containerIsReset();
                    Y.pushpopTest.hasPop();
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the top direction of with underlay of push": function () {
            page.set('pushFrom', 'top');
            page.push(container2);

            this.wait(function () {
                Y.pushpopTest.hasPush();

                this.wait(function () {
                    Y.pushpopTest.testYDirection(0, 'top');
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the top direction of with underlay of pop": function () {
            page.pop(container2);

            this.wait(function () {
                Y.pushpopTest.testYDirection(1, 'top');

                this.wait(function () {
                    Y.pushpopTest.containerIsReset();
                    Y.pushpopTest.hasPop();
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the bottom direction of with underlay of push": function () {
            page.set('pushFrom', 'bottom');
            page.push(container2);

            this.wait(function () {
                Y.pushpopTest.hasPush();

                this.wait(function () {
                    Y.pushpopTest.testYDirection(0, 'bottom');
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the bottom direction of with underlay of pop": function () {
            page.pop(container2);

            this.wait(function () {
                Y.pushpopTest.testYDirection(1, 'bottom');

                this.wait(function () {
                    Y.pushpopTest.containerIsReset();
                    Y.pushpopTest.hasPop();
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the tr direction of with underlay of push": function () {
            page.set('pushFrom', 'tr');
            page.push(container2);

            this.wait(function () {
                Y.pushpopTest.hasPush();

                this.wait(function () {
                    Y.pushpopTest.testXDirection(0, 'right');
                    Y.pushpopTest.testYDirection(0, 'top');
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the tr direction of with underlay of pop": function () {
            page.pop(container2);

            this.wait(function () {
                Y.pushpopTest.testXDirection(1, 'right');
                Y.pushpopTest.testYDirection(1, 'top');

                this.wait(function () {
                    Y.pushpopTest.containerIsReset();
                    Y.pushpopTest.hasPop();
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the br direction of with underlay of push": function () {
            page.set('pushFrom', 'br');
            page.push(container2);

            this.wait(function () {
                Y.pushpopTest.hasPush();

                this.wait(function () {
                    Y.pushpopTest.testXDirection(0, 'right');
                    Y.pushpopTest.testYDirection(0, 'bottom');
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the br direction of with underlay of pop": function () {
            page.pop(container2);

            this.wait(function () {
                Y.pushpopTest.testXDirection(1, 'right');
                Y.pushpopTest.testYDirection(1, 'bottom');

                this.wait(function () {
                    Y.pushpopTest.containerIsReset();
                    Y.pushpopTest.hasPop();
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the tl direction of with underlay of push": function () {
            page.set('pushFrom', 'tl');
            page.push(container2);

            this.wait(function () {
                Y.pushpopTest.hasPush();

                this.wait(function () {
                    Y.pushpopTest.testXDirection(0, 'left');
                    Y.pushpopTest.testYDirection(0, 'top');
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the tl direction of with underlay of pop": function () {
            page.pop(container2);

            this.wait(function () {
                Y.pushpopTest.testXDirection(1, 'left');
                Y.pushpopTest.testYDirection(1, 'top');

                this.wait(function () {
                    Y.pushpopTest.containerIsReset();
                    Y.pushpopTest.hasPop();
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the bl direction of with underlay of push": function () {
            page.set('pushFrom', 'bl');
            page.push(container2);

            this.wait(function () {
                Y.pushpopTest.hasPush();

                this.wait(function () {
                    Y.pushpopTest.testXDirection(0, 'left');
                    Y.pushpopTest.testYDirection(0, 'bottom');
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
        "test the bl direction of with underlay of pop": function () {
            page.pop(container2);

            this.wait(function () {
                Y.pushpopTest.testXDirection(1, 'left');
                Y.pushpopTest.testYDirection(1, 'bottom');

                this.wait(function () {
                    Y.pushpopTest.containerIsReset();
                    Y.pushpopTest.hasPop();
                }, LONG_WAITING);

            }, SHORT_WAITING);
        },
    }));

    Y.Test.Runner.add(suite);
    B.run();
});
