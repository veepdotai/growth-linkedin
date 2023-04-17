const {profilesList} = require("./service/peopleDataScraping/postAnalysing");
const {arrayToCSV} = require("./service/peopleDataScraping/toCSV");
const { auth } = require('./service/linkedInAuthentication/linkedInAuth.js');
const fs = require("fs");

const config = JSON.parse(fs.readFileSync('./config/botconfig.json', 'utf8'));
const username = config.myCredentials.username;
const password = config.myCredentials.password;
let nbPerson = config.peopleNumber;
let url = config.myURLs.peopleScrapingURL;

if(nbPerson < 0){
    nbPerson = 0;
}

async function scraping(){
    const [page,browser] = await auth(username, password);
    const [data, title] = await profilesList(page,url,nbPerson);
    await arrayToCSV(data,title);
    await browser.close();
}

module.exports = { scraping }