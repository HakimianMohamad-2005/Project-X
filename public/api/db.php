<?php
ini_set('display_errors', 0);
error_reporting(0);

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

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => true,
    ]);
} catch (\Throwable $e) {
    http_response_code(200); // 200 می‌گذاریم تا JSON ارور چاپ شود
    echo json_encode([
        'success' => false, 
        'message' => 'خطا در اتصال به دیتابیس: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit();
}