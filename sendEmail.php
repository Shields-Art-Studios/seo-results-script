<?php
# @Author: Jack Woods
# @Date:   2019-03-27T11:48:20-07:00
# @Email:  jackrwoods@gmail.com
# @Filename: sendEmail.php
# @Last modified by:   Jack Woods
# @Last modified time: 2019-03-27T11:50:05-07:00


# Get email data from POST url encoded body
mail(urldecode($_POST["email"]), "SEO Report", urldecode($_POST["message"]));
?>
