/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * @module gallery-paginator
 */

/**
 * ui Component to generate the link to jump to the first page.
 *
 * @class Paginator.ui.FirstPageLink
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.FirstPageLink = function (p) {
    this.paginator = p;

    p.on('destroy',this.destroy,this);
    p.after('recordOffsetChange',this.update,this);
    p.after('rowsPerPageChange',this.update,this);
    p.after('totalRecordsChange',this.update,this);
    p.after('disabledChange',this.update,this);

    p.after('firstPageLinkLabelChange',this.rebuild,this);
    p.after('firstPageLinkClassChange',this.rebuild,this);
};

/**
 * Used as innerHTML for the first page link/span.
 * @attribute firstPageLinkLabel
 * @default '&lt;&lt; first'
 */
Paginator.ATTRS.firstPageLinkLabel =
{
    value : '&lt;&lt; first',
    validator : Y.Lang.isString
};

/**
 * CSS class assigned to the link/span
 * @attribute firstPageLinkClass
 * @default 'yui-paginator-first'
 */
Paginator.ATTRS.firstPageLinkClass =
{
    value : Y.ClassNameManager.getClassName(Paginator.NAME, 'first'),
    validator : Y.Lang.isString
};

// Instance members and methods
Paginator.ui.FirstPageLink.prototype = {

    /**
     * The currently placed HTMLElement node
     * @property current
     * @type HTMLElement
     * @private
     */
    current   : null,

    /**
     * Link node
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
     * Removes the link/span node and clears event listeners.
     * @method destroy
     * @private
     */
    destroy : function () {
        this.link.remove(true);
        this.span.remove(true);
        this.current = this.link = this.span = null;
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
            c     = p.get('firstPageLinkClass'),
            label = p.get('firstPageLinkLabel');

        if (this.link) {
            this.link.remove(true);
            this.span.remove(true);
        }

        this.link = Y.Node.create(
            '<a href="#" id="'+id_base+'-first-link">'+label+'</a>');
        this.link.set('className', c);
        this.link.on('click',this.onClick,this);

        this.span = Y.Node.create(
            '<span id="'+id_base+'-first-span">'+label+'</span>');
        this.span.set('className', c);

        this.current = p.getCurrentPage() > 1 ? this.link : this.span;
        return this.current;
    },

    /**
     * Swap the link and span nodes if appropriate.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {
        if (e && e.prevVal === e.newVal) {
            return;
        }

        var par = this.current ? this.current.get('parentNode') : null;
        if (this.paginator.getCurrentPage() > 1 && !this.paginator.get('disabled')) {
            if (par && this.current === this.span) {
                par.replaceChild(this.link,this.current);
                this.current = this.link;
            }
        } else {
            if (par && this.current === this.link) {
                par.replaceChild(this.span,this.current);
                this.current = this.span;
            }
        }
    },

    /**
     * Rebuild the markup.
     * @method rebuild
     * @param e {CustomEvent} The calling change event
     */
    rebuild : function (e) {
        if (e && e.prevVal === e.newVal) {
            return;
        }

        var p     = this.paginator,
            c     = p.get('firstPageLinkClass'),
            label = p.get('firstPageLinkLabel');

        this.link.set('className', c);
        this.link.set('innerHTML', label);

        this.span.set('className', c);
        this.span.set('innerHTML', label);
    },

    /**
     * Listener for the link's onclick event.  Pass new value to setPage method.
     * @method onClick
     * @param e {DOMEvent} The click event
     */
    onClick : function (e) {
        e.halt();
        this.paginator.setPage(1);
    }
};
