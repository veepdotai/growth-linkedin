const { auth } = require('./service/linkedInAuth.js');
const { createUrl } = require('./service/serviceSearchUrl');
const { linkConnection } = require("./service/linkConnection");
const fs = require("fs");
const { waiting } = require("./service/waiting");

const user = JSON.parse(fs.readFileSync('./config/user.json', 'utf8'));
const service = JSON.parse(fs.readFileSync('./config/service.json', 'utf8'));
const username = user.myCredentials.username;
const password = user.myCredentials.password;
const linkedInServices = service.myServices;


(async () => {
    const page = await auth(username,password);
    await waiting();
    await page.waitForSelector('.search-global-typeahead__input');
    //number of page to get
    for (let i = 1; i < 6 ; i++) {
        //number of person to connect to (10/page)
        for (let j = 1; j < 11; j++) {
            await waiting();
            await linkConnection(page,createUrl(linkedInServices,i),j);
        }
    }

})();

