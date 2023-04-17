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

    //adding of all the services' code from the botconfig.json file
    for (const key in services) {
        url += '"' + services[key] + '"';
        if (i<Object.keys(services).length-1){
            url += '%2C';
        }
        i++;
    }
    url += '%5D';
    return navigateUrl(url,nPage);
}

function navigateUrl(url,nPage){
    const regex = /&page=.[0-9]*/;
    const replacement = '&page='+nPage;
    if(regex.test(url)){
        return url.replace(regex,replacement);
    } else {
        return url+'&page='+nPage;
    }

}

function UrlWithoutAlreadyConnected(url){
    const regex = /&network=.{6,30}%5D/;
    const replacement = '&network=%5B%22S%22%2C%22O%22%5D';
    if(regex.test(url)){
        return url.replace(regex,replacement);
    } else {
        return url+'&network=%5B%22S%22%2C%22O%22%5D';
    }

}



module.exports = { createUrl, navigateUrl, UrlWithoutAlreadyConnected }