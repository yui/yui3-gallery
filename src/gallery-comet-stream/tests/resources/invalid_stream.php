<?php

$words = 'Hello World';

$len = dechex(strlen($words));
$data = "{$len}\r\n{$words}screw the stream\r\n";

echo $data;
echo $data;

ob_flush();
flush();


?>
