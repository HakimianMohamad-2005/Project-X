<?php
require_once __DIR__ . '/db.php';

try {
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `orders` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `order_code` VARCHAR(50) NOT NULL UNIQUE,
          `created_at` VARCHAR(50) NOT NULL,
          `final_price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
          `status` VARCHAR(50) NOT NULL DEFAULT 'ثبت سفارش',
          `payment_method` VARCHAR(50) DEFAULT 'online',
          `tracking_number` VARCHAR(100) DEFAULT '',
          `customer_info` TEXT NOT NULL,
          `items` TEXT NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    } catch (\Throwable $t) {}

    $stmt = $pdo->query("SELECT * FROM orders ORDER BY id DESC LIMIT 50");
    $rows = $stmt->fetchAll();

    $orders = [];
    foreach ($rows as $row) {
        $custInfo = json_decode($row['customer_info'], true) ?? [];
        $itemsArr = json_decode($row['items'], true) ?? [];

        $orders[] = [
            'orderCode' => $row['order_code'],
            'date' => $row['created_at'],
            'createdAt' => $row['created_at'],
            'finalPrice' => (float)$row['final_price'],
            'totalPrice' => (float)$row['final_price'],
            'status' => $row['status'],
            'paymentMethod' => $row['payment_method'],
            'trackingNumber' => $row['tracking_number'],
            'customerInfo' => $custInfo,
            'items' => $itemsArr
        ];
    }

    echo json_encode(['success' => true, 'orders' => $orders], JSON_UNESCAPED_UNICODE);
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'خطای سرور: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
