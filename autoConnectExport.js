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
    const page = await auth(username,password);
    let i = 0;
    let pageNumber = 1;
    while(i < nbPerson ){
        await waiting();
        if(url !== ""){
            // using the url from botconfig.json if indicated
            url = navigateUrl(url,pageNumber);
            url = UrlWithoutAlreadyConnected(url);
            await peopleSelection(page,url,i+1);
        } else {
            //using the default url
            url = createUrl(linkedInServices,pageNumber);
            url = UrlWithoutAlreadyConnected(url);
            await peopleSelection(page,createUrl(linkedInServices,pageNumber),i+1);
        }
        await connection(page);
        i++;
        pageNumber = parseInt((i/10))+1;
    }
}

module.exports = { connect }