<?php //запустить php синтаксис
$_POST = json_decode(file_get_contents('php://input'), true); // php не умеет работать с json, эта строка декодирует из json
echo var_dump($_POST); // позволяет увидеть данные приходящие с клиента без ; нифига работать не будет ВАЖНЫЙ МОМЕНТ


// это типа бэкэнд