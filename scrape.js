const request = require('request');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');
let d = 'hello wsad (keflex) kasjdkjasd';

// data-list data-list-drugclass ddc-table-sortable

scrape().then(html => {


    let $ = cheerio.load(html);
    let druglist = $('.classdruglist a');
    console.log($('title').text());
    druglist.each((i, el) => {
        console.log($(el).text());
    })
});

// request('https://reference.medscape.com/drugs/cephalosporins-1st-generation',(err,response,html) => {

// if(!err && response.statusCode == 200){
//     let $ = cheerio.load(html);
//     let title = $('title').text();
//     console.log(title);
// }else{
//     console.log('something went wrong');
//     console.log(response);
//     console.log(response.statusCode);
// }

// });


async function scrape() {
    let res = await fetch('https://reference.medscape.com/drugs/cephalosporins-1st-generation');
    let body = await res.text();
    return body;
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

    return links;
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
async function getTheScientificNames(links) {

    for (let link of links) {
        let html = await loadLink(link);
        let $ = cheerio.load(html);
        let title = $('title').text();
        fs.appendFileSync('./cephalo.json', title);
    }

}


async function scrapeHeadlines() {
    let html = await loadLink('https://reference.medscape.com/drugs');

}