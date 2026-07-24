<?php
require_once __DIR__ . '/db.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data || empty($data['companyName']) || empty($data['contactPerson']) || empty($data['phone'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'اطلاعات فرم B2B کامل نیست'], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `b2b_inquiries` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
          `company_name` VARCHAR(255) NOT NULL,
          `contact_person` VARCHAR(255) NOT NULL,
          `phone` VARCHAR(50) NOT NULL,
          `quantity` VARCHAR(100) DEFAULT '',
          `notes` TEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    } catch (\Throwable $t) {}

    $stmt = $pdo->prepare("INSERT INTO b2b_inquiries (company_name, contact_person, phone, quantity, notes) 
                           VALUES (:company_name, :contact_person, :phone, :quantity, :notes)");
    
    $stmt->execute([
        ':company_name' => $data['companyName'],
        ':contact_person' => $data['contactPerson'],
        ':phone' => $data['phone'],
        ':quantity' => $data['quantity'] ?? '',
        ':notes' => $data['notes'] ?? ''
    ]);

    echo json_encode(['success' => true, 'message' => 'درخواست خرید عمده با موفقیت ثبت شد'], JSON_UNESCAPED_UNICODE);
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'خطای سرور: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
