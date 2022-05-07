let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
  heartButtons[i].classList.add("unloved");
} // for loop


sendGetRequest("/getTwoVideos").then((video_list)=> {
    for (let i=0; i<2; i++) {
        addVideo(video_list[i].url, videoElmts[i]);
    }
}).then(loadTheVideos).catch((err)=>{console.log("ERROR", err);});


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
    