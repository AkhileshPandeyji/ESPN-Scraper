let request = require("request");
let cheerio = require("cheerio");
let path = require("path");
let fs = require("fs");


request("https://www.espncricinfo.com/scores/series/19322",function(err,res,html){

    if(err == null && res.statusCode == 200){
        runsInSeries(html);
    }
    else if(res.statusCode == 404){
        console.log("Invalid URL");
    }
    else{
        console.log(err);
        console.log(res.statusCode);
    }

});

let leaderboard = [];
let gcount =0;

let runsInSeries = function(body){

    let $ = cheerio.load(body);
    let cards = $(".cscore.cscore--final.cricket.cscore--watchNotes");
    let espnHref = "https://www.espncricinfo.com";

    
    for(let i=0;i<cards.length;i++){
        let cardTitle = $(cards[i]).find(".cscore_info-overview").text();
        if(cardTitle.includes("T20I") || cardTitle.includes("ODI")){
            let scHref = $($(cards[i]).find(".cscore_buttonGroup a")).attr("href");
            let fHref = espnHref+scHref;
            visitPage(fHref);
        }
    }
}

let visitPage = function(link){
    gcount++;
    request(link,function(err,res,html){
        if(err == null && res.statusCode == 200){
            saveResults(html);
            gcount--;
            if(gcount==0){
                console.table(leaderboard);
            }
        }
        else{
            console.log(err);
            console.log(res.statusCode);
        }
    });
}

let saveResults = function(body){
    let c = cheerio.load(body);

    let format = c(".cscore.cscore--final.cricket .cscore_overview .cscore_info-overview").html();
    format = format.includes("ODI")?"ODI":"T20I";

    let innings = c(".sub-module.scorecard");
    let teams = c(".sub-module.scorecard h2");

    //console.log(format);

    for(let i=0;i<innings.length;i++){
        let team = c(teams[i]).text();
        team = team.substring(0,team.length-8);
        //console.log(team);
        let batsmenRows = c(innings[i]).find(".scorecard-section.batsmen .flex-row .wrap.batsmen");
        for(let br=0;br<batsmenRows.length;br++){
            let batsmenName = c(c(batsmenRows[br]).find(".cell.batsmen a")).text();
            let batsmenRuns = c(c(c(batsmenRows[br]).find(".cell.runs"))[0]).text();
            handlePlayer(format,team,batsmenName,batsmenRuns);
        }
    }
}



let handlePlayer = function(format,team,batsmenName,batsmenRuns){
    batsmenRuns = Number(batsmenRuns);

    for(let i=0;i<leaderboard.length;i++){
        let pObj = leaderboard[i];
        if(pObj.Name == batsmenName && pObj.Format == format){
            pObj.Runs += batsmenRuns;
            return;
        }
    }
    
    let obj = {
        Name:batsmenName,
        Team:team,
        Format:format,
        Runs:batsmenRuns
    }
    leaderboard.push(obj);
}