'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');


/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  return n;
}


/* start of code run on start-up */
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/compare.html");
});

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());

app.get("/getTwoVideos", function(req, res, next) {
    dumpTable().then(function(table) {
        let ind0 = getRandomInt(table.length);
        let ind1 = ind0;
        while (ind1 == ind0) {
            ind1 = getRandomInt(table.length);
        }
        res.send([table[ind0], table[ind1]]);
    }).catch((err)=>{res.send(err);});
});

app.post("/insertPref", function(req, res, next) {
    let ob = req.body;
    db.run("insert into PrefTable (better,worse) values (?,?)", [ob.better, ob.worse]).then(()=>{
        dumpPrefTable().then((tab)=>{
            console.log(tab);
            if (tab.length < 15) {
                res.send("continue");
            } else {
                res.send("pick winner");
            }
        });
    }).catch((err)=>{res.send(err);});
});


app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
  // change parameter to "true" to get it to computer real winner based on PrefTable 
  // with parameter="false", it uses fake preferences data and gets a random result.
  // winner should contain the rowId of the winning video.
  let winner = await win.computeWinner(8, false);
  console.log(winner);
  let table = await dumpTable();
  // you'll need to send back a more meaningful response here.
  res.json(table[winner]);
  } catch(err) {
    res.status(500).send(err);
  }
});


// Page not found
app.use(function(req, res){
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});


// an async function to get the whole contents of the database 
async function dumpTable() {
    const sql = "select * from VideoTable";
  
    let result = await db.all(sql);
    return result;
}

async function dumpPrefTable() {
    const sql = "select * from PrefTable";
  
    let result = await db.all(sql);
    return result;
}