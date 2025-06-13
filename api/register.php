<?php
// Use PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Require the PHPMailer files you uploaded
require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

// Include your database connection
require 'db.php';

// Get the JSON data sent from the Next.js form
$data = json_decode(file_get_contents("php://input"));

// --- Full Server-side Validation ---
if (!$data || !isset($data->name, $data->email, $data->password, $data->phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid input. All fields are required.']);
    exit();
}
// ... Add other validation for email, password length etc. if needed ...

$name = trim($data->name);
$email = trim($data->email);
$password = trim($data->password);
$phone = trim($data->phone);

try {
    // Check if user already exists
    $stmt_check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt_check->execute([$email]);
    if ($stmt_check->fetch()) {
        http_response_code(409);
        echo json_encode(['success' => false, 'error' => 'A user with this email already exists.']);
        exit();
    }
    
    // --- Generate Unique Username ---
    $base_username = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $name));
    if (empty($base_username)) $base_username = 'user';
    $username = ''; $is_unique = false;
    for ($i = 0; $i < 10; $i++) {
        $username_to_check = $base_username . rand(1000, 9999);
        $stmt_user = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt_user->execute([$username_to_check]);
        if (!$stmt_user->fetch()) {
            $username = $username_to_check;
            $is_unique = true;
            break;
        }
    }
    if (!$is_unique) { http_response_code(500); echo json_encode(['success' => false, 'error' => 'Could not generate a unique username.']); exit(); }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $token = bin2hex(random_bytes(50));
    
    $sql = "INSERT INTO users (name, email, phone, username, password, verification_token, is_verified) VALUES (?, ?, ?, ?, ?, ?, 0)";
    $stmt_insert = $pdo->prepare($sql);
    $stmt_insert->execute([$name, $email, $phone, $username, $hashedPassword, $token]);

    // --- Send Email with PHPMailer ---
    $mail = new PHPMailer(true);
    try {
        // Server settings for your cPanel email account
        $mail->isSMTP();
        $mail->Host       = 'mail.armsrobotics.com'; // Usually mail.yourdomain.com
        $mail->SMTPAuth   = true;
        $mail->Username   = 'no-reply@armsrobotics.com'; // The email account you created
        $mail->Password   = 'YOUR_EMAIL_PASSWORD'; // The password for that email account
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465; // Use 465 for SSL

        // Recipients
        $mail->setFrom('no-reply@armsrobotics.com', 'Wave Habitat');
        $mail->addAddress($email, $name);

        // Content
        $verification_link = "https://armsrobotics.com/wave/api/verify.php?token=" . $token;
        $mail->isHTML(true);
        $mail->Subject = 'Verify Your Email for Wave Habitat';
        $mail->Body    = "<h1>Welcome to Wave Habitat!</h1><p>Please click the link below to verify your email address and activate your account:</p><p><a href='" . $verification_link . "' style='display:inline-block; padding: 12px 20px; background-color: #00aeef; color: white; text-decoration: none; border-radius: 5px;'>Verify My Email Address</a></p>";
        $mail->AltBody = 'To verify your account, please copy and paste this link into your browser: ' . $verification_link;

        $mail->send();
        echo json_encode(['success' => true, 'message' => 'Registration successful! Please check your email to verify your account.']);
    
    } catch (Exception $e) {
        error_log("Mailer Error: " . $mail->ErrorInfo);
        echo json_encode(['success' => true, 'message' => 'Registration successful, but the verification email could not be sent. Please contact support.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    error_log("Registration PDOException: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'A database error occurred.']);
}
?>