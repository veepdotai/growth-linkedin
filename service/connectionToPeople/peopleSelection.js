const {waiting} = require("../waiting");

/**
 * To select a specific person from a LinkedIn search
 * @param {Page} page - the browser page from puppeteer
 * @param {int} nPerson - the person we need to connect to (number from 1 to 10)
 * */
async function peopleSelection(page, nPerson) {
    let clicked = false;
    //searching for the ul container of all the people
    const listSelector = '.reusable-search__entity-result-list';
    await page.waitForSelector(listSelector);

    //clicking on the specified person to access profile
    const personSelector = listSelector + ' li:nth-child('+nPerson+')';
    let button = await page.$(personSelector + ' button > span');
    let nom = await page.$(personSelector + ' span.entity-result__title-text > a');
    let valueButton = '';
    if (button !== null){
        valueButton = (await page.evaluate(el => el.textContent, button)).trim();
    }
    let valueNom = (await page.evaluate(el => el.textContent, nom)).trim();

    console.log(valueNom);
    if (valueButton !=='En attente' && valueNom !=='Utilisateur LinkedIn'){
        await waiting();
        await page.click(personSelector+' a');
        clicked = true;
    }
    return clicked;
}

module.exports = { peopleSelection }