const puppeteer =  require('puppeteer');
const { waiting } = require("../waiting.js");

/**
 * Automation of the LinkedIn Authentication
 * @param {string} username - LinkedIn account username
 * @param {string} password - LinkedIn account password
 * @return {Page} the browser page
 * */
async function auth(username,password){
    //browser launching
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({'Accept-Language': 'en'});
    await page.setViewport({width: 1080, height: 1000});
    await page.goto('https://www.linkedin.com/');

    //we add credentials in the form
    await page.reload();
    await page.waitForSelector('#session_key');
    await waiting();
    await page.type('#session_key', username);
    await waiting();
    await page.type('#session_password', password);
    await waiting();
    await page.keyboard.press('Enter');
    await page.waitForSelector('.search-global-typeahead__input');
    await waiting();
    return page;
}

module.exports = { auth }