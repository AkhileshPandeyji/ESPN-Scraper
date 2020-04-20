let fs = require("fs");

console.log("Before");

fs.readFile("example.html",function(err,content){

    console.log(content+"");

});

console.log("After");