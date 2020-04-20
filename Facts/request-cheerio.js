let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");

request(`https://www.espncricinfo.com/series/19322/scorecard/1187683`,function(err,res,html){

    if(err == null && res.statusCode==200){
        mostWickTaker(html);
    }
    else if(res.statusCode == 404){
        console.log("Invalid URL");
    }
    else{
        console.log(err);
        console.log(res.statusCode);
    }

});

let mostWickTaker = function(body){
    let $ = cheerio.load(body);
    let bowlers = $(".scorecard-section.bowling tbody tr");
    let mostWickets = 0;
    let mostWicketName = "";

    for(let i=0;i<bowlers.length;i++){
        let bowlerName = $(bowlers[i]).find("td a").text();
        let bowlerWickets = $($(bowlers[i]).find("td")[5]).text()
        if(bowlerWickets>mostWickets){
            mostWickets = bowlerWickets;
            mostWicketName = bowlerName;
        }
    }
    console.log("Most Wicket Taker =>");
    console.log(`${mostWicketName}  Wickets:${mostWickets}`);
}