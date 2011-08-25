/**
 * This patch addresses YUI tickets #2529920, #2529921
 * 
 * #2529920 - Documentation refers to the cell formatter function having access to the TD element, but the TD reference is not passed.
 * http://yuilibrary.com/projects/yui3/ticket/2529920
 * 
 * #2529921 - {value} template is shown when the record data is null or undefined
 * http://yuilibrary.com/projects/yui3/ticket/2529921
 * 
 * The {value} token remains because Y.substitute does not delete invalid tokens, in case that they
 * are later used for recursive substitutions. One possible fix could be to have substitute delete tokens
 * if the recursive option is not set.
 *
 * @module gallery-user-patch-2529920-2529921
 * @requires datatable
 */

// Default: '<td headers="{headers}"><div class="'+CLASS_LINER+'">{value}</div></td>'
// Changed in this fix because the value is not supplied at the Ysubstitute stage, it is appended to the liner.
var YgetClassName = Y.ClassNameManager.getClassName,
    DATATABLE = "datatable",
    CLASS_LINER = YgetClassName(DATATABLE, "liner"),
    TD_TEMPLATE = '<td headers="{headers}" class="{classnames}"><div class="'+CLASS_LINER+'"></div></td>';

Y.DataTable.Base.prototype._createTbodyTdNode = function(o) {
    var column = o.column,
        formatvalue = null;
        
    //TODO: attributes? or methods?
    o.headers = column.headers;
    o.classnames = column.get("classnames");
    o.td = Y.Node.create(Y.substitute(TD_TEMPLATE, o));
    o.liner = o.td.one('div');

    formatvalue = this.formatDataCell(o);

    // Formatters should return a string value to be appended, lack of a string here indicates that the formatter has utilised 
    // the o.td reference to populate the cell.
    if (Y.Lang.isString(formatvalue)) {
        o.value = formatvalue;
        o.liner.append(formatvalue);
    }

    return o.td;
};

// Use a custom function in the substitution to omit null results
// Realistically, Y.sub should have an option to remove and not preserve tokens.
Y.DataTable.Base.prototype.formatDataCell = function(o) {
    var record = o.record,
        column = o.column,
        formatter = column.get("formatter"),
        fnSubstituteNulls = function(key, v, meta) {
            return Y.Lang.isNull(v) || Y.Lang.isUndefined(v) ? "" : v;
        };
    
    o.data = record.get("data");
    o.value = record.getValue(column.get("field"));
    return Y.Lang.isString(formatter) ?
        Y.substitute(formatter, o, fnSubstituteNulls) : // Custom template
        Y.Lang.isFunction(formatter) ?
            formatter.call(this, o) :  // Custom function
            Y.substitute(this.get("tdValueTemplate"), o, fnSubstituteNulls);  // Default template
};