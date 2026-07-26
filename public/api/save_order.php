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

if (!$data || empty($data['orderCode'])) {
    echo json_encode(array('success' => false, 'message' => 'اطلاعات سفارش دریافت نشد'), JSON_UNESCAPED_UNICODE);
    exit();
}

$orderCode      = $conn->real_escape_string(trim((string)$data['orderCode']));
$createdAt      = isset($data['date']) ? (string)$data['date'] : (isset($data['createdAt']) ? (string)$data['createdAt'] : date('Y-m-d H:i:s'));
$createdAt      = $conn->real_escape_string($createdAt);

$finalPriceVal  = isset($data['finalPrice']) ? $data['finalPrice'] : (isset($data['totalPrice']) ? $data['totalPrice'] : 0);
$finalPrice     = (float)$finalPriceVal;

$status         = $conn->real_escape_string(isset($data['status']) ? (string)$data['status'] : 'ثبت سفارش');
$paymentMethod  = $conn->real_escape_string(isset($data['paymentMethod']) ? (string)$data['paymentMethod'] : 'درگاه آنلاین');
$trackingNumber = $conn->real_escape_string(isset($data['trackingNumber']) ? (string)$data['trackingNumber'] : '');

$customerInfoArr = (isset($data['customerInfo']) && is_array($data['customerInfo'])) ? $data['customerInfo'] : array();
$itemsArr        = (isset($data['items']) && is_array($data['items'])) ? $data['items'] : array();

$customerInfoJson = $conn->real_escape_string(json_encode($customerInfoArr, JSON_UNESCAPED_UNICODE));
$itemsJson        = $conn->real_escape_string(json_encode($itemsArr, JSON_UNESCAPED_UNICODE));

$sql = "INSERT INTO orders (order_code, created_at, final_price, status, payment_method, tracking_number, customer_info, items) 
        VALUES ('".$orderCode."', '".$createdAt."', ".$finalPrice.", '".$status."', '".$paymentMethod."', '".$trackingNumber."', '".$customerInfoJson."', '".$itemsJson."')
        ON DUPLICATE KEY UPDATE 
        final_price = ".$finalPrice.",
        status = '".$status."',
        payment_method = '".$paymentMethod."',
        tracking_number = '".$trackingNumber."',
        customer_info = '".$customerInfoJson."',
        items = '".$itemsJson."'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(array(
        'success'   => true,
        'message'   => 'سفارش ثبت شد',
        'orderCode' => $orderCode
    ), JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(array(
        'success' => false,
        'message' => 'خطای دیتابیس: ' . $conn->error
    ), JSON_UNESCAPED_UNICODE);
}