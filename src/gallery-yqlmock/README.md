# YQL Mock

## Overview

Introduces yqlmock module and shows how to use it in tests to mock YUI.YQL calls.

## Setting up environment

Under the folder where you are going to run the tests, run

    npm install yqlmock --registry=http://ynpm-registry.corp.yahoo.com:4080/

## Usage

__Important__: This module will temporarily override YUI.YQL calls between the time that mock object is initialized to the time either verify() or restoreYQL() is called. To make sure it doesn't break your other test cases, please put either verify() or restoreYQL() at the end of your test cases that uses YQL mock.

__Important__: YUI.YQL and YUI.YQLRequest will work exactly the same in this module. You can do either of them to match expectations.

## Initialize Mock Object

In your test case, initialize a varible with Y.YQLMock() object. i.e.

    var mYql = new Y.YQLMock();

(We will refer mYql as our Mock object in the coming examples)

## Setting up expectations

You will need to explicitly specify all the YQL calls that will be made in the future of the current test case. An expectation object will consist of YUI.YQL input arguments: sql, params, opts (See [here](http://yuilibrary.com/yui/docs/api/classes/YQL.html)) and your desired query result. i.e.

    mYql.expect({
        sql:"SELECT * from myTable;",
        params: {
            extraStuff: "extraStuff"
        },
        opts: {
            proto: "https"
        },
        resultSet: [{
            "data": "myData1"
            }, {
            "data": "myData2"
        }],
        callCount: 2
        }]
    });

__Note__:

   * Callback is not needed in the object but the others need to be exactly what gets called later with YUI.YQL.
   * You can pass either an object or an array into expect().
   * You can specify the number of calls will be made in =callCount= attribute.

__Warning__: Each expectation objects differs by the =sql=, =params=, and =opts= data. If later on you pass in another object that has the same settings as any previous expectation, the old expectation will be replaced.

## Running YUI.YQL

Now you can just directly call YUI.YQL after setting up expectations.

    YUI.YQL({
        "SELECT * from myTable;",
        function(out) {
            // This is the callback function. "out" is the query result.
        },
        {
            extraStuff: "extraStuff"
        },
        {
            proto: "https"
        }
    });

Returning result will be automatically wrapped in =output.query.results=. i.e. In callback function

    function(out) {
        // Test with my expected result set.
        YUITest.Assert.areSame(ExpectedResultSet, out.query.results);
    }

__Note__: Often times you will use Y.YQL instead of YUI.YQL

## Verifying

To see whether you have met your expectations, you use verify(). i.e.

    mYql.verify();

__Note__: verify() will restore back YUI.YQL automatically. To restore YUI.YQL without verifying, use restoreYQL()

## Standalone test
You can put the following code into an html file and open it in a browser.

    <script src="http://yui.yahooapis.com/3.8.1/build/yui/yui-min.js"></script>
    <script src="https://git.corp.yahoo.com/Mojits/yqlmock/raw/master/yui_modules/yqlmock.js"></script>
    <script>
    YUI().use('yqlmock', "test", function (Y, NAME) {
        'use strict';
        var suite = new YUITest.TestSuite(NAME),
            A = YUITest.Assert,
            mYql;

        suite.add(new YUITest.TestCase({
            name: 'YQLMock tests',
            setUp: function () {
                // Initialize a YQLMock object
                mYql = new Y.YQLMock();
            },
            tearDown: function () {
                // Free the object
                mYql.restoreYQL();
                mYql = null;
            },

            'mYql - good': function () {
                var called = false;

                // Setting up two expectations.
                mYql.expect({
                    sql: "select * from internet",
                    resultSet: {
                        "foo": "bar"
                    }
                });

                // Do normal YUI.YQL calls.
                Y.YQL("select * from internet", function (out) {
                    A.areSame("bar", out.query.results.foo);
                    called = true;
                });

                // Verify expectations.
                mYql.verify();
                // Make sure callback is called.
                A.isTrue(called);
            }
        }));
        YUITest.TestRunner.add(suite);
        YUITest.TestRunner.run();
    });
    </script>

## FAQ: Error code analysis
   * Error Num: 0
      * Problem: Actual call count doesn't meet expected call count.
      * Suggested Solution: Check the log to see which configuration is having the problem.
   * Error Num: 1
      * Problem: Expectation Object is invalid.
      * Suggested Solution: Make sure the object you pass into expect() is an object or an array, and double check all of the object needs to have at least a "sql" attribute.
   * Error Num: 2
      * Problem: SQL passed in is not a string.
      * Suggested Solution: Make sure all of the sql, either in expectation or in YUI.YQL, is a type of string.
   * Error Num: 3
      * Problem: YUI.YQL input arguments not found in expectation.
      * Suggested Solution: Double check you expectation against the query you are going to run, and check the YUI.YQL input arguments.
__Note__: verify() will restore back YUI.YQL automatically. To restore YUI.YQL without verifying, use restoreYQL()

## References

* [Regular YUI.YQL usage](http://yuilibrary.com/yui/docs/api/classes/YQL.html)
