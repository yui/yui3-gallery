'use strict';

/**
 * View ModelList Extention
 *
 *
 * Adds an Y.ModelList  or Y.LazyModelList to a View instance, where the Models are rendered inside an ul-element
 * which acts as the 'container'-attribute. This results in an ul-list with rendered Models. The Models are rendered
 * through a template (Y.Lang.sub or Y.Template.Micro) which needs to be defined with the <b>'template'-attribute</b>.
 *
 * @module gallery-itsaviewmodellist
 * @extends Widget
 * @uses ITSAModellistViewExtention
 * @class ITSAViewModellist
 * @constructor
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/
var Lang = Y.Lang,
    MODELLIST_CLASS = 'itsa-modellistview',
    GROUPHEADER_CLASS = MODELLIST_CLASS + '-groupheader';

Y.ITSAViewModellist = Y.Base.create('itsaviewmodellist', Y.Widget, [Y.ITSAModellistViewExtention], {

        /**
         * Makes the Model scroll into the View. Items that are already in the view: no scroll appears. Items that are above: will appear
         * on top. Items that are after the view: will appear on bottom.
         * <u>Be careful if you use the plugin ITSAInifiniteView:</u> to get the Node, there might be a lot of
         * list-expansions triggered. Be sure that expansions from external data does end, otherwise it will overload the browser.
         * That's why the third param is needed.
         * Preferable is to use an index or Node instead of Model --> Modelsearch is slower
         *
         * @method scrollIntoView
         * @param {Y.Node|Y.Model|Int} item Y.Node or Y.Model or index that should be into view.
         * Preferable is to use an index or Node instead of Model --> Modelsearch is slower
         * @param {Object} [options] To force the 'scrollIntoView' to scroll on top or on bottom of the view.
         *     @param {Boolean} [options.forceTop=false] if 'true', the (first) selected item will always be positioned on top.
         *     @param {Boolean} [options.forceBottom=false] if 'true', the (first) selected item will always be positioned on bottom.
         *     @param {Boolean} [options.noFocus=false] if 'true', then the listitem won't get focussed.
         *     @param {Boolean} [options.showHeaders=false] if 'true', when the model is succeeded by headers, the headers will also get into view.
         *     @param {Boolean} [options.editMode=false] if 'true', then Y.Plugin.ITSATabKeyManager will be used to ficus the first item.
                                (only if noFocis=false)
         * @param {Int} [maxExpansions] Only needed when you use the plugin <b>ITSAInifiniteView</b>. Use this value to limit
         * external data-calls. It will prevent you from falling into endless expansion when the list is infinite. If not set this method will expand
         * from external data at the <b>max of 25 times by default</b> (which is quite a lot). If you are responsible for the external data and
         * it is limited, then you might choose to set this value that high to make sure all data is rendered in the scrollview.
         * @since 0.1
        */
        scrollIntoView : function(item, options, maxExpansions) {
            var instance = this,
                showHeaders = options && Lang.isBoolean(options.showHeaders) && options.showHeaders,
                modelNode, firstHeaderNodeNode, prevNode;

            if (!(item instanceof Y.Node)) {
                if (Lang.isNumber(item)) {
                    modelNode = instance.getNodeFromIndex(item, maxExpansions);
                }
                else {
                    modelNode = item && instance.getNodeFromModel(item, maxExpansions);
                }
            }
            if (modelNode) {
                Y.log('scrollIntoView', 'info', 'Itsa-ViewModelList');
                if (!options || !Lang.isBoolean(options.noFocus) || !options.noFocus) {
                    instance._focusModelNode(modelNode);
                    if (Lang.isBoolean(options.editMode) && options.editMode) {
                        Y.use('gallery-itsatabkeymanager', function(Y) {
                            if (!modelNode.itsatabkeymanager) {
                                modelNode.plug(Y.Plugin.ITSATabKeyManager);
                            }
                            modelNode.itsatabkeymanager.focusInitialItem();
                        });
                    }
                }
                if (showHeaders) {
                    prevNode = modelNode.previous();
                    while (prevNode && prevNode.hasClass(GROUPHEADER_CLASS)) {
                        firstHeaderNodeNode = prevNode;
                        prevNode = prevNode.previous();
                    }
                    if (firstHeaderNodeNode) {
                        firstHeaderNodeNode.scrollIntoView();
                    }
                }
                modelNode.scrollIntoView();
            }
            else {
                Y.log('scrollIntoView --> no model', 'warn', 'Itsa-ViewModelList');
            }
        }

    }, {
        ATTRS : {
        }
    }
);