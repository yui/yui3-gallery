/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*global YUITest*/

YUI.add('module-tests', function (Y) {
    'use strict';
    var suite = new Y.Test.Suite('gallery-yqlmock'),
        A = YUITest.Assert,
        yqlmock;

    suite.add(new Y.Test.Case({
        setUp: function () {
            yqlmock = new Y.YQLMock();
        },
        tearDown: function () {
            yqlmock.restoreYQL();
            yqlmock = null;
        },

        'yqlmock - good': function () {
            var calledA = false,
                calledB = false;

            yqlmock.expect([{
                sql: "testAAAAAAA",
                params: {"foo": "bar"},
                opts: {"bar": "foo"}
            }, {
                sql: "testBBBBB",
                resultSet: {"myKey": "myValue"}
            }]);
            Y.YQL("testAAAAAAA", function (out) {
                A.areSame(0, Object.keys(out.query.results).length);
                calledA = true;
            }, {"foo": "bar"}, {"bar": "foo"});
            Y.YQL("testBBBBB", function (out) {
                A.areSame("myValue", out.query.results.myKey);
                calledB = true;
            });
            yqlmock.verify();
            A.isTrue(calledA && calledB);
        },

        'yqlmock - good, out of order object': function () {
            var called = false;

            yqlmock.expect({
                sql: "testAAAAAAA",
                params: {
                    a: "a",
                    b: "b",
                    c: {
                        aa: "aa",
                        bb: "bb"
                    }
                },
                opts: {
                    d: "d",
                    e: {
                        aa: "aa",
                        bb: {
                            aaa: "aaa",
                            bbb: "bbb"
                        }
                    }
                }
            });
            Y.YQL("testAAAAAAA", function (out) {
                A.areSame(0, Object.keys(out.query.results).length);
                called = true;
            }, {
                b: "b",
                c: {
                    bb: "bb",
                    aa: "aa"
                },
                a: "a"
            }, {
                e: {
                    bb: {
                        bbb: "bbb",
                        aaa: "aaa"
                    },
                    aa: "aa"
                },
                d: "d"
            });
            yqlmock.verify();
            A.isTrue(called);
        },

        'yqlmock - callback not required': function () {
            yqlmock.expect({
                sql: "testBBBBB",
                params: {"foo": "bar"},
                opts: {"bar": "foo"}
            });
            Y.YQL("testBBBBB", {"foo": "bar"}, {"bar": "foo"});
            yqlmock.verify();
        },

        'yqlmock - bad object expectation': function () {
            var called = false;
            try {
                yqlmock.expect();
            } catch (err) {
                A.areSame(1, err.errno);
                called = true;
            }
            A.isTrue(called);
        },

        'yqlmock - bad sql expectation': function () {
            var called = false;

            try {
                yqlmock.expect({
                    sql: {}
                });
            } catch (err) {
                A.areSame(2, err.errno);
                called = true;
            }
            A.isTrue(called);
        },

        'yqlmock - unexpected call': function () {
            var called = false;

            yqlmock.expect({
                sql: "testAAAAAAA",
                params: {"foo": "bar"},
                opts: {"bar": "foo"}
            });
            try {
                Y.YQL("testBBB", function (out) {
                    A.areSame(0, Object.keys(out.query.results).length);
                });
            } catch (err) {
                A.areSame(3, err.errno);
                called = true;
            }

            A.isTrue(called);
        },

        'yqlmock - unexpected call times': function () {
            var called = false;

            yqlmock.expect({
                sql: "testAAAAAAA",
                params: {"foo": "bar"},
                opts: {"bar": "foo"},
                callCount: 3
            });

            Y.YQL("testAAAAAAA", function (out) {
                A.areSame(0, Object.keys(out.query.results).length);
            }, {"foo": "bar"}, {"bar": "foo"});
            Y.YQL("testAAAAAAA", function (out) {
                A.areSame(0, Object.keys(out.query.results).length);
            }, {"foo": "bar"}, {"bar": "foo"});
            try {
                yqlmock.verify();
            } catch (err) {
                A.areSame(0, err.errno);
                called = true;
            }

            A.isTrue(called);
        },

        'yqlmock - yql release and mock': function () {
            var currentYUIYQL = Y.YQL;

            yqlmock.restoreYQL();
            A.areNotSame(String(Y.YQL), String(currentYUIYQL));
            yqlmock.mockYQL();
            A.areSame(String(Y.YQL), String(currentYUIYQL));
        }
    }));
    Y.Test.Runner.add(suite);
}, '', {requires: ['test']});