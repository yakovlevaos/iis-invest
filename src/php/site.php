<?php

/* https://api.telegram.org/botXXXXXXXXXXXXXXXXXXXXXXX/getUpdates,
где, XXXXXXXXXXXXXXXXXXXXXXX - токен вашего бота, полученный ранее */

$host = $_SERVER;
$name = "Alexander Yakovlev";
$phone = "+79135299493";
$email = "saae21@gmail.com";
$token = $_ENV["TG_BOT_TOKEN"];
$msg = "Где мой дом, проверка?";
$chat_id = $_ENV["CHAT_ID"];
$arr = array(
  'Сайт: ' => $host,
  'Имя пользователя: ' => $name,
  'Телефон: ' => $phone,
  'Email: ' => $email,
  'Сообщение: ' => $msg,
);
$txt = '';

foreach($arr as $key => $value) {
  $txt .= "<b>".$key."</b> ".$value."%0A";
};

$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");

if ($sendToTelegram) {
  echo 'Thank you';
} else {
  echo "Error";
}
