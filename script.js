/**
 * @Author: Jack Woods
 * @Date:   2019-02-13T08:11:58-08:00
 * @Email:  jackrwoods@gmail.com
 * @Filename: script.js
 * @Last modified by:   Jack Woods
 * @Last modified time: 2019-03-14T16:01:54-07:00
 */

// Define classes
const NESTED = true
const UNNESTED = false

class TestResult {
  constructor(title, resultType, results) {
    this.title = title
    this.resultType = resultType // Can be NESTED or UNNESTED
    this.results = results
  }

  renderResult(targetDiv) {
    if (this.resultType === UNNESTED) targetDiv.textContent = this.title + ': ' + this.results
    else {
      // Nested results
      targetDiv.textContent = this.title + ':'
      let subResults = document.createElement('ul')
      results.forEach(r => {

      })
    }
  }
}

class Category {
  constructor(title, id, page, tests) {
    this.title = title
    this.id = id
    this.page = page
    this.testResults = []
    tests.forEach(t => {
      test.execute(this.page, this.addResult)
    })
  }

  addResult(result) {
    this.testResults.push(result)
  }

  renderCategory() {
    let cat = document.getElementById(this.id)
    cat.getElementsByClassName('categoryTitle')[0].textContent = this.title
    Array.from(cat.getElementsByClassName('result')).forEach((resElement, index) => {
      try {
        this.testResults[index].renderResult(resElement)
      } catch(err) {
        console.log(err)
        console.log('This error may be caused by not having enough result elements on your page, or by having too many for category:' + this.title + '.')
      }
    })
  }
}


// Helper Functions for Tests
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

// Get everything set up
  // Ensures only one website is tested per page reload
  var alreadyTested = false

  // List of tests and functions
  var tests = {
    headings: (page, callback) => {
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

      callback(new TestResult('Headings Check', UNNESTED, JSON.stringify(result)))

    },
    keywords: (page, callback) => {
      callback(new TestResult('Keywords Check', UNNESTED, JSON.stringify(keywords(page))))
    },
    altTags: (page, callback) => {
      let images = page.getElementsByTagName('img')
      let result = 'Passed!'
      for (i of images) {
        if (i.getAttribute('alt').length === 0) result = 'Didn\'t pass!'
      }
      callback(new TestResult('Alt Tags Check', UNNESTED, JSON.stringify(result)))
    },
    linksWithinDomainName: (page, callback) => {
      let num = 0
      let host = parseURL(document.getElementById('domainName').value).host
      for (link of page.getElementsByTagName('a')) {
        if (parseURL(link.getAttribute('href')).host = host) num++
      }
      callback(new TestResult('Number of Links Within Domain Name', UNNESTED, num))
    },
    openGraph: (page, callback) => {
      callback(new TestResult('OpenGraph Check', UNNESTED, JSON.stringify(grabInfo(page))))
    },
    viewport: (page, callback) => {
      let result = false
      for (el of document.getElementsByTagName('meta')) {
        if (el.getAttribute('name') == 'viewport') result = true
      }
      callback(new TestResult('Has Viewport Tag', UNNESTED, result))
    },
    speed: (page, callback) => {
      let http = new XMLHttpRequest()
      http.onreadystatechange = function() {
        if (this.readystate == 4 && this.status == 200) {
          callback(new TestResult('Speed Test', UNNESTED, http.responseText))
        }
      }
      http.open('GET', 'https://seo.shieldsarts.com/native_api/pagestatus_check?api_key=1-dH1exZv1550098336TKUFrIJ&domain='+encodeURI(document.getElementById('domainName').value))
      http.send()
    },
    whois: (page, callback) => {
      // https://hexillion.com/samples/WhoisXML/?query=google.com&_accept=application%2Fvnd.hexillion.whois-v2%2Bjson
      let http = new XMLHttpRequest()
      http.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
             // Typical action to be performed when the document is ready:
             let response = JSON.parse(http.responseText)
             callback(new TestResult('Whois Information', NESTED,
               [
                 new TestResult('Domain', UNNESTED, response.name),
                 new TestResult('Admin', UNNESTED, response.contacts.admin[0].name),
                 new TestResult('Owner', UNNESTED, response.contacts.admin[0].name),
                 new TestResult('Date Created', UNNESTED, response.created),
                 new TestResult('Date Expires', UNNESTED, response.expires),
                 new TestResult('Nameservers', UNNESTED, JSON.stringify(nameservers)),
                 new TestResult('Registrar', UNNESTED, response.registrar.name)
               ]
             ))
          }
      }
      http.open('GET', 'https://jsonwhoisapi.com/api/v1/whois?identifier='+encodeURI(document.getElementById('domainName').value), true)
      http.setRequestHeader("Authorization", "Basic " + btoa( '913132336:9TKGCGmqgnCpm2YadbdogQ'));
      http.send()
    },
    socialMediaLikes: (page, callback) => {
      let http = new XMLHttpRequest()
      http.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(http.responseText)
            callback(new TestResult('Social Media Shares', NESTED, [
              new TestResult('Facebook Shares', UNNESTED, data.Facebook.share_count),
              new TestResult('Pinterest Pins', UNNESTED, data.Pinterest),
            ]))
          }
      }
      http.open('GET', 'https://api.sharedcount.com/v1.0/?apikey=3c8167d72e397f72a16159a2b22f372be1a2560a&url='+encodeURI(document.getElementById('domainName').value), true)
      http.send()
    },
    schema: (page, callback) => {
      // Use microfilter parser
      let data = Microformats.get({
        html: page.innerHTML
      })
      let results = []
      data.result.items.forEach(i => {
        results.push(new TestResult('Found', UNNESTED, i.type[0]))
      })
      Object.keys(data.rels).forEach(k => {
        results.push(new TestResult('Found '+ k, UNNESTED, data.rels[k][0]))
      })

      callback(new TestResult('Website Schema Check', NESTED, results))
    }
  }

  // This function was taken from stackoverflow. It just encodes url strings into Base64 for use with getRequestGenerator.php
  var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

  // Add http:// to URLInput input by default.
  document.getElementById('URLInput').value = 'http://'

  // Download the target web page and perform analysis
  document.getElementById('testButton').addEventListener('click', function() {
    if(!alreadyTested) {

      let url = encodeURI(document.getElementById('domainName').value)
      // Download the target web page
      // Build the request URL and send it!
      // Execute JSONP request
      let http = new XMLHttpRequest()
      http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          analyze(http.responseText)
        }
      }
      http.open('GET', 'https://dev.shieldsarts.com/seo-report-scripts/getRequestGenerator.php?url=' + Base64.encode(url), true)
      http.send()
    }
  })

function analyze(htmlString) {
  // Parse htmlString into a DOM element
  let page = document.createElement('div')
  page.innerHTML = html

  // List of categories and tests
  // Each category should have 3 variables: a title, a css id corresponding to its results div, and a list of test names that correspond to functions in tests.js
  var categories = {
    general: new Category(
      'General',
      'generalResults',
      page,
      [tests['whois'], tests['headings'], tests['keywords'], tests['altTags'], tests['links'], tests['viewport'], tests['schema']]
    ),
    speed: new Category(
      'Speed Tests',
      'speedResults',
      page,
      [tests['speed']]
    ),
    social: new Category(
      'Social Media',
      'socialResults',
      page,
      [tests['socialMediaLikes'], tests['openGraph']]
    )
  }



}
