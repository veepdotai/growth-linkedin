const puppeteer =  require('puppeteer');
const { waiting } = require("./waiting.js");

/**
 * Automation of the LinkedIn authentication
 * @param {string} username - LinkedIn account username
 * @param {string} password - LinkedIn account password
 * @return {Page} the browser page
 * */
async function auth(username,password){
    //browser launching
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({'Accept-Language': 'en'});
    await page.goto('https://www.linkedin.com/');
    await page.setViewport({width: 1080, height: 1000});

    //we add credentials in the form
    await waiting();
    await page.type('#session_key', username);
    await waiting();
    await page.type('#session_password', password);
    await waiting();
    await page.keyboard.press('Enter');
    return page;
}

module.exports = { auth }