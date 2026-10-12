<?php
/**
 * Admin-only visitor analytics.
 * Live "online now" (visitors with a visible tab in the last 70 seconds), all-time totals,
 * 14-day trend, breakdowns and the most recent visits.
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
    echo json_encode(array('success' => false, 'message' => 'خطا در اتصال به دیتابیس'), JSON_UNESCAPED_UNICODE);
    exit();
}

$conn->set_charset("utf8mb4");

// A visitor counts as online while a visible tab has sent a heartbeat (every 30s) recently.
$ONLINE_WINDOW = 70;

function rows($conn, $sql) {
    $out = array();
    $res = $conn->query($sql);
    if ($res) {
        while ($r = $res->fetch_assoc()) {
            $out[] = $r;
        }
    }
    return $out;
}

function one($conn, $sql) {
    $list = rows($conn, $sql);
    return count($list) ? $list[0] : array();
}

function has_column($conn, $table, $column) {
    $res = $conn->query("SHOW COLUMNS FROM `{$table}` LIKE '{$column}'");
    return $res && $res->num_rows > 0;
}

function has_table($conn, $table) {
    $res = $conn->query("SHOW TABLES LIKE '{$table}'");
    return $res && $res->num_rows > 0;
}

if (!has_table($conn, 'visitor_telemetry')) {
    echo json_encode(array(
        'success' => true,
        'ready'   => false,
        'message' => 'هنوز هیچ بازدیدی ثبت نشده است.'
    ), JSON_UNESCAPED_UNICODE);
    exit();
}

$hasLive = has_column($conn, 'visitor_telemetry', 'last_seen_at') && has_column($conn, 'visitor_telemetry', 'is_active');
$hasPv = has_table($conn, 'visitor_pageviews');
$lastSeen = $hasLive ? 'COALESCE(`last_seen_at`, `created_at`)' : '`created_at`';
$pageViewsCol = has_column($conn, 'visitor_telemetry', 'page_views') ? '`page_views`' : '1';
$referrerCol = has_column($conn, 'visitor_telemetry', 'referrer') ? '`referrer`' : "''";

/* ---------------- Live ---------------- */

$live = array();
$onlineCount = 0;
if ($hasLive) {
    $liveRows = rows($conn, "SELECT `visitor_id`, `session_id`, `current_path`, `device_type`, `os_name`, `browser_name`,
            `city`, `country`, {$pageViewsCol} AS page_views,
            TIMESTAMPDIFF(SECOND, `created_at`, NOW()) AS on_site,
            TIMESTAMPDIFF(SECOND, `last_seen_at`, NOW()) AS idle
        FROM `visitor_telemetry`
        WHERE `is_active` = 1 AND `last_seen_at` >= DATE_SUB(NOW(), INTERVAL {$ONLINE_WINDOW} SECOND)
        ORDER BY `last_seen_at` DESC
        LIMIT 200");

    $seen = array();
    foreach ($liveRows as $r) {
        $seen[$r['visitor_id']] = true;
        $live[] = array(
            'visitorId'   => $r['visitor_id'],
            'sessionId'   => $r['session_id'],
            'currentPath' => $r['current_path'],
            'device'      => $r['device_type'],
            'os'          => $r['os_name'],
            'browser'     => $r['browser_name'],
            'city'        => $r['city'],
            'country'     => $r['country'],
            'pageViews'   => (int)$r['page_views'],
            'onSiteSeconds' => max(0, (int)$r['on_site']),
            'idleSeconds' => max(0, (int)$r['idle'])
        );
    }
    $onlineCount = count($seen);
}

/* ---------------- Totals ---------------- */

$totals = one($conn, "SELECT COUNT(DISTINCT `session_id`) AS visits, COUNT(DISTINCT `visitor_id`) AS visitors,
        COALESCE(SUM({$pageViewsCol}), 0) AS page_views,
        COALESCE(AVG(NULLIF(`duration_seconds`, 0)), 0) AS avg_duration,
        SUM(CASE WHEN {$pageViewsCol} <= 1 AND `duration_seconds` < 10 THEN 1 ELSE 0 END) AS bounces
    FROM `visitor_telemetry`");

$today = one($conn, "SELECT COUNT(DISTINCT `session_id`) AS visits, COUNT(DISTINCT `visitor_id`) AS visitors
    FROM `visitor_telemetry` WHERE `created_at` >= CURDATE()");

$last7 = one($conn, "SELECT COUNT(DISTINCT `session_id`) AS visits, COUNT(DISTINCT `visitor_id`) AS visitors
    FROM `visitor_telemetry` WHERE `created_at` >= DATE_SUB(NOW(), INTERVAL 7 DAY)");

$returning = one($conn, "SELECT COUNT(*) AS n FROM (
        SELECT `visitor_id` FROM `visitor_telemetry` GROUP BY `visitor_id` HAVING COUNT(*) > 1
    ) t");

/* ---------------- Trend: visits per hour-ago bucket, bucketed into days by the browser ---------------- */

$hourly = array();
foreach (rows($conn, "SELECT FLOOR(TIMESTAMPDIFF(MINUTE, `created_at`, NOW()) / 60) AS h, COUNT(*) AS n
        FROM `visitor_telemetry`
        WHERE `created_at` >= DATE_SUB(NOW(), INTERVAL 15 DAY)
        GROUP BY h") as $r) {
    $hourly[] = array('h' => (int)$r['h'], 'n' => (int)$r['n']);
}

/* ---------------- Breakdowns ---------------- */

function breakdown($conn, $col, $limit) {
    $out = array();
    foreach (rows($conn, "SELECT `{$col}` AS name, COUNT(*) AS n FROM `visitor_telemetry`
            GROUP BY `{$col}` ORDER BY n DESC LIMIT {$limit}") as $r) {
        $out[] = array('name' => (string)$r['name'], 'count' => (int)$r['n']);
    }
    return $out;
}

$sections = array();
if ($hasPv) {
    foreach (rows($conn, "SELECT `section`, `path`, COUNT(*) AS n FROM `visitor_pageviews`
            WHERE `created_at` >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY `section`, `path` ORDER BY n DESC LIMIT 40") as $r) {
        $sections[] = array('section' => (string)$r['section'], 'path' => (string)$r['path'], 'count' => (int)$r['n']);
    }
}

$referrers = array();
foreach (rows($conn, "SELECT {$referrerCol} AS ref, COUNT(*) AS n FROM `visitor_telemetry`
        GROUP BY ref ORDER BY n DESC LIMIT 12") as $r) {
    $referrers[] = array('name' => (string)$r['ref'], 'count' => (int)$r['n']);
}

/* ---------------- Recent visits ---------------- */

$recent = array();
foreach (rows($conn, "SELECT *, {$pageViewsCol} AS pv, {$referrerCol} AS ref,
            TIMESTAMPDIFF(SECOND, `created_at`, NOW()) AS age,
            TIMESTAMPDIFF(SECOND, {$lastSeen}, NOW()) AS idle
        FROM `visitor_telemetry` ORDER BY `id` DESC LIMIT 150") as $row) {
    $details = json_decode(isset($row['raw_telemetry_json']) ? (string)$row['raw_telemetry_json'] : '', true);
    $isOnline = $hasLive && (int)$row['is_active'] === 1 && (int)$row['idle'] <= $ONLINE_WINDOW;
    $recent[] = array(
        'id'          => (int)$row['id'],
        'visitorId'   => $row['visitor_id'],
        'sessionId'   => $row['session_id'],
        'ageSeconds'  => max(0, (int)$row['age']),
        'idleSeconds' => max(0, (int)$row['idle']),
        'online'      => $isOnline,
        'ip'          => $row['ip_address'],
        'city'        => $row['city'],
        'country'     => $row['country'],
        'device'      => $row['device_type'],
        'os'          => $row['os_name'],
        'browser'     => $row['browser_name'],
        'gpu'         => $row['gpu_renderer'],
        'cpu'         => (int)$row['cpu_cores'],
        'ram'         => $row['ram_gb'] !== null ? (int)$row['ram_gb'] : null,
        'battery'     => $row['battery_level'] !== null ? (int)$row['battery_level'] : null,
        'network'     => $row['network_type'],
        'screen'      => $row['screen_resolution'],
        'currentPath' => $row['current_path'],
        'duration'    => (int)$row['duration_seconds'],
        'pageViews'   => (int)$row['pv'],
        'referrer'    => (string)$row['ref'],
        'details'     => is_array($details) ? $details : null
    );
}

$payload = array(
    'success' => true,
    'ready'   => true,
    'onlineWindowSeconds' => $ONLINE_WINDOW,
    'live' => array(
        'online'   => $onlineCount,
        'sessions' => $live
    ),
    'totals' => array(
        'visits'        => isset($totals['visits']) ? (int)$totals['visits'] : 0,
        'visitors'      => isset($totals['visitors']) ? (int)$totals['visitors'] : 0,
        'pageViews'     => isset($totals['page_views']) ? (int)$totals['page_views'] : 0,
        'avgDuration'   => isset($totals['avg_duration']) ? (int)round($totals['avg_duration']) : 0,
        'bounces'       => isset($totals['bounces']) ? (int)$totals['bounces'] : 0,
        'returning'     => isset($returning['n']) ? (int)$returning['n'] : 0,
        'todayVisits'   => isset($today['visits']) ? (int)$today['visits'] : 0,
        'todayVisitors' => isset($today['visitors']) ? (int)$today['visitors'] : 0,
        'last7Visits'   => isset($last7['visits']) ? (int)$last7['visits'] : 0,
        'last7Visitors' => isset($last7['visitors']) ? (int)$last7['visitors'] : 0
    ),
    'hourly'    => $hourly,
    'devices'   => breakdown($conn, 'device_type', 5),
    'os'        => breakdown($conn, 'os_name', 6),
    'browsers'  => breakdown($conn, 'browser_name', 6),
    'cities'    => breakdown($conn, 'city', 8),
    'sections'  => $sections,
    'referrers' => $referrers,
    'recent'    => $recent
);

$json = json_encode($payload, JSON_UNESCAPED_UNICODE);
if ($json === false) {
    // A malformed raw record must not take the whole dashboard down.
    foreach ($payload['recent'] as $i => $r) {
        $payload['recent'][$i]['details'] = null;
    }
    $json = json_encode($payload, JSON_UNESCAPED_UNICODE);
}
if ($json === false) {
    $json = json_encode(array('success' => false, 'message' => 'خطا در آماده‌سازی گزارش بازدید'), JSON_UNESCAPED_UNICODE);
}
echo $json;

$conn->close();
