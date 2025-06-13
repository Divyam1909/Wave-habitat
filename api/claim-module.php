<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

// --- Input Validation ---
if (!$data || !isset($data->module_id) || !isset($data->password) || !isset($data->user_id)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Module ID, password, and user ID are required.']);
    exit();
}

$moduleId = trim($data->module_id);
$password = $data->password;
$userId = $data->user_id;

try {
    // 1. Find the module by its ID
    $stmt = $pdo->prepare("SELECT * FROM modules WHERE module_id = ?");
    $stmt->execute([$moduleId]);
    $module = $stmt->fetch();

    if (!$module) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Module with this ID does not exist.']);
        exit();
    }
    
    // 2. Verify the module's password
    if (!password_verify($password, $module['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Incorrect module password.']);
        exit();
    }

    // 3. Check if this module is already claimed by ANY user
    $stmt_check = $pdo->prepare("SELECT user_id FROM user_modules WHERE module_id = ? AND role = 'owner'");
    $stmt_check->execute([$moduleId]);
    if ($stmt_check->fetch()) {
        http_response_code(409); // Conflict
        echo json_encode(['success' => false, 'error' => 'This module has already been claimed by an owner.']);
        exit();
    }

    // 4. Success! Assign the module to the user with the 'owner' role.
    $insert_stmt = $pdo->prepare("INSERT INTO user_modules (user_id, module_id, role) VALUES (?, ?, 'owner')");
    $insert_stmt->execute([$userId, $moduleId]);

    // 5. Fetch the user's new, complete list of modules to send back to the frontend
    $modules_stmt = $pdo->prepare("
        SELECT m.*, um.role 
        FROM user_modules um
        JOIN modules m ON um.module_id = m.module_id
        WHERE um.user_id = ?
    ");
    $modules_stmt->execute([$userId]);
    $userModules = $modules_stmt->fetchAll();
    
    foreach ($userModules as &$mod) {
        $mod['alloted_pins'] = (int)$mod['alloted_pins'];
        $mod['used_pins'] = (int)$mod['used_pins'];
        $mod['pins_left'] = (int)$mod['pins_left'];
        $mod['module_status'] = (int)$mod['module_status'];
    }

    echo json_encode(['success' => true, 'message' => 'Module successfully added!', 'modules' => $userModules]);

} catch (PDOException $e) {
    http_response_code(500);
    error_log("Claim Module Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'A database error occurred.']);
}
?>