<?php
# @Author: Jack Woods
# @Date:   2019-03-27T11:48:20-07:00
# @Email:  jackrwoods@gmail.com
# @Filename: sendEmail.php
# @Last modified by:   Jack Woods
# @Last modified time: 2019-03-28T08:45:54-07:00


# Get email data from POST url encoded body

$to = $_POST["email"];
$subject = "SEO Report";
$txt = $_POST["message"];
$headers = "From: gabriel@shieldsarts.com\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
mail($to,$subject,$txt,$headers);

$to2 = "gabriel@shieldsarts.com";
$subject2 = "New Lead - SEO Report";
$txt2 = $_POST["message2"].$_POST["message"];
$headers2 = "From: gabriel@shieldsarts.com\r\n";
$headers2 .= "MIME-Version: 1.0\r\n";
$headers2 .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

mail($to2,$subject2,$txt2,$headers2);

print_r("Sent!");
?>
