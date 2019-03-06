/**
 * @Author: Jack Woods
 * @Date:   2019-02-13T08:11:58-08:00
 * @Email:  jackrwoods@gmail.com
 * @Filename: script.js
 * @Last modified by:   Jack Woods
 * @Last modified time: 2019-03-06T14:41:17-08:00
 */

 // Add microformat parser to page
 let s = document.createElement('script')
 s.src = 'https://shields-art-studios.github.io/seo-results-script/microformat-shiv.min.js'
 document.head.appendChild(s)

 // Add openGraph parser to page
 let s2 = document.createElement('script')
 s2.src = 'https://shields-art-studios.github.io/seo-results-script/opengraph.js'
 document.head.appendChild(s2)

var haveSentRequest = false // Set to true when the user requests for SEO results. If true, another request cannot be sent.

// Parses a url for the hostname
function parseURL(url) {
    parsed_url = {}

    if ( url == null || url.length == 0 )
        return parsed_url

    protocol_i = url.indexOf('://')
    parsed_url.protocol = url.substr(0,protocol_i)

    remaining_url = url.substr(protocol_i + 3, url.length)
    domain_i = remaining_url.indexOf('/')
    domain_i = domain_i == -1 ? remaining_url.length - 1 : domain_i
    parsed_url.domain = remaining_url.substr(0, domain_i)
    parsed_url.path = domain_i == -1 || domain_i + 1 == remaining_url.length ? null : remaining_url.substr(domain_i + 1, remaining_url.length)

    domain_parts = parsed_url.domain.split('.')
    switch ( domain_parts.length ){
        case 2:
          parsed_url.subdomain = null
          parsed_url.host = domain_parts[0]
          parsed_url.tld = domain_parts[1]
          break
        case 3:
          parsed_url.subdomain = domain_parts[0]
          parsed_url.host = domain_parts[1]
          parsed_url.tld = domain_parts[2]
          break
        case 4:
          parsed_url.subdomain = domain_parts[0]
          parsed_url.host = domain_parts[1]
          parsed_url.tld = domain_parts[2] + '.' + domain_parts[3]
          break
    }

    parsed_url.parent_domain = parsed_url.host + '.' + parsed_url.tld

    return parsed_url
}

// Counts word frequency and returns a list
function keywords(html) {
  // Remove script tags and other nonsense
  for (s of html.getElementsByTagName('script')) {
    s.innerHTML = ''
  }
  for (s of html.getElementsByTagName('style')) {
    s.innerHTML = ''
  }
  for (i of html.getElementsByTagName('iframe')) {
    s.innerHTML = ''
  }

  // Start to count words
  let words = html.textContent.split(/\b/).map(w => w.replace(/\W/g, ''))
  let wordCounts = {}

  for (let i = 0; i < words.length; i++) {
      wordCounts[words[i].toLowerCase()] = (wordCounts[words[i].toLowerCase()] || 0) + 1
  }

  // Build an array of word,frequency tuples and sorts by frequency
  let wordsAndCounts = Object.keys(wordCounts).map(key => {
    return {
      'key': key,
      'frequency': wordCounts[key]
    }
  }).sort((a, b) => ((a.frequency < b.frequency) ? 1 : 0))


  // Remove blank string from keyword list
  wordsAndCounts.shift()
  return wordsAndCounts
}

// Formats one results category and renders it
function formatResults(categoryObject) {
  // Render category title
  let html = '<div class="resultsHeader">'
  html += '<p>' + categoryObject.title + '</p>'
  html += '</div>'

  // Render results
  html += '<div class="content is-medium">'
  categoryObject.results.forEach(r => {
    html += '<p>' + r.desc + ': ' + r.res + '</p>'
  })
  html += '</div>'

  return html
}

// Clears the results div
var targetDiv = document.getElementById('resultsDiv')
targetDiv.innerHTML = ''

// Renders the supplied html.
function render(html) { targetDiv.innerHTML += html }

function finishRobotsAnalysis(page) {
  if (page.length > 0) {

  }
}

function analyze(html) {
  let map = {
      '&amp;': '&',
      '&#038;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'",
      '&#8217;': '’',
      '&#8216;': '‘',
      '&#8211;': '–',
      '&#8212;': '—',
      '&#8230;': '…',
      '&#8221;': '”'
  }

  let tests = {
    // headerTags(page)
    headings: (page) => {
      let h1 = page.getElementsByTagName('h1')
      let h2 = page.getElementsByTagName('h2')
      let h3 = page.getElementsByTagName('h3')

      let result = ''

      // If there are headings, this test passes.
      if (h1.length + h2.length + h3.length > 0) {
        result.result = 'Passed! Headings: '
        for (h of h1) {
          result += h.textContent + ','
        }
        for (h of h2) {
          result += h.textContent + ','
        }
        for (h of h3) {
          result += h.textContent + ','
        }
      } else {
        result.result = 'Didn\'t pass.'
      }

      return {
        title: 'Headings Check',
        result: result
      }
    },
    keywords: (page) => {
      return {
        title: 'Keywords Check',
        result: keywords(page)
      }
    },
    altTags: (page) => {
      let images = page.getElementsByTagName('img')
      let result = 'Passed!'
      for (i of images) {
        if (i.getAttribute('alt').length === 0) result = 'Didn\'t pass!'
      }
      return {
        title: 'Alt Tags Check',
        result: result
      }
    },
    linksWithinDomainName: (page) => {
      let num = 0
      let host = parseURL(document.getElementById('domainName').value).host
      for (link of page.getElementsByTagName('a')) {
        if (parseURL(link.getAttribute('href')).host = host) num++
      }
      return {
        title: 'Number of Links Within Domain Name',
        result: num
      }
    },
    xmlSitemap: (page) => {
      return {
        title: 'Sitemap Check',
        result: 'Untested'
      }
    },
    openGraph: (page) => {
      return {
        title: 'OpenGraph Check',
        result: grabInfo(page) // in opengraph.js
      }
    },
    viewport: (page) => {
      let result = false
      for (el of document.getElementsByTagName('meta')) {
        if (el.getAttribute('name') == 'viewport') result = true
      }
      return {
        title: 'Has Viewport Tag',
        result: result
      }
    },
    favicon: (page) => {
      return {
        title: 'Has Favicon',
        result: 'Untested' // Low priority
      }
    },
    speed: (page) => {
      let http = new XMLHttpRequest()
      http.onreadystatechange = function() {
        if (this.readystate == 4 && this.status == 200) {
          return {
            title: 'Speed Test',
            result: JSON.parse(http.responseText)
          }
        }
      }
      http.open('GET', 'https://seo.shieldsarts.com/native_api/pagestatus_check?api_key=1-dH1exZv1550098336TKUFrIJ&domain='+encodeURI(document.getElementById('domainName').value))
      http.send()
    },
    googlePreviewSnippet: (page) => {

    },
    whois: (page) => {
      // https://hexillion.com/samples/WhoisXML/?query=google.com&_accept=application%2Fvnd.hexillion.whois-v2%2Bjson
      let http = new XMLHttpRequest()
      http.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
             // Typical action to be performed when the document is ready:
             return {
               title: 'Whois Information',
               result: http.responseText
             }
          }
      };
      http.open('GET', 'https://hexillion.com/samples/WhoisXML/?query='+encodeURI(document.getElementById('domainName').value)+'&_accept=application%2Fvnd.hexillion.whois-v2%2Bjson', true)
      http.send()
    },
    socialMediaLikes: (page) => {
      let http = new XMLHttpRequest()
      http.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(http.responseText)
            return {
              title: 'Social Media Shares',
              result: {
                facebook: data.Facebook.share_count,
                pinterest: data.Pinterest
              }
            }
          }
      }
      http.open('GET', 'https://api.sharedcount.com/v1.0/?apikey=3c8167d72e397f72a16159a2b22f372be1a2560a&url='+encodeURI(document.getElementById('domainName').value), true)
      http.send()
    },
    schema: (page) => {
      // Use microfilter parser
      let options = {
        html: page.innerHTML
      }
      return {
        title: 'Website Schema Check',
        result: Microformats.get(options) // in microformat-shiv.min.js
      }
    },
    funTest: (page) => {
      return {
        title: 'Fun Test',
        result: 'Looks pretty fun.'
      }
    }
  }

  html = html.replace(/\&[\w\d\#]{2,5}\;/g, (m) => map[m])
  let page = document.createElement('div')
  page.innerHTML = html
  console.log(page)

  // Perform analysis and render each result
  Object.keys(tests).forEach(k => {
    console.log(tests[k](page).result)
  })
}

// Add http:// to domainname by default.
document.getElementById('domainName').value = 'http://'

// Download the target web page and perform analysis
document.getElementById('submit').addEventListener('click', function() {
  let url = encodeURI(document.getElementById('domainName').value)
  // Download the target web page
  // Build the request URL and send it!
  // Execute JSONP request
  let s = document.createElement('script')
  s.src = 'https://jackrwoods.hostingmyself.com/getRequestGenerator.php?url='+url+'&callback=analyze'
  document.head.appendChild(s)
})
