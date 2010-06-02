// global mapping of variable types to plugin classes
// (always introduce new variable types rather than changing the existing mappings)

QueryBuilder.plugin_mapping =
{
	string: QueryBuilder.String,
	number: QueryBuilder.String,
	select: QueryBuilder.Select
};
