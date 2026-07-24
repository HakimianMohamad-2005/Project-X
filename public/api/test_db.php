<?php
require_once __DIR__ . '/db.php';

try {
    // Test simple SELECT query
    $stmt = $pdo->query("SELECT 1 AS alive");
    $alive = $stmt->fetch();

    // Fetch existing tables
    $tables = [];
    $stmtTables = $pdo->query("SHOW TABLES");
    while ($row = $stmtTables->fetch(PDO::FETCH_NUM)) {
        $tables[] = $row[0];
    }

    // Count records in orders table if present
    $orderCount = 0;
    if (in_array('orders', $tables)) {
        $stmtOrders = $pdo->query("SELECT COUNT(*) FROM orders");
        $orderCount = (int)$stmtOrders->fetchColumn();
    }

    echo json_encode([
        'success' => true,
        'message' => 'اتصال به دیتابیس MySQL روی cPanel کاملاً صحیح و فعال است.',
        'database' => 'oranguta_book',
        'user' => 'oranguta_Controller',
        'tables' => $tables,
        'orderCount' => $orderCount,
        'serverTime' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);

} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'خطا در ارتباط با دیتابیس: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
