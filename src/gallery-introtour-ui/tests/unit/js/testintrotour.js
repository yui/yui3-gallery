YUI().use('gallery-introtour-ui','test', function (Y) {
	var tour_cards = [{'title':'Welcome','position':'pagecenter','content':'Welcome to this feature tour'},
                {'title':'Get Started','content':'This tells you what to do to get started.','target':'hello1','position':'right','width':'100'},
                {'title':'Go here next','content':'Next, you should probably try this out.','target':'hello2','position':'top','height':'125'},
                {'title':'Try this!','content':'This helps you get more information.','target':'hello3','position':'bottom','height':'50'},
                {'title':'Important!','content':'Finally click here to save changes.','target':'hello4','position':'left','width':'50'},
                {'title':'That\'s it! You\'re good to go!','position':'pagecenter'}];
	Y.Introtour.init(tour_cards);
	var findpos = function (obj){
		var curleft = curtop = 0;
			if (obj.offsetParent) {
				do {
					curleft += obj.offsetLeft;
					curtop += obj.offsetTop;
				} while (obj == obj.offsetParent);
			}
		return [curleft,curtop];
	};
	var checkpos = new Y.Test.Case({
		name: 'Card Position Test',
		"welcome card position": function() {
			var testtoppos = Y.one('#galleryintrotourui-card-welcome').getStyle('top');
			var testleftpos = Y.one('#galleryintrotourui-card-welcome').getStyle('left');
			Y.Assert.areEqual(testtoppos,"60px",'Top position of welcome card');
			Y.Assert.areEqual(testleftpos,"50%",'Top position of welcome card');
		},
		"Right positioned card": function() {
			var pos = findpos(document.getElementById('hello1'));
			var testtoppos = Y.one('#galleryintrotourui-card-1').getStyle('top').split("px");
			var testleftpos = Y.one('#galleryintrotourui-card-1').getStyle('left').split("px");
			testleftpos = testleftpos[0]-parseInt(tour_cards[1].width);
			Y.Assert.areEqual(pos[1],testtoppos[0],'Top position of right card');
			Y.Assert.areEqual(pos[0],testleftpos,'Left position of right card');
		},
		'Top positioned card': function() {
			var pos = findpos(document.getElementById('hello2'));
			var testtoppos = Y.one('#galleryintrotourui-card-2').getStyle('top').split("px");
			var testleftpos = Y.one('#galleryintrotourui-card-2').getStyle('left').split("px");
			testtoppos = parseInt(testtoppos[0])+parseInt(tour_cards[2].height);
			Y.Assert.areEqual(pos[1],testtoppos,'Top position of top card');
			Y.Assert.areEqual(pos[0],testleftpos[0],'Left position of top card');
		},
		'Bottom positioned card': function() {
			var pos = findpos(document.getElementById('hello3'));
			var testtoppos = Y.one('#galleryintrotourui-card-3').getStyle('top').split("px");
			var testleftpos = Y.one('#galleryintrotourui-card-3').getStyle('left').split("px");
			testtoppos = parseInt(testtoppos[0])-parseInt(tour_cards[3].height);
			Y.Assert.areEqual(pos[1],testtoppos,'Top position of bottom card');
			Y.Assert.areEqual(pos[0],testleftpos[0],'Left position of bottom card');
		},
		'Left positioned card': function() {
			var pos = findpos(document.getElementById('hello4'));
			var testtoppos = Y.one('#galleryintrotourui-card-4').getStyle('top').split("px");
			var testleftpos = Y.one('#galleryintrotourui-card-4').getStyle('left').split("px");
			testleftpos = parseInt(testleftpos[0])+parseInt(tour_cards[4].width)+300;
			Y.Assert.areEqual(pos[1],testtoppos[0],'Top position of left card');
			Y.Assert.areEqual(pos[0],testleftpos,'Left position of left card');
		},
		'Final card position': function() {
			var testtoppos = Y.one('#galleryintrotourui-card-endtour').getStyle('top');
			var testleftpos = Y.one('#galleryintrotourui-card-endtour').getStyle('left');
			Y.Assert.areEqual(testtoppos,"60px",'Top position of final card');
			Y.Assert.areEqual(testleftpos,"50%",'Top position of final card');
		}
	});
	var checknav = new Y.Test.Case({
		'name':'Checking navigation',
		"Welcome card nav":function(){
			var seqid = Y.one("#yui-galleryintrotourui-buttonwelcome-id").getAttribute("data-seqid"); 
			Y.Assert.areEqual("welcome",seqid);
		},
		"Right card nav":function(){
			var seqid = Y.one("#yui-galleryintrotourui-buttonnav-1").getAttribute("data-seqid");
			Y.Assert.areEqual(1,seqid);
		},
		"Top card nav":function(){
			var seqid = Y.one("#yui-galleryintrotourui-buttonnav-2").getAttribute("data-seqid");
			Y.Assert.areEqual(2,seqid);
		},
		"Bottom card nav":function(){
			var seqid = Y.one("#yui-galleryintrotourui-buttonnav-3").getAttribute("data-seqid");
			Y.Assert.areEqual(3,seqid);
		},
		"Left card nav":function(){
			var seqid = Y.one("#yui-galleryintrotourui-buttonnav-4").getAttribute("data-seqid");
			Y.Assert.areEqual("end",seqid);
		},
		"End card nav":function(){
			var seqid = Y.one("#yui-galleryintrotourui-buttontourend-id").getAttribute("data-seqid");
			Y.Assert.areEqual("end",seqid);
		},
	});
	var checkbuttonid = new Y.Test.Case({
		'name':'Check the buttonids',
		'Welcome card buttonid':function(){
			var buttonid = Y.one('#galleryintrotourui-card-welcome button').getAttribute('id');
			Y.Assert.areEqual("yui-galleryintrotourui-buttonwelcome-id",buttonid);
		},
		'Right card buttonid':function(){
			var buttonid = Y.one('#galleryintrotourui-card-1 button').getAttribute('id');
			Y.Assert.areEqual("yui-galleryintrotourui-buttonnav-1",buttonid);
		},
		'Top card buttonid':function(){
			var buttonid = Y.one('#galleryintrotourui-card-2 button').getAttribute('id');
			Y.Assert.areEqual("yui-galleryintrotourui-buttonnav-2",buttonid);
		},
		'Bottom card buttonid':function(){
			var buttonid = Y.one('#galleryintrotourui-card-3 button').getAttribute('id');
			Y.Assert.areEqual("yui-galleryintrotourui-buttonnav-3",buttonid);
		},
		'Left card buttonid':function(){
			var buttonid = Y.one('#galleryintrotourui-card-4 button').getAttribute('id');
			Y.Assert.areEqual("yui-galleryintrotourui-buttonnav-4",buttonid);
		},
		'End card buttonid':function(){
			var buttonid = Y.one('#galleryintrotourui-card-endtour button').getAttribute('id');
			Y.Assert.areEqual("yui-galleryintrotourui-buttontourend-id",buttonid);
		},
	});


	var TestRunner = Y.Test.Runner;
	TestRunner.add(checkpos);
	TestRunner.add(checknav);
	TestRunner.add(checkbuttonid);
	TestRunner.run();
	
});

