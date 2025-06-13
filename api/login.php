<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email and password are required.']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$data->email]);
    $user = $stmt->fetch();

    if ($user && password_verify($data->password, $user['password'])) {
        // --- EMAIL VERIFICATION CHECK ---
        if ($user['is_verified'] != 1) {
            http_response_code(403); // Forbidden
            echo json_encode(['success' => false, 'error' => 'Please verify your email address before logging in.']);
            exit();
        }

        // --- SUCCESSFUL LOGIN ---
        unset($user['password']); // Never send the password hash to the client
        echo json_encode([
            'success' => true,
            'message' => 'Login successful!',
            'user' => $user
        ]);
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(['success' => false, 'error' => 'Invalid email or password.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    error_log("Login PDOException: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'A database error occurred.']);
}
?>