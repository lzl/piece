;(function (jQuery, linkify) {
"use strict";
var tokenize = linkify.tokenize, options = linkify.options;
/**
	Linkify a HTML DOM node
*/

'use strict';

var HTML_NODE = 1,
    TXT_NODE = 3;

/**
	Given a parent element and child node that the parent contains, replaces
	that child with the given array of new children
*/
function replaceChildWithChildren(parent, oldChild, newChildren) {
	var lastNewChild = newChildren[newChildren.length - 1];
	parent.replaceChild(lastNewChild, oldChild);
	for (var i = newChildren.length - 2; i >= 0; i--) {
		parent.insertBefore(newChildren[i], lastNewChild);
		lastNewChild = newChildren[i];
	}
}

/**
	Given an array of MultiTokens, return an array of Nodes that are either
	(a) Plain Text nodes (node type 3)
	(b) Anchor tag nodes (usually, unless tag name is overridden in the options)

	Takes the same options as linkifyElement and an optional doc element
	(this should be passed in by linkifyElement)
*/
function tokensToNodes(tokens, opts, doc) {
	var result = [];

	for (var i = 0; i < tokens.length; i++) {
		var token = tokens[i];

		if (token.isLink) {

			var href = token.toHref(opts.defaultProtocol),
			    formatted = options.resolve(opts.format, token.toString(), token.type),
			    formattedHref = options.resolve(opts.formatHref, href, token.type),
			    attributesHash = options.resolve(opts.attributes, href, token.type),
			    tagName = options.resolve(opts.tagName, href, token.type),
			    linkClass = options.resolve(opts.linkClass, href, token.type),
			    target = options.resolve(opts.target, href, token.type),
			    events = options.resolve(opts.events, href, token.type);

			// Build the link
			var link = doc.createElement(tagName);
			link.setAttribute('href', formattedHref);
			link.setAttribute('class', linkClass);
			if (target) {
				link.setAttribute('target', target);
			}

			// Build up additional attributes
			if (attributesHash) {
				for (var attr in attributesHash) {
					link.setAttribute(attr, attributesHash[attr]);
				}
			}

			if (events) {
				for (var event in events) {
					if (link.addEventListener) {
						link.addEventListener(event, events[event]);
					} else if (link.attachEvent) {
						link.attachEvent('on' + event, events[event]);
					}
				}
			}

			link.appendChild(doc.createTextNode(formatted));
			result.push(link);
		} else if (token.type === 'nl' && opts.nl2br) {
			result.push(doc.createElement('br'));
		} else {
			result.push(doc.createTextNode(token.toString()));
		}
	}

	return result;
}

// Requires document.createElement
function linkifyElementHelper(element, opts, doc) {

	// Can the element be linkified?
	if (!element || typeof element !== 'object' || element.nodeType !== HTML_NODE) {
		throw new Error('Cannot linkify ' + element + ' - Invalid DOM Node type');
	}

	// Is this element already a link?
	if (element.tagName === 'A' /*|| element.hasClass('linkified')*/) {
			// No need to linkify
			return element;
		}

	var childElement = element.firstChild;

	while (childElement) {

		switch (childElement.nodeType) {
			case HTML_NODE:
				linkifyElementHelper(childElement, opts, doc);
				break;
			case TXT_NODE:

				var str = childElement.nodeValue,
				    tokens = tokenize(str),
				    nodes = tokensToNodes(tokens, opts, doc);

				// Swap out the current child for the set of nodes
				replaceChildWithChildren(element, childElement, nodes);

				// so that the correct sibling is selected
				childElement = nodes[nodes.length - 1];

				break;
		}

		childElement = childElement.nextSibling;
	}

	return element;
}

function linkifyElement(element, opts) {
	var doc = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

	try {
		doc = doc || window && window.document || global && global.document;
	} catch (e) {/* do nothing for now */}

	if (!doc) {
		throw new Error('Cannot find document implementation. ' + 'If you are in a non-browser environment like Node.js, ' + 'pass the document implementation as the third argument to linkifyElement.');
	}

	opts = options.normalize(opts);
	return linkifyElementHelper(element, opts, doc);
}

// Maintain reference to the recursive helper to cache option-normalization
linkifyElement.helper = linkifyElementHelper;
linkifyElement.normalize = options.normalize;
'use strict';

var doc = undefined;

try {
	doc = document;
} catch (e) {
	doc = null;
}

// Applies the plugin to jQuery
function apply($) {
	var doc = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	$.fn = $.fn || {};

	try {
		doc = doc || window && window.document || global && global.document;
	} catch (e) {/* do nothing for now */}

	if (!doc) {
		throw new Error('Cannot find document implementation. ' + 'If you are in a non-browser environment like Node.js, ' + 'pass the document implementation as the third argument to linkifyElement.');
	}

	if (typeof $.fn.linkify === 'function') {
		// Already applied
		return;
	}

	function jqLinkify(opts) {
		opts = linkifyElement.normalize(opts);
		return this.each(function () {
			linkifyElement.helper(this, opts, doc);
		});
	}

	$.fn.linkify = jqLinkify;

	$(doc).ready(function () {
		$('[data-linkify]').each(function () {

			var $this = $(this),
			    data = $this.data(),
			    target = data.linkify,
			    nl2br = data.linkifyNlbr,
			    options = {
				linkAttributes: data.linkifyAttributes,
				defaultProtocol: data.linkifyDefaultProtocol,
				events: data.linkifyEvents,
				format: data.linkifyFormat,
				formatHref: data.linkifyFormatHref,
				newLine: data.linkifyNewline, // deprecated
				nl2br: !!nl2br && nl2br !== 0 && nl2br !== 'false',
				tagName: data.linkifyTagname,
				target: data.linkifyTarget,
				linkClass: data.linkifyLinkclass
			};
			var $target = target === 'this' ? $this : $this.find(target);
			$target.linkify(options);
		});
	});
}

// Apply it right away if possible
if (typeof jQuery !== 'undefined' && doc) {
	apply(jQuery, doc);
}
window.linkifyElement = linkifyElement;
})(window.jQuery, window.linkify);