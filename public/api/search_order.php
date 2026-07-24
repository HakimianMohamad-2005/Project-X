<?php
require_once __DIR__ . '/db.php';

function normalizeDigits($str) {
    if (!$str) return '';
    $persian = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    $arabic  = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    $num     = ['0','1','2','3','4','5','6','7','8','9'];
    $str = str_replace($persian, $num, $str);
    $str = str_replace($arabic, $num, $str);
    return strtolower(preg_replace('/[\s\-_]/', '', $str));
}

$query = $_GET['q'] ?? $_GET['code'] ?? '';
$query = trim($query);

if (empty($query)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'عبارت جستجو وارد نشده است'], JSON_UNESCAPED_UNICODE);
    exit();
}

$normQuery = normalizeDigits($query);

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

    $stmt = $pdo->query("SELECT * FROM orders ORDER BY id DESC LIMIT 100");
    $rows = $stmt->fetchAll();

    $found = null;
    foreach ($rows as $row) {
        $normCode = normalizeDigits($row['order_code']);
        $custInfo = json_decode($row['customer_info'], true) ?? [];
        $phone = $custInfo['mobile'] ?? $custInfo['phone'] ?? '';
        $normPhone = normalizeDigits($phone);

        if ($normCode === $normQuery || 
            $normPhone === $normQuery || 
            strpos($normCode, $normQuery) !== false || 
            (strlen($normPhone) > 3 && strpos($normPhone, $normQuery) !== false) ||
            (strlen($normQuery) >= 4 && substr($normCode, -strlen($normQuery)) === $normQuery)) {
            
            $found = [
                'orderCode' => $row['order_code'],
                'date' => $row['created_at'],
                'createdAt' => $row['created_at'],
                'finalPrice' => (float)$row['final_price'],
                'totalPrice' => (float)$row['final_price'],
                'status' => $row['status'],
                'paymentMethod' => $row['payment_method'],
                'trackingNumber' => $row['tracking_number'],
                'customerInfo' => $custInfo,
                'items' => json_decode($row['items'], true) ?? []
            ];
            break;
        }
    }

    if ($found) {
        echo json_encode(['success' => true, 'order' => $found], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['success' => false, 'message' => 'سفارشی با این مشخصات یافت نشد'], JSON_UNESCAPED_UNICODE);
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'خطای سرور: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
