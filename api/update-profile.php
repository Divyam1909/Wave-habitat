<?php
require 'db.php';

// Get the JSON data sent from the Next.js form
$data = json_decode(file_get_contents("php://input"));

// --- Input Validation ---
if (!$data || !isset($data->id, $data->name, $data->phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid input. User ID, name, and phone are required.']);
    exit();
}

$userId = $data->id;
$name = trim($data->name);
$phone = trim($data->phone);
$newPassword = $data->newPassword ?? ''; // The password field is optional

try {
    // Check if the user exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'User not found.']);
        exit();
    }

    // --- Build the SQL UPDATE Query ---
    // We start with the basic fields
    $sql_parts = ["name = ?", "phone = ?"];
    $params = [$name, $phone];

    // Only add the password to the update query if a new one was provided
    if (!empty($newPassword)) {
        if (strlen($newPassword) < 8) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'New password must be at least 8 characters.']);
            exit();
        }
        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
        $sql_parts[] = "password = ?";
        $params[] = $hashedPassword;
    }

    // Combine the parts into the final query
    $sql = "UPDATE users SET " . implode(", ", $sql_parts) . " WHERE id = ?";
    $params[] = $userId;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    // --- Fetch the updated user data to send back ---
    $stmt = $pdo->prepare("SELECT id, name, email, phone, username FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $updatedUser = $stmt->fetch();

    echo json_encode(['success' => true, 'message' => 'Profile updated successfully!', 'user' => $updatedUser]);

} catch (PDOException $e) {
    http_response_code(500);
    error_log("Update Profile Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'A database error occurred.']);
}
?>