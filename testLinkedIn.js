const { auth } = require('./service/linkedInAuth.js');
const { createUrl } = require('./service/serviceSearchUrl');
const { linkConnection } = require("./service/linkConnection");
const fs = require("fs");

const user = JSON.parse(fs.readFileSync('./config/user.json', 'utf8'));
const service = JSON.parse(fs.readFileSync('./config/service.json', 'utf8'));
const username = user.myCredentials.username;
const password = user.myCredentials.password;
const linkedInServices = service.myServices;

(async () => {
    const page = await auth(username,password);
    await page.waitForSelector('.search-global-typeahead__input');
    await linkConnection(page,createUrl(linkedInServices));
})();