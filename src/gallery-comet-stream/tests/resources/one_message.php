<?php

$isIE = (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== FALSE);

if ($isIE) {
    header('Content-Type: text/html');

    // necessary, since IE will buffer 1K before rendering
    echo str_repeat('#', 1024);
}
else {
    header('Content-Type: application/json');
}
header("Cache-control: no-cache");

$words = 'Hello World';

if ($isIE) {
    echo '<script type="text/javascript">parent.push("' . $words. '")</script>';
} else {
    $len = dechex(strlen($words));
    $data = "{$len}\r\n{$words}\r\n";

    echo $data;
}

ob_flush();
flush();

?>
