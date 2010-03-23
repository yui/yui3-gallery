var shoveler1, shoveler2, shoveler3, shoveler4, shoveler5;
// Create new YUI instance, and populate it with the required modules
YUI({
    combine: false, 
    debug: true, 
    filter:"RAW"
}).use('gallery-shoveler', function(Y) {
 
    shoveler1 = new Y.Shoveler( {
        contentBox: "#shoveler1",
		numberOfVisibleCells: 3,
		cyclical: true,
		renderFunctionName: "renderCellsWithPop"
    });
 
    shoveler1.render();
	
	shoveler2 = new Y.Shoveler( {
        contentBox: "#shoveler2",
		numberOfVisibleCells: 4,
		cyclical: true,
		numberOfCells: 20,
		dynamic: true,
		renderFunctionName: "renderCellsWithPop",
		prefetch: true,
		contructDataSrc: function(start, numberOfVisibleCells) {
			var url = "http://query.yahooapis.com/v1/public/yql?"+
				"q=select%20*%20from%20flickr.photos.search("+
				start+"%2C"+numberOfVisibleCells+
				")%20where%20user_id%20%3D%20%2217004938%40N00%22&format=json&callback=shoveler2.handleDataRetrieval";
			return url;
		},
		
		handleData: function(data) {
			var photos = data.query.results.photo, imageUrl, photo, i, len;
			for(i = 0, len = photos.length; i < len; i++) {
				photo = photos[i];

				imageUrl = "http://farm"+photo.farm+
					".static.flickr.com/"+photo.server+
					"/"+photo.id+"_"+photo.secret+"_t.jpg";
				
				this.replaceCell("<img src='"+imageUrl+"'/>"+photo.title, this.get("fetchStart")+i);
				
			}
		}
    });
 
    shoveler2.render();
	
	shoveler3 = new Y.Shoveler( {
        contentBox: "#shoveler3",
		numberOfVisibleCells: 3,
		cyclical: true
    });
 
    shoveler3.render();
	
	Y.get("#shoveler3AddCell").on("click", function() {
		shoveler3.addCell(shoveler3.get("numberOfCells"));
	});
	
	Y.get("#shoveler3RemoveCell").on("click", function() {
		shoveler3.removeCell(shoveler3.get("numberOfCells")-1);
	});
	
	Y.get("#shoveler3AddCell5").on("click", function() {
		shoveler3.addCell(shoveler3.get("numberOfCells"), 5);
	});
	
	shoveler4 = new Y.Shoveler( {
        contentBox: "#shoveler4",
		numberOfVisibleCells: 3
    });
 
    shoveler4.render();

	shoveler5 = new Y.Shoveler( {
        contentBox: "#shoveler5",
		numberOfVisibleCells: 5,
		infinite: true,
		dynamic: true,
		contructDataSrc: function(start, numberOfVisibleCells) {
			var url = "http://query.yahooapis.com/v1/public/yql?"+
				"q=select%20*%20from%20flickr.photos.search("+
				start+"%2C"+numberOfVisibleCells+
				")%20where%20tags%20%3D%20%22monkey%22&format=json&callback=shoveler5.handleDataRetrieval";
			return url;
		},
		
		handleData: function(data) {
			var photos = data.query.results.photo, imageUrl, photo, i, len;
			for(i = 0, len = photos.length; i < len; i++) {
				photo = photos[i];

				imageUrl = "http://farm"+photo.farm+
					".static.flickr.com/"+photo.server+
					"/"+photo.id+"_"+photo.secret+"_t.jpg";
				
				this.replaceCell("<img src='"+imageUrl+"'/>"+photo.title, this.get("fetchStart")+i);
				
			}
		}
    });
 
    shoveler5.render();
	
});