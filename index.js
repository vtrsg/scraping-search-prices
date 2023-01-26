import puppeteer from "puppeteer"
import { list, urls } from "./data/data.js"

async function scraping(url) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    console.log("iniciei")

    await page.goto(url)
    if (url == "https://www.mercadolivre.com.br/") {
        await page.waitForSelector("#cb1-edit")
        await page.type("#cb1-edit", "Smartphone xiaomi")
        await Promise.all([
            page.waitForNavigation(),
            page.click(".nav-search-btn")
        ])

        await page.click('[aria-label="Até R$ 1.000"]')

        await page.waitForSelector(".ui-search-result__image > a")
        const links = await page.$$eval(".ui-search-result__image > a", el => el.map(link => link.href))
        let a = 0
        for (const link of links) {
            if(a == 24) continue
            await page.goto(link)
            await page.waitForSelector(".ui-pdp-title")

            const title = await page.$eval(".ui-pdp-title", el => el.innerText)
            const price = await page.$eval(".andes-money-amount__fraction", el => el.innerText)

            const obj = {}
            obj.title = title
            obj.price = price
            obj.link = link
            list.push(obj)
            a++
        }
    }

    if (url == "https://www.amazon.com.br/") {
    await page.waitForSelector(".nav-input")
    await page.type(".nav-input", "Smartphone xiaomi")
    await Promise.all([
        page.waitForNavigation(),
        page.click("#nav-search-submit-button")
    ])

    await page.waitForSelector('[id="p_36/17270946011"]')
    await page.click('[id="p_36/17270946011"] > span > a')
    

     await page.waitForSelector(".a-link-normal")
      const links = await page.$$eval(".a-link-normal", el => el.map(link => link.href))
    let b = 0 
    for (const link of links) {
      if(b == 24) continue
        await page.goto(link)
        await page.waitForSelector("#productTitle")

        const title = await page.$eval("#productTitle", el => el.innerText)
        const price = await page.$eval(".a-price-whole", el => el.innerText)

        const obj = {}
        obj.title = title
        obj.price = price.slice(0,-2)
        obj.link = link
        list.push(obj)
        b++
    }
    
}
    list.reduce((a, b) => a.price - b.price)

    console.log(list)
    await page.waitForTimeout(3000)

    await browser.close()
}

for (let i = 0; i < urls.length; i++) {
    scraping(urls[i])
}