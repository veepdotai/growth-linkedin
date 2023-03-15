const fs = require('fs');
function createUrl(services){
    let url = 'https://www.linkedin.com/search/results/people/?serviceCategory=%5B';
    let i = 0;

    for (const key in services) {
        url += '"' + services[key] + '"';
        if (i<Object.keys(services).length-1){
            url += '%2C';
        }
        i++;
    }
    url += '%5D';
    return url;
}

module.exports = { createUrl }
