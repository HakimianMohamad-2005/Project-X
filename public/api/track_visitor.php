<?php
/**
 * Visitor tracking endpoint (public).
 *
 * Actions (JSON body, field "action"):
 *   start     — a page load; creates the visit (session) row or resumes it.
 *   heartbeat — sent every ~30s while the tab is visible; keeps the visitor "online".
 *   pageview  — the visitor opened another section of the site.
 *   leave     — the tab was hidden or closed; the visitor drops out of "online" at once.
 *
 * Only the public total is returned; live counts are reserved for get_telemetry.php.
 */

error_reporting(0);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(array('success' => false, 'message' => 'درخواست نامعتبر است.'), JSON_UNESCAPED_UNICODE);
    exit();
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!is_array($data)) {
    echo json_encode(array('success' => false, 'message' => 'اطلاعات دریافتی نامعتبر است.'), JSON_UNESCAPED_UNICODE);
    exit();
}

/** Safe nested read: pick($data, array('a', 'b'), 'default'). */
function pick($arr, $path, $default) {
    $cur = $arr;
    foreach ($path as $key) {
        if (!is_array($cur) || !isset($cur[$key])) {
            return $default;
        }
        $cur = $cur[$key];
    }
    return $cur;
}

function clip($value, $max) {
    $value = trim((string)$value);
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $max, 'UTF-8');
    }
    return substr($value, 0, $max);
}

$vidRaw = (string)pick($data, array('visitorId'), '');
$sidRaw = (string)pick($data, array('sessionId'), '');

if (!preg_match('/^VID-[A-Z0-9]{4,24}$/', $vidRaw) || !preg_match('/^SID-[A-Z0-9]{4,24}$/', $sidRaw)) {
    echo json_encode(array('success' => false, 'message' => 'شناسه بازدیدکننده نامعتبر است.'), JSON_UNESCAPED_UNICODE);
    exit();
}

$action = (string)pick($data, array('action'), 'start');
if (!in_array($action, array('start', 'heartbeat', 'pageview', 'leave'), true)) {
    $action = 'start';
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

/* ------------------------------------------------------------------
   Schema (created on first use; older tables get the new columns)
   ------------------------------------------------------------------ */

function ensure_schema($conn) {
    @$conn->query("CREATE TABLE IF NOT EXISTS `visitor_telemetry` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `visitor_id` VARCHAR(50) NOT NULL,
        `session_id` VARCHAR(50) NOT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        `last_seen_at` DATETIME DEFAULT NULL,
        `is_active` TINYINT(1) DEFAULT 1,
        `page_views` INT DEFAULT 1,
        `referrer` VARCHAR(255) DEFAULT '',
        `ip_address` VARCHAR(60) DEFAULT '',
        `city` VARCHAR(100) DEFAULT '',
        `country` VARCHAR(100) DEFAULT '',
        `device_type` VARCHAR(50) DEFAULT '',
        `os_name` VARCHAR(100) DEFAULT '',
        `browser_name` VARCHAR(100) DEFAULT '',
        `gpu_renderer` VARCHAR(255) DEFAULT '',
        `cpu_cores` INT DEFAULT 4,
        `ram_gb` INT DEFAULT NULL,
        `battery_level` INT DEFAULT NULL,
        `network_type` VARCHAR(50) DEFAULT '',
        `screen_resolution` VARCHAR(50) DEFAULT '',
        `current_path` VARCHAR(255) DEFAULT '/',
        `duration_seconds` INT DEFAULT 0,
        `raw_telemetry_json` LONGTEXT,
        INDEX `idx_vid` (`visitor_id`),
        INDEX `idx_sid` (`session_id`),
        INDEX `idx_created` (`created_at`),
        INDEX `idx_last_seen` (`last_seen_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $columns = array(
        'last_seen_at' => "ADD COLUMN `last_seen_at` DATETIME DEFAULT NULL, ADD INDEX `idx_last_seen` (`last_seen_at`)",
        'is_active'    => "ADD COLUMN `is_active` TINYINT(1) DEFAULT 1",
        'page_views'   => "ADD COLUMN `page_views` INT DEFAULT 1",
        'referrer'     => "ADD COLUMN `referrer` VARCHAR(255) DEFAULT ''"
    );
    foreach ($columns as $name => $ddl) {
        $res = $conn->query("SHOW COLUMNS FROM `visitor_telemetry` LIKE '" . $name . "'");
        if ($res && $res->num_rows === 0) {
            @$conn->query("ALTER TABLE `visitor_telemetry` " . $ddl);
        }
    }

    @$conn->query("CREATE TABLE IF NOT EXISTS `visitor_pageviews` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `visitor_id` VARCHAR(50) NOT NULL,
        `session_id` VARCHAR(50) NOT NULL,
        `path` VARCHAR(255) DEFAULT '/',
        `section` VARCHAR(60) DEFAULT '',
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX `idx_pv_created` (`created_at`),
        INDEX `idx_pv_section` (`section`),
        INDEX `idx_pv_sid` (`session_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
}

function record_pageview($conn, $vid, $sid, $path, $section) {
    $conn->query("INSERT INTO `visitor_pageviews` (`visitor_id`, `session_id`, `path`, `section`)
                  VALUES ('{$vid}', '{$sid}', '{$path}', '{$section}')");
}

function total_visits($conn) {
    $res = $conn->query("SELECT COUNT(DISTINCT `session_id`) AS total FROM `visitor_telemetry`");
    $row = $res ? $res->fetch_assoc() : null;
    return $row ? (int)$row['total'] : 0;
}

$vid = $conn->real_escape_string($vidRaw);
$sid = $conn->real_escape_string($sidRaw);
$path = $conn->real_escape_string(clip(pick($data, array('currentPath'), '/'), 255));
$section = $conn->real_escape_string(preg_replace('/[^a-z0-9\-]/', '', strtolower(clip(pick($data, array('section'), ''), 60))));
$city = $conn->real_escape_string(clip(pick($data, array('geo', 'city'), ''), 100));
$country = $conn->real_escape_string(clip(pick($data, array('geo', 'country'), ''), 100));

// Shared "touch" fragment: refresh last-seen, derive duration on the server clock.
$touch = "`last_seen_at` = NOW(),
          `duration_seconds` = GREATEST(0, TIMESTAMPDIFF(SECOND, `created_at`, NOW()))";
$geoSet = '';
if ($city !== '') {
    $geoSet .= ", `city` = '{$city}'";
}
if ($country !== '') {
    $geoSet .= ", `country` = '{$country}'";
}

/* ------------------------------------------------------------------
   Lightweight actions
   ------------------------------------------------------------------ */

if ($action === 'heartbeat' || $action === 'leave' || $action === 'pageview') {
    $active = $action === 'leave' ? 0 : 1;
    $extra = '';
    if ($action === 'pageview') {
        $extra = ", `page_views` = `page_views` + 1, `current_path` = '{$path}'";
    }
    $ok = $conn->query("UPDATE `visitor_telemetry`
                        SET {$touch}, `is_active` = {$active}{$extra}{$geoSet}
                        WHERE `session_id` = '{$sid}'");
    $known = $ok && $conn->affected_rows > 0;

    if (!$known) {
        // Either the schema is older or this visit predates the row; check before asking for a restart.
        $check = $conn->query("SELECT `id` FROM `visitor_telemetry` WHERE `session_id` = '{$sid}' LIMIT 1");
        $known = $check && $check->num_rows > 0;
    }
    if ($action === 'pageview' && $known) {
        record_pageview($conn, $vid, $sid, $path, $section);
    }

    echo json_encode(array('success' => true, 'known' => $known), JSON_UNESCAPED_UNICODE);
    $conn->close();
    exit();
}

/* ------------------------------------------------------------------
   start: create or resume the visit
   ------------------------------------------------------------------ */

ensure_schema($conn);

$check = $conn->query("SELECT `id` FROM `visitor_telemetry` WHERE `session_id` = '{$sid}' LIMIT 1");
$exists = $check && $check->num_rows > 0;

if ($exists) {
    $conn->query("UPDATE `visitor_telemetry`
                  SET {$touch}, `is_active` = 1, `page_views` = `page_views` + 1, `current_path` = '{$path}'{$geoSet}
                  WHERE `session_id` = '{$sid}'");
} else {
    // Real client IP from the server, never from the browser.
    $clientIp = '';
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        $clientIp = $_SERVER['HTTP_CF_CONNECTING_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $clientIp = trim($parts[0]);
    } elseif (isset($_SERVER['REMOTE_ADDR'])) {
        $clientIp = $_SERVER['REMOTE_ADDR'];
    }

    $ip = $conn->real_escape_string(clip($clientIp, 60));
    $referrer = $conn->real_escape_string(clip(pick($data, array('referrer'), ''), 255));
    $device = $conn->real_escape_string(clip(pick($data, array('client', 'deviceType'), 'desktop'), 50));
    $os = $conn->real_escape_string(clip(pick($data, array('client', 'os'), ''), 100));
    $browser = $conn->real_escape_string(clip(pick($data, array('client', 'browser'), ''), 100));
    $gpu = $conn->real_escape_string(clip(pick($data, array('hardware', 'gpu', 'renderer'), ''), 255));
    $cpu = (int)pick($data, array('hardware', 'cpuCores'), 0);
    $ramVal = pick($data, array('hardware', 'deviceMemoryGb'), null);
    $ram = is_numeric($ramVal) ? (int)$ramVal : 'NULL';
    $batteryVal = pick($data, array('battery', 'levelPercent'), null);
    $battery = is_numeric($batteryVal) ? (int)$batteryVal : 'NULL';
    $network = $conn->real_escape_string(clip(pick($data, array('network', 'effectiveType'), ''), 50));
    $screenRes = $conn->real_escape_string(
        (int)pick($data, array('screen', 'screenWidth'), 0) . 'x' . (int)pick($data, array('screen', 'screenHeight'), 0)
    );
    $rawJson = $conn->real_escape_string(clip($rawInput, 60000));

    $conn->query("INSERT INTO `visitor_telemetry` (
        `visitor_id`, `session_id`, `created_at`, `last_seen_at`, `is_active`, `page_views`, `referrer`,
        `ip_address`, `city`, `country`, `device_type`, `os_name`, `browser_name`, `gpu_renderer`,
        `cpu_cores`, `ram_gb`, `battery_level`, `network_type`, `screen_resolution`,
        `current_path`, `duration_seconds`, `raw_telemetry_json`
    ) VALUES (
        '{$vid}', '{$sid}', NOW(), NOW(), 1, 1, '{$referrer}',
        '{$ip}', '{$city}', '{$country}', '{$device}', '{$os}', '{$browser}', '{$gpu}',
        {$cpu}, {$ram}, {$battery}, '{$network}', '{$screenRes}',
        '{$path}', 0, '{$rawJson}'
    )");
}

record_pageview($conn, $vid, $sid, $path, $section);

echo json_encode(array(
    'success'     => true,
    'resumed'     => $exists,
    'totalVisits' => total_visits($conn)
), JSON_UNESCAPED_UNICODE);

$conn->close();
