<?php
require_once __DIR__ . '/db.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data || empty($data['orderCode'])) {
    http_response_code(200);
    echo json_encode(['success' => false, 'message' => 'اطلاعات سفارش نامعتبر است (کد سفارش یافت نشد)'], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    $orderCode      = trim((string)$data['orderCode']);
    $createdAt      = !empty($data['date']) ? (string)$data['date'] : (!empty($data['createdAt']) ? (string)$data['createdAt'] : date('Y-m-d H:i:s'));
    $finalPrice     = (float)($data['finalPrice'] ?? $data['totalPrice'] ?? 0);
    $status         = !empty($data['status']) ? (string)$data['status'] : 'ثبت سفارش';
    $paymentMethod  = !empty($data['paymentMethod']) ? (string)$data['paymentMethod'] : 'درگاه آنلاین';
    $trackingNumber = !empty($data['trackingNumber']) ? (string)$data['trackingNumber'] : '';
    
    $customerInfoArr = is_array($data['customerInfo'] ?? null) ? $data['customerInfo'] : [];
    $itemsArr        = is_array($data['items'] ?? null) ? $data['items'] : [];

    $customerInfoJson = json_encode($customerInfoArr, JSON_UNESCAPED_UNICODE);
    $itemsJson        = json_encode($itemsArr, JSON_UNESCAPED_UNICODE);

    // کئوری بسیار ساده و تمیز بدون تابع منسوخ یا پارامتر تکراری
    $sql = "INSERT INTO `orders` (`order_code`, `created_at`, `final_price`, `status`, `payment_method`, `tracking_number`, `customer_info`, `items`) 
            VALUES (:order_code, :created_at, :final_price, :status, :payment_method, :tracking_number, :customer_info, :items)
            ON DUPLICATE KEY UPDATE 
            `final_price` = VALUES(`final_price`),
            `status` = VALUES(`status`),
            `payment_method` = VALUES(`payment_method`),
            `tracking_number` = VALUES(`tracking_number`),
            `customer_info` = VALUES(`customer_info`),
            `items` = VALUES(`items`)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':order_code'      => $orderCode,
        ':created_at'      => $createdAt,
        ':final_price'     => $finalPrice,
        ':status'          => $status,
        ':payment_method'  => $paymentMethod,
        ':tracking_number' => $trackingNumber,
        ':customer_info'   => $customerInfoJson,
        ':items'           => $itemsJson
    ]);

    http_response_code(200);
    echo json_encode([
        'success'   => true,
        'message'   => 'سفارش با موفقیت ثبت شد',
        'orderCode' => $orderCode
    ], JSON_UNESCAPED_UNICODE);

} catch (\Throwable $e) {
    http_response_code(200);
    echo json_encode([
        'success' => false,
        'message' => 'خطا در ثبت سفارش: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}