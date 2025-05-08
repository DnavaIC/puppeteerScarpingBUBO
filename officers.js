import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized'],
        defaultViewport: null
    });
    const page = await browser.newPage();

    console.log("opening page");
    await page.goto("https://gantt-qa.bubo.io/#/login");

    await page.click('button[type="button"]');
})();