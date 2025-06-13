<?php
require 'db.php';

$moduleId = $_GET['module_id'] ?? null;
$userId = $_GET['user_id'] ?? null;

if (!$moduleId || !$userId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Module ID and User ID are required.']);
    exit();
}

try {
    // 1. First, verify this user has access to this module and get their role
    $stmt_access = $pdo->prepare("SELECT role FROM user_modules WHERE user_id = ? AND module_id = ?");
    $stmt_access->execute([$userId, $moduleId]);
    $access = $stmt_access->fetch();

    if (!$access) {
        http_response_code(403); // Forbidden
        echo json_encode(['success' => false, 'error' => 'You do not have access to this module.']);
        exit();
    }

    // 2. Fetch the main module data
    $stmt_module = $pdo->prepare("SELECT * FROM modules WHERE module_id = ?");
    $stmt_module->execute([$moduleId]);
    $module_data = $stmt_module->fetch();
    $module_data['role'] = $access['role']; // Add the current user's role to the data

    // --- In the future, you will fetch pins, groups, etc. here ---
    // For now, we will add empty arrays to prevent the 'map' error
    $module_data['pins'] = [];
    $module_data['groups'] = [];
    $module_data['assignedUsers'] = [];
    $module_data['metrics'] = [];

    // Type casting
    foreach($module_data as $key => $value) {
        if(is_numeric($value) && in_array($key, ['alloted_pins', 'used_pins', 'pins_left', 'module_status'])) {
            $module_data[$key] = (int)$value;
        }
    }

    echo json_encode(['success' => true, 'module' => $module_data]);

} catch (PDOException $e) {
    http_response_code(500);
    error_log("Get Module Details Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'A database error occurred.']);
}
?>