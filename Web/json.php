<?php	
        header("Content-type: application/json");
        $id = $_GET['id'];
        $json = file_get_contents('http://127.0.0.1:10018/buckets/Movies/keys/'.$id);
        echo $json;
?>