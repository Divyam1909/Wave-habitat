<?php
require 'db.php';

// Get the user ID from the URL query parameter (e.g., /api/get-modules.php?user_id=42)
$userId = $_GET['user_id'] ?? null;

if (!$userId || !is_numeric($userId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'A valid User ID is required.']);
    exit();
}

try {
    // This SQL query joins the user_modules bridge table with the main modules table
    // to get all the details for modules assigned to the current user.
    $sql = "
        SELECT
            m.module_id,
            m.name,
            m.description,
            m.alloted_pins,
            m.used_pins,
            m.pins_left,
            m.module_status,
            um.role
        FROM user_modules um
        JOIN modules m ON um.module_id = m.module_id
        WHERE um.user_id = ?
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    $modules = $stmt->fetchAll();

    // The frontend expects integers for pin counts, so we ensure they are correctly typed
    foreach ($modules as &$module) {
        $module['alloted_pins'] = (int)$module['alloted_pins'];
        $module['used_pins'] = (int)$module['used_pins'];
        $module['pins_left'] = (int)$module['pins_left'];
        $module['module_status'] = (int)$module['module_status'];
    }

    echo json_encode(['success' => true, 'modules' => $modules]);

} catch (PDOException $e) {
    http_response_code(500);
    error_log("Get Modules Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'A database error occurred while fetching modules.']);
}
?>