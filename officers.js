import puppeteer from "puppeteer";

(async () => {
    let browser;

    // inicializar browser 
    browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    page.setViewport({
        args: ['--start-maximized'],
        width: 1920,
        height: 1080,
        defaultViewport: null
    });

    // Chrome dev tools protocol
    const session = await page.createCDPSession();

    console.log("opening page")
    await page.goto("https://gantt-qa.bubo.io/#/login")

    await session.send("Browser.setWindowBounds", {
        windowId: 1,
        bounds: { windowState: "maximized" },
    })

    await page.click('button[type="button"]')
})();