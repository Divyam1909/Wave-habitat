<?php
// Set headers for JSON API and handle Cross-Origin Resource Sharing (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-control-allow-methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Your cPanel database credentials
$host = 'localhost';
$username = 'yugsouzq_Esp32test';
$password = 'AV_B&rK%Vg-7';
$dbname = 'yugsouzq_Mof';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    // Log the actual error to the server log for your eyes only
    error_log("Database Connection Failed: " . $e->getMessage());
    // Send a generic error to the user
    echo json_encode(['success' => false, 'error' => 'Could not connect to the database.']);
    exit();
}
?>