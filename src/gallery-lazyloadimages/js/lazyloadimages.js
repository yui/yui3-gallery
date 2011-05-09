var LazyloadImages = {
   /**
    * Fetches the Images for the img tags with attribute data-src immediately,
    * should be used when calling this module on after loading the page.
    *
    * @param {String} selecter is the context selecter for the img tag to be lazy loaded
    *
    */
   processnow: function(selecter) {
	var imgselecter = "img[data-src]";
	imgselecter=(selecter)?selecter+" "+imgselecter:imgselecter; 
	Y.all(imgselecter).each(function (el, i) {
		var url = el.getAttribute('data-src');
		if(url){
			el.setAttribute('src', url);
			el.removeAttribute('data-src');
		}
	});	
   },
   
   /**
    * Fetches the Images for the img tags with attribute data-src immediately,
    * should be used when calling this module on after loading the page.
    *
    * @param {String} selecter is the context selecter for the img tag to be lazy loaded 
    *
    */
   processAfterLoad: function(selecter){
	Y.on("domready", LazyloadImages.processnow(selecter));
   }
};

// Alias it on YUI instance.
Y.LazyloadImages = LazyloadImages;
