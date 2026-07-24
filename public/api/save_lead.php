<?php
require_once __DIR__ . '/db.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data || empty($data['fullName']) || empty($data['phone'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'نام و شماره همراه الزامی است']);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO lead_samples (full_name, phone, organization, position) 
                           VALUES (:full_name, :phone, :organization, :position)");
    
    $stmt->execute([
        ':full_name' => $data['fullName'],
        ':phone' => $data['phone'],
        ':organization' => $data['organization'] ?? '',
        ':position' => $data['position'] ?? ''
    ]);

    echo json_encode(['success' => true]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'خطای سرور: ' . $e->getMessage()]);
}
