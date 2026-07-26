<?php
require_once __DIR__ . '/db.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data || empty($data['orderCode'])) {
    echo json_encode(array('success' => false, 'message' => 'اطلاعات سفارش دریافت نشد یا کد سفارش خالی است'), JSON_UNESCAPED_UNICODE);
    exit();
}

$orderCode      = $conn->real_escape_string(trim((string)$data['orderCode']));
$createdAt      = $conn->real_escape_string(!empty($data['date']) ? (string)$data['date'] : (!empty($data['createdAt']) ? (string)$data['createdAt'] : date('Y-m-d H:i:s')));
$finalPrice     = (float)($data['finalPrice'] ?? $data['totalPrice'] ?? 0);
$status         = $conn->real_escape_string(!empty($data['status']) ? (string)$data['status'] : 'ثبت سفارش');
$paymentMethod  = $conn->real_escape_string(!empty($data['paymentMethod']) ? (string)$data['paymentMethod'] : 'درگاه آنلاین');
$trackingNumber = $conn->real_escape_string(!empty($data['trackingNumber']) ? (string)$data['trackingNumber'] : '');

$customerInfoArr = is_array($data['customerInfo'] ?? null) ? $data['customerInfo'] : array();
$itemsArr        = is_array($data['items'] ?? null) ? $data['items'] : array();

$customerInfoJson = $conn->real_escape_string(json_encode($customerInfoArr, JSON_UNESCAPED_UNICODE));
$itemsJson        = $conn->real_escape_string(json_encode($itemsArr, JSON_UNESCAPED_UNICODE));

$sql = "INSERT INTO `orders` (`order_code`, `created_at`, `final_price`, `status`, `payment_method`, `tracking_number`, `customer_info`, `items`) 
        VALUES ('{$orderCode}', '{$createdAt}', {$finalPrice}, '{$status}', '{$paymentMethod}', '{$trackingNumber}', '{$customerInfoJson}', '{$itemsJson}')
        ON DUPLICATE KEY UPDATE 
        `final_price` = {$finalPrice},
        `status` = '{$status}',
        `payment_method` = '{$paymentMethod}',
        `tracking_number` = '{$trackingNumber}',
        `customer_info` = '{$customerInfoJson}',
        `items` = '{$itemsJson}'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(array(
        'success'   => true,
        'message'   => 'سفارش با موفقیت ثبت شد',
        'orderCode' => $orderCode
    ), JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(array(
        'success' => false,
        'message' => 'خطا در دیتابیس: ' . $conn->error
    ), JSON_UNESCAPED_UNICODE);
}