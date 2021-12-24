const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');

//const directListClass = 'data-list data-list-drugclass ddc-table-sortable';

scrapeDrugsDotCom();
async function loadLink(link) {
    let res = await fetch(link);
    let body = await res.text();
    return body;
}


async function parseHeadlines() {
    const headlinesHtml = await loadLink('https://www.drugs.com/drug-classes.html');
    const $ = cheerio.load(headlinesHtml);
    const headlines = $('.col-list-az a');
    const items = [];
    let item;
    headlines.each((i, element) => {
        item = {
            'name': $(element).text(),
            'href': 'https://www.drugs.com' + $(element).attr('href'),
        };
        items.push(item);
        item = null;
    });
    return items;
}

async function fetchItem(items) {


    console.log(items[23].href);
    console.log(items[23].name);
    let itemHtml = await loadLink(items[23].href);
    let $ = cheerio.load(itemHtml);

    if ($('.ddc-table-sortable').text() == '') {
        let subHeadlines = [];
        console.log('no direct list');
       $('.see-also li').each((i,ele) => {
           subHeadlines.push({
               'name' : $(ele).text(),
               'href' : $(ele).children('a').attr('href')
           });
       });

       for (let subHeadline of subHeadlines){
           await getSubItems(subHeadline.name,subHeadline.href);
       }
    } else {
        console.log('there is a direct list');
        $('.ddc-table-sortable a:nth-child(2)').each((i, el) => {

            console.log({
                'name': $(el).text(),
                'href': $(el).attr('href')
            });
            console.log('=============================\n');
        });
    }
// #content > div.contentBox > div.responsive-table-wrap > table > tbody



}



async function scrapeDrugsDotCom() {
    let items = await parseHeadlines();
    await fetchItem(items);
}



async function getSubItems(category,url){
    let html = await loadLink(url);
    let $ = cheerio.load(html);

}


async function getDirectList(document){

    let $ = cheerio.load(document);
}