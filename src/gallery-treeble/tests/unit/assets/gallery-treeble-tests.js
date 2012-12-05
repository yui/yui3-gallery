YUI.add('gallery-treeble-tests', function(Y) {
"use strict";

	var raw_data =
	[
		{title:"Fantasy",
			kiddies:
			[
				{year:"1898-1963", title:"C.S. Lewis",
					kiddies:
					[
						{year:"1950-1956", title:"Narnia",
							kiddies:
							[
								{year:1950, quantity:10, title:"The Lion, the Witch and the Wardrobe"},
								{year:1951, quantity:5, title:"Prince Caspian: The Return to Narnia"},
								{year:1952, quantity:2, title:"The Voyage of the Dawn Treader"},
								{year:1953, quantity:6, title:"The Silver Chair"},
								{year:1954, quantity:9, title:"The Horse and His Boy"},
								{year:1955, quantity:4, title:"The Magician's Nephew"},
								{year:1956, quantity:8, title:"The Last Battle"}
							]},
						{year:"1938-1945", title:"Space Trilogy",
							kiddies:
							[
								{year:1938, quantity:10, title:"Out of the Silent Planet"},
								{year:1943, quantity:5, title:"Perelandra"},
								{year:1945, quantity:2, title:"That Hideous Strength"}
							]}
					]},
				{year:"1946-", title:"Philip Pullman",
					kiddies:
					[
						{year:"1995-2000", title:"His Dark Materials",
							kiddies:
							[
								{year:1995, quantity:7, title:"Northern Lights"},
								{year:1997, quantity:5, title:"The Subtle Knife"},
								{year:2000, quantity:8, title:"The Amber Spyglass"}
							]}
					]},
				{year:"1892-1973", title:"J. R. R. Tolkien",
					kiddies:
					[
						{year:1937, quantity:5, title:"The Hobbit"},
						{year:"1937-1949", title:"The Lord of the Rings",
							kiddies:
							[
								{year:1955, quantity:12, title:"The Fellowship of the Ring"},
								{year:1955, quantity:0, title:"The Two Towers"},
								{year:1955, quantity:8, title:"The Return of the King"}
							]}
					]}
			]},
		{title:"Science Fiction", _open: true,
			kiddies:
			[
				{year:"1928-1982", title:"Philip K. Dick",
					kiddies:
					[
						{year:1966, quantity:5, title:"Do Androids Dream of Electric Sheep?"}
					]},
				{year:"1907-1988", title:"Robert A. Heinlein", _open: true,
					kiddies:
					[
						{year:1959, quantity:4, title:"Starship Troopers"},
						{year:1961, quantity:7, title:"Stranger in a Strange Land"},
						{year:1966, quantity:3, title:"The Moon Is a Harsh Mistress"}
					]},
				{year:"1912-2000", title:"A. E. van Vogt",
					kiddies:
					[
						{year:1946, quantity:3, title:"Slan"},
						{year:1950, quantity:5, title:"The Voyage of the Space Beagle"},
						{year:1970, quantity:8, title:"Quest for the Future"}
					]}
			]},
		{title:"Science", _open: true,
			kiddies:
			[
				{year:"1809-1882", title:"Charles Robert Darwin",
					kiddies:
					[
						{year:1859, quantity:5, title:"On the Origin of Species by Means of Natural Selection, or the Preservation of Favoured Races in the Struggle for Life"},
						{year:1881, quantity:2, title:"The Formation of Vegetable Mould through the Action of Worms"}
					]},
				{year:"1879-1955", title:"Albert Einstein",
					kiddies:
					[
						{year:1905, quantity:8, title:"On a Heuristic Viewpoint Concerning the Production and Transformation of Light"},
						{year:1905, quantity:5, title:"On the Electrodynamics of Moving Bodies"},
						{year:1917, quantity:7, title:"Kosmologische Betrachtungen zur allgemeinen Relativit&auml;tstheorie"},
						{year:1935, quantity:3, title:"Can Quantum-Mechanical Description of Physical Reality Be Considered Complete?"}
					]},
				{year:"1564-1642", title:"Galileo Galilei",
					kiddies:
					[
						{year:1610, quantity:5, title:"Sidereus Nuncius"},
						{year:1615, quantity:2, title:"Letter to the Grand Duchess Christina"},
						{year:1632, quantity:6, title:"Dialogo sopra i due massimi sistemi del mondo"}
					]},
				{year:"1643-1727", title:"Isaac Newton",
					kiddies:
					[
						{year:1671, quantity:7, title:"Method of Fluxions"},
						{year:1687, quantity:4, title:"Philosophi&aelig; Naturalis Principia Mathematica"},
						{year:1704, quantity:3, title:"Opticks"},
						{year:'1701-25', quantity:13, title:"Reports as Master of the Mint"}
					]}
			]},
		{title:"Xenobiology"}
	];

	// treeble config to be set on root datasource

	var schema =
	{
		resultFields:
		[
			'quantity','year','title', '_open',
			{key: 'kiddies', parser: 'treebledatasource'}
		]
	};

	var schema_plugin_config =
	{
		fn:  Y.Plugin.DataSourceArraySchema,
		cfg: {schema:schema}
	};

	var treeble_config =
	{
		generateRequest:        function() { },
		schemaPluginConfig:     schema_plugin_config,
		childNodesKey:          'kiddies',
		nodeOpenKey:            '_open',
		totalRecordsReturnExpr: '.meta.totalRecords'
	};

	Y.Test.Runner.add(new Y.Test.Case(
	{
		name: 'TreebleDataSource-PaginateRoots',

		setUp: function()
		{
			var root            = new Y.DataSource.Local({source: raw_data});
			root.treeble_config = Y.clone(treeble_config, true);
			root.plug(Y.clone(schema_plugin_config, true));

			this.ds = new Y.DataSource.Treeble(
			{
				root:             root,
				paginateChildren: false,
				uniqueIdKey:      'title'
			});
		},

		testPaginateRoots1: function()
		{
			this.ds.sendRequest(
			{
				request:
				{
					startIndex:  3,
					resultCount: 1
				},
				callback:
				{
					success: function(e)
					{
						Y.Assert.isNotUndefined(e.response);
						Y.Assert.isArray(e.response.results);

						var data = e.response.results;
						Y.Assert.areSame(1, data.length);
						Y.Assert.areSame(raw_data[3].title, data[0].title);
						Y.Assert.isNull(data[0].kiddies);
					},
					failure: function(e)
					{
						Y.Assert.fail('TreebleDataSource returned failure.');
					}
				}
			});
		},

		testPaginateRoots2: function()
		{
			var test = this;

			this.ds.sendRequest(
			{
				request:
				{
					startIndex:  1,
					resultCount: 2
				},
				callback:
				{
					success: function(e)
					{
						test.resume(function()
						{
							Y.Assert.isNotUndefined(e.response);
							Y.Assert.isArray(e.response.results);

							var data = e.response.results;
							Y.Assert.areSame(12, data.length);
							Y.Assert.areSame(raw_data[1].title, data[0].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[0].kiddies);

							Y.Assert.areSame(raw_data[1].kiddies[0].title, data[1].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[1].kiddies);
							Y.Assert.areSame(raw_data[1].kiddies[1].title, data[2].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[2].kiddies);

							Y.Assert.areSame(raw_data[1].kiddies[1].kiddies[0].title, data[3].title);
							Y.Assert.isNull(data[3].kiddies);
							Y.Assert.areSame(raw_data[1].kiddies[1].kiddies[1].title, data[4].title);
							Y.Assert.isNull(data[4].kiddies);
							Y.Assert.areSame(raw_data[1].kiddies[1].kiddies[2].title, data[5].title);
							Y.Assert.isNull(data[5].kiddies);

							Y.Assert.areSame(raw_data[1].kiddies[2].title, data[6].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[6].kiddies);

							Y.Assert.areSame(raw_data[2].title, data[7].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[7].kiddies);

							Y.Assert.isTrue(test.ds.isOpen([1]));
							Y.Assert.isTrue(test.ds.isOpen([1, 1]));
							Y.Assert.isTrue(test.ds.isOpen([2]));
						});
					},
					failure: function(e)
					{
						test.resume(function()
						{
							Y.Assert.fail('TreebleDataSource returned failure.');
						});
					}
				}
			});

			this.wait(1000);
		},

		testPaginateRoots3: function()
		{
			var test = this;

			this.ds.sendRequest(
			{
				request:
				{
					startIndex:  0,
					resultCount: 1
				},
				callback:
				{
					success: function(e)
					{
						Y.Assert.isNotUndefined(e.response);
						Y.Assert.isArray(e.response.results);

						var data = e.response.results;
						Y.Assert.areSame(1, data.length);
						Y.Assert.areSame(raw_data[0].title, data[0].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[0].kiddies);
					},
					failure: function(e)
					{
						Y.Assert.fail('TreebleDataSource returned failure.');
					}
				}
			});

			Y.Assert.isFalse(test.ds.isOpen([0]));
			this.ds.toggle([0], {}, function()
			{
				Y.Assert.isTrue(test.ds.isOpen([0]));
			});

			this.ds.sendRequest(
			{
				request:
				{
					startIndex:  0,
					resultCount: 1
				},
				callback:
				{
					success: function(e)
					{
						Y.Assert.isNotUndefined(e.response);
						Y.Assert.isArray(e.response.results);

						var data = e.response.results;
						Y.Assert.areSame(4, data.length);
						Y.Assert.areSame(raw_data[0].title, data[0].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[0].kiddies);

						Y.Assert.areSame(raw_data[0].kiddies[0].title, data[1].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[1].kiddies);
						Y.Assert.areSame(raw_data[0].kiddies[1].title, data[2].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[2].kiddies);
						Y.Assert.areSame(raw_data[0].kiddies[2].title, data[3].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[3].kiddies);
					},
					failure: function(e)
					{
						Y.Assert.fail('TreebleDataSource returned failure.');
					}
				}
			});

			Y.Assert.isFalse(test.ds.isOpen([0, 1]));
			this.ds.toggle([0, 1], {}, function()
			{
				Y.Assert.isTrue(test.ds.isOpen([0, 1]));
			});

			this.ds.sendRequest(
			{
				request:
				{
					startIndex:  0,
					resultCount: 1
				},
				callback:
				{
					success: function(e)
					{
						Y.Assert.isNotUndefined(e.response);
						Y.Assert.isArray(e.response.results);

						var data = e.response.results;
						Y.Assert.areSame(5, data.length);
						Y.Assert.areSame(raw_data[0].title, data[0].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[0].kiddies);

						Y.Assert.areSame(raw_data[0].kiddies[0].title, data[1].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[1].kiddies);
						Y.Assert.areSame(raw_data[0].kiddies[1].title, data[2].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[2].kiddies);

						Y.Assert.areSame(raw_data[0].kiddies[1].kiddies[0].title, data[3].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[3].kiddies);

						Y.Assert.areSame(raw_data[0].kiddies[2].title, data[4].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[4].kiddies);
					},
					failure: function(e)
					{
						Y.Assert.fail('TreebleDataSource returned failure.');
					}
				}
			});

			Y.Assert.isFalse(test.ds.isOpen([0, 1, 0]));
			this.ds.toggle([0, 1, 0], {}, function()
			{
				Y.Assert.isTrue(test.ds.isOpen([0, 1, 0]));
			});

			this.ds.sendRequest(
			{
				request:
				{
					startIndex:  0,
					resultCount: 1
				},
				callback:
				{
					success: function(e)
					{
						Y.Assert.isNotUndefined(e.response);
						Y.Assert.isArray(e.response.results);

						var data = e.response.results;
						Y.Assert.areSame(8, data.length);
						Y.Assert.areSame(raw_data[0].title, data[0].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[0].kiddies);

						Y.Assert.areSame(raw_data[0].kiddies[0].title, data[1].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[1].kiddies);
						Y.Assert.areSame(raw_data[0].kiddies[1].title, data[2].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[2].kiddies);

						Y.Assert.areSame(raw_data[0].kiddies[1].kiddies[0].title, data[3].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[3].kiddies);

						Y.Assert.areSame(raw_data[0].kiddies[1].kiddies[0].kiddies[0].title, data[4].title);
						Y.Assert.isNull(data[4].kiddies);
						Y.Assert.areSame(raw_data[0].kiddies[1].kiddies[0].kiddies[1].title, data[5].title);
						Y.Assert.isNull(data[5].kiddies);
						Y.Assert.areSame(raw_data[0].kiddies[1].kiddies[0].kiddies[2].title, data[6].title);
						Y.Assert.isNull(data[6].kiddies);

						Y.Assert.areSame(raw_data[0].kiddies[2].title, data[7].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[7].kiddies);
					},
					failure: function(e)
					{
						Y.Assert.fail('TreebleDataSource returned failure.');
					}
				}
			});

			Y.Assert.isTrue(test.ds.isOpen([0, 1]));
			this.ds.toggle([0, 1], {}, function()
			{
				Y.Assert.isFalse(test.ds.isOpen([0, 1]));
			});

			this.ds.sendRequest(
			{
				request:
				{
					startIndex:  0,
					resultCount: 1
				},
				callback:
				{
					success: function(e)
					{
						Y.Assert.isNotUndefined(e.response);
						Y.Assert.isArray(e.response.results);

						var data = e.response.results;
						Y.Assert.areSame(4, data.length);
						Y.Assert.areSame(raw_data[0].title, data[0].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[0].kiddies);

						Y.Assert.areSame(raw_data[0].kiddies[0].title, data[1].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[1].kiddies);
						Y.Assert.areSame(raw_data[0].kiddies[1].title, data[2].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[2].kiddies);
						Y.Assert.areSame(raw_data[0].kiddies[2].title, data[3].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[3].kiddies);
					},
					failure: function(e)
					{
						Y.Assert.fail('TreebleDataSource returned failure.');
					}
				}
			});
		}
	}));

	Y.Test.Runner.add(new Y.Test.Case(
	{
		name: 'TreebleDataSource-PaginateChildren',

		setUp: function()
		{
			var root            = new Y.DataSource.Local({source: raw_data});
			root.treeble_config = Y.clone(treeble_config, true);
			root.plug(Y.clone(schema_plugin_config, true));

			this.ds = new Y.DataSource.Treeble(
			{
				root:             root,
				paginateChildren: true,
				uniqueIdKey:      'title'
			});
		},

		testPaginateChildren1: function()
		{
			this.ds.sendRequest(
			{
				request:
				{
					startIndex:  3,
					resultCount: 1
				},
				callback:
				{
					success: function(e)
					{
						Y.Assert.isNotUndefined(e.response);
						Y.Assert.isArray(e.response.results);

						var data = e.response.results;
						Y.Assert.areSame(1, data.length);
						Y.Assert.areSame(raw_data[3].title, data[0].title);
						Y.Assert.isNull(data[0].kiddies);
					},
					failure: function(e)
					{
						Y.Assert.fail('TreebleDataSource returned failure.');
					}
				}
			});
		},

		testPaginateChildren2: function()
		{
			var test = this;

			this.ds.sendRequest(
			{
				request:
				{
					startIndex:  1,
					resultCount: 8
				},
				callback:
				{
					success: function(e)
					{
						test.resume(function()
						{
							Y.Assert.isNotUndefined(e.response);
							Y.Assert.isArray(e.response.results);

							var data = e.response.results;
							Y.Assert.areSame(8, data.length);
							Y.Assert.areSame(raw_data[1].title, data[0].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[0].kiddies);

							Y.Assert.areSame(raw_data[1].kiddies[0].title, data[1].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[1].kiddies);
							Y.Assert.areSame(raw_data[1].kiddies[1].title, data[2].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[2].kiddies);

							Y.Assert.areSame(raw_data[1].kiddies[1].kiddies[0].title, data[3].title);
							Y.Assert.isNull(data[3].kiddies);
							Y.Assert.areSame(raw_data[1].kiddies[1].kiddies[1].title, data[4].title);
							Y.Assert.isNull(data[4].kiddies);
							Y.Assert.areSame(raw_data[1].kiddies[1].kiddies[2].title, data[5].title);
							Y.Assert.isNull(data[5].kiddies);

							Y.Assert.areSame(raw_data[1].kiddies[2].title, data[6].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[6].kiddies);

							Y.Assert.areSame(raw_data[2].title, data[7].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[7].kiddies);

							Y.Assert.isTrue(test.ds.isOpen([1]));
							Y.Assert.isTrue(test.ds.isOpen([1, 1]));
							Y.Assert.isTrue(test.ds.isOpen([2]));
						});
					},
					failure: function(e)
					{
						test.resume(function()
						{
							Y.Assert.fail('TreebleDataSource returned failure.');
						});
					}
				}
			});

			this.wait(1000);
		},

		testPaginateChildren3: function()
		{
			var test = this;

			this.ds.sendRequest(
			{
				request:
				{
					startIndex:  1,
					resultCount: 4
				},
				callback:
				{
					success: function(e)
					{
						test.resume(function()
						{
							Y.Assert.isNotUndefined(e.response);
							Y.Assert.isArray(e.response.results);

							var data = e.response.results;
							Y.Assert.areSame(4, data.length);
							Y.Assert.areSame(raw_data[1].title, data[0].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[0].kiddies);

							Y.Assert.areSame(raw_data[1].kiddies[0].title, data[1].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[1].kiddies);
							Y.Assert.areSame(raw_data[1].kiddies[1].title, data[2].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[2].kiddies);

							Y.Assert.areSame(raw_data[1].kiddies[1].kiddies[0].title, data[3].title);
							Y.Assert.isNull(data[3].kiddies);

							Y.Assert.isTrue(test.ds.isOpen([1]));
							Y.Assert.isTrue(test.ds.isOpen([1, 1]));
						});
					},
					failure: function(e)
					{
						test.resume(function()
						{
							Y.Assert.fail('TreebleDataSource returned failure.');
						});
					}
				}
			});

			this.wait(1000);
		},

		testPaginateChildren4: function()
		{
			var test = this;

			this.ds.sendRequest(
			{
				request:
				{
					startIndex:  0,
					resultCount: 1
				},
				callback:
				{
					success: function(e)
					{
						Y.Assert.isNotUndefined(e.response);
						Y.Assert.isArray(e.response.results);

						var data = e.response.results;
						Y.Assert.areSame(1, data.length);
						Y.Assert.areSame(raw_data[0].title, data[0].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[0].kiddies);
					},
					failure: function(e)
					{
						Y.Assert.fail('TreebleDataSource returned failure.');
					}
				}
			});

			Y.Assert.isFalse(this.ds.isOpen([0]));
			this.ds.toggle([0], {}, function()
			{
				Y.Assert.isTrue(test.ds.isOpen([0]));
			});

			this.ds.sendRequest(
			{
				request:
				{
					startIndex:  0,
					resultCount: 3
				},
				callback:
				{
					success: function(e)
					{
						Y.Assert.isNotUndefined(e.response);
						Y.Assert.isArray(e.response.results);

						var data = e.response.results;
						Y.Assert.areSame(3, data.length);
						Y.Assert.areSame(raw_data[0].title, data[0].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[0].kiddies);

						Y.Assert.areSame(raw_data[0].kiddies[0].title, data[1].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[1].kiddies);
						Y.Assert.areSame(raw_data[0].kiddies[1].title, data[2].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[2].kiddies);
					},
					failure: function(e)
					{
						Y.Assert.fail('TreebleDataSource returned failure.');
					}
				}
			});

			Y.Assert.isFalse(this.ds.isOpen([0, 1]));
			this.ds.toggle([0, 1], {}, function()
			{
				Y.Assert.isTrue(test.ds.isOpen([0, 1]));
			});

			this.ds.sendRequest(
			{
				request:
				{
					startIndex:  0,
					resultCount: 5
				},
				callback:
				{
					success: function(e)
					{
						Y.Assert.isNotUndefined(e.response);
						Y.Assert.isArray(e.response.results);

						var data = e.response.results;
						Y.Assert.areSame(5, data.length);
						Y.Assert.areSame(raw_data[0].title, data[0].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[0].kiddies);

						Y.Assert.areSame(raw_data[0].kiddies[0].title, data[1].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[1].kiddies);
						Y.Assert.areSame(raw_data[0].kiddies[1].title, data[2].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[2].kiddies);

						Y.Assert.areSame(raw_data[0].kiddies[1].kiddies[0].title, data[3].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[3].kiddies);

						Y.Assert.areSame(raw_data[0].kiddies[2].title, data[4].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[4].kiddies);
					},
					failure: function(e)
					{
						Y.Assert.fail('TreebleDataSource returned failure.');
					}
				}
			});

			Y.Assert.isFalse(this.ds.isOpen([0, 1, 0]));
			this.ds.toggle([0, 1, 0], {}, function()
			{
				Y.Assert.isTrue(test.ds.isOpen([0, 1, 0]));
			});

			this.ds.sendRequest(
			{
				request:
				{
					startIndex:  0,
					resultCount: 6
				},
				callback:
				{
					success: function(e)
					{
						Y.Assert.isNotUndefined(e.response);
						Y.Assert.isArray(e.response.results);

						var data = e.response.results;
						Y.Assert.areSame(6, data.length);
						Y.Assert.areSame(raw_data[0].title, data[0].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[0].kiddies);

						Y.Assert.areSame(raw_data[0].kiddies[0].title, data[1].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[1].kiddies);
						Y.Assert.areSame(raw_data[0].kiddies[1].title, data[2].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[2].kiddies);

						Y.Assert.areSame(raw_data[0].kiddies[1].kiddies[0].title, data[3].title);
						Y.Assert.isInstanceOf(Y.DataSource.Local, data[3].kiddies);

						Y.Assert.areSame(raw_data[0].kiddies[1].kiddies[0].kiddies[0].title, data[4].title);
						Y.Assert.isNull(data[4].kiddies);
						Y.Assert.areSame(raw_data[0].kiddies[1].kiddies[0].kiddies[1].title, data[5].title);
						Y.Assert.isNull(data[5].kiddies);
					},
					failure: function(e)
					{
						Y.Assert.fail('TreebleDataSource returned failure.');
					}
				}
			});

			Y.Assert.isTrue(this.ds.isOpen([0, 1]));
			this.ds.toggle([0, 1], {}, function()
			{
				Y.Assert.isFalse(test.ds.isOpen([0, 1]));
			});

			this.ds.sendRequest(
			{
				request:
				{
					startIndex:  0,
					resultCount: 5
				},
				callback:
				{
					success: function(e)
					{
						test.resume(function()
						{
							Y.Assert.isNotUndefined(e.response);
							Y.Assert.isArray(e.response.results);

							var data = e.response.results;
							Y.Assert.areSame(5, data.length);
							Y.Assert.areSame(raw_data[0].title, data[0].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[0].kiddies);

							Y.Assert.areSame(raw_data[0].kiddies[0].title, data[1].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[1].kiddies);
							Y.Assert.areSame(raw_data[0].kiddies[1].title, data[2].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[2].kiddies);
							Y.Assert.areSame(raw_data[0].kiddies[2].title, data[3].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[3].kiddies);

							Y.Assert.areSame(raw_data[1].title, data[4].title);
							Y.Assert.isInstanceOf(Y.DataSource.Local, data[4].kiddies);
						});
					},
					failure: function(e)
					{
						test.resume(function()
						{
							Y.Assert.fail('TreebleDataSource returned failure.');
						});
					}
				}
			});

			this.wait(1000);
		}
	}));

}, '@VERSION@', {requires:['gallery-treeble','test']});
