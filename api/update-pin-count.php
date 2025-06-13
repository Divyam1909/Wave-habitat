<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

// Validation
if (!$data || !isset($data->module_id) || !isset($data->pin_count) || !isset($data->user_id)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Module ID, pin count, and user ID are required.']);
    exit();
}

$moduleId = $data->module_id;
$pinCount = (int)$data->pin_count;
$userId = $data->user_id;

try {
    // Security Check: Verify the user is the owner of this module
    $stmt_owner = $pdo->prepare("SELECT * FROM user_modules WHERE user_id = ? AND module_id = ? AND role = 'owner'");
    $stmt_owner->execute([$userId, $moduleId]);
    if (!$stmt_owner->fetch()) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'You do not have owner permission to modify this module.']);
        exit();
    }

    // Update the alloted_pins in the modules table
    $stmt_update = $pdo->prepare("UPDATE modules SET alloted_pins = ? WHERE module_id = ?");
    $stmt_update->execute([$pinCount, $moduleId]);

    // TODO: In a real system, you might need to add/remove pin records from a 'pins' table here.
    // For now, we just update the count.

    echo json_encode(['success' => true, 'message' => 'Pin count updated successfully.']);

} catch (PDOException $e) {
    http_response_code(500);
    error_log("Update Pin Count Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'A database error occurred.']);
}
?>