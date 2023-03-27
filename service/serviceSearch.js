const {waiting} = require("./waiting");

/**
 * Automation of the LinkedIn Search of people
 * @param {Page} page - the browser page from puppeteer
 * @param {string} url - an url from linkedIn like 'https://www.linkedin.com/search/results/people/.....' with search parameters
 * @param {int} nPerson - the person we need to connect to (number from 1 to 10)
 * */
async function searchProfile(page, url,nPerson) {
    await page.goto(url);

    //searching for the ul container of all the people
    const listSelector = '.reusable-search__entity-result-list';
    await page.waitForSelector(listSelector);

    //clicking on the specified person to access profile
    await waiting();
    await page.click(listSelector + ' li:nth-child('+nPerson+') a');
}

module.exports = { searchProfile }