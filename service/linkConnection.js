
/**
 * Automation of the LinkedIn connection with someone else
 * @param {Page} page - the browser page from puppeteer
 * @param {string} url - an url from linkedIn like 'https://www.linkedin.com/search/results/people/.....' with search parameters
 * */
async function linkConnection(page, url) {
    //loading the page
    await page.goto(url);

    //searching for the ul container of all the people
    const listSelector = '.reusable-search__entity-result-list';
    await page.waitForSelector(listSelector);

    //clicking on the second person to access profile (have to be changed to be able to automate this part)
    await page.click(listSelector + ' li:nth-child(5)');

    //searching for the connection button
    await page.waitForSelector('div.pv-top-card-v2-ctas div.pvs-profile-actions button.pvs-profile-actions__action');
    await page.click('div.pv-top-card-v2-ctas div.pvs-profile-actions button.pvs-profile-actions__action');

    //need to find a global solution
    await page.waitForSelector('aria/Envoyer maintenant');
    await page.click('aria/Envoyer maintenant');
}

module.exports = { linkConnection }