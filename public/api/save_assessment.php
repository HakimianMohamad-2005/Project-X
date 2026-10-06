<?php
error_reporting(0);
ini_set('display_errors', 0);

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database credentials
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

// Auto-create table if not exists
$tableSql = "CREATE TABLE IF NOT EXISTS `advanced_assessments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT current_timestamp(),
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT '',
  `role` varchar(255) DEFAULT '',
  `industry` varchar(255) DEFAULT '',
  `headcount` varchar(100) DEFAULT '',
  `experience` varchar(100) DEFAULT '',
  `scope` varchar(255) DEFAULT '',
  `raw_score` int(11) DEFAULT 0,
  `percentage` int(11) DEFAULT 0,
  `tier_title` varchar(255) DEFAULT '',
  `consistency_level` varchar(50) DEFAULT '',
  `consistency_score` varchar(50) DEFAULT '',
  `key_strength` varchar(255) DEFAULT '',
  `hotspots` text DEFAULT NULL,
  `answers` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'completed',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

@$conn->query($tableSql);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT id, created_at, full_name, phone, role, industry, headcount, experience, scope, raw_score, percentage, tier_title, consistency_level, consistency_score, key_strength, status FROM advanced_assessments ORDER BY id DESC LIMIT 100";
    $result = $conn->query($sql);
    $items = array();

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
    }

    echo json_encode(array(
        'success' => true,
        'assessments' => $items,
        'total' => count($items)
    ), JSON_UNESCAPED_UNICODE);
    exit();
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(array('success' => false, 'message' => 'اطلاعاتی دریافت نشد'), JSON_UNESCAPED_UNICODE);
    exit();
}

$profile = isset($data['profile']) && is_array($data['profile']) ? $data['profile'] : $data;

$fullName = $conn->real_escape_string(trim(isset($profile['fullName']) ? (string)$profile['fullName'] : (isset($data['fullName']) ? (string)$data['fullName'] : '')));
$phone = $conn->real_escape_string(trim(isset($profile['phone']) ? (string)$profile['phone'] : (isset($data['phone']) ? (string)$data['phone'] : '')));
$role = $conn->real_escape_string(trim(isset($profile['role']) ? (string)$profile['role'] : (isset($data['role']) ? (string)$data['role'] : '')));
$industry = $conn->real_escape_string(trim(isset($profile['industry']) ? (string)$profile['industry'] : (isset($data['industry']) ? (string)$data['industry'] : '')));
$headcount = $conn->real_escape_string(trim(isset($profile['headcount']) ? (string)$profile['headcount'] : (isset($data['headcount']) ? (string)$data['headcount'] : '')));
$experience = $conn->real_escape_string(trim(isset($profile['experience']) ? (string)$profile['experience'] : (isset($data['experience']) ? (string)$data['experience'] : '')));
$scope = $conn->real_escape_string(trim(isset($profile['scope']) ? (string)$profile['scope'] : (isset($data['scope']) ? (string)$data['scope'] : '')));

$assessmentId = isset($data['assessmentId']) ? (int)$data['assessmentId'] : 0;
$status = $conn->real_escape_string(isset($data['status']) ? (string)$data['status'] : 'completed');

// Result fields (if test is completed)
$resultData = isset($data['result']) && is_array($data['result']) ? $data['result'] : array();

$rawScore = isset($resultData['rawScore']) ? (int)$resultData['rawScore'] : (isset($data['rawScore']) ? (int)$data['rawScore'] : 0);
$percentage = isset($resultData['engagementPercentage']) ? (int)$resultData['engagementPercentage'] : (isset($data['percentage']) ? (int)$data['percentage'] : 0);

$tierTitle = '';
if (isset($resultData['tier']['title'])) {
    $tierTitle = (string)$resultData['tier']['title'];
} elseif (isset($data['tierTitle'])) {
    $tierTitle = (string)$data['tierTitle'];
}
$tierTitle = $conn->real_escape_string($tierTitle);

$consistencyLevel = '';
$consistencyScore = '';
if (isset($resultData['consistency'])) {
    $consistencyLevel = isset($resultData['consistency']['level']) ? (string)$resultData['consistency']['level'] : '';
    $consistencyScore = isset($resultData['consistency']['score']) ? (string)$resultData['consistency']['score'] : '';
}
$consistencyLevel = $conn->real_escape_string($consistencyLevel);
$consistencyScore = $conn->real_escape_string($consistencyScore);

$keyStrength = '';
if (isset($resultData['keyStrength']['title'])) {
    $keyStrength = (string)$resultData['keyStrength']['title'];
}
$keyStrength = $conn->real_escape_string($keyStrength);

$hotspotsJson = '[]';
if (isset($resultData['hotspots']) && is_array($resultData['hotspots'])) {
    $hotspotsList = array();
    foreach ($resultData['hotspots'] as $h) {
        $hotspotsList[] = array(
            'dimension' => isset($h['dimension']) ? $h['dimension'] : '',
            'title' => isset($h['title']) ? $h['title'] : '',
            'percentage' => isset($h['percentage']) ? $h['percentage'] : 0
        );
    }
    $hotspotsJson = json_encode($hotspotsList, JSON_UNESCAPED_UNICODE);
}
$hotspotsJson = $conn->real_escape_string($hotspotsJson);

$answersJson = '[]';
if (isset($resultData['answers'])) {
    $answersJson = json_encode($resultData['answers'], JSON_UNESCAPED_UNICODE);
} elseif (isset($data['answers'])) {
    $answersJson = json_encode($data['answers'], JSON_UNESCAPED_UNICODE);
}
$answersJson = $conn->real_escape_string($answersJson);

if ($assessmentId > 0) {
    // Update existing record
    $sql = "UPDATE advanced_assessments SET
            raw_score = {$rawScore},
            percentage = {$percentage},
            tier_title = '{$tierTitle}',
            consistency_level = '{$consistencyLevel}',
            consistency_score = '{$consistencyScore}',
            key_strength = '{$keyStrength}',
            hotspots = '{$hotspotsJson}',
            answers = '{$answersJson}',
            status = '{$status}'
            WHERE id = {$assessmentId}";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(array(
            'success' => true,
            'id' => $assessmentId,
            'message' => 'نتایج آزمون پیشرفته با موفقیت در دیتابیس به‌روزرسانی شد'
        ), JSON_UNESCAPED_UNICODE);
        exit();
    }
}

// Otherwise insert new record
if (empty($fullName)) {
    $fullName = 'مدیر ارشد سازمان';
}

$sql = "INSERT INTO advanced_assessments
        (full_name, phone, role, industry, headcount, experience, scope, raw_score, percentage, tier_title, consistency_level, consistency_score, key_strength, hotspots, answers, status)
        VALUES
        ('{$fullName}', '{$phone}', '{$role}', '{$industry}', '{$headcount}', '{$experience}', '{$scope}', {$rawScore}, {$percentage}, '{$tierTitle}', '{$consistencyLevel}', '{$consistencyScore}', '{$keyStrength}', '{$hotspotsJson}', '{$answersJson}', '{$status}')";

if ($conn->query($sql) === TRUE) {
    $insertedId = $conn->insert_id;
    echo json_encode(array(
        'success' => true,
        'id' => $insertedId,
        'message' => 'اطلاعات آزمون پیشرفته با موفقیت در دیتابیس ذخیره شد'
    ), JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(array(
        'success' => false,
        'message' => 'خطای دیتابیس: ' . $conn->error
    ), JSON_UNESCAPED_UNICODE);
}
