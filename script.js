/**
 * @Author: Jack Woods
 * @Date:   2019-02-13T08:11:58-08:00
 * @Email:  jackrwoods@gmail.com
 * @Filename: script.js
 * @Last modified by:   Jack Woods
 * @Last modified time: 2019-02-18T23:19:39-08:00
 * @Copyright 2019 Shields Art Studios
 */

// Create empty object for storing results
var results = {
  facebook: {
    name: 'Facebook Likes:',
    url: '/dmoz_check',
    result: null
  },
  googlePlus: {
    name: 'Google Plus Likes:',
    url: '/google_plus_check', // API documentation has a typo. This is correct.
    result: null
  },
  linkedIn: {
    name: 'LinkedIn Shares:',
    url: '/linkedin_check',
    result: null
  },
  xing: {
    name: 'Xing Shares:',
    url: '/xing_check',
    result: null
  },
  reddit: {
    name: 'Reddit Posts:',
    url: '/reddit_check',
    result: null
  },
  pinterest: {
    name: 'Pinterest Shares:',
    url: '/pinterest_check',
    result: null
  },
  buffer: {
    name: 'Buffer Shares:',
    url: '/buffer_check',
    result: null
  },
  stumbleupon: {
    name: 'StumbleUpon shares:',
    url: '/stumbleupon_check',
    result: null
  },
  pageStatus: {
    name: 'Page Status:',
    url: '/pagestatus_check',
    result: null
  },
  alexa: {
    name: 'Alexa Compatibility:',
    url: '/alexa_check',
    result: null
  },
  similarWeb: {
    name: 'SimilarWeb Check:',
    url: '/similar_web_check',
    result: null
  },
  bingIndex: {
    name: 'Bing Index:',
    url: '/bing_index_check',
    result: null
  },
  yahooIndex: {
    name: 'Yahoo Index:',
    url: '/yahoo_index_check',
    result: null
  },
  linkAnalysis: {
    name: 'Link Analysis:',
    url: '/link_analysis_check',
    result: null
  },
  backlink: {
    name: 'Backlink Analysis:',
    url: '/backlink_check',
    result: null
  },
  googleSafeBrowser: {
    name: 'Google Safe Browser Check:',
    url: '/google_malware_check',
    result: null
  },
  mcafeeMalware: {
    name: 'McAfee Malware Check:',
    url: '/mcafee_malware_check',
    result: null
  },
  avgMalware: {
    name: 'AVG Malware Check:',
    url: '/avg_malware_check',
    result: null
  },
  nortonMalware: {
    name: 'Norton Malware Check:',
    url: '/norton_malware_check',
    result: null
  },
  domainIP: {
    name: 'IP Check:',
    url: '/domain_ip_check',
    result: null
  },
  sitesInSameIP: {
    name: 'Websites in the Same IP:',
    url: '/sites_in_same_ip_check',
    result: null
  }
}

// Progress bar status
var progress = 0

// Create an array of the keys in the results object for iteration (in API requests)
let keys = Object.keys(results)

// This is super insecure, but a new API key can be regenerated if this one is compromised.
var apikey = '1-dH1exZv1550098336TKUFrIJ'

// Base URL for API requests
var baseURL = 'https://shieldsarts.com/seo-system/native_api'

// Sends an httpRequest to the SEO API and saves its response.
function sendRequest(url, keyIndex) {
  let http = new XMLHttpRequest()
  http.onreadystatechange = function() {
    if (http.readyState === 4) {
      if (http.status !== 200) {
        results[keys[keyIndex]].error = http.responseText
      }
      // Add one to Progress
      progress++

      // Request was successful!
      // Dereference the key index and save the API response
      results[keys[keyIndex]].result = JSON.parse(http.responseText)
    }
  }
  // Build the request URL and send it!
  http.open('GET', baseURL + results[keys[keyIndex]].url + '?api_key=' + apikey + '&domain=' + encodeURI(url))
  http.send()
}

// Once results are downloaded, render them on screen
function renderResults() {
  let targetDiv = document.getElementById('resultsDiv')
  targetDiv.innerHTML = ''
  Object.values(results).forEach(v => {
    targetDiv.innerHTML += '<br /><b>' + v.name + '</b> ' + JSON.stringify(v.result)
  })
}

var haveSentRequest = false // Set to true when the user requests for SEO results. If true, another request cannot be sent.

document.getElementById('submit').addEventListener('click', function() {
  // Only send one request per visit
  if (!haveSentRequest) {
    // Retrieve input from user
    let url = encodeURI(document.getElementById('domainName').value)
    let name = encodeURI(document.getElementById('name').value)
    let email = encodeURI(document.getElementById('email').value)
    let phone = encodeURI(document.getElementById('phone').value)
    let usr = { url, name, email, phone }
    console.log(usr) // For debugging

    // Open the results modal
    document.getElementById('results').classList.add('is-active')

    // Iterate through each API call
    keys.forEach((key, index) => {
      // Fire an API request
      sendRequest(url, index)
    })

    // Begin to update the progress bar
    var progressInterval = setInterval(function() {
      console.log(progress/21 * 100) // for debugging
      document.getElementById('progressBar').setAttribute('value', progress / 21 * 100)

      if (progress/21 === 1) {
        clearInterval(progressInterval)
        document.getElementById('results').classList.remove('is-active')
        renderResults()
      }
    }, 1000)
  }
})
