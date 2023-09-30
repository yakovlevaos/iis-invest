<?php

/* https://api.telegram.org/botXXXXXXXXXXXXXXXXXXXXXXX/getUpdates,
где, XXXXXXXXXXXXXXXXXXXXXXX - токен вашего бота, полученный ранее */
function get_post_value_or_empty($key) {
  $ans = '';
  if(trim(!empty($_POST[$key]))) {
    $ans = $_POST[$key];
  }
  return $ans;
}

$host = 'https://iis-invest.ru';

$token = $_ENV["TG_BOT_TOKEN"];
$chat_id = $_ENV["CHAT_ID"];

$name = get_post_value_or_empty('name');
$tel = get_post_value_or_empty('tel');
$msg = get_post_value_or_empty('msg');
$email = get_post_value_or_empty('email');

$arr = array(
  'Сайт: ' => $host,
  'Имя пользователя: ' => $name,
  'Email: ' => $email,
  'Телефон: ' => $tel,
  'Сообщение: ' => $msg,
);

$txt = '';

foreach($arr as $key => $value) {
  $txt .= "<b>".$key."</b> ".$value."%0A";
};

if (!(empty($tel) && empty($email))) {
  $sendToTelegram = @fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");
  // $sendToTelegram = true;
  // header("Content-Type: application/json");
  // echo json_encode($arr);
  if ($sendToTelegram) {
    header("Content-Type: application/json");
    echo json_encode($arr);
    exit();
  } else {
    header('HTTP/1.0 403 Send Error to telegram bot!');
    exit();
  }
} else {
  header('HTTP/1.0 403 Forbidden method');
  exit();
}