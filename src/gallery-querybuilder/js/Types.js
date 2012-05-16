/**
 * @module gallery-querybuilder
 */

/**
 * @class QueryBuilder
 */

/**
 * <p>Mapping of variable types to plugin classes.  (Always introduce new
 * variable types rather than changing the existing mappings.)</p>
 * 
 * <dl>
 * <dt>string</dt>
 * <dd>Generic string.</dd>
 * <dt>number</dt>
 * <dd>Generic number.  You must specify appropriate validations, e.g., yiv-integer or yiv-decimal.</dd>
 * <dt>select</dt>
 * <dd>Generic list of values.</dd>
 * </dl>
 *
 * @property plugin_mapping
 * @type {Object}
 * @static
 */
QueryBuilder.plugin_mapping =
{
	string: QueryBuilder.String,
	number: QueryBuilder.String,
	select: QueryBuilder.Select
};
