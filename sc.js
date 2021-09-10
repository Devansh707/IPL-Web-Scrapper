let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");

let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";

function processScoreCard(url){
    request(url, cb);
}

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
    let bothinnigArr = searchTool(".Collapsible");
    console.log(bothinnigArr.length);
    for(let i = 0; i < bothinnigArr.length; i++) {
        let teamnameElem = searchTool(bothinnigArr[i]).find("h5");
        let teamname = teamnameElem.text();
        teamname = teamname.split("INNINGS")[0];
        teamname = teamname.trim();
        console.log("Team Name: " + teamname);
        let batsmanAllRows = searchTool(bothinnigArr[i]).find(".table.batsman tbody tr");
        for(let j = 0; j < batsmanAllRows.length; j++){
            let numberTDs = searchTool(batsmanAllRows[j]).find("td");
            // console.log("TD = ", numberTDs.length);
            if ( numberTDs.length == 8 ){
                // console.log("you are hero");
                let playername = searchTool(numberTDs[0]).text();
                let runs = searchTool(numberTDs[2]).text();
                let balls = searchTool(numberTDs[3]).text();
                let fours = searchTool(numberTDs[5]).text();
                let sixes = searchTool(numberTDs[6]).text();
                console.log("Player Name : ", playername, "\t", runs, "", balls, "", fours, "", sixes);
            }
        }
    }
}

module.exports = {
    processScoreCard
}