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

if (!$data || empty($data['companyName']) || empty($data['contactPerson']) || empty($data['phone'])) {
    echo json_encode(array('success' => false, 'message' => 'اطلاعات فرم B2B کامل نیست'), JSON_UNESCAPED_UNICODE);
    exit();
}

$companyName   = $conn->real_escape_string(trim((string)$data['companyName']));
$contactPerson = $conn->real_escape_string(trim((string)$data['contactPerson']));
$phone         = $conn->real_escape_string(trim((string)$data['phone']));
$quantity      = $conn->real_escape_string(isset($data['quantity']) ? (string)$data['quantity'] : '');
$notes         = $conn->real_escape_string(isset($data['notes']) ? (string)$data['notes'] : '');

$sql = "INSERT INTO b2b_inquiries (company_name, contact_person, phone, quantity, notes) 
        VALUES ('".$companyName."', '".$contactPerson."', '".$phone."', '".$quantity."', '".$notes."')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(array('success' => true, 'message' => 'درخواست خرید عمده با موفقیت ثبت شد'), JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(array('success' => false, 'message' => 'خطای دیتابیس: ' . $conn->error), JSON_UNESCAPED_UNICODE);
}
