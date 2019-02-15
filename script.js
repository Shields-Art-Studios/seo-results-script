/**
 * @Author: Jack Woods
 * @Date:   2019-02-13T08:11:58-08:00
 * @Email:  jackrwoods@gmail.com
 * @Filename: script.js
 * @Last modified by:   Jack Woods
 * @Last modified time: 2019-02-15T09:28:28-08:00
 * @Copyright 2019 Shields Art Studios
 */

// Create empty object for storing results
var results = {
  facebook: {
    url: '/dmoz_check',
    result: null
  },
  googlePlus: {
    url: '/google_plus_check', // API documentation has a typo. This is correct.
    result: null
  },
  linkedIn: {
    url: '/linkedin_check',
    result: null
  },
  xing: {
    url: '/xing_check',
    result: null
  },
  reddit: {
    url: '/reddit_check',
    result: null
  },
  pinterest: {
    url: '/pinterest_check',
    result: null
  },
  buffer: {
    url: '/buffer_check',
    result: null
  },
  stumbleupon: {
    url: '/stumbleupon_check',
    result: null
  },
  pageStatus: {
    url: '/pagestatus_check',
    result: null
  },
  alexa: {
    url: '/alexa_check',
    result: null
  },
  similarWeb: {
    url: '/similar_web_check',
    result: null
  },
  bingIndex: {
    url: '/bing_index_check',
    result: null
  },
  yahooIndex: {
    url: '/yahoo_index_check',
    result: null
  },
  linkAnalysis: {
    url: '/link_analysis_check',
    result: null
  },
  backlink: {
    url: '/backlink_check',
    result: null
  },
  googleSafeBrowser: {
    url: '/google_malware_check',
    result: null
  },
  mcafeeMalware: {
    url: '/mcafee_malware_check',
    result: null
  },
  avgMalware: {
    url: '/avg_malware_check',
    result: null
  },
  nortonMalware: {
    url: '/norton_malware_check',
    result: null
  },
  domainIP: {
    url: '/domain_ip_check',
    result: null
  },
  sitesInSameIP: {
    url: '/sites_in_same_ip_check',
    result: null
  }
}

// Create an array of the keys in the results object for iteration (in API requests)
let keys = Object.keys(results)

// This is super insecure, but a new API key can be regenerated if this one is compromised.
var apikey = '1-O9YeHfU15502387623kKWZdc' //'1-9IVDame1550072281DpwR4aC'

// Base URL for API requests
var baseURL = 'http://sitespy.xeroneit.net/native_api/' //'https://shieldsarts.com/seo-system/native_api'

// Sends an httpRequest to the SEO API and saves its response.
function sendRequest(url, keyIndex) {
  let http = new XMLHttpRequest()
  http.onreadystatechange = function() {
    if (http.readyState === 4 && http.status == 200) {
      // Request was successful!
      // Dereference the key index and save the API response
      results[keys[keyIndex]].result = JSON.parse(http.responseText)
      console.log(results)
    }
  }
  // Build the request URL and send it!
  http.open('GET', baseURL + results[keys[keyIndex]].url + '?api_key=' + apikey + '&domain=' + encodeURI(url))
  http.send()
}

var haveSentRequest = false // Set to true when the user requests for SEO results. If true, another request cannot be sent.

// Retrieve all elements with the SEOForm class
var forms = document.getElementsByClassName('SEOForm')

// Select the submit buttons and adda click event listeners.
for (let form of forms) {
  console.log(form)
  console.log(form.querySelector('button'))
  form.querySelector('button').addEventListener('click', (event) => {
    console.log('click!')
    // Select the input elements
    let inputs = document.getElementsByTagName('input')
    let website = null

    // Find the website input using (unfortunately) its only unique attribute: it's placeholder text.
    // Save its value
    for (let input of inputs) {
      if (input.getAttribute('placeholder') === 'Website') website = input.value
    }

    // Confirm that the user has not previously sent a request
    if (!haveSentRequest) {
      // Iterate over each request type
      keys.forEach((key, index) => {
        // Fire an API request asynchronously.
        sendRequest(website, index)
      })
    }
  })
}
