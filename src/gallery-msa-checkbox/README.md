MSA-Checkbox
=============

MSA-Checkbox is a YUI 3 port of [Ratchet 2.0](https://github.com/twbs/ratchet)'s Toggle.

Some minor modifications were done. In stead of On/Off, we use I/O to not be bothered with international aspects.

There is a default skin, which is based on the project I created this for, and an ios and android skin.

For optimization purposes, I chose to use a page based delegate that operates on the nodelist. 

Usage
-------

	Y.use('msa-checkbox', function(A){
    	new A.MSA.Checkbox({srcNodes:Y.all('.msa-checkbox')});
    });

	<input type="checkbox" name="test" class="msa-checkbox">
	
Using a skin
-------
	
	Define a skin override in your YUI configuration. The skins are:
	
	* ios
	* android
	
	Add yui3-skin-ios or yui3-skin-android to the body or surrounding div container
	

Current limitations
-------
 
* This doesn't work in IE8
* Since Ratchet is strongly based on CSS and Ratchet uses some fixed widths where it shouldn't we currently don't support multilingual versions. We hope we can in the near future.

