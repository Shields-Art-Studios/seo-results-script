<?php
# @Author: Jack Woods
# @Date:   2019-03-27T11:48:20-07:00
# @Email:  jackrwoods@gmail.com
# @Filename: sendEmail.php
# @Last modified by:   Jack Woods
# @Last modified time: 2019-04-02T07:12:30-07:00


# Get email data from POST url encoded body

$to = $_POST["email"];
$subject = "SEO Report";
$txt = $_POST["message"];
$headers = array("From: gabriel@benucreative.com",
    "Reply-To: gabriel@benucreative.com",
    "X-Mailer: PHP/" . PHP_VERSION
);
mail($to,$subject,$txt,$headers);

$to2 = "gabriel@benucreative.com";
$subject2 = "New Lead - SEO Report";
$txt2 = $_POST["message2"].$_POST["message"];
$headers2 = array("From: gabriel@benucreative.com",
    "Reply-To: gabriel@benucreative.com",
    "X-Mailer: PHP/" . PHP_VERSION
);

mail($to2,$subject2,$txt2,$headers2);

print_r("Sent! to ".$_POST["email"]);
?>
