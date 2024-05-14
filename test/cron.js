const cron = require('node-cron')
let selenium_working = false
const seleniumCron = async fun => {
  await fs.writeFileSync(`documentos/finish.json`, JSON.stringify({ finish: false }))

  cron.schedule('*/50 * * * * *', async () => {
    let finish = await fs.readFileSync(`documentos/finish.json`, 'utf8')
    if (JSON.parse(finish).finish) {
      return
    }

    if (!selenium_working) {
      selenium_working = true
      await fun()
      console.log('Selenium ha finalizado')
      selenium_working = false
    }
  })
}
module.exports = { seleniumCron }
