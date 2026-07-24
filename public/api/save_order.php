<?php
require_once __DIR__ . '/db.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data || empty($data['orderCode'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'اطلاعات سفارش نامعتبر است']);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO orders (order_code, created_at, final_price, status, payment_method, tracking_number, customer_info, items) 
                           VALUES (:order_code, :created_at, :final_price, :status, :payment_method, :tracking_number, :customer_info, :items)
                           ON DUPLICATE KEY UPDATE 
                           final_price = VALUES(final_price),
                           status = VALUES(status),
                           customer_info = VALUES(customer_info),
                           items = VALUES(items)");
    
    $customerInfoJson = json_encode($data['customerInfo'] ?? [], JSON_UNESCAPED_UNICODE);
    $itemsJson = json_encode($data['items'] ?? [], JSON_UNESCAPED_UNICODE);
    $createdAt = $data['createdAt'] ?? date('Y-m-d H:i:s');
    $status = $data['status'] ?? 'ثبت سفارش';
    $paymentMethod = $data['paymentMethod'] ?? 'online';
    $trackingNumber = $data['trackingNumber'] ?? '';

    $stmt->execute([
        ':order_code' => $data['orderCode'],
        ':created_at' => $createdAt,
        ':final_price' => $data['finalPrice'] ?? 0,
        ':status' => $status,
        ':payment_method' => $paymentMethod,
        ':tracking_number' => $trackingNumber,
        ':customer_info' => $customerInfoJson,
        ':items' => $itemsJson
    ]);

    echo json_encode(['success' => true, 'orderCode' => $data['orderCode']]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'خطای سرور: ' . $e->getMessage()]);
}
