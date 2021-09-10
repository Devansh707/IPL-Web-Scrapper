let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
let scoreCardObj=require("./scorecard");
let xlsx = require("xlsx");

// let iplPath = path.join(__dirname, 'ipl');
// dirCreator(iplPath);

request(url, cb);
function cb(error, response, html) {
    if (error) {
        console.log("Error: " + error);
    } else if (response.statusCode == 0) {
        console.log("Page Not found ");
    } else {
        dataExtractor(html);
    }
}
function dataExtractor(html) {
    let searchTool = cheerio.load(html);
    let anchorrep = searchTool('a[data-hover="View All Results"]');
    let link = anchorrep.attr("href");
    // console.log(link);
    let fullAllmatchPageLink = `https://www.espncricinfo.com${link}`;
    // request(fullAllmatchPageLink, allMatchPageCb);
    request(fullAllmatchPageLink, allMatchPageCb);

}

function allMatchPageCb(error, response, html) {
    if (error) {
        console.log("Error: " + error);
    } else if (response.statusCode == 0) {
        console.log("Page Not found ");
    } else {
        // dataExtractor(html);
        getAllScoreCardLink(html);
    }
}
function getAllScoreCardLink(html) {
    let searchTool = cheerio.load(html);
    let scoreCardsArr = searchTool('a[data-hover="Scorecard"]');
    for (let i = 0; i < scoreCardsArr.length; i++) {
        let link = searchTool(scoreCardsArr[i]).attr("href");
        console.log("Link : ", link);

        let fullAllmatchPageLink = `https://www.espncricinfo.com${link}`;
        console.log("Full Link : ", fullAllmatchPageLink);
        scoreCardObj.processSingleMatch(fullAllmatchPageLink);
    }
}
// function dirCreator(filePath) {
//     if( fs.existsSync(filePath) == false ) {
//         fs.mkdirSync(filePath);
//     }
// }
