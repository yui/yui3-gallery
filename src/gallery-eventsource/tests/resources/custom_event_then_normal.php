<?php
header("Content-type: text/event-stream");
header("Cache-control: no-cache");
?>
event: foo
data: bar
<?php flush()?>

data: hello
