<?php
# @Author: Jack Woods
# @Date:   2019-03-27T11:48:20-07:00
# @Email:  jackrwoods@gmail.com
# @Filename: sendEmail.php
# @Last modified by:   Jack Woods
# @Last modified time: 2019-03-28T08:45:54-07:00


# Get email data from POST url encoded body

$to = urldecode($_POST["email"];
$subject = "SEO Report";
$txt = urldecode($_POST["message"]);
$headers = "From: gabriel@shieldsarts.com\r\n";

mail($to,$subject,$txt,$headers);

$to2 = "gabriel@shieldsarts.com";
$subject2 = "New Lead - SEO Report";
$txt2 = urldecode($_POST["message"]);
$headers2 = "From: gabriel@shieldsarts.com\r\n";

mail($to2,$subject2,$txt2,$headers2);
?>
