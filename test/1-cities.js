const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');

let country = "Spain";
let citiesCountry = [];

(async function example() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('https://moovitapp.com/index/es/transporte_p%C3%BAblico-Spain');
        await driver.sleep(1500);
        let links = await driver.findElements(By.css('.links-wrapper li a'));
        for (let link of links) {
            let innerHTML = await link.getAttribute('innerHTML');
            let innerText = await link.getAttribute('innerText');
            let id = await link.getAttribute('id');
            let href = await link.getAttribute('href');
            let timestamp = Date.now();
            let timestampISO = new Date().toISOString();
            citiesCountry.push({
                name_innerHTML: innerHTML,
                name_innerText: innerText,
                id: id,
                link_href: href,
                timestamp,
                timestampISO
            });
        }
        await driver.sleep(1500);
        fs.writeFileSync(`documentos/citiesCountry_/${country}.json`, JSON.stringify(citiesCountry));
    } finally {
        await driver.quit();
    }
})();
