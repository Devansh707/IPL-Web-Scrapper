let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
let xlsx = require("xlsx");

// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";

function processSingleMatch(url) {
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

    for (let i = 0; i < bothinnigArr.length; i++) {
        let teamNameElem = searchTool(bothinnigArr[i]).find("h5");
        let teamName = teamNameElem.text();
        teamName = teamName.split("INNINGS")[0];//doubt
        teamName = teamName.trim();
        let opponentidx = i == 0 ? 1 : 0;
        let opponentName = searchTool(bothinnigArr[opponentidx]).find("h5").text();
        opponentName = opponentName.split("INNINGS")[0].trim();

        console.log("Team Name: ", teamName);
        console.log("Opponent Team Name: ", opponentName);
        let tablebats = searchTool(bothinnigArr[i]).find(".table");
        let batsBodyRows = searchTool(tablebats).find(".batsman tbody tr");
        // let batsBodyRows = searchTool(".table.batsman tbody tr");
        console.log(batsBodyRows.length);
        for (let j = 0; j < batsBodyRows.length; j++) {
            let numberofTDs = searchTool(batsBodyRows[j]).find("td");
            if (numberofTDs.length == 8) {
                let playerName = searchTool(numberofTDs[0]).text().trim();
                let runs = searchTool(numberofTDs[2]).text();
                let balls = searchTool(numberofTDs[3]).text();
                let fours = searchTool(numberofTDs[5]).text();
                let sixes = searchTool(numberofTDs[6]).text();

                console.log("Player Name: ", playerName + "\t", runs + "\t", balls + "\t", fours + "\t", sixes);//output doubt
                // console.log("Player Name: ", playerName + "\t", runs + "", balls + " ", fours + " ", sixes);//output doubt
                processPlayer(teamName, playerName, runs, balls, fours, sixes, opponentName);
            }
        }
        console.log("``````````````````````````````````````````````````````````````````````````````````");
    }
}

function processPlayer( teamName, playerName, runs, balls, fours, sixes, opponentName) {
    // folder check ?
        let obj = {
        teamName,
        playerName,
        runs, 
        balls,
        fours,
        sixes,
        opponentName
    }
        let dirPath = path.join(__dirname, teamName);
        if(fs.existsSync(dirPath) == false){
            fs.mkdirSync(dirPath);
        }
        // palyer check ? 
        let playerFilePath = path.join(dirPath, playerName + ".xlsx");
        let playerArray = [];
        if( fs.existsSync(playerFilePath) == false){
            playerArray.push(obj);
        }else{
            // append
            playerArray = excelReader(playerFilePath, playerName);
            playerArray.push(obj);
        }
        // write in the file
        // writeContent(playerFilePath, playerArray);
        excelWriter(playerFilePath, playerArray, playerName);
}
// function getContent(playerFilePath){
//     let content = fs.readFileSync(playerFilePath);
//     return JSON.parse(content);
// }
// function writeContent(playerFilePath, content) {
//     let jsonData = JSON.stringify(content);
//     return fs.writeFileSync(playerFilePath, jsonData);
// }

// function dirCreator(filePath) {
//     if (fs.existsSync(filePath) == false) {
//         fs.mkdirSync(filePath);
//     }
// }
function excelWriter(filePath, json, sheetName) {
    // Workbook creation
    let newWb = xlsx.utils.book_new();
    // converting json data to sheet
    let newWS = xlsx.utils.json_to_sheet(json);
    // creating sheet and putting data in it
    xlsx.utils.book_append_sheet(newWb, newWS, sheetName);
    xlsx.writeFile(newWb, filePath);
}
function excelReader(filePath, sheetName) {
    // read
    // read the workbook of plarticular player
    let wb = xlsx.readFile(filePath);
    //get the data from particular sheet in that wb 
    let excelData = wb.Sheets[sheetName];
    // sheet to json
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

module.exports = {
        processSingleMatch
    }