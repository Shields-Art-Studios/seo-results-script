<?php
# @Author: Jack Woods
# @Date:   2019-03-04T07:43:22-08:00
# @Email:  jackrwoods@gmail.com
# @Filename: getRequestGenerator.php
# @Last modified by:   Jack Woods
# @Last modified time: 2019-03-04T09:17:07-08:00

  # Perform a cross-domain GET request
  $location = file_get_contents($_GET['url']);
  # Print the HTML
  print $_GET['callback']."('".str_replace("\n", "", str_replace("'", "\"", htmlspecialchars($location)))."')";
 ?>
