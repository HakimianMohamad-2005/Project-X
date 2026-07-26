<?php
require_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->query("SELECT * FROM `orders` ORDER BY id DESC LIMIT 50");
    $rows = $stmt->fetchAll();

    $orders = [];
    foreach ($rows as $row) {
        $custInfo = json_decode($row['customer_info'] ?? '{}', true) ?? [];
        $itemsArr = json_decode($row['items'] ?? '[]', true) ?? [];

        $orders[] = [
            'orderCode'      => $row['order_code'],
            'date'           => $row['created_at'],
            'createdAt'      => $row['created_at'],
            'finalPrice'     => (float)$row['final_price'],
            'totalPrice'     => (float)$row['final_price'],
            'status'         => $row['status'],
            'paymentMethod'  => $row['payment_method'],
            'trackingNumber' => $row['tracking_number'],
            'customerInfo'   => $custInfo,
            'items'          => $itemsArr
        ];
    }

    http_response_code(200);
    echo json_encode(['success' => true, 'orders' => $orders], JSON_UNESCAPED_UNICODE);
} catch (\Throwable $e) {
    http_response_code(200);
    echo json_encode(['success' => false, 'message' => 'خطای دیتابیس: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}