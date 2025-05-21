import puppeteer from "puppeteer";
import dotenv from "dotenv";
import delay from "./utils/timeout.js";
import fs from "fs";

(async () => {

    // Locators
    const buboAccess = 'button[type="button"]'
    const corporateLogin = '::-p-aria([name="ICS-Corporate-Login"])'
    const emailInput = 'input[type="email"]'
    const passwdInput = 'input[name="passwd"]'
    const submitButton = '#idSIButton9'
    const loginMS = '.button_primary'
    const officerSwitch = 'button[role="switch"]'
    
    dotenv.config();
    // Browser settings
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized'],
        defaultViewport: null
    });

    // Start script 
    // Launching browser
    const page = await browser.newPage();

    // Screen 1 - Bubo access
    // Opening bubo gantt acces page
    console.log("opening page");
    await page.goto(process.env.BUBO_URL);

    // Screen 1
    // Clicking on the first login button
    console.log("Step 1: Click Bubo login button");
    
    await page.click(buboAccess);

    //Screen 2 - corporate login page
    // Clicking corporate login button
    console.log("Step 2: Click corporate login button");
    await page.locator(corporateLogin).click();

    //Screen 3 - MS login 
    //Filling login form
    console.log("Step 3: input email and password");
    await page.waitForSelector(emailInput,  {timeout: 5000});
    await page.type(emailInput, process.env.EMAIL);

    await page.waitForSelector(submitButton,  {timeout: 5000});
    await page.click(submitButton);

    console.log("    Wait for the page to render...");
    await delay(4000);
    
    await page.waitForSelector(passwdInput, {timeout: 5000});
    await page.type(passwdInput, process.env.PASSWRD);

    await page.waitForSelector(loginMS, {timeout: 5000});
    await page.click(loginMS);
    
    //Welcome to bubo
    console.log("    Welcome to Bubo home page")
    console.log("Step 4: toggle officer switch");
    await delay(25000);
    await page.click(officerSwitch);

    
    //await delay(6000);
    console.log("Step 5: getting officers list...");
    const officersName = await page.$$eval('.ant-list-items > div > div > div.ant-dropdown-trigger div > div', nodes =>
        nodes.map(node => node.innerText.trim())
    );


    const officersHours = await page.$$eval('.ant-list-items > div > div > div.text-center', nodes =>
        nodes.map(node => node.innerText.trim())
    )

    const officers = officersName.map((name, idx) => ({
    name: name.split('\n')[0], // Solo el nombre antes del salto de línea
    hours: officersHours[idx]
}));

fs.writeFileSync("officersList.json", JSON.stringify(officers, null, 2), "utf-8");
    
    console.log("Json file was created");
    await page.close();
    browser.close();
})();