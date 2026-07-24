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
    echo json_encode(['success' => false, 'message' => 'عبارت جستجو وارد نشده است']);
    exit();
}

$normQuery = normalizeDigits($query);

try {
    $stmt = $pdo->query("SELECT * FROM orders ORDER BY id DESC LIMIT 100");
    $rows = $stmt->fetchAll();

    $found = null;
    foreach ($rows as $row) {
        $normCode = normalizeDigits($row['order_code']);
        $custInfo = json_decode($row['customer_info'], true);
        $normPhone = normalizeDigits($custInfo['phone'] ?? '');

        if ($normCode === $normQuery || 
            $normPhone === $normQuery || 
            strpos($normCode, $normQuery) !== false || 
            strpos($normPhone, $normQuery) !== false ||
            (strlen($normQuery) >= 4 && substr($normCode, -strlen($normQuery)) === $normQuery)) {
            
            $found = [
                'orderCode' => $row['order_code'],
                'createdAt' => $row['created_at'],
                'finalPrice' => (float)$row['final_price'],
                'status' => $row['status'],
                'paymentMethod' => $row['payment_method'],
                'trackingNumber' => $row['tracking_number'],
                'customerInfo' => $custInfo,
                'items' => json_decode($row['items'], true)
            ];
            break;
        }
    }

    if ($found) {
        echo json_encode(['success' => true, 'order' => $found]);
    } else {
        echo json_encode(['success' => false, 'message' => 'سفارشی یافت نشد']);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'خطای سرور: ' . $e->getMessage()]);
}
