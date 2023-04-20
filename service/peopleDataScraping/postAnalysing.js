const {waiting, waitingMore} = require("../waiting");

/**
 * Click on the 'more comments' button on a post to be able to see ALL the comments
 * @param {Page} page - the browser page from puppeteer, it must be a LinkedIn post
 */
async function allPostPeopleToSee(page){
    const moreButton = '.comments-comments-list__load-more-comments-button';
    while(await page.$('.comments-comments-list__show-previous-container')){
        await page.waitForSelector(moreButton);
        await page.click(moreButton);
        await waiting();
    }
}

/**
 * create 2 arrays with all people's names and profiles' URL of the post or the search
 * @param {Page} page - the browser page from puppeteer, it must be a LinkedIn post or a LinkedIn search page
 * @param {String} profilesSelector - a selector where profile's URLs are
 * @param {String} namesSelector - a selector where names are
 * @param {int} nbPerson - number of people we want to scrap
 * @return 2 string arrays of names and profile's URLs
 */
async function pagePeopleListing(page,profilesSelector,namesSelector,nbPerson){
    const data = await page.evaluate(
        (namesSelector) =>  Array.from(document.querySelectorAll(namesSelector))
            .map(elem => elem.innerText),namesSelector);

    const data2 = await page.evaluate(
        (profilesSelector) =>  Array.from(document.querySelectorAll(profilesSelector))
            .map(elem => elem.href),profilesSelector);
    let names = [...new Set(data)];
    names = names.slice(0, nbPerson);
    let profiles = [...new Set(data2)];
    profiles = profiles.slice(0, nbPerson);

    return [names,profiles]
}

/**
 * This function is used to differentiate a post from a search with many page
 * it use pagePeopleListing for each page
 * @param {Page} page - the browser page from puppeteer, it must be a LinkedIn post or a LinkedIn search page
 * @param {String} profilesSelector - a selector where profile's URLs are
 * @param {String} namesSelector - a selector where names are
 * @param {int} nbPerson - number of people we want to scrap
 * @param {String} url - LinkedIn search URL if it's a search
 * @return 2 string arrays of names and profile's URLs
 */
async function peopleListing(page,profilesSelector,namesSelector,nbPerson,url=''){

    const lastPageSelector = 'ul.artdeco-pagination__pages li:last-child'
    const pageElement = await page.$(lastPageSelector);
    if (pageElement) {
        let nbPages = await pageElement.evaluate( elem => parseInt(elem.innerText,10));

        let profiles = [];
        let names = [];
        let i = 1;
        let npRemainingPerson = nbPerson;

        while (i <=nbPages && npRemainingPerson > 0) {
            await page.goto(url+'&page='+i);
            await page.waitForSelector('.search-global-typeahead__input');
            await waiting();
            const [data,data2] = await pagePeopleListing(page,profilesSelector,namesSelector,nbPerson);
            names = [...names, ...data];
            profiles = [...profiles, ...data2];
            npRemainingPerson = nbPerson - names.length
            i++;
        }


        names = [...new Set(names)];
        profiles = [...new Set(profiles)];
        return [names,profiles];
    } else {
        return await pagePeopleListing(page,profilesSelector,namesSelector,nbPerson)
    }
}

/**
 * go to each profile in the list from the function peopleListing to scrap their contact details
 * @param {Page} page - the browser page from puppeteer, it must be a LinkedIn post or a LinkedIn search page
 * @param {String} url - LinkedIn search URL if it's a search
 * @param {int} nbPerson - number of people we want to scrap
 * @return an array of objects and a string - contacts details and the post title or a default title
 */
async function informationListing(page,url,nbPerson){
    const postTitleSelector = 'h2.update-components-article__title';
    const contactDetailsLink = '#top-card-text-details-contact-info';
    const websites = '.ci-websites a';
    const phone = '.ci-phone li span:first-child';
    const address = '.ci-address a';
    const email = '.ci-email a';
    const profileUrl = '.ci-vanity-url';
    const connectionDate = '[type="people-icon"] ~ div > span';

    const postProfilesSelector = 'div.comments-comments-list div.comments-post-meta__profile-info-wrapper > a';
    const postNamesSelector = 'div.comments-comments-list div.comments-post-meta__profile-info-wrapper > a span.comments-post-meta__name-text';
    const searchProfilesSelector = 'div.entity-result__item div.entity-result__content span.entity-result__title-text > a';
    const searchNamesSelector = 'div.entity-result__item div.entity-result__content span.entity-result__title-text > a > span > span:first-child';

    let names;
    let profiles;
    if(await page.$(postProfilesSelector)){
        [names,profiles] = await peopleListing(page,postProfilesSelector,postNamesSelector,nbPerson);
    }else{
        [names,profiles] = await peopleListing(page,searchProfilesSelector,searchNamesSelector,nbPerson,url);
    }

    let title = 'default filename';
    const postTitle = await page.$(postTitleSelector)
    if(postTitle){
        title = await postTitle.evaluate(elem => elem.innerText);
    }

    const result = [];
    for (let i = 0; i < profiles.length; i++) {
        const profileInfo = {
            'name': names[i],
            'profileUrl': profiles[i],
            'websites': '',
            'phone': '',
            'address': '',
            'email': '',
            'connectionDate': '',
            'info': '',
            'experiences': ''
        };
        result.push(profileInfo);
    }
    for (let i = 0; i < result.length; i++) {
        await page.goto(result[i].profileUrl);
        await waiting();
        await page.waitForSelector('.search-global-typeahead__input');

        await waiting();
        const experienceUrl = result[i].profileUrl + 'details/experience'
        await page.goto(experienceUrl);
        await waitingMore();
        await page.waitForSelector('.search-global-typeahead__input');

        const experienceElement = await page.$('main span:not(.visually-hidden)');
        if (experienceElement) {
            result[i].experiences = await experienceElement.evaluate(elem => elem.innerText);
        }

        await page.goto(result[i].profileUrl);
        await waiting();
        await page.waitForSelector('.search-global-typeahead__input');

        const info = await page.$('div.break-words');
        if(info){
            result[i].info = await info.evaluate(elem => elem.innerText);
        }

        const contactDetailsElement = await page.$(contactDetailsLink);
        if (contactDetailsElement) {
            await contactDetailsElement.click();
            await waitingMore();
            await page.waitForSelector(profileUrl);
            const websitesElement = await page.$(websites);
            if (websitesElement) {
                result[i].websites = await websitesElement.evaluate(elem => elem.href);
            }

            const phoneElement = await page.$(phone);
            if (phoneElement) {
                const phoneText = await phoneElement.evaluate(elem => elem.innerText);
                result[i].phone = phoneText.trim();
            }

            const addressElement = await page.$(address);
            if (addressElement) {
                const addressText = await addressElement.evaluate(elem => elem.innerText);
                result[i].address = addressText.trim();
            }

            const emailElement = await page.$(email);
            if (emailElement) {
                const emailText = await emailElement.evaluate(elem => elem.innerText);
                result[i].email = emailText.trim();
            }

            const connectionDateElement = await page.$(connectionDate);
            if (connectionDateElement) {
                const connectionDateText = await connectionDateElement.evaluate(elem => elem.innerText);
                result[i].connectionDate = connectionDateText.trim();
            }
        }
    }
    return [result, title];
}

/**
 * This function is used to scrape a LinkedIn post or a LinkedIn search page of the people's details
 * @param page currently browser page
 * @param url LinkedIn post LinkedIn search url
 * @param {int} nbPerson - number of people we want to scrap
 * @returns  array of object of people information , post title (if it exists, else a default one)
 */
async function profilesList(page, url,nbPerson){

    await page.goto(url);
    await page.waitForSelector('.search-global-typeahead__input');

    await allPostPeopleToSee(page);

    return await informationListing(page, url,nbPerson);
}

module.exports = { profilesList }