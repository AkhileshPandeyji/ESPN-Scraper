let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");

request(`https://www.espncricinfo.com/series/19322/commentary/1187683`,function(err,res,html){

    if(err == null && res.statusCode==200){
        lastBallCmt(html);
    }
    else if(res.statusCode == 404){
        console.log("Invalid URL");
    }
    else{
        console.log(err);
        console.log(res.statusCode);
    }

});

let lastBallCmt = function(body){
    let $ = cheerio.load(body);
    let parsedHtml = $(".commentary-item .item-wrapper .description");
    let lbcText = $(parsedHtml[0]).text();
    console.log(lbcText);
}

