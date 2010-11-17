<?php
header("Content-type: text/event-stream");
header("Cache-control: no-cache");

//this message data should be " hello" because only the first space is stripped
?>
data:  hello

