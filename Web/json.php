<?php	
        header("Content-type: application/json");

        $json = file_get_contents('http://127.0.0.1:10018/buckets/Movies/keys/100');
        echo $json;
?>