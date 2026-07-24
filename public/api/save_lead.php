<?php
require_once __DIR__ . '/db.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data || empty($data['fullName']) || empty($data['phone'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'نام و شماره همراه الزامی است'], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `lead_samples` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
          `full_name` VARCHAR(255) NOT NULL,
          `phone` VARCHAR(50) NOT NULL,
          `organization` VARCHAR(255) DEFAULT '',
          `position` VARCHAR(255) DEFAULT ''
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    } catch (\Throwable $t) {}

    $stmt = $pdo->prepare("INSERT INTO lead_samples (full_name, phone, organization, position) 
                           VALUES (:full_name, :phone, :organization, :position)");
    
    $stmt->execute([
        ':full_name' => $data['fullName'],
        ':phone' => $data['phone'],
        ':organization' => $data['organization'] ?? '',
        ':position' => $data['position'] ?? ''
    ]);

    echo json_encode(['success' => true, 'message' => 'اطلاعات در دیتابیس ثبت شد'], JSON_UNESCAPED_UNICODE);
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'خطای سرور: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
