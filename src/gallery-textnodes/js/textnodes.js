//YUI.add('gallery-textnodes', function (Y) {

Y.Node.ATTRS.textNodes = {
    getter: function () {
        var nodes = [];

        this.get('childNodes').each(function (node) {
            if (node.get('nodeType') === 3) {
                nodes.push(node._node);
            }
        });

        return nodes;
    }
};

//}, '0.1', { requires: ['node-base'] });
