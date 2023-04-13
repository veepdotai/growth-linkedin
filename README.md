# growth-linkedin

## Installation Instructions

- Download node.js from https://nodejs.org/
- Open a console to test if node.js and is installed and see it version with this command    
        `node -v`
- Within the project use this command to download project libraries   
        `npm install`

## How to use

### LinkedIn Credentials

Before using scripts you need go to botconfig.json file to set your LinkedIn Account credentials in "myCredentials" category.

### Auto connect Script

#### Configuration

In botconfig.json file

- in "myServices" category, enter LinkedIn services you want in your search with their code
- or in "myURLs" category, put an url of yours at "peopleSearchingURL" ( need to be a LinkedIn search url focus on people )
- in "peopleNumber" category, put the number of people you want to connect to

#### Use

- Run the autoConnect.js file to use the bot when the config files are ready    
        `node autoConnect.js`

### People Data Scraping Script

#### Configuration

In botconfig.json file

- in "myURLs" category, put a post or search url at "peopleScrapingURL"
- in "peopleNumber" category, put the number of people you to scrap

#### Use

- Run the peopleDataScraping.js file to use the bot when the config files are ready    
  `node peopleDataScraping.js`
- a CSV file is created in the project's 'documents' repository