const { Builder, By } = require('selenium-webdriver')
const fs = require('fs')
const { seleniumCron } = require('./cron')

let country = 'Spain' // Debes establecer el país adecuado aquí
let initialDTempJson = JSON.parse(fs.readFileSync(`documentos/citiesCountry_/${country}.json`))

const findCompanyWithoutFile = companyArray => {
  for (const data of companyArray) {
    const companyWithoutFile = data.companies.find(company => !company.file)
    if (companyWithoutFile) {
      return companyWithoutFile
    }
  }
  return null
}

const findIndexByNameCompany = (companyArray, nameCompany) => {
  for (let i = 0; i < companyArray.length; i++) {
    const index = companyArray[i].companies.findIndex(
      company => company.nameCompany === nameCompany
    )
    if (index !== -1) {
      return { cityIndex: i, companyIndex: index }
    }
  }
  return null
}

async function runSelenium() {
  let driver = await new Builder().forBrowser('chrome').build()
  try {
    let company = findCompanyWithoutFile(initialDTempJson)
    if (company) {
      let { cityIndex, companyIndex } = findIndexByNameCompany(
        initialDTempJson,
        company.nameCompany
      )

      company.file = `c-${company.link_href.split('-').slice(-2).join('-')}`
      company.timestamp = Date.now()
      company.timestampISO = new Date().toISOString()
      initialDTempJson[cityIndex].companies[companyIndex] = company

      await fs.writeFileSync(
        `documentos/citiesCountry_/${country}.json`,
        JSON.stringify(initialDTempJson)
      )

      await driver.get(company.link_href)
      await driver.sleep(2000)

      // El resto del código para recopilar la información de las rutas y guardarla en el archivo JSON
    }
  } finally {
    await driver.quit()
  }
}

seleniumCron(runSelenium)
