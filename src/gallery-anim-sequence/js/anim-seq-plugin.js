/**
 * @module gallery-anim-sequence
 */

/**
 * Binds an AnimSequence instance to a Node instance.  The API and
 * namespace is the same as NodeFX, so you can plug NodeFXSequence into
 * any node that just needs to run/pause/stop an animation.
 * 
 * Pass `sequence` in the configuration to set the initial animation
 * sequence.
 * 
 * @class Plugin.NodeFXSequence
 * @extends AnimSequence
 * @constructor
 * @param config {Object} configuration
 */
var NodeFXSequence = function(config)
{
	this._host = config.host;
	NodeFXSequence.superclass.constructor.apply(this, arguments);
};

NodeFXSequence.NAME = "nodefxseq";
NodeFXSequence.NS   = "fx";

function setNode(item)
{
	if (Y.Lang.isArray(item))
	{
		Y.each(item, function(a)
		{
			a.set('node', this._host);
		},
		this);
	}
	else if (item instanceof Y.Anim)
	{
		item.set('node', this._host);
	}
}

Y.extend(NodeFXSequence, Y.AnimSequence,
{
	append: function(item)
	{
		if (arguments.length > 1)
		{
			Y.each(arguments, setNode, this);
		}
		else
		{
			setNode.call(this, item);
		}

		NodeFXSequence.superclass.append.apply(this, arguments);
	},

	prepend: function(item)
	{
		if (arguments.length > 1)
		{
			Y.each(arguments, setNode, this);
		}
		else
		{
			setNode.call(this, item);
		}

		NodeFXSequence.superclass.prepend.apply(this, arguments);
	}
});

Y.namespace('Plugin');
Y.Plugin.NodeFXSequence = NodeFXSequence;
