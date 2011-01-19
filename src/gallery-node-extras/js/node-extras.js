/**
 * An expanded collection of methods for Y.Node
 *
 * @module gallery-node-extras
 * @class Node
 */
var NodePrototype = Y.Node.prototype,
    originalOne = NodePrototype.one,
    originalAll = NodePrototype.all;

/**
 * Wraps the content of this Node with new HTML
 * @method wrapInner
 * @for Node
 * @for NodeList
 * @param {string | Y.Node | DOMNode} The HTML Fragment to wrap around the contents of the current node.
 * @chainable
 */
NodePrototype.wrapInner = function(html) {
    var wrapper = Y.Node.create(html),
        container = wrapper.one('*:empty') || wrapper,
        list = this.all('> *');
    if (list.size() > 0) {
        list.each(function(node) {
                    container.append(node);
                });
    } else {
        container.setContent(this.getContent());
        this.setContent('');
    }
    this.append(wrapper);
};

Y.NodeList.importMethod(NodePrototype, 'wrapInner');

/**
 * Returns a Document Fragment as a Y.Node
 * @method frag
 * @for Node
 * @static
 */
Y.Node.frag = function() {
    return new Y.Node(document.createDocumentFragment());
};

/**
 * Extends existing Y.Node.one to take no argument and return the immediate
 * child of the current node.
 * @method one
 * @for Node
 * @param {string|Y.Node} node The node or selector to search for
 * @return A child node matching the node argument, if defined, or the first
 * child
 */
NodePrototype.one = function(node) {
    node = node || "> *";
    return originalOne.call(this, node);
}

/**
 * Extends existing Y.Node.all to take no argument and return all the immediate
 * children as a NodeList. This essentially makes nodeInstance.all() a synonym
 * for nodeInstane.get('children')
 * @method all
 * @for Node
 * @param Node {string|Y.Node} The selector to be passed to the underlying all
 * implementation
 * @return A NodeList containing all the immediate children, or the children
 * that match the argument selector
 */
NodePrototype.all = function(node) {
    if (node) {
        return originalAll.call(this, node);
    } else {
        return this.get('children');
    }
}
