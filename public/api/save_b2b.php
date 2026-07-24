<?php
require_once __DIR__ . '/db.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data || empty($data['companyName']) || empty($data['contactPerson']) || empty($data['phone'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'اطلاعات فرم B2B کامل نیست']);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO b2b_inquiries (company_name, contact_person, phone, quantity, notes) 
                           VALUES (:company_name, :contact_person, :phone, :quantity, :notes)");
    
    $stmt->execute([
        ':company_name' => $data['companyName'],
        ':contact_person' => $data['contactPerson'],
        ':phone' => $data['phone'],
        ':quantity' => $data['quantity'] ?? '',
        ':notes' => $data['notes'] ?? ''
    ]);

    echo json_encode(['success' => true]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'خطای سرور: ' . $e->getMessage()]);
}
