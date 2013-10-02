YUI.add('gallery-funcprog-tests', function(Y) {
"use strict";

	var list = Y.all('#test div');

	Y.Test.Runner.add(new Y.Test.Case(
	{
		name: 'Functional programming',

		testEvery: function()
		{
			// array

			var count = 0;
			Y.Assert.isTrue(Y.every([1,2], function(v, i)
			{
				count++;
				return true;
			}));
			Y.Assert.areEqual(2, count);

			count = 0;
			Y.Assert.isFalse(Y.every([1,2], function(v, i)
			{
				count++;
				return false;
			}));
			Y.Assert.areEqual(1, count);

			// object

			count = 0;
			Y.Assert.isTrue(Y.every(
			{
				a: 1,
				b: 2
			},
			function(v, k)
			{
				count++;
				return true;
			}));
			Y.Assert.areEqual(2, count);

			count = 0;
			Y.Assert.isFalse(Y.every(
			{
				a: 1,
				b: 2
			},
			function(v, k)
			{
				count++;
				return false;
			}));
			Y.Assert.areEqual(1, count);

			// NodeList

			count = 0;
			Y.Assert.isTrue(Y.every(list, function(v, k)
			{
				count++;
				return true;
			}));
			Y.Assert.areEqual(3, count);

			count = 0;
			Y.Assert.isFalse(Y.every(list, function(v, k)
			{
				count++;
				return false;
			}));
			Y.Assert.areEqual(1, count);
		},

		testFilter: function()
		{
			// array

			var f = Y.filter([1,2,3,4], function(v,i)
			{
				return v >= 3 || i === 0;
			});

			Y.ArrayAssert.itemsAreEqual([1,3,4], f);

			// object

			var o = Y.filter({a:1,b:2,c:3,d:4}, function(v,k)
			{
				return v >= 3 || k == 'a';
			});

			Y.Assert.areEqual(3, Y.Object.keys(o).length);
			Y.ArrayAssert.containsItems(['a','c','d'], Y.Object.keys(o));
			Y.ArrayAssert.containsItems([1,3,4], Y.Object.values(o));

			// NodeList

			var f = Y.filter(list, function(n)
			{
				return n.hasClass('cc') || n.get('id') == 'a';
			});

			Y.Assert.areEqual(2, f.size());
			Y.Assert.areSame(list.item(0), f.item(0));
			Y.Assert.areSame(list.item(2), f.item(1));
		},

		testFind: function()
		{
			// array

			Y.Assert.areEqual(3,
				Y.find([1,2,3,4], function(v,i)
				{
					return i == 2;
				}));

			// object

			Y.Assert.areEqual(3,
				Y.find({a:1,b:2,c:3,d:4}, function(v,k)
				{
					return k == 'c';
				}));

			// NodeList

			Y.Assert.areSame(list.item(1),
				Y.find(list, function(n)
				{
					return n.hasClass('bb');
				}));
		},

		testMap: function()
		{
			// array

			Y.ArrayAssert.itemsAreEqual([1,4,9,16],
				Y.map([1,2,3,4], function(v,i)
				{
					return v*v;
				}));

			// object

			var o = Y.map({a:1,b:2,c:3,d:4}, function(v,k)
			{
				return v*v;
			});

			Y.Assert.areEqual(4, Y.Object.keys(o).length);
			Y.ArrayAssert.containsItems(['a','b','c','d'], Y.Object.keys(o));
			Y.ArrayAssert.containsItems([1,4,9,16], Y.Object.values(o));

			// NodeList

			Y.ArrayAssert.itemsAreEqual(['a','b','c'],
				Y.map(list, function(n)
				{
					return n.get('id');
				}));
		},

		testMapToObject: function()
		{
			var o = Y.Array.mapToObject([1,2,3,4], function(v,i)
			{
				return [ i, v*v ];
			});
			Y.Assert.areEqual(4, Y.Object.keys(o).length);
			Y.Assert.areEqual(1, o[0]);
			Y.Assert.areEqual(4, o[1]);
			Y.Assert.areEqual(9, o[2]);
			Y.Assert.areEqual(16, o[3]);
		},

		testPartition: function()
		{
			// array

			var o = Y.partition([1,2,3,4], function(v,i)
			{
				return v >= 3 || i === 0;
			});

			Y.ArrayAssert.itemsAreEqual([1,3,4], o.matches);
			Y.ArrayAssert.itemsAreEqual([2], o.rejects);

			// object

			var o = Y.partition({a:1,b:2,c:3,d:4}, function(v,k)
			{
				return v >= 3 || k == 'a';
			});

			Y.Assert.areEqual(3, Y.Object.keys(o.matches).length);
			Y.ArrayAssert.containsItems(['a','c','d'], Y.Object.keys(o.matches));
			Y.ArrayAssert.containsItems([1,3,4], Y.Object.values(o.matches));

			Y.Assert.areEqual(1, Y.Object.keys(o.rejects).length);
			Y.ArrayAssert.containsItems(['b'], Y.Object.keys(o.rejects));
			Y.ArrayAssert.containsItems([2], Y.Object.values(o.rejects));

			// NodeList

			var o = Y.partition(list, function(n)
			{
				return n.hasClass('bb');
			});

			Y.Assert.areEqual(1, o.matches.size());
			Y.Assert.areSame(list.item(1), o.matches.item(0));

			Y.Assert.areEqual(2, o.rejects.size());
			Y.Assert.areSame(list.item(0), o.rejects.item(0));
			Y.Assert.areSame(list.item(2), o.rejects.item(1));
		},

		testReduce: function()
		{
			// array

			Y.Assert.areEqual(10, Y.reduce([1,2,3,4], 0, function(s,v)
			{
				return s+v;
			}));

			Y.Assert.areEqual('abc', Y.reduce(['a','b','c'], '', function(s,v)
			{
				return s+v;
			}));

			// object

			Y.Assert.areEqual(10, Y.reduce({a:1,b:2,c:3,d:4}, 0, function(s,v)
			{
				return s+v;
			}));

			// NodeList

			Y.Assert.areEqual('abc', Y.reduce(list, '',
				function(s,n)
				{
					return s + n.get('id');
				}));
		},

		testReduceRight: function()
		{
			// array

			Y.Assert.areEqual(10, Y.reduceRight([1,2,3,4], 0, function(s,v)
			{
				return s+v;
			}));

			Y.Assert.areEqual('cba', Y.reduceRight(['a','b','c'], '', function(s,v)
			{
				return s+v;
			}));

			// object

			Y.Assert.areEqual(10, Y.reduceRight({a:1,b:2,c:3,d:4}, 0, function(s,v)
			{
				return s+v;
			}));

			// NodeList

			Y.Assert.areEqual('cba', Y.reduceRight(list, '',
				function(s,n)
				{
					return s + n.get('id');
				}));
		},

		testReject: function()
		{
			// array

			var f = Y.reject([1,2,3,4], function(v,i)
			{
				return v >= 3 || i === 0;
			});

			Y.ArrayAssert.itemsAreEqual([2], f);

			// object

			var o = Y.reject({a:1,b:2,c:3,d:4}, function(v,k)
			{
				return v >= 3 || k == 'a';
			});

			Y.Assert.areEqual(1, Y.Object.keys(o).length);
			Y.ArrayAssert.containsItems(['b'], Y.Object.keys(o));
			Y.ArrayAssert.containsItems([2], Y.Object.values(o));

			// NodeList

			var f = Y.reject(list, function(n)
			{
				return n.hasClass('bb');
			});

			Y.Assert.areEqual(2, f.size());
			Y.Assert.areSame(list.item(0), f.item(0));
			Y.Assert.areSame(list.item(2), f.item(1));
		}
	}));

}, '@VERSION@', {requires:['gallery-funcprog','test','gallery-nodelist-extras2']});
