// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});

sendGetRequest("/getWinner").then(function(res) {
    showWinningVideo(res.url);
}).catch((err)=>{console.log(err);});

// always shows the same hard-coded video.  You'll need to get the server to 
// compute the winner, by sending a 
// GET request to /getWinner,
// and send the result back in the HTTP response.

function showWinningVideo(winningUrl) {
  addVideo(winningUrl, divElmt);
  loadTheVideos();
}

async function sendGetRequest(url) {
  params = {
    method: 'GET', 
     };
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.json();
    return data;
  } else {
    throw Error(response.status);
  }
}