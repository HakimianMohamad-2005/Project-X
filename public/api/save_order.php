<?php
require_once __DIR__ . '/db.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data || empty($data['orderCode'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'اطلاعات سفارش نامعتبر است (کد سفارش موجود نیست)'], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    // 1. Ensure table exists
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
    } catch (\Throwable $t) {
        // Table creation warning ignored if table already exists or user lacks CREATE privilege
    }

    // 2. Prepare variables safely
    $orderCode = trim((string)$data['orderCode']);
    $createdAt = !empty($data['date']) ? (string)$data['date'] : (!empty($data['createdAt']) ? (string)$data['createdAt'] : date('Y-m-d H:i:s'));
    $finalPrice = (float)($data['finalPrice'] ?? $data['totalPrice'] ?? 0);
    $status = !empty($data['status']) ? (string)$data['status'] : 'ثبت سفارش';
    $paymentMethod = !empty($data['paymentMethod']) ? (string)$data['paymentMethod'] : 'درگاه آنلاین زرین‌پال';
    $trackingNumber = !empty($data['trackingNumber']) ? (string)$data['trackingNumber'] : '';
    
    $customerInfoArr = is_array($data['customerInfo'] ?? null) ? $data['customerInfo'] : [];
    $itemsArr = is_array($data['items'] ?? null) ? $data['items'] : [];

    $customerInfoJson = json_encode($customerInfoArr, JSON_UNESCAPED_UNICODE);
    $itemsJson = json_encode($itemsArr, JSON_UNESCAPED_UNICODE);

    // 3. Insert or Update order using MySQL VALUES() function
    $sql = "INSERT INTO `orders` (`order_code`, `created_at`, `final_price`, `status`, `payment_method`, `tracking_number`, `customer_info`, `items`) 
            VALUES (:order_code, :created_at, :final_price, :status, :payment_method, :tracking_number, :customer_info, :items)
            ON DUPLICATE KEY UPDATE 
            `final_price` = VALUES(`final_price`),
            `status` = VALUES(`status`),
            `customer_info` = VALUES(`customer_info`),
            `items` = VALUES(`items`),
            `payment_method` = VALUES(`payment_method`),
            `tracking_number` = VALUES(`tracking_number`)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':order_code'      => $orderCode,
        ':created_at'      => $createdAt,
        ':final_price'     => $finalPrice,
        ':status'          => $status,
        ':payment_method'  => $paymentMethod,
        ':tracking_number' => $trackingNumber,
        ':customer_info'   => $customerInfoJson,
        ':items'           => $itemsJson,
    ]);

    echo json_encode([
        'success'   => true,
        'message'   => 'سفارش با موفقیت در دیتابیس cPanel ثبت گردید',
        'orderCode' => $orderCode
    ], JSON_UNESCAPED_UNICODE);

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'خطا در ثبت سفارش در دیتابیس: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
