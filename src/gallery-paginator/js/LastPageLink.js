/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the link to jump to the last page.
 *
 * @class Paginator.ui.LastPageLink
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.LastPageLink = function (p) {
    this.paginator = p;

    p.on('destroy',this.destroy,this);
    p.after('recordOffsetChange',this.update,this);
    p.after('rowsPerPageChange',this.update,this);
    p.after('totalRecordsChange',this.update,this);
    p.after('disabledChange',this.update,this);

    p.after('lastPageLinkClassChange', this.rebuild, this);
    p.after('lastPageLinkLabelChange', this.rebuild, this);
};

/**
  * CSS class assigned to the link/span
  * @attribute lastPageLinkClass
  * @default 'yui-paginator-last'
  */
Paginator.ATTRS.lastPageLinkClass =
{
     value : Y.ClassNameManager.getClassName(Paginator.NAME, 'last'),
     validator : Y.Lang.isString
};

/**
 * Used as innerHTML for the last page link/span.
 * @attribute lastPageLinkLabel
 * @default 'last &gt;&gt;'
 */
Paginator.ATTRS.lastPageLinkLabel =
{
    value : 'last &gt;&gt;',
    validator : Y.Lang.isString
};

Paginator.ui.LastPageLink.prototype = {

    /**
     * Currently placed HTMLElement node
     * @property current
     * @type HTMLElement
     * @private
     */
    current   : null,

    /**
     * Link HTMLElement node
     * @property link
     * @type HTMLElement
     * @private
     */
    link      : null,

    /**
     * Span node (inactive link)
     * @property span
     * @type HTMLElement
     * @private
     */
    span      : null,

    /**
     * Empty place holder node for when the last page link is inappropriate to
     * display in any form (unlimited paging).
     * @property na
     * @type HTMLElement
     * @private
     */
    na        : null,


    /**
     * Removes the link/span node and clears event listeners
     * @method destroy
     * @private
     */
    destroy : function () {
        this.link.remove(true);
        this.span.remove(true);
        this.na.remove(true);
        this.current = this.link = this.span = this.na = null;
    },

    /**
     * Generate the nodes and return the appropriate node given the current
     * pagination state.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {
        var p     = this.paginator,
            c     = p.get('lastPageLinkClass'),
            label = p.get('lastPageLinkLabel'),
            last  = p.getTotalPages();

        if (this.link) {
            this.link.remove(true);
            this.span.remove(true);
            this.na.remove(true);
        }

        this.link = Y.Node.create(
            '<a href="#" id="'+id_base+'-last-link">'+label+'</a>');
        this.link.set('className', c);
        this.link.on('click',this.onClick,this);

        this.span = Y.Node.create(
            '<span id="'+id_base+'-last-span">'+label+'</span>');
        this.span.set('className', c);

        this.na = Y.Node.create(
            '<span id="'+id_base+'-last-na"></span>');

        switch (last) {
            case Paginator.VALUE_UNLIMITED :
                this.current = this.na;
                break;

            case p.getCurrentPage() :
                this.current = this.span;
                break;

            default :
                this.current = this.link;
        }

        return this.current;
    },

    /**
     * Swap the link, span, and na nodes if appropriate.
     * @method update
     * @param e {CustomEvent} The calling change event (ignored)
     */
    update : function (e) {
        if (e && e.prevVal === e.newVal) {
            return;
        }

        var par   = this.current ? this.current.get('parentNode') : null,
            after = this.link,
            total = this.paginator.getTotalPages();

        if (par) {
            if (total === Paginator.VALUE_UNLIMITED) {
                after = this.na;
            } else if (total === this.paginator.getCurrentPage() ||
                        this.paginator.get('disabled')) {
                after = this.span;
            }

            if (this.current !== after) {
                par.replaceChild(after,this.current);
                this.current = after;
            }
        }
    },

    /**
     * Rebuild the markup.
     * @method rebuild
     * @param e {CustomEvent} The calling change event (ignored)
     */
    rebuild : function (e) {
        if (e && e.prevVal === e.newVal) {
            return;
        }

        var p     = this.paginator,
            c     = p.get('lastPageLinkClass'),
            label = p.get('lastPageLinkLabel');

        this.link.set('className', c);
        this.link.set('innerHTML', label);

        this.span.set('className', c);
        this.span.set('innerHTML', label);
    },

    /**
     * Listener for the link's onclick event.  Passes to setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        e.halt();
        this.paginator.setPage(this.paginator.getTotalPages());
    }
};
