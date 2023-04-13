/**
 * Give a search url of the relatives of the profile's person
 * @param page currently browser page
 * @param url LinkedIn profile url
 * @returns {Promise<null>} search url of the relatives of the profile's person
 */
async function connectionProfilesUrl(page,url) {

    const connectionOfLink = 'div.ph5 li > a'
    let profilesUrl = null;

    await page.goto(url);
    await page.waitForSelector('.search-global-typeahead__input');
    if(await page.$(connectionOfLink)){
        profilesUrl = await page.evaluate(() => document.querySelector(connectionOfLink).href);
    }
    return profilesUrl;
}

module.exports = { connectionProfilesUrl }