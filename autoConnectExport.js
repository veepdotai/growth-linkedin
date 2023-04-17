const { auth } = require('./service/linkedInAuthentication/linkedInAuth.js');
const { createUrl, navigateUrl, UrlWithoutAlreadyConnected} = require('./service/searchURLCreation');
const { connection } = require("./service/connectionToPeople/connection");
const { peopleSelection } = require("./service/connectionToPeople/peopleSelection");
const { waiting } = require("./service/waiting");

const fs = require("fs");

const config = JSON.parse(fs.readFileSync('./config/botconfig.json', 'utf8'));
const username = config.myCredentials.username;
const password = config.myCredentials.password;
const linkedInServices = config.myServices;
let url = config.myURLs.peopleSearchingURL;
let nbPerson = config.peopleNumber;

if(nbPerson < 0){
    nbPerson = 0;
}

async function connect(){
    const [page,browser] = await auth(username,password);
    let i = 1;
    let nbAddedPerson = 0;
    let pageNumber = 1;
    while(nbAddedPerson < nbPerson ){
        await waiting();
        if(url !== ""){
            // using the url from botconfig.json if indicated
            url = navigateUrl(url,pageNumber);
            url = UrlWithoutAlreadyConnected(url);
        } else {
            //using the default url
            url = createUrl(linkedInServices,pageNumber);
            url = UrlWithoutAlreadyConnected(url);
        }
        await page.goto(url);
        while(nbAddedPerson < nbPerson && i <= 10){
            await waiting();
            if (await peopleSelection(page,i)){
                if (await connection(page)){
                    nbAddedPerson++;
                }
                await page.goto(url);
            }
            i++;
        }
        pageNumber++;
    }
    await browser.close();
}

module.exports = { connect }