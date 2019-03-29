<?php
# @Author: Jack Woods
# @Date:   2019-03-04T07:43:22-08:00
# @Email:  jackrwoods@gmail.com
# @Filename: getRequestGenerator.php
# @Last modified by:   Jack Woods
# @Last modified time: 2019-03-29T08:49:57-07:00
# Just returns the HTTP status for a GET request to a url.

# Perform a cross-domain GET request
function get_web_page( $url ) {
    $res = array();
    $options = array(
        CURLOPT_RETURNTRANSFER => true,     // return web page
        CURLOPT_HEADER         => false,    // do not return headers
        CURLOPT_FOLLOWLOCATION => true,     // follow redirects
        CURLOPT_USERAGENT      => "spider", // who am i
        CURLOPT_AUTOREFERER    => true,     // set referer on redirect
        CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
        CURLOPT_TIMEOUT        => 120,      // timeout on response
        CURLOPT_MAXREDIRS      => 10,       // stop after 10 redirects
    );
    $ch      = curl_init( $url );
    curl_setopt_array( $ch, $options );
    $content = curl_exec( $ch );
    $err     = curl_errno( $ch );
    $errmsg  = curl_error( $ch );
    $header  = curl_getinfo( $ch );
    curl_close( $ch );

    # Only return HTTP status code.
    return $header['http_code'];
}
print_r(get_web_page(base64_decode($_GET['url'])));
?>
