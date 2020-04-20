let fs = require("fs");

console.log("Before");

let content = fs.readFileSync("example.html","utf8");

console.log(content+"");

console.log("After");