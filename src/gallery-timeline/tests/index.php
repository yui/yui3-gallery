<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Timeline Viewer</title>
		<link href="http://yui.yahooapis.com/combo?2.8.1/build/reset-fonts-grids/reset-fonts-grids.css&2.8.1/build/base/base-min.css" type="text/css" rel="stylesheet">
		<script type="text/javascript" src="http://yui.yahooapis.com/3.4.1/build/yui/yui.js"></script>
		<style>
			#canvas {
				
				width:800px;
				height: 400px;
			}
		</style>
    </head>
    <body class="yui-skin-sam">
		<div id="doc">
			<h1>Timeline Viewer</h1>
			<h3>See comments below</h3>
<?php
	$uploadFile = 'myOwnTimeline.xml';
	$timelineDir = 'timelines/';
	if (!empty($_FILES)) {
		if ($_FILES['userfile']['size'] < 100000) {
			$fileName = basename($_FILES['userfile']['name']);
			if (preg_match('/\\.(timeline|xml)$/i', $fileName , $matches)) {
				$uploadFile = $timelineDir . basename($fileName, $matches[0]) . '.xml';

				if (!move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadFile)) {
					echo "Couldn't make it!\n";
				}
			} else {
				echo '<p> *** File must have either a .timeline or .xml extension: ' . $fileName . '*** </p>';
			}
		} else {
			echo '<p> *** File too big: ' . $_FILES['userfile']['size'] . '*** </p>';
		}
	} else {
		if ($dh = opendir($timelineDir)) {
			while (($file = readdir($dh)) !== false) {
				if (filetype($timelineDir . $file) == 'file' && (time() - fileatime($timelineDir . $file)) > 3600) {
					unlink($timelineDir . $file);
				}
			}
			closedir($dh);
		}
	}
?>
			<div id="canvas"></div>
			<p>The graphics above were generated from data files produced by the timeline software at: <a href="http://thetimelineproj.sourceforge.net/">The Timeline Project</a>. 
				The file was hand modified and the bars above represent the random result of various tests. 
				You may display your own timeline by submitting a timeline file in this form:</p>
			<form enctype="multipart/form-data" method="POST">
				<input type="hidden" name="MAX_FILE_SIZE" value="100000" />
				Send this file: <input name="userfile" type="file" />
				<input type="submit" value="Send File" />
			</form>	
			<p style="font-size:small">File must have a <code>.timeline</code> or <code>.xml</code> extension and be smaller than 100k.</p>
			<p>	You can scroll by either using the mouse wheel or dragging the graph sideways. <br/> 
				You can zoom by using the same operations along the Control key.<br/>
				The bars that do have an extended descriptions have a small icon in the top right corner and the cursor changes shape.<br/>
				Clicking one of those will show the description and any icon it might contain.<br/>
				Fuzzy time bars have rounded borders.<br/>
				Leaving the mouse resting over a bar will show its text, just in case the one inside the bar has become illegible due to the size of the bar.</p>
			<p>This is a viewer, not an editor, as the original program is. 
				Programs running on a browser cannot write into the server without support from a server-side program 
				so this viewer would not be able to write back into the server any changes to the displayed timeline.
				However, it will be possible to add to the same web page a form to enter new bars and edit existing ones and, provided of a suitable server-side script,
				to store those changes in the server.</p>
			<p>The component is hosted at:  <a href="http://yuilibrary.com/gallery/show/timeline">http://yuilibrary.com/gallery/show/timeline</a></p>
			<p>For another example, see: <a href="PeopleBorn19th.html">People born in the XIX century</a></p>
			<p>*** This is a work in progress ***</p>
			<p>Known isues:</p>
			<ul>
				<li>The first time the extended description pops up, it is slightly lower than it should.</li>
				<li>When zooming in, it would be good to keep the graph centered on the cursor position 
					so that bars you are looking at don't fly off the screen.</li>
			</ul>

		</div>
			

		<script>
			YUI({
				gallery:'gallery-2012.01.25-21-14',

				lang:'en'
			}).use('gallery-timeline', function (Y) {
				"use strict";
				
				new Y.Timeline().load('<?=$uploadFile?>').render('#canvas');
				
			});
		</script>
    </body>
</html>
