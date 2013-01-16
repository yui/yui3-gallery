YUI.add('gallery-algorithms-tests', function(Y) {
"use strict";

	Y.Test.Runner.add(new Y.Test.Case(
	{
		name: 'Algorithms',

		testSwap: function()
		{
			var list = [1,2,3];
			Y.Array.swap(list, 0, 2)
			Y.ArrayAssert.itemsAreSame([3,2,1], list);
		},

		testCompareStringsCaseSensitive: function()
		{
			Y.Assert.areSame( 0, Y.Array.compareStringsCaseSensitive("ABC", "ABC"));
			Y.Assert.areSame(-1, Y.Array.compareStringsCaseSensitive("ABC", "BCA"));
			Y.Assert.areSame( 1, Y.Array.compareStringsCaseSensitive("BCA", "ABC"));

			Y.Assert.areSame( 0, Y.Array.compareStringsCaseSensitive("abc", "abc"));
			Y.Assert.areSame(-1, Y.Array.compareStringsCaseSensitive("ABC", "abc"));
			Y.Assert.areSame( 1, Y.Array.compareStringsCaseSensitive("abc", "BCA"));
		},

		testCompareStringsCaseInsensitive: function()
		{
			Y.Assert.areSame( 0, Y.Array.compareStringsCaseInsensitive("ABC", "ABC"));
			Y.Assert.areSame( 0, Y.Array.compareStringsCaseInsensitive("ABC", "abc"));
			Y.Assert.areSame(-1, Y.Array.compareStringsCaseInsensitive("abc", "BCA"));
			Y.Assert.areSame( 1, Y.Array.compareStringsCaseInsensitive("BCA", "abc"));
		},

		testQuickSort: function()
		{
			var list = ['a'];
			Y.Array.quickSort(list)
			Y.ArrayAssert.itemsAreSame(['a'], list);

			list = ['a','b'];
			Y.Array.quickSort(list)
			Y.ArrayAssert.itemsAreSame(['a','b'], list);

			list = ['b','a'];
			Y.Array.quickSort(list)
			Y.ArrayAssert.itemsAreSame(['a','b'], list);

			list = ['b','c','a'];
			Y.Array.quickSort(list)
			Y.ArrayAssert.itemsAreSame(['a','b','c'], list);
		},

		testBinarySearch: function()
		{
			Y.Assert.isNull(Y.Array.binarySearch());
			Y.Assert.isNull(Y.Array.binarySearch([]));
			Y.Assert.isNull(Y.Array.binarySearch(['a']));

			var list = ['a'];
			Y.Assert.areSame(0, Y.Array.binarySearch(list, 'a'));
			Y.Assert.areSame(-1, Y.Array.binarySearch(list, 'b'));

			list = ['a','f','k'];
			Y.Assert.areSame(0, Y.Array.binarySearch(list, 'a'));
			Y.Assert.areSame(-1, Y.Array.binarySearch(list, 'b'));
			Y.Assert.areSame(1, Y.Array.binarySearch(list, 'f'));
			Y.Assert.areSame(2, Y.Array.binarySearch(list, 'k'));

			list = ['a','c','e','f','h','k','m','o','q','s','t','u','x'];
			Y.Assert.areSame(0, Y.Array.binarySearch(list, 'a'));
			Y.Assert.areSame(-1, Y.Array.binarySearch(list, 'b'));
			Y.Assert.areSame(3, Y.Array.binarySearch(list, 'f'));
			Y.Assert.areSame(5, Y.Array.binarySearch(list, 'k'));
			Y.Assert.areSame(12, Y.Array.binarySearch(list, 'x'));
			Y.Assert.areSame(-1, Y.Array.binarySearch(list, 'z'));
		}
	}));

}, '@VERSION@', {requires:['gallery-algorithms','test']});
