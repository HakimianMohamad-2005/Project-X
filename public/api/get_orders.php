<?php
require_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->query("SELECT * FROM orders ORDER BY id DESC LIMIT 50");
    $rows = $stmt->fetchAll();

    $orders = [];
    foreach ($rows as $row) {
        $orders[] = [
            'orderCode' => $row['order_code'],
            'createdAt' => $row['created_at'],
            'finalPrice' => (float)$row['final_price'],
            'status' => $row['status'],
            'paymentMethod' => $row['payment_method'],
            'trackingNumber' => $row['tracking_number'],
            'customerInfo' => json_decode($row['customer_info'], true),
            'items' => json_decode($row['items'], true)
        ];
    }

    echo json_encode(['success' => true, 'orders' => $orders]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'خطای سرور: ' . $e->getMessage()]);
}
