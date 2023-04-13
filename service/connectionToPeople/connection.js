const { waiting } = require('../waiting.js');

/**
 * Automation of the LinkedIn connection with someone else
 * @param {Page} page - the browser page from puppeteer, it must be the current profile you want to connect to
 * */
async function connection(page) {

    //waiting for the page to load
    await page.waitForSelector('#main');
    await waiting();

    const ConnectButtonSelector = 'div.pv-top-card-v2-ctas div.pvs-profile-actions button.pvs-profile-actions__action [type="connect"]';
    const MoreButtonSelector = 'div.pv-top-card-v2-ctas div.pvs-profile-actions div:last-child button';

    //searching for the connect button
    if(await page.$(ConnectButtonSelector) !== null) {
        //on the page
        await page.click(ConnectButtonSelector);
    } else {
        //or in a drop-down menu
        await page.click(MoreButtonSelector);
        await waiting();
        //if not already connected
        if(await page.$('.ph5 div.pvs-overflow-actions-dropdown__content div [type="connect"]') !== null) {
            await page.click('.ph5 div.pvs-overflow-actions-dropdown__content div [type="connect"]');
        }
    }
}

module.exports = { connection }