<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$db   = 'oranguta_book';
$user = 'oranguta_Controller';
$pass = 'Y^!{i~0bYS0BI&Fi^R';

$conn = @new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(array(
        'success' => false,
        'message' => 'خطا در اتصال: ' . $conn->connect_error
    ), JSON_UNESCAPED_UNICODE);
    exit();
}

$conn->set_charset("utf8mb4");

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data || empty($data['fullName']) || empty($data['phone'])) {
    echo json_encode(array('success' => false, 'message' => 'نام و شماره همراه الزامی است'), JSON_UNESCAPED_UNICODE);
    exit();
}

$fullName     = $conn->real_escape_string(trim((string)$data['fullName']));
$phone        = $conn->real_escape_string(trim((string)$data['phone']));
$organization = $conn->real_escape_string(isset($data['organization']) ? (string)$data['organization'] : '');
$position     = $conn->real_escape_string(isset($data['position']) ? (string)$data['position'] : '');

$sql = "INSERT INTO lead_samples (full_name, phone, organization, position) 
        VALUES ('".$fullName."', '".$phone."', '".$organization."', '".$position."')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(array('success' => true, 'message' => 'اطلاعات با موفقیت در دیتابیس ثبت شد'), JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(array('success' => false, 'message' => 'خطای دیتابیس: ' . $conn->error), JSON_UNESCAPED_UNICODE);
}
