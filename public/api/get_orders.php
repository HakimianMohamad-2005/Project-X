<?php
require_once __DIR__ . '/db.php';

$sql = "SELECT * FROM `orders` ORDER BY `id` DESC LIMIT 50";
$result = $conn->query($sql);

$orders = array();

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $custInfo = json_decode($row['customer_info'] ?? '{}', true);
        $itemsArr = json_decode($row['items'] ?? '[]', true);

        $orders[] = array(
            'orderCode'      => $row['order_code'],
            'date'           => $row['created_at'],
            'createdAt'      => $row['created_at'],
            'finalPrice'     => (float)$row['final_price'],
            'totalPrice'     => (float)$row['final_price'],
            'status'         => $row['status'],
            'paymentMethod'  => $row['payment_method'],
            'trackingNumber' => $row['tracking_number'],
            'customerInfo'   => $custInfo ? $custInfo : new stdClass(),
            'items'          => $itemsArr ? $itemsArr : array()
        );
    }
}

echo json_encode(array('success' => true, 'orders' => $orders), JSON_UNESCAPED_UNICODE);