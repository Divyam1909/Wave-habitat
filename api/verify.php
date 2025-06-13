<?php
require 'db.php';

// Get token from the URL's query parameter
$token = $_GET['token'] ?? '';

if (empty($token)) {
    die("<h1>Verification Failed</h1><p>No verification token was provided.</p>");
}

try {
    // Find a user with the matching, non-verified token
    $stmt = $pdo->prepare("SELECT id, is_verified FROM users WHERE verification_token = ? AND is_verified = 0");
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if ($user) {
        // User found, let's verify them!
        $update_stmt = $pdo->prepare("UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?");
        $update_stmt->execute([$user['id']]);
        
        echo "<h1>Verification Successful!</h1><p>Your account is now active. You can close this window and log in to Wave Habitat.</p>";
    } else {
        // No user found with this token, or they are already verified
        echo "<h1>Verification Failed</h1><p>This verification link is invalid, has expired, or the account is already verified.</p>";
    }
} catch (PDOException $e) {
    error_log("Verification PDOException: " . $e->getMessage());
    echo "<h1>Error</h1><p>A database error occurred during verification. Please contact support.</p>";
}
?>