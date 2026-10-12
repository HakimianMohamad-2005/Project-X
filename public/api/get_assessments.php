<?php
/**
 * Admin-only reader for the advanced assessment results.
 * Returns full respondent profiles, scores, hotspots and every answer.
 * Protected by the admin passcode (X-Admin-Passcode header or ?passcode=).
 */

error_reporting(0);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Admin-Passcode');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$passcode = '';
if (isset($_SERVER['HTTP_X_ADMIN_PASSCODE'])) {
    $passcode = (string)$_SERVER['HTTP_X_ADMIN_PASSCODE'];
} elseif (isset($_GET['passcode'])) {
    $passcode = (string)$_GET['passcode'];
}

$validCodes = array('3plus@admin', 'orangutan40', '4430929292');

if (!in_array(trim($passcode), $validCodes, true)) {
    http_response_code(403);
    echo json_encode(array(
        'success' => false,
        'message' => 'دسترسی غیرمجاز. لطفاً دوباره وارد پنل مدیریت شوید.'
    ), JSON_UNESCAPED_UNICODE);
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
        'message' => 'خطا در اتصال به دیتابیس'
    ), JSON_UNESCAPED_UNICODE);
    exit();
}

$conn->set_charset("utf8mb4");

$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 1000;
if ($limit < 1 || $limit > 5000) {
    $limit = 1000;
}

$sql = "SELECT id, created_at, full_name, phone, role, industry, headcount, experience, scope,
               raw_score, percentage, tier_title, consistency_level, consistency_score,
               key_strength, hotspots, answers, status
        FROM advanced_assessments
        ORDER BY id DESC
        LIMIT {$limit}";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode(array(
        'success' => true,
        'assessments' => array(),
        'total' => 0,
        'message' => 'هنوز هیچ آزمونی ثبت نشده است.'
    ), JSON_UNESCAPED_UNICODE);
    exit();
}

$items = array();
while ($row = $result->fetch_assoc()) {
    $hotspots = json_decode(isset($row['hotspots']) ? (string)$row['hotspots'] : '', true);
    $answers = json_decode(isset($row['answers']) ? (string)$row['answers'] : '', true);

    $items[] = array(
        'id'               => (int)$row['id'],
        'createdAt'        => $row['created_at'],
        'fullName'         => $row['full_name'],
        'phone'            => $row['phone'],
        'role'             => $row['role'],
        'industry'         => $row['industry'],
        'headcount'        => $row['headcount'],
        'experience'       => $row['experience'],
        'scope'            => $row['scope'],
        'rawScore'         => (int)$row['raw_score'],
        'percentage'       => (int)$row['percentage'],
        'tierTitle'        => $row['tier_title'],
        'consistencyLevel' => $row['consistency_level'],
        'consistencyScore' => $row['consistency_score'],
        'keyStrength'      => $row['key_strength'],
        'hotspots'         => is_array($hotspots) ? $hotspots : array(),
        'answers'          => is_array($answers) ? $answers : array(),
        'status'           => $row['status']
    );
}

$totalRes = $conn->query("SELECT COUNT(*) AS total FROM advanced_assessments");
$totalRow = $totalRes ? $totalRes->fetch_assoc() : array('total' => count($items));

echo json_encode(array(
    'success'     => true,
    'assessments' => $items,
    'total'       => (int)$totalRow['total'],
    'serverTime'  => date('Y-m-d H:i:s')
), JSON_UNESCAPED_UNICODE);

$conn->close();
