const { waiting } = require('./waiting.js');

/**
 * Automation of the LinkedIn connection with someone else
 * @param {Page} page - the browser page from puppeteer
 * @param {string} url - an url from linkedIn like 'https://www.linkedin.com/search/results/people/.....' with search parameters
 * @param {int} nPerson - the person we need to connect to (number from 1 to 10)
 * */
async function linkConnection(page, url,nPerson) {
    //loading the page
    await page.goto(url);

    //searching for the ul container of all the people
    const listSelector = '.reusable-search__entity-result-list';
    await page.waitForSelector(listSelector);

    //clicking on the specified person to access profile
    await waiting();
    await page.click(listSelector + ' li:nth-child('+nPerson+')');

    /*//searching for the connection button
    await page.waitForSelector('div.pv-top-card-v2-ctas div.pvs-profile-actions button.pvs-profile-actions__action');
    await sleep();
    await page.click('div.pv-top-card-v2-ctas div.pvs-profile-actions button.pvs-profile-actions__action');

    //need to find a global solution to connect to someone, here is for the French LinkedIn
    await page.waitForSelector('aria/Envoyer maintenant');
    await sleep();
    await page.click('aria/Envoyer maintenant');*/
}

module.exports = { linkConnection }