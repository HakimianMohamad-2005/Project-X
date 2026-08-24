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
        'message' => 'خطا در اتصال به دیتابیس: ' . $conn->connect_error,
        'experiences' => array()
    ), JSON_UNESCAPED_UNICODE);
    exit();
}

$conn->set_charset("utf8mb4");

// Auto-create table if not exists
$tableSql = "CREATE TABLE IF NOT EXISTS user_experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(191) NOT NULL,
    role VARCHAR(191) DEFAULT NULL,
    company VARCHAR(191) NOT NULL,
    industry VARCHAR(191) DEFAULT NULL,
    category VARCHAR(50) DEFAULT 'manufacturing',
    phone_email VARCHAR(191) DEFAULT NULL,
    rating INT DEFAULT 5,
    volume_read VARCHAR(50) DEFAULT 'bundle',
    achievement_badge VARCHAR(255) NOT NULL,
    key_metric VARCHAR(255) DEFAULT NULL,
    review_text TEXT NOT NULL,
    verified TINYINT(1) DEFAULT 1,
    status VARCHAR(50) DEFAULT 'approved',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

@$conn->query($tableSql);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT * FROM user_experiences WHERE status = 'approved' ORDER BY id DESC LIMIT 100";
    $result = $conn->query($sql);

    $experiences = array();

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $createdTime = strtotime($row['created_at']);
            $formattedDate = $createdTime ? date('Y/m/d', $createdTime) : date('Y/m/d');

            $experiences[] = array(
                'id'               => 'exp-db-' . $row['id'],
                'fullName'         => $row['full_name'],
                'role'             => !empty($row['role']) ? $row['role'] : 'مدیر و فعال صنعتی',
                'company'          => $row['company'],
                'industry'         => !empty($row['industry']) ? $row['industry'] : $row['company'],
                'category'         => !empty($row['category']) ? $row['category'] : 'manufacturing',
                'phoneOrEmail'     => isset($row['phone_email']) ? $row['phone_email'] : '',
                'rating'           => isset($row['rating']) ? (int)$row['rating'] : 5,
                'volumeRead'       => !empty($row['volume_read']) ? $row['volume_read'] : 'bundle',
                'achievementBadge' => $row['achievement_badge'],
                'keyMetric'        => !empty($row['key_metric']) ? $row['key_metric'] : $row['achievement_badge'],
                'feedback'         => $row['review_text'],
                'verified'         => isset($row['verified']) ? ((int)$row['verified'] === 1) : true,
                'date'             => $formattedDate
            );
        }
    }

    echo json_encode(array(
        'success'     => true,
        'count'       => count($experiences),
        'experiences' => $experiences
    ), JSON_UNESCAPED_UNICODE);
    exit();
}

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    if (!$data || !is_array($data)) {
        $data = $_POST;
    }

    // Map fields flexibly supporting snake_case and camelCase
    $fullName = '';
    if (isset($data['full_name'])) {
        $fullName = trim((string)$data['full_name']);
    } elseif (isset($data['fullName'])) {
        $fullName = trim((string)$data['fullName']);
    }

    $company = '';
    if (isset($data['position_company'])) {
        $company = trim((string)$data['position_company']);
    } elseif (isset($data['company'])) {
        $company = trim((string)$data['company']);
    }

    $role = isset($data['role']) ? trim((string)$data['role']) : '';
    $industry = isset($data['industry']) ? trim((string)$data['industry']) : '';
    $category = isset($data['category']) ? trim((string)$data['category']) : 'manufacturing';

    $phoneEmail = '';
    if (isset($data['phone_email'])) {
        $phoneEmail = trim((string)$data['phone_email']);
    } elseif (isset($data['phoneOrEmail'])) {
        $phoneEmail = trim((string)$data['phoneOrEmail']);
    }

    $rating = isset($data['rating']) ? (int)$data['rating'] : 5;
    if ($rating < 1 || $rating > 5) {
        $rating = 5;
    }

    $volumeRead = 'bundle';
    if (isset($data['book_volume'])) {
        $volumeRead = trim((string)$data['book_volume']);
    } elseif (isset($data['volumeRead'])) {
        $volumeRead = trim((string)$data['volumeRead']);
    }

    $achievementBadge = '';
    if (isset($data['key_achievement'])) {
        $achievementBadge = trim((string)$data['key_achievement']);
    } elseif (isset($data['achievementBadge'])) {
        $achievementBadge = trim((string)$data['achievementBadge']);
    }

    $keyMetric = isset($data['keyMetric']) ? trim((string)$data['keyMetric']) : $achievementBadge;

    $reviewText = '';
    if (isset($data['review_text'])) {
        $reviewText = trim((string)$data['review_text']);
    } elseif (isset($data['feedback'])) {
        $reviewText = trim((string)$data['feedback']);
    }

    if (empty($fullName) || empty($company) || empty($reviewText) || empty($achievementBadge)) {
        echo json_encode(array(
            'success' => false,
            'message' => 'لطفاً تمامی فیلدهای الزامی (نام، سازمان، دستاورد کلیدی و متن تجربه) را تکمیل کنید.'
        ), JSON_UNESCAPED_UNICODE);
        exit();
    }

    // Escape strings for secure SQL injection prevention
    $fullNameSafe         = $conn->real_escape_string($fullName);
    $roleSafe             = $conn->real_escape_string($role);
    $companySafe          = $conn->real_escape_string($company);
    $industrySafe         = $conn->real_escape_string($industry);
    $categorySafe         = $conn->real_escape_string($category);
    $phoneEmailSafe       = $conn->real_escape_string($phoneEmail);
    $volumeReadSafe       = $conn->real_escape_string($volumeRead);
    $achievementBadgeSafe = $conn->real_escape_string($achievementBadge);
    $keyMetricSafe        = $conn->real_escape_string($keyMetric);
    $reviewTextSafe       = $conn->real_escape_string($reviewText);

    $sql = "INSERT INTO user_experiences 
        (full_name, role, company, industry, category, phone_email, rating, volume_read, achievement_badge, key_metric, review_text, verified, status, created_at)
        VALUES 
        ('".$fullNameSafe."', '".$roleSafe."', '".$companySafe."', '".$industrySafe."', '".$categorySafe."', '".$phoneEmailSafe."', ".$rating.", '".$volumeReadSafe."', '".$achievementBadgeSafe."', '".$keyMetricSafe."', '".$reviewTextSafe."', 1, 'approved', NOW())";

    if ($conn->query($sql) === TRUE) {
        $insertedId = $conn->insert_id;
        echo json_encode(array(
            'success' => true,
            'id'      => 'exp-db-' . $insertedId,
            'message' => 'تجربه شما با موفقیت در سیستم ثبت و تایید گردید.'
        ), JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(array(
            'success' => false,
            'message' => 'خطا در ثبت دیتابیس: ' . $conn->error
        ), JSON_UNESCAPED_UNICODE);
    }
    exit();
}

// Fallback for unsupported methods
http_response_code(405);
echo json_encode(array(
    'success' => false,
    'message' => 'متد ارسالی پشتیبانی نمی‌شود.'
), JSON_UNESCAPED_UNICODE);
