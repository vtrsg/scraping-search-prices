import puppeteer from "puppeteer"


(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    console.log("iniciei")

    await page.goto("https://www.mercadolivre.com.br/")

    await page.waitForSelector("#cb1-edit")
    await page.type("#cb1-edit", "Smartphone xiaomi")
    await Promise.all([
        page.waitForNavigation(),
        page.click(".nav-search-btn")
    ])

    const links = await page.$$eval('.ui-search-result__image > a', el => el.map(link => link.href))
    const list = []

    for (const link of links) {
        await page.goto(link)
        await page.waitForSelector('.ui-pdp-title')

        const title = await page.$eval('.ui-pdp-title', el => el.innerText)
        const price = await page.$eval('.andes-money-amount__fraction', el => el.innerText)

        //função evaluete permite escrever códigos mais javascript puro, nesse caso o vendedor pode não existir por isso o uso dela
        const seller = await page.evaluate(() => {
            const el = document.querySelector('.ui-pdp-seller__link-trigger')
            if (!el) return null
            return el.innerText
        })

        const obj = {}
        obj.title = title
        obj.price = price
        { seller ? obj.seller = seller : "" }
        obj.link = link
        list.push(obj)

    }
    await page.waitForTimeout(3000)

    console.log(list)

    await browser.close()
})()