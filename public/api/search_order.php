<?php
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

$host = 'localhost';
$db   = 'oranguta_book';
$user = 'oranguta_Controller';
$pass = 'Y^!{i~0bYS0BI&Fi^R';

$conn = @new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(array(
        'success' => false,
        'message' => 'خطا در اتصال: ' . $conn->connect_error
    ), JSON_UNESCAPED_UNICODE);
    exit();
}

$conn->set_charset("utf8mb4");

function normalizeDigits($str) {
    if (!$str) return '';
    $persian = array('۰','۱','۲','۳','۴','۵','۶','۷','۸','۹');
    $arabic  = array('٠','١','٢','٣','٤','٥','٦','٧','٨','٩');
    $num     = array('0','1','2','3','4','5','6','7','8','9');
    $str = str_replace($persian, $num, $str);
    $str = str_replace($arabic, $num, $str);
    return strtolower(preg_replace('/[\s\-_]/', '', $str));
}

$query = isset($_GET['q']) ? $_GET['q'] : (isset($_GET['code']) ? $_GET['code'] : '');
$query = trim($query);

if (empty($query)) {
    echo json_encode(array('success' => false, 'message' => 'عبارت جستجو وارد نشده است'), JSON_UNESCAPED_UNICODE);
    exit();
}

$normQuery = normalizeDigits($query);

$sql = "SELECT * FROM orders ORDER BY id DESC LIMIT 100";
$result = $conn->query($sql);

$found = null;

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $normCode = normalizeDigits($row['order_code']);
        $custInfo = json_decode(isset($row['customer_info']) ? $row['customer_info'] : '{}', true);
        $custInfoArr = is_array($custInfo) ? $custInfo : array();
        
        $phone = isset($custInfoArr['mobile']) ? $custInfoArr['mobile'] : (isset($custInfoArr['phone']) ? $custInfoArr['phone'] : '');
        $normPhone = normalizeDigits($phone);

        if ($normCode === $normQuery || 
            $normPhone === $normQuery || 
            strpos($normCode, $normQuery) !== false || 
            (strlen($normPhone) > 3 && strpos($normPhone, $normQuery) !== false) ||
            (strlen($normQuery) >= 4 && substr($normCode, -strlen($normQuery)) === $normQuery)) {
            
            $itemsArr = json_decode(isset($row['items']) ? $row['items'] : '[]', true);

            $found = array(
                'orderCode'      => $row['order_code'],
                'date'           => $row['created_at'],
                'createdAt'      => $row['created_at'],
                'finalPrice'     => (float)$row['final_price'],
                'totalPrice'     => (float)$row['final_price'],
                'status'         => $row['status'],
                'paymentMethod'  => $row['payment_method'],
                'trackingNumber' => $row['tracking_number'],
                'customerInfo'   => $custInfoArr,
                'items'          => is_array($itemsArr) ? $itemsArr : array()
            );
            break;
        }
    }
}

if ($found) {
    echo json_encode(array('success' => true, 'order' => $found), JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(array('success' => false, 'message' => 'سفارشی با این مشخصات یافت نشد'), JSON_UNESCAPED_UNICODE);
}
