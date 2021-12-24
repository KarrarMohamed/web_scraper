const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');


scrape('https://reference.medscape.com/drugs/herbals-supplements', 'herbals_supplements.json');


async function scrape(link, filename) {
    console.log('scraping has been started ...... please wait');
    let startTime = Date.now();
    let data = {};
    let html = await loadLink(link);
    let categoriesAndLinks = await getTheLinksAndTexts(html);
    // console.log(categoriesAndLinks);

    let { links, categories } = categoriesAndLinks;
    console.log(links);
    console.log(categories);
    console.log(links.length);
    console.log(categories.length);

    let scientificNames = [];
    let count = 0;
    for (let i = 0; i < links.length; i++) {
        let subHtml = await loadLink(links[i]);
        let subLinks = await getTheLinks(subHtml);
        scientificNames = await getTheScientificNames(subLinks);
        data[categories[i]] = scientificNames;
        console.log(`${++count} ...............................   completed `);
        scientificNames = [];
    }


    fs.writeFile(filename, JSON.stringify(data), (err) => {
        if (err) {
            console.log('Error : something went wrong');
            let endTime = Date.now();
            console.log(`time consumed = ${endTime - startTime} ms`);
        } else {
            console.log('Done ✔✔✔✔✔✔');
            console.log(`the link : (${link}) has been scraped and written to ${filename} file`);
            let endTime = Date.now();
            console.log(`time consumed = ${(endTime - startTime) / 60000} minutes`);
        }
    });

}



async function getTheLinksAndTexts(html) {
    let links = await getTheLinks(html);
    let categories = await getCategories(html);
    return { links, categories };
}



async function getTheScientificNames(links) {

    let scientificNames = [];
    for (let link of links) {
        let html = await loadLink(link);
        let $ = cheerio.load(html);
        let title = $('title').text().trim();


        if (title !== 'Page Not Found') {
            let names = $('.drug_section_link').text().trim();
            scientificNames.push(names);
        }
    }

    return scientificNames;

}

async function getCategories(html) {
    let $ = cheerio.load(html);
    let druglist = $('.classdruglist a');
    let categories = [];
    druglist.each((i, el) => {
        categories.push($(el).text());
    });
    return categories;
}

async function loadLink(link) {
    let res = await fetch(link);
    let body = await res.text();
    return body;
}


async function getTheLinks(html) {
    let $ = cheerio.load(html);
    let druglist = $('.classdruglist a');
    let links = new Set();

    druglist.each((i, el) => {
        links.add($(el).attr('href').trim());
    });

    return [...links];
}