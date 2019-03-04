/**
 * @Author: Jack Woods
 * @Date:   2019-02-13T08:11:58-08:00
 * @Email:  jackrwoods@gmail.com
 * @Filename: script.js
 * @Last modified by:   Jack Woods
 * @Last modified time: 2019-03-04T09:24:00-08:00
 */

var haveSentRequest = false // Set to true when the user requests for SEO results. If true, another request cannot be sent.

function analyze(html) {
  let map = {
      '&amp;': '&',
      '&#038;': "&",
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'",
      '&#8217;': "’",
      '&#8216;': "‘",
      '&#8211;': "–",
      '&#8212;': "—",
      '&#8230;': "…",
      '&#8221;': '”'
  }

  html =  html.replace(/\&[\w\d\#]{2,5}\;/g, (m) => map[m])
  let page = document.createElement("div")
  page.innerHTML = html
  console.log(page)
  // Perform analysis
  // headerTags(page)
  // headings(page)
  // keywords(page)
  // altTags(page)
  // linksWithinDomainName(page)
  // brokenLinks(page)
  // wwwResolve(url)
  // robotsTxt(url)
  // xmlSitemap(url)
  // openGraph(page)
  // viewport(page)
  // favicon(page)
  // speed(url)
  // language(page)
  // googlePreviewSnippet(page)
  // whois(url)
  // socialMediaLikes(url)
}

// Add http:// to domainname by default.
document.getElementById('domainName').value = 'http://'

// Download the target web page and perform analysis
document.getElementById('submit').addEventListener('click', function() {
  let url = encodeURI(document.getElementById('domainName').value)
  // Download the target web page
  // Build the request URL and send it!
  // Execute JSONP request
  let s = document.createElement('script');
  s.src = 'http://jackrwoods.hostingmyself.com/getRequestGenerator.php?url='+url+'&callback=analyze';
  document.head.appendChild(s);
})
