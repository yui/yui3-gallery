<?php
header("Content-type: text/event-stream");
header("Cache-control: no-cache");
?>
data: hello

<?php
    flush();
    sleep(1);
?>
data: hello

<?php
    flush();
    sleep(1);
?>
data: hello

<?php
    flush();
    sleep(1);
?>
data: hello

<?php
    flush();
    sleep(1);
?>
data: hello