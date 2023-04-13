const { profilesList } = require("./postAnalysing.js");
const fs = require('fs');

/**
 * create a cvs file of data given
 * @param data array of object
 * @param title name of the future file
 */
async function arrayToCSV(data,title) {
    const keys = Object.keys(data[0]);
    const csvData = [keys.join(',')];
    for (const item of data) {
        const row = keys.map(key => item[key]);
        csvData.push(row.join(','));
    }
    const csvString = csvData.join('\n');

    fs.writeFile('../documents/profiles - '+title+'.csv', csvString, err => {
        if (err) {
            console.error('Error at the file creation : ', err);
            return;
        }
        console.log('file has been created with success !');
    });
}

module.exports = { arrayToCSV }




