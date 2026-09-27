<?php
/**
 * Confidential Server Telemetry Reader Endpoint
 * Protected by secret key / passcode.
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

$passcode = $_GET['passcode'] ?? $_POST['passcode'] ?? '';
$validCodes = array('3plus@admin', 'orangutan40', '4430929292');

if (!in_array(trim($passcode), $validCodes)) {
    http_response_code(403);
    echo json_encode(array('success' => false, 'message' => 'Unauthorized Access'));
    exit();
}

require_once __DIR__ . '/db.php';

$sql = "SELECT * FROM `visitor_telemetry` ORDER BY `id` DESC LIMIT 100";
$result = $conn->query($sql);

$logs = array();
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $logs[] = array(
            'id' => (int)$row['id'],
            'visitorId' => $row['visitor_id'],
            'sessionId' => $row['session_id'],
            'createdAt' => $row['created_at'],
            'ip' => $row['ip_address'],
            'city' => $row['city'],
            'country' => $row['country'],
            'device' => $row['device_type'],
            'os' => $row['os_name'],
            'browser' => $row['browser_name'],
            'gpu' => $row['gpu_renderer'],
            'cpu' => (int)$row['cpu_cores'],
            'ram' => $row['ram_gb'] !== null ? (int)$row['ram_gb'] : null,
            'battery' => $row['battery_level'] !== null ? (int)$row['battery_level'] : null,
            'network' => $row['network_type'],
            'screen' => $row['screen_resolution'],
            'currentPath' => $row['current_path'],
            'duration' => (int)$row['duration_seconds'],
            'details' => json_decode($row['raw_telemetry_json'], true)
        );
    }
}

// Count total sessions
$totalCountSql = "SELECT COUNT(*) as total FROM `visitor_telemetry`";
$totalRes = $conn->query($totalCountSql);
$totalRow = $totalRes ? $totalRes->fetch_assoc() : array('total' => 0);

echo json_encode(array(
    'success' => true,
    'totalVisitors' => (int)$totalRow['total'],
    'logs' => $logs
), JSON_UNESCAPED_UNICODE);

$conn->close();
