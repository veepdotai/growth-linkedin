/**
 * function to create an url like 'https://www.linkedin.com/search/results/people/?serviceCategory=%5B"{services_code}"%2C"....."%5D&page=_'
 * to have access to a custom list of people
 * @param {Object} services an object with LinkedIn services names as keys and their corresponding number
 * @param {int} nPage the number of the result page you want to go
 * @returns {string} url completed
 */
function createUrl(services,nPage){
    let url = 'https://www.linkedin.com/search/results/people/?serviceCategory=%5B';
    let i = 0;

    //adding of all the services' code from the service.json file
    for (const key in services) {
        url += '"' + services[key] + '"';
        if (i<Object.keys(services).length-1){
            url += '%2C';
        }
        i++;
    }
    url += '%5D&page='+nPage;
    return url;
}

function navigateUrl(url,nPage){
    url += '&page='+nPage;
    return url;
}

module.exports = { createUrl, navigateUrl }