<?php

// Define constants
define("RECIPIENT_NAME", "John Doe");
define("RECIPIENT_EMAIL", "youremail@mail.com");

// Read the form values safely
$userName    = isset($_POST['username']) ? preg_replace("/[^\s\S\.\-\_\@a-zA-Z0-9]/", "", $_POST['username']) : "";
$senderEmail = isset($_POST['email'])    ? preg_replace("/[^\.\-\_\@a-zA-Z0-9]/", "", $_POST['email']) : "";
$message     = isset($_POST['message'])  ? preg_replace("/(From:|To:|BCC:|CC:|Subject:|Content-Type:)/", "", $_POST['message']) : "";
$userSubject = isset($_POST['subject'])  ? strip_tags($_POST['subject']) : "New Contact Form Submission"; // ✅ added

$success = false;

// If all values exist, send the email
if ($userName && $senderEmail && $userSubject && $message) {

    $recipient = RECIPIENT_NAME . " <" . RECIPIENT_EMAIL . ">";

    $subject = $userSubject;

    $headers  = "From: " . $userName . " <" . $senderEmail . ">\r\n";
    $headers .= "Reply-To: " . $senderEmail . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $msgBody  = "Name: " . $userName . "\n";
    $msgBody .= "Email: " . $senderEmail . "\n";
    $msgBody .= "Subject: " . $userSubject . "\n";
    $msgBody .= "Message: " . $message . "\n";

    $success = mail($recipient, $subject, $msgBody, $headers);

    if ($success) {
        header('Location: contact.html?message=Successful');
        exit;
    } else {
        header('Location: contact.html?message=Failed');
        exit;
    }
} else {
    // Missing values
    header('Location: contact.html?message=Failed');
    exit;
}

?>
