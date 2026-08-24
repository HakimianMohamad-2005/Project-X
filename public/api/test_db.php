<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$db   = 'oranguta_book';
$user = 'oranguta_Controller';
$pass = 'Y^!{i~0bYS0BI&Fi^R';

$conn = @new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(array(
        'success' => false,
        'message' => 'خطا در اتصال به دیتابیس: ' . $conn->connect_error
    ), JSON_UNESCAPED_UNICODE);
    exit();
}

$conn->set_charset("utf8mb4");

// Fetch existing tables
$tables = array();
$result = $conn->query("SHOW TABLES");
if ($result) {
    while ($row = $result->fetch_array(MYSQLI_NUM)) {
        $tables[] = $row[0];
    }
}

// Count records in orders table if present
$orderCount = 0;
if (in_array('orders', $tables)) {
    $resOrders = $conn->query("SELECT COUNT(*) AS total FROM orders");
    if ($resOrders) {
        $rowO = $resOrders->fetch_assoc();
        $orderCount = (int)$rowO['total'];
    }
}

// Count records in user_experiences table if present
$experienceCount = 0;
if (in_array('user_experiences', $tables)) {
    $resExp = $conn->query("SELECT COUNT(*) AS total FROM user_experiences");
    if ($resExp) {
        $rowE = $resExp->fetch_assoc();
        $experienceCount = (int)$rowE['total'];
    }
}

echo json_encode(array(
    'success'         => true,
    'message'         => 'اتصال به دیتابیس MySQL روی cPanel کاملاً صحیح و فعال است.',
    'database'        => $db,
    'user'            => $user,
    'tables'          => $tables,
    'orderCount'      => $orderCount,
    'experienceCount' => $experienceCount,
    'serverTime'      => date('Y-m-d H:i:s')
), JSON_UNESCAPED_UNICODE);
