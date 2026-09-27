<?php
/**
 * Server-Side Visitor Telemetry Collector Endpoint
 * Silently collects client telemetry and inserts/updates in visitor_telemetry table.
 */

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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(array('success' => false, 'message' => 'Method Not Allowed'));
    exit();
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data || !isset($data['visitorId']) || !isset($data['sessionId'])) {
    echo json_encode(array('success' => false, 'message' => 'Invalid Payload'));
    exit();
}

require_once __DIR__ . '/db.php';

// Detect real client IP from server headers
$clientIp = '';
if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
    $clientIp = $_SERVER['HTTP_CF_CONNECTING_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
    $clientIp = trim($parts[0]);
} else {
    $clientIp = $_SERVER['REMOTE_ADDR'] ?? '';
}

$vid = $conn->real_escape_string($data['visitorId']);
$sid = $conn->real_escape_string($data['sessionId']);
$ip = $conn->real_escape_string(!empty($clientIp) ? $clientIp : ($data['geo']['ip'] ?? ''));
$city = $conn->real_escape_string($data['geo']['city'] ?? '');
$country = $conn->real_escape_string($data['geo']['country'] ?? '');
$device = $conn->real_escape_string($data['client']['deviceType'] ?? 'desktop');
$os = $conn->real_escape_string($data['client']['os'] ?? '');
$browser = $conn->real_escape_string($data['client']['browser'] ?? '');
$gpu = $conn->real_escape_string($data['hardware']['gpu']['renderer'] ?? '');
$cpu = (int)($data['hardware']['cpuCores'] ?? 4);
$ram = isset($data['hardware']['deviceMemoryGb']) ? (int)$data['hardware']['deviceMemoryGb'] : "NULL";
$battery = isset($data['battery']['levelPercent']) ? (int)$data['battery']['levelPercent'] : "NULL";
$network = $conn->real_escape_string($data['network']['effectiveType'] ?? '');
$screenRes = $conn->real_escape_string(($data['screen']['screenWidth'] ?? 0) . 'x' . ($data['screen']['screenHeight'] ?? 0));
$currentPath = $conn->real_escape_string($data['currentPath'] ?? '/');
$duration = (int)($data['durationSeconds'] ?? 0);
$rawJson = $conn->real_escape_string($rawInput);

// Check if this session already exists, update duration if so, else insert
$checkSql = "SELECT id FROM `visitor_telemetry` WHERE `session_id` = '$sid' LIMIT 1";
$checkRes = $conn->query($checkSql);

if ($checkRes && $checkRes->num_rows > 0) {
    $updateSql = "UPDATE `visitor_telemetry` SET
        `duration_seconds` = $duration,
        `current_path` = '$currentPath',
        `battery_level` = $battery,
        `raw_telemetry_json` = '$rawJson'
        WHERE `session_id` = '$sid'";
    $conn->query($updateSql);
} else {
    $insertSql = "INSERT INTO `visitor_telemetry` (
        `visitor_id`, `session_id`, `ip_address`, `city`, `country`,
        `device_type`, `os_name`, `browser_name`, `gpu_renderer`,
        `cpu_cores`, `ram_gb`, `battery_level`, `network_type`,
        `screen_resolution`, `current_path`, `duration_seconds`, `raw_telemetry_json`
    ) VALUES (
        '$vid', '$sid', '$ip', '$city', '$country',
        '$device', '$os', '$browser', '$gpu',
        $cpu, $ram, $battery, '$network',
        '$screenRes', '$currentPath', $duration, '$rawJson'
    )";
    $conn->query($insertSql);
}

echo json_encode(array('success' => true, 'sessionId' => $sid));
$conn->close();
