#!/usr/local/bin/node

console.log("tarts");

// read document
const data = require('./sample.json')

//products bought
function lineItems(data){
    var li = []

    data.map((row) => {
        for (var i in row.line_items) {
            li.push(row.line_items[i]);
        }})

    productsJson = JSON.stringify(li);
    
    return productsJson
}

console.log(JSON.parse(lineItems(data))[0].name);
    // var li = []
    // for (var i in row.line_items) {
    //     // console.log(row.line_items[i].name)
    //     li.push(row.line_items[i].name)
    // }
    // return li
