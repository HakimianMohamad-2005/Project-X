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

$sql = "SELECT * FROM orders ORDER BY id DESC LIMIT 50";
$result = $conn->query($sql);

$orders = array();

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $rawCust = isset($row['customer_info']) ? $row['customer_info'] : '{}';
        $rawItem = isset($row['items']) ? $row['items'] : '[]';

        $custInfo = json_decode($rawCust, true);
        $itemsArr = json_decode($rawItem, true);

        $orders[] = array(
            'orderCode'      => $row['order_code'],
            'date'           => $row['created_at'],
            'createdAt'      => $row['created_at'],
            'finalPrice'     => (float)$row['final_price'],
            'totalPrice'     => (float)$row['final_price'],
            'status'         => $row['status'],
            'paymentMethod'  => $row['payment_method'],
            'trackingNumber' => $row['tracking_number'],
            'customerInfo'   => $custInfo ? $custInfo : new stdClass(),
            'items'          => $itemsArr ? $itemsArr : array()
        );
    }
}

echo json_encode(array('success' => true, 'orders' => $orders), JSON_UNESCAPED_UNICODE);