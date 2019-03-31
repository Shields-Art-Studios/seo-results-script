/**
 * @Author: Jack Woods
 * @Date:   2019-02-13T08:11:58-08:00
 * @Email:  jackrwoods@gmail.com
 * @Filename: script.js
 * @Last modified by:   Jack Woods
 * @Last modified time: 2019-03-30T20:37:28-07:00
 */

// Add microformat parser to page
let s = document.createElement('script')
s.src = 'https://shields-art-studios.github.io/seo-results-script/microformat-shiv.min.js'
document.head.appendChild(s)

// Add openGraph parser to page
let s2 = document.createElement('script')
s2.src = 'https://shields-art-studios.github.io/seo-results-script/opengraph.js'
document.head.appendChild(s2)

// Hide results row
document.getElementById('resultsDiv').style.display = 'none'

// Helper Funtions for setting/getting cookies
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
 var d = new Date();
 d.setTime(d.getTime() + (exdays*24*60*60*1000));
 var expires = "expires="+ d.toUTCString();
 document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Define classes
const NESTED = true
const UNNESTED = false
var categoriesDone = 0 // Is incremented whenever a category is done rendering.

class TestResult {
  constructor(title, resultType, results) {
    this.title = title
    this.resultType = resultType // Can be NESTED or UNNESTED
    this.results = results
  }

  renderResult(targetDiv) {
    if (this.resultType === UNNESTED) targetDiv.innerHTML = this.title + ': ' + this.results
    else {
      // Nested results
      targetDiv.innerHTML = this.title + ':'
      let subResults = document.createElement('ul')
      this.results.forEach(r => {
        let res = document.createElement('li')
        r.renderResult(res)
        subResults.appendChild(res)
      })
      targetDiv.appendChild(subResults)
    }
  }
}

class Category {
  constructor(title, id, page, tests) {
    this.title = title
    this.id = id
    this.page = page
    this.testResults = []
    this.resultsNeeded = tests.length
    tests.forEach(t => {
      t(this.page, this)
    })
  }

  addResult(result) {
    this.testResults.push(result)
  }

  renderCategory() {
    if (this.testResults.length < this.resultsNeeded) {
      // Wait 500ms for requests/tests to finish
      console.log('waiting...' + this.testResults.length + ',' + this.resultsNeeded)
      setTimeout(this.renderCategory.bind(this), 1000)
    } else {
      let cat = document.getElementById(this.id) // Find the category on the page by searching for the category's CSS ID
      cat.innerHTML = '' // Clear category
      // let catTitle = document.createElement('span')
      // catTitle.classList.add('categoryTitle')
      // catTitle.textContent = this.title
      // cat.appendChild(catTitle)
      let resList = document.createElement('ul')
      cat.appendChild(resList)
      this.testResults.forEach(res => {
        let resElement = document.createElement('li')
        resElement.classList.add('result')
        res.renderResult(resElement)
        resList.appendChild(resElement)
      })
      categoriesDone++ // Increment global variable
    }
  }
}


// Helper Functions for Tests
// Retrieves domain name from sring
function getDomain(url, subdomain) {
    subdomain = subdomain || false

    url = url.replace(/(https?:\/\/)?(www.)?/i, '')

    if (!subdomain) {
        url = url.split('.')

        url = url.slice(url.length - 2).join('.')
    }

    if (url.indexOf('/') !== -1) {
        return url.split('/')[0]
    }

    return url
}

// Counts word frequency and returns a list
function keywords(sharedhtml) {
  // Remove scripts and other nonsense without editing the shared dom element
  let html = document.createElement('div')
  html.innerHTML = sharedhtml.outerHTML
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
  })
  return wordsAndCounts
}

// Get everything set up

  // List of tests and functions
  var tests = {
    headings: (page, callbackObj) => {
      let h1 = page.getElementsByTagName('h1')
      let h2 = page.getElementsByTagName('h2')
      let h3 = page.getElementsByTagName('h3')

      let result = ''

      // If there are headings, this test passes.
      let results = []
      if (h1.length + h2.length + h3.length > 0) {
        result.result = 'Headings: '
        for (h of h1) {
          results.push(new TestResult('H1', UNNESTED, h.textContent))
        }
        for (h of h2) {
          results.push(new TestResult('H2', UNNESTED, h.textContent))
        }
        for (h of h3) {
          results.push(new TestResult('H3', UNNESTED, h.textContent))
        }
      } else {
        result.result = 'Didn\'t pass.'
      }
      callbackObj.addResult(new TestResult('Headings Check', NESTED, results))

    },
    keywords: (page, callbackObj) => {
      // TODO: Filter common words, Google Snippet Generator
      let keywordList = keywords(page)

      // Keyword filter. Keywords are not case sensitive.
      let badKeywords = [
        'the',
        'a',
        'it'
      ]
      badKeywords = badKeywords.map(s => s.toLowerCase()) // Convert all keywords to lower case.

      let results = []

      // Add results that don't match keywords
      keywordList.forEach(k => {
        if (badKeywords.indexOf(k.key.toLowerCase()) === -1 && isNaN(k.key) && k.key.length > 2) {
          results.push(new TestResult(k.key, UNNESTED, k.frequency))
        }
      })
      results = results.sort((a, b) => ((a.title < b.title) ? 1 : 0)).slice(1, 11)

      callbackObj.addResult(new TestResult('Keywords Check', NESTED, results))
    },
    altTags: (page, callbackObj) => {
      // Show images that don't have alt tags.
      // images with alt tags (total)
      // images without alt tags (total)
      let images = page.getElementsByTagName('img')
      let results = []
      for (i of images) {
        try {
          if (i.getAttribute('alt').length === 0 && !i.getAttribute('src').includes('data:image/')) results.push(new TestResult('Failed Image', UNNESTED, i.getAttribute('src')))
        } catch (e) {
          console.log(e)
        }
      }
      if (results.length === 0) {
        callbackObj.addResult(new TestResult('Alt Tags Check', UNNESTED, 'Passed!'))
      } else {
        callbackObj.addResult(new TestResult('Alt Tags Check', NESTED, results))
      }
    },
    linksWithinDomainName: (page, callbackObj) => {
      let num = 0
      for (link of page.getElementsByTagName('a')) {
        if (link.getAttribute('href') !== null && link.getAttribute('href').includes(document.getElementById('URLInput'))) num++
      }
      callbackObj.addResult(new TestResult('Number of Links Within Domain Name', UNNESTED, num))
    },
    openGraph: (page, callbackObj) => {
      let results = []
      let openGraphData = grabInfo(page)
      Object.keys(openGraphData).forEach(k => {
        // Render OpenGraph image with description
        if (openGraphData[k].image !== undefined) {
          results.push(new TestResult(k, UNNESTED, openGraphData[k].title + '<br /><img src="' + openGraphData[k].image + '"></img><br />' + openGraphData[k].description))
        } else if (k == 'favicon') {
          results.push(new TestResult(k, UNNESTED, '<img src="' + openGraphData[k] + '"></img>'))
        } else {
          results.push(new TestResult(k, UNNESTED, openGraphData[k].title + '<br />' + openGraphData[k].description))
        }
      })
      callbackObj.addResult(new TestResult('OpenGraph Check', NESTED, results))
    },
    viewport: (page, callbackObj) => {
      let result = false
      for (el of document.getElementsByTagName('meta')) {
        if (el.getAttribute('name') == 'viewport') result = true
      }
      callbackObj.addResult(new TestResult('Has Viewport Tag', UNNESTED, result))
    },
    mobileFriendliness: (page, callbackObj) => {
      let result = 'No'
      for (el of document.getElementsByTagName('meta')) {
        if (el.getAttribute('name') == 'viewport') result = 'Yes'
      }
      callbackObj.addResult(new TestResult('Is Mobile Friendly', UNNESTED, result))
    },
    speed: (page, callbackObj) => {
      let http = new XMLHttpRequest()
      http.onreadystatechange = function() {
        if (http.readyState === 4 && this.status === 200) {
          let results = JSON.parse(http.responseText)
          callbackObj.addResult(new TestResult('Speed Test', NESTED, [
            new TestResult('HTTP Code', UNNESTED, results.http_code),
            new TestResult('Total Time', UNNESTED, results.total_time.toFixed(3) + ' Seconds'),
            new TestResult('Domain Name Lookup', UNNESTED, results.namelookup_time.toFixed(3) + ' Seconds'),
            new TestResult('Download Speed', UNNESTED, results.speed_download / 100 + ' Kb/s')
          ]))
        }
      }
      http.open('GET', 'https://shieldsarts.com/seo-system/native_api/pagestatus_check?api_key=1-dH1exZv1550098336TKUFrIJ&domain='+encodeURI(document.getElementById('URLInput').value))
      http.send()
    },
    whois: (page, callbackObj) => {
      // https://hexillion.com/samples/WhoisXML/?query=google.com&_accept=application%2Fvnd.hexillion.whois-v2%2Bjson
      let http = new XMLHttpRequest()
      http.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
             // Typical action to be performed when the document is ready:
             let response = JSON.parse(http.responseText)
             callbackObj.addResult(new TestResult('Whois Information', NESTED,
               [
                 new TestResult('Domain', UNNESTED, response.name),
                 new TestResult('Admin', UNNESTED, response.contacts.admin[0].name),
                 new TestResult('Owner', UNNESTED, response.contacts.admin[0].name),
                 new TestResult('Date Created', UNNESTED, response.created),
                 new TestResult('Date Expires', UNNESTED, response.expires),
                 new TestResult('Nameservers', UNNESTED, JSON.stringify(response.nameservers)),
                 new TestResult('Registrar', UNNESTED, response.registrar.name)
               ]
             ))
          }
      }
      http.open('GET', 'https://jsonwhoisapi.com/api/v1/whois?identifier='+encodeURI(document.getElementById('URLInput').value), true)
      http.setRequestHeader("Authorization", "Basic " + btoa( '913132336:9TKGCGmqgnCpm2YadbdogQ'));
      http.send()
    },
    socialMediaLikes: (page, callbackObj) => {
      let http = new XMLHttpRequest()
      http.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(http.responseText)
            callbackObj.addResult(new TestResult('Social Media Shares', NESTED, [
              new TestResult('Facebook Shares', UNNESTED, data.Facebook.share_count),
              new TestResult('Pinterest Pins', UNNESTED, data.Pinterest),
            ]))
          }
      }

      http.open('GET', 'https://api.sharedcount.com/v1.0/?apikey=3c8167d72e397f72a16159a2b22f372be1a2560a&url='+encodeURI('http://' + getDomain(document.getElementById('URLInput').value), true))
      http.send()
    },
    schema: (page, callbackObj) => {
      // Grab all script elements with attribute "type" = "application/ld+json"
      console.log(page.innerHTML)
      let scripts = [] // Will hold JSON data from script objects
      Array.prototype.slice.call(page.getElementsByTagName('script')).forEach(s => {
        try {
          if (s.getAttribute('type') == 'application/ld+json') {
            console.log(s.innerHTML)
            scripts.push(JSON.parse(s.innerHTML))
          }
        } catch(e) {
          console.log(e)
        }
      })

      // Pretty print schema data for the user.
      let results = []
      scripts.forEach(s => {
        let subResults = [] // Holds result objects corresponding to json objects held within this script's top-level json-ld object, and normal result objects
        Object.keys(s).forEach(k => { // Iterate over keys and save data
          if (typeof(s[k]) === 'Object') {
            let subSubResults = []
            // Add data within a sub result to an array of results.
            Object.keys(s[k]).forEach(k2 => {
              subSubResults.push(new TestResult(k2, UNNESTED, s[k2]))
            })
            // Add the results to a nested Result object, and add that object to the higher-level array of results.
            subResults.push(new TestResult(k, NESTED, subSubResults))
          } else {
            subResults.push(new TestResult(k, UNNESTED, s[k]))
          }
        })
        results.push(new TestResult(s['@type'], NESTED, subResults))
      })
      callbackObj.addResult(new TestResult('Website Schema Check', NESTED, results))
    },
    microData: (page, callbackObj) => {
      // Use microfilter parser
      let data = Microformats.get({
        html: page.innerHTML
      })
      let results = []
      data.items.forEach(i => {
        results.push(new TestResult('Found', UNNESTED, i.type[0]))
      })
      Object.keys(data.rels).forEach(k => {
        results.push(new TestResult('Found '+ k, UNNESTED, data.rels[k][0]))
      })

      callbackObj.addResult(new TestResult('Website Microdata Check', NESTED, results))
    },
    siteMaps: (page, callbackObj) => {
      url = encodeURI('http://' + getDomain(document.getElementById('URLInput').value) + '/sitemaps.xml')
      let http = new XMLHttpRequest()
      http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
          if (http.responseText.includes('200')) {
            callbackObj.addResult(new TestResult('Sitemaps XML Check', UNNESTED, 'Sitemap found.'))
          } else {
            callbackObj.addResult(new TestResult('Sitemaps XML Check', UNNESTED, 'Sitemap not found!'))
          }
        }
      }
      http.open('GET', 'https://dev.shieldsarts.com/seo-report-scripts/existsTest.php?url=' + Base64.encode(url), true)
      http.send()
    }
  }

  // This function was taken from stackoverflow. It just encodes url strings into Base64 for use with getRequestGenerator.php
  var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

  // Add http:// to URLInput input by default.
  document.getElementById('URLInput').value = getCookie('url').length > 0 ? getCookie('url') : 'your-site.com'
  document.getElementById('URLInput').addEventListener('focusin', (e) => {
    e.currentTarget.value = ''
  })

  // Download the target web page and perform analysis
  document.getElementById('testButton').addEventListener('click', function() {
    startTest()
  })
  document.getElementById('URLInput').addEventListener('keypress', (e) => {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      startTest()
    }
  })

function startTest() {

  // Open modal
  document.getElementById('displayResultsButton').style.display = 'none' // Hide show results button
  document.getElementById('displayResultsButton').addEventListener('click', (e) => { // Allow show results button to close modal
    document.getElementById('emailResultsModal').style.display = 'none'
    document.getElementById('resultsDiv').style.display = 'block'
    // SEND EMAIL HERE
  })
  document.getElementById('emailResultsModal').style.display = 'block' // Show modal

  let url = encodeURI(document.getElementById('URLInput').value)
  // Download the target web page
  // Build the request URL and send it!
  // Execute JSONP request
  let http = new XMLHttpRequest()
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(http.responseText)
      analyze(http.responseText)
    }
  }
  http.open('GET', 'https://dev.shieldsarts.com/seo-report-scripts/getRequestGenerator.php?url=' + Base64.encode(url), true)
  http.send()
}

function analyze(htmlString) {
  setCookie('url', document.getElementById('URLInput').value)
  // Parse htmlString into a DOM element
  let page = document.createElement('div')
  page.innerHTML = htmlString

  // List of categories and tests
  // Each category should have 3 variables: a title, a css id corresponding to its results div, and a list of test names that correspond to functions in tests.js
  var categories = {
    general: new Category(
      'General', // Title that renders on the page
      'generalResults', // CSS ID
      page, // Always type page just like this
      [tests['mobileFriendliness'], tests['headings'], tests['keywords'], tests['altTags'], tests['linksWithinDomainName'], tests['viewport'], tests['microData'], tests['schema'], tests['siteMaps']] // List the tests
    ),
    whois: new Category(
      'Domain Registration Information',
      'whoisResults',
      page,
      [tests['whois']]
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

  // Execute each test
  Object.keys(categories).forEach(function(k) {
    let catFunction = categories[k].renderCategory.bind(categories[k])
    catFunction()
  })

  // Display the 'show results' button when tests complete
  let displayButtonFunction = setInterval(function() {
    if (categoriesDone === Object.keys(categories).length) {
      clearInterval(displayButtonFunction)
      document.getElementById('displayResultsButton').style.display = 'block' // Show 'Show Results' button
    }
  }, 500)
}
