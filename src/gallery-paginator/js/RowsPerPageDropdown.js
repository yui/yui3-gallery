/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the rows-per-page dropdown
 *
 * @class Paginator.ui.RowsPerPageDropdown
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.RowsPerPageDropdown = function (p) {
    this.paginator = p;

    p.on('destroy',this.destroy,this);
    p.after('rowsPerPageChange',this.update,this);
    p.after('totalRecordsChange',this._handleTotalRecordsChange,this);
    p.after('disabledChange',this.update,this);

    p.after('rowsPerPageDropdownClassChange',this.rebuild,this);
    p.after('rowsPerPageDropdownTitleChange',this.rebuild,this);
    p.after('rowsPerPageOptionsChange',this.rebuild,this);
};

/**
 * CSS class assigned to the select node
 * @attribute rowsPerPageDropdownClass
 * @default 'yui-paginator-rpp-options'
 */
Paginator.ATTRS.rowsPerPageDropdownClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'rpp-options'),
    validator : Y.Lang.isString
};

/**
 * CSS class assigned to the select node
 * @attribute rowsPerPageDropdownTitle
 * @default 'Rows per page'
 */
Paginator.ATTRS.rowsPerPageDropdownTitle =
{
    value : 'Rows per page',
    validator : Y.Lang.isString
};

/**
 * Array of available rows-per-page sizes.  Converted into select options.
 * Array values may be positive integers or object literals in the form<br>
 * { value : NUMBER, text : STRING }
 * @attribute rowsPerPageOptions
 * @default []
 */
Paginator.ATTRS.rowsPerPageOptions =
{
    value : [],
    validator : Y.Lang.isArray
};

Paginator.ui.RowsPerPageDropdown.prototype = {

    /**
     * select node
     * @property select
     * @type HTMLElement
     * @private
     */
    select  : null,


    /**
     * option node for the optional All value
     *
     * @property all
     * @type HTMLElement
     * @protected
     */
    all : null,


    /**
     * Removes the select node and clears event listeners
     * @method destroy
     * @private
     */
    destroy : function () {
        this.select.remove().destroy(true);
        this.all = this.select = null;
    },

    /**
     * Generate the select and option nodes and returns the select node.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {
        if (this.select) {
            this.select.remove().destroy(true);
        }

        this.select = Y.Node.create(
            '<select id="'+id_base+'-rpp"></select>');
        this.select.on('change',this.onChange,this);

        this.rebuild();

        return this.select;
    },

    /**
     * (Re)generate the select options.
     * @method rebuild
     */
    rebuild : function (e) {
        var p       = this.paginator,
            sel     = this.select,
            options = p.get('rowsPerPageOptions'),
            opts    = Y.Node.getDOMNode(sel).options,
            opt,cfg,val,i,len;

        this.all = null;

        sel.set('className', this.paginator.get('rowsPerPageDropdownClass'));
        sel.set('title', this.paginator.get('rowsPerPageDropdownTitle'));

        for (i = 0, len = options.length; i < len; ++i) {
            cfg = options[i];
            opt = opts[i] || sel.appendChild(Y.Node.create('<option/>'));
            val = Y.Lang.isValue(cfg.value) ? cfg.value : cfg;
            opt.set('innerHTML', Y.Lang.isValue(cfg.text) ? cfg.text : cfg);

            if (Y.Lang.isString(val) && val.toLowerCase() === 'all') {
                this.all  = opt;
                opt.set('value', p.get('totalRecords'));
            } else{
                opt.set('value', val);
            }

        }

        while (opts.length > options.length) {
            sel.get('lastChild').remove(true);
        }

        this.update();
    },

    /**
     * Select the appropriate option if changed.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        if (e && e.prevVal === e.newVal) {
            return;
        }

        var rpp     = this.paginator.get('rowsPerPage')+'',
            options = Y.Node.getDOMNode(this.select).options,
            i,len;

        for (i = 0, len = options.length; i < len; ++i) {
            if (options[i].value === rpp) {
                options[i].selected = true;
                break;
            }
        }

        this.select.set('disabled', this.paginator.get('disabled'));
    },

    /**
     * Listener for the select's onchange event.  Sent to setRowsPerPage method.
     * @method onChange
     * @param e {DOMEvent} The change event
     */
    onChange : function (e) {
        this.paginator.setRowsPerPage(
            parseInt(Y.Node.getDOMNode(this.select).options[this.select.get('selectedIndex')].value,10));
    },

    /**
     * Updates the all option value (and Paginator's rowsPerPage attribute if
     * necessary) in response to a change in the Paginator's totalRecords.
     *
     * @method _handleTotalRecordsChange
     * @param e {Event} attribute change event
     * @protected
     */
    _handleTotalRecordsChange : function (e) {
        if (!this.all || (e && e.prevVal === e.newVal)) {
            return;
        }

        this.all.set('value', e.newVal);
        if (this.all.get('selected')) {
            this.paginator.set('rowsPerPage',e.newVal);
        }
    }
};
