/**
* Ellipsis plugin (YUI) - For when text is too l ...
*
* @fileOverview  A slightly smarter way of truncating text
* @author        Dan Beam <dan@danbeam.org>
* @param         {object} conf - configuration objects to override the defaults
* @return        {Node} the Node passed to the method
*
* Copyright (c) 2010 Dan Beam
* Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

    // add this on all Y.Node instances (but only if imported
    Y.DOM.ellipsis = function (node, conf) {

        // homogenize conf to object
        conf = conf || {};

        // augment our conf object with some default settings
        Y.mix(conf, {
            // end marker
            'ellipsis' : ' ...',
            
            // for stuff we *really* don't want to wrap, increase this number just in case
            'fudge'    : 3,

            // target number of lines to wrap
            'lines'    : 1
        });

        // console.log(conf);
        // console.log(Y.one(node).getComputedStyle('lineHeight'));
        // console.log(Y.one(node).getComputedStyle('fontSize'));

            // the element we're trying to truncate
        var yEl           = Y.one(node),

            // original text
            originalText  = yEl.getAttribute('originalText') || yEl.get('text'),
            
            // keep the current length of the text so far
            currentLength = originalText.length,
            
            // the number of characters to increment or decrement the text by
            charIncrement = currentLength,
      
            // copy the element so we can string length invisibly
            clone         = Y.one(document.createElement(yEl.get('nodeName'))),

            // the allowable difference when comparing floating point numbers
            fp_epsilon    = 0.01,

            // floating point comparison
            fp_equals     = function (a, b) { return Math.abs(a - b) <= fp_epsilon; },
            fp_greater    = function (a, b) { return a - b >= fp_epsilon; },
            fp_lesser     = function (a, b) { return a - b <= fp_epsilon; },

            // some current values used to cache .getComputedStyle() accesses and compare to our goals
            lineHeight, targetHeight, currentHeight, lastKnownGood;

        // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        // @ NOTE: I'm intentionally ignoring padding as .getComputedStyle('height') @
        // @ NOTE: and .getComputedStyle('width') both ignore this as well.          @
        // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

        // copy styles to clone object
        clone.setStyles({
            'overflow'      : 'hidden',   // only at first
            'position'      : 'absolute',
            'visibility'    : 'hidden',
            'display'       : 'block',
            'bottom'        : '-10px',
            'right'         : '-10px',
            'width'         : yEl.getComputedStyle('width'),
            'fontSize'      : yEl.getComputedStyle('fontSize'),
            'fontFamily'    : yEl.getComputedStyle('fontFamily'),
            'fontWeight'    : yEl.getComputedStyle('fontWeight'),
            'letterSpacing' : yEl.getComputedStyle('letterSpacing'),
            'lineHeight'    : yEl.getComputedStyle('lineHeight')
        });

        // insert some text to get the line-height (because .getComputedStyle('lineHeight') can be "normal" sometimes!)
        clone.set('text', 'some sample text');

        // unfortunately, we must insert into the DOM, :(
        Y.one('body').append(clone);

        // get the height of the node with only 1 character of text (should be 1 line)
        lineHeight    = parseFloat(clone.getComputedStyle('height'), 10);

        // set overflow back to visible
        clone.setStyle('overflow', 'visible');

        // compute how high the node should be if it's the right number of lines
        targetHeight  = conf.lines * lineHeight;

        // insert the original text, in case we've already truncated
        clone.set('text', originalText);

        // ok, now that we have a node in the DOM with the right text, measure it's height
        currentHeight = parseFloat(clone.getComputedStyle('height'), 10);

        // console.log('lineHeight', lineHeight);
        // console.log('currentHeight', currentHeight);
        // console.log('targetHeight', targetHeight);
        // console.log('originalText.length', originalText.length);
        // console.log('yEl.get(\'text\').length', yEl.get('text').length);

        // quick sanity check
        if (fp_lesser(currentHeight, targetHeight) && originalText.length === yEl.get('text').length) {
            // console.log('truncation not necessary!');
            clone.remove();
            return;
        }

        // now, let's start looping through and slicing the text as necessary
        for (; charIncrement >= 1; ) {

            // increment decays by half every time 
            charIncrement = Math.floor(charIncrement / 2);
            
            // if the height is too big, remove some chars, else add some
            currentLength += fp_greater(currentHeight, targetHeight) ? -charIncrement : +charIncrement;
            
            // try text at current length
            clone.set('text', originalText.slice(0, currentLength - conf.ellipsis.length) + conf.ellipsis);
            
            // compute the current height
            currentHeight = parseFloat(clone.getComputedStyle('height'), 10);

            // we only want to store values that aren't too big
            if (fp_equals(currentHeight, targetHeight) || fp_lesser(currentHeight, targetHeight)) {
                lastKnownGood = currentLength;
            }

            // console.log('currentLength', currentLength);
            // console.log('currentHeight', currentHeight);
            // console.log('targetHeight' , targetHeight );
            // console.log('charIncrement', charIncrement);
            // console.log('lastKnownGood', lastKnownGood);

        }

        // remove from DOM
        clone.remove();
        
        // set the original text if we want to ever want to expand past the current truncation
        if (!yEl.getAttribute('originalText')) {
            yEl.setAttribute('originalText', originalText);
        }

        // console.log('originalText.length', originalText.length);
        // console.log('clone.get(\'text\').length', clone.get('text').length);
        // console.log('conf.ellipsis.length', conf.ellipsis.length);

        // if the text matches
        if (originalText.length === (clone.get('text').length - conf.ellipsis.length)) {
            // this means we *de-truncated* and can fit fully in the new space
            // console.log('de-truncated!');
            yEl.set('text', originalText);
        }
        // this should never happen, but it doesn't hurt to check
        else if ('undefined' !== typeof lastKnownGood) {
            // do this thing, already!
            yEl.set('text', originalText.slice(0, lastKnownGood - conf.ellipsis.length - conf.fudge) + conf.ellipsis);
        }

        // return myself for chainability
        return yEl;

    };

    Y.Node.importMethod(Y.DOM, 'ellipsis');
    Y.NodeList.importMethod(Y.Node.prototype, 'ellipsis');
