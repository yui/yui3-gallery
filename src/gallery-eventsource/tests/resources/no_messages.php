<?php
header("Content-type: text/event-stream");
header("Cache-control: no-cache");

//note: no extra white space after "hello" means this should not be a message
?>
data: hello