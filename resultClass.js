/**
 * @Author: Jack Woods
 * @Date:   2019-03-14T12:15:38-07:00
 * @Email:  jackrwoods@gmail.com
 * @Filename: resultClass.js
 * @Last modified by:   Jack Woods
 * @Last modified time: 2019-03-14T16:26:24-07:00
 */
export const NESTED = true
export const UNNESTED = false

export class TestResult {
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

export class Category {
  constructor(title, id, page, tests) {
    this.title = title
    this.id = id
    this.page = page
    this.testNum = tests.length
    this.testResults = []
    tests.forEach(t => {
      test.execute(this.page, this.addResult)
    })
  }

  addResult(result) {
    this.testResults.push(result)
    testNum--
  }

  renderCategory() {
    let cat = document.getElementById(this.id)
    cat.getElementsByClassName('categoryTitle')[0].textContent = this.title
    tests.forEach((resElement, index) => {
      try {
        console.log(renderResult(resElement))
        this.testResults[index].renderResult(resElement)
      } catch(err) {
        console.log(err)
        console.log('This error may be caused by not having enough result elements on your page, or by having too many for category:' + this.title + '.')
      }
    })
  }
}
