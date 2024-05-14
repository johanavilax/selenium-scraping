const { Builder, By } = require('selenium-webdriver')
const fs = require('fs')
const path = require('path')
const { seleniumCron } = require('./cron')

let country = 'Spain'

async function runSelenium() {
  let citiesCountry = JSON.parse(fs.readFileSync(`documentos/citiesCountry_/${country}.json`))

  let driver = await new Builder().forBrowser('chrome').build()
  try {
    for (let city of citiesCountry) {
      if (!city.companies) {
        await driver.get(city.link_href)
        await driver.sleep(1000)
        let contentWrapper = await driver.findElement(By.css('.content-wrapper.clearfix'))
        let h2Elements = await contentWrapper.findElements(By.tagName('h2'))
        let ulElements = await contentWrapper.findElements(By.tagName('ul'))

        if (h2Elements.length > 0 && ulElements.length > 0) {
          let typeCompany = (await h2Elements[0].getText()).replace('agencies', '').trim()
          city.companies = []

          let liElements = await ulElements[0].findElements(By.tagName('li'))
          for (let liElement of liElements) {
            let aElement = await liElement.findElement(By.tagName('a'))
            let nameCompany = await aElement.getText()
            let link_href = await aElement.getAttribute('href')
            city.companies.push({ nameCompany, link_href, typeCompany })
          }

          await fs.writeFileSync(
            `documentos/citiesCountry_/${country}.json`,
            JSON.stringify(citiesCountry)
          )
          await driver.sleep(3500)
        }
      }
    }
  } finally {
    await driver.quit()
  }
}

seleniumCron(runSelenium)
